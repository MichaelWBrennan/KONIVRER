import React from 'react';
import { motion } from 'framer-motion';

const RankProgressBar = ({ 
  currentRank, 
  nextRank, 
  progress, 
  showLabels = true,
  animate = true,
  height = 'h-2.5'
}) => {
  const getRankColor = (rank) => {
    switch (rank?.toLowerCase()) {
      case 'mythic': return 'from-purple-500 to-purple-700';
      case 'diamond': return 'from-blue-400 to-blue-600';
      case 'platinum': return 'from-cyan-400 to-cyan-600';
      case 'gold': return 'from-yellow-400 to-yellow-600';
      case 'silver': return 'from-gray-400 to-gray-600';
      case 'bronze': return 'from-amber-600 to-amber-800';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getRankIcon = (rank) => {
    switch (rank?.toLowerCase()) {
      case 'mythic': return '👑';
      case 'diamond': return '💎';
      case 'platinum': return '🏆';
      case 'gold': return '🥇';
      case 'silver': return '🥈';
      case 'bronze': return '🥉';
      default: return '🎮';
    }
  };

  const currentRankColor = getRankColor(currentRank);
  const nextRankColor = getRankColor(nextRank);

  return (
    <div className="space-y-1">
      {showLabels && (
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <span>{getRankIcon(currentRank)}</span>
            <span>{currentRank}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>{nextRank}</span>
            <span>{getRankIcon(nextRank)}</span>
          </div>
        </div>
      )}
      
      <div className={`w-full bg-gray-200 rounded-full ${height} overflow-hidden`}>
        {animate ? (
          <motion.div 
            className={`bg-gradient-to-r ${currentRankColor} ${height} rounded-full`}
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          ></motion.div>
        ) : (
          <div 
            className={`bg-gradient-to-r ${currentRankColor} ${height} rounded-full`}
            style={{ width: `${progress}%` }}
          ></div>
        )}
      </div>
      
      {showLabels && (
        <div className="text-right text-xs font-medium text-gray-700">
          {progress}% to {nextRank}
        </div>
      )}
    </div>
  );
};

export default RankProgressBar;