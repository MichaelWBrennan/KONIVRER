import React, { useState, useEffect } from 'react';
import * as s from './mobileOptimizations.css';

interface MobileOptimizationsProps {
  children: React.ReactNode;
}

export const MobileOptimizations: React.FC<MobileOptimizationsProps> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [connectionType, setConnectionType] = useState<string>('unknown');

  useEffect(() => {
    // PWA Installation
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Battery API
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
      });
    }

    // Connection API
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      setConnectionType(connection.effectiveType || 'unknown');
    }

    // Online/Offline detection
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  const getConnectionIcon = () => {
    switch (connectionType) {
      case 'slow-2g':
      case '2g':
        return '🐌';
      case '3g':
        return '📱';
      case '4g':
        return '📶';
      default:
        return '📡';
    }
  };

  const getBatteryIcon = () => {
    if (batteryLevel === null) return '🔋';
    if (batteryLevel > 75) return '🔋';
    if (batteryLevel > 50) return '🔋';
    if (batteryLevel > 25) return '🔋';
    return '🔋';
  };

  return (
    <div className={s.mobileContainer}>
      {/* Mobile Status Bar */}
      <div className={s.mobileStatusBar}>
        <div className={s.statusLeft}>
          <span className={s.connectionStatus}>
            {getConnectionIcon()} {connectionType}
          </span>
          {batteryLevel !== null && (
            <span className={s.batteryStatus}>
              {getBatteryIcon()} {batteryLevel}%
            </span>
          )}
        </div>
        <div className={s.statusRight}>
          <span className={`${s.onlineStatus} ${isOnline ? s.online : s.offline}`}>
            {isOnline ? '🟢 Online' : '🔴 Offline'}
          </span>
        </div>
      </div>

      {/* PWA Install Banner */}
      {deferredPrompt && !isInstalled && (
        <div className={s.installBanner}>
          <div className={s.installContent}>
            <div className={s.installIcon}>📱</div>
            <div className={s.installText}>
              <h3>Install KONIVRER</h3>
              <p>Get the full app experience with offline support</p>
            </div>
            <button onClick={handleInstallClick} className={s.installButton}>
              Install
            </button>
            <button 
              onClick={() => setDeferredPrompt(null)} 
              className={s.installClose}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Offline Mode Banner */}
      {!isOnline && (
        <div className={s.offlineBanner}>
          <div className={s.offlineContent}>
            <span className={s.offlineIcon}>📡</span>
            <span className={s.offlineText}>
              You're offline. Some features may be limited.
            </span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={s.mainContent}>
        {children}
      </div>

      {/* Mobile Navigation Gestures */}
      <div className={s.gestureIndicators}>
        <div className={s.swipeIndicator}>
          <span>← Swipe for menu</span>
        </div>
      </div>
    </div>
  );
};