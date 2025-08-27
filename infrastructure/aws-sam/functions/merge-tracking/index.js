const AWS = require("aws-sdk");

const kinesis = new AWS.Kinesis();
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-GitHub-Event",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    let records = [];

    // Handle GitHub webhook events
    if (event.headers && event.headers["X-GitHub-Event"]) {
      const body = JSON.parse(event.body);
      const githubEvent = event.headers["X-GitHub-Event"];

      // Only process merge-related events
      if (["pull_request", "push", "merge_group"].includes(githubEvent)) {
        records = [transformGitHubEvent(body, githubEvent)];
      }
    }
    // Handle direct HTTP API events
    else if (event.body) {
      const body = JSON.parse(event.body);
      records = Array.isArray(body) ? body : [body];
    }

    const processedEvents = [];

    for (const record of records) {
      if (!record) continue;

      const mergeEvent = {
        eventType: "merge",
        timestamp: new Date().toISOString(),
        userId: record.userId,
        repositoryId: record.repositoryId,
        mergeType: record.mergeType || "unknown", // 'pull_request', 'direct_push', 'merge_queue'
        metadata: {
          pullRequestId: record.pullRequestId,
          branchName: record.branchName,
          commitSha: record.commitSha,
          commitCount: record.commitCount || 1,
          linesAdded: record.linesAdded || 0,
          linesDeleted: record.linesDeleted || 0,
          filesChanged: record.filesChanged || 0,
          reviewers: record.reviewers || [],
          mergeStrategy: record.mergeStrategy,
          conflictResolved: record.conflictResolved || false,
          automatedMerge: record.automatedMerge || false,
        },
      };

      // Add to Kinesis stream for real-time processing
      const kinesisParams = {
        StreamName: process.env.KINESIS_STREAM_NAME,
        Data: JSON.stringify(mergeEvent),
        PartitionKey: record.userId || record.repositoryId,
      };

      await kinesis.putRecord(kinesisParams).promise();

      // Store metadata in DynamoDB
      const dynamoParams = {
        TableName: process.env.TABLE_NAME,
        Item: {
          configKey: `merge:${mergeEvent.metadata.commitSha}`,
          timestamp: Date.now(),
          data: mergeEvent,
          ttl: Math.floor(Date.now() / 1000) + 90 * 24 * 60 * 60, // 90 days TTL
        },
      };

      await dynamodb.put(dynamoParams).promise();
      processedEvents.push(mergeEvent);
    }

    console.log(`Processed ${processedEvents.length} merge events`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "Merge events processed successfully",
        processedCount: processedEvents.length,
      }),
    };
  } catch (error) {
    console.error("Error processing merge events:", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Failed to process merge events",
        details: error.message,
      }),
    };
  }
};

function transformGitHubEvent(body, eventType) {
  try {
    switch (eventType) {
      case "pull_request":
        if (body.action === "closed" && body.pull_request.merged) {
          return {
            userId: body.pull_request.user.login,
            repositoryId: body.repository.id.toString(),
            mergeType: "pull_request",
            pullRequestId: body.pull_request.id.toString(),
            branchName: body.pull_request.head.ref,
            commitSha: body.pull_request.merge_commit_sha,
            commitCount: body.pull_request.commits,
            linesAdded: body.pull_request.additions,
            linesDeleted: body.pull_request.deletions,
            filesChanged: body.pull_request.changed_files,
            mergeStrategy: "merge",
            automatedMerge: body.pull_request.auto_merge !== null,
          };
        }
        break;

      case "push":
        return {
          userId: body.pusher.name,
          repositoryId: body.repository.id.toString(),
          mergeType: "direct_push",
          branchName: body.ref.replace("refs/heads/", ""),
          commitSha: body.head_commit?.id,
          commitCount: body.commits.length,
          mergeStrategy: "push",
        };

      case "merge_group":
        return {
          userId: body.merge_group.head_commit.author.login,
          repositoryId: body.repository.id.toString(),
          mergeType: "merge_queue",
          branchName: body.merge_group.base_ref,
          commitSha: body.merge_group.head_sha,
          automatedMerge: true,
        };
    }
  } catch (error) {
    console.error("Error transforming GitHub event:", error);
    return null;
  }
}
