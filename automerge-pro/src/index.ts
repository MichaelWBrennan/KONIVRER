import express from 'express';
import serverlessExpress from '@vendia/serverless-express';
import { GitHubService } from './services/github';
import { LicenseService } from './services/license';
import { ConfigService } from './services/config';
import { WebhookHandler } from './handlers/webhook';

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'automerge-pro',
    version: process.env.VERSION || '1.0.0'
  });
});

// GitHub webhook endpoint
app.post('/webhook', async (req, res) => {
  try {
    const signature = req.headers['x-hub-signature-256'] as string;
    const event = req.headers['x-github-event'] as string;
    const payload = JSON.stringify(req.body);

    // Verify webhook signature
    if (!githubService.verifyWebhookSignature(payload, signature)) {
      console.error('Invalid webhook signature');
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
        break;
      
      case 'installation':
        console.log('App installation event:', req.body.action);
        if (req.body.action === 'created') {
          // Start free trial for new installations
          await licenseService.startTrial(req.body.installation.id, 'pro', 14);
        }
        break;
      
      default:
        console.log(`Unhandled webhook event: ${event}`);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// License validation endpoint
app.get('/validate-license/:installationId', async (req, res) => {
  try {
    const installationId = parseInt(req.params.installationId);
    const license = await licenseService.validateLicense(installationId);
    
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
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Configuration sample endpoint
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

// Configuration validation endpoint
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

    res.json(validation);
  } catch (error) {
    console.error('Config validation error:', error);
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

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
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
  });
}

// For Lambda deployment
export const handler = serverlessExpress({ app });