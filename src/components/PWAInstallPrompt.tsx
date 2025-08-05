import React from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import './PWAInstallPrompt.css';

const PWAInstallPrompt: React.FC = () => {
  const { showPrompt, install, dismissPrompt, isStandalone } = usePWAInstall();

  // Don't show if already running in standalone mode
  if (isStandalone || !showPrompt) {
    return null;
  }

  return (
    <div className="pwa-install-prompt">
      <div className="pwa-prompt-content">
        <button 
          className="pwa-dismiss-button"
          onClick={dismissPrompt}
          aria-label="Close install prompt"
        >
          ✕
        </button>
        
        <div className="pwa-prompt-icon">
          📱
        </div>
        
        <h3 className="pwa-prompt-title">Install KONIVRER</h3>
        <p className="pwa-prompt-description">
          Add to your home screen for the best mobile experience! 
          Access your decks offline and get instant notifications.
        </p>
        
        <div className="pwa-prompt-features">
          <div className="pwa-feature">
            <span className="feature-icon">⚡</span>
            <span>Faster loading</span>
          </div>
          <div className="pwa-feature">
            <span className="feature-icon">📱</span>
            <span>Works offline</span>
          </div>
          <div className="pwa-feature">
            <span className="feature-icon">🔔</span>
            <span>Push notifications</span>
          </div>
        </div>
        
        <div className="pwa-prompt-buttons">
          <button 
            className="pwa-button secondary"
            onClick={dismissPrompt}
          >
            Not now
          </button>
          <button 
            className="pwa-button primary"
            onClick={install}
          >
            Install App
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;