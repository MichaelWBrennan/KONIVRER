<<<<<<< HEAD
import React from 'react';
import {
  TrendingUp,
  Users,
  Trophy,
  Target,
  Calendar,
  MapPin,
  Award,
} from 'lucide-react';
import { motion } from 'framer-motion';

const TournamentMetaAnalysis = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-lg p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-xl flex items-center justify-center">
            <Trophy className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Tournament Statistics</h2>
            <p className="text-sm text-secondary">
              Competitive play insights and trends
            </p>
=======

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const TournamentMetaAnalysis = ({ tournaments, matches, players }) => {
  const [metaData, setMetaData] = useState(null);
  const [timeframe, setTimeframe] = useState('week'); // week, month, season
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyzeMetaData();
  }, [tournaments, matches, timeframe]);

  const analyzeMetaData = () => {
    setLoading(true);
    
    try {
      // Filter matches based on timeframe
      const cutoffDate = new Date();
      switch (timeframe) {
        case 'week':
          cutoffDate.setDate(cutoffDate.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(cutoffDate.getMonth() - 1);
          break;
        case 'season':
          cutoffDate.setMonth(cutoffDate.getMonth() - 3);
          break;
        default:
          cutoffDate.setDate(cutoffDate.getDate() - 7);
      }

      const recentMatches = matches.filter(match => 
        new Date(match.date) >= cutoffDate
      );

      // Analyze deck archetypes
      const archetypeStats = {};
      const matchupMatrix = {};

      recentMatches.forEach(match => {
        if (!match.player1Deck || !match.player2Deck) return;

        const deck1 = match.player1Deck;
        const deck2 = match.player2Deck;

        // Initialize archetype stats
        if (!archetypeStats[deck1]) {
          archetypeStats[deck1] = { 
            name: deck1, 
            matches: 0, 
            wins: 0, 
            losses: 0, 
            winRate: 0,
            metaShare: 0,
            trend: 'stable'
          };
        }
        if (!archetypeStats[deck2]) {
          archetypeStats[deck2] = { 
            name: deck2, 
            matches: 0, 
            wins: 0, 
            losses: 0, 
            winRate: 0,
            metaShare: 0,
            trend: 'stable'
          };
        }

        // Count matches
        archetypeStats[deck1].matches++;
        archetypeStats[deck2].matches++;

        // Count wins/losses
        if (match.result === 'player1') {
          archetypeStats[deck1].wins++;
          archetypeStats[deck2].losses++;
        } else if (match.result === 'player2') {
          archetypeStats[deck2].wins++;
          archetypeStats[deck1].losses++;
        }

        // Build matchup matrix
        const matchupKey = [deck1, deck2].sort().join(' vs ');
        if (!matchupMatrix[matchupKey]) {
          matchupMatrix[matchupKey] = {
            deck1: deck1 < deck2 ? deck1 : deck2,
            deck2: deck1 < deck2 ? deck2 : deck1,
            deck1Wins: 0,
            deck2Wins: 0,
            totalGames: 0
          };
        }

        matchupMatrix[matchupKey].totalGames++;
        if (match.result === 'player1') {
          if (deck1 < deck2) {
            matchupMatrix[matchupKey].deck1Wins++;
          } else {
            matchupMatrix[matchupKey].deck2Wins++;
          }
        } else if (match.result === 'player2') {
          if (deck2 < deck1) {
            matchupMatrix[matchupKey].deck1Wins++;
          } else {
            matchupMatrix[matchupKey].deck2Wins++;
          }
        }
      });

      // Calculate percentages and trends
      const totalMatches = recentMatches.length;
      const archetypes = Object.values(archetypeStats).map(archetype => ({
        ...archetype,
        winRate: archetype.matches > 0 ? (archetype.wins / archetype.matches) * 100 : 0,
        metaShare: archetype.matches > 0 ? (archetype.matches / (totalMatches * 2)) * 100 : 0,
        trend: calculateTrend(archetype.name, recentMatches)
      }));

      // Sort by meta share
      archetypes.sort((a, b) => b.metaShare - a.metaShare);

      setMetaData({
        archetypes: archetypes.slice(0, 10), // Top 10
        matchupMatrix: Object.values(matchupMatrix).filter(m => m.totalGames >= 3),
        totalMatches: recentMatches.length,
        uniqueDecks: archetypes.length,
        timeframe
      });

    } catch (error) {
      console.error('Error analyzing meta data:', error);
      setMetaData(null);
    } finally {
      setLoading(false);
    }
  };

  const calculateTrend = (deckName, matches) => {
    const deckMatches = matches
      .filter(m => m.player1Deck === deckName || m.player2Deck === deckName)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (deckMatches.length < 10) return 'stable';

    const midPoint = Math.floor(deckMatches.length / 2);
    const firstHalf = deckMatches.slice(0, midPoint);
    const secondHalf = deckMatches.slice(midPoint);

    const firstHalfWinRate = calculateWinRateForDeck(deckName, firstHalf);
    const secondHalfWinRate = calculateWinRateForDeck(deckName, secondHalf);

    const difference = secondHalfWinRate - firstHalfWinRate;
    
    if (difference > 5) return 'rising';
    if (difference < -5) return 'falling';
    return 'stable';
  };

  const calculateWinRateForDeck = (deckName, matches) => {
    const deckMatches = matches.filter(m => 
      m.player1Deck === deckName || m.player2Deck === deckName
    );
    
    const wins = deckMatches.filter(m => 
      (m.player1Deck === deckName && m.result === 'player1') ||
      (m.player2Deck === deckName && m.result === 'player2')
    ).length;

    return deckMatches.length > 0 ? (wins / deckMatches.length) * 100 : 0;
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'rising':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'falling':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'rising':
        return 'text-green-600';
      case 'falling':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="bg-card rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-tertiary rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-tertiary rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!metaData) {
    return (
      <div className="bg-card rounded-lg p-6 text-center">
        <BarChart3 className="w-12 h-12 mx-auto mb-4 text-secondary" />
        <h3 className="text-lg font-semibold mb-2">No Meta Data Available</h3>
        <p className="text-secondary">Not enough tournament data to analyze the current meta.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Meta Analysis
          </h2>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-1 border border-color rounded bg-background"
          >
            <option value="week">Past Week</option>
            <option value="month">Past Month</option>
            <option value="season">Past Season</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{metaData.totalMatches}</div>
            <div className="text-sm text-secondary">Total Matches</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{metaData.uniqueDecks}</div>
            <div className="text-sm text-secondary">Unique Decks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {metaData.archetypes.length > 0 ? metaData.archetypes[0].metaShare.toFixed(1) : 0}%
            </div>
            <div className="text-sm text-secondary">Top Deck Share</div>
>>>>>>> af774a41 (Initial commit)
          </div>
        </div>
      </div>

<<<<<<< HEAD
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-background border border-color rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Users className="text-white" size={20} />
            </div>
            <div>
              <p className="text-xs text-secondary">Active Players</p>
              <p className="text-xl font-bold">3,247</p>
              <p className="text-xs text-green-500 flex items-center gap-1">
                <TrendingUp size={10} />
                +12.3%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-background border border-color rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Trophy className="text-white" size={20} />
            </div>
            <div>
              <p className="text-xs text-secondary">Tournaments</p>
              <p className="text-xl font-bold">95</p>
              <p className="text-xs text-green-500 flex items-center gap-1">
                <TrendingUp size={10} />
                +8.7%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-background border border-color rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Award className="text-white" size={20} />
            </div>
            <div>
              <p className="text-xs text-secondary">Prize Pool</p>
              <p className="text-xl font-bold">$24,750</p>
              <p className="text-xs text-blue-500 flex items-center gap-1">
                <TrendingUp size={10} />
                +15.2%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Tournaments */}
      <div className="bg-background border border-color rounded-xl p-4">
        <h3 className="text-lg font-bold mb-4">Upcoming Tournaments</h3>
        <div className="space-y-3">
          {[
            {
              name: 'KONIVRER Championship Series',
              date: 'June 25, 2025',
              location: 'Online',
              players: 128,
              prizePool: '$5,000',
            },
            {
              name: 'Regional Qualifier',
              date: 'July 2, 2025',
              location: 'New York, NY',
              players: 64,
              prizePool: '$2,500',
            },
            {
              name: 'Community Cup',
              date: 'July 10, 2025',
              location: 'Online',
              players: 256,
              prizePool: '$1,000',
            },
          ].map((tournament, index) => (
            <div
              key={index}
              className="border border-color rounded-lg p-3 hover:bg-tertiary transition-all duration-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-sm">{tournament.name}</h4>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1 text-xs text-secondary">
                      <Calendar className="w-3 h-3" />
                      <span>{tournament.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-secondary">
                      <MapPin className="w-3 h-3" />
                      <span>{tournament.location}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium">
                    {tournament.prizePool}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-secondary mt-1">
                    <Users className="w-3 h-3" />
                    <span>{tournament.players} players</span>
                  </div>
                </div>
=======
      {/* Archetype Breakdown */}
      <div className="bg-card rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Archetype Breakdown</h3>
        <div className="space-y-3">
          {metaData.archetypes.map((archetype, index) => (
            <div key={archetype.name} className="flex items-center justify-between p-3 bg-tertiary rounded">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {index + 1}
                </div>
                <div>
                  <div className="font-semibold">{archetype.name}</div>
                  <div className="text-sm text-secondary">
                    {archetype.matches} matches • {archetype.wins}W-{archetype.losses}L
                  </div>
                </div>
              </div>
              <div className="text-right flex items-center gap-2">
                <div>
                  <div className="font-semibold">{archetype.metaShare.toFixed(1)}%</div>
                  <div className={`text-sm ${archetype.winRate >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                    {archetype.winRate.toFixed(1)}% WR
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  {getTrendIcon(archetype.trend)}
                  <span className={`text-xs ${getTrendColor(archetype.trend)}`}>
                    {archetype.trend}
                  </span>
                </div>
>>>>>>> af774a41 (Initial commit)
              </div>
            </div>
          ))}
        </div>
<<<<<<< HEAD
        <div className="text-center mt-3">
          <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
            View all tournaments →
          </button>
        </div>
      </div>
    </motion.div>
=======
      </div>

      {/* Matchup Matrix */}
      {metaData.matchupMatrix.length > 0 && (
        <div className="bg-card rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Key Matchups</h3>
          <div className="space-y-3">
            {metaData.matchupMatrix.slice(0, 5).map((matchup, index) => {
              const deck1WinRate = (matchup.deck1Wins / matchup.totalGames) * 100;
              const deck2WinRate = (matchup.deck2Wins / matchup.totalGames) * 100;
              
              return (
                <div key={index} className="p-3 bg-tertiary rounded">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">
                      {matchup.deck1} vs {matchup.deck2}
                    </span>
                    <span className="text-sm text-secondary">
                      {matchup.totalGames} games
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{matchup.deck1}</span>
                        <span>{deck1WinRate.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${deck1WinRate}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{matchup.deck2}</span>
                        <span>{deck2WinRate.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full" 
                          style={{ width: `${deck2WinRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
>>>>>>> af774a41 (Initial commit)
  );
};

export default TournamentMetaAnalysis;
