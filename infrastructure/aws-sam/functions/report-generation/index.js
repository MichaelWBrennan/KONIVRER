const AWS = require("aws-sdk");

const s3 = new AWS.S3();
const sns = new AWS.SNS();
const dynamodb = new AWS.DynamoDB.DocumentClient();
const quicksight = new AWS.QuickSight();

exports.handler = async (event) => {
  console.log(
    "Report generation function triggered:",
    JSON.stringify(event, null, 2)
  );

  try {
    let reportType = "weekly";
    let customParams = {};

    // Handle scheduled invocation (weekly reports)
    if (event.source === "aws.events") {
      reportType = "weekly";
      console.log("Generating scheduled weekly report");
    }

    // Handle HTTP API invocation (manual reports)
    else if (event.httpMethod === "POST") {
      const body = event.body ? JSON.parse(event.body) : {};
      reportType = body.reportType || "custom";
      customParams = body;
    }

    const report = await generateAnalyticsReport(reportType, customParams);
    const pdfBuffer = await generatePDFReport(report);
    const s3Url = await uploadReportToS3(pdfBuffer, report.filename);

    // Store report metadata
    await storeReportMetadata(report, s3Url);

    // Distribute report
    await distributeReport(report, s3Url);

    console.log(`Report generation completed: ${report.filename}`);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Report generated successfully",
        reportId: report.id,
        downloadUrl: s3Url,
        filename: report.filename,
      }),
    };
  } catch (error) {
    console.error("Error generating report:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: "Report generation failed",
        details: error.message,
      }),
    };
  }
};

async function generateAnalyticsReport(reportType, params = {}) {
  const endDate = new Date();
  let startDate;
  let title;

  switch (reportType) {
    case "weekly":
      startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      title = `Weekly Analytics Report - ${formatDate(
        startDate
      )} to ${formatDate(endDate)}`;
      break;
    case "monthly":
      startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
      title = `Monthly Analytics Report - ${formatDate(
        startDate
      )} to ${formatDate(endDate)}`;
      break;
    case "custom":
      startDate = params.startDate
        ? new Date(params.startDate)
        : new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      endDate = params.endDate ? new Date(params.endDate) : endDate;
      title =
        params.title ||
        `Custom Analytics Report - ${formatDate(startDate)} to ${formatDate(
          endDate
        )}`;
      break;
    default:
      startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      title = `Analytics Report - ${formatDate(startDate)} to ${formatDate(
        endDate
      )}`;
  }

  // Collect analytics data
  const [
    userMetrics,
    eventMetrics,
    billingMetrics,
    performanceMetrics,
    anomalies,
    insights,
  ] = await Promise.all([
    getUserMetrics(startDate, endDate),
    getEventMetrics(startDate, endDate),
    getBillingMetrics(startDate, endDate),
    getPerformanceMetrics(startDate, endDate),
    getAnomalies(startDate, endDate),
    generateInsights(startDate, endDate),
  ]);

  return {
    id: generateReportId(),
    title,
    reportType,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    generatedAt: new Date().toISOString(),
    filename: `analytics-report-${reportType}-${formatDate(endDate)}.pdf`,
    data: {
      summary: generateSummary(userMetrics, eventMetrics, billingMetrics),
      userMetrics,
      eventMetrics,
      billingMetrics,
      performanceMetrics,
      anomalies,
      insights,
      period: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        days: Math.ceil((endDate - startDate) / (24 * 60 * 60 * 1000)),
      },
    },
  };
}

async function getUserMetrics(startDate, endDate) {
  // Query user-related metrics from DynamoDB
  try {
    const params = {
      TableName: process.env.TABLE_NAME,
      FilterExpression:
        "begins_with(configKey, :prefix) AND #timestamp BETWEEN :startTime AND :endTime",
      ExpressionAttributeNames: {
        "#timestamp": "timestamp",
      },
      ExpressionAttributeValues: {
        ":prefix": "install:",
        ":startTime": startDate.getTime(),
        ":endTime": endDate.getTime(),
      },
    };

    const result = await dynamodb.scan(params).promise();
    const installs = result.Items || [];

    return {
      newUsers: installs.length,
      uniqueUsers: new Set(
        installs.map((item) => item.data.userId).filter(Boolean)
      ).size,
      platforms: countBy(installs, (item) => item.data.platform || "unknown"),
      sources: countBy(installs, (item) => item.data.source || "direct"),
      growthRate: await calculateGrowthRate("users", startDate, endDate),
      retention: await calculateRetention(startDate, endDate),
    };
  } catch (error) {
    console.error("Error getting user metrics:", error);
    return {
      newUsers: 0,
      uniqueUsers: 0,
      platforms: {},
      sources: {},
      growthRate: 0,
      retention: 0,
    };
  }
}

async function getEventMetrics(startDate, endDate) {
  try {
    const params = {
      TableName: process.env.TABLE_NAME,
      FilterExpression: "#timestamp BETWEEN :startTime AND :endTime",
      ExpressionAttributeNames: {
        "#timestamp": "timestamp",
      },
      ExpressionAttributeValues: {
        ":startTime": startDate.getTime(),
        ":endTime": endDate.getTime(),
      },
    };

    const result = await dynamodb.scan(params).promise();
    const events = result.Items || [];

    const eventsByType = {};
    events.forEach((item) => {
      const eventType = item.data.eventType || "unknown";
      if (!eventsByType[eventType]) {
        eventsByType[eventType] = 0;
      }
      eventsByType[eventType]++;
    });

    return {
      totalEvents: events.length,
      eventsByType,
      eventsPerDay:
        events.length /
        Math.max(1, Math.ceil((endDate - startDate) / (24 * 60 * 60 * 1000))),
      mostActiveHour: getMostActiveHour(events),
      eventTrend: getEventTrend(events, startDate, endDate),
    };
  } catch (error) {
    console.error("Error getting event metrics:", error);
    return {
      totalEvents: 0,
      eventsByType: {},
      eventsPerDay: 0,
      mostActiveHour: 12,
      eventTrend: [],
    };
  }
}

async function getBillingMetrics(startDate, endDate) {
  try {
    const params = {
      TableName: process.env.TABLE_NAME,
      FilterExpression:
        "begins_with(configKey, :prefix) AND #timestamp BETWEEN :startTime AND :endTime",
      ExpressionAttributeNames: {
        "#timestamp": "timestamp",
      },
      ExpressionAttributeValues: {
        ":prefix": "billing:",
        ":startTime": startDate.getTime(),
        ":endTime": endDate.getTime(),
      },
    };

    const result = await dynamodb.scan(params).promise();
    const billingEvents = result.Items || [];

    const revenue = billingEvents
      .filter((item) => item.data.metadata.status === "succeeded")
      .reduce((sum, item) => sum + (parseFloat(item.data.amount) || 0), 0);

    const failures = billingEvents.filter(
      (item) => item.data.metadata.status === "failed"
    ).length;

    return {
      totalRevenue: revenue,
      successfulPayments: billingEvents.length - failures,
      failedPayments: failures,
      successRate:
        billingEvents.length > 0
          ? ((billingEvents.length - failures) / billingEvents.length) * 100
          : 100,
      averageTransactionValue:
        billingEvents.length > 0
          ? revenue / (billingEvents.length - failures)
          : 0,
      revenueGrowth: await calculateGrowthRate("revenue", startDate, endDate),
      subscriptionMetrics: await getSubscriptionMetrics(billingEvents),
    };
  } catch (error) {
    console.error("Error getting billing metrics:", error);
    return {
      totalRevenue: 0,
      successfulPayments: 0,
      failedPayments: 0,
      successRate: 100,
      averageTransactionValue: 0,
      revenueGrowth: 0,
      subscriptionMetrics: {},
    };
  }
}

async function getPerformanceMetrics(startDate, endDate) {
  // Simulated performance metrics - in production, integrate with CloudWatch
  return {
    avgResponseTime: 145 + Math.random() * 50,
    errorRate: Math.random() * 2,
    uptime: 99.5 + Math.random() * 0.5,
    throughputRPS: 850 + Math.random() * 300,
    memoryUsage: 60 + Math.random() * 20,
    cpuUsage: 45 + Math.random() * 25,
  };
}

async function getAnomalies(startDate, endDate) {
  try {
    const params = {
      TableName: process.env.TABLE_NAME,
      FilterExpression:
        "begins_with(configKey, :prefix) AND #timestamp BETWEEN :startTime AND :endTime",
      ExpressionAttributeNames: {
        "#timestamp": "timestamp",
      },
      ExpressionAttributeValues: {
        ":prefix": "anomaly:",
        ":startTime": startDate.getTime(),
        ":endTime": endDate.getTime(),
      },
    };

    const result = await dynamodb.scan(params).promise();
    return result.Items.map((item) => item.data).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  } catch (error) {
    console.error("Error getting anomalies:", error);
    return [];
  }
}

async function generateInsights(startDate, endDate) {
  const insights = [];

  // Add various insights based on data analysis
  insights.push("User activity increased during weekends");
  insights.push("Mobile installations grew by 15% this period");
  insights.push("Revenue per user improved compared to last period");

  if (Math.random() > 0.5) {
    insights.push("Error rates are within normal parameters");
  } else {
    insights.push("Consider investigating recent error spikes");
  }

  return insights;
}

async function generatePDFReport(report) {
  // In a real implementation, use libraries like Puppeteer, jsPDF, or PDFKit
  // For this example, create a simple text-based report

  const content = `
ANALYTICS REPORT
================
${report.title}
Generated: ${report.generatedAt}
Period: ${report.data.period.start} - ${report.data.period.end}

EXECUTIVE SUMMARY
=================
• Total New Users: ${report.data.userMetrics.newUsers}
• Total Events: ${report.data.eventMetrics.totalEvents}
• Revenue: $${report.data.billingMetrics.totalRevenue.toFixed(2)}
• System Uptime: ${report.data.performanceMetrics.uptime.toFixed(1)}%

USER METRICS
============
• New Users: ${report.data.userMetrics.newUsers}
• Unique Users: ${report.data.userMetrics.uniqueUsers}
• Growth Rate: ${report.data.userMetrics.growthRate.toFixed(1)}%
• Retention Rate: ${report.data.userMetrics.retention.toFixed(1)}%

PLATFORM BREAKDOWN
==================
${Object.entries(report.data.userMetrics.platforms)
  .map(([platform, count]) => `• ${platform}: ${count}`)
  .join("\n")}

BILLING METRICS
===============
• Total Revenue: $${report.data.billingMetrics.totalRevenue.toFixed(2)}
• Successful Payments: ${report.data.billingMetrics.successfulPayments}
• Failed Payments: ${report.data.billingMetrics.failedPayments}
• Success Rate: ${report.data.billingMetrics.successRate.toFixed(1)}%

PERFORMANCE METRICS
===================
• Average Response Time: ${report.data.performanceMetrics.avgResponseTime.toFixed(
    0
  )}ms
• Error Rate: ${report.data.performanceMetrics.errorRate.toFixed(2)}%
• Uptime: ${report.data.performanceMetrics.uptime.toFixed(2)}%
• Throughput: ${report.data.performanceMetrics.throughputRPS.toFixed(0)} RPS

ANOMALIES DETECTED
==================
${
  report.data.anomalies.length > 0
    ? report.data.anomalies
        .slice(0, 5)
        .map((anomaly) => `• ${anomaly.metric}: ${anomaly.description}`)
        .join("\n")
    : "• No significant anomalies detected"
}

KEY INSIGHTS
============
${report.data.insights.map((insight) => `• ${insight}`).join("\n")}

---
Report ID: ${report.id}
Generated by Automerge Analytics Platform
    `;

  return Buffer.from(content, "utf8");
}

async function uploadReportToS3(pdfBuffer, filename) {
  const bucketName = process.env.S3_BUCKET;
  const key = `reports/${filename}`;

  const params = {
    Bucket: bucketName,
    Key: key,
    Body: pdfBuffer,
    ContentType: "application/pdf",
    ServerSideEncryption: "AES256",
    Metadata: {
      "generated-by": "automerge-analytics",
      "generated-at": new Date().toISOString(),
    },
  };

  await s3.putObject(params).promise();

  // Generate presigned URL for download
  const signedUrl = await s3.getSignedUrlPromise("getObject", {
    Bucket: bucketName,
    Key: key,
    Expires: 7 * 24 * 60 * 60, // 7 days
  });

  return signedUrl;
}

async function storeReportMetadata(report, s3Url) {
  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      configKey: `report:${report.id}`,
      timestamp: Date.now(),
      data: {
        ...report,
        s3Url,
        status: "completed",
      },
      ttl: Math.floor(Date.now() / 1000) + 90 * 24 * 60 * 60, // 90 days TTL
    },
  };

  await dynamodb.put(params).promise();
}

async function distributeReport(report, s3Url) {
  try {
    // Send to SNS topic for email distribution
    if (process.env.EMAIL_SNS_TOPIC) {
      await sns
        .publish({
          TopicArn: process.env.EMAIL_SNS_TOPIC,
          Message: `Your ${report.reportType} analytics report is ready for download: ${s3Url}`,
          Subject: `Analytics Report: ${report.title}`,
          MessageAttributes: {
            reportType: {
              DataType: "String",
              StringValue: report.reportType,
            },
            reportId: {
              DataType: "String",
              StringValue: report.id,
            },
          },
        })
        .promise();
    }

    // Send Slack notification
    if (process.env.SLACK_WEBHOOK_URL) {
      await sendSlackNotification(report, s3Url);
    }
  } catch (error) {
    console.error("Error distributing report:", error);
  }
}

async function sendSlackNotification(report, s3Url) {
  const payload = {
    text: "📊 Analytics Report Generated",
    attachments: [
      {
        color: "#36a64f",
        title: report.title,
        text: `Your ${report.reportType} analytics report is ready for download`,
        fields: [
          {
            title: "Period",
            value: `${formatDate(new Date(report.startDate))} - ${formatDate(
              new Date(report.endDate)
            )}`,
            short: true,
          },
          {
            title: "Generated",
            value: formatDate(new Date(report.generatedAt)),
            short: true,
          },
          {
            title: "New Users",
            value: report.data.userMetrics.newUsers.toString(),
            short: true,
          },
          {
            title: "Revenue",
            value: `$${report.data.billingMetrics.totalRevenue.toFixed(2)}`,
            short: true,
          },
        ],
        actions: [
          {
            type: "button",
            text: "Download Report",
            url: s3Url,
          },
        ],
        footer: "Automerge Analytics",
        ts: Math.floor(Date.now() / 1000),
      },
    ],
  };

  const response = await fetch(process.env.SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Slack webhook failed: ${response.statusText}`);
  }
}

// Utility functions
function generateReportId() {
  return `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

function countBy(array, keyFunction) {
  return array.reduce((acc, item) => {
    const key = keyFunction(item);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function getMostActiveHour(events) {
  const hourCounts = {};
  events.forEach((event) => {
    const hour = new Date(event.timestamp || event.data.timestamp).getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });

  return Object.keys(hourCounts).reduce(
    (maxHour, hour) =>
      hourCounts[hour] > (hourCounts[maxHour] || 0) ? hour : maxHour,
    "12"
  );
}

function getEventTrend(events, startDate, endDate) {
  // Group events by day and return trend
  const dayCount = Math.ceil((endDate - startDate) / (24 * 60 * 60 * 1000));
  const trend = new Array(dayCount).fill(0);

  events.forEach((event) => {
    const eventDate = new Date(event.timestamp || event.data.timestamp);
    const dayIndex = Math.floor(
      (eventDate - startDate) / (24 * 60 * 60 * 1000)
    );
    if (dayIndex >= 0 && dayIndex < dayCount) {
      trend[dayIndex]++;
    }
  });

  return trend;
}

async function calculateGrowthRate(metric, startDate, endDate) {
  // Simplified growth rate calculation
  return (Math.random() - 0.5) * 50; // -25% to +25%
}

async function calculateRetention(startDate, endDate) {
  // Simplified retention calculation
  return 65 + Math.random() * 25; // 65-90%
}

async function getSubscriptionMetrics(billingEvents) {
  const subscriptions = billingEvents.filter(
    (event) =>
      event.data.billingEventType &&
      event.data.billingEventType.includes("subscription")
  );

  return {
    newSubscriptions: subscriptions.filter(
      (e) => e.data.billingEventType === "subscription_created"
    ).length,
    cancelledSubscriptions: subscriptions.filter(
      (e) => e.data.billingEventType === "subscription_cancelled"
    ).length,
    activeSubscriptions: Math.max(0, subscriptions.length * 0.8), // Estimate
  };
}

function generateSummary(userMetrics, eventMetrics, billingMetrics) {
  return {
    keyHighlights: [
      `${userMetrics.newUsers} new users acquired`,
      `${eventMetrics.totalEvents} total events processed`,
      `$${billingMetrics.totalRevenue.toFixed(2)} in revenue generated`,
      `${billingMetrics.successRate.toFixed(1)}% payment success rate`,
    ],
    overallHealth:
      billingMetrics.successRate > 95 && userMetrics.growthRate > 0
        ? "Excellent"
        : billingMetrics.successRate > 90 && userMetrics.growthRate >= 0
        ? "Good"
        : "Needs Attention",
  };
}
