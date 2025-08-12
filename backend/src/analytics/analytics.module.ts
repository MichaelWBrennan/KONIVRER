import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { AnomalyDetectionService } from './services/anomaly-detection.service';
import { ReportGenerationService } from './services/report-generation.service';
import { AlertingService } from './services/alerting.service';
import { KinesisService } from './services/kinesis.service';
import { AnalyticsEvent } from './entities/analytics-event.entity';
import { AnomalyAlert } from './entities/anomaly-alert.entity';
import { AnalyticsReport } from './entities/analytics-report.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      AnalyticsEvent,
      AnomalyAlert,
      AnalyticsReport,
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [
    AnalyticsService,
    AnomalyDetectionService,
    ReportGenerationService,
    AlertingService,
    KinesisService,
  ],
  exports: [
    AnalyticsService,
    KinesisService,
    AlertingService,
  ],
})
export class AnalyticsModule {}