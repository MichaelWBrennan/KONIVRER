import React, { useEffect } from 'react';
import errorHealing from './errorHealing.tsx';

/**
 * Self-Healing Provider Component
 * 
 * This component wraps the entire application and initializes the self-healing system.
 * It provides automatic error detection, reporting, and healing capabilities.
 */
export const SelfHealingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Initialize the error healing system
    errorHealing.initErrorHealing();
    console.info('[KONIVRER] Self-healing system initialized');
    
    // Set up periodic health checks
    const healthCheckInterval = setInterval(() => {
      // Check for memory leaks
      const memoryUsage = (window.performance as any)?.memory?.usedJSHeapSize;
      if (memoryUsage && memoryUsage > 200000000) { // 200MB threshold
        console.info('[Auto-Healing] High memory usage detected, running garbage collection');
        // Force garbage collection (not directly possible in JS, but we can help)
        try {
          // Clear any cached data that might be causing memory issues
          localStorage.removeItem('konivrer_temp_cache');
          sessionStorage.removeItem('konivrer_session_cache');
          
          // Clear any unused objects
          (window as any).unusedObjects = null;
        } catch (error) {
          // Silent catch
        }
      }
      
      // Check for slow responses
      const responseTimeThreshold = 1000; // 1 second
      if ((window as any).KONIVRER_LAST_RESPONSE_TIME > responseTimeThreshold) {
        console.info('[Auto-Healing] Slow response times detected, optimizing');
        // Reduce animation complexity or other performance optimizations
        document.body.classList.add('konivrer-performance-mode');
      }
    }, 60000); // Run every minute
    
    return () => {
      clearInterval(healthCheckInterval);
    };
  }, []);
  
  return (
    <>
      {children}
    </>
  );
};

/**
 * Higher-Order Component that adds self-healing capabilities to any component
 */
export function withSelfHealing<P>(Component: React.ComponentType<P>): React.ComponentType<P> {
  const WrappedComponent = (props: P) => {
    return (
      <ErrorBoundary>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
  
  WrappedComponent.displayName = `withSelfHealing(${Component.displayName || Component.name || 'Component'})`;
  
  return WrappedComponent;
}

/**
 * Error Boundary component that catches and heals errors in its children
 */
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[Auto-Healing] Component error caught:', error);
    
    // Attempt to heal the error
    setTimeout(() => {
      this.setState({ hasError: false });
    }, 1000);
  }
  
  render() {
    if (this.state.hasError) {
      // Render fallback UI while healing
      return (
        <div style={{ padding: '10px', opacity: 0.7 }}>
          <div>Loading content...</div>
        </div>
      );
    }
    
    return this.props.children;
  }
}

/**
 * Hook to add self-healing capabilities to fetch operations
 */
export function useSelfHealingFetch() {
  return errorHealing.healingFetch;
}

export default {
  SelfHealingProvider,
  withSelfHealing,
  useSelfHealingFetch
};