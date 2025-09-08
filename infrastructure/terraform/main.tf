terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Variables
variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "automerge-analytics"
}

variable "slack_webhook_url" {
  description = "Slack webhook URL for alerts"
  type        = string
  sensitive   = true
}

variable "email_addresses" {
  description = "Email addresses for alerts"
  type        = list(string)
  default     = []
}

# Local values
locals {
  common_tags = {
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "terraform"
  }
  
  resource_prefix = "${var.project_name}-${var.environment}"
}

# Data sources
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# S3 bucket for analytics data and reports
resource "aws_s3_bucket" "analytics_data" {
  bucket = "${local.resource_prefix}-data-${data.aws_caller_identity.current.account_id}"
  
  tags = local.common_tags
}

resource "aws_s3_bucket_versioning" "analytics_data_versioning" {
  bucket = aws_s3_bucket.analytics_data.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_encryption" "analytics_data_encryption" {
  bucket = aws_s3_bucket.analytics_data.id
  
  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "analytics_data_lifecycle" {
  bucket = aws_s3_bucket.analytics_data.id
  
  rule {
    id     = "analytics_data_lifecycle"
    status = "Enabled"
    
    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }
    
    transition {
      days          = 90
      storage_class = "GLACIER"
    }
    
    expiration {
      days = 2555  # 7 years
    }
  }
}

resource "aws_s3_bucket_public_access_block" "analytics_data_pab" {
  bucket = aws_s3_bucket.analytics_data.id
  
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Kinesis Data Stream
resource "aws_kinesis_stream" "analytics_stream" {
  name             = "${local.resource_prefix}-stream"
  shard_count      = 2
  retention_period = 168  # 7 days
  
  shard_level_metrics = [
    "IncomingRecords",
    "OutgoingRecords",
  ]
  
  stream_mode_details {
    stream_mode = "PROVISIONED"
  }
  
  tags = local.common_tags
}

# DynamoDB table for analytics configuration and metadata
resource "aws_dynamodb_table" "analytics_config" {
  name           = "${local.resource_prefix}-config"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "configKey"
  range_key      = "timestamp"
  
  attribute {
    name = "configKey"
    type = "S"
  }
  
  attribute {
    name = "timestamp"
    type = "N"
  }
  
  ttl {
    attribute_name = "ttl"
    enabled        = true
  }
  
  point_in_time_recovery {
    enabled = true
  }
  
  tags = local.common_tags
}

# SQS Queue for install events
resource "aws_sqs_queue" "install_events" {
  name                      = "${local.resource_prefix}-install-events"
  visibility_timeout_seconds = 180
  message_retention_seconds = 1209600  # 14 days
  
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.install_events_dlq.arn
    maxReceiveCount     = 3
  })
  
  tags = local.common_tags
}

resource "aws_sqs_queue" "install_events_dlq" {
  name = "${local.resource_prefix}-install-events-dlq"
  
  tags = local.common_tags
}

# SNS Topics for alerts and reports
resource "aws_sns_topic" "alerts" {
  name = "${local.resource_prefix}-alerts"
  
  tags = local.common_tags
}

resource "aws_sns_topic" "reports" {
  name = "${local.resource_prefix}-reports"
  
  tags = local.common_tags
}

# SNS subscriptions for email alerts
resource "aws_sns_topic_subscription" "email_alerts" {
  count     = length(var.email_addresses)
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = var.email_addresses[count.index]
}

resource "aws_sns_topic_subscription" "email_reports" {
  count     = length(var.email_addresses)
  topic_arn = aws_sns_topic.reports.arn
  protocol  = "email"
  endpoint  = var.email_addresses[count.index]
}

# IAM roles and policies
data "aws_iam_policy_document" "lambda_assume_role" {
  statement {
    effect = "Allow"
    
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
    
    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "analytics_lambda_role" {
  name               = "${local.resource_prefix}-lambda-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
  
  tags = local.common_tags
}

data "aws_iam_policy_document" "analytics_lambda_policy" {
  # CloudWatch Logs
  statement {
    effect = "Allow"
    
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    
    resources = ["arn:aws:logs:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:*"]
  }
  
  # Kinesis
  statement {
    effect = "Allow"
    
    actions = [
      "kinesis:PutRecord",
      "kinesis:PutRecords",
      "kinesis:DescribeStream",
      "kinesis:GetRecords",
      "kinesis:GetShardIterator",
      "kinesis:ListStreams"
    ]
    
    resources = [aws_kinesis_stream.analytics_stream.arn]
  }
  
  # DynamoDB
  statement {
    effect = "Allow"
    
    actions = [
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
      "dynamodb:DeleteItem",
      "dynamodb:Query",
      "dynamodb:Scan"
    ]
    
    resources = [aws_dynamodb_table.analytics_config.arn]
  }
  
  # S3
  statement {
    effect = "Allow"
    
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject"
    ]
    
    resources = ["${aws_s3_bucket.analytics_data.arn}/*"]
  }
  
  statement {
    effect = "Allow"
    
    actions = [
      "s3:ListBucket"
    ]
    
    resources = [aws_s3_bucket.analytics_data.arn]
  }
  
  # SNS
  statement {
    effect = "Allow"
    
    actions = [
      "sns:Publish"
    ]
    
    resources = [
      aws_sns_topic.alerts.arn,
      aws_sns_topic.reports.arn
    ]
  }
  
  # SQS
  statement {
    effect = "Allow"
    
    actions = [
      "sqs:ReceiveMessage",
      "sqs:DeleteMessage",
      "sqs:GetQueueAttributes"
    ]
    
    resources = [
      aws_sqs_queue.install_events.arn,
      aws_sqs_queue.install_events_dlq.arn
    ]
  }
  
  # QuickSight (for report generation)
  statement {
    effect = "Allow"
    
    actions = [
      "quicksight:*"
    ]
    
    resources = ["*"]
  }
}

resource "aws_iam_role_policy" "analytics_lambda_policy" {
  name   = "${local.resource_prefix}-lambda-policy"
  role   = aws_iam_role.analytics_lambda_role.id
  policy = data.aws_iam_policy_document.analytics_lambda_policy.json
}

# CloudWatch Log Groups
resource "aws_cloudwatch_log_group" "lambda_logs" {
  for_each = toset([
    "install-tracking",
    "merge-tracking", 
    "billing-tracking",
    "onboarding-tracking",
    "anomaly-detection",
    "report-generation"
  ])
  
  name              = "/aws/lambda/${local.resource_prefix}-${each.key}"
  retention_in_days = 30
  
  tags = local.common_tags
}

# EventBridge rules for scheduled functions
resource "aws_cloudwatch_event_rule" "anomaly_detection_schedule" {
  name                = "${local.resource_prefix}-anomaly-detection"
  description         = "Trigger anomaly detection every 5 minutes"
  schedule_expression = "rate(5 minutes)"
  
  tags = local.common_tags
}

resource "aws_cloudwatch_event_rule" "weekly_report_schedule" {
  name                = "${local.resource_prefix}-weekly-report"
  description         = "Generate weekly report every Monday at 9 AM"
  schedule_expression = "cron(0 9 ? * MON *)"
  
  tags = local.common_tags
}

# API Gateway for HTTP endpoints
resource "aws_apigatewayv2_api" "analytics_api" {
  name          = "${local.resource_prefix}-api"
  protocol_type = "HTTP"
  description   = "Analytics API for event tracking"
  
  cors_configuration {
    allow_credentials = false
    allow_headers     = ["content-type", "authorization"]
    allow_methods     = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allow_origins     = ["*"]
    expose_headers    = ["*"]
    max_age          = 300
  }
  
  tags = local.common_tags
}

resource "aws_apigatewayv2_stage" "analytics_api_stage" {
  api_id      = aws_apigatewayv2_api.analytics_api.id
  name        = var.environment
  auto_deploy = true
  
  default_route_settings {
    throttling_rate_limit  = 1000
    throttling_burst_limit = 2000
  }
  
  tags = local.common_tags
}

# Output values
output "analytics_stream_name" {
  description = "Name of the Kinesis Analytics Stream"
  value       = aws_kinesis_stream.analytics_stream.name
}

output "analytics_stream_arn" {
  description = "ARN of the Kinesis Analytics Stream"
  value       = aws_kinesis_stream.analytics_stream.arn
}

output "analytics_data_bucket" {
  description = "Name of the S3 Analytics Data Bucket"
  value       = aws_s3_bucket.analytics_data.bucket
}

output "dynamodb_table_name" {
  description = "Name of the DynamoDB configuration table"
  value       = aws_dynamodb_table.analytics_config.name
}

output "api_gateway_url" {
  description = "API Gateway URL for analytics endpoints"
  value       = aws_apigatewayv2_api.analytics_api.api_endpoint
}

output "sns_alert_topic_arn" {
  description = "SNS topic ARN for alerts"
  value       = aws_sns_topic.alerts.arn
}

output "sns_report_topic_arn" {
  description = "SNS topic ARN for reports"
  value       = aws_sns_topic.reports.arn
}

output "lambda_role_arn" {
  description = "IAM role ARN for Lambda functions"
  value       = aws_iam_role.analytics_lambda_role.arn
}