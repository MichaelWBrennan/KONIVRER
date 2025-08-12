# Automerge-Pro API Reference

## Overview

The Automerge-Pro API provides comprehensive endpoints for pull request automation, license management, analytics, and support. All endpoints require proper authentication and are subject to rate limiting.

Base URL: `https://api.automerge-pro.com/v1`

## Authentication

Most endpoints require installation-based authentication using GitHub App credentials or API keys.

## Core Endpoints

### Health Check
```
GET /health
```

Returns system health status and version information.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "service": "automerge-pro",
  "version": "1.0.0",
  "environment": "production",
  "checks": {
    "database": "healthy",
    "github": "healthy",
    "monitoring": "healthy"
  }
}
```

### Webhook Handler
```
POST /webhook
```

Handles GitHub webhook events for pull request automation.

**Headers:**
- `X-GitHub-Event`: Event type
- `X-GitHub-Delivery`: Delivery ID
- `X-Hub-Signature-256`: Webhook signature

**Response:**
```json
{
  "success": true
}
```

## License Management

### Validate License
```
GET /validate-license/{installationId}
```

Validates and returns license information for an installation.

**Parameters:**
- `installationId` (integer): GitHub installation ID

**Response:**
```json
{
  "valid": true,
  "tier": "pro",
  "features": ["basic_merge", "status_checks", "advanced_rules", "notifications"],
  "expiresAt": "2024-12-31T23:59:59Z",
  "trialEndsAt": null
}
```

### Generate Development License
```
POST /dev/generate-license
```

Generates a development license (development environment only).

**Request Body:**
```json
{
  "installationId": 12345,
  "tier": "enterprise"
}
```

**Response:**
```json
{
  "success": true,
  "license": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "installationId": 12345,
  "tier": "enterprise",
  "message": "Development license generated successfully"
}
```

## Configuration Management

### Get Sample Configuration
```
GET /config/sample/{tier}
```

Returns a sample configuration file for the specified tier.

**Parameters:**
- `tier` (string): One of `free`, `pro`, `enterprise`

**Response:** YAML configuration file

### Validate Configuration
```
POST /config/validate
```

Validates a repository's Automerge-Pro configuration.

**Request Body:**
```json
{
  "installationId": 12345,
  "owner": "myorg",
  "repo": "myrepo"
}
```

**Response:**
```json
{
  "valid": true,
  "errors": [],
  "warnings": [
    "Advanced rules require Pro or Enterprise tier"
  ],
  "config": {
    "version": "2.0",
    "rules": [...],
    "conditions": {...}
  }
}
```

## Analytics & Monitoring

### Dashboard Data
```
GET /analytics/dashboard?installationId={id}
```

Returns dashboard data for monitoring and analytics (Pro+ feature).

**Parameters:**
- `installationId` (integer): GitHub installation ID

**Response:**
```json
{
  "overview": {
    "totalInstallations": 150,
    "activeLicenses": 145,
    "pullRequestsProcessed24h": 1250,
    "averageProcessingTime": 2.3,
    "successRate": 94.5
  },
  "metrics": {
    "installationGrowth": [...],
    "processingVolume": [...],
    "successRates": [...],
    "tierDistribution": {
      "free": 60,
      "pro": 30,
      "enterprise": 10
    }
  },
  "alerts": [...]
}
```

### Usage Metrics
```
GET /analytics/usage/{installationId}?period={period}
```

Returns detailed usage metrics for an installation.

**Parameters:**
- `installationId` (integer): GitHub installation ID
- `period` (string): One of `daily`, `weekly`, `monthly`

**Response:**
```json
{
  "installationId": 12345,
  "period": "monthly",
  "pullRequestsProcessed": 150,
  "mergesSuccessful": 142,
  "mergesFailed": 8,
  "averageProcessingTime": 2.1,
  "rulesTriggered": {
    "auto-merge-feature": 95,
    "security-approved": 12,
    "docs-only": 43
  },
  "featuresUsed": {
    "advanced_rules": 85,
    "notifications": 23,
    "custom_actions": 12
  }
}
```

## Support & Feedback

### Submit Feedback
```
POST /submit-feedback
```

Submits user feedback for bugs, feature requests, or general comments.

**Request Body:**
```json
{
  "installationId": 12345,
  "type": "bug_report",
  "rating": 4,
  "message": "The auto-merge feature works great but could use better error messages.",
  "category": "user_experience",
  "metadata": {
    "userAgent": "Mozilla/5.0...",
    "version": "1.0.0",
    "repository": "myorg/myrepo"
  }
}
```

**Response:**
```json
{
  "success": true,
  "feedbackId": "FB-1642248000-A1B2C3D4"
}
```

### Create Support Ticket
```
POST /support/ticket
```

Creates a new support ticket.

**Request Body:**
```json
{
  "installationId": 12345,
  "subject": "Configuration not working",
  "description": "Detailed description of the issue...",
  "category": "configuration_help",
  "priority": "medium",
  "tags": ["configuration", "yaml"]
}
```

**Response:**
```json
{
  "success": true,
  "ticketId": "TKT-1642248000-ABC123"
}
```

### Get Support Tickets
```
GET /support/tickets/{installationId}
```

Returns support tickets for an installation.

**Parameters:**
- `installationId` (integer): GitHub installation ID

**Response:**
```json
[
  {
    "ticketId": "TKT-1642248000-ABC123",
    "subject": "Configuration not working",
    "status": "open",
    "priority": "medium",
    "category": "configuration_help",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

## Administrative Endpoints

### Support Metrics
```
GET /admin/metrics
```

Returns administrative support metrics (requires admin authentication).

**Response:**
```json
{
  "totalTickets": 245,
  "openTickets": 23,
  "averageResolutionTime": 18.5,
  "satisfactionScore": 4.3,
  "categoryBreakdown": {
    "bug": 45,
    "feature_request": 89,
    "configuration_help": 67,
    "billing": 23,
    "general": 21
  },
  "priorityBreakdown": {
    "low": 123,
    "medium": 89,
    "high": 28,
    "critical": 5
  }
}
```

## Error Responses

All endpoints may return standard HTTP error responses:

### 400 Bad Request
```json
{
  "error": "Missing required parameters: installationId, owner, repo"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid signature"
}
```

### 403 Forbidden
```json
{
  "error": "Analytics requires Pro or Enterprise tier"
}
```

### 404 Not Found
```json
{
  "error": "License not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Something went wrong"
}
```

## Rate Limiting

All endpoints are subject to rate limiting:

- **Free Tier**: 100 requests per hour
- **Pro Tier**: 1,000 requests per hour  
- **Enterprise Tier**: 10,000 requests per hour

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Request limit per hour
- `X-RateLimit-Remaining`: Requests remaining in current window
- `X-RateLimit-Reset`: Time when the rate limit resets (Unix timestamp)

## Webhook Events

Automerge-Pro listens for the following GitHub webhook events:

### pull_request
Triggered when pull requests are opened, updated, or synchronized.

### check_run / check_suite
Triggered when status checks complete, used for auto-merge evaluation.

### marketplace_purchase
Triggered when users purchase, change, or cancel marketplace subscriptions.

### installation
Triggered when the GitHub App is installed or uninstalled.

## SDK Examples

### JavaScript/Node.js
```javascript
const AutomergePro = require('@automerge-pro/sdk');

const client = new AutomergePro({
  baseURL: 'https://api.automerge-pro.com/v1',
  apiKey: 'your-api-key'
});

// Validate license
const license = await client.validateLicense(12345);

// Submit feedback
const feedback = await client.submitFeedback({
  installationId: 12345,
  type: 'feature_request',
  rating: 5,
  message: 'Great tool! Would love to see more merge strategies.'
});
```

### Python
```python
from automerge_pro import Client

client = Client(
    base_url='https://api.automerge-pro.com/v1',
    api_key='your-api-key'
)

# Get usage metrics
metrics = client.get_usage_metrics(12345, period='monthly')

# Create support ticket
ticket = client.create_support_ticket(
    installation_id=12345,
    subject='Need help with configuration',
    description='Detailed issue description...',
    category='configuration_help'
)
```

### cURL Examples
```bash
# Health check
curl -X GET https://api.automerge-pro.com/v1/health

# Validate license
curl -X GET https://api.automerge-pro.com/v1/validate-license/12345

# Submit feedback
curl -X POST https://api.automerge-pro.com/v1/submit-feedback \
  -H "Content-Type: application/json" \
  -d '{
    "installationId": 12345,
    "type": "bug_report",
    "rating": 3,
    "message": "Found a bug in the configuration parser"
  }'

# Get sample configuration
curl -X GET https://api.automerge-pro.com/v1/config/sample/pro \
  -H "Accept: text/yaml"
```

## Support

For API support and questions:
- **Documentation**: https://docs.automerge-pro.com
- **Support**: support@automerge-pro.com
- **Community**: https://discord.gg/automerge-pro
- **Issues**: https://github.com/MichaelWBrennan/KONIVRER-deck-database/issues