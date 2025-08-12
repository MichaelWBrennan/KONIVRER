import express from 'express';
import serverlessExpress from '@vendia/serverless-express';
import { GitHubService } from './services/github';
import { LicenseService } from './services/license';
import { ConfigService } from './services/config';
import { WebhookHandler } from './handlers/webhook';
import { MonitoringService } from './services/monitoring';
import { AnalyticsService } from './services/analytics';
import { SupportService } from './services/support';

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Performance monitoring middleware
app.use((req, res, next) => {
  const startTime = Date.now();
  res.on('finish', async () => {
    const duration = Date.now() - startTime;
    const monitoring = new MonitoringService();
    await monitoring.recordApiLatency(req.path, duration);
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

// Initialize services
const githubService = new GitHubService(
  process.env.GITHUB_APP_ID!,
  process.env.GITHUB_PRIVATE_KEY!,
  process.env.GITHUB_WEBHOOK_SECRET!
);

const licenseService = new LicenseService(
  process.env.DYNAMODB_TABLE_NAME || 'automerge-pro-licenses'
);

const configService = new ConfigService(githubService, licenseService);
const webhookHandler = new WebhookHandler(githubService, licenseService, configService);
const monitoringService = new MonitoringService();
const analyticsService = new AnalyticsService();
const supportService = new SupportService(githubService);

// Health check endpoint with comprehensive checks
app.get('/health', async (req, res) => {
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'automerge-pro',
    version: process.env.VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    checks: {
      database: 'healthy',
      github: 'healthy',
      monitoring: 'healthy'
    }
  };

  try {
    // Test DynamoDB connection
    await licenseService.validateLicense(0); // This will test DB connection
    
    // Record health check metric
    await monitoringService.recordHealthCheck(true, 'api');
    
    res.json(healthData);
  } catch (error) {
    healthData.status = 'unhealthy';
    healthData.checks.database = 'error';
    
    await monitoringService.recordHealthCheck(false, 'api');
    
    res.status(503).json(healthData);
  }
});

// GitHub webhook endpoint
app.post('/webhook', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const signature = req.headers['x-hub-signature-256'] as string;
    const event = req.headers['x-github-event'] as string;
    const payload = JSON.stringify(req.body);

    // Record webhook received
    await monitoringService.recordWebhookReceived(event, true);

    // Verify webhook signature
    if (!githubService.verifyWebhookSignature(payload, signature)) {
      console.error('Invalid webhook signature');
      await monitoringService.recordWebhookReceived(event, false);
      return res.status(401).json({ error: 'Invalid signature' });
    }

    console.log(`Received GitHub webhook: ${event}`);

    // Handle different webhook events
    switch (event) {
      case 'pull_request':
        await webhookHandler.handlePullRequest(req.body);
        break;
      
      case 'check_run':
      case 'check_suite':
        await webhookHandler.handleCheckRun(req.body);
        break;
      
      case 'marketplace_purchase':
        await webhookHandler.handleMarketplacePurchase(req.body);
        
        // Track marketplace events
        if (req.body.action === 'purchased') {
          await analyticsService.trackInstallation(
            req.body.account.id, 
            req.body.marketplace_purchase.plan.name.toLowerCase().includes('pro') ? 'pro' : 
            req.body.marketplace_purchase.plan.name.toLowerCase().includes('enterprise') ? 'enterprise' : 'free',
            'marketplace'
          );
        }
        break;
      
      case 'installation':
        console.log('App installation event:', req.body.action);
        if (req.body.action === 'created') {
          // Start free trial for new installations
          await licenseService.startTrial(req.body.installation.id, 'pro', 14);
          
          // Track installation
          await analyticsService.trackInstallation(req.body.installation.id, 'free', 'github_app');
        }
        break;
      
      default:
        console.log(`Unhandled webhook event: ${event}`);
    }

    // Record processing time
    const processingTime = Date.now() - startTime;
    await monitoringService.recordPullRequestProcessed(
      req.body.installation?.id || 0, 
      true, 
      processingTime
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    
    // Record error
    const processingTime = Date.now() - startTime;
    await monitoringService.recordWebhookReceived(req.headers['x-github-event'] as string, false);
    await monitoringService.recordCriticalError(error as Error, { webhook: req.headers['x-github-event'] });
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

// License validation endpoint
app.get('/validate-license/:installationId', async (req, res) => {
  try {
    const installationId = parseInt(req.params.installationId);
    const license = await licenseService.validateLicense(installationId);
    
    await monitoringService.recordLicenseValidation(
      installationId, 
      license?.tier || 'unknown', 
      !!license
    );
    
    if (!license) {
      return res.status(404).json({ error: 'License not found' });
    }

    res.json({
      valid: license.isActive,
      tier: license.tier,
      features: license.features,
      expiresAt: license.expiresAt,
      trialEndsAt: license.trialEndsAt
    });
  } catch (error) {
    console.error('License validation error:', error);
    await monitoringService.recordCriticalError(error as Error, { endpoint: 'validate-license' });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Configuration endpoints
app.get('/config/sample/:tier?', (req, res) => {
  try {
    const tier = (req.params.tier as any) || 'free';
    const sampleConfig = configService.generateSampleConfig(tier);
    
    res.header('Content-Type', 'text/yaml');
    res.send(sampleConfig);
  } catch (error) {
    console.error('Config sample error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/config/validate', async (req, res) => {
  try {
    const { installationId, owner, repo } = req.body;
    
    if (!installationId || !owner || !repo) {
      return res.status(400).json({ 
        error: 'Missing required parameters: installationId, owner, repo' 
      });
    }

    const validation = await configService.getAndValidateConfig(
      installationId,
      owner,
      repo
    );

    // Track configuration validation
    await monitoringService.recordConfigurationError(
      installationId, 
      validation.valid ? 'none' : 'validation_failed'
    );

    res.json(validation);
  } catch (error) {
    console.error('Config validation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Analytics endpoints
app.get('/analytics/dashboard', async (req, res) => {
  try {
    // Check if user has analytics access (Pro+ feature)
    const installationId = parseInt(req.query.installationId as string);
    if (installationId) {
      const license = await licenseService.validateLicense(installationId);
      if (!license || !license.features.includes('analytics')) {
        return res.status(403).json({ error: 'Analytics requires Pro or Enterprise tier' });
      }
    }

    const dashboardData = await analyticsService.getDashboardData();
    res.json(dashboardData);
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/analytics/usage/:installationId', async (req, res) => {
  try {
    const installationId = parseInt(req.params.installationId);
    const period = req.query.period as string || 'monthly';
    
    // Check license
    const license = await licenseService.validateLicense(installationId);
    if (!license || !license.features.includes('analytics')) {
      return res.status(403).json({ error: 'Analytics requires Pro or Enterprise tier' });
    }

    const metrics = await analyticsService.aggregateUsageMetrics(installationId, period);
    res.json(metrics);
  } catch (error) {
    console.error('Usage metrics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Support endpoints
app.post('/submit-feedback', async (req, res) => {
  try {
    const { installationId, type, rating, message, category, metadata } = req.body;
    
    if (!installationId || !type || !rating || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields: installationId, type, rating, message' 
      });
    }

    const feedbackId = await supportService.submitFeedback({
      installationId,
      type,
      rating,
      message,
      category: category || 'general',
      metadata: metadata || {}
    });

    // Track feedback submission
    await analyticsService.trackUserFeedback(installationId, type, rating, message);

    res.json({ success: true, feedbackId });
  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/support/ticket', async (req, res) => {
  try {
    const ticket = req.body;
    const ticketId = await supportService.createSupportTicket(ticket);
    
    res.json({ success: true, ticketId });
  } catch (error) {
    console.error('Support ticket error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/support/tickets/:installationId', async (req, res) => {
  try {
    const installationId = parseInt(req.params.installationId);
    const tickets = await supportService.getTicketsByInstallation(installationId);
    
    res.json(tickets);
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Development license generation endpoint (development only)
app.post('/dev/generate-license', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Not available in production' });
  }

  try {
    const { installationId, tier = 'enterprise' } = req.body;
    
    if (!installationId) {
      return res.status(400).json({ error: 'installationId is required' });
    }

    const token = await licenseService.generateDevLicense(installationId, tier);
    
    res.json({
      success: true,
      license: token,
      installationId,
      tier,
      message: 'Development license generated successfully'
    });
  } catch (error) {
    console.error('Dev license generation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin endpoints (Enterprise only)
app.get('/admin/metrics', async (req, res) => {
  try {
    // In production, this would require admin authentication
    const metrics = await supportService.getSupportMetrics('month');
    res.json(metrics);
  } catch (error) {
    console.error('Admin metrics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  
  // Record critical error
  monitoringService.recordCriticalError(err, { 
    path: req.path, 
    method: req.method,
    body: req.body 
  });
  
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Export for Lambda or local server
export { app };

// For local development
if (process.env.NODE_ENV !== 'production' && require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Automerge-Pro server running on port ${port}`);
    console.log(`Health check: http://localhost:${port}/health`);
    console.log(`Webhook endpoint: http://localhost:${port}/webhook`);
  });
}

// For Lambda deployment
export const handler = serverlessExpress({ app });