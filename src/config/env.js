/**
 * Environment configuration
 * Centralizes all environment variables and provides defaults
 */

// Helper function to determine the correct backend URL based on environment
const getBackendUrl = () => {
  const _nodeEnv = import.meta.env.NODE_ENV || 'development';
  const mode = import.meta.env.MODE || 'development';

  // If explicitly set, use it
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL;
  }

  // Environment-specific URLs
  if (mode === 'development') {
    return import.meta.env.VITE_BACKEND_URL_DEV || 'http://localhost:5000';
  }

  if (mode === 'staging' || mode === 'preview') {
    return (
      import.meta.env.VITE_BACKEND_URL_STAGING ||
      'https://your-staging-backend.onrender.com'
    );
  }

  // Production default
  return (
    import.meta.env.VITE_BACKEND_URL_PROD ||
    'https://your-production-backend.onrender.com'
  );
};

export const env = {
  // Node environment
  NODE_ENV: import.meta.env.NODE_ENV || 'development',
  MODE: import.meta.env.MODE || 'development',

  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || `${getBackendUrl()}/api`,
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,

  // Application Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || 'KONIVRER Deck Database',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',

  // Feature Flags
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_DEBUG:
    import.meta.env.VITE_ENABLE_DEBUG === 'true' ||
    import.meta.env.NODE_ENV === 'development',

  // Backend URL
  BACKEND_URL: getBackendUrl(),

  // External Services
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
  GOOGLE_ANALYTICS_ID: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
};

// Validation
const requiredEnvVars = ['API_BASE_URL', 'BACKEND_URL'];

export const validateEnv = () => {
  const missing = requiredEnvVars.filter(key => !env[key]);

  if (missing.length > 0) {
    console.error('Environment validation failed:', {
      missing,
      current: env,
      meta: import.meta.env,
    });
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }

  // Log configuration in development
  if (env.ENABLE_DEBUG) {
    console.warn('Environment configuration:', {
      NODE_ENV: env.NODE_ENV,
      MODE: env.MODE,
      API_BASE_URL: env.API_BASE_URL,
      BACKEND_URL: env.BACKEND_URL,
      ENABLE_DEBUG: env.ENABLE_DEBUG,
    });
  }
};

// Development helpers
export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';

export default env;
