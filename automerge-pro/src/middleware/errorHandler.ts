import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  // GitHub webhook signature verification error
  if (err.message.includes('signature')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid webhook signature'
    });
  }

  // Rate limit error
  if (err.message.includes('rate limit')) {
    return res.status(429).json({
      error: 'Rate Limited',
      message: 'Too many requests'
    });
  }

  // GitHub API error
  if (err.message.includes('GitHub API')) {
    return res.status(502).json({
      error: 'External Service Error',
      message: 'GitHub API is unavailable'
    });
  }

  // Default error
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong' 
      : err.message
  });
};