/**
 * Security configuration and CSRF protection
 * Implements comprehensive security measures for the application
 */

import { env } from './env.js';

// Security configuration
export const securityConfig = {
  // CSRF Protection
  csrf: {
    enabled: true,
    tokenName: 'csrf-token',
    headerName: 'X-CSRF-Token',
    cookieName: 'csrf-token',
    // Generate a random token for CSRF protection
    generateToken: () => {
      const array = new Uint8Array(32);
      crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    },
  },

  // Content Security Policy
  csp: {
    enabled: true,
    directives: {
      'default-src': ["'self'"],
      'script-src': [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        'https://va.vercel-scripts.com',
        'https://vitals.vercel-insights.com',
      ],
      'style-src': [
        "'self'",
        "'unsafe-inline'",
        'fonts.googleapis.com',
      ],
      'font-src': [
        "'self'",
        'fonts.gstatic.com',
      ],
      'img-src': [
        "'self'",
        'data:',
        'https:',
      ],
      'connect-src': [
        "'self'",
        'https:',
        'https://vitals.vercel-insights.com',
        'https://va.vercel-scripts.com',
      ],
      'frame-ancestors': ["'none'"],
      'form-action': ["'self'"],
      'base-uri': ["'self'"],
      'object-src': ["'none'"],
    },
  },

  // Rate limiting configuration
  rateLimit: {
    enabled: true,
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
  },

  // Input validation
  validation: {
    enabled: true,
    maxInputLength: 10000,
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    maxFileSize: 5 * 1024 * 1024, // 5MB
  },

  // Session security
  session: {
    secure: import.meta.env.PROD,
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
};

// CSRF Token Management
export class CSRFProtection {
  constructor() {
    this.token = null;
    this.init();
  }

  init() {
    if (typeof window !== 'undefined') {
      this.token = this.getStoredToken() || this.generateNewToken();
      this.setMetaTag();
    }
  }

  generateNewToken() {
    const token = securityConfig.csrf.generateToken();
    this.storeToken(token);
    return token;
  }

  getStoredToken() {
    if (typeof window === 'undefined') return null;
    
    // Try to get from meta tag first
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    if (metaTag) {
      return metaTag.getAttribute('content');
    }

    // Fallback to localStorage
    return localStorage.getItem(securityConfig.csrf.tokenName);
  }

  storeToken(token) {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(securityConfig.csrf.tokenName, token);
  }

  setMetaTag() {
    if (typeof window === 'undefined' || !this.token) return;

    let metaTag = document.querySelector('meta[name="csrf-token"]');
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.name = 'csrf-token';
      document.head.appendChild(metaTag);
    }
    metaTag.content = this.token;
  }

  getToken() {
    return this.token;
  }

  getHeaders() {
    return {
      [securityConfig.csrf.headerName]: this.token,
    };
  }

  validateToken(token) {
    return token === this.token;
  }

  refreshToken() {
    this.token = this.generateNewToken();
    this.setMetaTag();
    return this.token;
  }
}

// Input Sanitization
export const sanitizeInput = (input, options = {}) => {
  if (typeof input !== 'string') return input;

  const {
    maxLength = securityConfig.validation.maxInputLength,
    allowHtml = false,
    allowScripts = false,
  } = options;

  // Trim and limit length
  let sanitized = input.trim().slice(0, maxLength);

  if (!allowHtml) {
    // Remove HTML tags
    sanitized = sanitized.replace(/<[^>]*>/g, '');
  }

  if (!allowScripts) {
    // Remove potential script injections
    sanitized = sanitized.replace(/javascript:/gi, '');
    sanitized = sanitized.replace(/on\w+\s*=/gi, '');
  }

  // Encode special characters
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');

  return sanitized;
};

// Secure HTTP Client
export class SecureHTTPClient {
  constructor() {
    this.csrf = new CSRFProtection();
  }

  async request(url, options = {}) {
    const defaultOptions = {
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        ...this.csrf.getHeaders(),
        ...options.headers,
      },
    };

    const mergedOptions = { ...defaultOptions, ...options };

    try {
      const response = await fetch(url, mergedOptions);
      
      // Check for CSRF token refresh
      const newToken = response.headers.get('X-CSRF-Token-Refresh');
      if (newToken) {
        this.csrf.token = newToken;
        this.csrf.setMetaTag();
      }

      return response;
    } catch (error) {
      console.error('Secure HTTP request failed:', error);
      throw error;
    }
  }

  async get(url, options = {}) {
    return this.request(url, { ...options, method: 'GET' });
  }

  async post(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(url, options = {}) {
    return this.request(url, { ...options, method: 'DELETE' });
  }
}

// Security Event Logger
export const securityLogger = {
  log: (event, details = {}) => {
    if (!env.ENABLE_DEBUG && import.meta.env.PROD) return;

    console.warn('Security Event:', {
      event,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      ...details,
    });
  },

  logCSRFAttempt: (token) => {
    securityLogger.log('CSRF_ATTEMPT', { token });
  },

  logRateLimitExceeded: (ip) => {
    securityLogger.log('RATE_LIMIT_EXCEEDED', { ip });
  },

  logSuspiciousInput: (input, field) => {
    securityLogger.log('SUSPICIOUS_INPUT', { input, field });
  },

  logSecurityHeaderMissing: (header) => {
    securityLogger.log('SECURITY_HEADER_MISSING', { header });
  },
};

// Initialize security on page load
export const initializeSecurity = () => {
  if (typeof window === 'undefined') return;

  // Initialize CSRF protection
  const csrf = new CSRFProtection();

  // Check for required security headers
  const checkSecurityHeaders = () => {
    const requiredHeaders = [
      'X-Content-Type-Options',
      'X-Frame-Options',
      'X-XSS-Protection',
      'Strict-Transport-Security',
    ];

    // This would typically be checked on the server side
    // Here we're just logging for awareness
    if (env.ENABLE_DEBUG) {
      console.log('Security headers should be verified server-side');
    }
  };

  // Set up global error handling for security events
  window.addEventListener('error', (event) => {
    if (event.error && event.error.name === 'SecurityError') {
      securityLogger.log('SECURITY_ERROR', {
        message: event.error.message,
        filename: event.filename,
        lineno: event.lineno,
      });
    }
  });

  // Check for mixed content
  if (location.protocol === 'https:' && env.ENABLE_DEBUG) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            const insecureElements = node.querySelectorAll?.(
              'img[src^="http:"], script[src^="http:"], link[href^="http:"]'
            );
            if (insecureElements?.length > 0) {
              securityLogger.log('MIXED_CONTENT_DETECTED', {
                elements: insecureElements.length,
              });
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  checkSecurityHeaders();

  return csrf;
};

// Export singleton instances
export const csrf = new CSRFProtection();
export const secureHttp = new SecureHTTPClient();

export default {
  securityConfig,
  CSRFProtection,
  sanitizeInput,
  SecureHTTPClient,
  securityLogger,
  initializeSecurity,
  csrf,
  secureHttp,
};