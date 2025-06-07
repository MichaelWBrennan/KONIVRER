/**
 * React Hook for Skew Protection
 * Provides React integration for version skew detection
 */

import { useState, useEffect } from 'react';

import {
  skewProtection,
  checkForUpdates,
  forceRefresh,
} from '../utils/skewProtection.js';

export function useSkewProtection() {
  const [status, setStatus] = useState(skewProtection.getStatus());
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  useEffect(() => {
    const updateStatus = () => {
      const newStatus = skewProtection.getStatus();
      setStatus(newStatus);

      // Check if version has changed
      if (
        newStatus.lastKnownVersion &&
        newStatus.currentVersion !== newStatus.lastKnownVersion
      ) {
        setIsUpdateAvailable(true);
      }
    };

    // Update status periodically
    const interval = setInterval(updateStatus, 30000); // 30 seconds

    // Initial check
    updateStatus();

    return () => clearInterval(interval);
  }, []);

  const handleCheckForUpdates = async () => {
    try {
      await checkForUpdates();
      setStatus(skewProtection.getStatus());
    } catch (error) {
      console.error('Failed to check for updates:', error);
    }
  };

  const handleForceRefresh = () => {
    forceRefresh();
  };

  const dismissUpdate = () => {
    setIsUpdateAvailable(false);
  };

  return {
    ...status,
    isUpdateAvailable,
    checkForUpdates: handleCheckForUpdates,
    forceRefresh: handleForceRefresh,
    dismissUpdate,
  };
}

export default useSkewProtection;
