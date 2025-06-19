import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Search,
  Filter,
  Bell,
  BarChart3,
  Calendar,
  Target,
  AlertCircle,
} from 'lucide-react';

const PriceTracker = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('7d');
  const [sortBy, setSortBy] = useState('price_change');

  // Mock price data - in real app, this would come from an API
  const [priceData] = useState([
    {
      id: 1,
      name: 'Vynnset, Iron Maiden',
      set: 'Core Set 2024',
      rarity: 'Legendary',
      currentPrice: 45.99,
      previousPrice: 38.5,
      priceChange: 7.49,
      percentChange: 19.5,
      format: 'Standard',
      marketCap: 125000,
      volume24h: 2500,
      image: '/api/placeholder/150/200',
      priceHistory: [38.5, 39.2, 41.0, 43.5, 45.99],
      alerts: 3,
    },
    {
      id: 2,
      name: 'Briar, Warden of Thorns',
      set: 'Elemental Rising',
      rarity: 'Legendary',
      currentPrice: 32.75,
      previousPrice: 35.2,
      priceChange: -2.45,
      percentChange: -7.0,
      format: 'Standard',
      marketCap: 89000,
      volume24h: 1800,
      image: '/api/placeholder/150/200',
      priceHistory: [35.2, 34.8, 33.9, 33.1, 32.75],
      alerts: 1,
    },
    {
      id: 3,
      name: 'Lightning Strike',
      set: 'Core Set 2024',
      rarity: 'Common',
      currentPrice: 2.5,
      previousPrice: 1.8,
      priceChange: 0.7,
      percentChange: 38.9,
      format: 'Standard',
      marketCap: 15000,
      volume24h: 5200,
      image: '/api/placeholder/150/200',
      priceHistory: [1.8, 1.95, 2.1, 2.3, 2.5],
      alerts: 8,
    },
    {
      id: 4,
      name: 'Mystic Sanctuary',
      set: 'Lands of Power',
      rarity: 'Rare',
      currentPrice: 18.99,
      previousPrice: 22.5,
      priceChange: -3.51,
      percentChange: -15.6,
      format: 'Legacy',
      marketCap: 45000,
      volume24h: 950,
      image: '/api/placeholder/150/200',
      priceHistory: [22.5, 21.8, 20.5, 19.75, 18.99],
      alerts: 2,
    },
    {
      id: 5,
      name: 'Ancient Relic',
      set: 'Artifacts Unleashed',
      rarity: 'Mythic',
      currentPrice: 89.99,
      previousPrice: 75.0,
      priceChange: 14.99,
      percentChange: 20.0,
      format: 'Legacy',
      marketCap: 180000,
      volume24h: 750,
      image: '/api/placeholder/150/200',
      priceHistory: [75.0, 78.5, 82.0, 86.25, 89.99],
      alerts: 12,
    },
  ]);

  const [topMovers] = useState({
    gainers: [
      { name: 'Lightning Strike', change: 38.9, price: 2.5 },
      { name: 'Ancient Relic', change: 20.0, price: 89.99 },
      { name: 'Vynnset, Iron Maiden', change: 19.5, price: 45.99 },
    ],
    losers: [
      { name: 'Mystic Sanctuary', change: -15.6, price: 18.99 },
      { name: 'Briar, Warden of Thorns', change: -7.0, price: 32.75 },
      { name: 'Storm Caller', change: -5.2, price: 12.5 },
    ],
  });

  const filteredCards = priceData.filter(card => {
    const matchesSearch = card.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFormat =
      selectedFormat === 'all' ||
      card.format.toLowerCase() === selectedFormat.toLowerCase();
    const matchesPrice =
      priceFilter === 'all' ||
      (priceFilter === 'budget' && card.currentPrice < 10) ||
      (priceFilter === 'mid' &&
        card.currentPrice >= 10 &&
        card.currentPrice < 50) ||
      (priceFilter === 'high' && card.currentPrice >= 50);

    return matchesSearch && matchesFormat && matchesPrice;
  });

  const sortedCards = [...filteredCards].sort((a, b) => {
    switch (sortBy) {
      case 'price_change':
        return Math.abs(b.percentChange) - Math.abs(a.percentChange);
      case 'price_high':
        return b.currentPrice - a.currentPrice;
      case 'price_low':
        return a.currentPrice - b.currentPrice;
      case 'volume':
        return b.volume24h - a.volume24h;
      default:
        return 0;
    }
  });

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
            KONIVRER Price Tracker
          </h1>
          <p className="text-gray-300 text-lg">
            Real-time card prices, market trends, and price alerts
          </p>
        </motion.div>

        {/* Market Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Market Cap</p>
                <p className="text-2xl font-bold text-green-400">$2.4M</p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">24h Volume</p>
                <p className="text-2xl font-bold text-blue-400">$156K</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Alerts</p>
                <p className="text-2xl font-bold text-yellow-400">26</p>
              </div>
              <Bell className="w-8 h-8 text-yellow-400" />
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Tracked Cards</p>
                <p className="text-2xl font-bold text-purple-400">1,247</p>
              </div>
              <Target className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </motion.div>

        {/* Top Movers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          {/* Top Gainers */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
              Top Gainers (24h)
            </h3>
            <div className="space-y-3">
              {topMovers.gainers.map((card, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
                >
                  <span className="font-medium">{card.name}</span>
                  <div className="text-right">
                    <div className="text-green-400 font-bold">
                      +{card.change}%
                    </div>
                    <div className="text-gray-400 text-sm">${card.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Losers */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <TrendingDown className="w-5 h-5 text-red-400 mr-2" />
              Top Losers (24h)
            </h3>
            <div className="space-y-3">
              {topMovers.losers.map((card, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
                >
                  <span className="font-medium">{card.name}</span>
                  <div className="text-right">
                    <div className="text-red-400 font-bold">{card.change}%</div>
                    <div className="text-gray-400 text-sm">${card.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search cards..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Format Filter */}
            <select
              value={selectedFormat}
              onChange={e => setSelectedFormat(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Formats</option>
              <option value="standard">Standard</option>
              <option value="legacy">Legacy</option>
              <option value="classic">Classic</option>
            </select>

            {/* Price Filter */}
            <select
              value={priceFilter}
              onChange={e => setPriceFilter(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Prices</option>
              <option value="budget">Budget (&lt;$10)</option>
              <option value="mid">Mid ($10-$50)</option>
              <option value="high">High ($50+)</option>
            </select>

            {/* Time Range */}
            <select
              value={timeRange}
              onChange={e => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="1d">24 Hours</option>
              <option value="7d">7 Days</option>
              <option value="30d">30 Days</option>
              <option value="90d">90 Days</option>
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="price_change">Price Change</option>
              <option value="price_high">Price (High to Low)</option>
              <option value="price_low">Price (Low to High)</option>
              <option value="volume">Volume</option>
            </select>
          </div>
        </motion.div>

        {/* Price Cards Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {sortedCards.map(card => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">{card.name}</h3>
                  <p className="text-gray-400 text-sm">
                    {card.set} • {card.rarity}
                  </p>
                </div>
                {card.alerts > 0 && (
                  <div className="flex items-center text-yellow-400">
                    <Bell className="w-4 h-4 mr-1" />
                    <span className="text-sm">{card.alerts}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-2xl font-bold">${card.currentPrice}</div>
                  <div className="text-gray-400 text-sm">Current Price</div>
                </div>
                <div
                  className={`flex items-center ${card.percentChange >= 0 ? 'text-green-400' : 'text-red-400'}`}
                >
                  {card.percentChange >= 0 ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  <span className="font-bold">
                    {card.percentChange >= 0 ? '+' : ''}
                    {card.percentChange}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <div className="text-gray-400">24h Volume</div>
                  <div className="font-medium">
                    {card.volume24h.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Market Cap</div>
                  <div className="font-medium">
                    ${(card.marketCap / 1000).toFixed(0)}K
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors">
                  Set Alert
                </button>
                <button className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors">
                  View Chart
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {sortedCards.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">
              No cards found
            </h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PriceTracker;
