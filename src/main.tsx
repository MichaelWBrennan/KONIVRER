import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import AllInOneApp from './core/AllInOne-simple';
import LoadingScreen from './components/LoadingScreen';

console.log('[APP] Starting KONIVRER application...');

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  
  const handleLoadingComplete = () => {
    setLoading(false);
  };
  
  return (
    <React.StrictMode>
      {loading && <LoadingScreen onComplete={handleLoadingComplete} timeout={2000} />}
      <AllInOneApp />
    </React.StrictMode>
  );
};

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }

  const root = createRoot(rootElement);
  root.render(<App />);

  console.log('[APP] Successfully initialized');
} catch (error) {
  console.error('[APP] Failed to initialize:', error);
}