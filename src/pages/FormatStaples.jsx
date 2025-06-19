import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Filter,
  Search,
  Star,
  Percent,
  Trophy,
  Users,
  BarChart3,
  ArrowUpDown,
  Eye,
  DollarSign,
} from 'lucide-react';

const FormatStaples = () => {
  const [selectedFormat, setSelectedFormat] = useState('standard');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('playRate');
  const [filterBy, setFilterBy] = useState('all');

  // Mock format staples data
  const formatStaples = {
    standard: [
      {
        name: 'Lightning Bolt',
        manaCost: 1,
        type: 'Instant',
        colors: ['R'],
        playRate: 87.5,
        decksPlayed: 1420,
        totalDecks: 1623,
        avgCopies: 3.8,
        price: 2.99,
        priceChange: 15.2,
        rarity: 'Common',
        set: 'Foundations',
      },
      {
        name: 'Counterspell',
        manaCost: 2,
        type: 'Instant',
        colors: ['U'],
        playRate: 76.3,
        decksPlayed: 1238,
        totalDecks: 1623,
        avgCopies: 3.2,
        price: 1.49,
        priceChange: -5.1,
        rarity: 'Common',
        set: 'Foundations',
      },
      {
        name: 'Swords to Plowshares',
        manaCost: 1,
        type: 'Instant',
        colors: ['W'],
        playRate: 68.9,
        decksPlayed: 1118,
        totalDecks: 1623,
        avgCopies: 2.9,
        price: 3.99,
        priceChange: 8.7,
        rarity: 'Uncommon',
        set: 'Foundations',
      },
    ],
    modern: [
      {
        name: 'Fetchlands',
        manaCost: 0,
        type: 'Land',
        colors: [],
        playRate: 92.1,
        decksPlayed: 2847,
        totalDecks: 3092,
        avgCopies: 7.2,
        price: 45.99,
        priceChange: 12.3,
        rarity: 'Rare',
        set: 'Modern Horizons 3',
      },
    ],
    commander: [
      {
        name: 'Sol Ring',
        manaCost: 1,
        type: 'Artifact',
        colors: [],
        playRate: 98.7,
        decksPlayed: 15420,
        totalDecks: 15623,
        avgCopies: 1.0,
        price: 1.99,
        priceChange: 2.1,
        rarity: 'Uncommon',
        set: 'Commander Masters',
      },
    ],
  };

  const formats = [
    { id: 'standard', name: 'Standard', icon: '⚡' },
    { id: 'modern', name: 'Modern', icon: '🔥' },
    { id: 'pioneer', name: 'Pioneer', icon: '🚀' },
    { id: 'legacy', name: 'Legacy', icon: '👑' },
    { id: 'vintage', name: 'Vintage', icon: '💎' },
    { id: 'commander', name: 'Commander', icon: '⚔️' },
    { id: 'pauper', name: 'Pauper', icon: '🏛️' },
  ];

  const filteredStaples = useMemo(() => {
    const staples = formatStaples[selectedFormat] || [];

    return staples
      .filter(card => {
        const matchesSearch = card.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesFilter =
          filterBy === 'all' ||
          (filterBy === 'expensive' && card.price >= 10) ||
          (filterBy === 'budget' && card.price < 5) ||
          (filterBy === 'trending' && card.priceChange > 10);
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'playRate':
            return b.playRate - a.playRate;
          case 'price':
            return b.price - a.price;
          case 'priceChange':
            return b.priceChange - a.priceChange;
          case 'alphabetical':
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
  }, [selectedFormat, searchTerm, filterBy, sortBy]);

  const getColorSymbols = colors => {
    const colorMap = {
      W: '⚪',
      U: '🔵',
      B: '⚫',
      R: '🔴',
      G: '🟢',
    };
    return colors.length > 0
      ? colors.map(color => colorMap[color]).join('')
      : '◯';
  };

  const getRarityColor = rarity => {
    const rarityColors = {
      Common: 'text-gray-400',
      Uncommon: 'text-blue-400',
      Rare: 'text-yellow-400',
      Mythic: 'text-orange-400',
    };
    return rarityColors[rarity] || 'text-gray-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Trophy className="text-yellow-400" />
            Format Staples
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Discover the most played cards in each format with detailed
            statistics and trends
          </p>
        </motion.div>

        {/* Format Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-wrap justify-center gap-4">
            {formats.map(format => (
              <button
                key={format.id}
                onClick={() => setSelectedFormat(format.id)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  selectedFormat === format.id
                    ? 'bg-purple-600 text-white shadow-lg scale-105'
                    : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700/50'
                }`}
              >
                <span className="mr-2">{format.icon}</span>
                {format.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search cards..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <select
              value={filterBy}
              onChange={e => setFilterBy(e.target.value)}
              className="px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Cards</option>
              <option value="expensive">Expensive ($10+)</option>
              <option value="budget">Budget (&lt;$5)</option>
              <option value="trending">Trending (+10%)</option>
            </select>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="playRate">Sort by Play Rate</option>
              <option value="price">Sort by Price</option>
              <option value="priceChange">Sort by Price Change</option>
              <option value="alphabetical">Sort Alphabetically</option>
            </select>

            <div className="flex items-center justify-between bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3">
              <span className="text-white">{filteredStaples.length} Cards</span>
              <BarChart3 className="text-purple-400 w-5 h-5" />
            </div>
          </div>
        </motion.div>

        {/* Format Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-600">
            <div className="flex items-center gap-3 mb-2">
              <Users className="text-blue-400 w-6 h-6" />
              <h3 className="text-lg font-semibold text-white">Total Decks</h3>
            </div>
            <p className="text-3xl font-bold text-blue-400">
              {formatStaples[
                selectedFormat
              ]?.[0]?.totalDecks?.toLocaleString() || '0'}
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-600">
            <div className="flex items-center gap-3 mb-2">
              <Star className="text-yellow-400 w-6 h-6" />
              <h3 className="text-lg font-semibold text-white">Top Card</h3>
            </div>
            <p className="text-xl font-bold text-yellow-400">
              {filteredStaples[0]?.playRate?.toFixed(1) || '0'}% Play Rate
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-600">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-green-400 w-6 h-6" />
              <h3 className="text-lg font-semibold text-white">Avg Price</h3>
            </div>
            <p className="text-3xl font-bold text-green-400">
              $
              {(
                filteredStaples.reduce((sum, card) => sum + card.price, 0) /
                  filteredStaples.length || 0
              ).toFixed(2)}
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-600">
            <div className="flex items-center gap-3 mb-2">
              <Eye className="text-purple-400 w-6 h-6" />
              <h3 className="text-lg font-semibold text-white">Unique Cards</h3>
            </div>
            <p className="text-3xl font-bold text-purple-400">
              {filteredStaples.length}
            </p>
          </div>
        </motion.div>

        {/* Staples List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {filteredStaples.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-600 hover:border-slate-500 transition-all"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                {/* Card Info */}
                <div className="lg:col-span-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">
                        {getColorSymbols(card.colors)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {card.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <span>{card.type}</span>
                        <span>•</span>
                        <span className={getRarityColor(card.rarity)}>
                          {card.rarity}
                        </span>
                        <span>•</span>
                        <span>{card.set}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Play Rate */}
                <div className="lg:col-span-2 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Percent className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-400">Play Rate</span>
                  </div>
                  <div className="text-2xl font-bold text-green-400">
                    {card.playRate}%
                  </div>
                  <div className="text-sm text-gray-400">
                    {card.decksPlayed.toLocaleString()} /{' '}
                    {card.totalDecks.toLocaleString()}
                  </div>
                </div>

                {/* Average Copies */}
                <div className="lg:col-span-2 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <ArrowUpDown className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-400">Avg Copies</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-400">
                    {card.avgCopies}
                  </div>
                </div>

                {/* Price */}
                <div className="lg:col-span-2 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-400">Price</span>
                  </div>
                  <div className="text-2xl font-bold text-yellow-400">
                    ${card.price}
                  </div>
                </div>

                {/* Price Change */}
                <div className="lg:col-span-2 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-gray-400">24h Change</span>
                  </div>
                  <div
                    className={`text-2xl font-bold ${
                      card.priceChange > 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {card.priceChange > 0 ? '+' : ''}
                    {card.priceChange}%
                  </div>
                </div>
              </div>

              {/* Play Rate Bar */}
              <div className="mt-4">
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${card.playRate}%` }}
                  ></div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredStaples.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">
              No Cards Found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FormatStaples;
