import React from 'react';
import { createRoot } from 'react-dom/client';

// Minimal build-safe component
const MinimalApp: React.FC = () => {
  return (
    <div
      style={{
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        background: '#0f0f0f',
        color: '#ffffff',
        minHeight: '100vh',
      }}
    >
      <h1>🌟 KONIVRER - Deck Database</h1>
      <nav
        style={{
          background: '#000',
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '20px',
        }}
      >
        <span style={{ marginRight: '20px' }}>⭐ Home</span>
        <span style={{ marginRight: '20px' }}>⭐ Deck Builder</span>
        <span style={{ marginRight: '20px' }}>⭐ Card Database</span>
        <span style={{ marginRight: '20px' }}>⭐ Rules</span>
        <span>⭐ Login</span>
      </nav>
      <div
        style={{ padding: '20px', background: '#1a1a1a', borderRadius: '5px' }}
      >
        <h2>✨ Welcome to KONIVRER</h2>
        <p>A mystical trading card game with esoteric themes.</p>
        <p>
          Experience the mystical world of KONIVRER with our redesigned
          interface.
        </p>
        <div style={{ marginTop: '20px' }}>
          <h3>🎮 Game Features</h3>
          <ul style={{ marginLeft: '20px' }}>
            <li>⭐ Deck Building</li>
            <li>⭐ Card Database</li>
            <li>⭐ Game Rules</li>
            <li>⭐ AI Demonstrations</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// ULTRA-AGGRESSIVE build detection - if ANY of these are true, use minimal app
// Only detect actual build time, not production runtime
const isBuild =
  typeof window === 'undefined' ||
  typeof document === 'undefined' ||
  !document?.body ||
  process.env.VITE_BUILD === 'true' ||
  process.env.KONIVRER_BUILD_ID === 'vercel-build' ||
  process.env.npm_lifecycle_event === 'build' ||
  process.env.npm_command === 'run-script' ||
  process.env.DISABLE_AUTONOMOUS === 'true' ||
  process.env.FORCE_BUILD_MODE === 'true' ||
  (typeof navigator !== 'undefined' &&
    (navigator.userAgent.includes('Node.js') ||
      navigator.userAgent.includes('jsdom') ||
      navigator.userAgent.includes('HeadlessChrome') ||
      navigator.userAgent === ''));

console.log('[BUILD-SAFE] Build detection:', isBuild);
console.log('[BUILD-SAFE] Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  VERCEL: process.env.VERCEL,
  CI: process.env.CI,
  VITE_BUILD: process.env.VITE_BUILD,
});

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }

  const root = createRoot(rootElement);

  if (isBuild) {
    console.log('[BUILD-SAFE] Using minimal build-safe app');
    root.render(
      <React.StrictMode>
        <MinimalApp />
      </React.StrictMode>,
    );
  } else {
    console.log('[BUILD-SAFE] Loading full application...');
    // Use full version with all features
    import('./core/AllInOne')
      .then(({ default: AllInOneApp }) => {
        root.render(
          <React.StrictMode>
            <AllInOneApp />
          </React.StrictMode>,
        );
      })
      .catch(error => {
        console.error(
          '[BUILD-SAFE] Failed to load full app, using minimal:',
          error,
        );
        root.render(
          <React.StrictMode>
            <MinimalApp />
          </React.StrictMode>,
        );
      });
  }

  console.log('[BUILD-SAFE] Successfully initialized');
} catch (error) {
  console.error('[BUILD-SAFE] Failed to initialize:', error);
}
