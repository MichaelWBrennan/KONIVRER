import React from 'react';
import { createRoot } from 'react-dom/client';
import AllInOneApp from './core/AllInOne';
// Import the auto-system module to start the autonomous system
import './auto-system.js';

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
