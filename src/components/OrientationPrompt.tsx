import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OrientationPromptProps {
  onOrientationChange?: (isLandscape: boolean) => void;
}

export const OrientationPrompt: React.FC<OrientationPromptProps> = ({
  onOrientationChange,
}) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  // Check if device is mobile/tablet and currently in portrait
  const checkOrientation = () => {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;

    // Only show on mobile/touch devices with small screens
    const shouldShowOnDevice = isMobile || (isTouch && isSmallScreen);

    const currentlyLandscape = window.innerWidth > window.innerHeight;
    setIsLandscape(currentlyLandscape);

    // Show prompt if:
    // 1. Device should show prompt (mobile/touch + small screen)
    // 2. Currently in portrait mode
    // 3. Screen height is greater than width (portrait)
    const shouldShow =
      shouldShowOnDevice &&
      !currentlyLandscape &&
      window.innerHeight > window.innerWidth;
    setShowPrompt(shouldShow);

    if (onOrientationChange) {
      onOrientationChange(currentlyLandscape);
    }
  };

  useEffect(() => {
    checkOrientation();

    const handleResize = () => {
      // Small delay to ensure the browser has finished resizing
      setTimeout(checkOrientation, 100);
    };

    const handleOrientationChange = () => {
      // Longer delay for orientation change to ensure proper sizing
      setTimeout(checkOrientation, 500);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [onOrientationChange]);

  const promptVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: -30,
      transition: {
        duration: 0.3,
      },
    },
  };

  const phoneVariants = {
    rotate: {
      rotate: [0, 90, 90, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
        times: [0, 0.3, 0.7, 1],
      },
    },
  };

  const arrowVariants = {
    bounce: {
      y: [0, -10, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          className="orientation-prompt"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 2000,
            background: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            textAlign: 'center',
            padding: '20px',
            backdropFilter: 'blur(10px)',
          }}
          variants={promptVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Rotating phone icon */}
          <motion.div
            style={{
              fontSize: '4rem',
              marginBottom: '30px',
              color: '#d4af37',
              filter: 'drop-shadow(0 4px 8px rgba(212, 175, 55, 0.4))',
            }}
            variants={phoneVariants}
            animate="rotate"
          >
            📱
          </motion.div>

          {/* Rotating arrow */}
          <motion.div
            style={{
              fontSize: '2rem',
              marginBottom: '20px',
              color: '#d4af37',
            }}
            variants={arrowVariants}
            animate="bounce"
          >
            ↻
          </motion.div>

          {/* Title */}
          <motion.h2
            style={{
              fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
              fontWeight: 'bold',
              color: '#d4af37',
              marginBottom: '16px',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Rotate Your Device
          </motion.h2>

          {/* Description */}
          <motion.p
            style={{
              fontSize: 'clamp(1rem, 4vw, 1.2rem)',
              lineHeight: '1.6',
              maxWidth: '400px',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '24px',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            For the best gaming experience, please rotate your device to
            landscape mode.
          </motion.p>

          {/* Features list */}
          <motion.div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              maxWidth: '350px',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.2rem' }}>🎮</span>
              <span
                style={{
                  fontSize: '0.9rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                Better touch controls
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.2rem' }}>👀</span>
              <span
                style={{
                  fontSize: '0.9rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                Larger game area
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.2rem' }}>✨</span>
              <span
                style={{
                  fontSize: '0.9rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                Enhanced visuals
              </span>
            </div>
          </motion.div>

          {/* Skip button for users who want to continue in portrait */}
          <motion.button
            style={{
              marginTop: '32px',
              padding: '8px 16px',
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '20px',
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            whileHover={{
              borderColor: 'rgba(212, 175, 55, 0.5)',
              color: 'rgba(212, 175, 55, 0.8)',
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPrompt(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Continue anyway
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OrientationPrompt;
