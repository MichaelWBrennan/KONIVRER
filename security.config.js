/**
 * KONIVRER Security Configuration
 * State-of-the-art security and data protection settings
 */

module.exports = {
  // Content Security Policy
  csp: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
      fontSrc: ["'self'"],
      connectSrc: ["'self'"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      upgradeInsecureRequests: true
    }
  },

  // Security Headers
  headers: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
  },

  // Data Protection Settings
  dataProtection: {
    encryption: {
      enabled: true,
      algorithm: 'AES-256-GCM',
      keyRotation: 86400000 // 24 hours
    },
    storage: {
      maxSize: 5242880, // 5MB
      compression: true,
      autoCleanup: true,
      retentionPeriod: 2592000000 // 30 days
    },
    gdpr: {
      enabled: true,
      consentRequired: true,
      dataMinimization: true,
      rightToErasure: true,
      dataPortability: true
    }
  },

  // Authentication & Session Security
  auth: {
    session: {
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 3600000, // 1 hour
      regenerateOnAuth: true
    },
    password: {
      minLength: 12,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSymbols: true,
      preventReuse: 5
    },
    mfa: {
      enabled: false, // Can be enabled for enhanced security
      methods: ['totp', 'sms', 'email']
    }
  },

  // Input Validation & Sanitization
  validation: {
    xss: {
      enabled: true,
      allowedTags: [],
      allowedAttributes: {}
    },
    sql: {
      parameterized: true,
      escaping: true
    },
    fileUpload: {
      maxSize: 1048576, // 1MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/gif'],
      virusScanning: false // Would require external service
    }
  },

  // Monitoring & Logging
  monitoring: {
    securityEvents: {
      enabled: true,
      logLevel: 'info',
      retention: 2592000000, // 30 days
      alertThresholds: {
        failedLogins: 5,
        suspiciousActivity: 10
      }
    },
    performance: {
      enabled: true,
      metrics: ['responseTime', 'memoryUsage', 'errorRate']
    }
  },

  // Vulnerability Management
  vulnerabilities: {
    scanning: {
      enabled: true,
      frequency: 86400000, // Daily
      sources: ['npm-audit', 'snyk', 'github-advisories']
    },
    autoUpdate: {
      enabled: true,
      severity: 'moderate', // minimum severity to auto-update
      testingRequired: true
    }
  },

  // Rate Limiting & DDoS Protection
  rateLimiting: {
    enabled: true,
    windowMs: 900000, // 15 minutes
    maxRequests: 100,
    skipSuccessfulRequests: false,
    skipFailedRequests: false
  },

  // Compliance Standards
  compliance: {
    standards: ['GDPR', 'CCPA', 'OWASP-Top-10'],
    auditing: {
      enabled: true,
      frequency: 604800000, // Weekly
      automated: true
    }
  }
};