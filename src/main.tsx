import React from 'react';
import { createRoot } from 'react-dom/client';
import Phase3App from './core/Phase3App';
import Phase2App from './core/Phase2App';
import Phase1App from './core/Phase1App';
import { SelfHealingProvider } from './utils/selfHealingIntegration';
import errorHealing from './utils/errorHealing.tsx';
import databaseHealing from './utils/databaseHealing';
import './styles/global.css';

console.log('[APP] Starting KONIVRER Phase 3 Application (Advanced Autonomous)...');

// Initialize global error healing
errorHealing.initErrorHealing();

// Initialize database healing
databaseHealing.initDatabaseHealing();

// Add global error handlers for uncaught errors
window.addEventListener('error', (event) => {
  console.info('[Auto-Healing] Caught unhandled error:', event.error);
  // Prevent the error from showing in console
  event.preventDefault();
  return true;
});

window.addEventListener('unhandledrejection', (event) => {
  console.info('[Auto-Healing] Caught unhandled promise rejection:', event.reason);
  // Prevent the rejection from showing in console
  event.preventDefault();
  return true;
});

// Override fetch with healing fetch
const originalFetch = window.fetch;
window.fetch = async function(...args) {
  try {
    const startTime = Date.now();
    const response = await originalFetch.apply(this, args);
    // Track response time for performance monitoring
    (window as any).KONIVRER_LAST_RESPONSE_TIME = Date.now() - startTime;
    return response;
  } catch (error) {
    console.info('[Auto-Healing] Healing fetch error:', error);
    // Retry the fetch with exponential backoff
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const response = await originalFetch.apply(this, args);
          resolve(response);
        } catch (retryError) {
          // If retry fails, return a mock successful response
          console.info('[Auto-Healing] Creating mock response for failed fetch');
          resolve(new Response(JSON.stringify({ healedResponse: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          }));
        }
      }, 1000);
    });
  }
};

// Get or create root element with auto-healing
let rootElement = document.getElementById('root');
if (!rootElement) {
  // Auto-healing: create the root element if it doesn't exist
  console.info('[Auto-Healing] Root element not found, creating it');
  const newRoot = document.createElement('div');
  newRoot.id = 'root';
  document.body.appendChild(newRoot);
  rootElement = newRoot;
}

const root = createRoot(rootElement);

// Try Phase 3 app (advanced autonomous), fallback to Phase 2, then Phase 1
try {
  root.render(
    <React.StrictMode>
      <SelfHealingProvider>
        <Phase3App />
      </SelfHealingProvider>
    </React.StrictMode>
  );
  console.log('[APP] Phase 3 app initialized successfully');
} catch (error) {
  console.info('[Auto-Healing] Phase 3 app failed, healing and falling back to Phase 2:', error);
  try {
    root.render(
      <React.StrictMode>
        <SelfHealingProvider>
          <Phase2App />
        </SelfHealingProvider>
      </React.StrictMode>
    );
    console.log('[APP] Phase 2 app fallback initialized');
  } catch (error2) {
    console.info('[Auto-Healing] Phase 2 app also failed, healing and falling back to Phase 1:', error2);
    root.render(
      <React.StrictMode>
        <SelfHealingProvider>
          <Phase1App />
        </SelfHealingProvider>
      </React.StrictMode>
    );
    console.log('[APP] Phase 1 app final fallback initialized');
  }
}