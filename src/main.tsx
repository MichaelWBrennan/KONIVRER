import React from 'react';
import { createRoot } from 'react-dom/client';
import Phase3App from './core/Phase3App';

console.log('[APP] Starting KONIVRER Phase 3 Application (Core + Security + Evolution)...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);

// Phase 3: Core + Security + Evolution + Dependency Management
root.render(
  <React.StrictMode>
    <Phase3App />
  </React.StrictMode>
);

console.log('[APP] Phase 3 app initialized successfully');