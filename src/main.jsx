import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import './App.css';
import { initializeAnalytics, analyticsConfig } from './config/analytics.js';
import { initializeSecurity } from './config/security.js';

// Performance monitoring (only in development)
if (import.meta.env.DEV) {
  import('./utils/performance');
}

// Speed optimizations (production only)
if (import.meta.env.PROD) {
  import('./utils/speedOptimizations');
}

// Optimized service worker registration
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  // Use requestIdleCallback for better performance
  const registerSW = () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then(registration => {
        // Update on reload
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      })
      .catch(() => {
        // Silently fail in production
      });
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(registerSW);
  } else {
    setTimeout(registerSW, 1000);
  }
}

// Optimized root creation
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <StrictMode>
    <App />
    {analyticsConfig.vercel.enabled && (
      <>
        <Analytics />
        <SpeedInsights
          sampleRate={analyticsConfig.vercel.speedInsights.sampleRate}
        />
      </>
    )}
  </StrictMode>,
);

// Initialize security and analytics after render
initializeSecurity();
initializeAnalytics();

// CRITICAL: Comprehensive loading spinner removal
const removeAllLoadingElements = () => {
  // Remove by class names
  const loadingSelectors = [
    '.loading',
    '.loading-container',
    '.loading-spinner',
    '[class*="loading"]',
    '[class*="spinner"]',
    '[data-loading]',
    '#loading',
    '#spinner',
  ];

  loadingSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(element => {
      element.style.display = 'none';
      element.remove();
    });
  });

  // Remove any elements with loading text
  const allElements = document.querySelectorAll('*');
  allElements.forEach(element => {
    if (
      element.textContent &&
      element.textContent.includes('Loading KONIVRER')
    ) {
      element.style.display = 'none';
      element.remove();
    }
  });

  console.log('🗑️ Comprehensive loading element removal completed');
};

// CRITICAL: Unregister all service workers
const unregisterServiceWorkers = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
        console.log('🗑️ Unregistered service worker:', registration.scope);
      }
    } catch (error) {
      console.log('⚠️ Service worker unregistration error:', error);
    }
  }
};

// CRITICAL: Clear all caches
const clearAllCaches = async () => {
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      for (const cacheName of cacheNames) {
        await caches.delete(cacheName);
        console.log('🗑️ Deleted cache:', cacheName);
      }
    } catch (error) {
      console.log('⚠️ Cache clearing error:', error);
    }
  }
};

// Execute all cleanup operations
removeAllLoadingElements();
unregisterServiceWorkers();
clearAllCaches();

// Repeat cleanup after delays as fallback
setTimeout(removeAllLoadingElements, 100);
setTimeout(removeAllLoadingElements, 500);
setTimeout(removeAllLoadingElements, 1000);
