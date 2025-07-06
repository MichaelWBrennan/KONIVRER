import { motion } from 'framer-motion';
import React from 'react';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import CardZone from './CardZone';
import PlayerInfo from './PlayerInfo';

/**
 * Renders a player's area of the game board, including hand, field, and other zones
 */
interface PlayerZoneProps {
  player
  gameState
  isOpponent
  onCardSelect
  onCardHover
  selectedCard
  targetMode
  targets
}

const PlayerZone: React.FC<PlayerZoneProps> = ({ 
  player,
  gameState,
  isOpponent,
  onCardSelect,
  onCardHover,
  selectedCard,
  targetMode,
  targets,
 }) => {
  if (!gameState) return null;
  const { hand, field, azothRow, deck, lifeCards } = gameState;

  // Determine if this player is active
  const isActive = gameState.isActive;

  // Calculate zone positions based on whether this is the opponent or player
  const zonePositions = isOpponent
    ? {
        hand: 'top-4 left-1/2 transform -translate-x-1/2',
        field: 'top-32 left-1/2 transform -translate-x-1/2',
        azothRow: 'top-32 left-4',
        deck: 'top-4 left-4',
        lifeCards: 'top-4 right-4',
      }
    : {
        hand: 'bottom-4 left-1/2 transform -translate-x-1/2',
        field: 'bottom-32 left-1/2 transform -translate-x-1/2',
        azothRow: 'bottom-32 left-4',
        deck: 'bottom-4 left-4',
        lifeCards: 'bottom-4 right-4',
      };

  return (
    <div
      className={`absolute ${isOpponent ? 'top-12' : 'bottom-0'} left-0 right-0 h-2/5 pointer-events-none`}></div>
      {/* Player Info */}
      <div
        className={`absolute ${isOpponent ? 'top-4' : 'bottom-4'} right-32 pointer-events-auto`}></div>
        <PlayerInfo
          player={player}
          gameState={gameState}
          isOpponent={isOpponent} />
      </div>

      {/* Hand */}
      <div className={`absolute ${zonePositions.hand} pointer-events-auto`}></div>
        <CardZone
          cards={hand}
          zone="hand"
          layout="fan"
          faceDown={isOpponent}
          onCardSelect={onCardSelect}
          onCardHover={onCardHover}
          selectedCard={selectedCard}
          targetMode={targetMode}
          targets={targets}
          isInteractive={!isOpponent} />
      </div>

      {/* Field */}
      <div className={`absolute ${zonePositions.field} pointer-events-auto`}></div>
        <CardZone
          cards={field}
          zone="field"
          layout="grid"
          onCardSelect={onCardSelect}
          onCardHover={onCardHover}
          selectedCard={selectedCard}
          targetMode={targetMode}
          targets={targets}
          isInteractive={true} />
      </div>

      {/* Azoth Row */}
      <div className={`absolute ${zonePositions.azothRow} pointer-events-auto`}></div>
        <CardZone
          cards={azothRow}
          zone="azothRow"
          layout="row"
          onCardSelect={onCardSelect}
          onCardHover={onCardHover}
          selectedCard={selectedCard}
          targetMode={targetMode}
          targets={targets}
          isInteractive={true} />
      </div>

      {/* Deck */}
      <div className={`absolute ${zonePositions.deck} pointer-events-auto`}></div>
        <div className="relative"></div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-20 h-28 bg-blue-900 border border-blue-700 rounded-lg shadow-lg flex items-center justify-center"
           />
            <span className="text-white font-bold">{deck.length}
          </motion.div>
          <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"></div>
            {deck.length}
        </div>

      {/* Life Cards */}
      <div
        className={`absolute ${zonePositions.lifeCards} pointer-events-auto`}></div>
        <div className="relative"></div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-20 h-28 bg-purple-900 border border-purple-700 rounded-lg shadow-lg flex items-center justify-center"
           />
            <span className="text-white font-bold">Life</span>
          </motion.div>
          <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"></div>
            {lifeCards.length}
        </div>

      {/* Active Player Indicator */}
      {isActive && (
        <div className="absolute inset-0 pointer-events-none"></div>
          <div className="absolute inset-0 border-2 border-yellow-400 rounded-lg opacity-50"></div>
          <div
            className={`absolute ${isOpponent ? 'top-2' : 'bottom-2'} left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black px-3 py-0 whitespace-nowrap rounded-full text-sm font-bold`}></div>
            Active Player
          </div>
      )}
    </div>
  );
};

export default PlayerZone;