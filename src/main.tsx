import React from 'react';
import { createRoot } from 'react-dom/client';
import Phase2App from './core/Phase2App';
import Phase1App from './core/Phase1App';

console.log('[APP] Starting KONIVRER Phase 2 Application (Lightweight Autonomous)...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);

// Try Phase 2 app (lightweight autonomous), fallback to Phase 1
try {
  root.render(
    <React.StrictMode>
      <Phase2App />
    </React.StrictMode>
  );
  console.log('[APP] Phase 2 app initialized successfully');
} catch (error) {
  console.error('[APP] Phase 2 app failed, falling back to Phase 1:', error);
  root.render(
    <React.StrictMode>
      <Phase1App />
    </React.StrictMode>
  );
  console.log('[APP] Phase 1 app fallback initialized');
}