import React from 'react';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { motion } from 'framer-motion';
import {
  User,
  Heart,
  Zap,
  Shield,
  Award,
  Crown,
  Clock,
  AlertCircle,
} from 'lucide-react';

/**
 * Displays player information including avatar, name, and resources
 * Enhanced to be more like KONIVRER Arena
 */
interface PlayerInfoProps {
  player
  gameState
  isOpponent
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({  player, gameState, isOpponent  }) => {
  if (!gameState) return null;
  const { lifeCards, azoth, deck, hand } = gameState;
  const playerName = player?.name || (isOpponent ? 'Opponent' : 'You');
  const avatarUrl = player?.avatarUrl;
  const playerRank = player?.rank || 'Bronze';
  const isActive = gameState.isActive;

  // Get rank badge color
  const getRankColor = (): any => {
    switch (playerRank.toLowerCase()) {
      case 'mythic':
        return 'from-orange-400 to-red-600';
      case 'diamond':
        return 'from-blue-300 to-blue-600';
      case 'platinum':
        return 'from-blue-200 to-blue-400';
      case 'gold':
        return 'from-yellow-300 to-yellow-500';
      case 'silver':
        return 'from-gray-300 to-gray-500';
      case 'bronze':
      default:
        return 'from-amber-700 to-amber-900';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: isOpponent ? -20 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-black/70 backdrop-blur-md rounded-lg p-2 flex items-center space-x-3 shadow-lg ${
        isActive ? 'ring-2 ring-yellow-500/50' : ''
      }`}
     />
      {/* Player Avatar with Rank Badge */}
      <div className="relative" />
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center border-2 border-gray-600 shadow-inner" />
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={playerName}
              className="w-full h-full object-cover"
            / />
          ) : (
            <User className="w-7 h-7 text-gray-300" / />
          )}
        </div>

        {/* Rank Badge */}
        <div
          className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br ${getRankColor()} flex items-center justify-center shadow-lg border border-gray-800`}
         />
          {playerRank.toLowerCase() === 'mythic' ? (
            <Crown className="w-3 h-3 text-white" / />
          ) : (
            <Award className="w-3 h-3 text-white" / />
          )}

        {/* Active Player Indicator */}
        {isActive && (
          <motion.div
            className="absolute -top-1 -left-1 w-4 h-4 bg-yellow-500 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          / />
        )}
      </div>

      {/* Player Info */}
      <div />
        <div className="text-white font-medium text-sm flex items-center" />
          {playerName}
          {isActive && <Clock className="w-3 h-3 text-yellow-400 ml-1" />}

        {/* Resources */}
        <div className="flex items-center space-x-2 mt-1" />
          {/* Life */}
          <motion.div
            className="flex items-center space-x-1 bg-gradient-to-r from-red-900/70 to-red-800/70 rounded-full px-2 py-0.5 shadow-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
           />
            <Heart className="w-3 h-3 text-red-400" / />
            <span className="text-white text-xs font-medium" />
              {lifeCards.length}
          </motion.div>

          {/* Azoth/Mana */}
          <motion.div
            className="flex items-center space-x-1 bg-gradient-to-r from-yellow-800/70 to-yellow-700/70 rounded-full px-2 py-0.5 shadow-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
           />
            <Zap className="w-3 h-3 text-yellow-400" / />
            <span className="text-white text-xs font-medium">{azoth}
          </motion.div>

          {/* Cards in Hand */}
          <motion.div
            className="flex items-center space-x-1 bg-gradient-to-r from-blue-900/70 to-blue-800/70 rounded-full px-2 py-0.5 shadow-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
           />
            <span className="text-white text-xs font-medium" />
              {hand.length}
          </motion.div>
        </div>

      {/* Deck Count */}
      <div className="ml-1" />
        <motion.div
          className="flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg px-2 py-0 whitespace-nowrap shadow-inner"
          whileHover={{ scale: 1.05 }}
         />
          <span className="text-white text-xs font-bold">{deck.length}
          <span className="text-gray-400 text-[8px]">DECK</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PlayerInfo;