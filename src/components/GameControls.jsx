import React from 'react';
import { useGame } from '../contexts/GameContext';
import '../styles/gameControls.css';

const GameControls = () => {
  const { gameState, setGameState, actions } = useGame();
  
  const handleDrawCard = () => {
    const newState = {...gameState};
    // Draw a card for the active player
    if (newState.players[newState.activePlayer].deck.length > 0) {
      const drawnCard = newState.players[newState.activePlayer].deck.pop();
      newState.players[newState.activePlayer].hand.push(drawnCard);
      newState.gameLog.push(`${newState.activePlayer} draws a card`);
    } else {
      newState.gameLog.push(`${newState.activePlayer} has no cards left to draw!`);
    }
    setGameState(newState);
  };
  
  const handleNextPhase = () => {
    actions.nextPhase();
  };
  
  const handleConcede = () => {
    if (window.confirm('Are you sure you want to concede the game?')) {
      const newState = {...gameState};
      newState.gameOver = true;
      newState.winner = gameState.activePlayer === 'player1' ? 'player2' : 'player1';
      newState.gameLog.push(`${gameState.activePlayer} conceded the game`);
      setGameState(newState);
    }
  };
  
  return (
    <div className="game-controls">
      <button className="control-button" onClick={handleDrawCard}>
        Draw
      </button>
      
      <button className="control-button" onClick={handleNextPhase}>
        Next Phase
      </button>
      
      <button className="control-button danger" onClick={handleConcede}>
        Concede
      </button>
      
      <div className="phase-indicator">
        Current Phase: {gameState.phase.replace('_', ' ')}
      </div>
    </div>
  );
};

export default GameControls;