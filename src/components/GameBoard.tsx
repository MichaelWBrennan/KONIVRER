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
      <PhaseIndicator phase={gameState.phase} turn={gameState.currentTurn} activePlayer={gameState.activePlayer} /></PhaseIndicator>
      {/* Opponent Area */}
      <div className="opponent-area"></div>
        <PlayerInfo player={gameState.players[opponentId]} isOpponent={true} /></PlayerInfo>
        <div className="board-row"></div>
          <FlagZone flagCard={gameState.players[opponentId].flagZone} isCurrentPlayer={false} /></FlagZone>
          <div className="center-area"></div>
            <CombatRow combatCards={gameState.players[opponentId].combatRow} isCurrentPlayer={false} /></CombatRow>
            <Field cards={gameState.players[opponentId].field} isCurrentPlayer={false} /></Field>
          </div>
          <div className="right-column"></div>
            <Deck deckSize={gameState.players[opponentId].deck.length} isCurrentPlayer={false} /></Deck>
            <RemovedFromPlay cards={gameState.players[opponentId].removedFromPlay} isCurrentPlayer={false} /></RemovedFromPlay>
          </div>
        </div>
        
        <LifeCardsZone lifeCards={gameState.players[opponentId].lifeCards} isCurrentPlayer={false} /></LifeCardsZone>
      </div>
      
      {/* Current Player Area */}
      <div className="player-area"></div>
        <LifeCardsZone lifeCards={gameState.players[currentPlayer].lifeCards} isCurrentPlayer={true} /></LifeCardsZone>
        <div className="board-row"></div>
          <FlagZone flagCard={gameState.players[currentPlayer].flagZone} isCurrentPlayer={true} /></FlagZone>
          <div className="center-area"></div>
            <Field cards={gameState.players[currentPlayer].field} isCurrentPlayer={true} /></Field>
            <CombatRow combatCards={gameState.players[currentPlayer].combatRow} isCurrentPlayer={true} /></CombatRow>
            <AzothRow azothCards={gameState.players[currentPlayer].azothRow} /></AzothRow>
          </div>
          <div className="right-column"></div>
            <Deck deckSize={gameState.players[currentPlayer].deck.length} isCurrentPlayer={true} /></Deck>
            <RemovedFromPlay cards={gameState.players[currentPlayer].removedFromPlay} isCurrentPlayer={true} /></RemovedFromPlay>
          </div>
        </div>
        
        <PlayerInfo player={gameState.players[currentPlayer]} isOpponent={false} /></PlayerInfo>
        <GameControls /></GameControls>
        <Hand cards={gameState.players[currentPlayer].hand} /></Hand>
      </div>
      
      <GameLog log={gameState.gameLog} /></GameLog>
    </div>
  );
};

export default GameBoard;