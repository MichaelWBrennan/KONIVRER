#!/bin/bash

# Automerge-Pro Analytics Platform Deployment Script
# Usage: ./deploy.sh [environment] [aws-profile]

set -e

ENVIRONMENT=${1:-dev}
AWS_PROFILE=${2:-default}
PROJECT_NAME="automerge-analytics"

echo "🚀 Deploying Automerge-Pro Analytics Platform"
echo "Environment: $ENVIRONMENT"
echo "AWS Profile: $AWS_PROFILE"
echo "----------------------------------------"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check required tools
echo "📋 Checking prerequisites..."

if ! command_exists aws; then
    echo "❌ AWS CLI is required but not installed"
    exit 1
fi

if ! command_exists sam; then
    echo "❌ AWS SAM CLI is required but not installed"
    exit 1
fi

if ! command_exists terraform; then
    echo "❌ Terraform is required but not installed"
    exit 1
fi

if ! command_exists node; then
    echo "❌ Node.js is required but not installed"
    exit 1
fi

echo "✅ All prerequisites are installed"

# Set AWS profile
export AWS_PROFILE=$AWS_PROFILE

# Verify AWS credentials
echo "🔐 Verifying AWS credentials..."
if ! aws sts get-caller-identity >/dev/null 2>&1; then
    echo "❌ AWS credentials not configured or invalid"
    exit 1
fi
echo "✅ AWS credentials verified"

# Get AWS account ID and region
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
AWS_REGION=$(aws configure get region)

echo "AWS Account ID: $AWS_ACCOUNT_ID"
echo "AWS Region: $AWS_REGION"

# Deploy Terraform infrastructure
echo "🏗️  Deploying Terraform infrastructure..."
cd infrastructure/terraform

# Initialize Terraform
terraform init

# Create terraform.tfvars if it doesn't exist
if [ ! -f terraform.tfvars ]; then
    cat > terraform.tfvars << EOF
aws_region = "$AWS_REGION"
environment = "$ENVIRONMENT"
project_name = "$PROJECT_NAME"
slack_webhook_url = ""
email_addresses = []
EOF
    echo "⚠️  Created terraform.tfvars. Please update with your Slack webhook URL and email addresses"
    echo "📝 Edit infrastructure/terraform/terraform.tfvars and re-run this script"
    exit 1
fi

# Plan and apply Terraform
terraform plan -var="environment=$ENVIRONMENT"
terraform apply -var="environment=$ENVIRONMENT" -auto-approve

# Get Terraform outputs
KINESIS_STREAM_NAME=$(terraform output -raw analytics_stream_name)
S3_BUCKET_NAME=$(terraform output -raw analytics_data_bucket)
DYNAMODB_TABLE_NAME=$(terraform output -raw dynamodb_table_name)
SNS_ALERT_TOPIC=$(terraform output -raw sns_alert_topic_arn)
SNS_REPORT_TOPIC=$(terraform output -raw sns_report_topic_arn)
LAMBDA_ROLE_ARN=$(terraform output -raw lambda_role_arn)

echo "✅ Terraform infrastructure deployed"

# Deploy SAM application
echo "📦 Deploying SAM application..."
cd ../aws-sam

# Build SAM application
sam build

# Deploy SAM application
sam deploy \
  --guided \
  --parameter-overrides \
    "Environment=$ENVIRONMENT" \
    "KinesisShardCount=2" \
    "SlackWebhookUrl=" \
    "EmailSNSTopic=$SNS_ALERT_TOPIC"

echo "✅ SAM application deployed"

# Build and prepare backend
echo "🔧 Building backend services..."
cd ../../backend

# Install dependencies
npm install

# Build application
npm run build

echo "✅ Backend services built"

# Build frontend
echo "🎨 Building frontend application..."
cd ../

# Install dependencies
npm install

# Build application
npm run build

echo "✅ Frontend application built"

# Create environment configuration
echo "⚙️  Creating environment configuration..."

cat > .env.production << EOF
# Analytics Configuration
KINESIS_STREAM_NAME=$KINESIS_STREAM_NAME
ANALYTICS_S3_BUCKET=$S3_BUCKET_NAME
DYNAMODB_TABLE_NAME=$DYNAMODB_TABLE_NAME
EMAIL_SNS_TOPIC=$SNS_REPORT_TOPIC
AWS_REGION=$AWS_REGION

# API Configuration
API_BASE_URL=https://api.$PROJECT_NAME.com

# Feature Flags
REAL_TIME_ANALYTICS=true
ANOMALY_DETECTION=true
PDF_REPORTS=true
SLACK_INTEGRATION=true
EMAIL_ALERTS=true
EOF

echo "✅ Environment configuration created"

# Create deployment summary
echo "📊 Deployment Summary"
echo "===================="
echo "Environment: $ENVIRONMENT"
echo "AWS Account: $AWS_ACCOUNT_ID"
echo "AWS Region: $AWS_REGION"
echo ""
echo "Resources Created:"
echo "- Kinesis Stream: $KINESIS_STREAM_NAME"
echo "- S3 Bucket: $S3_BUCKET_NAME"
echo "- DynamoDB Table: $DYNAMODB_TABLE_NAME"
echo "- Lambda Functions: 6 functions deployed"
echo "- SNS Topics: 2 topics created"
echo ""
echo "Next Steps:"
echo "1. Update Slack webhook URL in terraform.tfvars"
echo "2. Configure email addresses for alerts"
echo "3. Set up custom domain for API Gateway"
echo "4. Configure monitoring dashboards"
echo "5. Test event tracking endpoints"
echo ""
echo "API Endpoints:"
echo "- Install tracking: POST /track/install"
echo "- Merge tracking: POST /track/merge"
echo "- Billing tracking: POST /track/billing"
echo "- Onboarding tracking: POST /track/onboarding"
echo "- Report generation: POST /reports/generate"
echo ""
echo "🎉 Deployment completed successfully!"

# Create quick test script
cat > test-analytics.sh << 'EOF'
#!/bin/bash

# Quick test script for analytics endpoints
API_BASE_URL=${1:-"https://your-api-gateway-url"}

echo "Testing analytics endpoints..."

# Test install tracking
echo "📱 Testing install tracking..."
curl -X POST "$API_BASE_URL/track/install" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-123",
    "version": "1.0.0",
    "platform": "web",
    "source": "organic"
  }'

echo -e "\n✅ Install tracking test completed"

# Test merge tracking
echo "🔀 Testing merge tracking..."
curl -X POST "$API_BASE_URL/track/merge" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-123",
    "repositoryId": "repo-456",
    "mergeType": "pull_request",
    "branchName": "feature-test",
    "commitSha": "abc123"
  }'

echo -e "\n✅ Merge tracking test completed"

echo -e "\n🎉 All tests completed!"
EOF

chmod +x test-analytics.sh

echo "📋 Created test script: ./test-analytics.sh"
echo "💡 Run './test-analytics.sh <your-api-gateway-url>' to test the endpoints"