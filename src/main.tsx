import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import AllInOneApp from './core/AllInOne-simple';
import LoadingScreen from './components/LoadingScreen';
import { SelfHealingProvider, ErrorStatistics } from './core/SelfHealer';
import { PerformanceMonitor } from './core/SelfOptimizer';

console.log('[APP] Starting KONIVRER application...');

// Enable debug mode in development
const isDebugMode = process.env.NODE_ENV === 'development';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  
  const handleLoadingComplete = () => {
    setLoading(false);
  };
  
  return (
    <React.StrictMode>
      <SelfHealingProvider config={{
        maxRecoveryAttempts: 5,
        enableLocalRecovery: true,
        enableNetworkRecovery: true,
        enableStateRecovery: true,
        recoveryDelay: 1000,
        logErrors: true,
        reportErrors: isDebugMode
      }}>
        {loading && <LoadingScreen onComplete={handleLoadingComplete} timeout={2000} />}
        <AllInOneApp />
        {isDebugMode && <PerformanceMonitor showUI={true} position="top-right" />}
        {isDebugMode && <ErrorStatistics showUI={true} position="bottom-left" />}
      </SelfHealingProvider>
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