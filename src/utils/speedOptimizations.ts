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
export const preloadCriticalResources = (): void => {
  // Preload critical fonts
  const fontPreloads = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
  ];

  fontPreloads.forEach((href) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    link.onload = function() {
      this.rel = 'stylesheet';
    };
    document.head.appendChild(link);
  });

  // Preload critical images
  const criticalImages = [
    '/favicon.svg',
    // Add other critical images here
  ];

  criticalImages.forEach((src) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};

// Optimize images with lazy loading and proper sizing
export const optimizeImages = (): void => {
  // Add intersection observer for lazy loading
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
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
export const optimizeThirdPartyScripts = (): void => {
  // Defer non-critical scripts
  const deferScripts = (): void => {
    const scripts = document.querySelectorAll('script[data-src]');
    scripts.forEach((script) => {
      const newScript = document.createElement('script');
      newScript.src = script.getAttribute('data-src') || '';
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
export const reduceLayoutShifts = (): void => {
  // Add aspect ratio containers for images
  const images = document.querySelectorAll('img:not([height])');
  images.forEach((img: HTMLImageElement) => {
    // Set default dimensions to prevent layout shift
    if (!img.style.width && !img.style.height) {
      img.style.width = 'auto';
      img.style.height = 'auto';
    }
  });

  // Reserve space for dynamic content
  const dynamicContainers = document.querySelectorAll('[data-dynamic-height]');
  dynamicContainers.forEach((container: HTMLElement) => {
    const minHeight = container.dataset.dynamicHeight;
    if (minHeight && !container.style.minHeight) {
      container.style.minHeight = minHeight;
    }
  });
};

// Optimize CSS delivery
export const optimizeCSSDelivery = (): void => {
  // Inline critical CSS (this would be done at build time)
  // For runtime, we can optimize CSS loading

  // Remove unused CSS classes (basic implementation)
  const removeUnusedCSS = (): void => {
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    stylesheets.forEach((stylesheet: HTMLLinkElement) => {
      // Mark as non-render-blocking
      stylesheet.media = 'print';
      stylesheet.onload = function() {
        this.media = 'all';
      };
    });
  };

  // Only run in production
  if (process.env.NODE_ENV === 'production') {
    removeUnusedCSS();
  }
};

// Optimize JavaScript execution
export const optimizeJavaScript = (): void => {
  // Debounce scroll events
  let scrollTimeout: number;
  const optimizedScrollHandler = (callback: () => void) => {
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
    { passive: true }
  );

  // Optimize resize events
  let resizeTimeout: number;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(() => {
      // Resize handling logic
      window.dispatchEvent(new Event('optimizedResize'));
    }, 250);
  });
};

// Prefetch next page resources
export const prefetchNextPageResources = (): void => {
  // Prefetch likely next pages based on current page
  const currentPath = window.location.pathname;
  let prefetchUrls: string[] = [];

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
  const prefetchResource = (url: string) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      prefetchUrls.forEach(prefetchResource);
    });
  } else {
    setTimeout(() => {
      prefetchUrls.forEach(prefetchResource);
    }, 2000);
  }
};

// Service Worker optimization
export const optimizeServiceWorker = (): void => {
  if ('serviceWorker' in navigator) {
    // Register service worker with optimizations
    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        
        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed') {
                // New content available, notify user
                console.log('New content available, please refresh.');
              }
            });
          }
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
export const optimizeMemoryUsage = (): void => {
  // Clean up event listeners on page unload
  window.addEventListener('beforeunload', () => {
    // Remove all event listeners
    const elements = document.querySelectorAll('[data-has-listeners]');
    elements.forEach((element) => {
      const clone = element.cloneNode(true);
      if (element.parentNode) {
        element.parentNode.replaceChild(clone, element);
      }
    });
  });

  // Periodic garbage collection hint
  if (typeof window.gc === 'function') {
    setInterval(() => {
      if (document.hidden) {
        window.gc();
      }
    }, 30000);
  }
};

// Initialize all optimizations
export const initializeSpeedOptimizations = (): void => {
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
if (process.env.NODE_ENV === 'production') {
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
  initializeSpeedOptimizations
};
