import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AnalyticsReport, ReportType, ReportStatus } from '../entities/analytics-report.entity';
import { AnalyticsService } from '../analytics.service';
import { AlertingService } from './alerting.service';

@Injectable()
export class ReportGenerationService {
  private readonly logger = new Logger(ReportGenerationService.name);

  constructor(
    @InjectRepository(AnalyticsReport)
    private analyticsReportRepository: Repository<AnalyticsReport>,
    private analyticsService: AnalyticsService,
    private alertingService: AlertingService,
    private configService: ConfigService,
  ) {}

  async generateWeeklyReport(): Promise<AnalyticsReport> {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    return this.generateReport({
      reportType: ReportType.WEEKLY,
      title: `Weekly Analytics Report - ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`,
      description: 'Weekly performance and analytics summary',
      periodStart: startDate,
      periodEnd: endDate,
    });
  }

  async generateCustomReport(
    startDate: Date,
    endDate: Date,
    title?: string,
    description?: string,
  ): Promise<AnalyticsReport> {
    return this.generateReport({
      reportType: ReportType.CUSTOM,
      title: title || `Custom Analytics Report - ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`,
      description: description || 'Custom analytics report',
      periodStart: startDate,
      periodEnd: endDate,
    });
  }

  private async generateReport(params: {
    reportType: ReportType;
    title: string;
    description: string;
    periodStart: Date;
    periodEnd: Date;
  }): Promise<AnalyticsReport> {
    // Create report record
    const report = this.analyticsReportRepository.create({
      ...params,
      status: ReportStatus.GENERATING,
    });

    const savedReport = await this.analyticsReportRepository.save(report);

    try {
      // Generate report data
      const reportData = await this.collectReportData(params.periodStart, params.periodEnd);
      
      // Generate PDF (placeholder - would use a PDF library like Puppeteer or PDFKit)
      const pdfBuffer = await this.generatePDF(reportData, params.title);
      
      // Upload to S3 (placeholder)
      const s3Url = await this.uploadToS3(pdfBuffer, `reports/${savedReport.id}.pdf`);
      
      // Update report record
      savedReport.reportData = reportData;
      savedReport.status = ReportStatus.COMPLETED;
      savedReport.s3Url = s3Url;
      savedReport.fileName = `${savedReport.id}.pdf`;
      savedReport.fileSize = BigInt(pdfBuffer.length);
      savedReport.generatedAt = new Date();

      const completedReport = await this.analyticsReportRepository.save(savedReport);

      // Send notification
      await this.alertingService.sendReportNotification(completedReport, s3Url);

      this.logger.log(`Report generated successfully: ${completedReport.id}`);
      
      return completedReport;
    } catch (error) {
      this.logger.error(`Failed to generate report ${savedReport.id}: ${error.message}`);
      
      savedReport.status = ReportStatus.FAILED;
      savedReport.errorMessage = error.message;
      await this.analyticsReportRepository.save(savedReport);
      
      throw error;
    }
  }

  private async collectReportData(startDate: Date, endDate: Date) {
    try {
      // Collect various analytics data
      const [
        dashboardData,
        userGrowth,
        eventBreakdown,
        revenueMetrics,
        performanceMetrics,
        anomalies,
      ] = await Promise.all([
        this.analyticsService.getDashboardData(),
        this.analyticsService.getMetrics({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          eventTypes: ['install'],
          groupBy: 'day',
          metrics: ['count', 'uniqueUsers'],
        }),
        this.analyticsService.getMetrics({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          groupBy: 'day',
        }),
        this.analyticsService.getMetrics({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          eventTypes: ['billing'],
          groupBy: 'day',
        }),
        this.getPerformanceMetrics(startDate, endDate),
        this.analyticsService.getAnomalies(20),
      ]);

      return {
        summary: {
          periodStart: startDate.toISOString(),
          periodEnd: endDate.toISOString(),
          totalDays: Math.ceil((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)),
        },
        dashboard: dashboardData,
        userGrowth,
        eventBreakdown,
        revenueMetrics,
        performanceMetrics,
        anomalies: anomalies.slice(0, 10), // Top 10 anomalies
        insights: await this.generateInsights(dashboardData, userGrowth, anomalies),
      };
    } catch (error) {
      this.logger.error(`Failed to collect report data: ${error.message}`);
      throw error;
    }
  }

  private async generatePDF(reportData: any, title: string): Promise<Buffer> {
    // This is a placeholder implementation
    // In a real implementation, you would use libraries like:
    // - Puppeteer to generate PDF from HTML
    // - PDFKit for programmatic PDF generation
    // - jsPDF for client-side PDF generation
    
    const htmlContent = this.generateHTMLReport(reportData, title);
    
    // Simulate PDF generation
    const pdfContent = `PDF Report: ${title}\n${JSON.stringify(reportData, null, 2)}`;
    return Buffer.from(pdfContent, 'utf8');
  }

  private generateHTMLReport(reportData: any, title: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>${title}</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { border-bottom: 2px solid #333; padding-bottom: 20px; }
            .section { margin: 30px 0; }
            .metric { display: inline-block; margin: 10px; padding: 15px; border: 1px solid #ddd; }
            .chart { width: 100%; height: 300px; border: 1px solid #ddd; }
            .anomaly { background-color: #fff3cd; padding: 10px; margin: 5px 0; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>${title}</h1>
            <p>Generated: ${new Date().toISOString()}</p>
            <p>Period: ${reportData.summary.periodStart} - ${reportData.summary.periodEnd}</p>
        </div>
        
        <div class="section">
            <h2>Key Metrics</h2>
            <div class="metric">
                <h3>Active Users (24h)</h3>
                <p>${reportData.dashboard.realTimeMetrics.activeUsers24h}</p>
            </div>
            <div class="metric">
                <h3>Total Events (24h)</h3>
                <p>${reportData.dashboard.realTimeMetrics.totalEvents24h}</p>
            </div>
            <div class="metric">
                <h3>Active Anomalies</h3>
                <p>${reportData.dashboard.alerts.activeAnomalies}</p>
            </div>
        </div>
        
        <div class="section">
            <h2>Anomaly Alerts</h2>
            ${reportData.anomalies.map((anomaly: any) => `
                <div class="anomaly">
                    <strong>${anomaly.metric}</strong> - ${anomaly.description}
                    <br><small>Severity: ${anomaly.severity} | ${anomaly.createdAt}</small>
                </div>
            `).join('')}
        </div>
        
        <div class="section">
            <h2>Insights</h2>
            ${reportData.insights.map((insight: string) => `<p>• ${insight}</p>`).join('')}
        </div>
    </body>
    </html>`;
  }

  private async uploadToS3(buffer: Buffer, key: string): Promise<string> {
    // Placeholder S3 upload implementation
    // In real implementation, use AWS SDK to upload to S3
    const bucketName = this.configService.get('ANALYTICS_S3_BUCKET', 'analytics-reports');
    const mockUrl = `https://${bucketName}.s3.amazonaws.com/${key}`;
    
    this.logger.log(`Mock upload to S3: ${mockUrl}`);
    return mockUrl;
  }

  private async getPerformanceMetrics(startDate: Date, endDate: Date) {
    // Placeholder performance metrics
    return {
      avgResponseTime: 120,
      errorRate: 0.5,
      throughput: 1500,
      availability: 99.9,
    };
  }

  private async generateInsights(dashboardData: any, userGrowth: any, anomalies: any[]): Promise<string[]> {
    const insights: string[] = [];
    
    // Growth insights
    if (userGrowth.length > 1) {
      const latest = userGrowth[userGrowth.length - 1];
      const previous = userGrowth[userGrowth.length - 2];
      const growthRate = ((latest.data - previous.data) / previous.data) * 100;
      
      if (growthRate > 10) {
        insights.push(`Strong user growth detected: ${growthRate.toFixed(1)}% increase`);
      } else if (growthRate < -10) {
        insights.push(`User growth concern: ${Math.abs(growthRate).toFixed(1)}% decrease`);
      }
    }
    
    // Anomaly insights
    const criticalAnomalies = anomalies.filter(a => a.severity === 'critical');
    if (criticalAnomalies.length > 0) {
      insights.push(`${criticalAnomalies.length} critical anomalies require attention`);
    }
    
    // Activity insights
    const eventsPerSecond = dashboardData.realTimeMetrics.eventsPerSecond;
    if (eventsPerSecond > 10) {
      insights.push('High system activity detected - consider scaling resources');
    }
    
    return insights.length > 0 ? insights : ['No significant insights for this period'];
  }

  async getReports(limit: number = 50): Promise<AnalyticsReport[]> {
    return this.analyticsReportRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}