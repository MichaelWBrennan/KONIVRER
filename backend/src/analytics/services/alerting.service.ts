import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AnomalyAlert } from '../entities/anomaly-alert.entity';
import { AnalyticsReport } from '../entities/analytics-report.entity';

interface SlackMessage {
  text: string;
  attachments?: SlackAttachment[];
}

interface SlackAttachment {
  color: string;
  title: string;
  text: string;
  fields: SlackField[];
  footer?: string;
  ts?: number;
}

interface SlackField {
  title: string;
  value: string;
  short: boolean;
}

@Injectable()
export class AlertingService {
  private readonly logger = new Logger(AlertingService.name);
  private readonly slackWebhookUrl: string;
  private readonly emailEnabled: boolean;

  constructor(private configService: ConfigService) {
    this.slackWebhookUrl = this.configService.get('SLACK_WEBHOOK_URL');
    this.emailEnabled = this.configService.get('EMAIL_ALERTS_ENABLED', 'false') === 'true';
  }

  async sendAnomalyAlert(alert: AnomalyAlert): Promise<void> {
    try {
      // Send to Slack
      if (this.slackWebhookUrl) {
        await this.sendSlackAlert(alert);
        alert.slackNotified = true;
      }

      // Send email alert for high/critical severity
      if (this.emailEnabled && ['high', 'critical'].includes(alert.severity)) {
        await this.sendEmailAlert(alert);
        alert.emailNotified = true;
      }
    } catch (error) {
      this.logger.error(`Failed to send anomaly alert: ${error.message}`);
    }
  }

  private async sendSlackAlert(alert: AnomalyAlert): Promise<void> {
    const color = this.getSeverityColor(alert.severity);
    const emoji = this.getSeverityEmoji(alert.severity);
    
    const message: SlackMessage = {
      text: `${emoji} Anomaly Detection Alert`,
      attachments: [
        {
          color,
          title: `${alert.alertType.toUpperCase()} detected in ${alert.metric}`,
          text: alert.description,
          fields: [
            {
              title: 'Current Value',
              value: alert.currentValue.toFixed(2),
              short: true,
            },
            {
              title: 'Expected Value',
              value: alert.expectedValue.toFixed(2),
              short: true,
            },
            {
              title: 'Deviation',
              value: `${alert.deviationPercentage.toFixed(1)}%`,
              short: true,
            },
            {
              title: 'Severity',
              value: alert.severity.toUpperCase(),
              short: true,
            },
            {
              title: 'Detection Time',
              value: alert.createdAt.toISOString(),
              short: false,
            },
          ],
          footer: 'Automerge Analytics',
          ts: Math.floor(alert.createdAt.getTime() / 1000),
        },
      ],
    };

    await this.sendToSlack(message);
  }

  private async sendEmailAlert(alert: AnomalyAlert): Promise<void> {
    // Implementation would depend on your email service (SES, SendGrid, etc.)
    // For now, just log the alert details
    this.logger.warn(`EMAIL ALERT: ${alert.severity.toUpperCase()} anomaly in ${alert.metric}: ${alert.description}`);
  }

  async sendReportNotification(report: AnalyticsReport, downloadUrl: string): Promise<void> {
    try {
      if (this.slackWebhookUrl) {
        await this.sendSlackReportNotification(report, downloadUrl);
      }

      if (this.emailEnabled) {
        await this.sendEmailReportNotification(report, downloadUrl);
      }
    } catch (error) {
      this.logger.error(`Failed to send report notification: ${error.message}`);
    }
  }

  private async sendSlackReportNotification(report: AnalyticsReport, downloadUrl: string): Promise<void> {
    const message: SlackMessage = {
      text: '📊 Analytics Report Generated',
      attachments: [
        {
          color: '#36a64f',
          title: report.title,
          text: report.description || 'Your scheduled analytics report is ready',
          fields: [
            {
              title: 'Report Type',
              value: report.reportType.toUpperCase(),
              short: true,
            },
            {
              title: 'Period',
              value: `${report.periodStart.toISOString().split('T')[0]} - ${report.periodEnd.toISOString().split('T')[0]}`,
              short: true,
            },
            {
              title: 'Generated',
              value: report.generatedAt?.toISOString() || 'Just now',
              short: true,
            },
            {
              title: 'File Size',
              value: report.fileSize ? this.formatFileSize(Number(report.fileSize)) : 'Unknown',
              short: true,
            },
            {
              title: 'Download',
              value: `<${downloadUrl}|Download PDF Report>`,
              short: false,
            },
          ],
          footer: 'Automerge Analytics',
          ts: Math.floor((report.generatedAt || new Date()).getTime() / 1000),
        },
      ],
    };

    await this.sendToSlack(message);
  }

  private async sendEmailReportNotification(report: AnalyticsReport, downloadUrl: string): Promise<void> {
    this.logger.log(`EMAIL REPORT: ${report.title} report generated. Download: ${downloadUrl}`);
  }

  async sendSystemAlert(title: string, message: string, severity: 'info' | 'warning' | 'error' = 'info'): Promise<void> {
    try {
      if (this.slackWebhookUrl) {
        const color = severity === 'error' ? '#ff0000' : severity === 'warning' ? '#ffa500' : '#36a64f';
        const emoji = severity === 'error' ? '🚨' : severity === 'warning' ? '⚠️' : 'ℹ️';
        
        const slackMessage: SlackMessage = {
          text: `${emoji} System Alert`,
          attachments: [
            {
              color,
              title,
              text: message,
              footer: 'Automerge Analytics',
              ts: Math.floor(Date.now() / 1000),
            },
          ],
        };

        await this.sendToSlack(slackMessage);
      }
    } catch (error) {
      this.logger.error(`Failed to send system alert: ${error.message}`);
    }
  }

  private async sendToSlack(message: SlackMessage): Promise<void> {
    try {
      const response = await fetch(this.slackWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        throw new Error(`Slack webhook returned ${response.status}: ${response.statusText}`);
      }

      this.logger.log('Slack notification sent successfully');
    } catch (error) {
      this.logger.error(`Failed to send Slack notification: ${error.message}`);
      throw error;
    }
  }

  private getSeverityColor(severity: string): string {
    switch (severity) {
      case 'critical':
        return '#ff0000';
      case 'high':
        return '#ff8c00';
      case 'medium':
        return '#ffa500';
      case 'low':
        return '#ffff00';
      default:
        return '#36a64f';
    }
  }

  private getSeverityEmoji(severity: string): string {
    switch (severity) {
      case 'critical':
        return '🚨';
      case 'high':
        return '⚠️';
      case 'medium':
        return '📊';
      case 'low':
        return 'ℹ️';
      default:
        return '📈';
    }
  }

  private formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }
}