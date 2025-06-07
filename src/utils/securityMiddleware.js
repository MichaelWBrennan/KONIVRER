/**
 * Security middleware for API requests and form submissions
 * Implements CSRF protection, input validation, and rate limiting
 */

import { secureHttp, sanitizeInput, securityLogger } from '../config/security.js';

// Rate limiting store (in-memory for client-side)
const rateLimitStore = new Map();

// Rate limiting middleware
export const rateLimit = (key, maxRequests = 10, windowMs = 60000) => {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, []);
  }
  
  const requests = rateLimitStore.get(key);
  
  // Remove old requests outside the window
  const validRequests = requests.filter(timestamp => timestamp > windowStart);
  
  if (validRequests.length >= maxRequests) {
    securityLogger.logRateLimitExceeded(key);
    throw new Error('Rate limit exceeded. Please try again later.');
  }
  
  validRequests.push(now);
  rateLimitStore.set(key, validRequests);
  
  return true;
};

// Input validation middleware
export const validateInput = (data, rules = {}) => {
  const errors = [];
  const sanitized = {};
  
  for (const [field, value] of Object.entries(data)) {
    const rule = rules[field] || {};
    
    // Check required fields
    if (rule.required && (!value || value.toString().trim() === '')) {
      errors.push(`${field} is required`);
      continue;
    }
    
    // Skip validation for empty optional fields
    if (!value && !rule.required) {
      sanitized[field] = value;
      continue;
    }
    
    // Type validation
    if (rule.type) {
      switch (rule.type) {
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errors.push(`${field} must be a valid email address`);
          }
          break;
        case 'number':
          if (isNaN(Number(value))) {
            errors.push(`${field} must be a number`);
          }
          break;
        case 'string':
          if (typeof value !== 'string') {
            errors.push(`${field} must be a string`);
          }
          break;
      }
    }
    
    // Length validation
    if (rule.minLength && value.length < rule.minLength) {
      errors.push(`${field} must be at least ${rule.minLength} characters long`);
    }
    
    if (rule.maxLength && value.length > rule.maxLength) {
      errors.push(`${field} must be no more than ${rule.maxLength} characters long`);
    }
    
    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      errors.push(`${field} format is invalid`);
    }
    
    // Custom validation
    if (rule.validate && typeof rule.validate === 'function') {
      const customError = rule.validate(value);
      if (customError) {
        errors.push(customError);
      }
    }
    
    // Sanitize the input
    sanitized[field] = sanitizeInput(value, rule.sanitize || {});
    
    // Check for suspicious content
    if (rule.checkSuspicious !== false) {
      const suspiciousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /data:text\/html/i,
        /vbscript:/i,
      ];
      
      if (suspiciousPatterns.some(pattern => pattern.test(value))) {
        securityLogger.logSuspiciousInput(value, field);
        errors.push(`${field} contains potentially malicious content`);
      }
    }
  }
  
  if (errors.length > 0) {
    throw new Error(`Validation failed: ${errors.join(', ')}`);
  }
  
  return sanitized;
};

// Secure form submission
export const secureSubmit = async (url, data, options = {}) => {
  try {
    // Rate limiting
    const clientId = `${navigator.userAgent}-${window.location.hostname}`;
    rateLimit(clientId, options.maxRequests, options.windowMs);
    
    // Input validation
    if (options.validation) {
      data = validateInput(data, options.validation);
    }
    
    // Submit with CSRF protection
    const response = await secureHttp.post(url, data, options.requestOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response;
  } catch (error) {
    securityLogger.log('SECURE_SUBMIT_ERROR', {
      url,
      error: error.message,
    });
    throw error;
  }
};

// File upload security
export const secureFileUpload = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    maxFiles = 1,
  } = options;
  
  const errors = [];
  
  // Check file size
  if (file.size > maxSize) {
    errors.push(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
  }
  
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed`);
  }
  
  // Check file name for suspicious content
  const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com'];
  if (suspiciousExtensions.some(ext => file.name.toLowerCase().endsWith(ext))) {
    errors.push('File type is not allowed');
    securityLogger.logSuspiciousInput(file.name, 'filename');
  }
  
  if (errors.length > 0) {
    throw new Error(`File validation failed: ${errors.join(', ')}`);
  }
  
  return true;
};

// XSS Protection for dynamic content
export const sanitizeHTML = (html) => {
  // Create a temporary div to parse HTML
  const temp = document.createElement('div');
  temp.innerHTML = html;
  
  // Remove script tags and event handlers
  const scripts = temp.querySelectorAll('script');
  scripts.forEach(script => script.remove());
  
  // Remove dangerous attributes
  const allElements = temp.querySelectorAll('*');
  allElements.forEach(element => {
    // Remove event handler attributes
    Array.from(element.attributes).forEach(attr => {
      if (attr.name.startsWith('on')) {
        element.removeAttribute(attr.name);
      }
    });
    
    // Remove javascript: links
    if (element.href && element.href.startsWith('javascript:')) {
      element.removeAttribute('href');
    }
    
    if (element.src && element.src.startsWith('javascript:')) {
      element.removeAttribute('src');
    }
  });
  
  return temp.innerHTML;
};

// Content Security Policy violation handler
export const handleCSPViolation = (event) => {
  securityLogger.log('CSP_VIOLATION', {
    blockedURI: event.blockedURI,
    violatedDirective: event.violatedDirective,
    originalPolicy: event.originalPolicy,
    documentURI: event.documentURI,
    lineNumber: event.lineNumber,
    columnNumber: event.columnNumber,
  });
};

// Initialize CSP violation reporting
if (typeof window !== 'undefined') {
  document.addEventListener('securitypolicyviolation', handleCSPViolation);
}

// Security headers checker
export const checkSecurityHeaders = async (url = window.location.href) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    
    const requiredHeaders = [
      'X-Content-Type-Options',
      'X-Frame-Options',
      'X-XSS-Protection',
      'Strict-Transport-Security',
      'Content-Security-Policy',
    ];
    
    const missingHeaders = requiredHeaders.filter(
      header => !response.headers.has(header)
    );
    
    if (missingHeaders.length > 0) {
      missingHeaders.forEach(header => {
        securityLogger.logSecurityHeaderMissing(header);
      });
    }
    
    return {
      secure: missingHeaders.length === 0,
      missingHeaders,
      headers: Object.fromEntries(response.headers.entries()),
    };
  } catch (error) {
    securityLogger.log('SECURITY_HEADER_CHECK_FAILED', { error: error.message });
    return { secure: false, error: error.message };
  }
};

export default {
  rateLimit,
  validateInput,
  secureSubmit,
  secureFileUpload,
  sanitizeHTML,
  handleCSPViolation,
  checkSecurityHeaders,
};