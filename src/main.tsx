import React from 'react';
import { createRoot } from 'react-dom/client';
import FixedEnhancedApp from './core/FixedEnhancedApp';
import SimpleApp from './core/SimpleApp';

console.log('[APP] Starting KONIVRER Fixed Enhanced Application...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);

// Try fixed enhanced app, fallback to simple app if it fails
try {
  root.render(
    <React.StrictMode>
      <FixedEnhancedApp />
    </React.StrictMode>
  );
  console.log('[APP] Fixed enhanced app with proper autonomous systems initialized successfully');
} catch (error) {
  console.error('[APP] Fixed enhanced app failed, falling back to simple app:', error);
  root.render(
    <React.StrictMode>
      <SimpleApp />
    </React.StrictMode>
  );
  console.log('[APP] Simple app fallback initialized');
}