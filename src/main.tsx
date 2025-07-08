import React from 'react';
import { createRoot } from 'react-dom/client';
import AllInOneApp from './core/AllInOne-streamlined';
import { SelfHealingProvider } from './core/SelfHealer';
import { SelfOptimizer } from './core/SelfOptimizer';

console.log('[APP] Starting KONIVRER application...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AllInOneApp />
  </React.StrictMode>
);

console.log('[APP] Successfully initialized');