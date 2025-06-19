import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  TrendingUp,
  Users,
  Star,
  Filter,
  Plus,
  Percent,
  Target,
  Zap,
  Crown,
  Shuffle,
} from 'lucide-react';

const CommanderRecommendations = () => {
  const [selectedCommander, setSelectedCommander] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [clipboard, setClipboard] = useState([]);

  // Mock commander data
  const commanders = [
    {
      id: 1,
      name: "Atraxa, Praetors' Voice",
      colors: ['W', 'U', 'B', 'G'],
      manaCost: 4,
      deckCount: 15420,
      rank: 1,
      themes: ['Counters', 'Proliferate', 'Value'],
      powerLevel: 8.2,
    },
    {
      id: 2,
      name: 'Edgar Markov',
      colors: ['W', 'B', 'R'],
      manaCost: 6,
      deckCount: 12890,
      rank: 2,
      themes: ['Tribal', 'Vampires', 'Aggressive'],
      powerLevel: 7.8,
    },
  ];

  // Mock card recommendations
  const getCardRecommendations = commanderId => {
    const recommendations = {
      1: [
        {
          name: 'Doubling Season',
          type: 'Enchantment',
          manaCost: 5,
          synergy: 98,
          inclusion: 87,
          price: 45.99,
          category: 'Counters',
          description: 'Doubles all counters placed on permanents',
        },
      ],
    };
    return recommendations[commanderId] || [];
  };

  const filteredCommanders = useMemo(() => {
    return commanders
      .filter(commander => {
        const matchesSearch = commander.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesFilter =
          filterBy === 'all' ||
          (filterBy === 'popular' && commander.rank <= 10) ||
          (filterBy === 'competitive' && commander.powerLevel >= 8.0);
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'popularity':
            return a.rank - b.rank;
          case 'power':
            return b.powerLevel - a.powerLevel;
          case 'alphabetical':
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
  }, [searchTerm, filterBy, sortBy]);

  const addToClipboard = card => {
    if (!clipboard.find(c => c.name === card.name)) {
      setClipboard([...clipboard, card]);
    }
  };

  const getColorSymbols = colors => {
    const colorMap = {
      W: '⚪',
      U: '🔵',
      B: '⚫',
      R: '🔴',
      G: '🟢',
    };
    return colors.map(color => colorMap[color]).join('');
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
            <Crown className="text-yellow-400" />
            Commander Recommendations
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Discover the perfect cards for your commander with data-driven
            recommendations from thousands of decks
          </p>
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
                placeholder="Search commanders..."
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
              <option value="all">All Commanders</option>
              <option value="popular">Most Popular</option>
              <option value="competitive">Competitive</option>
            </select>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="popularity">Sort by Popularity</option>
              <option value="power">Sort by Power Level</option>
              <option value="alphabetical">Sort Alphabetically</option>
            </select>

            <div className="flex items-center justify-between bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3">
              <span className="text-white">Clipboard: {clipboard.length}</span>
              <button className="text-purple-400 hover:text-purple-300">
                Export
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Commander List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Users className="text-blue-400" />
              Commanders ({filteredCommanders.length})
            </h2>

            <div className="space-y-4 max-h-[800px] overflow-y-auto">
              {filteredCommanders.map(commander => (
                <motion.div
                  key={commander.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCommander(commander)}
                  className={`bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 cursor-pointer border-2 transition-all ${
                    selectedCommander?.id === commander.id
                      ? 'border-purple-500 bg-purple-900/20'
                      : 'border-slate-600 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center">
                      <Crown className="text-yellow-400 w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-lg">
                        {commander.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-300 mt-1">
                        <span>{getColorSymbols(commander.colors)}</span>
                        <span>•</span>
                        <span>#{commander.rank}</span>
                        <span>•</span>
                        <span>
                          {commander.deckCount.toLocaleString()} decks
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm text-gray-300">
                            {commander.powerLevel}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {commander.themes.slice(0, 2).map((theme, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-purple-600/30 text-purple-300 text-xs rounded"
                            >
                              {theme}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Card Recommendations */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            {selectedCommander ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Target className="text-green-400" />
                    Recommendations for {selectedCommander.name}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <TrendingUp className="w-4 h-4" />
                    Based on {selectedCommander.deckCount.toLocaleString()}{' '}
                    decks
                  </div>
                </div>

                <div className="space-y-4">
                  {getCardRecommendations(selectedCommander.id).map(
                    (card, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-600"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-white">
                                {card.name}
                              </h3>
                              <span className="px-2 py-1 bg-blue-600/30 text-blue-300 text-sm rounded">
                                {card.type}
                              </span>
                              <span className="px-2 py-1 bg-purple-600/30 text-purple-300 text-sm rounded">
                                {card.category}
                              </span>
                            </div>

                            <p className="text-gray-300 mb-4">
                              {card.description}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                  <Zap className="w-4 h-4 text-yellow-400" />
                                  <span className="text-sm text-gray-400">
                                    Synergy
                                  </span>
                                </div>
                                <div className="text-2xl font-bold text-yellow-400">
                                  {card.synergy}%
                                </div>
                              </div>

                              <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                  <Percent className="w-4 h-4 text-green-400" />
                                  <span className="text-sm text-gray-400">
                                    Inclusion
                                  </span>
                                </div>
                                <div className="text-2xl font-bold text-green-400">
                                  {card.inclusion}%
                                </div>
                              </div>

                              <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                  <span className="text-sm text-gray-400">
                                    Mana Cost
                                  </span>
                                </div>
                                <div className="text-2xl font-bold text-blue-400">
                                  {card.manaCost}
                                </div>
                              </div>

                              <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                  <span className="text-sm text-gray-400">
                                    Price
                                  </span>
                                </div>
                                <div className="text-2xl font-bold text-green-400">
                                  ${card.price}
                                </div>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => addToClipboard(card)}
                            className="ml-4 p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                      </motion.div>
                    ),
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 bg-slate-800/30 rounded-lg border-2 border-dashed border-slate-600">
                <div className="text-center">
                  <Shuffle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-400 mb-2">
                    Select a Commander
                  </h3>
                  <p className="text-gray-500">
                    Choose a commander from the list to see personalized card
                    recommendations
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CommanderRecommendations;
