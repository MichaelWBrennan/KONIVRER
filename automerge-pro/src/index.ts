import express from 'express';
import serverlessExpress from '@vendia/serverless-express';
import { webhookHandler } from './handlers/webhook';
import { healthCheck } from './handlers/health';
import { errorHandler } from './middleware/errorHandler';
import { loggerMiddleware } from './middleware/logger';
import { rateLimitMiddleware } from './middleware/rateLimit';
import { authMiddleware } from './middleware/auth';

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);
app.use(rateLimitMiddleware);

// Health check endpoint
app.get('/health', healthCheck);

// GitHub webhook endpoint
app.post('/webhook', authMiddleware, webhookHandler);

// Error handling
app.use(errorHandler);

// For local development
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Automerge-Pro backend running on port ${PORT}`);
  });
}

// Export for Lambda
export const handler = serverlessExpress({ app });
export default app;