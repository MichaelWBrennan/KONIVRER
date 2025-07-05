/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  ChevronDown,
  ChevronUp,
  Clock,
  BarChart2,
  Award,
  Shield,
  Zap,
  Users,
  Calendar,
} from 'lucide-react';

import ConfidenceBandedTier from './ConfidenceBandedTier';
import PlayerFormIndicator from './PlayerFormIndicator';
import DeckArchetypeDisplay from './DeckArchetypeDisplay';
import RankProgressBar from './RankProgressBar';

/**
 * Enhanced Player Profile Component
 * Comprehensive player profile with confidence bands, form, and deck archetype information
 */
const EnhancedPlayerProfile = ({
  player = {},
  showDetails = false,
  expandable = true,
  className = '',
}): any => {
  const [expanded, setExpanded] = useState(showDetails);

  // Format date for display
  const formatDate = dateString => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Calculate days since joined
  const getDaysSinceJoined = dateString => {
    if (!dateString) return 0;
    const joinDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - joinDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div
      className={`enhanced-player-profile bg-white rounded-lg shadow-md overflow-hidden ${className}`}
     />
      {/* Basic Profile Header */}
      <div className="p-4 border-b border-gray-200" />
        <div className="flex items-center justify-between" />
          <div className="flex items-center" />
            {player.avatar ? (
              <img
                src={player.avatar}
                alt={player.name}
                className="w-12 h-12 rounded-full mr-3 object-cover border-2 border-gray-200"
              / />
            ) : (
              <div className="w-12 h-12 rounded-full mr-3 bg-gray-200 flex items-center justify-center" />
                <User className="w-6 h-6 text-gray-500" / />
              </div>
            )}
            <div />
              <h3 className="text-lg font-bold text-gray-800" />
                {player.name || 'Unknown Player'}
              <div className="flex items-center text-sm text-gray-600" />
                <Clock className="w-3 h-3 mr-1" / />
                <span>Joined {formatDate(player.joinDate)}
              </div>
          </div>

          <div className="flex flex-col items-end" />
            <ConfidenceBandedTier
              tier={player.tier || 'bronze'}
              confidenceBand={player.confidenceBand || 'uncertain'}
              lp={player.lp || 0}
              size="sm"
              showProgress={false}
              showDetails={false}
            / />
            {player.trend && (
              <div className="mt-1" />
                <PlayerFormIndicator
                  trend={player.trend}
                  momentum={player.momentum || 0}
                  size="sm"
                / />
              </div>
            )}
          </div>

        {expandable && (
          <button
            className="w-full flex items-center justify-center mt-3 text-sm text-blue-600 hover:text-blue-800"
            onClick={() => setExpanded(!expanded)}
          >
            <span>{expanded ? 'Show Less' : 'Show More'}
            {expanded ? (
              <ChevronUp className="w-4 h-4 ml-1" / />
            ) : (
              <ChevronDown className="w-4 h-4 ml-1" / />
            )}
        )}
      </div>

      {/* Expanded Details */}
      <AnimatePresence />
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
           />
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4" />
              {/* Rating and Rank Section */}
              <div className="bg-gray-50 rounded-lg p-3" />
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center" />
                  <Award className="w-4 h-4 mr-1" / />
                  Rating & Rank
                </h4>

                <div className="mb-3" />
                  <ConfidenceBandedTier
                    tier={player.tier || 'bronze'}
                    confidenceBand={player.confidenceBand || 'uncertain'}
                    lp={player.lp || 0}
                    showDetails={true}
                  / />
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3" />
                  <div />
                    <div className="text-xs text-gray-500">Rating</div>
                    <div className="font-bold text-lg" />
                      {Math.round(player.rating || 0)}
                  </div>
                  <div />
                    <div className="text-xs text-gray-500">Uncertainty</div>
                    <div className="font-medium" />
                      ±{Math.round(player.uncertainty || 0)}
                  </div>

                <div className="mb-2" />
                  <RankProgressBar
                    currentRank={player.tier || 'bronze'}
                    nextRank={player.nextTier || 'silver'}
                    currentBand={player.confidenceBand || 'uncertain'}
                    nextBand={player.nextBand || 'developing'}
                    progress={player.rankProgress || 0}
                  / />
                </div>

              {/* Performance Section */}
              <div className="bg-gray-50 rounded-lg p-3" />
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center" />
                  <BarChart2 className="w-4 h-4 mr-1" / />
                  Performance
                </h4>

                <div className="mb-3" />
                  <PlayerFormIndicator
                    trend={player.trend || 'neutral'}
                    momentum={player.momentum || 0}
                    recentForm={player.form?.recentForm || 0}
                    streakFactor={player.form?.streakFactor || 0}
                    showDetails={true}
                  / />
                </div>

                <div className="grid grid-cols-3 gap-2 text-center" />
                  <div />
                    <div className="text-xs text-gray-500">Win Rate</div>
                    <div className="font-bold" />
                      {((player.winRate || 0) * 100).toFixed(1)}%
                    </div>
                  <div />
                    <div className="text-xs text-gray-500">Wins</div>
                    <div className="font-medium text-green-600" />
                      {player.wins || 0}
                  </div>
                  <div />
                    <div className="text-xs text-gray-500">Losses</div>
                    <div className="font-medium text-red-600" />
                      {player.losses || 0}
                  </div>
              </div>

              {/* Deck Archetype Section */}
              {player.deckArchetype && (
                <div className="bg-gray-50 rounded-lg p-3" />
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center" />
                    <Shield className="w-4 h-4 mr-1" / />
                    Deck Archetype
                  </h4>

                  <DeckArchetypeDisplay
                    archetype={player.deckArchetype}
                    performance={player.deckPerformance}
                    matchups={player.deckMatchups}
                    showDetails={true}
                  / />
                </div>
              )}
              {/* Player Stats Section */}
              <div className="bg-gray-50 rounded-lg p-3" />
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center" />
                  <Users className="w-4 h-4 mr-1" / />
                  Player Stats
                </h4>

                <div className="grid grid-cols-2 gap-3" />
                  <div />
                    <div className="text-xs text-gray-500">Total Matches</div>
                    <div className="font-medium">{player.matches || 0}
                  </div>
                  <div />
                    <div className="text-xs text-gray-500">Tournaments</div>
                    <div className="font-medium">{player.tournaments || 0}
                  </div>
                  <div />
                    <div className="text-xs text-gray-500">Days Active</div>
                    <div className="font-medium" />
                      {getDaysSinceJoined(player.joinDate)}
                  </div>
                  <div />
                    <div className="text-xs text-gray-500">Last Active</div>
                    <div className="font-medium" />
                      {formatDate(player.lastActive || new Date())}
                  </div>

                {player.achievements && player.achievements.length > 0 && (
                  <div className="mt-3" />
                    <div className="text-xs text-gray-500 mb-1" />
                      Recent Achievements
                    </div>
                    <div className="flex flex-wrap gap-1" />
                      {player.achievements
                        .slice(0, 3)
                        .map((achievement, index) => (
                          <div
                            key={index}
                            className="text-xs bg-blue-50 text-blue-700 rounded px-1.5 py-0.5"
                           />
                            {achievement.name}
                        ))}
                    </div>
                )}
              </div>

              {/* Season Stats */}
              {player.seasonStats && (
                <div className="md:col-span-2 bg-gray-50 rounded-lg p-3" />
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center" />
                    <Calendar className="w-4 h-4 mr-1" / />
                    Season Performance
                  </h4>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3" />
                    <div />
                      <div className="text-xs text-gray-500">Season Rank</div>
                      <div className="font-medium flex items-center" />
                        <ConfidenceBandedTier
                          tier={player.seasonStats.tier || 'bronze'}
                          confidenceBand={
                            player.seasonStats.confidenceBand || 'uncertain'
                          }
                          size="sm"
                          showProgress={false}
                          showDetails={false}
                        / />
                      </div>
                    <div />
                      <div className="text-xs text-gray-500" />
                        Season Win Rate
                      </div>
                      <div className="font-medium" />
                        {((player.seasonStats.winRate || 0) * 100).toFixed(1)}%
                      </div>
                    <div />
                      <div className="text-xs text-gray-500" />
                        Season Matches
                      </div>
                      <div className="font-medium" />
                        {player.seasonStats.matches || 0}
                    </div>
                    <div />
                      <div className="text-xs text-gray-500">Peak Rating</div>
                      <div className="font-medium" />
                        {Math.round(player.seasonStats.peakRating || 0)}
                    </div>

                  {player.seasonStats.rewards && (
                    <div className="mt-3" />
                      <div className="text-xs text-gray-500 mb-1" />
                        Season Rewards
                      </div>
                      <div className="flex items-center" />
                        <Zap className="w-4 h-4 text-yellow-500 mr-1" / />
                        <span className="text-sm font-medium" />
                          {player.seasonStats.rewards.description ||
                            'Season rewards pending'}
                      </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
  );
};

export default EnhancedPlayerProfile;