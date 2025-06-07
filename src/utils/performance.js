// Performance monitoring utilities
export const measurePerformance = () => {
  if (typeof window !== 'undefined' && window.performance) {
    const navigation = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');

    const metrics = {
      // Core Web Vitals
      domContentLoaded:
        navigation.domContentLoadedEventEnd -
        navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,

      // Paint metrics
      firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint:
        paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,

      // Network timing
      dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
      tcpConnect: navigation.connectEnd - navigation.connectStart,
      serverResponse: navigation.responseEnd - navigation.requestStart,

      // Total page load time
      totalLoadTime: navigation.loadEventEnd - navigation.navigationStart,
    };

    console.warn('Performance Metrics:', metrics);
    return metrics;
  }
  return null;
};

// Measure and log performance when page loads
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(measurePerformance, 100);
  });
}

// Track route changes for SPA performance
export const trackRouteChange = routeName => {
  if (typeof window !== 'undefined' && window.performance) {
    performance.mark(`route-${routeName}-start`);

    // Measure after component renders
    setTimeout(() => {
      performance.mark(`route-${routeName}-end`);
      performance.measure(
        `route-${routeName}`,
        `route-${routeName}-start`,
        `route-${routeName}-end`
      );

      const measure = performance.getEntriesByName(`route-${routeName}`)[0];
      console.warn(`Route ${routeName} load time:`, measure.duration, 'ms');
    }, 0);
  }
};
