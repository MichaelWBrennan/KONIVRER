import React from 'react';
import { createRoot } from 'react-dom/client';
import SimpleApp from './core/SimpleApp';

console.log('[APP] Starting KONIVRER application...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <SimpleApp />
  </React.StrictMode>
);

console.log('[APP] Successfully initialized');