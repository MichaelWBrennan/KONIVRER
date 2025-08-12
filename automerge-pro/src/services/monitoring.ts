import { CloudWatch, SNS } from 'aws-sdk';

export interface MonitoringMetric {
  name: string;
  value: number;
  unit: string;
  dimensions?: { [key: string]: string };
  timestamp?: Date;
}

export interface AlertConfiguration {
  name: string;
  description: string;
  metricName: string;
  threshold: number;
  comparisonOperator: string;
  evaluationPeriods: number;
  snsTopicArn: string;
}

export class MonitoringService {
  private cloudwatch: CloudWatch;
  private sns: SNS;
  private namespace: string;

  constructor(namespace: string = 'AutomergePro') {
    this.cloudwatch = new CloudWatch();
    this.sns = new SNS();
    this.namespace = namespace;
  }

  async publishMetric(metric: MonitoringMetric): Promise<void> {
    try {
      await this.cloudwatch.putMetricData({
        Namespace: this.namespace,
        MetricData: [{
          MetricName: metric.name,
          Value: metric.value,
          Unit: metric.unit,
          Dimensions: metric.dimensions ? Object.entries(metric.dimensions).map(([key, value]) => ({
            Name: key,
            Value: value
          })) : undefined,
          Timestamp: metric.timestamp || new Date()
        }]
      }).promise();
    } catch (error) {
      console.error('Failed to publish metric:', error);
    }
  }

  async publishMultipleMetrics(metrics: MonitoringMetric[]): Promise<void> {
    try {
      const metricData = metrics.map(metric => ({
        MetricName: metric.name,
        Value: metric.value,
        Unit: metric.unit,
        Dimensions: metric.dimensions ? Object.entries(metric.dimensions).map(([key, value]) => ({
          Name: key,
          Value: value
        })) : undefined,
        Timestamp: metric.timestamp || new Date()
      }));

      await this.cloudwatch.putMetricData({
        Namespace: this.namespace,
        MetricData: metricData
      }).promise();
    } catch (error) {
      console.error('Failed to publish metrics:', error);
    }
  }

  async sendAlert(topicArn: string, subject: string, message: string): Promise<void> {
    try {
      await this.sns.publish({
        TopicArn: topicArn,
        Subject: subject,
        Message: message
      }).promise();
    } catch (error) {
      console.error('Failed to send alert:', error);
    }
  }

  // Predefined metrics for common Automerge-Pro events
  async recordPullRequestProcessed(installationId: number, success: boolean, processingTime: number): Promise<void> {
    const metrics: MonitoringMetric[] = [
      {
        name: 'PullRequestProcessed',
        value: 1,
        unit: 'Count',
        dimensions: { InstallationId: installationId.toString(), Success: success.toString() }
      },
      {
        name: 'ProcessingTime',
        value: processingTime,
        unit: 'Milliseconds',
        dimensions: { InstallationId: installationId.toString() }
      }
    ];

    await this.publishMultipleMetrics(metrics);
  }

  async recordMergeAttempt(installationId: number, mergeMethod: string, success: boolean): Promise<void> {
    await this.publishMetric({
      name: 'MergeAttempt',
      value: 1,
      unit: 'Count',
      dimensions: { 
        InstallationId: installationId.toString(),
        MergeMethod: mergeMethod,
        Success: success.toString()
      }
    });
  }

  async recordLicenseValidation(installationId: number, tier: string, valid: boolean): Promise<void> {
    await this.publishMetric({
      name: 'LicenseValidation',
      value: 1,
      unit: 'Count',
      dimensions: {
        InstallationId: installationId.toString(),
        Tier: tier,
        Valid: valid.toString()
      }
    });
  }

  async recordConfigurationError(installationId: number, errorType: string): Promise<void> {
    await this.publishMetric({
      name: 'ConfigurationError',
      value: 1,
      unit: 'Count',
      dimensions: {
        InstallationId: installationId.toString(),
        ErrorType: errorType
      }
    });
  }

  async recordWebhookReceived(eventType: string, processedSuccessfully: boolean): Promise<void> {
    await this.publishMetric({
      name: 'WebhookReceived',
      value: 1,
      unit: 'Count',
      dimensions: {
        EventType: eventType,
        Success: processedSuccessfully.toString()
      }
    });
  }

  // Performance monitoring
  async recordApiLatency(endpoint: string, latency: number): Promise<void> {
    await this.publishMetric({
      name: 'ApiLatency',
      value: latency,
      unit: 'Milliseconds',
      dimensions: { Endpoint: endpoint }
    });
  }

  async recordDynamoDbOperation(operation: string, success: boolean, latency: number): Promise<void> {
    const metrics: MonitoringMetric[] = [
      {
        name: 'DynamoDbOperation',
        value: 1,
        unit: 'Count',
        dimensions: { Operation: operation, Success: success.toString() }
      },
      {
        name: 'DynamoDbLatency',
        value: latency,
        unit: 'Milliseconds',
        dimensions: { Operation: operation }
      }
    ];

    await this.publishMultipleMetrics(metrics);
  }

  // Business metrics
  async recordUserOnboarding(tier: string, source: string): Promise<void> {
    await this.publishMetric({
      name: 'UserOnboarding',
      value: 1,
      unit: 'Count',
      dimensions: { Tier: tier, Source: source }
    });
  }

  async recordFeatureUsage(feature: string, installationId: number): Promise<void> {
    await this.publishMetric({
      name: 'FeatureUsage',
      value: 1,
      unit: 'Count',
      dimensions: { 
        Feature: feature,
        InstallationId: installationId.toString()
      }
    });
  }

  // Error tracking and alerting
  async recordCriticalError(error: Error, context: any): Promise<void> {
    // Log the error
    console.error('Critical error occurred:', {
      message: error.message,
      stack: error.stack,
      context
    });

    // Send metric
    await this.publishMetric({
      name: 'CriticalError',
      value: 1,
      unit: 'Count',
      dimensions: { ErrorType: error.constructor.name }
    });

    // Send immediate alert for critical errors
    if (process.env.CRITICAL_ERROR_SNS_TOPIC) {
      await this.sendAlert(
        process.env.CRITICAL_ERROR_SNS_TOPIC,
        'Automerge-Pro Critical Error',
        `A critical error occurred in Automerge-Pro:

Error: ${error.message}
Context: ${JSON.stringify(context, null, 2)}
Timestamp: ${new Date().toISOString()}
Stack Trace:
${error.stack}

Please investigate immediately.`
      );
    }
  }

  // Health check metrics
  async recordHealthCheck(healthy: boolean, checkType: string): Promise<void> {
    await this.publishMetric({
      name: 'HealthCheck',
      value: healthy ? 1 : 0,
      unit: 'Count',
      dimensions: { CheckType: checkType }
    });
  }

  // Custom dashboard queries
  async getMetricStatistics(
    metricName: string,
    startTime: Date,
    endTime: Date,
    period: number = 300,
    statistics: string[] = ['Sum']
  ): Promise<any> {
    try {
      const result = await this.cloudwatch.getMetricStatistics({
        Namespace: this.namespace,
        MetricName: metricName,
        StartTime: startTime,
        EndTime: endTime,
        Period: period,
        Statistics: statistics
      }).promise();

      return result.Datapoints;
    } catch (error) {
      console.error('Failed to get metric statistics:', error);
      return [];
    }
  }

  // Anomaly detection setup
  async createAnomalyDetector(metricName: string, dimensions?: { [key: string]: string }): Promise<void> {
    try {
      await this.cloudwatch.putAnomalyDetector({
        Namespace: this.namespace,
        MetricName: metricName,
        Stat: 'Sum',
        Dimensions: dimensions ? Object.entries(dimensions).map(([key, value]) => ({
          Name: key,
          Value: value
        })) : undefined
      }).promise();

      console.log(`Created anomaly detector for ${metricName}`);
    } catch (error) {
      console.error('Failed to create anomaly detector:', error);
    }
  }
}

// Decorator for automatic performance monitoring
export function Monitor(metricName?: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const monitoring = new MonitoringService();

    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now();
      const metric = metricName || `${target.constructor.name}.${propertyKey}`;
      
      try {
        const result = await originalMethod.apply(this, args);
        const endTime = Date.now();
        
        await monitoring.recordApiLatency(metric, endTime - startTime);
        return result;
      } catch (error) {
        const endTime = Date.now();
        
        await monitoring.recordApiLatency(metric, endTime - startTime);
        await monitoring.publishMetric({
          name: 'MethodError',
          value: 1,
          unit: 'Count',
          dimensions: { Method: metric }
        });
        
        throw error;
      }
    };
  };
}