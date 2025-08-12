import { DynamoDB } from 'aws-sdk';
import { MonitoringService } from './monitoring';

export interface AnalyticsEvent {
  eventId: string;
  installationId: number;
  eventType: string;
  timestamp: Date;
  data: any;
  userId?: string;
  repositoryId?: number;
}

export interface UsageMetrics {
  installationId: number;
  period: string; // daily, weekly, monthly
  pullRequestsProcessed: number;
  mergesSuccessful: number;
  mergesFailed: number;
  averageProcessingTime: number;
  rulesTriggered: { [ruleName: string]: number };
  featuresUsed: { [feature: string]: number };
}

export interface DashboardData {
  overview: {
    totalInstallations: number;
    activeLicenses: number;
    pullRequestsProcessed24h: number;
    averageProcessingTime: number;
    successRate: number;
  };
  metrics: {
    installationGrowth: Array<{ date: string; count: number }>;
    processingVolume: Array<{ date: string; count: number }>;
    successRates: Array<{ date: string; rate: number }>;
    tierDistribution: { [tier: string]: number };
  };
  alerts: Array<{
    id: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    timestamp: Date;
    resolved: boolean;
  }>;
}

export class AnalyticsService {
  private dynamodb: DynamoDB.DocumentClient;
  private monitoring: MonitoringService;
  private eventsTable: string;
  private metricsTable: string;

  constructor(eventsTable: string = 'automerge-pro-events', metricsTable: string = 'automerge-pro-metrics') {
    this.dynamodb = new DynamoDB.DocumentClient();
    this.monitoring = new MonitoringService();
    this.eventsTable = eventsTable;
    this.metricsTable = metricsTable;
  }

  async trackEvent(event: Omit<AnalyticsEvent, 'eventId' | 'timestamp'>): Promise<void> {
    const analyticsEvent: AnalyticsEvent = {
      eventId: this.generateEventId(),
      timestamp: new Date(),
      ...event
    };

    try {
      await this.dynamodb.put({
        TableName: this.eventsTable,
        Item: {
          ...analyticsEvent,
          timestamp: analyticsEvent.timestamp.toISOString(),
          ttl: Math.floor((Date.now() + 90 * 24 * 60 * 60 * 1000) / 1000) // 90 days TTL
        }
      }).promise();

      // Also send to CloudWatch for real-time monitoring
      await this.monitoring.recordFeatureUsage(event.eventType, event.installationId);
    } catch (error) {
      console.error('Failed to track analytics event:', error);
    }
  }

  async trackInstallation(installationId: number, tier: string, source: string): Promise<void> {
    await this.trackEvent({
      installationId,
      eventType: 'installation_created',
      data: { tier, source }
    });

    await this.monitoring.recordUserOnboarding(tier, source);
  }

  async trackPullRequestProcessed(
    installationId: number,
    repositoryId: number,
    pullRequestNumber: number,
    ruleName: string,
    success: boolean,
    processingTime: number,
    mergeMethod?: string
  ): Promise<void> {
    await this.trackEvent({
      installationId,
      eventType: 'pull_request_processed',
      data: {
        repositoryId,
        pullRequestNumber,
        ruleName,
        success,
        processingTime,
        mergeMethod
      }
    });

    await this.monitoring.recordPullRequestProcessed(installationId, success, processingTime);
    
    if (success && mergeMethod) {
      await this.monitoring.recordMergeAttempt(installationId, mergeMethod, true);
    }
  }

  async trackConfigurationUpdate(installationId: number, repositoryId: number, changes: any): Promise<void> {
    await this.trackEvent({
      installationId,
      eventType: 'configuration_updated',
      data: { repositoryId, changes }
    });
  }

  async trackLicenseUpgrade(installationId: number, fromTier: string, toTier: string): Promise<void> {
    await this.trackEvent({
      installationId,
      eventType: 'license_upgraded',
      data: { fromTier, toTier }
    });

    await this.monitoring.publishMetric({
      name: 'LicenseUpgrade',
      value: 1,
      unit: 'Count',
      dimensions: { FromTier: fromTier, ToTier: toTier }
    });
  }

  async trackFeatureUsage(installationId: number, feature: string, metadata?: any): Promise<void> {
    await this.trackEvent({
      installationId,
      eventType: 'feature_used',
      data: { feature, metadata }
    });

    await this.monitoring.recordFeatureUsage(feature, installationId);
  }

  async trackUserFeedback(installationId: number, type: 'bug' | 'feature_request' | 'general', rating: number, message: string): Promise<void> {
    await this.trackEvent({
      installationId,
      eventType: 'user_feedback',
      data: { type, rating, message }
    });
  }

  async aggregateUsageMetrics(installationId: number, period: string): Promise<UsageMetrics> {
    const startDate = this.getPeriodStartDate(period);
    const endDate = new Date();

    try {
      const { Items } = await this.dynamodb.query({
        TableName: this.eventsTable,
        KeyConditionExpression: 'installationId = :installationId AND #timestamp BETWEEN :startDate AND :endDate',
        ExpressionAttributeNames: {
          '#timestamp': 'timestamp'
        },
        ExpressionAttributeValues: {
          ':installationId': installationId,
          ':startDate': startDate.toISOString(),
          ':endDate': endDate.toISOString()
        }
      }).promise();

      const events = Items as AnalyticsEvent[];
      const metrics: UsageMetrics = {
        installationId,
        period,
        pullRequestsProcessed: 0,
        mergesSuccessful: 0,
        mergesFailed: 0,
        averageProcessingTime: 0,
        rulesTriggered: {},
        featuresUsed: {}
      };

      let totalProcessingTime = 0;
      let processedCount = 0;

      for (const event of events) {
        switch (event.eventType) {
          case 'pull_request_processed':
            metrics.pullRequestsProcessed++;
            if (event.data.success) {
              metrics.mergesSuccessful++;
            } else {
              metrics.mergesFailed++;
            }
            totalProcessingTime += event.data.processingTime || 0;
            processedCount++;
            
            const ruleName = event.data.ruleName;
            metrics.rulesTriggered[ruleName] = (metrics.rulesTriggered[ruleName] || 0) + 1;
            break;

          case 'feature_used':
            const feature = event.data.feature;
            metrics.featuresUsed[feature] = (metrics.featuresUsed[feature] || 0) + 1;
            break;
        }
      }

      metrics.averageProcessingTime = processedCount > 0 ? totalProcessingTime / processedCount : 0;

      // Store aggregated metrics
      await this.storeAggregatedMetrics(metrics);

      return metrics;
    } catch (error) {
      console.error('Failed to aggregate usage metrics:', error);
      throw error;
    }
  }

  async getDashboardData(): Promise<DashboardData> {
    try {
      // Get overview metrics from the last 24 hours
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const now = new Date();

      // Query recent events for overview
      const recentEvents = await this.queryEventsByTimeRange(yesterday, now);
      
      const overview = this.calculateOverviewMetrics(recentEvents);
      const metrics = await this.calculateTrendMetrics();
      const alerts = await this.getActiveAlerts();

      return {
        overview,
        metrics,
        alerts
      };
    } catch (error) {
      console.error('Failed to get dashboard data:', error);
      throw error;
    }
  }

  async generateUsageReport(installationId: number, startDate: Date, endDate: Date): Promise<any> {
    try {
      const events = await this.queryEventsByInstallationAndTimeRange(installationId, startDate, endDate);
      
      const report = {
        period: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        },
        summary: {
          totalEvents: events.length,
          pullRequestsProcessed: 0,
          successRate: 0,
          averageProcessingTime: 0,
          topRules: {} as { [rule: string]: number },
          topFeatures: {} as { [feature: string]: number }
        },
        timeline: [] as Array<{ date: string; events: number }>,
        details: events
      };

      // Process events for summary
      let successfulMerges = 0;
      let totalProcessingTime = 0;
      let processedPRs = 0;

      for (const event of events) {
        if (event.eventType === 'pull_request_processed') {
          report.summary.pullRequestsProcessed++;
          processedPRs++;
          
          if (event.data.success) {
            successfulMerges++;
          }
          
          totalProcessingTime += event.data.processingTime || 0;
          
          const rule = event.data.ruleName;
          report.summary.topRules[rule] = (report.summary.topRules[rule] || 0) + 1;
        }
        
        if (event.eventType === 'feature_used') {
          const feature = event.data.feature;
          report.summary.topFeatures[feature] = (report.summary.topFeatures[feature] || 0) + 1;
        }
      }

      report.summary.successRate = processedPRs > 0 ? (successfulMerges / processedPRs) * 100 : 0;
      report.summary.averageProcessingTime = processedPRs > 0 ? totalProcessingTime / processedPRs : 0;

      return report;
    } catch (error) {
      console.error('Failed to generate usage report:', error);
      throw error;
    }
  }

  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getPeriodStartDate(period: string): Date {
    const now = new Date();
    switch (period) {
      case 'daily':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case 'weekly':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'monthly':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }
  }

  private async storeAggregatedMetrics(metrics: UsageMetrics): Promise<void> {
    try {
      await this.dynamodb.put({
        TableName: this.metricsTable,
        Item: {
          ...metrics,
          id: `${metrics.installationId}_${metrics.period}_${Date.now()}`,
          timestamp: new Date().toISOString()
        }
      }).promise();
    } catch (error) {
      console.error('Failed to store aggregated metrics:', error);
    }
  }

  private async queryEventsByTimeRange(startDate: Date, endDate: Date): Promise<AnalyticsEvent[]> {
    // Implementation would scan across all installations within time range
    // This is a simplified version - in production, you'd want to use GSI
    try {
      const { Items } = await this.dynamodb.scan({
        TableName: this.eventsTable,
        FilterExpression: '#timestamp BETWEEN :startDate AND :endDate',
        ExpressionAttributeNames: {
          '#timestamp': 'timestamp'
        },
        ExpressionAttributeValues: {
          ':startDate': startDate.toISOString(),
          ':endDate': endDate.toISOString()
        }
      }).promise();

      return Items as AnalyticsEvent[];
    } catch (error) {
      console.error('Failed to query events by time range:', error);
      return [];
    }
  }

  private async queryEventsByInstallationAndTimeRange(
    installationId: number, 
    startDate: Date, 
    endDate: Date
  ): Promise<AnalyticsEvent[]> {
    try {
      const { Items } = await this.dynamodb.query({
        TableName: this.eventsTable,
        KeyConditionExpression: 'installationId = :installationId AND #timestamp BETWEEN :startDate AND :endDate',
        ExpressionAttributeNames: {
          '#timestamp': 'timestamp'
        },
        ExpressionAttributeValues: {
          ':installationId': installationId,
          ':startDate': startDate.toISOString(),
          ':endDate': endDate.toISOString()
        }
      }).promise();

      return Items as AnalyticsEvent[];
    } catch (error) {
      console.error('Failed to query events by installation and time range:', error);
      return [];
    }
  }

  private calculateOverviewMetrics(events: AnalyticsEvent[]): DashboardData['overview'] {
    let pullRequestsProcessed = 0;
    let totalProcessingTime = 0;
    let successfulMerges = 0;
    const installations = new Set<number>();

    for (const event of events) {
      installations.add(event.installationId);
      
      if (event.eventType === 'pull_request_processed') {
        pullRequestsProcessed++;
        totalProcessingTime += event.data.processingTime || 0;
        
        if (event.data.success) {
          successfulMerges++;
        }
      }
    }

    return {
      totalInstallations: installations.size,
      activeLicenses: installations.size, // Simplified - would query license table
      pullRequestsProcessed24h: pullRequestsProcessed,
      averageProcessingTime: pullRequestsProcessed > 0 ? totalProcessingTime / pullRequestsProcessed : 0,
      successRate: pullRequestsProcessed > 0 ? (successfulMerges / pullRequestsProcessed) * 100 : 0
    };
  }

  private async calculateTrendMetrics(): Promise<DashboardData['metrics']> {
    // This would typically aggregate data from multiple time periods
    // For now, returning mock data structure
    return {
      installationGrowth: [],
      processingVolume: [],
      successRates: [],
      tierDistribution: { free: 60, pro: 30, enterprise: 10 }
    };
  }

  private async getActiveAlerts(): Promise<DashboardData['alerts']> {
    // This would query active alerts from CloudWatch or a dedicated alerts table
    return [];
  }
}