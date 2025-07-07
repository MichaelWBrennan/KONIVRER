/**
 * Enhanced Speed Tracking Utilities
 * Provides comprehensive performance monitoring beyond Core Web Vitals
 */

import { shouldSkipAutonomousSystems } from './buildDetection';

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  url: string;
}

interface NavigationTiming {
  dns: number;
  tcp: number;
  ssl: number;
  ttfb: number;
  domLoad: number;
  windowLoad: number;
  total: number;
}

class SpeedTracker {
  private metrics: PerformanceMetric[] = [];
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = !shouldSkipAutonomousSystems() && typeof window !== 'undefined';
    if (this.isEnabled) {
      this.initializeTracking();
    }
  }

  private initializeTracking(): void {
    // Track page load performance
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.trackPageLoad());
      window.addEventListener('load', () => this.trackWindowLoad());
    } else {
      // Page already loaded
      setTimeout(() => {
        this.trackPageLoad();
        this.trackWindowLoad();
      }, 0);
    }

    // Track route changes (for SPA)
    this.trackRouteChanges();

    // Track resource loading
    this.trackResourceTiming();
  }

  private trackPageLoad(): void {
    if (!this.isEnabled) return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (!navigation) return;

    const timing: NavigationTiming = {
      dns: navigation.domainLookupEnd - navigation.domainLookupStart,
      tcp: navigation.connectEnd - navigation.connectStart,
      ssl: navigation.secureConnectionStart > 0 ? navigation.connectEnd - navigation.secureConnectionStart : 0,
      ttfb: navigation.responseStart - navigation.requestStart,
      domLoad: navigation.domContentLoadedEventEnd - navigation.navigationStart,
      windowLoad: navigation.loadEventEnd - navigation.navigationStart,
      total: navigation.loadEventEnd - navigation.navigationStart,
    };

    this.recordMetric('DNS_LOOKUP', timing.dns);
    this.recordMetric('TCP_CONNECTION', timing.tcp);
    this.recordMetric('SSL_HANDSHAKE', timing.ssl);
    this.recordMetric('TIME_TO_FIRST_BYTE', timing.ttfb);
    this.recordMetric('DOM_CONTENT_LOADED', timing.domLoad);
    this.recordMetric('WINDOW_LOAD', timing.windowLoad);
    this.recordMetric('TOTAL_PAGE_LOAD', timing.total);

    console.log('[SPEED TRACKER] Page Load Metrics:', timing);
  }

  private trackWindowLoad(): void {
    if (!this.isEnabled) return;

    // Track First Contentful Paint
    const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
    if (fcpEntry) {
      this.recordMetric('FIRST_CONTENTFUL_PAINT', fcpEntry.startTime);
    }

    // Track Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            this.recordMetric('LARGEST_CONTENTFUL_PAINT', lastEntry.startTime);
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.warn('[SPEED TRACKER] LCP observer not supported');
      }
    }
  }

  private trackRouteChanges(): void {
    if (!this.isEnabled) return;

    let lastUrl = window.location.href;
    const startTime = performance.now();

    // Monitor for URL changes (SPA navigation)
    try {
      const observer = new MutationObserver(() => {
        if (window.location.href !== lastUrl) {
          const navigationTime = performance.now() - startTime;
          this.recordMetric('SPA_NAVIGATION', navigationTime);
          lastUrl = window.location.href;
          console.log(`[SPEED TRACKER] SPA Navigation: ${navigationTime.toFixed(2)}ms`);
        }
      });

      // Check if document.body exists and is a valid Node
      if (document.body && document.body.nodeType === Node.ELEMENT_NODE) {
        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });
      }
    } catch (error) {
      console.warn('[SPEED TRACKER] Route change tracking not available:', error);
    }
  }

  private trackResourceTiming(): void {
    if (!this.isEnabled) return;

    // Track resource loading performance
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    const resourceStats = {
      scripts: 0,
      stylesheets: 0,
      images: 0,
      fonts: 0,
      other: 0,
      totalSize: 0,
      totalTime: 0,
    };

    resources.forEach((resource) => {
      const duration = resource.responseEnd - resource.startTime;
      const size = resource.transferSize || 0;

      resourceStats.totalTime += duration;
      resourceStats.totalSize += size;

      if (resource.name.includes('.js')) {
        resourceStats.scripts++;
      } else if (resource.name.includes('.css')) {
        resourceStats.stylesheets++;
      } else if (resource.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
        resourceStats.images++;
      } else if (resource.name.match(/\.(woff|woff2|ttf|otf)$/)) {
        resourceStats.fonts++;
      } else {
        resourceStats.other++;
      }
    });

    this.recordMetric('TOTAL_RESOURCE_TIME', resourceStats.totalTime);
    this.recordMetric('TOTAL_RESOURCE_SIZE', resourceStats.totalSize);

    console.log('[SPEED TRACKER] Resource Stats:', resourceStats);
  }

  private recordMetric(name: string, value: number): void {
    if (!this.isEnabled || value < 0) return;

    const metric: PerformanceMetric = {
      name,
      value: Math.round(value * 100) / 100, // Round to 2 decimal places
      timestamp: Date.now(),
      url: window.location.href,
    };

    this.metrics.push(metric);

    // Keep only last 100 metrics to prevent memory leaks
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }
  }

  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  public getMetricsByName(name: string): PerformanceMetric[] {
    return this.metrics.filter(metric => metric.name === name);
  }

  public getAverageMetric(name: string): number {
    const metrics = this.getMetricsByName(name);
    if (metrics.length === 0) return 0;
    
    const sum = metrics.reduce((acc, metric) => acc + metric.value, 0);
    return Math.round((sum / metrics.length) * 100) / 100;
  }

  public getPerformanceSummary(): Record<string, number> {
    const summary: Record<string, number> = {};
    
    const metricNames = [...new Set(this.metrics.map(m => m.name))];
    metricNames.forEach(name => {
      summary[name] = this.getAverageMetric(name);
    });

    return summary;
  }

  public exportMetrics(): string {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      metrics: this.metrics,
      summary: this.getPerformanceSummary(),
    }, null, 2);
  }
}

// Global speed tracker instance
export const speedTracker = new SpeedTracker();

// Utility functions for manual tracking
export const trackCustomMetric = (name: string, value: number): void => {
  speedTracker['recordMetric'](name, value);
};

export const trackAsyncOperation = async <T>(
  name: string,
  operation: () => Promise<T>
): Promise<T> => {
  const startTime = performance.now();
  try {
    const result = await operation();
    const duration = performance.now() - startTime;
    trackCustomMetric(name, duration);
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    trackCustomMetric(`${name}_ERROR`, duration);
    throw error;
  }
};

export const getPerformanceReport = (): string => {
  return speedTracker.exportMetrics();
};

// Development helper
if (process.env.NODE_ENV === 'development') {
  // @ts-ignore
  window.speedTracker = speedTracker;
  // @ts-ignore
  window.getPerformanceReport = getPerformanceReport;
}