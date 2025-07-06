import { motion } from 'framer-motion';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React from 'react';
import {
  Swords,
  Shield,
  Zap,
  Puzzle,
  BarChart,
  TrendingUp,
  TrendingDown,
  Info,
} from 'lucide-react';

/**
 * Deck Archetype Display Component
 * Shows information about a player's deck archetype and performance
 */
const DeckArchetypeDisplay = ({
  archetype,
  performance = {}
  matchups = {}
  showDetails = false,
  size = 'md',
}): any => {
  // Get icon based on archetype
  const getArchetypeIcon = type => {
    const archetypeType = type?.toLowerCase() || '';

    if (archetypeType.includes('aggro'))
      return <Swords className="text-red-500" />;
    if (archetypeType.includes('control'))
      return <Shield className="text-blue-500" />;
    if (archetypeType.includes('combo'))
      return <Puzzle className="text-purple-500" />;
    if (archetypeType.includes('midrange'))
      return <BarChart className="text-green-500" />;
    if (archetypeType.includes('tempo'))
      return <Zap className="text-yellow-500" />;
    return <Info className="text-gray-500" />;
  };

  // Get color based on archetype
  const getArchetypeColor = type => {
    const archetypeType = type?.toLowerCase() || '';

    if (archetypeType.includes('aggro'))
      return 'bg-red-100 text-red-800 border-red-200';
    if (archetypeType.includes('control'))
      return 'bg-blue-100 text-blue-800 border-blue-200';
    if (archetypeType.includes('combo'))
      return 'bg-purple-100 text-purple-800 border-purple-200';
    if (archetypeType.includes('midrange'))
      return 'bg-green-100 text-green-800 border-green-200';
    if (archetypeType.includes('tempo'))
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Size classes
  const sizeClasses = {
    sm: {
      container: 'text-xs px-1.5 py-0.5',
      icon: 'w-3 h-3',
      chart: 'h-4',
    },
    md: {
      container: 'text-sm px-2 py-1',
      icon: 'w-4 h-4',
      chart: 'h-5',
    },
    lg: {
      container: 'text-base px-3 py-1.5',
      icon: 'w-5 h-5',
      chart: 'h-6',
    },
  };

  const classes = sizeClasses[size] || sizeClasses.md;

  // Format win rate for display
  const formatWinRate = value => {
    if (!value && value !== 0) return 'N/A';
    return `${(value * 100).toFixed(0)}%`;
  };

  // Get top matchups (best and worst)
  const getTopMatchups = (): any => {
    if (!matchups) return { favorable: [], unfavorable: [] };
    const matchupEntries = Object.entries(matchups);
    if (matchupEntries.length === 0) return { favorable: [], unfavorable: [] };
    // Sort by win rate
    const sortedMatchups = [...matchupEntries].sort((a, b) => b[1] - a[1]);

    return {
      favorable: sortedMatchups.slice(0, 3).filter(m => m[1] > 0.5),
      unfavorable: sortedMatchups
        .reverse()
        .slice(0, 3)
        .filter(m => m[1] < 0.5),
    };
  };

  const topMatchups = getTopMatchups();

  return (
    <>
      <div className="deck-archetype-display"></div>
      <div
        className={`inline-flex items-center rounded-full border ${getArchetypeColor(archetype)} ${classes.container}`}></div>
      <span className={`mr-1 ${classes.icon}`}></span>
      <span className="font-medium">{archetype || 'Unknown Archetype'}
      </div>
      <motion.div
          className="mt-2 bg-white rounded-lg border border-gray-200 p-3 shadow-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
         />
          <div className="flex items-center justify-between mb-2"></div>
      <span className="text-sm font-medium text-gray-700"></span>
      </span>
            <span className="text-sm font-medium text-gray-700"></span>
      </span>

          <div className="flex items-center mb-3"></div>
      <div className="flex-1"></div>
      <div className="text-xs text-gray-500 mb-1">Win Rate</div>
      <div className="w-full bg-gray-200 rounded-full overflow-hidden"></div>
      <div
                  className={`${classes.chart} rounded-full ${performance.winRate > 0.5 ? 'bg-green-500' : performance.winRate < 0.5 ? 'bg-red-500' : 'bg-yellow-500'}`}
                  style={{ width: `${(performance.winRate || 0) * 100}%` }}
                ></div>
      </div>
            <div className="ml-3 text-lg font-bold"></div>
      </div>

          {/* Matchup Analysis */}
          {(topMatchups.favorable.length > 0 ||
            topMatchups.unfavorable.length > 0) && (
            <div className="mt-3"></div>
      <div className="text-sm font-medium text-gray-700 mb-2"></div>
      </div>

              {topMatchups.favorable.length > 0 && (
                <div className="mb-2"></div>
      <div className="flex items-center text-xs text-green-600 mb-1"></div>
      <TrendingUp className="w-3 h-3 mr-1" />
                    <span>Favorable Matchups</span>
      <div className="grid grid-cols-3 gap-1"></div>
      <div
                        key={archetype}
                        className="text-xs bg-green-50 rounded px-1 py-0.5 truncate"></div>
      <span className="font-medium">{archetype}
                        <span className="text-green-700 ml-1"></span>
    </>
  ))}
                  </div>
              )}
              {topMatchups.unfavorable.length > 0 && (
                <div></div>
                  <div className="flex items-center text-xs text-red-600 mb-1"></div>
                    <TrendingDown className="w-3 h-3 mr-1" />
                    <span>Unfavorable Matchups</span>
                  <div className="grid grid-cols-3 gap-1"></div>
                    {topMatchups.unfavorable.map(([archetype, winRate]) => (
                      <div
                        key={archetype}
                        className="text-xs bg-red-50 rounded px-1 py-0.5 truncate"></div>
                        <span className="font-medium">{archetype}
                        <span className="text-red-700 ml-1"></span>
                          {formatWinRate(winRate)}
                      </div>
                    ))}
                  </div>
              )}
            </div>
          )}
          {/* Playstyle Indicators */}
          {performance.playstyle && (
            <div className="mt-3"></div>
              <div className="text-xs text-gray-500 mb-1"></div>
                Playstyle Indicators
              </div>
              <div className="grid grid-cols-3 gap-2"></div>
                <div></div>
                  <div className="text-xs text-gray-500">Aggression</div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1"></div>
                    <div
                      className="h-1.5 rounded-full bg-red-500"
                      style={{
                        width: `${(performance.playstyle.aggression || 0) * 100}%`,
                      }}></div>
                  </div>
                <div></div>
                  <div className="text-xs text-gray-500">Consistency</div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1"></div>
                    <div
                      className="h-1.5 rounded-full bg-blue-500"
                      style={{
                        width: `${(performance.playstyle.consistency || 0) * 100}%`,
                      }}></div>
                  </div>
                <div></div>
                  <div className="text-xs text-gray-500">Complexity</div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1"></div>
                    <div
                      className="h-1.5 rounded-full bg-purple-500"
                      style={{
                        width: `${(performance.playstyle.complexity || 0) * 100}%`,
                      }}></div>
                  </div>
              </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default DeckArchetypeDisplay;