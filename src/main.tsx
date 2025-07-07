import React from 'react';
import { createRoot } from 'react-dom/client';
import AllInOneApp from './core/AllInOne';
import { shouldSkipAutonomousSystems } from './utils/buildDetection';

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Web Vitals for performance monitoring
if (process.env.NODE_ENV === 'production') {
  import('web-vitals')
    .then((webVitals: any) => {
      if (webVitals.getCLS) webVitals.getCLS(console.log);
      if (webVitals.getFID) webVitals.getFID(console.log);
      if (webVitals.getFCP) webVitals.getFCP(console.log);
      if (webVitals.getLCP) webVitals.getLCP(console.log);
      if (webVitals.getTTFB) webVitals.getTTFB(console.log);
    })
    .catch(() => {
      // Web vitals not available, ignore
    });
}

// AGGRESSIVE BUILD DETECTION - Multiple exit points
// Exit immediately if any build indicators are present
if (
  typeof window === 'undefined' ||
  typeof document === 'undefined' ||
  process.env.VERCEL === '1' ||
  process.env.VERCEL_ENV ||
  process.env.NODE_ENV === 'production' ||
  shouldSkipAutonomousSystems()
) {
  console.log('[BUILD] IMMEDIATE EXIT: Build environment detected, skipping app initialization');
  
  // Minimal DOM for build process only if document exists
  if (typeof document !== 'undefined') {
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = '<div>Build in progress...</div>';
    }
  }
  
  // Force exit - do not continue execution
  if (typeof process !== 'undefined' && process.exit) {
    // In Node.js environment, exit immediately
    setTimeout(() => process.exit(0), 100);
  }
} else {
  // Only initialize app in true browser environment
  try {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      throw new Error('Root element not found');
    }

    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <AllInOneApp />
      </React.StrictMode>,
    );
    
    console.log('[APP] Successfully initialized in browser environment');
  } catch (error) {
    console.error('[APP] Failed to initialize:', error);
    // Fail silently in build environments
    if (shouldSkipAutonomousSystems()) {
      console.log('[BUILD] Ignoring initialization error in build environment');
    }
  }
}
