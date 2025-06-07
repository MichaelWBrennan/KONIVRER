import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

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

// Initialize security, analytics, and skew protection after render
initializeSecurity();
initializeAnalytics();

// Initialize skew protection
if (import.meta.env.PROD) {
  import('./utils/skewProtection.js').then(({ skewProtection }) => {
    console.log('Vercel skew protection initialized');
  });
}
