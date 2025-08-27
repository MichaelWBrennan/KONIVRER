const AWS = require("aws-sdk");

const kinesis = new AWS.Kinesis();
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    let records = [];

    if (event.body) {
      const body = JSON.parse(event.body);
      records = Array.isArray(body) ? body : [body];
    }

    const processedEvents = [];

    for (const record of records) {
      const onboardingEvent = {
        eventType: "onboarding",
        timestamp: new Date().toISOString(),
        userId: record.userId,
        milestoneType: record.milestoneType,
        stepNumber: record.stepNumber || 0,
        totalSteps: record.totalSteps || 0,
        metadata: {
          milestoneId: record.milestoneId,
          milestoneName: record.milestoneName,
          completionTime: record.completionTime,
          timeSpent: record.timeSpent || 0,
          source: record.source || "web",
          userAgent: record.userAgent,
          sessionId: record.sessionId,
          previousStep: record.previousStep,
          skipped: record.skipped || false,
          helpUsed: record.helpUsed || false,
          errorEncountered: record.errorEncountered || false,
          customData: record.customData || {},
        },
      };

      // Determine milestone category and progression
      const milestoneCategories = {
        profile_setup: [
          "profile_created",
          "profile_completed",
          "avatar_uploaded",
        ],
        first_interaction: ["first_login", "dashboard_viewed", "first_click"],
        feature_discovery: [
          "feature_tutorial_started",
          "feature_tutorial_completed",
          "tooltip_viewed",
        ],
        integration_setup: [
          "integration_connected",
          "webhook_configured",
          "api_key_created",
        ],
        first_success: [
          "first_merge",
          "first_deployment",
          "first_collaboration",
        ],
        advanced_features: [
          "advanced_feature_used",
          "custom_workflow_created",
          "automation_enabled",
        ],
      };

      // Add progression tracking
      const category = Object.keys(milestoneCategories).find((cat) =>
        milestoneCategories[cat].includes(record.milestoneType)
      );

      if (category) {
        onboardingEvent.metadata.category = category;
        onboardingEvent.metadata.categoryProgress = calculateCategoryProgress(
          record.userId,
          category,
          milestoneCategories[category]
        );
      }

      // Add to Kinesis stream for real-time processing
      const kinesisParams = {
        StreamName: process.env.KINESIS_STREAM_NAME,
        Data: JSON.stringify(onboardingEvent),
        PartitionKey: record.userId,
      };

      await kinesis.putRecord(kinesisParams).promise();

      // Store milestone completion in DynamoDB
      const dynamoParams = {
        TableName: process.env.TABLE_NAME,
        Item: {
          configKey: `onboarding:${record.userId}:${record.milestoneType}`,
          timestamp: Date.now(),
          data: onboardingEvent,
          ttl: Math.floor(Date.now() / 1000) + 180 * 24 * 60 * 60, // 6 months TTL
        },
      };

      await dynamodb.put(dynamoParams).promise();

      // Track user journey progression
      await updateUserJourney(record.userId, onboardingEvent);

      processedEvents.push(onboardingEvent);
    }

    console.log(`Processed ${processedEvents.length} onboarding events`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "Onboarding events processed successfully",
        processedCount: processedEvents.length,
      }),
    };
  } catch (error) {
    console.error("Error processing onboarding events:", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Failed to process onboarding events",
        details: error.message,
      }),
    };
  }
};

async function calculateCategoryProgress(userId, category, milestones) {
  try {
    // Query DynamoDB to get user's completed milestones for this category
    const params = {
      TableName: process.env.TABLE_NAME,
      FilterExpression:
        "begins_with(configKey, :prefix) AND contains(configKey, :userId)",
      ExpressionAttributeValues: {
        ":prefix": "onboarding:",
        ":userId": userId,
      },
    };

    const result = await dynamodb.scan(params).promise();

    const completedMilestones = result.Items.map(
      (item) => item.data.milestoneType
    ).filter((milestone) => milestones.includes(milestone));

    return {
      completed: completedMilestones.length,
      total: milestones.length,
      percentage: Math.round(
        (completedMilestones.length / milestones.length) * 100
      ),
      remaining: milestones.filter((m) => !completedMilestones.includes(m)),
    };
  } catch (error) {
    console.error("Error calculating category progress:", error);
    return {
      completed: 0,
      total: milestones.length,
      percentage: 0,
      remaining: milestones,
    };
  }
}

async function updateUserJourney(userId, onboardingEvent) {
  try {
    const journeyKey = `user_journey:${userId}`;

    // Get existing journey data
    const getParams = {
      TableName: process.env.TABLE_NAME,
      Key: {
        configKey: journeyKey,
        timestamp: 0, // Use 0 for the main journey record
      },
    };

    let journeyData = {
      stages: [],
      currentStage: "getting_started",
      completedMilestones: [],
    };

    try {
      const existingJourney = await dynamodb.get(getParams).promise();
      if (existingJourney.Item) {
        journeyData = existingJourney.Item.data;
      }
    } catch (getError) {
      // If no existing journey, start with default
      console.log("No existing journey found, creating new one");
    }

    // Add new milestone
    journeyData.completedMilestones.push({
      milestone: onboardingEvent.milestoneType,
      timestamp: onboardingEvent.timestamp,
      category: onboardingEvent.metadata.category,
    });

    // Update current stage based on milestones
    journeyData.currentStage = determineCurrentStage(
      journeyData.completedMilestones
    );

    // Update DynamoDB
    const updateParams = {
      TableName: process.env.TABLE_NAME,
      Item: {
        configKey: journeyKey,
        timestamp: 0,
        data: journeyData,
        ttl: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60, // 1 year TTL
      },
    };

    await dynamodb.put(updateParams).promise();
  } catch (error) {
    console.error("Error updating user journey:", error);
  }
}

function determineCurrentStage(completedMilestones) {
  const milestoneTypes = completedMilestones.map((m) => m.milestone);

  // Define stage progression logic
  if (milestoneTypes.includes("advanced_feature_used")) {
    return "power_user";
  } else if (
    milestoneTypes.includes("first_merge") ||
    milestoneTypes.includes("first_deployment")
  ) {
    return "productive_user";
  } else if (milestoneTypes.includes("feature_tutorial_completed")) {
    return "active_user";
  } else if (milestoneTypes.includes("profile_completed")) {
    return "setup_complete";
  } else {
    return "getting_started";
  }
}
