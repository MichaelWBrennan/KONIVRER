import React from 'react';
import { createRoot } from 'react-dom/client';
import Phase2App from './core/Phase2App';

console.log('[APP] Starting KONIVRER Phase 2 Application (Core + Security + Optimization)...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);

// Phase 2: Core + Security + Optimization systems
root.render(
  <React.StrictMode>
    <Phase2App />
  </React.StrictMode>
);

console.log('[APP] Phase 2 app initialized successfully');