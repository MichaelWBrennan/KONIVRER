/**
 * KONIVRER Deck Database - Card Meta Analysis
 * 
 * Displays trending cards and meta analysis
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState, useEffect } from 'react';
import { TrendingUp, Star, Eye, Users } from 'lucide-react';

const CardMetaAnalysis = () => {
  const [trendingCards, setTrendingCards] = useState([]);

  useEffect(() => {
    // Mock trending cards data
    setTrendingCards([
      {
        id: 1,
        name: 'Lightning Bolt',
        type: 'Spell',
        popularity: 95,
        winRate: 68,
        usage: 'High',
        trend: 'up'
      },
      {
        id: 2,
        name: 'Forest Guardian',
        type: 'Familiar',
        popularity: 87,
        winRate: 72,
        usage: 'Medium',
        trend: 'up'
      },
      {
        id: 3,
        name: 'Ancient Wisdom',
        type: 'Spell',
        popularity: 76,
        winRate: 65,
        usage: 'Medium',
        trend: 'down'
      }
    ]);
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Trending Cards</h2>
        <p className="text-secondary">Popular cards in the current meta</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trendingCards.map((card, index) => (
          <div key={card.id} className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">#{index + 1}</span>
                <TrendingUp 
                  className={`w-5 h-5 ${card.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} 
                />
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm">{card.popularity}%</span>
              </div>
            </div>

            <h3 className="text-lg font-bold mb-2">{card.name}</h3>
            <p className="text-sm text-secondary mb-4">{card.type}</p>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-secondary">Win Rate</span>
                <span className="text-sm font-medium">{card.winRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-secondary">Usage</span>
                <span className="text-sm font-medium">{card.usage}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-color">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>1.2k views</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>856 decks</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button className="bg-primary hover:bg-primary/80 text-white px-6 py-2 rounded-lg transition-colors">
          View Full Meta Report
        </button>
      </div>
    </div>
  );
};

export default CardMetaAnalysis;