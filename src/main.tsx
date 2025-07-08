import React from 'react';
import { createRoot } from 'react-dom/client';
import DiagnosticApp from './core/DiagnosticApp';
import EnhancedApp from './core/EnhancedApp';
import SimpleApp from './core/SimpleApp';

console.log('[APP] Starting KONIVRER Diagnostic Mode...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);

// Use diagnostic app to identify issues
root.render(
  <React.StrictMode>
    <DiagnosticApp />
  </React.StrictMode>
);

console.log('[APP] Diagnostic app initialized');