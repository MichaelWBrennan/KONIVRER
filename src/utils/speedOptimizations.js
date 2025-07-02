/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

/**
 * Speed optimization utilities
 * Implements various performance optimizations for better Core Web Vitals
 */

// Preload critical resources
export const preloadCriticalResources = () => {
  // Preload critical fonts
  const fontPreloads = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  ];

  fontPreloads.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    link.onload = function () {
      this.rel = 'stylesheet';
    };
    document.head.appendChild(link);
  });

  // Preload critical images
  const criticalImages = [
    '/favicon.svg',
    // Add other critical images here
  ];

  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};

// Optimize images with lazy loading and proper sizing
export const optimizeImages = () => {
  // Add intersection observer for lazy loading
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        }
      });
    });

    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
};

// Optimize third-party scripts
export const optimizeThirdPartyScripts = () => {
  // Defer non-critical scripts
  const deferScripts = () => {
    const scripts = document.querySelectorAll('script[data-defer]');
    scripts.forEach(script => {
      const newScript = document.createElement('script');
      newScript.src = script.dataset.src;
      newScript.async = true;
      document.head.appendChild(newScript);
    });
  };

  // Load third-party scripts after page load
  if (document.readyState === 'complete') {
    setTimeout(deferScripts, 1000);
  } else {
    window.addEventListener('load', () => {
      setTimeout(deferScripts, 1000);
    });
  }
};

// Reduce layout shifts
export const reduceLayoutShifts = () => {
  // Add aspect ratio containers for images
  const images = document.querySelectorAll('img:not([width]):not([height])');
  images.forEach(img => {
    // Set default dimensions to prevent layout shift
    if (!img.style.width && !img.style.height) {
      img.style.width = 'auto';
      img.style.height = 'auto';
    }
  });

  // Reserve space for dynamic content
  const dynamicContainers = document.querySelectorAll('[data-dynamic-height]');
  dynamicContainers.forEach(container => {
    const minHeight = container.dataset.dynamicHeight;
    if (minHeight && !container.style.minHeight) {
      container.style.minHeight = minHeight;
    }
  });
};

// Optimize CSS delivery
export const optimizeCSSDelivery = () => {
  // Inline critical CSS (this would be done at build time)
  // For runtime, we can optimize CSS loading

  // Remove unused CSS classes (basic implementation)
  const removeUnusedCSS = () => {
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    stylesheets.forEach(stylesheet => {
      // Mark as non-render-blocking
      stylesheet.media = 'print';
      stylesheet.onload = function () {
        this.media = 'all';
      };
    });
  };

  // Only run in production
  if (import.meta.env.PROD) {
    removeUnusedCSS();
  }
};

// Optimize JavaScript execution
export const optimizeJavaScript = () => {
  // Debounce scroll events
  let scrollTimeout;
  const optimizedScrollHandler = callback => {
    return () => {
      if (scrollTimeout) {
        cancelAnimationFrame(scrollTimeout);
      }
      scrollTimeout = requestAnimationFrame(callback);
    };
  };

  // Replace existing scroll listeners with optimized versions
  window.addEventListener(
    'scroll',
    optimizedScrollHandler(() => {
      // Scroll handling logic
    }),
    { passive: true },
  );

  // Optimize resize events
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Resize handling logic
      window.dispatchEvent(new Event('optimizedResize'));
    }, 250);
  });
};

// Prefetch next page resources
export const prefetchNextPageResources = () => {
  // Prefetch likely next pages based on current page
  const currentPath = window.location.pathname;
  let prefetchUrls = [];

  switch (currentPath) {
    case '/':
      prefetchUrls = ['/cards', '/deckbuilder'];
      break;
    case '/cards':
      prefetchUrls = ['/deckbuilder', '/decks'];
      break;
    case '/deckbuilder':
      prefetchUrls = ['/cards', '/decks'];
      break;
    default:
      prefetchUrls = ['/'];
  }

  // Use requestIdleCallback for prefetching
  const prefetchResource = url => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      prefetchUrls.forEach(prefetchResource);
    });
  } else {
    setTimeout(() => {
      prefetchUrls.forEach(prefetchResource);
    }, 2000);
  }
};

// Service Worker optimization
export const optimizeServiceWorker = () => {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    // Register service worker with optimizations
    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none',
        });

        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              // New content available, notify user
              console.log('New content available, please refresh.');
            }
          });
        });

        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60000); // Check every minute
      } catch (error) {
        console.log('Service Worker registration failed:', error);
      }
    };

    // Register after page load
    if (document.readyState === 'complete') {
      registerSW();
    } else {
      window.addEventListener('load', registerSW);
    }
  }
};

// Memory optimization
export const optimizeMemoryUsage = () => {
  // Clean up event listeners on page unload
  window.addEventListener('beforeunload', () => {
    // Remove all event listeners
    const elements = document.querySelectorAll('*');
    elements.forEach(element => {
      const clone = element.cloneNode(true);
      element.parentNode?.replaceChild(clone, element);
    });
  });

  // Periodic garbage collection hint
  if (window.gc && import.meta.env.DEV) {
    setInterval(() => {
      if (
        performance.memory &&
        performance.memory.usedJSHeapSize > 50 * 1024 * 1024
      ) {
        window.gc();
      }
    }, 30000);
  }
};

// Initialize all optimizations
export const initializeSpeedOptimizations = () => {
  // Run immediately
  preloadCriticalResources();
  reduceLayoutShifts();
  optimizeJavaScript();

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      optimizeImages();
      optimizeCSSDelivery();
    });
  } else {
    optimizeImages();
    optimizeCSSDelivery();
  }

  // Run after page load
  if (document.readyState === 'complete') {
    optimizeThirdPartyScripts();
    prefetchNextPageResources();
    optimizeServiceWorker();
    optimizeMemoryUsage();
  } else {
    window.addEventListener('load', () => {
      optimizeThirdPartyScripts();
      prefetchNextPageResources();
      optimizeServiceWorker();
      optimizeMemoryUsage();
    });
  }
};

// Auto-initialize in production
if (import.meta.env.PROD) {
  initializeSpeedOptimizations();
}

export default {
  preloadCriticalResources,
  optimizeImages,
  optimizeThirdPartyScripts,
  reduceLayoutShifts,
  optimizeCSSDelivery,
  optimizeJavaScript,
  prefetchNextPageResources,
  optimizeServiceWorker,
  optimizeMemoryUsage,
  initializeSpeedOptimizations,
};
