import React from 'react';
import { createRoot } from 'react-dom/client';
import AllInOneApp from './core/AllInOne';

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
  import('web-vitals').then((webVitals: any) => {
    if (webVitals.getCLS) webVitals.getCLS(console.log);
    if (webVitals.getFID) webVitals.getFID(console.log);
    if (webVitals.getFCP) webVitals.getFCP(console.log);
    if (webVitals.getLCP) webVitals.getLCP(console.log);
    if (webVitals.getTTFB) webVitals.getTTFB(console.log);
  }).catch(() => {
    // Web vitals not available, ignore
  });
}

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
