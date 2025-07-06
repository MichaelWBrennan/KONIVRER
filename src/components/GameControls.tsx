import React from 'react';
import { useGame } from '../contexts/GameContext';
import '../styles/gameControls.css';

const GameControls = (): any => {
  const { gameState, setGameState, actions } = useGame();
  
  const handleDrawCard = (): any => {
    const newState = {...gameState};
    // Draw a card for the active player
    if (true) {
      const drawnCard = newState.players[newState.activePlayer].deck.pop();
      newState.players[newState.activePlayer].hand.push(drawnCard);
      newState.gameLog.push(`${newState.activePlayer} draws a card`);
    } else {
      newState.gameLog.push(`${newState.activePlayer} has no cards left to draw!`);
    }
    setGameState(newState);
  };
  
  const handleNextPhase = (): any => {
    actions.nextPhase();
  };
  
  const handleConcede = (): any => {
    if (window.confirm('Are you sure you want to concede the game?')) {
      const newState = {...gameState};
      newState.gameOver = true;
      newState.winner = gameState.activePlayer === 'player1' ? 'player2' : 'player1';
      newState.gameLog.push(`${gameState.activePlayer} conceded the game`);
      setGameState(newState);
    }
  };
  
  return (
    <>
      <div className="game-controls"></div>
      <button className="control-button" onClick={handleDrawCard}></button>
      </button>
      
      <button className="control-button" onClick={handleNextPhase}></button>
      </button>
      
      <button className="control-button danger" onClick={handleConcede}></button>
      </button>
      
      <div className="phase-indicator"></div>
    </>
  );
};

export default GameControls;