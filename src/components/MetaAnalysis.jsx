import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Target,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Star,
  Crown,
  Zap,
  Shield,
  Sword,
  Heart,
  Eye,
  Users,
  Trophy,
  Percent,
} from 'lucide-react';

const MetaAnalysis = () => {
  const [timeframe, setTimeframe] = useState('30d');


  const metaData = {
    topDecks: [
      {
        name: 'Elemental Storm Control',
        hero: 'Zephyr',
        archetype: 'Control',
        metaShare: 18.5,
        winRate: 68.2,
        trend: 'up',
        games: 1247,
        avgTournamentFinish: 3.2,
        colors: ['Lightning', 'Water', 'Air'],
      },
      {
        name: 'Blazing Aggro Rush',
        hero: 'Ignis',
        archetype: 'Aggro',
        metaShare: 15.3,
        winRate: 72.1,
        trend: 'up',
        games: 892,
        avgTournamentFinish: 2.8,
        colors: ['Fire', 'Earth'],
      },
      {
        name: "Nature's Harmony",
        hero: 'Gaia',
        archetype: 'Midrange',
        metaShare: 12.7,
        winRate: 64.3,
        trend: 'down',
        games: 678,
        avgTournamentFinish: 4.1,
        colors: ['Earth', 'Nature'],
      },
      {
        name: 'Shadow Assassin',
        hero: 'Umbra',
        archetype: 'Combo',
        metaShare: 11.2,
        winRate: 59.8,
        trend: 'stable',
        games: 534,
        avgTournamentFinish: 5.3,
        colors: ['Shadow', 'Dark'],
      },
      {
        name: 'Crystal Guardian',
        hero: 'Prism',
        archetype: 'Control',
        metaShare: 9.8,
        winRate: 61.4,
        trend: 'up',
        games: 445,
        avgTournamentFinish: 4.7,
        colors: ['Light', 'Crystal'],
      },
    ],
    archetypeBreakdown: [
      { name: 'Control', percentage: 32.1, color: 'blue' },
      { name: 'Aggro', percentage: 28.7, color: 'red' },
      { name: 'Midrange', percentage: 23.4, color: 'green' },
      { name: 'Combo', percentage: 15.8, color: 'purple' },
    ],

  };

  const getTrendIcon = trend => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="text-green-500" size={16} />;
      case 'down':
        return <TrendingDown className="text-red-500" size={16} />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
    }
  };

  const getArchetypeIcon = archetype => {
    switch (archetype.toLowerCase()) {
      case 'control':
        return <Shield className="text-blue-500" size={16} />;
      case 'aggro':
        return <Sword className="text-red-500" size={16} />;
      case 'midrange':
        return <Heart className="text-green-500" size={16} />;
      case 'combo':
        return <Zap className="text-purple-500" size={16} />;
      default:
        return <Target size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-primary">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-xl flex items-center justify-center">
                <BarChart3 className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-primary">
                  Meta Analysis
                </h1>
                <p className="text-secondary">
                  Competitive landscape insights and trends
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <select
                value={timeframe}
                onChange={e => setTimeframe(e.target.value)}
                className="px-4 py-2 bg-secondary border border-color rounded-xl text-primary"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 3 months</option>
                <option value="1y">Last year</option>
              </select>



              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-primary to-accent-secondary text-white rounded-xl hover:shadow-lg transition-all duration-200">
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-secondary border border-color rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Users className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm text-secondary">Active Players</p>
                <p className="text-2xl font-bold text-primary">3,247</p>
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <TrendingUp size={12} />
                  +12.3% vs last month
                </p>
              </div>
            </div>
          </div>

          <div className="bg-secondary border border-color rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Trophy className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm text-secondary">Tournaments</p>
                <p className="text-2xl font-bold text-primary">95</p>
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <TrendingUp size={12} />
                  +8.7% vs last month
                </p>
              </div>
            </div>
          </div>

          <div className="bg-secondary border border-color rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Target className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm text-secondary">Unique Decks</p>
                <p className="text-2xl font-bold text-primary">1,892</p>
                <p className="text-xs text-blue-500 flex items-center gap-1">
                  <TrendingUp size={12} />
                  +15.2% vs last month
                </p>
              </div>
            </div>
          </div>

          <div className="bg-secondary border border-color rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                <Percent className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm text-secondary">Meta Diversity</p>
                <p className="text-2xl font-bold text-primary">73.2%</p>
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <TrendingUp size={12} />
                  +3.1% vs last month
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Decks */}
          <div className="lg:col-span-2">
            <div className="bg-secondary border border-color rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-primary">
                  Top Performing Decks
                </h3>
                <button className="flex items-center gap-2 px-3 py-1 text-sm text-secondary hover:text-primary transition-colors">
                  <Download size={14} />
                  Export
                </button>
              </div>

              <div className="space-y-4">
                {metaData.topDecks.map((deck, index) => (
                  <div
                    key={index}
                    className="border border-color rounded-xl p-4 hover:bg-tertiary transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          #{index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-primary">
                            {deck.name}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-secondary">
                            {getArchetypeIcon(deck.archetype)}
                            <span>{deck.hero}</span>
                            <span>•</span>
                            <span>{deck.archetype}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {getTrendIcon(deck.trend)}
                        <span className="text-sm font-medium text-primary">
                          {deck.metaShare}%
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-secondary">Win Rate</p>
                        <p className="font-semibold text-primary">
                          {deck.winRate}%
                        </p>
                      </div>
                      <div>
                        <p className="text-secondary">Games</p>
                        <p className="font-semibold text-primary">
                          {deck.games}
                        </p>
                      </div>
                      <div>
                        <p className="text-secondary">Avg Finish</p>
                        <p className="font-semibold text-primary">
                          {deck.avgTournamentFinish}
                        </p>
                      </div>
                      <div>
                        <p className="text-secondary">Colors</p>
                        <div className="flex gap-1">
                          {deck.colors.map((color, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-tertiary rounded text-xs"
                            >
                              {color}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Archetype Breakdown */}
          <div className="space-y-6">
            <div className="bg-secondary border border-color rounded-xl p-6">
              <h3 className="text-xl font-bold text-primary mb-6">
                Archetype Distribution
              </h3>

              <div className="space-y-4">
                {metaData.archetypeBreakdown.map((archetype, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getArchetypeIcon(archetype.name)}
                        <span className="text-primary font-medium">
                          {archetype.name}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-primary">
                        {archetype.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-tertiary rounded-full h-2">
                      <div
                        className={`h-2 rounded-full bg-gradient-to-r ${
                          archetype.color === 'blue'
                            ? 'from-blue-500 to-blue-600'
                            : archetype.color === 'red'
                              ? 'from-red-500 to-red-600'
                              : archetype.color === 'green'
                                ? 'from-green-500 to-green-600'
                                : 'from-purple-500 to-purple-600'
                        }`}
                        style={{ width: `${archetype.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>


          </div>
        </div>

        {/* Trending Cards Section */}
        <div className="mt-8">
          <div className="bg-secondary border border-color rounded-xl p-6">
            <h3 className="text-xl font-bold text-primary mb-6">
              Trending Cards
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-color rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-primary">
                    Lightning Strike
                  </h4>
                  <div className="flex items-center gap-1 text-green-500">
                    <TrendingUp size={14} />
                    <span className="text-sm">+23%</span>
                  </div>
                </div>
                <p className="text-sm text-secondary mb-2">
                  Played in 67% of Lightning decks
                </p>
                <div className="w-full bg-tertiary rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 rounded-full"
                    style={{ width: '67%' }}
                  ></div>
                </div>
              </div>

              <div className="border border-color rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-primary">Flame Burst</h4>
                  <div className="flex items-center gap-1 text-green-500">
                    <TrendingUp size={14} />
                    <span className="text-sm">+18%</span>
                  </div>
                </div>
                <p className="text-sm text-secondary mb-2">
                  Played in 54% of Fire decks
                </p>
                <div className="w-full bg-tertiary rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full"
                    style={{ width: '54%' }}
                  ></div>
                </div>
              </div>

              <div className="border border-color rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-primary">
                    Nature's Blessing
                  </h4>
                  <div className="flex items-center gap-1 text-red-500">
                    <TrendingDown size={14} />
                    <span className="text-sm">-12%</span>
                  </div>
                </div>
                <p className="text-sm text-secondary mb-2">
                  Played in 41% of Nature decks
                </p>
                <div className="w-full bg-tertiary rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                    style={{ width: '41%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetaAnalysis;
