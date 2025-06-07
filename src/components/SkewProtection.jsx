/**
 * Skew Protection Component
 * Displays update notifications and handles version skew
 */

import { useEffect, useState } from 'react';

import { useSkewProtection } from '../hooks/useSkewProtection.js';

const SkewProtection = () => {
  const {
    isUpdateAvailable,
    currentVersion,
    checkForUpdates,
    forceRefresh,
    dismissUpdate,
  } = useSkewProtection();

  const [showNotification, setShowNotification] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (isUpdateAvailable) {
      setShowNotification(true);
    }
  }, [isUpdateAvailable]);

  const handleRefresh = () => {
    forceRefresh();
  };

  const handleCheckUpdates = async () => {
    setIsChecking(true);
    try {
      await checkForUpdates();
    } finally {
      setIsChecking(false);
    }
  };

  const handleDismiss = () => {
    setShowNotification(false);
    dismissUpdate();
  };

  if (!showNotification) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '16px 20px',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        zIndex: 10000,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: '14px',
        maxWidth: '320px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        animation: 'slideIn 0.3s ease-out',
      }}
    >
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          .skew-button {
            background: rgba(255,255,255,0.2);
            border: 1px solid rgba(255,255,255,0.3);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            transition: all 0.2s ease;
            margin-right: 8px;
            margin-top: 8px;
            display: inline-block;
          }
          
          .skew-button:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-1px);
          }
          
          .skew-button:active {
            transform: translateY(0);
          }
          
          .skew-button.primary {
            background: rgba(255,255,255,0.9);
            color: #333;
          }
          
          .skew-button.primary:hover {
            background: white;
          }
        `}
      </style>

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontWeight: '600',
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '16px' }}>🚀</span>
            New version available
          </div>
          <div
            style={{
              fontSize: '12px',
              opacity: '0.9',
              lineHeight: '1.4',
              marginBottom: '8px',
            }}
          >
            A new version of the app is ready. Refresh to get the latest
            features and improvements.
          </div>
          <div style={{ fontSize: '11px', opacity: '0.7' }}>
            Version: {currentVersion?.slice(0, 8) || 'Unknown'}
          </div>
        </div>

        <button
          onClick={handleDismiss}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '18px',
            padding: '0',
            marginLeft: '12px',
            opacity: '0.7',
            lineHeight: '1',
          }}
          title="Dismiss"
        >
          ×
        </button>
      </div>

      <div style={{ marginTop: '12px' }}>
        <button
          className="skew-button primary"
          onClick={handleRefresh}
          disabled={isChecking}
        >
          {isChecking ? 'Refreshing...' : 'Refresh Now'}
        </button>

        <button
          className="skew-button"
          onClick={handleCheckUpdates}
          disabled={isChecking}
        >
          {isChecking ? 'Checking...' : 'Check Again'}
        </button>
      </div>
    </div>
  );
};

export default SkewProtection;
