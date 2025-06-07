/**
 * Client-side Skew Protection
 * Handles version mismatches and deployment skew scenarios
 * Works with Vercel's server-side skew protection
 */

// import { env } from '../config/env.js';
import { securityLogger } from '../config/security.js';

class SkewProtection {
  constructor() {
    this.currentVersion = this.getCurrentVersion();
    this.lastKnownVersion = this.getStoredVersion();
    this.lastDeploymentId = localStorage.getItem('vercel-deployment-id');
    this.retryCount = 0;
    this.maxRetries = 3;
    this.retryDelay = 1000; // 1 second
    this.versionCheckInterval = 5 * 60 * 1000; // 5 minutes
    this.skewDetected = false;

    this.init();
  }

  init() {
    if (typeof window === 'undefined') return;

    try {
      // Store current version
      this.storeVersion(this.currentVersion);

      // Set up periodic version checking (delayed to not block startup)
      setTimeout(() => {
        this.startVersionMonitoring();
      }, 5000); // Wait 5 seconds after app loads

      // Handle fetch errors that might indicate skew (delayed)
      setTimeout(() => {
        this.setupFetchInterceptor();
      }, 2000); // Wait 2 seconds after app loads

      // Listen for visibility changes to check version when user returns
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
          // Delay the check to avoid blocking UI
          setTimeout(() => {
            this.checkVersionSkew();
          }, 1000);
        }
      });
    } catch (error) {
      console.warn('Skew protection initialization failed:', error);
      // Don't block app startup if skew protection fails
    }
  }

  getCurrentVersion() {
    // Try to get version from meta tag first
    const metaVersion = document.querySelector('meta[name="app-version"]');
    if (metaVersion) {
      return metaVersion.getAttribute('content');
    }

    // Fallback to build timestamp or environment
    return (
      import.meta.env.VITE_APP_VERSION ||
      import.meta.env.VITE_BUILD_TIME ||
      Date.now().toString()
    );
  }

  getStoredVersion() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('app-version');
  }

  storeVersion(version) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('app-version', version);
  }

  startVersionMonitoring() {
    if (typeof window === 'undefined') return;

    setInterval(() => {
      this.checkVersionSkew();
    }, this.versionCheckInterval);
  }

  async checkVersionSkew() {
    try {
      // Check multiple endpoints for version information
      const endpoints = [
        '/api/version',
        '/api/health',
        '/_vercel/insights/vitals',
      ];

      let anyEndpointWorked = false;

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            method: 'HEAD',
            cache: 'no-cache',
            headers: {
              'X-Vercel-Skew-Protection': 'check',
            },
            // Add timeout to prevent hanging
            signal: AbortSignal.timeout(5000), // 5 second timeout
          });

          anyEndpointWorked = true;

          // Check Vercel-specific headers
          const serverVersion =
            response.headers.get('x-app-version') ||
            response.headers.get('x-vercel-deployment-id');
          const skewDetected = response.headers.get('x-vercel-skew-protection');

          if (
            skewDetected === 'detected' ||
            (serverVersion && serverVersion !== this.currentVersion)
          ) {
            this.handleVersionMismatch(serverVersion);
            break;
          }
        } catch (endpointError) {
          console.debug(
            `Version check failed for ${endpoint}:`,
            endpointError.message,
          );
          continue;
        }
      }

      // If no endpoints worked, don't treat it as an error
      if (!anyEndpointWorked) {
        console.debug(
          'No version check endpoints available, skipping skew detection',
        );
      }
    } catch (error) {
      console.debug('Skew check error:', error.message);
      // Don't log to security logger if it might not exist
      try {
        securityLogger.log('SKEW_CHECK_ERROR', {
          error: error.message,
          currentVersion: this.currentVersion,
        });
      } catch (logError) {
        // Silently fail if security logger is not available
      }
    }
  }

  handleVersionMismatch(newVersion) {
    console.warn('Version skew detected:', {
      current: this.currentVersion,
      server: newVersion,
    });

    // Log skew detection for monitoring
    securityLogger.log('VERCEL_SKEW_DETECTED', {
      clientVersion: this.currentVersion,
      serverVersion: newVersion,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      url: window.location.href,
    });

    // Show user notification about new version
    this.showUpdateNotification();

    // Update stored version
    this.storeVersion(newVersion);

    // Emit custom event for app-level handling
    window.dispatchEvent(
      new CustomEvent('vercelSkewDetected', {
        detail: {
          clientVersion: this.currentVersion,
          serverVersion: newVersion,
        },
      }),
    );
  }

  showUpdateNotification() {
    // Create a non-intrusive notification
    const notification = document.createElement('div');
    notification.id = 'version-update-notification';
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #0070f3;
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        max-width: 300px;
        cursor: pointer;
        transition: opacity 0.3s ease;
      ">
        <div style="font-weight: 600; margin-bottom: 4px;">
          🚀 New version available
        </div>
        <div style="font-size: 12px; opacity: 0.9;">
          Click to refresh and get the latest features
        </div>
      </div>
    `;

    // Remove existing notification if present
    const existing = document.getElementById('version-update-notification');
    if (existing) {
      existing.remove();
    }

    document.body.appendChild(notification);

    // Auto-hide after 10 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.opacity = '0';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.remove();
          }
        }, 300);
      }
    }, 10000);

    // Click to refresh
    notification.addEventListener('click', () => {
      window.location.reload();
    });
  }

  setupFetchInterceptor() {
    if (typeof window === 'undefined') return;

    // Store original fetch
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);

        // Check for Vercel skew protection headers
        const skewProtection = response.headers.get('x-vercel-skew-protection');
        const deploymentId = response.headers.get('x-vercel-deployment-id');

        if (skewProtection === 'detected') {
          this.handleSkewError(response);
        }

        // Check for skew-related status codes
        if (
          response.status === 409 ||
          response.status === 412 ||
          response.status === 426
        ) {
          this.handleSkewError(response);
        }

        // Store deployment ID for tracking
        if (deploymentId && deploymentId !== this.lastDeploymentId) {
          this.lastDeploymentId = deploymentId;
          localStorage.setItem('vercel-deployment-id', deploymentId);
        }

        // Reset retry count on successful request
        this.retryCount = 0;

        return response;
      } catch (error) {
        return this.handleFetchError(error, args);
      }
    };
  }

  async handleFetchError(error, originalArgs) {
    // Check if this might be a skew-related error
    if (this.isSkewError(error) && this.retryCount < this.maxRetries) {
      this.retryCount++;

      console.warn(
        `Potential skew error, retrying (${this.retryCount}/${this.maxRetries}):`,
        error.message,
      );

      // Wait before retrying
      await new Promise(resolve =>
        setTimeout(resolve, this.retryDelay * this.retryCount),
      );

      // Check for version updates before retrying
      await this.checkVersionSkew();

      // Retry the original request
      return window.fetch(...originalArgs);
    }

    // If not a skew error or max retries reached, throw original error
    throw error;
  }

  handleSkewError(response) {
    console.warn('Server returned skew-related status:', response.status);

    // Check if server provides version information
    const serverVersion = response.headers.get('x-app-version');
    if (serverVersion) {
      this.handleVersionMismatch(serverVersion);
    }
  }

  isSkewError(error) {
    // Heuristics to detect potential skew-related errors
    const skewIndicators = [
      'chunk load failed',
      'loading chunk',
      'unexpected token',
      'syntax error',
      'module not found',
      'network error',
      'vercel deployment',
      'skew protection',
      'version mismatch',
      'deployment conflict',
      'cache miss',
      'stale deployment',
    ];

    const errorMessage = error.message.toLowerCase();
    return skewIndicators.some(indicator => errorMessage.includes(indicator));
  }

  // Manual refresh method for components to use
  async forceRefresh() {
    try {
      // Clear caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName)),
        );
      }

      // Clear localStorage version info
      localStorage.removeItem('app-version');

      // Hard refresh
      window.location.reload(true);
    } catch (error) {
      console.error('Force refresh failed:', error);
      // Fallback to simple reload
      window.location.reload();
    }
  }

  // Get skew protection status
  getStatus() {
    return {
      currentVersion: this.currentVersion,
      lastKnownVersion: this.lastKnownVersion,
      retryCount: this.retryCount,
      isMonitoring: !!this.versionCheckInterval,
    };
  }
}

// Create singleton instance
export const skewProtection = new SkewProtection();

// Export utilities for manual use
export const checkForUpdates = () => skewProtection.checkVersionSkew();
export const forceRefresh = () => skewProtection.forceRefresh();
export const getSkewStatus = () => skewProtection.getStatus();

// React hook for components - this will be properly imported in React components
export function useSkewProtection() {
  // This is a placeholder - actual React hooks should be used in React components
  // Components should import { useState, useEffect } from 'react' and use them directly

  // Fallback for non-React environments or when React hooks aren't available
  return {
    ...skewProtection.getStatus(),
    checkForUpdates,
    forceRefresh,
  };
}

export default skewProtection;
