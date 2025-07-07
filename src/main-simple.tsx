import React from 'react';
import { createRoot } from 'react-dom/client';
import AllInOneApp from './core/AllInOne';
// Import the cutting-edge system modules
import './auto-system.js';
import './cutting-edge-updater.js';
import './security/CuttingEdgeSecurity.js';

// Log application startup
console.log('[APP] Starting with cutting-edge technologies and security...');

// Get the root element
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

// Create the root and render the application
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AllInOneApp />
  </React.StrictMode>,
);

// Log successful initialization
console.log('[APP] Successfully initialized with cutting-edge features and quantum-resistant security');
