const AWS = require("aws-sdk");

const kinesis = new AWS.Kinesis();
const dynamodb = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

exports.handler = async (event) => {
  console.log(
    "Anomaly detection function triggered:",
    JSON.stringify(event, null, 2)
  );

  try {
    let processedRecords = 0;
    let detectedAnomalies = 0;

    // Handle scheduled invocation (every 5 minutes)
    if (event.source === "aws.events") {
      console.log("Running scheduled anomaly detection");
      const anomalies = await runScheduledDetection();
      detectedAnomalies = anomalies.length;

      for (const anomaly of anomalies) {
        await processAnomaly(anomaly);
      }
    }

    // Handle Kinesis stream events
    if (event.Records && event.Records.length > 0) {
      console.log(`Processing ${event.Records.length} Kinesis records`);

      for (const record of event.Records) {
        try {
          const data = JSON.parse(
            Buffer.from(record.kinesis.data, "base64").toString()
          );
          await processKinesisRecord(data);
          processedRecords++;
        } catch (recordError) {
          console.error("Failed to process Kinesis record:", recordError);
        }
      }
    }

    console.log(
      `Anomaly detection completed. Processed: ${processedRecords}, Detected: ${detectedAnomalies}`
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Anomaly detection completed",
        processedRecords,
        detectedAnomalies,
      }),
    };
  } catch (error) {
    console.error("Error in anomaly detection:", error);

    // Send error alert
    await sendAlert({
      severity: "critical",
      metric: "anomaly_detection_service",
      description: `Anomaly detection service failed: ${error.message}`,
      context: { error: error.message, timestamp: new Date().toISOString() },
    });

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Anomaly detection failed",
        details: error.message,
      }),
    };
  }
};

async function runScheduledDetection() {
  const anomalies = [];
  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

  // Define metrics to monitor
  const metrics = [
    { name: "user_signups", threshold: 2.0, window: 5 },
    { name: "error_events", threshold: 3.0, window: 5 },
    { name: "response_time", threshold: 1.5, window: 5 },
    { name: "billing_failures", threshold: 2.5, window: 10 },
    { name: "merge_conflicts", threshold: 2.0, window: 10 },
  ];

  for (const metric of metrics) {
    try {
      const anomaly = await detectMetricAnomaly(metric, fiveMinutesAgo, now);
      if (anomaly) {
        anomalies.push(anomaly);
      }
    } catch (error) {
      console.error(`Failed to detect anomaly for ${metric.name}:`, error);
    }
  }

  return anomalies;
}

async function detectMetricAnomaly(metric, startTime, endTime) {
  // Get current metric value
  const currentValue = await getMetricValue(metric.name, startTime, endTime);

  // Get historical baseline (last 7 days, same time window)
  const baseline = await getHistoricalBaseline(metric.name, metric.window);

  if (baseline.mean === 0 || baseline.stdDev === 0) {
    return null; // Insufficient data
  }

  // Calculate z-score
  const zScore = Math.abs(currentValue - baseline.mean) / baseline.stdDev;
  const deviationPercentage =
    ((currentValue - baseline.mean) / baseline.mean) * 100;

  if (zScore > metric.threshold) {
    const anomalyType = currentValue > baseline.mean ? "spike" : "drop";
    const severity = calculateSeverity(zScore, Math.abs(deviationPercentage));

    return {
      metric: metric.name,
      anomalyType,
      currentValue,
      expectedValue: baseline.mean,
      deviationPercentage: Math.abs(deviationPercentage),
      severity,
      zScore,
      detectionTime: endTime.toISOString(),
      description: `${
        metric.name
      } ${anomalyType} detected: ${currentValue.toFixed(
        2
      )} vs expected ${baseline.mean.toFixed(2)}`,
    };
  }

  return null;
}

async function getMetricValue(metricName, startTime, endTime) {
  // This would query your actual metrics storage (DynamoDB, CloudWatch, etc.)
  // For now, simulate based on metric type
  switch (metricName) {
    case "user_signups":
      return Math.random() * 100; // 0-100 signups per 5 minutes
    case "error_events":
      return Math.random() * 20; // 0-20 errors per 5 minutes
    case "response_time":
      return 100 + Math.random() * 200; // 100-300ms average
    case "billing_failures":
      return Math.random() * 5; // 0-5 failures per 10 minutes
    case "merge_conflicts":
      return Math.random() * 10; // 0-10 conflicts per 10 minutes
    default:
      return Math.random() * 50;
  }
}

async function getHistoricalBaseline(metricName, windowMinutes) {
  // Query historical data from DynamoDB or CloudWatch
  // For simulation, return reasonable baselines
  const baselines = {
    user_signups: { mean: 25, stdDev: 8 },
    error_events: { mean: 3, stdDev: 2 },
    response_time: { mean: 150, stdDev: 30 },
    billing_failures: { mean: 1, stdDev: 0.8 },
    merge_conflicts: { mean: 2, stdDev: 1.2 },
  };

  return baselines[metricName] || { mean: 10, stdDev: 3 };
}

function calculateSeverity(zScore, deviationPercentage) {
  if (zScore > 4 || deviationPercentage > 100) {
    return "critical";
  } else if (zScore > 3 || deviationPercentage > 50) {
    return "high";
  } else if (zScore > 2.5 || deviationPercentage > 25) {
    return "medium";
  } else {
    return "low";
  }
}

async function processKinesisRecord(data) {
  // Real-time anomaly detection on streaming data
  console.log(
    "Processing Kinesis record for real-time anomaly detection:",
    data.eventType
  );

  // Check for immediate anomalies (e.g., multiple failures from same user)
  if (
    data.eventType === "billing" &&
    data.metadata &&
    data.metadata.status === "failed"
  ) {
    const recentFailures = await checkRecentFailures(data.userId);
    if (recentFailures >= 3) {
      await processAnomaly({
        metric: "billing_failures_per_user",
        anomalyType: "spike",
        currentValue: recentFailures,
        expectedValue: 1,
        deviationPercentage: (recentFailures - 1) * 100,
        severity: "high",
        description: `User ${data.userId} has ${recentFailures} consecutive billing failures`,
        userId: data.userId,
      });
    }
  }
}

async function checkRecentFailures(userId) {
  // Query recent billing failures for this user
  // For simulation, return random number
  return Math.floor(Math.random() * 5);
}

async function processAnomaly(anomaly) {
  try {
    // Store anomaly in DynamoDB
    const anomalyRecord = {
      TableName: process.env.TABLE_NAME,
      Item: {
        configKey: `anomaly:${Date.now()}:${anomaly.metric}`,
        timestamp: Date.now(),
        data: {
          ...anomaly,
          id: generateAnomalyId(),
          status: "active",
          createdAt: new Date().toISOString(),
        },
        ttl: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days TTL
      },
    };

    await dynamodb.put(anomalyRecord).promise();

    // Send alert if severity is medium or higher
    if (["medium", "high", "critical"].includes(anomaly.severity)) {
      await sendAlert(anomaly);
    }

    console.log(`Processed anomaly: ${anomaly.metric} - ${anomaly.severity}`);
  } catch (error) {
    console.error("Failed to process anomaly:", error);
    throw error;
  }
}

async function sendAlert(anomaly) {
  try {
    const message = formatAlertMessage(anomaly);

    // Send to Slack
    if (process.env.SLACK_WEBHOOK_URL) {
      await sendSlackAlert(message, anomaly);
    }

    // Send SNS notification for email alerts
    if (process.env.EMAIL_SNS_TOPIC) {
      await sns
        .publish({
          TopicArn: process.env.EMAIL_SNS_TOPIC,
          Message: message,
          Subject: `Anomaly Alert: ${
            anomaly.metric
          } - ${anomaly.severity.toUpperCase()}`,
          MessageAttributes: {
            severity: {
              DataType: "String",
              StringValue: anomaly.severity,
            },
            metric: {
              DataType: "String",
              StringValue: anomaly.metric,
            },
          },
        })
        .promise();
    }
  } catch (error) {
    console.error("Failed to send alert:", error);
  }
}

function formatAlertMessage(anomaly) {
  return `🚨 Anomaly Detection Alert

Metric: ${anomaly.metric}
Type: ${anomaly.anomalyType || "threshold_breach"}
Severity: ${anomaly.severity.toUpperCase()}
Current Value: ${anomaly.currentValue}
Expected Value: ${anomaly.expectedValue}
Deviation: ${anomaly.deviationPercentage.toFixed(1)}%

Description: ${anomaly.description}

Time: ${anomaly.detectionTime || new Date().toISOString()}`;
}

async function sendSlackAlert(message, anomaly) {
  try {
    const webhook = process.env.SLACK_WEBHOOK_URL;
    if (!webhook) return;

    const payload = {
      text: "🚨 Anomaly Detection Alert",
      attachments: [
        {
          color: getSeverityColor(anomaly.severity),
          title: `${anomaly.metric} anomaly detected`,
          text: anomaly.description,
          fields: [
            {
              title: "Current Value",
              value: anomaly.currentValue.toString(),
              short: true,
            },
            {
              title: "Expected Value",
              value: anomaly.expectedValue.toString(),
              short: true,
            },
            {
              title: "Deviation",
              value: `${anomaly.deviationPercentage.toFixed(1)}%`,
              short: true,
            },
            {
              title: "Severity",
              value: anomaly.severity.toUpperCase(),
              short: true,
            },
          ],
          footer: "Automerge Analytics",
          ts: Math.floor(Date.now() / 1000),
        },
      ],
    };

    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Slack webhook failed: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Failed to send Slack alert:", error);
  }
}

function getSeverityColor(severity) {
  const colors = {
    critical: "#ff0000",
    high: "#ff8c00",
    medium: "#ffa500",
    low: "#ffff00",
  };
  return colors[severity] || "#36a64f";
}

function generateAnomalyId() {
  return `anomaly-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
