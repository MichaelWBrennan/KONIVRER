import { Request, Response, NextFunction } from 'express';

// Simple in-memory rate limiter (for production, use Redis)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests per minute

export const rateLimitMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  
  // Clean expired entries
  for (const [ip, data] of requestCounts.entries()) {
    if (now > data.resetTime) {
      requestCounts.delete(ip);
    }
  }
  
  const clientData = requestCounts.get(clientIP);
  
  if (!clientData) {
    // First request from this IP
    requestCounts.set(clientIP, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    });
    next();
    return;
  }
  
  if (now > clientData.resetTime) {
    // Window has expired, reset
    requestCounts.set(clientIP, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    });
    next();
    return;
  }
  
  if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
    // Rate limit exceeded
    res.status(429).json({
      error: 'Rate limit exceeded',
      message: `Maximum ${RATE_LIMIT_MAX_REQUESTS} requests per minute allowed`
    });
    return;
  }
  
  // Increment count
  clientData.count++;
  next();
};