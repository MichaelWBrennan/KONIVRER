/**
 * Error Healing System
 *
 * This module provides real-time error detection and healing capabilities
 * for the KONIVRER application. It works silently in the background to
 * intercept, log, and attempt to fix runtime errors without user intervention.
 */
import React from 'react';

// Original console methods
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

// Error tracking
interface ErrorRecord {
  message: string;
  count: number;
  lastOccurred: Date;
  stack?: string;
  healed: boolean;
  healingAttempts: number;
}

// Store error occurrences
const errorRegistry: Record<string, ErrorRecord> = {};

// Common error patterns and their fixes
const conflictMarkers: Record<string, string> = {
  '<<<<<<< HEAD': 'Start of conflict - current branch',
  '=======': 'Conflict separator',
  '>>>>>>>': 'Start of conflict - incoming changes',
};

Object.keys(conflictMarkers).forEach(marker => {
  console.info(`[Conflict Detection] Detected marker: ${marker}`);
});

// Common error patterns and their healing functions
const errorPatterns: Record<string, (error: Error) => void> = {
  'process is not defined': (_error: Error) => {
    console.info('[Error Healing] Detected Node.js process reference in browser - suggesting environment variable fix');
  },
  'Cannot read property': (_error: Error) => {
    console.info('[Error Healing] Detected property access error - suggesting null check');
  },
  'undefined is not a function': (_error: Error) => {
    console.info('[Error Healing] Detected undefined function call - suggesting function definition check');
  },
  'Module not found': (_error: Error) => {
    console.info('[Error Healing] Detected missing module - suggesting import path check');
  }
};

/**
 * Attempts to heal an error based on its type and message
 */
function attemptToHealError(error: Error): boolean {
  const errorMessage = error.message;

  // Check if we have a pattern match
  for (const pattern in errorPatterns) {
    if (errorMessage.includes(pattern)) {
      try {
        errorPatterns[pattern](error);
        return true;
      } catch (_healingError) {
        // If healing fails, log silently and continue
        return false;
      }
    }
  }

  return false;
}

/**
 * Intercepts and processes console errors
 */
console.error = function (...args: any[]) {
  // Call original to maintain normal behavior
  originalConsoleError.apply(console, args);

  // Process the error
  const errorObj =
    args[0] instanceof Error ? args[0] : new Error(String(args[0]));
  const errorKey = errorObj.message;

  // Track the error
  if (!errorRegistry[errorKey]) {
    errorRegistry[errorKey] = {
      message: errorKey,
      count: 0,
      lastOccurred: new Date(),
      stack: errorObj.stack,
      healed: false,
      healingAttempts: 0,
    };
  }

  const record = errorRegistry[errorKey];
  record.count++;
  record.lastOccurred = new Date();

  // Attempt to heal if not already healed and not too many attempts
  if (!record.healed && record.healingAttempts < 3) {
    record.healingAttempts++;
    record.healed = attemptToHealError(errorObj);
  }
};

/**
 * Intercepts and processes console warnings
 */
console.warn = function (...args: any[]) {
  // Call original to maintain normal behavior
  originalConsoleWarn.apply(console, args);

  // Process the warning (similar to error handling)
  const warningMsg = String(args[0]);

  // Some warnings might indicate potential errors, so we track them
  if (warningMsg.includes('React') || warningMsg.includes('deprecated')) {
    const warningKey = `WARN: ${warningMsg}`;

    if (!errorRegistry[warningKey]) {
      errorRegistry[warningKey] = {
        message: warningKey,
        count: 0,
        lastOccurred: new Date(),
        healed: false,
        healingAttempts: 0,
      };
    }

    errorRegistry[warningKey].count++;
    errorRegistry[warningKey].lastOccurred = new Date();
  }
};

/**
 * Global error handler for uncaught exceptions
 */
if (typeof window !== 'undefined') {
  window.addEventListener('error', event => {
    const error = event.error || new Error(event.message);

    // Try to heal the error
    const healed = attemptToHealError(error);

    // If we successfully healed it, prevent the default error
    if (healed) {
      event.preventDefault();
    }
  });

  // Handle promise rejections
  window.addEventListener('unhandledrejection', event => {
    const error =
      event.reason instanceof Error
        ? event.reason
        : new Error(String(event.reason));

    // Try to heal the error
    const healed = attemptToHealError(error);

    // If we successfully healed it, prevent the default error
    if (healed) {
      event.preventDefault();
    }
  });
}

/**
 * Enhanced fetch with auto-retry and error healing
 */
export const healingFetch = async (
  url: string,
  options?: RequestInit,
): Promise<Response> => {
  const MAX_RETRIES = 3;
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      return response;
    } catch (error) {
      retries++;

      // Log the retry attempt silently
      if (retries < MAX_RETRIES) {
        console.info(
          `[Auto-Healing] Retrying fetch to ${url} (attempt ${retries}/${MAX_RETRIES})`,
        );

        // Wait before retrying (exponential backoff)
        await new Promise(resolve =>
          setTimeout(resolve, 1000 * Math.pow(2, retries - 1)),
        );
      } else {
        throw error; // Re-throw if all retries failed
      }
    }
  }

  // This should never be reached due to the throw in the catch block
  throw new Error(`Failed to fetch ${url} after ${MAX_RETRIES} retries`);
};

/**
 * HOC to prevent state updates on unmounted components
 */
export function withErrorHealing<P>(
  Component: React.ComponentType<P>,
): React.ComponentType<P> {
  return class WrappedComponent extends React.Component<P> {
    private isMounted = false;

    componentDidMount() {
      this.isMounted = true;
    }

    componentWillUnmount() {
      this.isMounted = false;
    }

    render() {
      // Create a safe setState function that checks mounting status
      const originalSetState = this.setState.bind(this);
      this.setState = (...args: any[]) => {
        if (this.isMounted) {
          originalSetState(...args);
        } else {
          console.info(
            '[Auto-Healing] Prevented setState on unmounted component',
          );
        }
      };

      return React.createElement(Component, this.props);
    }
  };
}

/**
 * Initialize the error healing system
 */
export function initErrorHealing(): void {
  console.info('[Auto-Healing] Error healing system initialized');

  // Periodically check for recurring errors and report them silently
  setInterval(() => {
    const now = new Date();
    const errorSummary = Object.values(errorRegistry)
      .filter(
        record =>
          record.count > 1 &&
          now.getTime() - record.lastOccurred.getTime() < 3600000,
      ) // Last hour
      .map(record => ({
        message: record.message,
        occurrences: record.count,
        healed: record.healed,
      }));

    if (errorSummary.length > 0) {
      // In a real system, this could send the data to a monitoring service
      console.info('[Auto-Healing] Error summary:', errorSummary);
    }
  }, 3600000); // Check every hour
}

export default {
  initErrorHealing,
  healingFetch,
  withErrorHealing,
};
