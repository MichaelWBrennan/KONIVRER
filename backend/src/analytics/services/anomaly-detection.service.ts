import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AnomalyAlert, AnomalyType, AlertSeverity, AlertStatus } from '../entities/anomaly-alert.entity';
import { AnalyticsEvent } from '../entities/analytics-event.entity';
import { AlertingService } from './alerting.service';

interface AnomalyDetectionConfig {
  metric: string;
  threshold: number;
  window: number; // minutes
  sensitivity: number;
  enabled: boolean;
}

interface MetricData {
  timestamp: Date;
  value: number;
  metadata?: any;
}

@Injectable()
export class AnomalyDetectionService {
  private readonly logger = new Logger(AnomalyDetectionService.name);
  
  private defaultConfigs: AnomalyDetectionConfig[] = [
    { metric: 'user_signups', threshold: 2.0, window: 60, sensitivity: 0.8, enabled: true },
    { metric: 'error_rate', threshold: 3.0, window: 15, sensitivity: 0.9, enabled: true },
    { metric: 'response_time', threshold: 1.5, window: 30, sensitivity: 0.7, enabled: true },
    { metric: 'active_users', threshold: 2.5, window: 120, sensitivity: 0.8, enabled: true },
    { metric: 'revenue_events', threshold: 3.0, window: 240, sensitivity: 0.9, enabled: true },
    { metric: 'merge_failures', threshold: 2.0, window: 60, sensitivity: 0.8, enabled: true },
  ];

  constructor(
    @InjectRepository(AnomalyAlert)
    private anomalyAlertRepository: Repository<AnomalyAlert>,
    @InjectRepository(AnalyticsEvent)
    private analyticsEventRepository: Repository<AnalyticsEvent>,
    private alertingService: AlertingService,
    private configService: ConfigService,
  ) {}

  async detectAnomalies(): Promise<AnomalyAlert[]> {
    const detectedAnomalies: AnomalyAlert[] = [];

    for (const config of this.defaultConfigs) {
      if (!config.enabled) continue;

      try {
        const anomaly = await this.detectMetricAnomaly(config);
        if (anomaly) {
          detectedAnomalies.push(anomaly);
        }
      } catch (error) {
        this.logger.error(`Failed to detect anomaly for ${config.metric}: ${error.message}`);
      }
    }

    return detectedAnomalies;
  }

  private async detectMetricAnomaly(config: AnomalyDetectionConfig): Promise<AnomalyAlert | null> {
    const now = new Date();
    const windowStart = new Date(now.getTime() - config.window * 60 * 1000);
    const historicalStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days

    // Get current window data
    const currentData = await this.getMetricData(config.metric, windowStart, now);
    const currentValue = this.aggregateMetricData(currentData);

    // Get historical data for baseline
    const historicalData = await this.getHistoricalMetricData(config.metric, historicalStart, windowStart);
    const baseline = this.calculateBaseline(historicalData, config.window);

    if (baseline.mean === 0) {
      // Not enough historical data
      return null;
    }

    // Detect anomalies using statistical methods
    const deviation = Math.abs(currentValue - baseline.mean) / baseline.stdDev;
    const deviationPercentage = ((currentValue - baseline.mean) / baseline.mean) * 100;

    if (deviation > config.threshold) {
      const anomalyType = this.determineAnomalyType(currentValue, baseline.mean, deviationPercentage);
      const severity = this.calculateSeverity(deviation, Math.abs(deviationPercentage));

      // Check if we already have an active alert for this metric
      const existingAlert = await this.anomalyAlertRepository.findOne({
        where: {
          metric: config.metric,
          status: AlertStatus.ACTIVE,
        },
        order: { createdAt: 'DESC' },
      });

      // Don't create duplicate alerts within 30 minutes
      if (existingAlert && 
          (now.getTime() - existingAlert.createdAt.getTime()) < 30 * 60 * 1000) {
        return null;
      }

      const anomalyAlert = this.anomalyAlertRepository.create({
        alertType: anomalyType,
        metric: config.metric,
        currentValue: currentValue,
        expectedValue: baseline.mean,
        deviationPercentage: Math.abs(deviationPercentage),
        severity,
        description: this.generateAlertDescription(config.metric, anomalyType, currentValue, baseline.mean, deviationPercentage),
        detectionData: {
          threshold: config.threshold,
          deviation,
          windowMinutes: config.window,
          baseline: baseline,
          currentData: currentData.length,
          detectionTime: now.toISOString(),
        },
        context: {
          config,
          historicalDataPoints: historicalData.length,
        },
      });

      const savedAlert = await this.anomalyAlertRepository.save(anomalyAlert);

      // Send alerts
      await this.alertingService.sendAnomalyAlert(savedAlert);

      this.logger.warn(`Anomaly detected for ${config.metric}: ${anomalyType} - Current: ${currentValue}, Expected: ${baseline.mean}`);

      return savedAlert;
    }

    return null;
  }

  private async getMetricData(metric: string, startDate: Date, endDate: Date): Promise<MetricData[]> {
    // This would be customized based on the specific metric
    switch (metric) {
      case 'user_signups':
        return this.getUserSignupData(startDate, endDate);
      case 'error_rate':
        return this.getErrorRateData(startDate, endDate);
      case 'response_time':
        return this.getResponseTimeData(startDate, endDate);
      case 'active_users':
        return this.getActiveUserData(startDate, endDate);
      case 'revenue_events':
        return this.getRevenueEventData(startDate, endDate);
      case 'merge_failures':
        return this.getMergeFailureData(startDate, endDate);
      default:
        return [];
    }
  }

  private async getUserSignupData(startDate: Date, endDate: Date): Promise<MetricData[]> {
    const results = await this.analyticsEventRepository
      .createQueryBuilder('event')
      .select([
        `DATE_TRUNC('minute', event.createdAt) as timestamp`,
        'COUNT(*) as count',
      ])
      .where('event.eventType = :eventType', { eventType: 'install' })
      .andWhere('event.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy(`DATE_TRUNC('minute', event.createdAt)`)
      .orderBy('timestamp', 'ASC')
      .getRawMany();

    return results.map(result => ({
      timestamp: new Date(result.timestamp),
      value: parseInt(result.count),
    }));
  }

  private async getErrorRateData(startDate: Date, endDate: Date): Promise<MetricData[]> {
    // This would integrate with error tracking systems
    // For now, return simulated data based on system events
    const results = await this.analyticsEventRepository
      .createQueryBuilder('event')
      .select([
        `DATE_TRUNC('minute', event.createdAt) as timestamp`,
        `SUM(CASE WHEN event.eventData->>'status' = 'error' THEN 1 ELSE 0 END) as errors`,
        `COUNT(*) as total`,
      ])
      .where('event.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy(`DATE_TRUNC('minute', event.createdAt)`)
      .orderBy('timestamp', 'ASC')
      .getRawMany();

    return results.map(result => ({
      timestamp: new Date(result.timestamp),
      value: result.total > 0 ? (result.errors / result.total) * 100 : 0,
    }));
  }

  private async getResponseTimeData(startDate: Date, endDate: Date): Promise<MetricData[]> {
    // This would integrate with APM tools
    // Simulated response time data
    return [];
  }

  private async getActiveUserData(startDate: Date, endDate: Date): Promise<MetricData[]> {
    const results = await this.analyticsEventRepository
      .createQueryBuilder('event')
      .select([
        `DATE_TRUNC('hour', event.createdAt) as timestamp`,
        'COUNT(DISTINCT event.userId) as activeUsers',
      ])
      .where('event.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('event.userId IS NOT NULL')
      .groupBy(`DATE_TRUNC('hour', event.createdAt)`)
      .orderBy('timestamp', 'ASC')
      .getRawMany();

    return results.map(result => ({
      timestamp: new Date(result.timestamp),
      value: parseInt(result.activeUsers),
    }));
  }

  private async getRevenueEventData(startDate: Date, endDate: Date): Promise<MetricData[]> {
    const results = await this.analyticsEventRepository
      .createQueryBuilder('event')
      .select([
        `DATE_TRUNC('hour', event.createdAt) as timestamp`,
        `SUM(CAST(event.eventData->>'amount' AS DECIMAL)) as revenue`,
      ])
      .where('event.eventType = :eventType', { eventType: 'billing' })
      .andWhere('event.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy(`DATE_TRUNC('hour', event.createdAt)`)
      .orderBy('timestamp', 'ASC')
      .getRawMany();

    return results.map(result => ({
      timestamp: new Date(result.timestamp),
      value: parseFloat(result.revenue || '0'),
    }));
  }

  private async getMergeFailureData(startDate: Date, endDate: Date): Promise<MetricData[]> {
    const results = await this.analyticsEventRepository
      .createQueryBuilder('event')
      .select([
        `DATE_TRUNC('minute', event.createdAt) as timestamp`,
        `SUM(CASE WHEN event.eventData->>'status' = 'failed' THEN 1 ELSE 0 END) as failures`,
      ])
      .where('event.eventType = :eventType', { eventType: 'merge' })
      .andWhere('event.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy(`DATE_TRUNC('minute', event.createdAt)`)
      .orderBy('timestamp', 'ASC')
      .getRawMany();

    return results.map(result => ({
      timestamp: new Date(result.timestamp),
      value: parseInt(result.failures || '0'),
    }));
  }

  private async getHistoricalMetricData(metric: string, startDate: Date, endDate: Date): Promise<MetricData[]> {
    return this.getMetricData(metric, startDate, endDate);
  }

  private aggregateMetricData(data: MetricData[]): number {
    if (data.length === 0) return 0;
    return data.reduce((sum, point) => sum + point.value, 0) / data.length;
  }

  private calculateBaseline(historicalData: MetricData[], windowMinutes: number): { mean: number; stdDev: number } {
    if (historicalData.length === 0) return { mean: 0, stdDev: 1 };

    // Group data by similar time windows
    const groupedData: { [key: string]: MetricData[] } = {};
    
    historicalData.forEach(point => {
      const timeKey = Math.floor(point.timestamp.getTime() / (windowMinutes * 60 * 1000));
      if (!groupedData[timeKey]) {
        groupedData[timeKey] = [];
      }
      groupedData[timeKey].push(point);
    });

    // Calculate mean for each time window
    const windowMeans = Object.values(groupedData).map(windowData => 
      this.aggregateMetricData(windowData)
    );

    const mean = windowMeans.reduce((sum, val) => sum + val, 0) / windowMeans.length;
    const variance = windowMeans.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / windowMeans.length;
    const stdDev = Math.sqrt(variance) || 1;

    return { mean, stdDev };
  }

  private determineAnomalyType(currentValue: number, expectedValue: number, deviationPercentage: number): AnomalyType {
    if (Math.abs(deviationPercentage) > 50) {
      return currentValue > expectedValue ? AnomalyType.SPIKE : AnomalyType.DROP;
    } else if (Math.abs(deviationPercentage) > 20) {
      return AnomalyType.UNUSUAL_PATTERN;
    } else {
      return AnomalyType.THRESHOLD_BREACH;
    }
  }

  private calculateSeverity(deviation: number, deviationPercentage: number): AlertSeverity {
    if (deviation > 4 || deviationPercentage > 100) {
      return AlertSeverity.CRITICAL;
    } else if (deviation > 3 || deviationPercentage > 50) {
      return AlertSeverity.HIGH;
    } else if (deviation > 2 || deviationPercentage > 25) {
      return AlertSeverity.MEDIUM;
    } else {
      return AlertSeverity.LOW;
    }
  }

  private generateAlertDescription(
    metric: string,
    anomalyType: AnomalyType,
    currentValue: number,
    expectedValue: number,
    deviationPercentage: number,
  ): string {
    const direction = currentValue > expectedValue ? 'increased' : 'decreased';
    const metricName = metric.replace(/_/g, ' ');
    
    return `${metricName} has ${direction} significantly. Current value: ${currentValue.toFixed(2)}, Expected: ${expectedValue.toFixed(2)} (${Math.abs(deviationPercentage).toFixed(1)}% deviation)`;
  }
}