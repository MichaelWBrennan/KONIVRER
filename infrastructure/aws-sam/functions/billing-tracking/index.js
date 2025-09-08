const AWS = require("aws-sdk");

const kinesis = new AWS.Kinesis();
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Stripe-Signature",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    let records = [];

    // Handle Stripe webhook events
    if (event.headers && event.headers["Stripe-Signature"]) {
      const body = JSON.parse(event.body);
      const stripeEvent = body;

      // Only process billing-related events
      const billingEventTypes = [
        "customer.subscription.created",
        "customer.subscription.updated",
        "customer.subscription.deleted",
        "invoice.payment_succeeded",
        "invoice.payment_failed",
        "customer.created",
        "customer.updated",
        "payment_intent.succeeded",
        "payment_intent.payment_failed",
        "charge.succeeded",
        "charge.failed",
      ];

      if (billingEventTypes.includes(stripeEvent.type)) {
        records = [transformStripeEvent(stripeEvent)];
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

      const billingEvent = {
        eventType: "billing",
        timestamp: new Date().toISOString(),
        userId: record.userId,
        customerId: record.customerId,
        billingEventType: record.billingEventType,
        amount: record.amount || 0,
        currency: record.currency || "usd",
        metadata: {
          subscriptionId: record.subscriptionId,
          planId: record.planId,
          invoiceId: record.invoiceId,
          paymentMethodId: record.paymentMethodId,
          transactionId: record.transactionId,
          billingCycle: record.billingCycle,
          trialEnd: record.trialEnd,
          prorationAmount: record.prorationAmount,
          discountAmount: record.discountAmount,
          taxAmount: record.taxAmount,
          status: record.status,
          failureReason: record.failureReason,
          refundAmount: record.refundAmount,
        },
      };

      // Add to Kinesis stream for real-time processing
      const kinesisParams = {
        StreamName: process.env.KINESIS_STREAM_NAME,
        Data: JSON.stringify(billingEvent),
        PartitionKey: record.customerId || record.userId || "unknown",
      };

      await kinesis.putRecord(kinesisParams).promise();

      // Store metadata in DynamoDB
      const dynamoParams = {
        TableName: process.env.TABLE_NAME,
        Item: {
          configKey: `billing:${
            billingEvent.metadata.transactionId || Date.now()
          }`,
          timestamp: Date.now(),
          data: billingEvent,
          ttl: Math.floor(Date.now() / 1000) + 2 * 365 * 24 * 60 * 60, // 2 years TTL
        },
      };

      await dynamodb.put(dynamoParams).promise();
      processedEvents.push(billingEvent);
    }

    console.log(`Processed ${processedEvents.length} billing events`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "Billing events processed successfully",
        processedCount: processedEvents.length,
      }),
    };
  } catch (error) {
    console.error("Error processing billing events:", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Failed to process billing events",
        details: error.message,
      }),
    };
  }
};

function transformStripeEvent(stripeEvent) {
  try {
    const { type, data } = stripeEvent;
    const obj = data.object;

    const baseEvent = {
      customerId: obj.customer,
      transactionId: stripeEvent.id,
      status: obj.status,
    };

    switch (type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        return {
          ...baseEvent,
          billingEventType:
            type === "customer.subscription.created"
              ? "subscription_created"
              : "subscription_updated",
          subscriptionId: obj.id,
          planId: obj.items.data[0]?.price?.id,
          amount: obj.items.data[0]?.price?.unit_amount || 0,
          currency: obj.currency,
          billingCycle: obj.items.data[0]?.price?.recurring?.interval,
          trialEnd: obj.trial_end
            ? new Date(obj.trial_end * 1000).toISOString()
            : null,
        };

      case "customer.subscription.deleted":
        return {
          ...baseEvent,
          billingEventType: "subscription_cancelled",
          subscriptionId: obj.id,
        };

      case "invoice.payment_succeeded":
        return {
          ...baseEvent,
          billingEventType: "payment_succeeded",
          amount: obj.amount_paid,
          currency: obj.currency,
          invoiceId: obj.id,
          subscriptionId: obj.subscription,
        };

      case "invoice.payment_failed":
        return {
          ...baseEvent,
          billingEventType: "payment_failed",
          amount: obj.amount_due,
          currency: obj.currency,
          invoiceId: obj.id,
          subscriptionId: obj.subscription,
          failureReason: obj.last_finalization_error?.message,
        };

      case "payment_intent.succeeded":
      case "charge.succeeded":
        return {
          ...baseEvent,
          billingEventType: "one_time_payment",
          amount: obj.amount,
          currency: obj.currency,
          paymentMethodId: obj.payment_method,
        };

      case "payment_intent.payment_failed":
      case "charge.failed":
        return {
          ...baseEvent,
          billingEventType: "payment_failed",
          amount: obj.amount,
          currency: obj.currency,
          paymentMethodId: obj.payment_method,
          failureReason: obj.last_payment_error?.message || obj.failure_message,
        };

      case "customer.created":
      case "customer.updated":
        return {
          ...baseEvent,
          billingEventType:
            type === "customer.created"
              ? "customer_created"
              : "customer_updated",
          userId: obj.metadata?.userId,
        };

      default:
        return null;
    }
  } catch (error) {
    console.error("Error transforming Stripe event:", error);
    return null;
  }
}
