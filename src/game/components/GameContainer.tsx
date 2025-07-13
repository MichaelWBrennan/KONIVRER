import React, { useEffect, useRef } from 'react';
import { gameEngine } from '../GameEngine';
import '../styles/mobile.css';

interface GameContainerProps {
  onClose?: () => void;
  setShowGame?: (show: boolean) => void;
}

export const GameContainer: React.FC<GameContainerProps> = ({ onClose, setShowGame }) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const gameInitializedRef = useRef<boolean>(false);

  useEffect(() => {
    // Small delay to ensure DOM is fully rendered
    const initTimer = setTimeout(() => {
      if (gameRef.current && !gameInitializedRef.current) {
        // Make setShowGame available globally for the game
        if (setShowGame) {
          window.setShowGame = setShowGame;
        }
        
        // Initialize the game engine
        try {
          console.log('[GameContainer] Initializing game engine...');
          gameEngine.init(gameRef.current);
          gameInitializedRef.current = true;
          console.log('[GameContainer] Game engine initialized successfully');
        } catch (error) {
          console.error('[GameContainer] Error initializing game engine:', error);
        }
      }
    }, 100);

    // Cleanup function
    return () => {
      clearTimeout(initTimer);
      try {
        console.log('[GameContainer] Destroying game engine...');
        gameEngine.destroy();
        gameInitializedRef.current = false;
        // Clean up global reference
        if (window.setShowGame) {
          delete window.setShowGame;
        }
      } catch (error) {
        console.error('[GameContainer] Error destroying game engine:', error);
      }
    };
  }, [setShowGame]);

  return (
    <div className="mobile-game-container" style={{
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      background: '#1a1a1a'
    }}>
      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="touch-button touch-button-secondary"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            zIndex: 1001,
            fontSize: '14px',
            padding: '8px 16px',
            background: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Close Game
        </button>
      )}
      
      {/* Game container */}
      <div
        ref={gameRef}
        className="game-ui"
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      />
    </div>
  );
};