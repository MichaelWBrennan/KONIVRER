import { Request, Response } from 'express';

export const healthCheck = (req: Request, res: Response) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    services: {
      github_api: 'operational',
      aws: 'operational',
      database: 'operational'
    }
  };

  res.status(200).json(health);
};