/**
 * Performance Optimizations for PageSpeed Insights
 * Implements Core Web Vitals improvements and mobile optimization
 */

// Critical Resource Preloading
export const preloadCriticalResources = () => {
  // Preload critical fonts
  const fontPreloads = [
    'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2',
  ];

  fontPreloads.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    link.href = href;
    document.head.appendChild(link);
  });

  // Preload critical API endpoints
  if ('serviceWorker' in navigator) {
    const criticalEndpoints = [
      '/api/cards',
      '/api/decks',
      '/api/version'
    ];

    criticalEndpoints.forEach(endpoint => {
      fetch(endpoint, { method: 'HEAD' }).catch(() => {
        // Silently fail for preloading
      });
    });
  }
};

// Image Optimization
export const optimizeImages = () => {
  // Lazy loading for images
  const images = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    images.forEach(img => {
      img.src = img.dataset.src;
      img.classList.remove('lazy');
    });
  }
};

// Layout Shift Prevention
export const preventLayoutShift = () => {
  // Add aspect ratio containers for dynamic content
  const dynamicContainers = document.querySelectorAll('[data-aspect-ratio]');
  
  dynamicContainers.forEach(container => {
    const ratio = container.dataset.aspectRatio || '16/9';
    container.style.aspectRatio = ratio;
  });

  // Reserve space for dynamic content
  const placeholders = document.querySelectorAll('[data-placeholder-height]');
  placeholders.forEach(placeholder => {
    const height = placeholder.dataset.placeholderHeight;
    placeholder.style.minHeight = height;
  });
};

// Critical CSS Inlining
export const inlineCriticalCSS = () => {
  const criticalCSS = `
    /* Critical above-the-fold styles */
    body {
      margin: 0;
      font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
      line-height: 1.5;
      font-weight: 400;
      color-scheme: light dark;
      color: rgba(255, 255, 255, 0.87);
      background-color: #242424;
      font-synthesis: none;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      -webkit-text-size-adjust: 100%;
    }
    
    .loading-skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
    }
    
    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    
    .visually-hidden {
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
    }
  `;

  const style = document.createElement('style');
  style.textContent = criticalCSS;
  document.head.appendChild(style);
};

// Resource Hints
export const addResourceHints = () => {
  const hints = [
    { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
    { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
    { rel: 'dns-prefetch', href: '//vitals.vercel-insights.com' },
    { rel: 'dns-prefetch', href: '//va.vercel-scripts.com' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  ];

  hints.forEach(hint => {
    const link = document.createElement('link');
    Object.assign(link, hint);
    document.head.appendChild(link);
  });
};

// Mobile Optimization
export const optimizeForMobile = () => {
  // Ensure proper viewport
  let viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) {
    viewport = document.createElement('meta');
    viewport.name = 'viewport';
    document.head.appendChild(viewport);
  }
  viewport.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover';

  // Add touch-action optimization
  document.body.style.touchAction = 'manipulation';

  // Optimize touch targets
  const touchTargets = document.querySelectorAll('button, a, input, select, textarea');
  touchTargets.forEach(target => {
    const computedStyle = window.getComputedStyle(target);
    const minSize = 44; // 44px minimum touch target size
    
    if (parseInt(computedStyle.height) < minSize || parseInt(computedStyle.width) < minSize) {
      target.style.minHeight = `${minSize}px`;
      target.style.minWidth = `${minSize}px`;
    }
  });
};

// Performance Monitoring
export const initPerformanceMonitoring = () => {
  // Core Web Vitals monitoring
  if ('PerformanceObserver' in window) {
    // Largest Contentful Paint
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      // Send to analytics
      if (window.gtag) {
        window.gtag('event', 'LCP', {
          event_category: 'Web Vitals',
          value: Math.round(lastEntry.startTime),
          non_interaction: true,
        });
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        if (window.gtag) {
          window.gtag('event', 'FID', {
            event_category: 'Web Vitals',
            value: Math.round(entry.processingStart - entry.startTime),
            non_interaction: true,
          });
        }
      });
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      
      if (window.gtag) {
        window.gtag('event', 'CLS', {
          event_category: 'Web Vitals',
          value: Math.round(clsValue * 1000),
          non_interaction: true,
        });
      }
    }).observe({ entryTypes: ['layout-shift'] });
  }
};

// Service Worker for Caching
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.warn('Service Worker registered:', registration);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

// Initialize all optimizations
export const initializePerformanceOptimizations = () => {
  // Run immediately
  addResourceHints();
  inlineCriticalCSS();
  preloadCriticalResources();
  
  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      optimizeImages();
      preventLayoutShift();
      optimizeForMobile();
      initPerformanceMonitoring();
    });
  } else {
    optimizeImages();
    preventLayoutShift();
    optimizeForMobile();
    initPerformanceMonitoring();
  }

  // Register service worker
  window.addEventListener('load', () => {
    registerServiceWorker();
  });
};

export default {
  preloadCriticalResources,
  optimizeImages,
  preventLayoutShift,
  inlineCriticalCSS,
  addResourceHints,
  optimizeForMobile,
  initPerformanceMonitoring,
  registerServiceWorker,
  initializePerformanceOptimizations,
};