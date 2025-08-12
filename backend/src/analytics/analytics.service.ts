import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThan } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AnalyticsEvent, EventType, EventStatus } from './entities/analytics-event.entity';
import { AnomalyAlert } from './entities/anomaly-alert.entity';
import { KinesisService } from './services/kinesis.service';
import { AnomalyDetectionService } from './services/anomaly-detection.service';
import { CreateAnalyticsEventDto } from './dto/create-analytics-event.dto';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    @InjectRepository(AnalyticsEvent)
    private analyticsEventRepository: Repository<AnalyticsEvent>,
    @InjectRepository(AnomalyAlert)
    private anomalyAlertRepository: Repository<AnomalyAlert>,
    private kinesisService: KinesisService,
    private anomalyDetectionService: AnomalyDetectionService,
    private configService: ConfigService,
  ) {}

  async trackEvent(eventData: CreateAnalyticsEventDto): Promise<AnalyticsEvent> {
    try {
      // Create database record
      const event = this.analyticsEventRepository.create({
        eventType: eventData.eventType,
        userId: eventData.userId,
        sessionId: eventData.sessionId,
        eventData: eventData.data,
        metadata: eventData.metadata,
        status: EventStatus.PENDING,
      });

      const savedEvent = await this.analyticsEventRepository.save(event);

      // Send to Kinesis for real-time processing
      await this.kinesisService.putRecord({
        eventId: savedEvent.id,
        eventType: savedEvent.eventType,
        timestamp: savedEvent.createdAt.toISOString(),
        ...eventData,
      });

      // Update status to processed
      savedEvent.status = EventStatus.PROCESSED;
      savedEvent.processedAt = new Date();
      await this.analyticsEventRepository.save(savedEvent);

      this.logger.log(`Event tracked successfully: ${savedEvent.id}`);
      return savedEvent;
    } catch (error) {
      this.logger.error(`Failed to track event: ${error.message}`);
      throw error;
    }
  }

  async getMetrics(query: AnalyticsQueryDto) {
    const {
      startDate,
      endDate,
      eventTypes,
      userId,
      groupBy = 'day',
      metrics = ['count'],
    } = query;

    try {
      const queryBuilder = this.analyticsEventRepository
        .createQueryBuilder('event')
        .where('event.createdAt BETWEEN :startDate AND :endDate', {
          startDate,
          endDate,
        })
        .andWhere('event.status = :status', { status: EventStatus.PROCESSED });

      if (eventTypes?.length) {
        queryBuilder.andWhere('event.eventType IN (:...eventTypes)', {
          eventTypes,
        });
      }

      if (userId) {
        queryBuilder.andWhere('event.userId = :userId', { userId });
      }

      // Group by time period
      let dateFormat: string;
      switch (groupBy) {
        case 'hour':
          dateFormat = 'YYYY-MM-DD HH24';
          break;
        case 'day':
          dateFormat = 'YYYY-MM-DD';
          break;
        case 'week':
          dateFormat = 'IYYY-IW';
          break;
        case 'month':
          dateFormat = 'YYYY-MM';
          break;
        default:
          dateFormat = 'YYYY-MM-DD';
      }

      const results = await queryBuilder
        .select([
          `TO_CHAR(event.createdAt, '${dateFormat}') as period`,
          'event.eventType as eventType',
          'COUNT(*) as count',
          'COUNT(DISTINCT event.userId) as uniqueUsers',
        ])
        .groupBy('period, event.eventType')
        .orderBy('period', 'ASC')
        .getRawMany();

      // Process results based on requested metrics
      const processedResults = this.processMetricResults(results, metrics);

      return processedResults;
    } catch (error) {
      this.logger.error(`Failed to get metrics: ${error.message}`);
      throw error;
    }
  }

  async getDashboardData() {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    try {
      // Real-time metrics
      const activeUsers24h = await this.analyticsEventRepository
        .createQueryBuilder('event')
        .select('COUNT(DISTINCT event.userId)', 'count')
        .where('event.createdAt > :date', { date: last24Hours })
        .getRawOne();

      const totalEvents24h = await this.analyticsEventRepository.count({
        where: { createdAt: MoreThan(last24Hours) },
      });

      // Event type breakdown
      const eventTypeBreakdown = await this.analyticsEventRepository
        .createQueryBuilder('event')
        .select(['event.eventType', 'COUNT(*) as count'])
        .where('event.createdAt > :date', { date: last7Days })
        .groupBy('event.eventType')
        .getRawMany();

      // Growth trends
      const userGrowth = await this.getUserGrowthTrend(last30Days);
      const eventVolumeTrend = await this.getEventVolumeTrend(last30Days);

      // Active anomalies
      const activeAnomalies = await this.anomalyAlertRepository.count({
        where: { status: 'active' },
      });

      return {
        realTimeMetrics: {
          activeUsers24h: parseInt(activeUsers24h.count || '0'),
          totalEvents24h,
          eventsPerSecond: totalEvents24h / (24 * 60 * 60),
        },
        eventBreakdown: eventTypeBreakdown.map((item) => ({
          eventType: item.event_eventType,
          count: parseInt(item.count),
        })),
        trends: {
          userGrowth,
          eventVolume: eventVolumeTrend,
        },
        alerts: {
          activeAnomalies,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to get dashboard data: ${error.message}`);
      throw error;
    }
  }

  private async getUserGrowthTrend(startDate: Date) {
    return this.analyticsEventRepository
      .createQueryBuilder('event')
      .select([
        `DATE(event.createdAt) as date`,
        `COUNT(DISTINCT event.userId) as uniqueUsers`,
      ])
      .where('event.createdAt > :startDate', { startDate })
      .andWhere('event.eventType = :eventType', { eventType: EventType.INSTALL })
      .groupBy('DATE(event.createdAt)')
      .orderBy('date', 'ASC')
      .getRawMany();
  }

  private async getEventVolumeTrend(startDate: Date) {
    return this.analyticsEventRepository
      .createQueryBuilder('event')
      .select([
        `DATE(event.createdAt) as date`,
        `event.eventType as eventType`,
        `COUNT(*) as count`,
      ])
      .where('event.createdAt > :startDate', { startDate })
      .groupBy('DATE(event.createdAt), event.eventType')
      .orderBy('date', 'ASC')
      .getRawMany();
  }

  private processMetricResults(results: any[], requestedMetrics: string[]) {
    // Group results by period and calculate requested metrics
    const groupedResults = results.reduce((acc, result) => {
      const { period, eventType, count, uniqueUsers } = result;
      
      if (!acc[period]) {
        acc[period] = {};
      }
      
      if (!acc[period][eventType]) {
        acc[period][eventType] = {
          count: 0,
          uniqueUsers: 0,
        };
      }
      
      acc[period][eventType].count += parseInt(count);
      acc[period][eventType].uniqueUsers += parseInt(uniqueUsers || '0');
      
      return acc;
    }, {});

    return Object.entries(groupedResults).map(([period, data]) => ({
      period,
      data,
    }));
  }

  async getAnomalies(limit: number = 50) {
    return this.anomalyAlertRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async acknowledgeAnomaly(alertId: string, userId: string) {
    const alert = await this.anomalyAlertRepository.findOne({
      where: { id: alertId },
    });

    if (!alert) {
      throw new Error('Anomaly alert not found');
    }

    alert.status = 'acknowledged';
    alert.acknowledgedBy = userId;
    alert.acknowledgedAt = new Date();

    return this.anomalyAlertRepository.save(alert);
  }
}