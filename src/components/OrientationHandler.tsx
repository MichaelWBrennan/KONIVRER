import React, { useState, useEffect } from 'react';
import './OrientationHandler.css';

interface OrientationHandlerProps {
  children: React.ReactNode;
  preferredOrientation?: 'portrait' | 'landscape' | 'any';
  showPrompt?: boolean;
}

const OrientationHandler: React.FC<OrientationHandlerProps> = ({
  children,
  preferredOrientation = 'any',
  showPrompt = true
}) => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [showOrientationPrompt, setShowOrientationPrompt] = useState(false);

  useEffect(() => {
    const handleOrientationChange = () => {
      const isPortrait = window.innerHeight > window.innerWidth;
      const newOrientation = isPortrait ? 'portrait' : 'landscape';
      setOrientation(newOrientation);

      // Show prompt if orientation doesn't match preference
      if (preferredOrientation !== 'any' && preferredOrientation !== newOrientation && showPrompt) {
        setShowOrientationPrompt(true);
        // Auto-hide after 5 seconds
        setTimeout(() => setShowOrientationPrompt(false), 5000);
      } else {
        setShowOrientationPrompt(false);
      }
    };

    // Initial check
    handleOrientationChange();

    // Listen for orientation changes
    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [preferredOrientation, showPrompt]);

  const dismissPrompt = () => {
    setShowOrientationPrompt(false);
  };

  return (
    <div className={`orientation-container ${orientation}`}>
      {children}
      
      {showOrientationPrompt && (
        <div className="orientation-prompt-overlay">
          <div className="orientation-prompt">
            <div className="orientation-icon">
              {preferredOrientation === 'portrait' ? '📱' : '📟'}
            </div>
            <h3>Rotate Device</h3>
            <p>
              For the best experience, please rotate your device to{' '}
              <strong>{preferredOrientation}</strong> mode.
            </p>
            <div className="orientation-animation">
              <div className={`phone-icon ${preferredOrientation}`}></div>
            </div>
            <button 
              className="orientation-dismiss"
              onClick={dismissPrompt}
              aria-label="Dismiss orientation prompt"
            >
              Continue anyway
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrientationHandler;