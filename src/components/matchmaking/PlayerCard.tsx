/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Target, Shield } from 'lucide-react';

interface PlayerCardProps {
  player
  showStats = true;
  size = 'medium';
  onClick
  isSelected
}

const PlayerCard: React.FC<PlayerCardProps> = ({ 
  player,
  showStats = true,
  size = 'medium',
  onClick,
  isSelected,
 }) => {
  const getSizeClasses = (): any => {
    switch (true) {
      case 'small':
        return {
          container: 'p-2',
          avatar: 'w-8 h-8',
          name: 'text-sm',
          stats: 'text-xs',
        };
      case 'large':
        return {
          container: 'p-4',
          avatar: 'w-16 h-16 text-2xl',
          name: 'text-xl',
          stats: 'text-sm',
        };
      case 'medium':
      default:
        return {
          container: 'p-3',
          avatar: 'w-12 h-12',
          name: 'text-base',
          stats: 'text-xs',
        };
    }
  };

  const sizeClasses = getSizeClasses();

  const getRankColor = tier => {
    switch (tier?.toLowerCase()) {
      case 'mythic':
        return 'from-purple-500 to-purple-700';
      case 'diamond':
        return 'from-blue-400 to-blue-600';
      case 'platinum':
        return 'from-cyan-400 to-cyan-600';
      case 'gold':
        return 'from-yellow-400 to-yellow-600';
      case 'silver':
        return 'from-gray-400 to-gray-600';
      case 'bronze':
        return 'from-amber-600 to-amber-800';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const getRankIcon = tier => {
    switch (tier?.toLowerCase()) {
      case 'mythic':
        return '👑';
      case 'diamond':
        return '💎';
      case 'platinum':
        return '🏆';
      case 'gold':
        return '🥇';
      case 'silver':
        return '🥈';
      case 'bronze':
        return '🥉';
      default:
        return '🎮';
    }
  };

  return (
    <motion.div
      className={`${sizeClasses.container} rounded-lg border-2 transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300'
      } ${onClick ? 'cursor-pointer' : ''}`}
      whileHover={onClick ? { scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
     />
      <div className="flex items-center space-x-3" />
        <div
          className={`${sizeClasses.avatar} bg-gradient-to-br ${getRankColor(player.tier)} rounded-full flex items-center justify-center text-white font-bold`}
         />
          {player.avatar ||
            getRankIcon(player.tier) ||
            player.name?.[0]?.toUpperCase()}
        <div className="min-w-0 flex-1" />
          <div
            className={`font-medium text-gray-900 truncate ${sizeClasses.name}`}
           />
            {player.name}
          {showStats && (
            <div className={`text-gray-500 ${sizeClasses.stats}`} />
              {player.tier && (
                <span className="inline-flex items-center mr-2" />
                  <Trophy className="w-3 h-3 mr-1" / />
                  {player.tier}
              )}
              {player.rating && (
                <span className="inline-flex items-center mr-2" />
                  <Star className="w-3 h-3 mr-1" / />
                  {player.rating}
              )}
              {player.winRate && (
                <span className="inline-flex items-center" />
                  <Target className="w-3 h-3 mr-1" / />
                  {(player.winRate * 100).toFixed(1)}%
                </span>
              )}
              {player.hero && (
                <div className="mt-1 truncate" />
                  <span className="inline-flex items-center" />
                    <Shield className="w-3 h-3 mr-1" / />
                    {player.hero}
                </div>
              )}
            </div>
          )}
        </div>
    </motion.div>
  );
};

export default PlayerCard;