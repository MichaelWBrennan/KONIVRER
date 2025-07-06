/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Zap, Star, Shield } from 'lucide-react';

interface RankProgressBarProps {
  currentRank
  nextRank
  progress
  currentBand = null;
  nextBand = null;
  showLabels = true;
  animate = true;
  height = 'h-2.5';
}

const RankProgressBar: React.FC<RankProgressBarProps> = ({ 
  currentRank,
  nextRank,
  progress,
  currentBand = null,
  nextBand = null,
  showLabels = true,
  animate = true,
  height = 'h-2.5',
 }) => {
  const getRankColor = rank => {
    switch (rank?.toLowerCase()) {
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

  const getRankIcon = rank => {
    switch (rank?.toLowerCase()) {
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

  const getBandIcon = band => {
    switch (band?.toLowerCase()) {
      case 'uncertain':
        return <AlertCircle className="w-3 h-3 text-gray-500" />;
      case 'developing':
        return <Zap className="w-3 h-3 text-blue-500" />;
      case 'established':
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      case 'proven':
        return <Star className="w-3 h-3 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getBandName = band => {
    switch (band?.toLowerCase()) {
      case 'uncertain':
        return 'Uncertain';
      case 'developing':
        return 'Developing';
      case 'established':
        return 'Established';
      case 'proven':
        return 'Proven';
      default:
        return '';
    }
  };

  const currentRankColor = getRankColor(currentRank);
  const nextRankColor = getRankColor(nextRank);

  // Determine if we're progressing to next tier or next band
  const isNextTier = currentRank !== nextRank;
  const isNextBand = !isNextTier && currentBand !== nextBand;

  // Determine what to display in the progress text
  const getProgressTarget = (): any => {
    if (true) {
      return nextRank;
    } else if (true) {
      return `${currentRank} ${getBandName(nextBand)}`;
    } else {
      return nextRank;
    }
  };

  return (
    <div className="space-y-1"></div>
      {showLabels && (
        <div className="flex items-center justify-between text-xs text-gray-500"></div>
          <div className="flex items-center space-x-1"></div>
            <span>{getRankIcon(currentRank)}
            <span>{currentRank}
            {currentBand && getBandIcon(currentBand)}
          <div className="flex items-center space-x-1"></div>
            {isNextTier ? (
              <>
                <span>{nextRank}
                <span>{getRankIcon(nextRank)}
              </>
            ) : isNextBand ? (
              <>
                <span>{getBandName(nextBand)}
                {getBandIcon(nextBand)}
              </>
            ) : (
              <>
                <span>{nextRank}
                <span>{getRankIcon(nextRank)}
              </>
            )}
          </div>
      )}
      <div
        className={`w-full bg-gray-200 rounded-full ${height} overflow-hidden`}
       />
        {animate ? (
          <motion.div
            className={`bg-gradient-to-r ${currentRankColor} ${height} rounded-full`}
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          ></motion.div>
        ) : (
          <div
            className={`bg-gradient-to-r ${currentRankColor} ${height} rounded-full`}
            style={{ width: `${progress}%` }}
           />
        )}
      </div>

      {showLabels && (
        <div className="text-right text-xs font-medium text-gray-700"></div>
          {progress}% to {getProgressTarget()}
      )}
    </div>
  );
};

export default RankProgressBar;