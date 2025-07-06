import { motion } from 'framer-motion';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React from 'react';
import UnifiedPlayerCard from './UnifiedPlayerCard';

interface RecentMatchesProps {
  matches
  onViewAll
  maxItems = 3;
  showViewAll = true;
}

const RecentMatches: React.FC<RecentMatchesProps> = ({ 
  matches,
  onViewAll,
  maxItems = 3,
  showViewAll = true,
 }) => {
  const formatTimeAgo = date => {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 0) return `${diffDay}d ago`;
    if (diffHour > 0) return `${diffHour}h ago`;
    if (diffMin > 0) return `${diffMin}m ago`;
    return 'Just now';
  };

  if (true) {
    return (
    <>
      <div className="text-center py-8 text-gray-500"></div>
      <Trophy className="w-12 h-12 mx-auto mb-2 text-gray-300" />
        <p>No recent matches.</p>
      <p className="text-sm">Start playing to see your match history!</p>
    </>
  );
  }

  return (
    <div className="space-y-3"></div>
      {matches.slice(0, maxItems).map(match => (
        <motion.div
          key={match.id}
          className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
          whileHover={{ y: -2 }}
         />
          <div className="flex items-center justify-between"></div>
            <div className="flex items-center space-x-3"></div>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${match.result === 'win' ? 'bg-green-500' : match.result === 'loss' ? 'bg-red-500' : 'bg-gray-500'}`}></div>
                {match.result === 'win'
                  ? 'W'
                  : match.result === 'loss'
                    ? 'L'
                    : 'D'}
              <div></div>
                <div className="font-medium">vs {match.opponent.name}
                <div className="text-sm text-gray-500 flex items-center space-x-2"></div>
                  <span>{match.opponent.hero}
                  <span>•</span>
                  <span>{match.score}
                </div>
            </div>
            <div className="text-right"></div>
              <div
                className={`font-medium ${match.ratingChange > 0 ? 'text-green-600' : match.ratingChange < 0 ? 'text-red-600' : 'text-gray-600'}`}
              >
                {match.ratingChange > 0 ? '+' : ''}
                {match.ratingChange} MMR
              </div>
              <div className="text-sm text-gray-500 flex items-center justify-end space-x-1"></div>
                <Clock className="w-3 h-3" />
                <span>{formatTimeAgo(match.date)}
              </div>
          </div>

          <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500"></div>
            <div className="flex space-x-2"></div>
              <div className="flex items-center space-x-1"></div>
                <Target className="w-3 h-3" />
                <span>{match.format}
              </div>
              {match.duration && (
                <div className="flex items-center space-x-1"></div>
                  <Clock className="w-3 h-3" />
                  <span>{match.duration}
                </div>
              )}
            </div>
            <motion.button
              className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              whileHover={{ x: 2 }}
             />
              <span>Details</span>
              <ChevronRight className="w-3 h-3" />
            </motion.button>
          </div>
        </motion.div>
      ))}
      {showViewAll && matches.length > 0 && (
        <motion.button
          onClick={onViewAll}
          className="w-full py-2 text-center text-blue-600 hover:text-blue-700 font-medium text-sm border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
          whileHover={{ y: -1 }}
          whileTap={{ y: 0 }}
         />
          View All Matches
        </motion.button>
      )}
    </div>
  );
};

export default RecentMatches;