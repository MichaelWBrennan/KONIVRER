import { motion } from 'framer-motion';
import { Star, Target, Shield, Trophy } from 'lucide-react';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React from 'react';

interface UnifiedPlayerCardProps {
  player: any;
  variant?: 'standard' | 'compact' | 'detailed';
  showStats?: boolean;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  isSelected?: boolean;
}

interface SizeClasses {
  container: string;
  avatar: string;
  name: string;
  stats: string;
}

const UnifiedPlayerCard: React.FC<UnifiedPlayerCardProps> = ({
  player,
  variant = 'standard',
  showStats = true,
  size = 'medium',
  onClick,
  isSelected
}) => {
  const getSizeClasses = (): SizeClasses => {
    switch (size) {
      case 'small':
        return {
          container: 'p-2',
          avatar: 'w-8 h-8',
          name: 'text-sm',
          stats: 'text-xs'
        };
      case 'large':
        return {
          container: 'p-4',
          avatar: 'w-16 h-16 text-2xl',
          name: 'text-xl',
          stats: 'text-sm'
        };
      case 'medium':
      default:
        return {
          container: 'p-3',
          avatar: 'w-12 h-12',
          name: 'text-base',
          stats: 'text-xs'
        };
    }
  };

  const sizeClasses = getSizeClasses();

  const getRankColor = (tier?: string): string => {
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

  const getRankIcon = (tier?: string): string => {
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

  // Render different variants
  if (variant === 'compact') {
    return (
      <motion.div
        className={`${sizeClasses.container} rounded-lg border transition-all ${
          isSelected
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 hover:border-gray-300'
        } ${onClick ? 'cursor-pointer' : ''}`}
        whileHover={onClick ? { scale: 1.02 } : {}}
        whileTap={onClick ? { scale: 0.98 } : {}}
        onClick={onClick}
      >
        <div className="flex items-center">
          <div
            className={`${sizeClasses.avatar} w-6 h-6 bg-gradient-to-br ${getRankColor(player.tier)} rounded-full flex items-center justify-center text-white font-bold mr-2`}
          >
            {player.avatar || getRankIcon(player.tier) || player.name?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className={`font-medium text-gray-900 truncate ${sizeClasses.name}`}>
              {player.name}
            </div>
          </div>
          {player.rating && (
            <div className="text-gray-500 text-xs ml-2">
              {player.rating}
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  if (variant === 'detailed') {
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
      >
        <div className="flex flex-col">
          <div className="flex items-center space-x-3">
            <div
              className={`${sizeClasses.avatar} bg-gradient-to-br ${getRankColor(player.tier)} rounded-full flex items-center justify-center text-white font-bold`}
            >
              {player.avatar || getRankIcon(player.tier) || player.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className={`font-medium text-gray-900 truncate ${sizeClasses.name}`}>
                {player.name}
              </div>
              {player.tier && (
                <div className="text-gray-500 text-xs">
                  {player.tier} Tier
                </div>
              )}
            </div>
          </div>
          
          {showStats && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-xs text-gray-500">Rating</div>
                <div className="font-medium flex items-center">
                  <Star className="w-3 h-3 mr-1 text-yellow-500" />
                  {player.rating || 'N/A'}
                </div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-xs text-gray-500">Win Rate</div>
                <div className="font-medium flex items-center">
                  <Target className="w-3 h-3 mr-1 text-green-500" />
                  {player.winRate ? `${(player.winRate * 100).toFixed(1)}%` : 'N/A'}
                </div>
              </div>
              {player.hero && (
                <div className="bg-gray-50 p-2 rounded col-span-2">
                  <div className="text-xs text-gray-500">Favorite Hero</div>
                  <div className="font-medium flex items-center">
                    <Shield className="w-3 h-3 mr-1 text-blue-500" />
                    {player.hero}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // Default 'standard' variant
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
    >
      <div className="flex items-center space-x-3">
        <div
          className={`${sizeClasses.avatar} bg-gradient-to-br ${getRankColor(player.tier)} rounded-full flex items-center justify-center text-white font-bold`}
        >
          {player.avatar || getRankIcon(player.tier) || player.name?.[0]?.toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className={`font-medium text-gray-900 truncate ${sizeClasses.name}`}>
            {player.name}
          </div>
          {showStats && (
            <div className={`text-gray-500 ${sizeClasses.stats}`}>
              {player.tier && (
                <span className="inline-flex items-center mr-2">
                  <Trophy className="w-3 h-3 mr-1" />
                  {player.tier}
                </span>
              )}
              {player.rating && (
                <span className="inline-flex items-center mr-2">
                  <Star className="w-3 h-3 mr-1" />
                  {player.rating}
                </span>
              )}
              {player.winRate && (
                <span className="inline-flex items-center">
                  <Target className="w-3 h-3 mr-1" />
                  {(player.winRate * 100).toFixed(1)}%
                </span>
              )}
              {player.hero && (
                <div className="mt-1 truncate">
                  <span className="inline-flex items-center">
                    <Shield className="w-3 h-3 mr-1" />
                    {player.hero}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default UnifiedPlayerCard;