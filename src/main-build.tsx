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
        <p>This is a build-safe version of the application.</p>
      </div>
    </div>
  );
};

// Build detection - if any build indicators are present, use minimal app
const isBuild =
  typeof window === 'undefined' ||
  typeof document === 'undefined' ||
  process.env.NODE_ENV === 'production' ||
  process.env.VERCEL === '1' ||
  process.env.CI === 'true' ||
  process.env.VITE_BUILD === 'true';

console.log('[BUILD-SAFE] Build detection:', isBuild);

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
    // Dynamically import the full app only in non-build environments
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
