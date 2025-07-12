import React from 'react';
import { createRoot } from 'react-dom/client';
import SimplePhase3App from './SimplePhase3App';

console.log('[APP] Starting KONIVRER Deck Database with Enhanced Login Modal...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);

// Render the main application with enhanced login modal
try {
  root.render(
    <React.StrictMode>
      <SimplePhase3App />
    </React.StrictMode>
  );
  console.log('[APP] KONIVRER Deck Database with Enhanced Login Modal rendered successfully');
} catch (error) {
  console.error('[APP] Application failed to load:', error);
  // Fallback to minimal app
  const MinimalApp = () => (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#1a1a1a', 
      color: 'white', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#d4af37' }}>⭐ KONIVRER Error ⭐</h1>
      <p>Application failed to load. Error: {error.message}</p>
    </div>
  );
  root.render(<MinimalApp />);
}