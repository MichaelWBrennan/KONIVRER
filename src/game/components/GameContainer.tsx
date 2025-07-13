import React, { useEffect, useRef } from 'react';
import { gameEngine } from '../GameEngine';

interface GameContainerProps {
  onClose?: () => void;
  setShowGame?: (show: boolean) => void;
}

export const GameContainer: React.FC<GameContainerProps> = ({ onClose, setShowGame }) => {
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameRef.current) {
      // Make setShowGame available globally for the game
      if (setShowGame) {
        window.setShowGame = setShowGame;
      }
      
      // Initialize the game engine
      gameEngine.init(gameRef.current);
    }

    // Cleanup function
    return () => {
      gameEngine.destroy();
      // Clean up global reference
      if (window.setShowGame) {
        delete window.setShowGame;
      }
    };
  }, [setShowGame]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#000000',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(42, 42, 42, 0.9)',
            border: '2px solid #d4af37',
            color: '#d4af37',
            padding: '10px 20px',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer',
            zIndex: 1001
          }}
        >
          Close Game
        </button>
      )}
      
      {/* Game container */}
      <div
        ref={gameRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      />
    </div>
  );
};