import React from 'react';
import { TrendingUp, TrendingDown, Eye, Download } from 'lucide-react';
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
      className="bg-card rounded-lg p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Trending Cards</h3>
        <button className="flex items-center gap-1 px-2 py-1 text-xs text-secondary hover:text-primary transition-colors">
          <Download size={12} />
          Export
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {trendingCards.map((card, index) => (
          <div key={index} className="border border-color rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-sm">{card.name}</h4>
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
            <p className="text-xs text-secondary mb-2">
              Played in {card.playRate}% of {card.color} decks
            </p>
            <div className="w-full bg-tertiary rounded-full h-2">
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
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default CardMetaAnalysis;
