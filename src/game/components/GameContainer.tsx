import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gameEngine } from '../GameEngine';
import { EnhancedGameMenu } from './EnhancedGameMenu';
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
  const gameRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<'menu' | 'loading' | 'playing' | 'error'>('menu');
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Enhanced game modes with better descriptions and icons
  const gameModes: GameMode[] = [
    {
      id: 'practice',
      title: 'Practice Arena',
      description: 'Master your skills against adaptive AI opponents with varying difficulty levels',
      icon: '🎯',
      difficulty: 'Beginner Friendly',
      requiresAccount: false,
    },
    {
      id: 'quick',
      title: 'Quick Duel',
      description: 'Jump into fast-paced matches with optimized matchmaking for your skill level',
      icon: '⚡',
      difficulty: 'All Levels',
      requiresAccount: false,
    },
    {
      id: 'ranked',
      title: 'Ranked Conquest',
      description: 'Climb the competitive ladder and earn prestigious rewards and recognition',
      icon: '🏆',
      difficulty: 'Competitive',
      requiresAccount: false,
    },
    {
      id: 'tournament',
      title: 'Grand Tournament',
      description: 'Participate in structured events with exclusive prizes and mystical artifacts',
      icon: '👑',
      difficulty: 'Expert',
      requiresAccount: false,
    },
  ];

  const initializeGame = async (modeId: string) => {
    setGameState('loading');
    setSelectedMode(modeId);

    try {
      if (gameRef.current) {
        console.log('[GameContainer] Initializing game engine...');
        await gameEngine.init(gameRef.current);
        setGameState('playing');
        console.log('[GameEngine] Advanced scenes initialized successfully');
      } else {
        throw new Error('Game container ref not available');
      }
    } catch (error) {
      console.error('[GameContainer] Error initializing game engine:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
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
    gameEngine.destroy();
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
      console.log('[GameContainer] Destroying game engine on unmount...');
      gameEngine.destroy();
    };
  }, []);

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1500,
    background: '#1a1a1a',
    overflow: 'hidden',
  };

  const gameCanvasStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'block',
  };

  return (
    <div style={containerStyle}>
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
              background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)',
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
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
              Initializing advanced 3D graphics, particle systems, and mystical effects...
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
              background: 'linear-gradient(135deg, #1a0f0f 0%, #2a1a1a 50%, #1a0f0f 100%)',
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
              The game engine encountered an issue while initializing the mystical realm. 
              This could be due to graphics compatibility or system resources.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
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

        {gameState === 'playing' && (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ width: '100%', height: '100%', position: 'relative' }}
          >
            {/* Close button for game */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                zIndex: 10,
                width: '48px',
                height: '48px',
                background: 'rgba(0, 0, 0, 0.7)',
                border: '2px solid rgba(212, 175, 55, 0.5)',
                borderRadius: '50%',
                color: '#d4af37',
                fontSize: '1.2rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
              }}
            >
              ✕
            </motion.button>

            {/* Game canvas container */}
            <div
              ref={gameRef}
              style={gameCanvasStyle}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
