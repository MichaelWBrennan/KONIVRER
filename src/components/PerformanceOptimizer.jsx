/**
 * Performance Optimizer Component
 * Implements Core Web Vitals optimizations and PageSpeed improvements
 */

import { useEffect, useState } from 'react';

const PerformanceOptimizer = ({ children }) => {
  const [isOptimized, setIsOptimized] = useState(false);

  useEffect(() => {
    const optimizePerformance = async () => {
      // Critical CSS inlining
      const criticalCSS = `
        /* Critical above-the-fold styles */
        .loading-skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
        }
        
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        
        .performance-optimized {
          contain: layout style paint;
          will-change: auto;
        }
        
        .lazy-image {
          opacity: 0;
          transition: opacity 0.3s ease-in-out;
        }
        
        .lazy-image.loaded {
          opacity: 1;
        }
      `;

      // Add critical CSS
      const style = document.createElement('style');
      style.textContent = criticalCSS;
      document.head.appendChild(style);

      // Optimize images with intersection observer
      const images = document.querySelectorAll('img[data-src]');
      if (images.length > 0 && 'IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(
          entries => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
              }
            });
          },
          {
            rootMargin: '50px 0px',
            threshold: 0.01,
          },
        );

        images.forEach(img => imageObserver.observe(img));
      }

      // Preload critical resources
      const criticalResources = [
        { href: '/api/cards', as: 'fetch' },
        { href: '/api/version', as: 'fetch' },
      ];

      criticalResources.forEach(({ href, as }) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = as;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });

      // Add resource hints
      const resourceHints = [
        { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
        { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
        { rel: 'dns-prefetch', href: '//vitals.vercel-insights.com' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossOrigin: 'anonymous',
        },
      ];

      resourceHints.forEach(hint => {
        const link = document.createElement('link');
        Object.assign(link, hint);
        document.head.appendChild(link);
      });

      // Optimize viewport for mobile
      let viewport = document.querySelector('meta[name="viewport"]');
      if (!viewport) {
        viewport = document.createElement('meta');
        viewport.name = 'viewport';
        document.head.appendChild(viewport);
      }
      viewport.content =
        'width=device-width, initial-scale=1.0, viewport-fit=cover';

      // Add performance observer for Core Web Vitals
      if ('PerformanceObserver' in window) {
        // Largest Contentful Paint
        try {
          new PerformanceObserver(entryList => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];

            // Report to analytics
            if (window.gtag && lastEntry) {
              window.gtag('event', 'web_vitals', {
                event_category: 'Web Vitals',
                event_label: 'LCP',
                value: Math.round(lastEntry.startTime),
                non_interaction: true,
              });
            }
          }).observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          // Silently fail if not supported
        }

        // First Input Delay
        try {
          new PerformanceObserver(entryList => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
              if (window.gtag) {
                window.gtag('event', 'web_vitals', {
                  event_category: 'Web Vitals',
                  event_label: 'FID',
                  value: Math.round(entry.processingStart - entry.startTime),
                  non_interaction: true,
                });
              }
            });
          }).observe({ entryTypes: ['first-input'] });
        } catch (e) {
          // Silently fail if not supported
        }

        // Cumulative Layout Shift
        try {
          let clsValue = 0;
          new PerformanceObserver(entryList => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            });

            if (window.gtag) {
              window.gtag('event', 'web_vitals', {
                event_category: 'Web Vitals',
                event_label: 'CLS',
                value: Math.round(clsValue * 1000),
                non_interaction: true,
              });
            }
          }).observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
          // Silently fail if not supported
        }
      }

      // Optimize touch targets for mobile
      const touchTargets = document.querySelectorAll(
        'button, a, input, select, textarea',
      );
      touchTargets.forEach(target => {
        const computedStyle = window.getComputedStyle(target);
        const minSize = 44; // 44px minimum touch target size

        if (
          parseInt(computedStyle.height) < minSize ||
          parseInt(computedStyle.width) < minSize
        ) {
          target.style.minHeight = `${minSize}px`;
          target.style.minWidth = `${minSize}px`;
          target.style.display = 'inline-flex';
          target.style.alignItems = 'center';
          target.style.justifyContent = 'center';
        }
      });

      setIsOptimized(true);
    };

    // Run optimizations
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', optimizePerformance);
    } else {
      optimizePerformance();
    }

    return () => {
      document.removeEventListener('DOMContentLoaded', optimizePerformance);
    };
  }, []);

  // Add performance-optimized class to children
  useEffect(() => {
    if (isOptimized) {
      const elements = document.querySelectorAll('[data-performance-optimize]');
      elements.forEach(element => {
        element.classList.add('performance-optimized');
      });
    }
  }, [isOptimized]);

  return children;
};

// Loading skeleton component for better perceived performance
export const LoadingSkeleton = ({
  width = '100%',
  height = '20px',
  className = '',
}) => (
  <div
    className={`loading-skeleton ${className}`}
    style={{
      width,
      height,
      borderRadius: '4px',
      marginBottom: '8px',
    }}
    aria-label="Loading..."
  />
);

// Optimized image component with lazy loading
export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        backgroundColor: '#f0f0f0',
        borderRadius: '4px',
        overflow: 'hidden',
      }}
    >
      {!isLoaded && !hasError && <LoadingSkeleton width="100%" height="100%" />}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        className={`lazy-image ${isLoaded ? 'loaded' : ''} ${className}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        {...props}
      />
      {hasError && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#666',
            fontSize: '14px',
          }}
        >
          Failed to load image
        </div>
      )}
    </div>
  );
};

export default PerformanceOptimizer;
