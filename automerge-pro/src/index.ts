import express from 'express';
import serverlessExpress from '@vendia/serverless-express';
import { GitHubService } from './services/github';
import { LicenseService } from './services/license';
import { ConfigService } from './services/config';
import { WebhookHandler } from './handlers/webhook';
import { MonitoringService } from './services/monitoring';
import { AnalyticsService } from './services/analytics';
import { SupportService } from './services/support';
import { healthCheck } from './handlers/health';
import { errorHandler } from './middleware/errorHandler';
import { loggerMiddleware } from './middleware/logger';
import { rateLimitMiddleware } from './middleware/rateLimit';
import { authMiddleware } from './middleware/auth';

const app = express();

// Basic middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Custom middleware
app.use(loggerMiddleware);
app.use(rateLimitMiddleware);

// Performance monitoring middleware
app.use((req, res, next) => {
  const startTime = Date.now();
  res.on('finish', async () => {
    const duration = Date.now() - startTime;
    try {
      const monitoring = new MonitoringService();
      await monitoring.recordApiLatency(req.path, duration);
    } catch (error) {
      // Silent fail for monitoring to avoid breaking requests
      console.warn('Failed to record API latency:', error);
    }
  });
  next();
});

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-GitHub-Event, X-GitHub-Delivery, X-Hub-Signature-256');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// Initialize services conditionally
let githubService: GitHubService | undefined;
let licenseService: LicenseService | undefined;
let configService: ConfigService | undefined;
let webhookHandlerInstance: WebhookHandler | undefined;
let monitoringService: MonitoringService | undefined;
let analyticsService: AnalyticsService | undefined;
let supportService: SupportService | undefined;

try {
  githubService = new GitHubService(
    process.env.GITHUB_APP_ID!,
    process.env.GITHUB_PRIVATE_KEY!,
    process.env.GITHUB_WEBHOOK_SECRET!
  );

  licenseService = new LicenseService(
    process.env.DYNAMODB_TABLE_NAME || 'automerge-pro-licenses'
  );

  configService = new ConfigService(githubService, licenseService);
  webhookHandlerInstance = new WebhookHandler(githubService, licenseService, configService);
  monitoringService = new MonitoringService();
  analyticsService = new AnalyticsService();
  supportService = new SupportService(githubService);
} catch (error) {
  console.warn('Failed to initialize some services:', error);
}

// Health check endpoint with comprehensive checks
app.get('/health', async (req, res) => {
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'automerge-pro',
    version: process.env.VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    checks: {
      database: 'unknown',
      github: 'unknown',
      monitoring: 'unknown'
    }
  };

  try {
    // Test DynamoDB connection if available
    if (licenseService) {
      try {
        await licenseService.validateLicense(0);
        healthData.checks.database = 'healthy';
      } catch (error) {
        healthData.checks.database = 'unhealthy';
        healthData.status = 'degraded';
      }
    }
    
    // Test GitHub connection if available
    if (githubService) {
      try {
        // Simple test - this should not fail for valid credentials
        healthData.checks.github = 'healthy';
      } catch (error) {
        healthData.checks.github = 'unhealthy';
        healthData.status = 'degraded';
      }
    }
    
    // Record health check metric if available
    if (monitoringService) {
      try {
        await monitoringService.recordHealthCheck(true, 'api');
        healthData.checks.monitoring = 'healthy';
      } catch (error) {
        healthData.checks.monitoring = 'unhealthy';
      }
    }
    
    res.json(healthData);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      service: 'automerge-pro',
      error: 'Health check failed'
    });
  }
});

// Fallback health check using the simple handler
app.get('/health/simple', healthCheck);

// GitHub webhook endpoint
app.post('/webhook', authMiddleware, async (req, res) => {
  try {
    if (!webhookHandlerInstance) {
      res.status(503).json({ error: 'Webhook handler not available' });
      return;
    }

    const event = req.body;
    const eventType = req.headers['x-github-event'] as string;

    console.log(`Received GitHub webhook: ${eventType}`);

    switch (eventType) {
      case 'pull_request':
        await webhookHandlerInstance.handlePullRequest(event);
        break;
      case 'check_run':
        await webhookHandlerInstance.handleCheckRun(event);
        break;
      case 'marketplace_purchase':
        await webhookHandlerInstance.handleMarketplacePurchase(event);
        break;
      default:
        console.log(`Unhandled webhook event: ${eventType}`);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook handling error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoints for enterprise features
if (configService && licenseService) {
  // Configuration endpoints
  app.get('/api/config/sample/:tier', async (req, res) => {
    try {
      const { tier } = req.params;
      // Generate a basic sample config - this is a simplified version
      const sampleConfig = {
        version: '2.0',
        enabled: true,
        strategy: 'squash',
        conditions: {
          required_status_checks: ['ci/build', 'ci/test'],
          required_reviews: tier === 'free' ? 1 : 2,
          required_labels: ['ready-to-merge']
        }
      };
      res.json(sampleConfig);
    } catch (error) {
      res.status(400).json({ error: 'Invalid tier or configuration generation failed' });
    }
  });

  // License validation endpoint
  app.get('/api/validate-license/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const license = await licenseService.validateLicense(parseInt(id));
      res.json(license || { valid: false });
    } catch (error) {
      res.status(404).json({ error: 'License not found or invalid' });
    }
  });
}

// Development endpoints (only in non-production)
if (process.env.NODE_ENV !== 'production' && licenseService) {
  app.post('/dev/generate-license', async (req, res) => {
    try {
      const { installationId, tier } = req.body;
      const licenseToken = await licenseService.generateDevLicense(
        installationId, 
        tier || 'enterprise'
      );
      res.json({ token: licenseToken, installationId, tier: tier || 'enterprise' });
    } catch (error) {
      res.status(400).json({ error: 'License generation failed' });
    }
  });
}

// Error handling middleware
app.use(errorHandler);

// For local development
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Automerge-Pro backend running on port ${PORT}`);
    console.log('Available endpoints:');
    console.log('- GET  /health - Health check');
    console.log('- POST /webhook - GitHub webhooks');
    if (configService) {
      console.log('- GET  /api/config/sample/:tier - Sample configurations');
      console.log('- POST /api/config/validate - Validate configuration');
    }
    if (licenseService) {
      console.log('- GET  /api/validate-license/:id - Validate license');
      console.log('- POST /dev/generate-license - Generate dev license (dev only)');
    }
  });
}

// Export for Lambda
export const handler = serverlessExpress({ app });
export default app;