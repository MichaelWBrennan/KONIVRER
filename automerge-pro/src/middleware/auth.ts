import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const signature = req.get('X-Hub-Signature-256');
  const event = req.get('X-GitHub-Event');
  const delivery = req.get('X-GitHub-Delivery');
  
  if (!signature || !event || !delivery) {
    return res.status(400).json({
      error: 'Missing required headers',
      message: 'X-Hub-Signature-256, X-GitHub-Event, and X-GitHub-Delivery headers are required'
    });
  }
  
  // Skip signature verification for health check
  if (req.path === '/health') {
    return next();
  }
  
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) {
    console.error('GITHUB_WEBHOOK_SECRET environment variable is not set');
    return res.status(500).json({
      error: 'Server Configuration Error',
      message: 'Webhook secret not configured'
    });
  }
  
  try {
    const body = JSON.stringify(req.body);
    const expectedSignature = `sha256=${crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex')}`;
    
    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
    
    if (!isValid) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid webhook signature'
      });
    }
    
    next();
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to verify webhook signature'
    });
  }
};