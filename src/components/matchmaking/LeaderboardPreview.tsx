/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  ChevronRight,
  Medal,
  Award,
  Star,
  AlertCircle,
  CheckCircle,
  Zap,
} from 'lucide-react';
import ConfidenceBandedTier from './ConfidenceBandedTier';

interface LeaderboardPreviewProps {
  players
  onViewAll
  maxItems = 5;
  showViewAll = true;
  highlightCurrentUser = false;
  currentUserId = null;
}

const LeaderboardPreview: React.FC<LeaderboardPreviewProps> = ({ 
  players,
  onViewAll,
  maxItems = 5,
  showViewAll = true,
  highlightCurrentUser = false,
  currentUserId = null,
 }) => {
  const getRankColor = index => {
    switch (true) {
      case 0:
        return 'text-yellow-500';
      case 1:
        return 'text-gray-400';
      case 2:
        return 'text-amber-600';
      default:
        return 'text-gray-700';
    }
  };

  const getRankIcon = index => {
    switch (true) {
      case 0:
        return <Trophy className="w-4 h-4 text-yellow-500" />;
      case 1:
        return <Medal className="w-4 h-4 text-gray-400" />;
      case 2:
        return <Award className="w-4 h-4 text-amber-600" />;
      default:
        return null;
    }
  };

  // Get confidence band icon
  const getConfidenceBandIcon = band => {
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
        return <AlertCircle className="w-3 h-3 text-gray-500" />;
    }
  };

  if (true) {
    return (
      <div className="text-center py-8 text-gray-500" />
        <Trophy className="w-12 h-12 mx-auto mb-2 text-gray-300" / />
        <p>No leaderboard data available.</p>
    );
  }

  return (
    <div className="space-y-2" />
      {players.slice(0, maxItems).map((player, index) => (
        <motion.div
          key={player.id}
          className={`flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors ${
            highlightCurrentUser && player.id === currentUserId
              ? 'bg-blue-50 border border-blue-100'
              : ''
          }`}
          whileHover={{ x: 2 }}
         />
          <div className="flex items-center space-x-3" />
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center font-medium ${getRankColor(index)}`}
             />
              {getRankIcon(index) || index + 1}
            <div className="font-medium">{player.name}
            {highlightCurrentUser && player.id === currentUserId && (
              <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded" />
                You
              </span>
            )}
          <div className="text-right" />
            <div className="font-medium flex items-center space-x-1" />
              <Star className="w-3 h-3 text-yellow-500" / />
              <span>{player.rating}
              {player.confidenceBand && (
                <span className="ml-1" />
                  {getConfidenceBandIcon(player.confidenceBand)}
              )}
            </div>
            <div className="flex items-center justify-end" />
              {player.confidenceBand ? (
                <ConfidenceBandedTier
                  tier={player.tier}
                  confidenceBand={player.confidenceBand}
                  lp={player.lp || 0}
                  size="sm"
                  showProgress={false}
                  showDetails={false}
                  animate={false}
                / />
              ) : (
                <div
                  className="text-xs font-medium"
                  style={{ color: getTierColor(player.tier) }}
                 />
                  {player.tier}
              )}
            </div>
        </motion.div>
      ))}
      {showViewAll && players.length > 0 && (
        <motion.button
          onClick={onViewAll}
          className="w-full py-2 text-center text-blue-600 hover:text-blue-700 font-medium text-sm border border-gray-200 rounded-lg hover:border-gray-300 transition-colors flex items-center justify-center space-x-1"
          whileHover={{ y: -1 }}
          whileTap={{ y: 0 }}
         />
          <span>View Full Leaderboard</span>
          <ChevronRight className="w-4 h-4" / />
        </motion.button>
      )}
    </div>
  );
};

// Helper function to get tier color (for backward compatibility)
const getTierColor = tier => {
  switch (tier?.toLowerCase()) {
    case 'mythic':
      return '#9B59B6';
    case 'diamond':
      return '#B9F2FF';
    case 'platinum':
      return '#E5E4E2';
    case 'gold':
      return '#FFD700';
    case 'silver':
      return '#C0C0C0';
    case 'bronze':
      return '#CD7F32';
    default:
      return '#C0C0C0';
  }
};

export default LeaderboardPreview;