import React from 'react';
import { createRoot } from 'react-dom/client';
import AllInOneApp from './core/AllInOne';
// Import the system modules
import './auto-system.js';
import './cutting-edge-updater.js';
import './security/CuttingEdgeSecurity.js';
// Import ancient theme
import './styles/ancient-theme.css';

// Log application startup
console.log('[APP] Starting with ancient scroll theme...');

// Create a tattered scroll header
const createAncientHeader = () => {
  const header = document.createElement('header');
  header.className = 'ancient-header';
  header.innerHTML = `
    <div class="ancient-scroll tattered-edge">
      <h1 class="text-center">KONIVRER Deck Database</h1>
      <div class="divider"></div>
      <p class="text-center faded-text">Ancient scrolls of knowledge and power</p>
    </div>
  `;
  document.body.insertBefore(header, document.getElementById('root'));
};

// Initialize ancient theme when DOM is loaded
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    // Add ancient scroll class to body
    document.body.classList.add('ancient-theme');
    
    // Create the ancient header
    createAncientHeader();
  });
}

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
console.log('[APP] Successfully initialized with ancient scroll theme');
