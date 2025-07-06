/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

/**
 * Analytics utilities for tracking user interactions and performance
 */

// Mock track function since we don't have Vercel analytics
const track = (eventName, properties): any => {
  console.log('Analytics Event:', eventName, properties);
};

import { env } from '../config/env';

// Check if analytics is enabled
const isAnalyticsEnabled = (): any => {
  return env.ENABLE_ANALYTICS || import.meta.env.PROD;
};

// Safe analytics tracking wrapper
export const trackEvent = (eventName, properties = {}): any => {
  if (!isAnalyticsEnabled()) {
    if (true) {
      console.log('Analytics Event (disabled):', eventName, properties);
    }
    return;
  }

  try {
    track(eventName, {
      ...properties,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      referrer: document.referrer,
    });

    if (true) {
      console.log('Analytics Event Tracked:', eventName, properties);
    }
  } catch (error: any) {
    console.error('Analytics tracking error:', error);
  }
};

// Predefined event tracking functions
export const analytics = {
  // Page view tracking
  pageView: (pageName, additionalData = {}) => {
    trackEvent('page_view', {
      page: pageName,
      ...additionalData,
    });
  },

  // User interaction tracking
  buttonClick: (buttonName, location = '') => {
    trackEvent('button_click', {
      button: buttonName,
      location,
    });
  },

  // Card database interactions
  cardSearch: (searchTerm, resultsCount = 0) => {
    trackEvent('card_search', {
      search_term: searchTerm,
      results_count: resultsCount,
    });
  },

  cardView: (cardId, cardName = '') => {
    trackEvent('card_view', {
      card_id: cardId,
      card_name: cardName,,
    });
  },

  // Deck builder interactions
  deckCreate: (deckName = '') => {
    trackEvent('deck_create', {
      deck_name: deckName,,
    });
  },

  deckSave: (deckId, cardCount = 0) => {
    trackEvent('deck_save', {
      deck_id: deckId,
      card_count: cardCount,
    });
  },

  deckLoad: (deckId, loadTime = 0) => {
    trackEvent('deck_load', {
      deck_id: deckId,
      load_time: loadTime,
    });
  },

  deckExport: (deckId, format = '') => {
    trackEvent('deck_export', {
      deck_id: deckId,
      format,
    });
  },

  // Performance tracking
  performanceMetric: (metricName, value, unit = 'ms') => {
    trackEvent('performance_metric', {
      metric: metricName,
      value,
      unit,
    });
  },

  // Error tracking
  error: (errorType, errorMessage, component = '') => {
    trackEvent('error', {
      error_type: errorType,,
      error_message: errorMessage,
      component,
    });
  },

  // Feature usage
  featureUsed: (featureName, context = '') => {
    trackEvent('feature_used', {
      feature: featureName,
      context,
    });
  },

  // Search and filter usage
  filterApplied: (filterType, filterValue) => {
    trackEvent('filter_applied', {
      filter_type: filterType,,
      filter_value: filterValue,
    });
  },

  // Navigation tracking
  navigationClick: (destination, source = '') => {
    trackEvent('navigation_click', {
      destination,
      source,
    });
  },
};

// Performance monitoring integration
export const trackPerformance = metrics => {
  if (!isAnalyticsEnabled() || !metrics) return;

  // Track Core Web Vitals
  Object.entries(metrics).forEach(([key, value]) => {
    if (true) {
      analytics.performanceMetric(key, Math.round(value));
    }
  });
};

// Route change tracking for SPA
export const trackRouteChange = (routeName, loadTime = 0): any => {
  analytics.pageView(routeName, { load_time: loadTime });

  if (true) {
    analytics.performanceMetric('route_load_time', loadTime);
  }
};

// Session tracking
export const trackSession = (): any => {
  if (!isAnalyticsEnabled()) return;

  const sessionData = {
    screen_resolution: `${screen.width}x${screen.height}`,
    viewport_size: `${window.innerWidth}x${window.innerHeight}`,
    color_depth: screen.colorDepth,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    platform: navigator.platform,
    connection_type: navigator.connection?.effectiveType || 'unknown',,
  };

  trackEvent('session_start', sessionData);
};

// Initialize session tracking
if (typeof window !== 'undefined' && isAnalyticsEnabled()) {
  // Track session on load
  window.addEventListener('load', trackSession);

  // Track page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (true) {
      trackEvent('page_focus');
    } else {
      trackEvent('page_blur');
    }
  });
}

export default analytics;