import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Trophy,
  Users,
  Calendar,
  Filter,
  Download,
  Eye,
  Target,
  Zap,
  Shield,
  Sword,
} from 'lucide-react';

const MetagameAnalysis = () => {
  const [selectedFormat, setSelectedFormat] = useState('standard');
  const [timeRange, setTimeRange] = useState('30d');
  const [tournamentType, setTournamentType] = useState('all');

  // Mock metagame data
  const [metagameData] = useState({
    standard: {
      totalMatches: 15420,
      totalTournaments: 89,
      topDecks: [
        {
          name: 'Vynnset Aggro',
          hero: 'Vynnset, Iron Maiden',
          percentage: 18.5,
          winRate: 64.2,
          matches: 2853,
          avgPrice: 245,
          trend: 'up',
          color: '#ef4444',
          description: 'Fast aggressive deck focused on early pressure',
        },
        {
          name: 'Briar Control',
          hero: 'Briar, Warden of Thorns',
          percentage: 15.2,
          winRate: 58.7,
          matches: 2344,
          avgPrice: 320,
          trend: 'stable',
          color: '#22c55e',
          description: 'Defensive control deck with late-game power',
        },
        {
          name: 'Elemental Midrange',
          hero: 'Kael, Storm Caller',
          percentage: 12.8,
          winRate: 61.3,
          matches: 1974,
          avgPrice: 180,
          trend: 'up',
          color: '#3b82f6',
          description: 'Balanced midrange strategy with elemental synergies',
        },
        {
          name: 'Shadow Combo',
          hero: 'Nyx, Shadow Weaver',
          percentage: 11.4,
          winRate: 55.9,
          matches: 1758,
          avgPrice: 290,
          trend: 'down',
          color: '#8b5cf6',
          description: 'Combo deck that wins through shadow manipulation',
        },
        {
          name: 'Artifact Ramp',
          hero: 'Golem Master Zara',
          percentage: 9.7,
          winRate: 52.1,
          matches: 1496,
          avgPrice: 410,
          trend: 'stable',
          color: '#f59e0b',
          description: 'Ramp strategy using powerful artifacts',
        },
        {
          name: 'Burn Rush',
          hero: 'Flame Dancer Kai',
          percentage: 8.9,
          winRate: 59.8,
          matches: 1372,
          avgPrice: 125,
          trend: 'up',
          color: '#dc2626',
          description: 'Ultra-fast burn deck for quick victories',
        },
        {
          name: 'Tempo Control',
          hero: 'Wind Walker Aria',
          percentage: 7.3,
          winRate: 56.4,
          matches: 1126,
          avgPrice: 275,
          trend: 'stable',
          color: '#06b6d4',
          description: 'Tempo-based control with efficient threats',
        },
        {
          name: 'Other Decks',
          hero: 'Various',
          percentage: 16.2,
          winRate: 48.5,
          matches: 2497,
          avgPrice: 200,
          trend: 'stable',
          color: '#6b7280',
          description: 'Various other archetypes and brews',
        },
      ],
    },
  });

  const [recentTournaments] = useState([
    {
      id: 1,
      name: 'KONIVRER World Championship 2024',
      date: '2024-06-15',
      format: 'Standard',
      players: 256,
      winner: 'DragonMaster',
      winningDeck: 'Vynnset Aggro',
      prizePool: 50000,
      location: 'Los Angeles, CA',
    },
    {
      id: 2,
      name: 'Regional Qualifier - East',
      date: '2024-06-12',
      format: 'Standard',
      players: 128,
      winner: 'ElementalForce',
      winningDeck: 'Briar Control',
      prizePool: 10000,
      location: 'New York, NY',
    },
    {
      id: 3,
      name: 'Weekly Championship #47',
      date: '2024-06-10',
      format: 'Standard',
      players: 64,
      winner: 'StormCaller99',
      winningDeck: 'Elemental Midrange',
      prizePool: 2500,
      location: 'Online',
    },
  ]);

  const [matchupData] = useState([
    {
      deck1: 'Vynnset Aggro',
      deck2: 'Briar Control',
      winRate: 68.5,
      matches: 342,
    },
    {
      deck1: 'Elemental Midrange',
      deck2: 'Shadow Combo',
      winRate: 72.1,
      matches: 289,
    },
    { deck1: 'Burn Rush', deck2: 'Artifact Ramp', winRate: 78.9, matches: 198 },
    {
      deck1: 'Tempo Control',
      deck2: 'Vynnset Aggro',
      winRate: 45.2,
      matches: 267,
    },
    {
      deck1: 'Briar Control',
      deck2: 'Shadow Combo',
      winRate: 61.8,
      matches: 223,
    },
  ]);

  const currentData = metagameData[selectedFormat];

  const getTrendIcon = trend => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  const getArchetypeIcon = deckName => {
    if (deckName.includes('Aggro') || deckName.includes('Rush')) {
      return <Zap className="w-5 h-5" />;
    } else if (deckName.includes('Control')) {
      return <Shield className="w-5 h-5" />;
    } else if (deckName.includes('Combo')) {
      return <Target className="w-5 h-5" />;
    } else {
      return <Sword className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Metagame Analysis
          </h1>
          <p className="text-gray-300 text-lg">
            Comprehensive tournament data and deck performance statistics
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Format
              </label>
              <select
                value={selectedFormat}
                onChange={e => setSelectedFormat(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="standard">Standard</option>
                <option value="legacy">Legacy</option>
                <option value="classic">Classic</option>
                <option value="blitz">Blitz</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Time Range
              </label>
              <select
                value={timeRange}
                onChange={e => setTimeRange(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="1y">Last Year</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tournament Type
              </label>
              <select
                value={tournamentType}
                onChange={e => setTournamentType(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Tournaments</option>
                <option value="championship">Championships</option>
                <option value="qualifier">Qualifiers</option>
                <option value="weekly">Weekly Events</option>
              </select>
            </div>

            <div className="flex items-end">
              <button className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors flex items-center justify-center">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Matches</p>
                <p className="text-2xl font-bold text-blue-400">
                  {currentData.totalMatches.toLocaleString()}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Tournaments</p>
                <p className="text-2xl font-bold text-green-400">
                  {currentData.totalTournaments}
                </p>
              </div>
              <Trophy className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Players</p>
                <p className="text-2xl font-bold text-purple-400">2,847</p>
              </div>
              <Users className="w-8 h-8 text-purple-400" />
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Diversity Index</p>
                <p className="text-2xl font-bold text-yellow-400">7.2</p>
              </div>
              <Target className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Metagame Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <BarChart3 className="w-6 h-6 mr-2 text-purple-400" />
                Metagame Breakdown
              </h2>

              <div className="space-y-4">
                {currentData.topDecks.map((deck, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-700/30 rounded-lg p-4 hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="flex items-center mr-3">
                          {getArchetypeIcon(deck.name)}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{deck.name}</h3>
                          <p className="text-gray-400 text-sm">{deck.hero}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getTrendIcon(deck.trend)}
                        <span
                          className="text-2xl font-bold"
                          style={{ color: deck.color }}
                        >
                          {deck.percentage}%
                        </span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${deck.percentage}%`,
                            backgroundColor: deck.color,
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Win Rate:</span>
                        <span className="ml-2 font-medium text-green-400">
                          {deck.winRate}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Matches:</span>
                        <span className="ml-2 font-medium">
                          {deck.matches.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Avg Price:</span>
                        <span className="ml-2 font-medium text-yellow-400">
                          ${deck.avgPrice}
                        </span>
                      </div>
                      <div className="md:col-span-1 col-span-2">
                        <button className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-xs transition-colors">
                          View Decklist
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-400 text-sm mt-2">
                      {deck.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Recent Tournaments */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                Recent Tournaments
              </h3>

              <div className="space-y-4">
                {recentTournaments.map(tournament => (
                  <div
                    key={tournament.id}
                    className="bg-gray-700/30 rounded-lg p-4"
                  >
                    <h4 className="font-bold text-sm mb-2">
                      {tournament.name}
                    </h4>
                    <div className="text-xs text-gray-400 space-y-1">
                      <div className="flex justify-between">
                        <span>Winner:</span>
                        <span className="text-yellow-400">
                          {tournament.winner}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Deck:</span>
                        <span>{tournament.winningDeck}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Players:</span>
                        <span>{tournament.players}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Prize:</span>
                        <span className="text-green-400">
                          ${tournament.prizePool.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Matchups */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-red-400" />
                Key Matchups
              </h3>

              <div className="space-y-3">
                {matchupData.map((matchup, index) => (
                  <div key={index} className="bg-gray-700/30 rounded-lg p-3">
                    <div className="text-sm font-medium mb-2">
                      {matchup.deck1} vs {matchup.deck2}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">
                        {matchup.matches} matches
                      </span>
                      <span
                        className={`font-bold ${matchup.winRate > 50 ? 'text-green-400' : 'text-red-400'}`}
                      >
                        {matchup.winRate}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-1 mt-2">
                      <div
                        className={`h-1 rounded-full ${matchup.winRate > 50 ? 'bg-green-400' : 'bg-red-400'}`}
                        style={{ width: `${matchup.winRate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MetagameAnalysis;
