import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Target,
  Eye,
  Download,
  Users,
} from 'lucide-react';
import { motion } from 'framer-motion';

const CardDetailMetaAnalysis = ({ cardName }) => {
  // Mock data for card usage statistics
  const cardUsageData = {
    playRate: 67,
    trend: 'up',
    trendValue: 23,
    deckUsage: [
      {
        deck: 'Elemental Storm Control',
        percentage: 87,
        winRate: 68.2,
        games: 1247,
      },
      { deck: 'Blazing Aggro Rush', percentage: 23, winRate: 72.1, games: 892 },
      { deck: "Nature's Harmony", percentage: 45, winRate: 64.3, games: 678 },
    ],
    similarCards: [
      {
        name: 'Flame Burst',
        playRate: 54,
        trend: 'up',
        trendValue: 18,
      },
      {
        name: "Nature's Blessing",
        playRate: 41,
        trend: 'down',
        trendValue: 12,
      },
      {
        name: 'Shadow Veil',
        playRate: 38,
        trend: 'up',
        trendValue: 15,
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Card Usage Stats */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Card Meta Analysis</h3>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Last updated:</span>
            <span className="text-white">June 19, 2025</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Play Rate</p>
                <p className="text-2xl font-bold text-white">{cardUsageData.playRate}%</p>
              </div>
              <div className="flex items-center gap-1 text-green-500">
                <TrendingUp size={20} />
                <span className="font-medium">+{cardUsageData.trendValue}%</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Decks Using</p>
                <p className="text-2xl font-bold text-white">{cardUsageData.deckUsage.length}</p>
              </div>
              <Target className="text-purple-400" size={20} />
            </div>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Popularity Rank</p>
                <p className="text-2xl font-bold text-white">#12</p>
              </div>
              <Users className="text-blue-400" size={20} />
            </div>
          </div>
        </div>

        <h4 className="text-md font-semibold text-white mb-3">Top Decks Using This Card</h4>
        <div className="space-y-3 mb-6">
          {cardUsageData.deckUsage.map((deck, index) => (
            <div key={index} className="bg-gray-700/30 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-white">{deck.deck}</div>
                <div className="text-sm text-gray-300">{deck.percentage}% include</div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="text-gray-400">Win rate: <span className="text-green-400">{deck.winRate}%</span></div>
                <div className="text-gray-400">{deck.games} games</div>
              </div>
            </div>
          ))}
        </div>

        <h4 className="text-md font-semibold text-white mb-3">Similar Cards</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {cardUsageData.similarCards.map((card, index) => (
            <div key={index} className="bg-gray-700/30 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-white">{card.name}</div>
                <div className="flex items-center gap-1">
                  {card.trend === 'up' ? (
                    <TrendingUp size={14} className="text-green-500" />
                  ) : (
                    <TrendingDown size={14} className="text-red-500" />
                  )}
                  <span className={card.trend === 'up' ? "text-green-500 text-xs" : "text-red-500 text-xs"}>
                    {card.trend === 'up' ? '+' : '-'}{card.trendValue}%
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                {card.playRate}% play rate
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Over Time */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Usage Over Time</h3>
          <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors">
            <Download size={14} />
            Export Data
          </button>
        </div>

        <div className="h-48 bg-gray-700/30 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-400">
            <BarChart3 size={32} className="mx-auto mb-2" />
            <p>Usage trend chart would appear here</p>
            <p className="text-sm">Data shows increasing popularity over the last 30 days</p>
          </div>
        </div>
      </div>

      {/* Community Feedback */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Community Rating</h3>
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white text-2xl font-bold">
              4.2
            </div>
            <div>
              <div className="text-white font-medium">Very Good</div>
              <div className="text-sm text-gray-400">Based on 1,847 ratings</div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-white font-medium">Power Level</div>
            <div className="flex items-center gap-1">
              <div className="w-20 h-2 bg-gray-700 rounded-full">
                <div className="h-2 rounded-full bg-gradient-to-r from-green-500 to-green-600" style={{ width: '85%' }}></div>
              </div>
              <span className="text-sm text-white">4.5</span>
            </div>
            
            <div className="text-white font-medium mt-2">Versatility</div>
            <div className="flex items-center gap-1">
              <div className="w-20 h-2 bg-gray-700 rounded-full">
                <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600" style={{ width: '76%' }}></div>
              </div>
              <span className="text-sm text-white">3.8</span>
            </div>
          </div>
        </div>
        
        <button className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
          <Eye className="inline-block mr-2 w-4 h-4" />
          View All Reviews
        </button>
      </div>
    </motion.div>
  );
};

export default CardDetailMetaAnalysis;