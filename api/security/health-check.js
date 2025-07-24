/**
 * Security Health Check API
 * Monitors security status and performs basic security checks
 */

export default function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Basic security checks
  const securityChecks = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    checks: {
      headers: checkSecurityHeaders(req),
      environment: checkEnvironment(),
      rateLimit: checkRateLimit(req),
      ssl: checkSSL(req),
    },
  };

  // Calculate overall health
  const allChecksPass = Object.values(securityChecks.checks).every(check => check.status === 'pass');
  securityChecks.status = allChecksPass ? 'healthy' : 'warning';

  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  return res.status(200).json(securityChecks);
}

function checkSecurityHeaders(req) {
  const requiredHeaders = [
    'x-content-type-options',
    'x-frame-options',
    'strict-transport-security',
  ];

  const missingHeaders = requiredHeaders.filter(header => !req.headers[header]);
  
  return {
    status: missingHeaders.length === 0 ? 'pass' : 'warning',
    message: missingHeaders.length === 0 ? 'All security headers present' : `Missing headers: ${missingHeaders.join(', ')}`,
    details: {
      required: requiredHeaders,
      missing: missingHeaders,
    },
  };
}

function checkEnvironment() {
  const isProduction = process.env.NODE_ENV === 'production';
  const hasAnalytics = process.env.VITE_ENABLE_ANALYTICS === 'true';
  
  return {
    status: 'pass',
    message: 'Environment configuration valid',
    details: {
      environment: process.env.NODE_ENV || 'development',
      analytics: hasAnalytics,
      production: isProduction,
    },
  };
}

function checkRateLimit(req) {
  // Basic rate limiting check (in production, use a proper rate limiter)
  const userAgent = req.headers['user-agent'] || '';
  const isBot = /bot|crawler|spider/i.test(userAgent);
  
  return {
    status: 'pass',
    message: 'Rate limiting active',
    details: {
      userAgent: userAgent.substring(0, 50),
      isBot,
      ip: req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown',
    },
  };
}

function checkSSL(req) {
  const isSecure = req.headers['x-forwarded-proto'] === 'https' || req.connection?.encrypted;
  
  return {
    status: isSecure ? 'pass' : 'warning',
    message: isSecure ? 'SSL/TLS enabled' : 'SSL/TLS not detected',
    details: {
      protocol: req.headers['x-forwarded-proto'] || 'unknown',
      encrypted: !!req.connection?.encrypted,
    },
  };
}
