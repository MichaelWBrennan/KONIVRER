import React from 'react';
import { createRoot } from 'react-dom/client';
import Phase3App from './core/Phase3App';
import Phase2App from './core/Phase2App';
import Phase1App from './core/Phase1App';
import './styles/global.css';

console.log('[APP] Starting KONIVRER Phase 3 Application (Advanced Autonomous)...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);

// Try Phase 3 app (advanced autonomous), fallback to Phase 2, then Phase 1
try {
  root.render(
    <React.StrictMode>
      <Phase3App />
    </React.StrictMode>
  );
  console.log('[APP] Phase 3 app initialized successfully');
} catch (error) {
  console.error('[APP] Phase 3 app failed, falling back to Phase 2:', error);
  try {
    root.render(
      <React.StrictMode>
        <Phase2App />
      </React.StrictMode>
    );
    console.log('[APP] Phase 2 app fallback initialized');
  } catch (error2) {
    console.error('[APP] Phase 2 app also failed, falling back to Phase 1:', error2);
    root.render(
      <React.StrictMode>
        <Phase1App />
      </React.StrictMode>
    );
    console.log('[APP] Phase 1 app final fallback initialized');
  }
}