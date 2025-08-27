# QuickSight Dashboard Configuration

This directory contains Amazon QuickSight dashboard templates and data source configurations for the Automerge-Pro Analytics Platform.

## Data Sources

### Primary Data Source: PostgreSQL

- **Host**: Your PostgreSQL instance endpoint
- **Database**: `konivrer_db`
- **Tables**:
  - `analytics_events`
  - `anomaly_alerts`
  - `analytics_reports`

### Secondary Data Source: S3

- **Bucket**: Created by Terraform (`automerge-analytics-data-{env}`)
- **Path**: `/processed-data/`
- **Format**: Parquet files

## Dashboard Templates

### Executive Dashboard

- **File**: `executive-dashboard.json`
- **Metrics**:
  - Daily/Monthly Active Users
  - Revenue Growth
  - System Health KPIs
  - Top-line Growth Metrics

### Operations Dashboard

- **File**: `operations-dashboard.json`
- **Metrics**:
  - System Performance
  - Error Rates
  - Response Times
  - Anomaly Alerts

### User Analytics Dashboard

- **File**: `user-analytics-dashboard.json`
- **Metrics**:
  - User Journey Analysis
  - Feature Adoption
  - Retention Cohorts
  - Churn Analysis

## Setup Instructions

1. **Create QuickSight Account**

   ```bash
   aws quicksight create-account-subscription \
     --edition ENTERPRISE \
     --authentication-method IAM_AND_QUICKSIGHT
   ```

2. **Configure Data Sources**

   ```bash
   aws quicksight create-data-source \
     --aws-account-id YOUR_ACCOUNT_ID \
     --data-source-id analytics-postgres \
     --name "Analytics PostgreSQL" \
     --type POSTGRESQL \
     --data-source-parameters file://postgres-config.json
   ```

3. **Import Dashboards**
   ```bash
   aws quicksight create-dashboard \
     --aws-account-id YOUR_ACCOUNT_ID \
     --dashboard-id executive-dashboard \
     --name "Executive Analytics Dashboard" \
     --definition file://executive-dashboard.json
   ```

## Data Refresh Schedule

- **Hourly**: Real-time metrics
- **Daily**: User analytics
- **Weekly**: Executive summaries

## Permissions

QuickSight users will need:

- Read access to PostgreSQL analytics tables
- Read access to S3 processed data bucket
- QuickSight dashboard viewer or author permissions

## Alternative: Metabase Setup

If you prefer Metabase over QuickSight, see `metabase-config/` directory for:

- Docker compose configuration
- Dashboard JSON exports
- Database connection setup
