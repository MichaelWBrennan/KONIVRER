/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

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

  // Production default - disable backend calls if not configured
  return (
    import.meta.env.VITE_BACKEND_URL_PROD || null // No backend URL means use fallback data only
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

  // OAuth Configuration
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  GITHUB_CLIENT_ID: import.meta.env.VITE_GITHUB_CLIENT_ID,
  DISCORD_CLIENT_ID: import.meta.env.VITE_DISCORD_CLIENT_ID,

  // OAuth Redirect URIs
  OAUTH_REDIRECT_URI:
    import.meta.env.VITE_OAUTH_REDIRECT_URI ||
    `${window.location.origin}/auth/callback`,
};

// Validation - now optional for demo deployments
const optionalEnvVars = ['API_BASE_URL', 'BACKEND_URL'];

export const validateEnv = () => {
  const missing = optionalEnvVars.filter(key => !env[key]);

  if (missing.length > 0) {
    console.warn(
      'Environment variables not configured (using fallback mode):',
      {
        missing,
        note: 'App will use fallback data without backend integration',
      },
    );
  }

  // Log configuration in development
  if (env.ENABLE_DEBUG) {
    console.warn('Environment configuration:', {
      NODE_ENV: env.NODE_ENV,
      MODE: env.MODE,
      API_BASE_URL: env.API_BASE_URL || 'Not configured (fallback mode)',
      BACKEND_URL: env.BACKEND_URL || 'Not configured (fallback mode)',
      ENABLE_DEBUG: env.ENABLE_DEBUG,
    });
  }
};

// Development helpers
export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';

export default env;
