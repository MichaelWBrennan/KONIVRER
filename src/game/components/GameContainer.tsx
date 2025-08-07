import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EnhancedGameMenu } from './EnhancedGameMenu';
import CardGameUI from './CardGameUI';
import Card3DGameUI from './Card3DGameUI';
import OrientationPrompt from '../../components/OrientationPrompt';
import { useDynamicSizing } from '../../utils/userAgentSizing';
import '../styles/mobile.css';

interface GameContainerProps {
  onClose?: () => void;
  setShowGame?: (show: boolean) => void;
}

interface GameMode {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: string;
  requiresAccount: boolean;
}

export const GameContainer: React.FC<GameContainerProps> = ({
  onClose,
  setShowGame,
}) => {
  const [gameState, setGameState] = useState<
    'menu' | 'loading' | 'playing' | 'playing3d' | 'error'
  >('menu');
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [use3D, setUse3D] = useState<boolean>(true); // Default to 3D cards

  // Get dynamic sizing based on user agent
  const dynamicSizing = useDynamicSizing();

  // 3D-focused game modes (arena options removed as redundant)
  const gameModes: GameMode[] = [
    {
      id: 'practice3d',
      title: '3D Practice',
      description:
        'Experience immersive 3D cards with physics! Master your skills against adaptive AI opponents with realistic card interactions',
      icon: '🎯',
      difficulty: 'Beginner Friendly',
      requiresAccount: false,
    },
    {
      id: 'quick3d',
      title: '3D Quick Duel',
      description:
        'Fast-paced 3D card battles with drag-and-drop physics! Jump into immersive matches with optimized matchmaking',
      icon: '⚡',
      difficulty: 'All Levels',
      requiresAccount: false,
    },
    {
      id: 'ranked',
      title: 'Ranked Conquest',
      description:
        'Climb the competitive ladder and earn prestigious rewards and recognition',
      icon: '🏆',
      difficulty: 'Competitive',
      requiresAccount: false,
    },
    {
      id: 'tournament',
      title: 'Grand Tournament',
      description:
        'Participate in structured events with exclusive prizes and mystical artifacts',
      icon: '👑',
      difficulty: 'Expert',
      requiresAccount: false,
    },
  ];

  const initializeGame = async (modeId: string) => {
    setGameState('loading');
    setSelectedMode(modeId);

    try {
      // All games now use 3D interface (except ranked/tournament which may use different logic)
      const is3D = modeId.includes('3d') || modeId === 'practice3d' || modeId === 'quick3d';
      setUse3D(is3D);

      // Provide immediate feedback - show loading state instantly  
      console.log(
        `[GameContainer] Starting ${is3D ? '3D' : 'advanced'} card game initialization...`,
      );

      // Loading time for 3D games
      const loadingTime = is3D ? 2000 : 1500;
      await new Promise(resolve => setTimeout(resolve, loadingTime));

      // Go to appropriate playing state (default to 3D for most modes)
      setGameState(is3D ? 'playing3d' : 'playing');
      console.log(
        `[GameContainer] ${is3D ? '3D' : 'Advanced'} card game initialized successfully`,
      );
    } catch (_error) {
      console.error('[GameContainer] Error initializing card game:', _error);
      setError(
        _error instanceof Error ? _error.message : 'Unknown error occurred',
      );
      setGameState('error');
    }
  };

  const handleModeSelect = (modeId: string) => {
    initializeGame(modeId);
  };

  const handleClose = () => {
    setGameState('menu');
    setSelectedMode(null);
    setError(null);
    setUse3D(true); // Reset to default
    // No need to destroy game engine anymore
    if (onClose) onClose();
    if (setShowGame) setShowGame(false);
  };

  const handleRetryGame = () => {
    setError(null);
    if (selectedMode) {
      initializeGame(selectedMode);
    } else {
      setGameState('menu');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('[GameContainer] Component unmounting...');
      // No cleanup needed for card game UI
    };
  }, []);

  // Ensure gameRef is ready when component mounts (no longer needed but keeping for compatibility)
  useEffect(() => {
    console.log('[GameContainer] Game container ready for card game');
  }, []);

  const handleOrientationChange = (landscape: boolean) => {
    // Orientation change handling for future use
    console.log(
      'Orientation changed to:',
      landscape ? 'landscape' : 'portrait',
    );
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    maxWidth:
      dynamicSizing.unit === 'px' ? `${dynamicSizing.maxWidth}px` : '100%',
    maxHeight:
      dynamicSizing.unit === 'px' ? `${dynamicSizing.maxHeight}px` : '100%',
    minWidth: `${dynamicSizing.minWidth}px`,
    minHeight: `${dynamicSizing.minHeight}px`,
    margin: '0 auto',
    zIndex: 10,
    background: '#1a1a1a',
    overflow: 'hidden',
    touchAction: 'manipulation',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    WebkitTouchCallout: 'none',
    WebkitTapHighlightColor: 'transparent',
    borderRadius: dynamicSizing.containerPadding > 0 ? '8px' : '0',
    boxShadow:
      dynamicSizing.containerPadding > 0
        ? '0 4px 20px rgba(0, 0, 0, 0.3)'
        : 'none',
    boxSizing: 'border-box',
  } as React.CSSProperties;

  return (
    <div
      style={containerStyle}
      className="mobile-game-container dynamic-sizing"
    >
      {/* Orientation Prompt */}
      <OrientationPrompt onOrientationChange={handleOrientationChange} />

      <AnimatePresence mode="wait">
        {gameState === 'menu' && (
          <EnhancedGameMenu
            gameModes={gameModes}
            onSelectMode={handleModeSelect}
            onClose={handleClose}
          />
        )}

        {gameState === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background:
                'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)',
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              style={{
                width: '80px',
                height: '80px',
                border: '4px solid rgba(212, 175, 55, 0.3)',
                borderTop: '4px solid #d4af37',
                borderRadius: '50%',
                marginBottom: '24px',
              }}
            />
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                color: '#d4af37',
                fontSize: '1.5rem',
                marginBottom: '12px',
                fontWeight: 'bold',
              }}
            >
              Entering the Mystical Realm...
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '1rem',
                textAlign: 'center',
                maxWidth: '400px',
              }}
            >
              {use3D
                ? 'Initializing advanced 3D graphics, physics engine, particle systems, and mystical effects...'
                : 'Loading traditional card interface and game systems...'}
            </motion.p>
          </motion.div>
        )}

        {gameState === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background:
                'linear-gradient(135deg, #1a0f0f 0%, #2a1a1a 50%, #1a0f0f 100%)',
              padding: '40px',
            }}
          >
            <div
              style={{
                fontSize: '4rem',
                marginBottom: '24px',
              }}
            >
              ⚠️
            </div>
            <h2
              style={{
                color: '#ff6b6b',
                fontSize: '1.8rem',
                marginBottom: '16px',
                textAlign: 'center',
              }}
            >
              Mystical Forces Disrupted
            </h2>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '1rem',
                textAlign: 'center',
                maxWidth: '500px',
                marginBottom: '32px',
                lineHeight: '1.6',
              }}
            >
              The game engine encountered an issue while initializing the
              mystical realm. This could be due to graphics compatibility or
              system resources.
            </p>
            <div
              style={{
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRetryGame}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #d4af37, #f4e06d)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#1a1a1a',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                Retry Connection
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClose}
                style={{
                  padding: '12px 24px',
                  background: 'transparent',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '1rem',
                  cursor: 'pointer',
                }}
              >
                Return to Menu
              </motion.button>
            </div>
            {error && (
              <details
                style={{
                  marginTop: '24px',
                  padding: '16px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  maxWidth: '600px',
                  width: '100%',
                }}
              >
                <summary
                  style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    cursor: 'pointer',
                    marginBottom: '8px',
                  }}
                >
                  Technical Details
                </summary>
                <code
                  style={{
                    color: '#ff9999',
                    fontSize: '0.9rem',
                    fontFamily: 'monospace',
                    wordBreak: 'break-word',
                  }}
                >
                  {error}
                </code>
              </details>
            )}
          </motion.div>
        )}

        {gameState === 'playing' && <CardGameUI onClose={handleClose} />}

        {gameState === 'playing3d' && <Card3DGameUI onClose={handleClose} />}
      </AnimatePresence>
    </div>
  );
};
