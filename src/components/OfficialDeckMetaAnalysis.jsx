import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Target,
  Calendar,
  Download,
  Shield,
  Sword,
  Heart,
  Eye,
  Users,
  Trophy,
  Percent,
  Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';

const OfficialDeckMetaAnalysis = () => {
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
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
            <BarChart3 className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Meta Analysis</h2>
            <p className="text-sm text-gray-400">
              Current competitive landscape insights
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Decks */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">
                Top Performing Decks
              </h3>
              <button className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-white transition-colors">
                <Download size={12} />
                Export
              </button>
            </div>

            <div className="space-y-3">
              {metaData.topDecks.map((deck, index) => (
                <div
                  key={index}
                  className="border border-gray-700 rounded-lg p-3 hover:bg-gray-700/30 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                        #{index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-white">
                          {deck.name}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          {getArchetypeIcon(deck.archetype)}
                          <span>{deck.archetype}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {getTrendIcon(deck.trend)}
                      <span className="text-xs font-medium text-white">
                        {deck.metaShare}%
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div>
                      <p className="text-gray-400">Win Rate</p>
                      <p className="font-semibold text-white">
                        {deck.winRate}%
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Games</p>
                      <p className="font-semibold text-white">
                        {deck.games}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Avg Finish</p>
                      <p className="font-semibold text-white">
                        {deck.avgTournamentFinish}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Colors</p>
                      <div className="flex gap-1 flex-wrap">
                        {deck.colors.map((color, i) => (
                          <span
                            key={i}
                            className="px-1 py-0.5 bg-gray-700 rounded text-xs text-gray-300"
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
        <div>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">
              Archetype Distribution
            </h3>

            <div className="space-y-3">
              {metaData.archetypeBreakdown.map((archetype, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {getArchetypeIcon(archetype.name)}
                      <span className="font-medium text-sm text-white">
                        {archetype.name}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-white">
                      {archetype.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
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
    </div>
  );
};

export default OfficialDeckMetaAnalysis;