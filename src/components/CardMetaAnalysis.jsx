import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Download,
  Filter,
  ArrowRight,
  BarChart2,
  PieChart,
} from 'lucide-react';
import { motion } from 'framer-motion';

const CardMetaAnalysis = () => {
  const trendingCards = [
    {
      name: 'Lightning Strike',
      playRate: 67,
      trend: 'up',
      trendValue: 23,
      color: 'yellow',
    },
    {
      name: 'Flame Burst',
      playRate: 54,
      trend: 'up',
      trendValue: 18,
      color: 'red',
    },
    {
      name: "Nature's Blessing",
      playRate: 41,
      trend: 'down',
      trendValue: 12,
      color: 'green',
    },
    {
      name: 'Shadow Veil',
      playRate: 38,
      trend: 'up',
      trendValue: 15,
      color: 'purple',
    },
    {
      name: 'Crystal Shield',
      playRate: 32,
      trend: 'down',
      trendValue: 8,
      color: 'blue',
    },
    {
      name: 'Earth Shatter',
      playRate: 29,
      trend: 'up',
      trendValue: 10,
      color: 'brown',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Filters and Controls */}
      <div className="bg-card rounded-lg p-4 border border-color">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Trending Cards Analysis
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <select className="pl-3 pr-8 py-2 bg-background border border-color rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
                <option>All time</option>
              </select>
              <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary pointer-events-none" />
            </div>
            <button className="flex items-center gap-1 px-3 py-2 bg-primary text-white rounded-lg text-sm">
              <Download className="w-4 h-4" />
              Export Data
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg p-4 border border-color">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm text-secondary">Most Viewed</div>
              <div className="font-bold">Lightning Strike</div>
            </div>
          </div>
          <div className="text-xs text-secondary">
            Viewed 2,345 times in the last 7 days
          </div>
        </div>
        <div className="bg-card rounded-lg p-4 border border-color">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm text-secondary">Biggest Gainer</div>
              <div className="font-bold">Shadow Veil</div>
            </div>
          </div>
          <div className="text-xs text-secondary">
            Usage increased by 23% in the last 7 days
          </div>
        </div>
        <div className="bg-card rounded-lg p-4 border border-color">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm text-secondary">Biggest Decliner</div>
              <div className="font-bold">Crystal Shield</div>
            </div>
          </div>
          <div className="text-xs text-secondary">
            Usage decreased by 12% in the last 7 days
          </div>
        </div>
      </div>

      {/* Trending Cards Grid */}
      <div className="bg-card rounded-lg p-6 border border-color">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Top Trending Cards</h3>
          <div className="flex items-center gap-2">
            <button className="p-2 bg-background rounded-lg text-secondary hover:text-primary transition-colors">
              <BarChart2 className="w-4 h-4" />
            </button>
            <button className="p-2 bg-background rounded-lg text-secondary hover:text-primary transition-colors">
              <PieChart className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trendingCards.map((card, index) => (
            <div key={index} className="border border-color rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">{card.name}</h4>
                <div className="flex items-center gap-1 text-xs">
                  {card.trend === 'up' ? (
                    <div className="flex items-center gap-1 text-green-500">
                      <TrendingUp size={14} />
                      <span>+{card.trendValue}%</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-500">
                      <TrendingDown size={14} />
                      <span>-{card.trendValue}%</span>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-secondary mb-3">
                Played in {card.playRate}% of {card.color} decks
              </p>
              <div className="w-full bg-tertiary rounded-full h-2 mb-2">
                <div
                  className={`bg-gradient-to-r ${
                    card.color === 'yellow'
                      ? 'from-yellow-500 to-yellow-600'
                      : card.color === 'red'
                      ? 'from-red-500 to-red-600'
                      : card.color === 'green'
                      ? 'from-green-500 to-green-600'
                      : card.color === 'blue'
                      ? 'from-blue-500 to-blue-600'
                      : card.color === 'purple'
                      ? 'from-purple-500 to-purple-600'
                      : 'from-yellow-500 to-yellow-600'
                  } h-2 rounded-full`}
                  style={{ width: `${card.playRate}%` }}
                ></div>
              </div>
              <button className="w-full flex items-center justify-center gap-1 mt-2 text-xs text-primary hover:text-primary-dark transition-colors">
                View card details
                <ArrowRight size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CardMetaAnalysis;
