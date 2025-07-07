import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import AllInOneApp from './core/AllInOne-simple';
import LoadingScreen from './components/LoadingScreen';
import { SelfHealingProvider } from './core/SelfHealer';
import { SelfOptimizer } from './core/SelfOptimizer';

console.log('[APP] Starting KONIVRER application...');

// Initialize self-optimizer silently
const selfOptimizer = SelfOptimizer.getInstance();

// Auto-initialize self-healing and self-optimizing system
(() => {
  try {
    // Start silent optimization
    selfOptimizer.optimizeOnDemand();
    
    // Set up automatic optimization interval
    setInterval(() => {
      selfOptimizer.optimizeOnDemand();
    }, 60000); // Run every minute
    
    console.log('[SYSTEM] Self-healing and self-optimizing system initialized silently');
  } catch (error) {
    // Silent error handling
    console.error('[SYSTEM] Error initializing self-healing system:', error);
  }
})();

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
        reportErrors: false // Never show error reports
      }}>
        {loading && <LoadingScreen onComplete={handleLoadingComplete} timeout={2000} />}
        <AllInOneApp />
        {/* No UI components for monitoring or statistics */}
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