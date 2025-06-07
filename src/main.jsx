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

// Initialize security configurations
initializeSecurity();

// Initialize analytics
initializeAnalytics();

// Create root and render
const container = document.getElementById('root');
const root = createRoot(container);

// Enhanced App component with analytics
function AppWithAnalytics() {
  return (
    <>
      <App />
      {analyticsConfig.enabled && <Analytics />}
      {analyticsConfig.speedInsights && <SpeedInsights />}
    </>
  );
}

root.render(
  <StrictMode>
    <AppWithAnalytics />
  </StrictMode>
);

console.log('✅ KONIVRER Deck Database loaded successfully');

// CRITICAL: Aggressively remove any loading screens that might persist
setTimeout(() => {
  const loadingElements = document.querySelectorAll('.loading-container, .loading-spinner, [class*="loading"]');
  loadingElements.forEach(element => {
    element.style.display = 'none';
    element.remove();
  });
  console.log('🗑️ Removed any persistent loading elements');
}, 100);