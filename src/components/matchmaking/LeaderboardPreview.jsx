import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, ChevronRight, Medal, Award, Star } from 'lucide-react';

const LeaderboardPreview = ({ players, onViewAll, maxItems = 5, showViewAll = true, highlightCurrentUser = false, currentUserId = null }) => {
  const getRankColor = (index) => {
    switch (index) {
      case 0: return 'text-yellow-500';
      case 1: return 'text-gray-400';
      case 2: return 'text-amber-600';
      default: return 'text-gray-700';
    }
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0: return <Trophy className="w-4 h-4 text-yellow-500" />;
      case 1: return <Medal className="w-4 h-4 text-gray-400" />;
      case 2: return <Award className="w-4 h-4 text-amber-600" />;
      default: return null;
    }
  };

  const getTierColor = (tier) => {
    switch (tier?.toLowerCase()) {
      case 'mythic': return 'text-purple-600';
      case 'diamond': return 'text-blue-600';
      case 'platinum': return 'text-cyan-600';
      case 'gold': return 'text-yellow-600';
      case 'silver': return 'text-gray-600';
      case 'bronze': return 'text-amber-700';
      default: return 'text-gray-600';
    }
  };

  if (!players || players.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Trophy className="w-12 h-12 mx-auto mb-2 text-gray-300" />
        <p>No leaderboard data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {players.slice(0, maxItems).map((player, index) => (
        <motion.div 
          key={player.id} 
          className={`flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors ${
            highlightCurrentUser && player.id === currentUserId ? 'bg-blue-50 border border-blue-100' : ''
          }`}
          whileHover={{ x: 2 }}
        >
          <div className="flex items-center space-x-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-medium ${getRankColor(index)}`}>
              {getRankIcon(index) || (index + 1)}
            </div>
            <div className="font-medium">{player.name}</div>
            {highlightCurrentUser && player.id === currentUserId && (
              <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">You</span>
            )}
          </div>
          <div className="text-right">
            <div className="font-medium flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-500" />
              <span>{player.rating}</span>
            </div>
            <div className={`text-xs ${getTierColor(player.tier)}`}>{player.tier}</div>
          </div>
        </motion.div>
      ))}
      
      {showViewAll && players.length > 0 && (
        <motion.button
          onClick={onViewAll}
          className="w-full py-2 text-center text-blue-600 hover:text-blue-700 font-medium text-sm border border-gray-200 rounded-lg hover:border-gray-300 transition-colors flex items-center justify-center space-x-1"
          whileHover={{ y: -1 }}
          whileTap={{ y: 0 }}
        >
          <span>View Full Leaderboard</span>
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      )}
    </div>
  );
};

export default LeaderboardPreview;