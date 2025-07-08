import React from 'react';
import { createRoot } from 'react-dom/client';
import EnhancedApp from './core/EnhancedApp';
import SimpleApp from './core/SimpleApp';

console.log('[APP] Starting KONIVRER Enhanced Application...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);

// Try to render the enhanced app, fallback to simple app if it fails
try {
  root.render(
    <React.StrictMode>
      <EnhancedApp />
    </React.StrictMode>
  );
  console.log('[APP] Enhanced app with all autonomous systems initialized successfully');
} catch (error) {
  console.error('[APP] Enhanced app failed, falling back to simple app:', error);
  root.render(
    <React.StrictMode>
      <SimpleApp />
    </React.StrictMode>
  );
  console.log('[APP] Simple app fallback initialized');
}