import React from 'react';
import { createRoot } from 'react-dom/client';
import ProgressiveApp from './core/ProgressiveApp';

console.log('[APP] Starting KONIVRER Progressive Application...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);

// Progressive app - starts simple, enhances progressively
root.render(
  <React.StrictMode>
    <ProgressiveApp />
  </React.StrictMode>
);

console.log('[APP] Progressive app initialized successfully');