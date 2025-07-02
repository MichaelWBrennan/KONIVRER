/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Users,
  Clock,
  Settings,
  ChevronDown,
  ChevronUp,
  Zap,
  Shield,
  BarChart2,
  RefreshCw,
  X,
  Check,
} from 'lucide-react';

import { usePhysicalMatchmaking } from '../contexts/PhysicalMatchmakingContext';
import EnhancedPlayerProfile from '../components/matchmaking/EnhancedPlayerProfile';
import ConfidenceBandedTier from '../components/matchmaking/ConfidenceBandedTier';
import DeckArchetypeDisplay from '../components/matchmaking/DeckArchetypeDisplay';
import PlayerFormIndicator from '../components/matchmaking/PlayerFormIndicator';

/**
 * Enhanced Matchmaking Page
 * Advanced matchmaking with multi-factor considerations
 */
const EnhancedMatchmaking = () => {
  const { rankingEngine } = usePhysicalMatchmaking();

  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [matchmakingPreferences, setMatchmakingPreferences] = useState({
    prioritizeSkill: true,
    prioritizeConfidence: true,
    prioritizeDeckArchetype: true,
    prioritizePlaystyle: true,
    preferComplementaryPlaystyles: true,
    preferSimilarConfidence: true,
    maxWaitTime: 60, // seconds
  });
  const [showPreferences, setShowPreferences] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    tier: 'all',
    confidenceBand: 'all',
    deckArchetype: 'all',
    minRating: 0,
    maxRating: 3000,
  });

  // Fetch players
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        // In a real app, this would come from your API
        const playersData = await rankingEngine.getPlayers();
        setPlayers(playersData);
        setFilteredPlayers(playersData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching players:', error);
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [rankingEngine]);

  // Apply filters
  useEffect(() => {
    if (!players.length) return;

    let result = [...players];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        player =>
          player.name.toLowerCase().includes(query) ||
          (player.deckArchetype &&
            player.deckArchetype.toLowerCase().includes(query)),
      );
    }

    // Apply tier filter
    if (filterOptions.tier !== 'all') {
      result = result.filter(player => player.tier === filterOptions.tier);
    }

    // Apply confidence band filter
    if (filterOptions.confidenceBand !== 'all') {
      result = result.filter(
        player => player.confidenceBand === filterOptions.confidenceBand,
      );
    }

    // Apply deck archetype filter
    if (filterOptions.deckArchetype !== 'all') {
      result = result.filter(
        player =>
          player.deckArchetype &&
          player.deckArchetype.includes(filterOptions.deckArchetype),
      );
    }

    // Apply rating range filter
    result = result.filter(
      player =>
        player.rating >= filterOptions.minRating &&
        player.rating <= filterOptions.maxRating,
    );

    setFilteredPlayers(result);
  }, [players, searchQuery, filterOptions]);

  // Simulate finding a match
  const findMatch = () => {
    if (!players.length) return;

    setSearching(true);

    // Simulate API call delay
    setTimeout(() => {
      // In a real app, this would use the MultiFactorMatchmaking module
      const currentPlayer = players[0]; // Assume first player is current user

      // Filter out current player
      const candidates = players.filter(p => p.id !== currentPlayer.id);

      if (candidates.length === 0) {
        setSearching(false);
        return;
      }

      // Simple matching algorithm (would be replaced by actual multi-factor algorithm)
      const calculateMatchQuality = player => {
        const skillDiff = Math.abs(currentPlayer.rating - player.rating);
        const skillScore = Math.max(0, 1 - skillDiff / 400);

        // Confidence band similarity
        const confidenceBandOrder = [
          'uncertain',
          'developing',
          'established',
          'proven',
        ];
        const currentBandIndex = confidenceBandOrder.indexOf(
          currentPlayer.confidenceBand,
        );
        const playerBandIndex = confidenceBandOrder.indexOf(
          player.confidenceBand,
        );
        const bandDiff = Math.abs(currentBandIndex - playerBandIndex);
        const confidenceScore = matchmakingPreferences.preferSimilarConfidence
          ? Math.max(0, 1 - bandDiff / 3)
          : Math.max(0, bandDiff / 3);

        // Deck archetype compatibility
        let archetypeScore = 0.5;
        if (currentPlayer.deckArchetype && player.deckArchetype) {
          // Simple archetype matching (would be more sophisticated in real app)
          archetypeScore =
            currentPlayer.deckArchetype === player.deckArchetype ? 0.3 : 0.7;
        }

        // Calculate weighted score
        let score = 0;
        let totalWeight = 0;

        if (matchmakingPreferences.prioritizeSkill) {
          score += skillScore * 0.4;
          totalWeight += 0.4;
        }

        if (matchmakingPreferences.prioritizeConfidence) {
          score += confidenceScore * 0.3;
          totalWeight += 0.3;
        }

        if (matchmakingPreferences.prioritizeDeckArchetype) {
          score += archetypeScore * 0.3;
          totalWeight += 0.3;
        }

        return totalWeight > 0 ? score / totalWeight : 0;
      };

      // Find best match
      const matches = candidates.map(player => ({
        player,
        quality: calculateMatchQuality(player),
      }));

      matches.sort((a, b) => b.quality - a.quality);

      // Select best match
      const bestMatch = matches[0];

      setCurrentMatch({
        player1: currentPlayer,
        player2: bestMatch.player,
        quality: bestMatch.quality,
        matchupDetails: {
          skillDifference: Math.abs(
            currentPlayer.rating - bestMatch.player.rating,
          ),
          confidenceBandMatch:
            currentPlayer.confidenceBand === bestMatch.player.confidenceBand,
          archetypeMatchup: `${currentPlayer.deckArchetype || 'Unknown'} vs ${bestMatch.player.deckArchetype || 'Unknown'}`,
          estimatedWinRate: 0.5, // Would be calculated from actual matchup data
        },
      });

      setSearching(false);
    }, 2000);
  };

  // Cancel current match
  const cancelMatch = () => {
    setCurrentMatch(null);
  };

  // Accept current match
  const acceptMatch = () => {
    // In a real app, this would create the match in your backend
    alert('Match accepted! Players will be notified.');
    setCurrentMatch(null);
  };

  // Get available deck archetypes
  const getDeckArchetypes = () => {
    if (!players.length) return ['Unknown'];

    const archetypes = new Set();
    players.forEach(player => {
      if (player.deckArchetype) {
        archetypes.add(player.deckArchetype);
      }
    });

    return ['all', ...Array.from(archetypes)];
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Enhanced Matchmaking
          </h1>
          <p className="text-gray-600 mt-2">
            Find matches based on skill, confidence, deck archetype, and
            playstyle
          </p>
        </div>

        {/* Matchmaking Controls */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search players..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={findMatch}
                disabled={searching}
              >
                {searching ? (
                  <>
                    <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Finding Match...
                  </>
                ) : (
                  <>
                    <Zap className="-ml-1 mr-2 h-4 w-4" />
                    Find Match
                  </>
                )}
              </button>

              <button
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setShowPreferences(!showPreferences)}
              >
                <Settings className="-ml-0.5 mr-2 h-4 w-4" />
                Preferences
                {showPreferences ? (
                  <ChevronUp className="ml-2 h-4 w-4" />
                ) : (
                  <ChevronDown className="ml-2 h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Preferences Panel */}
          <AnimatePresence>
            {showPreferences && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Matchmaking Preferences
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Priority Factors
                      </h4>

                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={matchmakingPreferences.prioritizeSkill}
                            onChange={e =>
                              setMatchmakingPreferences({
                                ...matchmakingPreferences,
                                prioritizeSkill: e.target.checked,
                              })
                            }
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Prioritize skill rating similarity
                          </span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={
                              matchmakingPreferences.prioritizeConfidence
                            }
                            onChange={e =>
                              setMatchmakingPreferences({
                                ...matchmakingPreferences,
                                prioritizeConfidence: e.target.checked,
                              })
                            }
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Prioritize confidence band matching
                          </span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={
                              matchmakingPreferences.prioritizeDeckArchetype
                            }
                            onChange={e =>
                              setMatchmakingPreferences({
                                ...matchmakingPreferences,
                                prioritizeDeckArchetype: e.target.checked,
                              })
                            }
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Consider deck archetype matchups
                          </span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={matchmakingPreferences.prioritizePlaystyle}
                            onChange={e =>
                              setMatchmakingPreferences({
                                ...matchmakingPreferences,
                                prioritizePlaystyle: e.target.checked,
                              })
                            }
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Consider playstyle compatibility
                          </span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Matching Preferences
                      </h4>

                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={
                              matchmakingPreferences.preferComplementaryPlaystyles
                            }
                            onChange={e =>
                              setMatchmakingPreferences({
                                ...matchmakingPreferences,
                                preferComplementaryPlaystyles: e.target.checked,
                              })
                            }
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Prefer complementary playstyles
                          </span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={
                              matchmakingPreferences.preferSimilarConfidence
                            }
                            onChange={e =>
                              setMatchmakingPreferences({
                                ...matchmakingPreferences,
                                preferSimilarConfidence: e.target.checked,
                              })
                            }
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Prefer similar confidence bands
                          </span>
                        </label>

                        <div>
                          <label className="block text-sm text-gray-700 mb-1">
                            Maximum wait time
                          </label>
                          <div className="flex items-center">
                            <input
                              type="range"
                              min="10"
                              max="300"
                              step="10"
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                              value={matchmakingPreferences.maxWaitTime}
                              onChange={e =>
                                setMatchmakingPreferences({
                                  ...matchmakingPreferences,
                                  maxWaitTime: parseInt(e.target.value),
                                })
                              }
                            />
                            <span className="ml-2 text-sm text-gray-700 min-w-[50px]">
                              {matchmakingPreferences.maxWaitTime}s
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Current Match */}
        <AnimatePresence>
          {currentMatch && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <div className="bg-blue-50 border border-blue-200 rounded-lg shadow-md p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-blue-800">
                    Match Found!
                  </h3>
                  <div className="flex items-center">
                    <span className="text-sm text-blue-700 mr-2">
                      Match Quality: {Math.round(currentMatch.quality * 100)}%
                    </span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-blue-600"
                        style={{ width: `${currentMatch.quality * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <EnhancedPlayerProfile player={currentMatch.player1} />
                  <EnhancedPlayerProfile player={currentMatch.player2} />
                </div>

                <div className="bg-white rounded-lg p-3 mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Matchup Details
                  </h4>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <div className="text-gray-500">Skill Difference</div>
                      <div className="font-medium">
                        {currentMatch.matchupDetails.skillDifference} points
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Confidence Match</div>
                      <div className="font-medium">
                        {currentMatch.matchupDetails.confidenceBandMatch ? (
                          <span className="text-green-600">Same band</span>
                        ) : (
                          <span className="text-orange-600">
                            Different bands
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Archetype Matchup</div>
                      <div className="font-medium">
                        {currentMatch.matchupDetails.archetypeMatchup}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Est. Win Probability</div>
                      <div className="font-medium">
                        {(
                          currentMatch.matchupDetails.estimatedWinRate * 100
                        ).toFixed(1)}
                        %
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    onClick={cancelMatch}
                  >
                    <X className="-ml-1 mr-2 h-4 w-4 text-gray-500" />
                    Decline
                  </button>

                  <button
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    onClick={acceptMatch}
                  >
                    <Check className="-ml-1 mr-2 h-4 w-4" />
                    Accept Match
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center mb-3">
            <Filter className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Filters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tier
              </label>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={filterOptions.tier}
                onChange={e =>
                  setFilterOptions({
                    ...filterOptions,
                    tier: e.target.value,
                  })
                }
              >
                <option value="all">All Tiers</option>
                <option value="bronze">Bronze</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
                <option value="platinum">Platinum</option>
                <option value="diamond">Diamond</option>
                <option value="master">Master</option>
                <option value="grandmaster">Grandmaster</option>
                <option value="mythic">Mythic</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confidence Band
              </label>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={filterOptions.confidenceBand}
                onChange={e =>
                  setFilterOptions({
                    ...filterOptions,
                    confidenceBand: e.target.value,
                  })
                }
              >
                <option value="all">All Bands</option>
                <option value="uncertain">Uncertain</option>
                <option value="developing">Developing</option>
                <option value="established">Established</option>
                <option value="proven">Proven</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deck Archetype
              </label>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={filterOptions.deckArchetype}
                onChange={e =>
                  setFilterOptions({
                    ...filterOptions,
                    deckArchetype: e.target.value,
                  })
                }
              >
                {getDeckArchetypes().map(archetype => (
                  <option key={archetype} value={archetype}>
                    {archetype}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating Range
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  max={filterOptions.maxRating}
                  className="block w-full pl-3 pr-3 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filterOptions.minRating}
                  onChange={e =>
                    setFilterOptions({
                      ...filterOptions,
                      minRating: parseInt(e.target.value),
                    })
                  }
                />
                <span className="text-gray-500">to</span>
                <input
                  type="number"
                  min={filterOptions.minRating}
                  max="3000"
                  className="block w-full pl-3 pr-3 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filterOptions.maxRating}
                  onChange={e =>
                    setFilterOptions({
                      ...filterOptions,
                      maxRating: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Player List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">
                Available Players
              </h3>
            </div>
            <div className="text-sm text-gray-500">
              {filteredPlayers.length} players found
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <RefreshCw className="animate-spin h-8 w-8 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Loading players...</p>
            </div>
          ) : filteredPlayers.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="h-8 w-8 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                No players found matching your filters.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredPlayers.map(player => (
                <div
                  key={player.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <EnhancedPlayerProfile player={player} expandable={true} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedMatchmaking;
