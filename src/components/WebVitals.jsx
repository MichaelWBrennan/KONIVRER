/**
 * Web Vitals monitoring component
 * Tracks Core Web Vitals and reports them to analytics
 */

import { useEffect } from 'react';
import { analytics } from '../utils/analytics';

const WebVitals = () => {
  useEffect(() => {
    // Only run in production or when analytics is enabled
    if (!import.meta.env.PROD && !import.meta.env.VITE_ENABLE_ANALYTICS) {
      return;
    }

    // Function to track web vitals
    const trackWebVital = metric => {
      analytics.performanceMetric(metric.name, Math.round(metric.value), 'ms');

      // Log in development for debugging
      if (import.meta.env.DEV) {
        console.log('Web Vital:', metric);
      }
    };

    // Dynamic import of web-vitals library
    import('web-vitals')
      .then(({ onCLS, onFID, onFCP, onLCP, onTTFB, onINP }) => {
        // Track Core Web Vitals
        onCLS(trackWebVital); // Cumulative Layout Shift
        onFID(trackWebVital); // First Input Delay
        onFCP(trackWebVital); // First Contentful Paint
        onLCP(trackWebVital); // Largest Contentful Paint
        onTTFB(trackWebVital); // Time to First Byte
        onINP(trackWebVital); // Interaction to Next Paint
      })
      .catch(error => {
        console.warn('Web Vitals library not available:', error);
      });

    // Track additional performance metrics
    const trackAdditionalMetrics = () => {
      if (!window.performance) return;

      // Navigation timing
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation) {
        analytics.performanceMetric(
          'dom_content_loaded',
          Math.round(
            navigation.domContentLoadedEventEnd -
              navigation.domContentLoadedEventStart,
          ),
        );

        analytics.performanceMetric(
          'load_complete',
          Math.round(navigation.loadEventEnd - navigation.loadEventStart),
        );

        analytics.performanceMetric(
          'dns_lookup',
          Math.round(navigation.domainLookupEnd - navigation.domainLookupStart),
        );

        analytics.performanceMetric(
          'tcp_connect',
          Math.round(navigation.connectEnd - navigation.connectStart),
        );

        analytics.performanceMetric(
          'server_response',
          Math.round(navigation.responseEnd - navigation.requestStart),
        );
      }

      // Paint timing
      const paintEntries = performance.getEntriesByType('paint');
      paintEntries.forEach(entry => {
        analytics.performanceMetric(
          entry.name.replace('-', '_'),
          Math.round(entry.startTime),
        );
      });

      // Resource timing summary
      const resources = performance.getEntriesByType('resource');
      const resourceStats = {
        total_resources: resources.length,
        total_size: resources.reduce(
          (sum, resource) => sum + (resource.transferSize || 0),
          0,
        ),
        avg_duration:
          resources.length > 0
            ? resources.reduce((sum, resource) => sum + resource.duration, 0) /
              resources.length
            : 0,
      };

      Object.entries(resourceStats).forEach(([key, value]) => {
        analytics.performanceMetric(
          key,
          Math.round(value),
          key === 'total_size' ? 'bytes' : 'ms',
        );
      });
    };

    // Track metrics after page load
    if (document.readyState === 'complete') {
      setTimeout(trackAdditionalMetrics, 1000);
    } else {
      window.addEventListener('load', () => {
        setTimeout(trackAdditionalMetrics, 1000);
      });
    }

    // Track memory usage if available
    const trackMemoryUsage = () => {
      if (performance.memory) {
        analytics.performanceMetric(
          'memory_used',
          Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
          'MB',
        );

        analytics.performanceMetric(
          'memory_total',
          Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
          'MB',
        );

        analytics.performanceMetric(
          'memory_limit',
          Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024),
          'MB',
        );
      }
    };

    // Track memory usage periodically
    const memoryInterval = setInterval(trackMemoryUsage, 30000); // Every 30 seconds

    // Cleanup
    return () => {
      clearInterval(memoryInterval);
    };
  }, []);

  // This component doesn't render anything
  return null;
};

export default WebVitals;
