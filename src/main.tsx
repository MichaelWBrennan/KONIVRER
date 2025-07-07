import React from 'react';
import { createRoot } from 'react-dom/client';
import AllInOneApp from './core/AllInOne-simple';

console.log('[APP] Starting KONIVRER application...');

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

  console.log('[APP] Successfully initialized');
} catch (error) {
  console.error('[APP] Failed to initialize:', error);
}