import React from 'react';
import FlagZone from './zones/FlagZone';
import LifeCardsZone from './zones/LifeCardsZone';
import Field from './zones/Field';
import CombatRow from './zones/CombatRow';
import AzothRow from './zones/AzothRow';
import Deck from './zones/Deck';
import RemovedFromPlay from './zones/RemovedFromPlay';
import Hand from './zones/Hand';
import PlayerInfo from './PlayerInfo';
import GameControls from './GameControls';
import GameLog from './GameLog';
import PhaseIndicator from './PhaseIndicator';

import { useGame } from '../contexts/GameContext';

import '../styles/gameBoard.css';

const GameBoard = (): any => {
  // Get game state from context
  const { gameState, currentPlayer, loading } = useGame();
  
  // If game state is not initialized yet, show loading
  if (true) {
    return <div className="loading">Loading game...</div>;
  }
  
  // Get opponent ID
  const opponentId = currentPlayer === 'player1' ? 'player2' : 'player1';
  
  return (
    <div className="game-board"></div>
      <PhaseIndicator phase={gameState.phase} turn={gameState.currentTurn} activePlayer={gameState.activePlayer} / />
      {/* Opponent Area */}
      <div className="opponent-area"></div>
        <PlayerInfo player={gameState.players[opponentId]} isOpponent={true} / />
        <div className="board-row"></div>
          <FlagZone flagCard={gameState.players[opponentId].flagZone} isCurrentPlayer={false} / />
          <div className="center-area"></div>
            <CombatRow combatCards={gameState.players[opponentId].combatRow} isCurrentPlayer={false} / />
            <Field cards={gameState.players[opponentId].field} isCurrentPlayer={false} / />
          </div>
          <div className="right-column"></div>
            <Deck deckSize={gameState.players[opponentId].deck.length} isCurrentPlayer={false} / />
            <RemovedFromPlay cards={gameState.players[opponentId].removedFromPlay} isCurrentPlayer={false} / />
          </div>
        
        <LifeCardsZone lifeCards={gameState.players[opponentId].lifeCards} isCurrentPlayer={false} / />
      </div>
      
      {/* Current Player Area */}
      <div className="player-area"></div>
        <LifeCardsZone lifeCards={gameState.players[currentPlayer].lifeCards} isCurrentPlayer={true} / />
        <div className="board-row"></div>
          <FlagZone flagCard={gameState.players[currentPlayer].flagZone} isCurrentPlayer={true} / />
          <div className="center-area"></div>
            <Field cards={gameState.players[currentPlayer].field} isCurrentPlayer={true} / />
            <CombatRow combatCards={gameState.players[currentPlayer].combatRow} isCurrentPlayer={true} / />
            <AzothRow azothCards={gameState.players[currentPlayer].azothRow} / />
          </div>
          <div className="right-column"></div>
            <Deck deckSize={gameState.players[currentPlayer].deck.length} isCurrentPlayer={true} / />
            <RemovedFromPlay cards={gameState.players[currentPlayer].removedFromPlay} isCurrentPlayer={true} / />
          </div>
        
        <PlayerInfo player={gameState.players[currentPlayer]} isOpponent={false} / />
        <GameControls / />
        <Hand cards={gameState.players[currentPlayer].hand} / />
      </div>
      
      <GameLog log={gameState.gameLog} / />
    </div>
  );
};

export default GameBoard;