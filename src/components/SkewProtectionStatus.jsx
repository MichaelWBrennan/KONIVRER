/**
 * Skew Protection Status Component
 * Displays current skew protection status and handles version updates
 */

import { useState, useEffect } from 'react';

import {
  getSkewStatus,
  checkForUpdates,
  forceRefresh,
} from '../utils/skewProtection.js';

const SkewProtectionStatus = ({ showDetails = false }) => {
  const [status, setStatus] = useState(null);
  const [skewDetected, setSkewDetected] = useState(false);
  const [lastCheck, setLastCheck] = useState(null);

  useEffect(() => {
    // Get initial status
    setStatus(getSkewStatus());
    setLastCheck(new Date());

    // Listen for skew detection events
    const handleSkewDetected = event => {
      setSkewDetected(true);
      console.warn('Skew detected:', event.detail);
    };

    const handleSkewResolved = () => {
      setSkewDetected(false);
    };

    window.addEventListener('vercelSkewDetected', handleSkewDetected);
    window.addEventListener('vercelSkewResolved', handleSkewResolved);

    // Update status periodically
    const interval = setInterval(() => {
      setStatus(getSkewStatus());
      setLastCheck(new Date());
    }, 30000); // 30 seconds

    return () => {
      clearInterval(interval);
      window.removeEventListener('vercelSkewDetected', handleSkewDetected);
      window.removeEventListener('vercelSkewResolved', handleSkewResolved);
    };
  }, []);

  const handleCheckForUpdates = async () => {
    try {
      await checkForUpdates();
      setLastCheck(new Date());
    } catch (error) {
      console.error('Failed to check for updates:', error);
    }
  };

  const handleForceRefresh = () => {
    forceRefresh();
  };

  if (!status) {
    return null;
  }

  // Don't show in development unless showDetails is true
  if (!import.meta.env.PROD && !showDetails) {
    return null;
  }

  return (
    <div className="skew-protection-status">
      {skewDetected && (
        <div className="skew-alert">
          <div className="skew-alert-content">
            <span className="skew-alert-icon">⚠️</span>
            <div className="skew-alert-text">
              <strong>New version available</strong>
              <p>A new version of the application is available.</p>
            </div>
            <button
              onClick={handleForceRefresh}
              className="skew-refresh-button"
            >
              Refresh Now
            </button>
          </div>
        </div>
      )}

      {showDetails && (
        <div className="skew-details">
          <h4>Skew Protection Status</h4>
          <div className="skew-info">
            <div className="skew-info-item">
              <label>Current Version:</label>
              <span>{status.currentVersion}</span>
            </div>
            <div className="skew-info-item">
              <label>Last Known Version:</label>
              <span>{status.lastKnownVersion || 'Unknown'}</span>
            </div>
            <div className="skew-info-item">
              <label>Monitoring:</label>
              <span
                className={
                  status.isMonitoring ? 'status-active' : 'status-inactive'
                }
              >
                {status.isMonitoring ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="skew-info-item">
              <label>Retry Count:</label>
              <span>{status.retryCount}</span>
            </div>
            <div className="skew-info-item">
              <label>Last Check:</label>
              <span>
                {lastCheck ? lastCheck.toLocaleTimeString() : 'Never'}
              </span>
            </div>
          </div>
          <div className="skew-actions">
            <button
              onClick={handleCheckForUpdates}
              className="check-updates-button"
            >
              Check for Updates
            </button>
            <button
              onClick={handleForceRefresh}
              className="force-refresh-button"
            >
              Force Refresh
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .skew-protection-status {
          position: relative;
        }

        .skew-alert {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #fff;
          border: 1px solid #e1e5e9;
          border-left: 4px solid #ff6b35;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 16px;
          max-width: 400px;
          z-index: 10000;
          font-family:
            -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .skew-alert-content {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .skew-alert-icon {
          font-size: 20px;
          flex-shrink: 0;
        }

        .skew-alert-text {
          flex: 1;
        }

        .skew-alert-text strong {
          display: block;
          margin-bottom: 4px;
          color: #1a1a1a;
          font-size: 14px;
        }

        .skew-alert-text p {
          margin: 0;
          color: #666;
          font-size: 13px;
        }

        .skew-refresh-button {
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 8px 12px;
          font-size: 12px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .skew-refresh-button:hover {
          background: #0051cc;
        }

        .skew-details {
          background: #f8f9fa;
          border: 1px solid #e1e5e9;
          border-radius: 8px;
          padding: 16px;
          margin: 16px 0;
          font-family:
            -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .skew-details h4 {
          margin: 0 0 12px 0;
          color: #1a1a1a;
          font-size: 16px;
        }

        .skew-info {
          display: grid;
          gap: 8px;
          margin-bottom: 16px;
        }

        .skew-info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 0;
        }

        .skew-info-item label {
          font-weight: 500;
          color: #666;
          font-size: 13px;
        }

        .skew-info-item span {
          font-size: 13px;
          color: #1a1a1a;
        }

        .status-active {
          color: #28a745 !important;
        }

        .status-inactive {
          color: #dc3545 !important;
        }

        .skew-actions {
          display: flex;
          gap: 8px;
        }

        .check-updates-button,
        .force-refresh-button {
          padding: 6px 12px;
          border: 1px solid #e1e5e9;
          border-radius: 4px;
          background: #fff;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
        }

        .check-updates-button:hover,
        .force-refresh-button:hover {
          background: #f5f5f5;
        }

        .force-refresh-button {
          background: #dc3545;
          color: white;
          border-color: #dc3545;
        }

        .force-refresh-button:hover {
          background: #c82333;
        }

        @media (max-width: 480px) {
          .skew-alert {
            top: 10px;
            right: 10px;
            left: 10px;
            max-width: none;
          }

          .skew-details {
            margin: 8px 0;
            padding: 12px;
          }

          .skew-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default SkewProtectionStatus;
