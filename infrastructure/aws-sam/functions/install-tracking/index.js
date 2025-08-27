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

    // Handle HTTP API events
    if (event.body) {
      const body = JSON.parse(event.body);
      records = Array.isArray(body) ? body : [body];
    }

    // Handle SQS events
    if (event.Records) {
      records = event.Records.map((record) => {
        const body =
          typeof record.body === "string"
            ? JSON.parse(record.body)
            : record.body;
        return body;
      });
    }

    const processedEvents = [];

    for (const record of records) {
      const installEvent = {
        eventType: "install",
        timestamp: new Date().toISOString(),
        userId: record.userId,
        version: record.version || "unknown",
        platform: record.platform || "unknown",
        source: record.source || "direct",
        metadata: {
          userAgent: record.userAgent,
          referrer: record.referrer,
          installationId: record.installationId || generateInstallationId(),
          geolocation: record.geolocation,
          deviceInfo: record.deviceInfo,
        },
      };

      // Add to Kinesis stream for real-time processing
      const kinesisParams = {
        StreamName: process.env.KINESIS_STREAM_NAME,
        Data: JSON.stringify(installEvent),
        PartitionKey: record.userId || installEvent.metadata.installationId,
      };

      await kinesis.putRecord(kinesisParams).promise();

      // Store configuration/metadata in DynamoDB
      const dynamoParams = {
        TableName: process.env.TABLE_NAME,
        Item: {
          configKey: `install:${installEvent.metadata.installationId}`,
          timestamp: Date.now(),
          data: installEvent,
          ttl: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60, // 1 year TTL
        },
      };

      await dynamodb.put(dynamoParams).promise();
      processedEvents.push(installEvent);
    }

    console.log(`Processed ${processedEvents.length} install events`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "Install events processed successfully",
        processedCount: processedEvents.length,
      }),
    };
  } catch (error) {
    console.error("Error processing install events:", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Failed to process install events",
        details: error.message,
      }),
    };
  }
};

function generateInstallationId() {
  return `install-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
