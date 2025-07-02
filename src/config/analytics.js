/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

/**
 * Analytics configuration
 * Centralizes analytics setup and provides debugging capabilities
 */

import { env } from './env.js';

// Analytics configuration
export const analyticsConfig = {
  // Enable analytics only in production
  enabled: import.meta.env.PROD && env.ENABLE_ANALYTICS,

  // Debug mode for development
  debug: env.ENABLE_DEBUG,

  // Vercel Analytics settings
  vercel: {
    // Automatically enabled for Vercel deployments
    enabled: import.meta.env.PROD,

    // Speed Insights settings
    speedInsights: {
      enabled: import.meta.env.PROD,
      // Sample rate (0-1, where 1 = 100% of users)
      sampleRate: 1.0,
    },
  },
};

// Analytics helper functions
export const analytics = {
  // Track custom events
  track: (eventName, properties = {}) => {
    if (!analyticsConfig.enabled) {
      if (analyticsConfig.debug) {
        console.log('Analytics (debug):', eventName, properties);
      }
      return;
    }

    // Vercel Analytics custom events
    if (window.va) {
      window.va('track', eventName, properties);
    }
  },

  // Track page views
  pageView: path => {
    if (!analyticsConfig.enabled) {
      if (analyticsConfig.debug) {
        console.log('Analytics (debug) - Page view:', path);
      }
      return;
    }

    // Vercel Analytics page views are automatically tracked
    // This is for custom tracking if needed
    analytics.track('pageview', { path });
  },

  // Track user interactions
  interaction: (element, action = 'click') => {
    analytics.track('interaction', {
      element,
      action,
      timestamp: Date.now(),
    });
  },

  // Track performance metrics
  performance: (metric, value, unit = 'ms') => {
    analytics.track('performance', {
      metric,
      value,
      unit,
      timestamp: Date.now(),
    });
  },

  // Track errors
  error: (error, context = {}) => {
    analytics.track('error', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: Date.now(),
    });
  },
};

// Initialize analytics
export const initializeAnalytics = () => {
  if (analyticsConfig.debug) {
    console.log('Analytics configuration:', analyticsConfig);
  }

  // Track initial page load
  if (analyticsConfig.enabled) {
    analytics.pageView(window.location.pathname);
  }
};

export default analytics;
