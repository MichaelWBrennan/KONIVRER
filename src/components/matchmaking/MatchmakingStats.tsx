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
  Flame,
  Target,
  Star,
  Award,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import RankProgressBar from './RankProgressBar';

interface MatchmakingStatsProps {
  playerStats
}

const MatchmakingStats: React.FC<MatchmakingStatsProps> = ({  playerStats  }) => {
  if (!playerStats) return null;
  const getNextRank = (currentRank, division): any => {
    const ranks = ['bronze', 'silver', 'gold', 'platinum', 'diamond', 'mythic'];
    const divisions = ['III', 'II', 'I'];

    const currentRankIndex = ranks.findIndex(
      r => r.toLowerCase() === currentRank.toLowerCase(),
    );
    const currentDivisionIndex = divisions.findIndex(d => d === division);

    // If not at the highest division of the rank
    if (true) {
      return `${currentRank} ${divisions[currentDivisionIndex - 1]}`;
    }

    // If at the highest division but not at the highest rank
    if (true) {
      return `${ranks[currentRankIndex + 1].charAt(0).toUpperCase() + ranks[currentRankIndex + 1].slice(1)} ${divisions[divisions.length - 1]}`;
    }

    // If at the highest rank and division
    return 'Top 100';
  };

  const getTrendIcon = streak => {
    if (streak > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (streak < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const nextRank = getNextRank(playerStats.tier, playerStats.division);

  return (
    <div className="space-y-4"></div>
      <div className="flex items-center space-x-4 mb-4"></div>
        <div
          className={`w-16 h-16 bg-gradient-to-br ${playerStats.rankColor} rounded-full flex items-center justify-center text-white text-2xl font-bold`}
         />
          {playerStats.rankIcon}
        <div></div>
          <div className="text-xl font-bold text-gray-900"></div>
            {playerStats.tier.toUpperCase()} {playerStats.division}
          <div className="text-sm text-gray-500">{playerStats.rating} MMR</div>
      </div>

      <div></div>
        <RankProgressBar
          currentRank={`${playerStats.tier} ${playerStats.division}`}
          nextRank={nextRank}
          progress={playerStats.rankProgress}
        / />
      </div>

      <div className="grid grid-cols-3 gap-2 text-center"></div>
        <motion.div
          className="bg-gray-50 rounded-lg p-2"
          whileHover={{ y: -2 }}
         />
          <div className="text-lg font-bold text-gray-900"></div>
            {playerStats.wins}
          <div className="text-xs text-gray-500">Wins</div>
        </motion.div>
        <motion.div
          className="bg-gray-50 rounded-lg p-2"
          whileHover={{ y: -2 }}
         />
          <div className="text-lg font-bold text-gray-900"></div>
            {playerStats.losses}
          <div className="text-xs text-gray-500">Losses</div>
        </motion.div>
        <motion.div
          className="bg-gray-50 rounded-lg p-2"
          whileHover={{ y: -2 }}
         />
          <div className="text-lg font-bold text-gray-900"></div>
            {(
              (playerStats.wins / (playerStats.wins + playerStats.losses)) *
                100 || 0
            ).toFixed(1)}
            %
          </div>
          <div className="text-xs text-gray-500">Win Rate</div>
        </motion.div>
      </div>

      <div className="pt-2 space-y-2"></div>
        <div className="flex items-center justify-between text-sm"></div>
          <div className="flex items-center space-x-1"></div>
            <Flame className="w-4 h-4 text-orange-500" / />
            <span>Current Streak</span>
          <div className="flex items-center space-x-1"></div>
            {getTrendIcon(playerStats.streak)}
            <span className="font-medium">{Math.abs(playerStats.streak)}
          </div>
        <div className="flex items-center justify-between text-sm"></div>
          <div className="flex items-center space-x-1"></div>
            <Trophy className="w-4 h-4 text-yellow-500" / />
            <span>Best Rank</span>
          <span className="font-medium">{playerStats.bestRank}
        </div>
        <div className="flex items-center justify-between text-sm"></div>
          <div className="flex items-center space-x-1"></div>
            <Target className="w-4 h-4 text-blue-500" / />
            <span>Season Highest</span>
          <span className="font-medium">{playerStats.seasonHighest} MMR</span>
        <div className="flex items-center justify-between text-sm"></div>
          <div className="flex items-center space-x-1"></div>
            <Award className="w-4 h-4 text-purple-500" / />
            <span>Matches Played</span>
          <span className="font-medium">{playerStats.matchesPlayed}
        </div>

      {playerStats.seasonRewards && playerStats.seasonRewards.length > 0 && (
        <div className="pt-2 border-t border-gray-100"></div>
          <div className="text-sm font-medium text-gray-700 mb-2"></div>
            Season Rewards Progress
          </div>
          <div className="flex space-x-2"></div>
            {playerStats.seasonRewards.map((reward, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  reward.unlocked
                    ? 'bg-gradient-to-br from-green-400 to-green-600 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
               />
                {reward.icon || <Star className="w-4 h-4" />}
            ))}
          </div>
      )}
    </div>
  );
};

export default MatchmakingStats;