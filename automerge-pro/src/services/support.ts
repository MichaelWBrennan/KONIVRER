import { DynamoDB } from 'aws-sdk';
import { GitHubService } from './github';
import { MonitoringService } from './monitoring';

export interface SupportTicket {
  ticketId: string;
  installationId: number;
  userId?: string;
  subject: string;
  description: string;
  category: 'bug' | 'feature_request' | 'configuration_help' | 'billing' | 'general';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  resolution?: string;
  satisfactionRating?: number;
  metadata: any;
}

export interface FeedbackSubmission {
  feedbackId: string;
  installationId: number;
  type: 'bug_report' | 'feature_request' | 'general_feedback' | 'satisfaction_survey';
  rating: number; // 1-5 scale
  message: string;
  category: string;
  metadata: {
    userAgent?: string;
    version?: string;
    repository?: string;
    configuration?: any;
  };
  createdAt: Date;
  processed: boolean;
}

export interface SupportMetrics {
  totalTickets: number;
  openTickets: number;
  averageResolutionTime: number;
  satisfactionScore: number;
  categoryBreakdown: { [category: string]: number };
  priorityBreakdown: { [priority: string]: number };
  monthlyTrends: Array<{ month: string; tickets: number; resolved: number }>;
}

export class SupportService {
  private dynamodb: DynamoDB.DocumentClient;
  private githubService: GitHubService;
  private monitoring: MonitoringService;
  private ticketsTable: string;
  private feedbackTable: string;

  constructor(
    githubService: GitHubService,
    ticketsTable: string = 'automerge-pro-tickets',
    feedbackTable: string = 'automerge-pro-feedback'
  ) {
    this.dynamodb = new DynamoDB.DocumentClient();
    this.githubService = githubService;
    this.monitoring = new MonitoringService();
    this.ticketsTable = ticketsTable;
    this.feedbackTable = feedbackTable;
  }

  async submitFeedback(feedback: Omit<FeedbackSubmission, 'feedbackId' | 'createdAt' | 'processed'>): Promise<string> {
    const feedbackId = this.generateFeedbackId();
    const submission: FeedbackSubmission = {
      feedbackId,
      createdAt: new Date(),
      processed: false,
      ...feedback
    };

    try {
      await this.dynamodb.put({
        TableName: this.feedbackTable,
        Item: {
          ...submission,
          createdAt: submission.createdAt.toISOString()
        }
      }).promise();

      // Track in analytics
      await this.monitoring.publishMetric({
        name: 'FeedbackSubmitted',
        value: 1,
        unit: 'Count',
        dimensions: {
          Type: feedback.type,
          Rating: feedback.rating.toString()
        }
      });

      // Auto-create ticket for bugs and feature requests
      if (feedback.type === 'bug_report' || feedback.type === 'feature_request') {
        await this.autoCreateTicketFromFeedback(submission);
      }

      // Auto-create GitHub issue for bugs if configured
      if (feedback.type === 'bug_report' && process.env.AUTO_CREATE_GITHUB_ISSUES === 'true') {
        await this.createGitHubIssueFromFeedback(submission);
      }

      return feedbackId;
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      throw error;
    }
  }

  async createSupportTicket(ticket: Omit<SupportTicket, 'ticketId' | 'createdAt' | 'updatedAt' | 'status'>): Promise<string> {
    const ticketId = this.generateTicketId();
    const supportTicket: SupportTicket = {
      ticketId,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...ticket
    };

    try {
      await this.dynamodb.put({
        TableName: this.ticketsTable,
        Item: {
          ...supportTicket,
          createdAt: supportTicket.createdAt.toISOString(),
          updatedAt: supportTicket.updatedAt.toISOString()
        }
      }).promise();

      // Send notification to support team
      await this.notifySupportTeam(supportTicket);

      // Track metrics
      await this.monitoring.publishMetric({
        name: 'SupportTicketCreated',
        value: 1,
        unit: 'Count',
        dimensions: {
          Category: ticket.category,
          Priority: ticket.priority
        }
      });

      return ticketId;
    } catch (error) {
      console.error('Failed to create support ticket:', error);
      throw error;
    }
  }

  async updateTicketStatus(ticketId: string, status: SupportTicket['status'], resolution?: string): Promise<void> {
    try {
      const updateParams: any = {
        TableName: this.ticketsTable,
        Key: { ticketId },
        UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
        ExpressionAttributeNames: {
          '#status': 'status'
        },
        ExpressionAttributeValues: {
          ':status': status,
          ':updatedAt': new Date().toISOString()
        }
      };

      if (resolution) {
        updateParams.UpdateExpression += ', resolution = :resolution';
        updateParams.ExpressionAttributeValues[':resolution'] = resolution;
      }

      await this.dynamodb.update(updateParams).promise();

      // Track resolution if ticket is being closed
      if (status === 'resolved' || status === 'closed') {
        await this.monitoring.publishMetric({
          name: 'SupportTicketResolved',
          value: 1,
          unit: 'Count'
        });
      }
    } catch (error) {
      console.error('Failed to update ticket status:', error);
      throw error;
    }
  }

  async getTicketsByInstallation(installationId: number): Promise<SupportTicket[]> {
    try {
      const { Items } = await this.dynamodb.query({
        TableName: this.ticketsTable,
        IndexName: 'InstallationIdIndex', // Assumes GSI exists
        KeyConditionExpression: 'installationId = :installationId',
        ExpressionAttributeValues: {
          ':installationId': installationId
        },
        ScanIndexForward: false // Latest first
      }).promise();

      return Items as SupportTicket[];
    } catch (error) {
      console.error('Failed to get tickets by installation:', error);
      return [];
    }
  }

  async getFeedbackByInstallation(installationId: number): Promise<FeedbackSubmission[]> {
    try {
      const { Items } = await this.dynamodb.query({
        TableName: this.feedbackTable,
        IndexName: 'InstallationIdIndex', // Assumes GSI exists
        KeyConditionExpression: 'installationId = :installationId',
        ExpressionAttributeValues: {
          ':installationId': installationId
        },
        ScanIndexForward: false // Latest first
      }).promise();

      return Items as FeedbackSubmission[];
    } catch (error) {
      console.error('Failed to get feedback by installation:', error);
      return [];
    }
  }

  async getSupportMetrics(period: 'week' | 'month' | 'quarter' = 'month'): Promise<SupportMetrics> {
    const startDate = this.getPeriodStartDate(period);
    
    try {
      // Get all tickets in the period
      const { Items } = await this.dynamodb.scan({
        TableName: this.ticketsTable,
        FilterExpression: 'createdAt >= :startDate',
        ExpressionAttributeValues: {
          ':startDate': startDate.toISOString()
        }
      }).promise();

      const tickets = Items as SupportTicket[];
      
      // Get all feedback for satisfaction scores
      const { Items: feedbackItems } = await this.dynamodb.scan({
        TableName: this.feedbackTable,
        FilterExpression: 'createdAt >= :startDate AND satisfactionRating > :zero',
        ExpressionAttributeValues: {
          ':startDate': startDate.toISOString(),
          ':zero': 0
        }
      }).promise();

      const feedback = feedbackItems as FeedbackSubmission[];

      return this.calculateSupportMetrics(tickets, feedback);
    } catch (error) {
      console.error('Failed to get support metrics:', error);
      throw error;
    }
  }

  async generateWeeklySummary(): Promise<string> {
    const metrics = await this.getSupportMetrics('week');
    const recentTickets = await this.getRecentHighPriorityTickets();
    const satisfactionFeedback = await this.getRecentSatisfactionFeedback();

    const summary = `
# Weekly Support Summary - ${new Date().toISOString().split('T')[0]}

## Key Metrics
- **Total Tickets**: ${metrics.totalTickets}
- **Open Tickets**: ${metrics.openTickets}
- **Average Resolution Time**: ${Math.round(metrics.averageResolutionTime)} hours
- **Satisfaction Score**: ${metrics.satisfactionScore.toFixed(1)}/5.0

## Category Breakdown
${Object.entries(metrics.categoryBreakdown)
  .map(([category, count]) => `- ${category}: ${count}`)
  .join('\n')}

## Priority Distribution
${Object.entries(metrics.priorityBreakdown)
  .map(([priority, count]) => `- ${priority}: ${count}`)
  .join('\n')}

## High Priority Issues
${recentTickets.map(ticket => 
  `- [${ticket.ticketId}] ${ticket.subject} (${ticket.priority})`
).join('\n') || 'None'}

## Recent Feedback Highlights
${satisfactionFeedback.map(fb => 
  `- Rating: ${fb.rating}/5 - "${fb.message}"`
).join('\n') || 'No recent feedback'}

---
Generated by Automerge-Pro Support System
`;

    return summary;
  }

  async autoTriage(ticket: SupportTicket): Promise<void> {
    // Auto-assign priority based on keywords and category
    let suggestedPriority = ticket.priority;
    
    const criticalKeywords = ['critical', 'urgent', 'down', 'broken', 'security', 'data loss'];
    const highKeywords = ['important', 'blocking', 'error', 'bug', 'broken'];
    
    const content = (ticket.subject + ' ' + ticket.description).toLowerCase();
    
    if (criticalKeywords.some(keyword => content.includes(keyword))) {
      suggestedPriority = 'critical';
    } else if (highKeywords.some(keyword => content.includes(keyword))) {
      suggestedPriority = 'high';
    }

    // Auto-assign category-specific tags
    const suggestedTags = [...ticket.tags];
    if (content.includes('configuration') || content.includes('yaml')) {
      suggestedTags.push('configuration');
    }
    if (content.includes('webhook') || content.includes('event')) {
      suggestedTags.push('webhooks');
    }
    if (content.includes('license') || content.includes('billing')) {
      suggestedTags.push('billing');
    }

    // Update if suggestions differ
    if (suggestedPriority !== ticket.priority || suggestedTags.length > ticket.tags.length) {
      await this.dynamodb.update({
        TableName: this.ticketsTable,
        Key: { ticketId: ticket.ticketId },
        UpdateExpression: 'SET priority = :priority, tags = :tags, updatedAt = :updatedAt',
        ExpressionAttributeValues: {
          ':priority': suggestedPriority,
          ':tags': suggestedTags,
          ':updatedAt': new Date().toISOString()
        }
      }).promise();
    }
  }

  private async autoCreateTicketFromFeedback(feedback: FeedbackSubmission): Promise<string> {
    const ticket: Omit<SupportTicket, 'ticketId' | 'createdAt' | 'updatedAt' | 'status'> = {
      installationId: feedback.installationId,
      subject: feedback.type === 'bug_report' 
        ? `Bug Report: ${feedback.message.substring(0, 50)}...`
        : `Feature Request: ${feedback.message.substring(0, 50)}...`,
      description: `Auto-generated from feedback submission ${feedback.feedbackId}\n\n${feedback.message}`,
      category: feedback.type === 'bug_report' ? 'bug' : 'feature_request',
      priority: feedback.rating <= 2 ? 'high' : 'medium',
      tags: ['auto-generated', `rating-${feedback.rating}`],
      metadata: {
        source: 'feedback',
        feedbackId: feedback.feedbackId,
        ...feedback.metadata
      }
    };

    return await this.createSupportTicket(ticket);
  }

  private async createGitHubIssueFromFeedback(feedback: FeedbackSubmission): Promise<void> {
    try {
      // This would create an issue in the Automerge-Pro repository
      // Implementation depends on having repository write access
      const title = feedback.type === 'bug_report' 
        ? `Bug: ${feedback.message.substring(0, 50)}...`
        : `Feature: ${feedback.message.substring(0, 50)}...`;
      
      const body = `
**Auto-generated from user feedback**

**Feedback ID**: ${feedback.feedbackId}
**Installation**: ${feedback.installationId}
**Rating**: ${feedback.rating}/5
**Type**: ${feedback.type}

**Description**:
${feedback.message}

**Metadata**:
\`\`\`json
${JSON.stringify(feedback.metadata, null, 2)}
\`\`\`

---
*This issue was automatically created from user feedback.*
      `;

      // Would call GitHub API to create issue
      console.log('Would create GitHub issue:', { title, body });
    } catch (error) {
      console.error('Failed to create GitHub issue:', error);
    }
  }

  private async notifySupportTeam(ticket: SupportTicket): Promise<void> {
    // Send notification via configured channels (Slack, email, etc.)
    const message = `
🎫 New Support Ticket Created

**Ticket ID**: ${ticket.ticketId}
**Priority**: ${ticket.priority}
**Category**: ${ticket.category}
**Subject**: ${ticket.subject}

${ticket.description}

**Installation**: ${ticket.installationId}
**Created**: ${ticket.createdAt.toISOString()}
    `;

    if (process.env.SUPPORT_SLACK_WEBHOOK) {
      // Send to Slack
      // Implementation would use fetch to post to webhook
      console.log('Would send to Slack:', message);
    }

    if (process.env.SUPPORT_EMAIL) {
      // Send email notification
      console.log('Would send email notification:', message);
    }
  }

  private calculateSupportMetrics(tickets: SupportTicket[], feedback: FeedbackSubmission[]): SupportMetrics {
    const totalTickets = tickets.length;
    const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;
    
    // Calculate resolution time for resolved tickets
    const resolvedTickets = tickets.filter(t => t.status === 'resolved' || t.status === 'closed');
    const totalResolutionTime = resolvedTickets.reduce((sum, ticket) => {
      const resolutionTime = new Date(ticket.updatedAt).getTime() - new Date(ticket.createdAt).getTime();
      return sum + (resolutionTime / (1000 * 60 * 60)); // Convert to hours
    }, 0);
    
    const averageResolutionTime = resolvedTickets.length > 0 ? totalResolutionTime / resolvedTickets.length : 0;
    
    // Calculate satisfaction score
    const ratingsSum = feedback.reduce((sum, fb) => sum + fb.rating, 0);
    const satisfactionScore = feedback.length > 0 ? ratingsSum / feedback.length : 0;
    
    // Category and priority breakdowns
    const categoryBreakdown: { [key: string]: number } = {};
    const priorityBreakdown: { [key: string]: number } = {};
    
    tickets.forEach(ticket => {
      categoryBreakdown[ticket.category] = (categoryBreakdown[ticket.category] || 0) + 1;
      priorityBreakdown[ticket.priority] = (priorityBreakdown[ticket.priority] || 0) + 1;
    });

    return {
      totalTickets,
      openTickets,
      averageResolutionTime,
      satisfactionScore,
      categoryBreakdown,
      priorityBreakdown,
      monthlyTrends: [] // Would be calculated from historical data
    };
  }

  private async getRecentHighPriorityTickets(): Promise<SupportTicket[]> {
    try {
      const { Items } = await this.dynamodb.scan({
        TableName: this.ticketsTable,
        FilterExpression: '#status IN (:open, :inProgress) AND priority IN (:high, :critical)',
        ExpressionAttributeNames: {
          '#status': 'status'
        },
        ExpressionAttributeValues: {
          ':open': 'open',
          ':inProgress': 'in_progress',
          ':high': 'high',
          ':critical': 'critical'
        }
      }).promise();

      return Items as SupportTicket[];
    } catch (error) {
      console.error('Failed to get high priority tickets:', error);
      return [];
    }
  }

  private async getRecentSatisfactionFeedback(): Promise<FeedbackSubmission[]> {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    try {
      const { Items } = await this.dynamodb.scan({
        TableName: this.feedbackTable,
        FilterExpression: 'createdAt >= :weekAgo AND rating > :zero',
        ExpressionAttributeValues: {
          ':weekAgo': weekAgo.toISOString(),
          ':zero': 0
        }
      }).promise();

      return Items as FeedbackSubmission[];
    } catch (error) {
      console.error('Failed to get satisfaction feedback:', error);
      return [];
    }
  }

  private generateTicketId(): string {
    return `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }

  private generateFeedbackId(): string {
    return `FB-${Date.now()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
  }

  private getPeriodStartDate(period: 'week' | 'month' | 'quarter'): Date {
    const now = new Date();
    switch (period) {
      case 'week':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'month':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case 'quarter':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
  }
}