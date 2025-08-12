# Automerge-Pro Analytics Platform

## Overview

The Automerge-Pro Analytics Platform is a comprehensive real-time analytics system designed to track, analyze, and report on key performance indicators for your development workflow. This platform provides deep insights into user behavior, system performance, and business metrics through advanced anomaly detection and automated reporting.

## Architecture

### Infrastructure Components

- **AWS Lambda Functions**: Serverless event processing
  - Install tracking
  - Merge tracking  
  - Billing events
  - Onboarding milestones
  - Anomaly detection
  - Report generation

- **Amazon Kinesis Data Streams**: Real-time data ingestion and processing
- **DynamoDB**: Scalable NoSQL storage for events and configurations
- **S3**: Storage for generated reports and data archives
- **SNS**: Notification delivery for alerts and reports
- **CloudWatch**: Monitoring and logging

### Backend Services

- **NestJS Analytics Module**: Core analytics processing engine
- **Anomaly Detection Service**: ML-powered anomaly detection
- **Report Generation Service**: Automated PDF report creation
- **Alerting Service**: Multi-channel notification system
- **Kinesis Service**: Stream processing integration

## Data Schemas

### Event Schema

```typescript
interface AnalyticsEvent {
  eventType: 'install' | 'merge' | 'billing' | 'onboarding';
  timestamp: string;
  userId?: string;
  sessionId?: string;
  eventData: any;
  metadata?: any;
}
```

### Install Event
```json
{
  "eventType": "install",
  "timestamp": "2024-01-15T10:30:00Z",
  "userId": "user123",
  "version": "2.1.4",
  "platform": "web",
  "source": "organic",
  "metadata": {
    "installationId": "install-123456",
    "userAgent": "Mozilla/5.0...",
    "geolocation": "US",
    "deviceInfo": {...}
  }
}
```

### Merge Event
```json
{
  "eventType": "merge",
  "timestamp": "2024-01-15T10:35:00Z",
  "userId": "user123",
  "repositoryId": "repo456",
  "mergeType": "pull_request",
  "metadata": {
    "pullRequestId": "pr789",
    "branchName": "feature-branch",
    "commitSha": "abc123def456",
    "linesAdded": 150,
    "linesDeleted": 25,
    "reviewers": ["reviewer1", "reviewer2"]
  }
}
```

### Billing Event
```json
{
  "eventType": "billing",
  "timestamp": "2024-01-15T10:40:00Z",
  "userId": "user123",
  "customerId": "cust_456",
  "billingEventType": "payment_succeeded",
  "amount": 2999,
  "currency": "usd",
  "metadata": {
    "subscriptionId": "sub_789",
    "invoiceId": "inv_012",
    "planId": "plan_pro"
  }
}
```

### Onboarding Event
```json
{
  "eventType": "onboarding",
  "timestamp": "2024-01-15T10:25:00Z",
  "userId": "user123",
  "milestoneType": "profile_completed",
  "stepNumber": 3,
  "totalSteps": 10,
  "metadata": {
    "category": "profile_setup",
    "timeSpent": 120,
    "helpUsed": false,
    "skipped": false
  }
}
```

## Anomaly Detection

### Detection Algorithms

1. **Statistical Anomaly Detection**
   - Z-score based threshold detection
   - Moving average baseline calculation
   - Seasonal trend analysis

2. **Metrics Monitored**
   - User signup rates
   - Error rates
   - Response times
   - Billing failures
   - Merge conflicts

### Alert Severities

- **Critical**: Immediate attention required (>4 standard deviations)
- **High**: Significant deviation (>3 standard deviations)
- **Medium**: Notable change (>2.5 standard deviations)
- **Low**: Minor deviation (>2 standard deviations)

## Dashboard Features

### Real-time View
- Live system metrics
- Active user counts
- Response time monitoring
- Server performance indicators

### Analytics Dashboard
- User growth trends
- Event volume analysis
- Revenue metrics
- Feature adoption rates

### Anomaly Center
- Active alerts management
- Historical anomaly analysis
- Severity-based filtering
- Acknowledgment workflow

## API Endpoints

### Event Tracking
```bash
POST /api/analytics/events
Content-Type: application/json

{
  "eventType": "install",
  "userId": "user123",
  "data": {...},
  "metadata": {...}
}
```

### Metrics Query
```bash
GET /api/analytics/metrics
?startDate=2024-01-01T00:00:00Z
&endDate=2024-01-31T23:59:59Z
&eventTypes=install,merge
&groupBy=day
&metrics=count,uniqueUsers
```

### Dashboard Data
```bash
GET /api/analytics/dashboard
```

### Anomalies
```bash
GET /api/analytics/anomalies?limit=50
PATCH /api/analytics/anomalies/:id/acknowledge
```

## Deployment

### Prerequisites
- AWS CLI configured
- SAM CLI installed
- Node.js 18+
- TypeScript
- PostgreSQL database

### Infrastructure Deployment

1. **Deploy AWS Infrastructure**
```bash
cd infrastructure/aws-sam
sam build
sam deploy --guided
```

2. **Configure Environment Variables**
```bash
export KINESIS_STREAM_NAME=automerge-analytics-prod
export SLACK_WEBHOOK_URL=https://hooks.slack.com/...
export EMAIL_SNS_TOPIC=arn:aws:sns:...
```

3. **Deploy Backend Services**
```bash
cd backend
npm install
npm run build
npm run start:prod
```

### Frontend Integration

Include the analytics tracking in your frontend application:

```typescript
import { trackEvent } from './services/analytics';

// Track user installation
await trackEvent({
  eventType: 'install',
  userId: user.id,
  data: {
    version: app.version,
    platform: 'web',
    source: 'organic'
  }
});

// Track merge completion
await trackEvent({
  eventType: 'merge', 
  userId: user.id,
  data: {
    repositoryId: repo.id,
    mergeType: 'pull_request',
    success: true
  }
});
```

## Monitoring & Alerts

### Slack Integration
Configure Slack webhook URL for real-time alerts:
- Anomaly notifications
- System status updates
- Report generation notifications

### Email Alerts
Set up SNS topics for email notifications:
- Critical anomalies
- Weekly report distribution
- System health summaries

### Metrics to Monitor

1. **User Metrics**
   - Daily/Monthly active users
   - New user signups
   - User retention rates
   - Churn analysis

2. **System Metrics**
   - API response times
   - Error rates
   - Throughput (requests/second)
   - System availability

3. **Business Metrics**
   - Revenue growth
   - Conversion rates
   - Feature adoption
   - Support ticket volume

## Report Generation

### Automated Reports
- **Weekly**: Every Monday at 9 AM UTC
- **Monthly**: First day of each month
- **Custom**: On-demand generation via API

### Report Contents
- Executive summary
- User growth analysis
- Revenue metrics
- System performance
- Anomaly summary
- Key insights and recommendations

### Distribution
- Slack notifications with download links
- Email delivery to stakeholders
- S3 storage with presigned URLs
- PDF format with charts and visualizations

## Security

### Data Protection
- Encryption at rest (S3, DynamoDB)
- Encryption in transit (HTTPS, TLS)
- IAM-based access control
- VPC isolation for sensitive components

### Privacy Compliance
- User data anonymization options
- GDPR compliance features
- Data retention policies
- Audit logging

## Troubleshooting

### Common Issues

1. **Lambda Function Timeouts**
   - Check CloudWatch logs
   - Increase memory allocation
   - Optimize processing logic

2. **Kinesis Stream Throttling**
   - Monitor shard utilization
   - Increase shard count if needed
   - Implement exponential backoff

3. **Anomaly False Positives**
   - Adjust detection thresholds
   - Review baseline calculations
   - Add metric-specific configurations

### Monitoring Commands

```bash
# Check Lambda function logs
aws logs tail /aws/lambda/InstallTrackingFunction --follow

# Monitor Kinesis stream metrics
aws kinesis describe-stream --stream-name automerge-analytics-prod

# View anomaly alerts
curl -H "Authorization: Bearer $TOKEN" \
  https://api.automerge.com/analytics/anomalies
```

## Contributing

### Development Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run tests: `npm test`
5. Start development server: `npm run dev`

### Code Standards
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Jest testing framework
- Documentation for public APIs

For detailed API documentation, see `/docs/api.md`
For infrastructure details, see `/infrastructure/README.md`