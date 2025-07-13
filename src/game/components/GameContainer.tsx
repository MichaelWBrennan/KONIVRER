import React, { useEffect, useRef } from 'react';
import { gameEngine } from '../GameEngine';
import '../styles/mobile.css';

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
    <div className="mobile-game-container">
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
            padding: '8px 16px'
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
          justifyContent: 'center'
        }}
      />
    </div>
  );
};