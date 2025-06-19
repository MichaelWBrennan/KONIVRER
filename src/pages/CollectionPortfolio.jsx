import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Plus,
  Search,
  Filter,
  BarChart3,
  PieChart,
  Calendar,
  Star,
  Eye,
  Download,
  Upload,
} from 'lucide-react';

const CollectionPortfolio = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('value');
  const [viewMode, setViewMode] = useState('cards');

  // Mock collection data
  const collection = [
    {
      id: 1,
      name: 'Black Lotus',
      set: 'Alpha',
      rarity: 'Rare',
      quantity: 1,
      avgCost: 25000,
      currentPrice: 28500,
      totalValue: 28500,
      priceChange: 14.0,
      condition: 'Near Mint',
      foil: false,
      dateAdded: '2024-01-15',
    },
    {
      id: 2,
      name: 'Lightning Bolt',
      set: 'Beta',
      rarity: 'Common',
      quantity: 4,
      avgCost: 150,
      currentPrice: 180,
      totalValue: 720,
      priceChange: 20.0,
      condition: 'Lightly Played',
      foil: false,
      dateAdded: '2024-02-10',
    },
    {
      id: 3,
      name: 'Mox Ruby',
      set: 'Unlimited',
      rarity: 'Rare',
      quantity: 1,
      avgCost: 3200,
      currentPrice: 2950,
      totalValue: 2950,
      priceChange: -7.8,
      condition: 'Near Mint',
      foil: false,
      dateAdded: '2024-03-05',
    },
    {
      id: 4,
      name: 'Force of Will',
      set: 'Alliances',
      rarity: 'Uncommon',
      quantity: 2,
      avgCost: 85,
      currentPrice: 95,
      totalValue: 190,
      priceChange: 11.8,
      condition: 'Near Mint',
      foil: true,
      dateAdded: '2024-04-20',
    },
  ];

  const portfolioStats = useMemo(() => {
    const totalValue = collection.reduce(
      (sum, card) => sum + card.totalValue,
      0,
    );
    const totalCost = collection.reduce(
      (sum, card) => sum + card.avgCost * card.quantity,
      0,
    );
    const totalGainLoss = totalValue - totalCost;
    const totalCards = collection.reduce((sum, card) => sum + card.quantity, 0);
    const uniqueCards = collection.length;

    const gainers = collection.filter(card => card.priceChange > 0).length;
    const losers = collection.filter(card => card.priceChange < 0).length;

    return {
      totalValue,
      totalCost,
      totalGainLoss,
      totalCards,
      uniqueCards,
      gainers,
      losers,
      avgGainLoss: (totalGainLoss / totalCost) * 100,
    };
  }, [collection]);

  const filteredCollection = useMemo(() => {
    return collection
      .filter(card => {
        const matchesSearch =
          card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.set.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter =
          filterBy === 'all' ||
          (filterBy === 'gainers' && card.priceChange > 0) ||
          (filterBy === 'losers' && card.priceChange < 0) ||
          (filterBy === 'expensive' && card.currentPrice >= 100) ||
          (filterBy === 'foil' && card.foil);

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'value':
            return b.totalValue - a.totalValue;
          case 'change':
            return b.priceChange - a.priceChange;
          case 'alphabetical':
            return a.name.localeCompare(b.name);
          case 'dateAdded':
            return new Date(b.dateAdded) - new Date(a.dateAdded);
          default:
            return 0;
        }
      });
  }, [searchTerm, filterBy, sortBy]);

  const getRarityColor = rarity => {
    const rarityColors = {
      Common: 'text-gray-400',
      Uncommon: 'text-blue-400',
      Rare: 'text-yellow-400',
      Mythic: 'text-orange-400',
    };
    return rarityColors[rarity] || 'text-gray-400';
  };

  const formatCurrency = amount => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
            <Package className="text-purple-400" />
            Collection Portfolio
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Track your Magic collection's value, monitor price changes, and
            analyze your investment performance
          </p>
        </motion.div>

        {/* Portfolio Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-600">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="text-green-400 w-6 h-6" />
              <h3 className="text-lg font-semibold text-white">Total Value</h3>
            </div>
            <p className="text-3xl font-bold text-green-400">
              {formatCurrency(portfolioStats.totalValue)}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Cost: {formatCurrency(portfolioStats.totalCost)}
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-600">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-blue-400 w-6 h-6" />
              <h3 className="text-lg font-semibold text-white">Gain/Loss</h3>
            </div>
            <p
              className={`text-3xl font-bold ${portfolioStats.totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}
            >
              {portfolioStats.totalGainLoss >= 0 ? '+' : ''}
              {formatCurrency(portfolioStats.totalGainLoss)}
            </p>
            <p
              className={`text-sm mt-1 ${portfolioStats.avgGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}
            >
              {portfolioStats.avgGainLoss >= 0 ? '+' : ''}
              {portfolioStats.avgGainLoss.toFixed(1)}%
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-600">
            <div className="flex items-center gap-3 mb-2">
              <Package className="text-purple-400 w-6 h-6" />
              <h3 className="text-lg font-semibold text-white">Total Cards</h3>
            </div>
            <p className="text-3xl font-bold text-purple-400">
              {portfolioStats.totalCards.toLocaleString()}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {portfolioStats.uniqueCards} unique cards
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-600">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="text-yellow-400 w-6 h-6" />
              <h3 className="text-lg font-semibold text-white">Performance</h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-xl font-bold text-green-400">
                  {portfolioStats.gainers}
                </p>
                <p className="text-xs text-gray-400">Gainers</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-red-400">
                  {portfolioStats.losers}
                </p>
                <p className="text-xs text-gray-400">Losers</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search collection..."
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
              <option value="gainers">Gainers</option>
              <option value="losers">Losers</option>
              <option value="expensive">High Value ($100+)</option>
              <option value="foil">Foil Cards</option>
            </select>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="value">Sort by Value</option>
              <option value="change">Sort by Change</option>
              <option value="alphabetical">Sort Alphabetically</option>
              <option value="dateAdded">Sort by Date Added</option>
            </select>

            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
              <Plus className="w-5 h-5" />
              Add Cards
            </button>

            <div className="flex gap-2">
              <button className="flex items-center justify-center gap-2 px-3 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                <Upload className="w-5 h-5" />
                Import
              </button>
              <button className="flex items-center justify-center gap-2 px-3 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                <Download className="w-5 h-5" />
                Export
              </button>
            </div>
          </div>
        </motion.div>

        {/* Collection List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {filteredCollection.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-600 hover:border-slate-500 transition-all"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                {/* Card Info */}
                <div className="lg:col-span-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center">
                      <Package className="text-purple-400 w-8 h-8" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-white">
                          {card.name}
                        </h3>
                        {card.foil && (
                          <Star className="w-4 h-4 text-yellow-400" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300 mt-1">
                        <span>{card.set}</span>
                        <span>•</span>
                        <span className={getRarityColor(card.rarity)}>
                          {card.rarity}
                        </span>
                        <span>•</span>
                        <span>{card.condition}</span>
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        Added: {formatDate(card.dateAdded)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quantity */}
                <div className="lg:col-span-1 text-center">
                  <div className="text-sm text-gray-400 mb-1">Qty</div>
                  <div className="text-2xl font-bold text-white">
                    {card.quantity}
                  </div>
                </div>

                {/* Current Price */}
                <div className="lg:col-span-2 text-center">
                  <div className="text-sm text-gray-400 mb-1">
                    Current Price
                  </div>
                  <div className="text-xl font-bold text-blue-400">
                    {formatCurrency(card.currentPrice)}
                  </div>
                  <div className="text-sm text-gray-400">
                    Avg Cost: {formatCurrency(card.avgCost)}
                  </div>
                </div>

                {/* Total Value */}
                <div className="lg:col-span-2 text-center">
                  <div className="text-sm text-gray-400 mb-1">Total Value</div>
                  <div className="text-xl font-bold text-green-400">
                    {formatCurrency(card.totalValue)}
                  </div>
                </div>

                {/* Price Change */}
                <div className="lg:col-span-2 text-center">
                  <div className="text-sm text-gray-400 mb-1">24h Change</div>
                  <div
                    className={`text-xl font-bold flex items-center justify-center gap-1 ${
                      card.priceChange > 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {card.priceChange > 0 ? (
                      <TrendingUp className="w-5 h-5" />
                    ) : (
                      <TrendingDown className="w-5 h-5" />
                    )}
                    {card.priceChange > 0 ? '+' : ''}
                    {card.priceChange}%
                  </div>
                </div>

                {/* Actions */}
                <div className="lg:col-span-1 text-center">
                  <button className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Value Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>Performance vs Cost</span>
                  <span>
                    {(
                      ((card.currentPrice - card.avgCost) / card.avgCost) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      card.currentPrice >= card.avgCost
                        ? 'bg-gradient-to-r from-green-500 to-blue-500'
                        : 'bg-gradient-to-r from-red-500 to-orange-500'
                    }`}
                    style={{
                      width: `${Math.min(Math.abs(((card.currentPrice - card.avgCost) / card.avgCost) * 100), 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredCollection.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
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

export default CollectionPortfolio;
