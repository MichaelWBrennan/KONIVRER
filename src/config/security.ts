/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

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
    generateToken: (): string => {
      const array = new Uint8Array(16);
      crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
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
        'https://vitals.vercel-insights.com'
      ],
      'style-src': ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
      'font-src': ["'self'", 'fonts.gstatic.com'],
      'img-src': ["'self'", 'data:', 'https:'],
      'connect-src': [
        "'self'",
        'https:',
        'https://vitals.vercel-insights.com',
        'https://va.vercel-scripts.com'
      ],
      'frame-ancestors': ["'none'"],
      'form-action': ["'self'"],
      'base-uri': ["'self'"],
      'object-src': ["'none'"]
    }
  },

  // Rate limiting configuration
  rateLimit: {
    enabled: true,
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
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
  }
};

// CSRF Token Management
export class CSRFProtection {
  token: string | null;

  constructor() {
    this.token = null;
    this.init();
  }

  init(): void {
    this.token = this.getStoredToken() || this.generateNewToken();
    this.setMetaTag();
  }

  generateNewToken(): string {
    const token = securityConfig.csrf.generateToken();
    this.storeToken(token);
    return token;
  }

  getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    
    // Try to get from meta tag first
    const metaTag = document.querySelector(`meta[name="${securityConfig.csrf.tokenName}"]`);
    if (metaTag) {
      return metaTag.getAttribute('content');
    }

    // Fallback to localStorage
    return localStorage.getItem(securityConfig.csrf.tokenName);
  }

  storeToken(token: string): void {
    if (typeof window === 'undefined') return;

    localStorage.setItem(securityConfig.csrf.tokenName, token);
  }

  setMetaTag(): void {
    if (typeof window === 'undefined' || !this.token) return;

    let metaTag = document.querySelector(`meta[name="${securityConfig.csrf.tokenName}"]`);
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('name', securityConfig.csrf.tokenName);
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute('content', this.token);
  }

  getToken(): string | null {
    return this.token;
  }

  getHeaders(): Record<string, string> {
    return {
      [securityConfig.csrf.headerName]: this.token || ''
    };
  }

  validateToken(token: string): boolean {
    return token === this.token;
  }

  refreshToken(): string {
    this.token = this.generateNewToken();
    this.setMetaTag();
    return this.token;
  }
}

interface SanitizeOptions {
  maxLength?: number;
  allowHtml?: boolean;
  allowScripts?: boolean;
}

// Input Sanitization
export const sanitizeInput = (input: any, options: SanitizeOptions = {}): any => {
  if (typeof input !== 'string') return input;
  
  const {
    maxLength = securityConfig.validation.maxInputLength,
    allowHtml = false,
    allowScripts = false
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
    .replace(/'/g, '&#039;');
    
  return sanitized;
};

// Secure HTTP Client
export class SecureHTTPClient {
  csrf: CSRFProtection;

  constructor() {
    this.csrf = new CSRFProtection();
  }

  async request(url: string, options: RequestInit = {}): Promise<Response> {
    const defaultOptions: RequestInit = {
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        ...this.csrf.getHeaders(),
        ...(options.headers || {})
      }
    };

    const mergedOptions = { ...defaultOptions, ...options };

    try {
      const response = await fetch(url, mergedOptions);

      // Check for CSRF token refresh
      const newToken = response.headers.get(securityConfig.csrf.headerName);
      if (newToken) {
        this.csrf.token = newToken;
        this.csrf.setMetaTag();
      }

      return response;
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  }

  async get(url: string, options: RequestInit = {}): Promise<Response> {
    return this.request(url, { ...options, method: 'GET' });
  }

  async post(url: string, data: any, options: RequestInit = {}): Promise<Response> {
    return this.request(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async put(url: string, data: any, options: RequestInit = {}): Promise<Response> {
    return this.request(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async delete(url: string, options: RequestInit = {}): Promise<Response> {
    return this.request(url, { ...options, method: 'DELETE' });
  }
}

interface SecurityLogDetails {
  [key: string]: any;
}

// Security Event Logger
export const securityLogger = {
  log: (event: string, details: SecurityLogDetails = {}): void => {
    if (!env.ENABLE_DEBUG && import.meta.env.PROD) return;

    console.warn('Security Event:', {
      event,
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      ...details
    });
  },

  logCSRFAttempt: (token: string): void => {
    securityLogger.log('CSRF_ATTEMPT', { token });
  },

  logRateLimitExceeded: (ip: string): void => {
    securityLogger.log('RATE_LIMIT_EXCEEDED', { ip });
  },

  logSuspiciousInput: (input: string, field: string): void => {
    securityLogger.log('SUSPICIOUS_INPUT', { input, field });
  },

  logSecurityHeaderMissing: (header: string): void => {
    securityLogger.log('SECURITY_HEADER_MISSING', { header });
  }
};

// Initialize security on page load
export const initializeSecurity = (): CSRFProtection => {
  if (typeof window === 'undefined') return new CSRFProtection();

  // Initialize CSRF protection
  const csrf = new CSRFProtection();

  // Check for required security headers
  const checkSecurityHeaders = (): void => {
    const requiredHeaders = [
      'X-Content-Type-Options',
      'X-Frame-Options',
      'X-XSS-Protection',
      'Strict-Transport-Security'
    ];

    // This would typically be checked on the server side
    // Here we're just logging for awareness
    console.log('Security headers should be verified server-side');
  };

  // Set up global error handling for security events
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      if (event.error && event.error.name === 'SecurityError') {
        securityLogger.log('SECURITY_ERROR', {
          message: event.error.message,
          filename: event.filename,
          lineno: event.lineno
        });
      }
    });

    // Check for mixed content
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            // Element node
            const element = node as Element;
            const insecureElements = element.querySelectorAll?.(
              'img[src^="http:"], script[src^="http:"], link[href^="http:"]'
            );
            if (insecureElements && insecureElements.length > 0) {
              securityLogger.log('MIXED_CONTENT_DETECTED', {
                elements: insecureElements.length
              });
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
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
  secureHttp
};