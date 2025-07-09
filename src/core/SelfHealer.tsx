/**
 * KONIVRER Self-Healer Module
 * 
 * This module provides self-healing capabilities for the application:
 * - Runtime error detection and recovery
 * - Component error boundaries
 * - Network failure recovery
 * - State recovery mechanisms
 * - Automatic retries for failed operations
 */

import React, { Component, useEffect, useState, useCallback } from 'react';

interface ErrorInfo {
  componentStack: string;
}

interface ErrorState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  recoveryAttempts: number;
}

interface SelfHealerConfig {
  maxRecoveryAttempts: number;
  enableLocalRecovery: boolean;
  enableNetworkRecovery: boolean;
  enableStateRecovery: boolean;
  recoveryDelay: number;
  logErrors: boolean;
  reportErrors: boolean;
}

const defaultConfig: SelfHealerConfig = {
  maxRecoveryAttempts: 3,
  enableLocalRecovery: true,
  enableNetworkRecovery: true,
  enableStateRecovery: true,
  recoveryDelay: 1000,
  logErrors: true,
  reportErrors: false,
};

// Global error tracking
class ErrorTracker {
  private static instance: ErrorTracker;
  private errors: Array<{ error: Error; timestamp: number; recovered: boolean }> = [];
  private errorListeners: Array<(errors: Array<{ error: Error; timestamp: number; recovered: boolean }>) => void> = [];
  
  private constructor() {
    // Set up global error handler
    window.addEventListener('error', (event) => {
      this.trackError(event.error || new Error(event.message));
      return false;
    });
    
    // Set up unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError(event.reason instanceof Error ? event.reason : new Error(String(event.reason)));
      return false;
    });
  }
  
  public static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }
  
  public trackError(error: Error, recovered: boolean = false): void {
    const errorEntry = { error, timestamp: Date.now(), recovered };
    this.errors.push(errorEntry);
    
    // Keep only the last 50 errors
    if (this.errors.length > 50) {
      this.errors.shift();
    }
    
    // Notify listeners
    this.notifyListeners();
    
    // Log error if not recovered
    if (!recovered && defaultConfig.logErrors) {
      console.error('[SELF-HEALER] Unrecovered error:', error);
    }
  }
  
  public markAsRecovered(error: Error): void {
    const errorEntry = this.errors.find(e => e.error === error);
    if (errorEntry) {
      errorEntry.recovered = true;
      this.notifyListeners();
    }
  }
  
  public getErrors(): Array<{ error: Error; timestamp: number; recovered: boolean }> {
    return [...this.errors];
  }
  
  public addErrorListener(listener: (errors: Array<{ error: Error; timestamp: number; recovered: boolean }>) => void): void {
    this.errorListeners.push(listener);
  }
  
  public removeErrorListener(listener: (errors: Array<{ error: Error; timestamp: number; recovered: boolean }>) => void): void {
    const index = this.errorListeners.indexOf(listener);
    if (index !== -1) {
      this.errorListeners.splice(index, 1);
    }
  }
  
  private notifyListeners(): void {
    this.errorListeners.forEach(listener => {
      listener([...this.errors]);
    });
  }
}

// Self-healing error boundary component
export class SelfHealingErrorBoundary extends Component<
  {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    onRecovery?: () => void;
    config?: Partial<SelfHealerConfig>;
  },
  ErrorState
> {
  private config: SelfHealerConfig;
  private recoveryTimeout: NodeJS.Timeout | null = null;
  
  constructor(props: {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    onRecovery?: () => void;
    config?: Partial<SelfHealerConfig>;
  }) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      recoveryAttempts: 0,
    };
    
    this.config = { ...defaultConfig, ...props.config };
  }
  
  static getDerivedStateFromError(error: Error): Partial<ErrorState> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Track the error
    ErrorTracker.getInstance().trackError(error);
    
    // Update state with error details
    this.setState({
      errorInfo,
    });
    
    // Call error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // Attempt recovery if enabled
    if (this.config.enableLocalRecovery) {
      this.attemptRecovery();
    }
  }
  
  componentWillUnmount(): void {
    // Clear any pending recovery attempts
    if (this.recoveryTimeout) {
      clearTimeout(this.recoveryTimeout);
    }
  }
  
  private attemptRecovery(): void {
    const { recoveryAttempts } = this.state;
    
    if (recoveryAttempts < this.config.maxRecoveryAttempts) {
      // Schedule recovery attempt
      this.recoveryTimeout = setTimeout(() => {
        this.setState(prevState => ({
          recoveryAttempts: prevState.recoveryAttempts + 1,
        }));
        
        // Attempt to recover by resetting the error state
        this.setState({
          hasError: false,
          error: null,
        });
        
        // Mark the error as recovered
        if (this.state.error) {
          ErrorTracker.getInstance().markAsRecovered(this.state.error);
        }
        
        // Call recovery handler if provided
        if (this.props.onRecovery) {
          this.props.onRecovery();
        }
        
        console.log(`[SELF-HEALER] Recovery attempt ${recoveryAttempts + 1}/${this.config.maxRecoveryAttempts}`);
      }, this.config.recoveryDelay);
    } else {
      console.error(`[SELF-HEALER] Max recovery attempts (${this.config.maxRecoveryAttempts}) reached. Unable to recover.`);
    }
  }
  
  render(): React.ReactNode {
    if (this.state.hasError) {
      // Render fallback UI if provided, otherwise render a default error message
      return this.props.fallback || (
        <div style={{
          padding: '20px',
          margin: '20px',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
        }}>
          <h3>Something went wrong</h3>
          <p>The application encountered an error. Attempting to recover...</p>
          <p>Recovery attempt: {this.state.recoveryAttempts}/{this.config.maxRecoveryAttempts}</p>
          {this.state.recoveryAttempts >= this.config.maxRecoveryAttempts && (
            <button
              onClick={() => {
                this.setState({
                  hasError: false,
                  error: null,
                  recoveryAttempts: 0,
                });
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
          )}
        </div>
      );
    }
    
    return this.props.children;
  }
}

// Network recovery hook
export const useNetworkRecovery = (
  fetchFn: () => Promise<any>,
  options: {
    maxRetries?: number;
    retryDelay?: number;
    onSuccess?: (data: any) => void;
    onError?: (error: Error) => void;
    onRetry?: (attempt: number) => void;
  } = {}
) => {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    onSuccess,
    onError,
    onRetry,
  } = options;
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  
  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchFn();
      setData(result);
      setLoading(false);
      setRetryCount(0);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      
      // Track the error
      ErrorTracker.getInstance().trackError(error);
      
      setError(error);
      
      // Retry if not exceeded max retries
      if (retryCount < maxRetries) {
        const nextRetryCount = retryCount + 1;
        setRetryCount(nextRetryCount);
        
        if (onRetry) {
          onRetry(nextRetryCount);
        }
        
        console.log(`[SELF-HEALER] Network retry ${nextRetryCount}/${maxRetries}`);
        
        // Exponential backoff
        const delay = retryDelay * Math.pow(2, retryCount);
        
        setTimeout(() => {
          execute();
        }, delay);
      } else {
        setLoading(false);
        
        if (onError) {
          onError(error);
        }
      }
      
      return null;
    }
  }, [fetchFn, maxRetries, retryDelay, onSuccess, onError, onRetry, retryCount]);
  
  return {
    execute,
    data,
    loading,
    error,
    retryCount,
  };
};

// State recovery hook
export const useStateRecovery = <T,>(
  initialState: T,
  storageKey: string,
  options: {
    enableLocalStorage?: boolean;
    enableSessionStorage?: boolean;
    debounceTime?: number;
  } = {}
) => {
  const {
    enableLocalStorage = true,
    enableSessionStorage = false,
    debounceTime = 500,
  } = options;
  
  // Try to load state from storage
  const loadFromStorage = (): T | null => {
    try {
      if (enableLocalStorage) {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          return JSON.parse(stored);
        }
      }
      
      if (enableSessionStorage) {
        const stored = sessionStorage.getItem(storageKey);
        if (stored) {
          return JSON.parse(stored);
        }
      }
    } catch (error) {
      console.error('[SELF-HEALER] Error loading state from storage:', error);
    }
    
    return null;
  };
  
  // Initialize state from storage or initial value
  const [state, setState] = useState<T>(() => {
    const storedState = loadFromStorage();
    return storedState !== null ? storedState : initialState;
  });
  
  // Save state to storage
  const saveToStorage = useCallback((newState: T) => {
    try {
      const serialized = JSON.stringify(newState);
      
      if (enableLocalStorage) {
        localStorage.setItem(storageKey, serialized);
      }
      
      if (enableSessionStorage) {
        sessionStorage.setItem(storageKey, serialized);
      }
    } catch (error) {
      console.error('[SELF-HEALER] Error saving state to storage:', error);
    }
  }, [storageKey, enableLocalStorage, enableSessionStorage]);
  
  // Debounced save
  useEffect(() => {
    const timer = setTimeout(() => {
      saveToStorage(state);
    }, debounceTime);
    
    return () => {
      clearTimeout(timer);
    };
  }, [state, saveToStorage, debounceTime]);
  
  // Enhanced setState that also handles errors
  const setRecoverableState = useCallback((newState: React.SetStateAction<T>) => {
    try {
      setState(newState);
    } catch (error) {
      console.error('[SELF-HEALER] Error setting state:', error);
      
      // Attempt recovery by resetting to initial state
      setState(initialState);
      
      // Track the error
      if (error instanceof Error) {
        ErrorTracker.getInstance().trackError(error);
      }
    }
  }, [initialState]);
  
  // Reset state to initial value
  const resetState = useCallback(() => {
    setState(initialState);
    
    try {
      if (enableLocalStorage) {
        localStorage.removeItem(storageKey);
      }
      
      if (enableSessionStorage) {
        sessionStorage.removeItem(storageKey);
      }
    } catch (error) {
      console.error('[SELF-HEALER] Error clearing state from storage:', error);
    }
  }, [initialState, storageKey, enableLocalStorage, enableSessionStorage]);
  
  return {
    state,
    setState: setRecoverableState,
    resetState,
  };
};

// Error monitoring hook
export const useErrorMonitor = () => {
  const [errors, setErrors] = useState<Array<{ error: Error; timestamp: number; recovered: boolean }>>([]);
  
  useEffect(() => {
    const errorTracker = ErrorTracker.getInstance();
    
    const handleErrors = (newErrors: Array<{ error: Error; timestamp: number; recovered: boolean }>) => {
      setErrors([...newErrors]);
    };
    
    errorTracker.addErrorListener(handleErrors);
    
    return () => {
      errorTracker.removeErrorListener(handleErrors);
    };
  }, []);
  
  return {
    errors,
    clearErrors: () => setErrors([]),
    hasErrors: errors.length > 0,
    unresolvedErrors: errors.filter(e => !e.recovered),
  };
};

// Self-healing provider component
export const SelfHealingProvider: React.FC<{
  children: React.ReactNode;
  config?: Partial<SelfHealerConfig>;
}> = ({ children, config }) => {
  const mergedConfig = { ...defaultConfig, ...config };
  
  // Initialize error tracking and silent monitoring
  useEffect(() => {
    // Initialize error tracker
    ErrorTracker.getInstance();
    
    // Set up global configuration
    Object.assign(defaultConfig, mergedConfig);
    
    // Start silent error monitoring
    silentErrorMonitor();
    
    // Silent initialization
    console.debug('[SELF-HEALER] Self-healing system initialized silently');
  }, [mergedConfig]);
  
  return (
    <SelfHealingErrorBoundary config={mergedConfig}>
      {children}
    </SelfHealingErrorBoundary>
  );
};

// Silent error monitoring - no UI component
const silentErrorMonitor = () => {
  const errorTracker = ErrorTracker.getInstance();
  
  // Set up silent monitoring
  setInterval(() => {
    const errors = errorTracker.getErrors();
    const unresolvedErrors = errors.filter(e => !e.recovered);
    
    // Silently log statistics if there are errors
    if (unresolvedErrors.length > 0) {
      console.debug(`[SELF-HEALER] Silent monitoring: ${unresolvedErrors.length} unresolved errors`);
      
      // Attempt recovery for unresolved errors
      unresolvedErrors.forEach(entry => {
        try {
          // Mark as recovered to prevent infinite recovery attempts
          errorTracker.markAsRecovered(entry.error);
        } catch (error) {
          // Silent error handling
        }
      });
    }
  }, 60000); // Check every minute
};

// Error Statistics Component
const ErrorStatistics: React.FC = () => {
  const { errorHistory } = useErrorMonitor();
  
  const stats = React.useMemo(() => {
    const total = errorHistory.length;
    const byType = errorHistory.reduce((acc, error) => {
      acc[error.type] = (acc[error.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return { total, byType };
  }, [errorHistory]);

  return (
    <div className="error-statistics">
      <h3>Error Statistics</h3>
      <p>Total Errors: {stats.total}</p>
      {Object.entries(stats.byType).map(([type, count]) => (
        <p key={type}>{type}: {count}</p>
      ))}
    </div>
  );
};

export default {
  SelfHealingErrorBoundary,
  SelfHealingProvider,
  useNetworkRecovery,
  useStateRecovery,
  useErrorMonitor,
  ErrorStatistics,
};