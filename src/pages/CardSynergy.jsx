import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Search,
  Filter,
  TrendingUp,
  Link,
  Target,
  Star,
  Plus,
  ArrowRight,
  BarChart3,
  Lightbulb,
  Users,
  Crown,
  Sparkles,
  Network,
} from 'lucide-react';

const CardSynergy = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('synergy');
  const [clipboard, setClipboard] = useState([]);

  // Mock card data
  const cards = [
    {
      id: 1,
      name: 'Doubling Season',
      type: 'Enchantment',
      manaCost: 5,
      colors: ['G'],
      image: '/api/placeholder/200/280',
      description:
        'If an effect would create one or more tokens under your control, it creates twice that many of those tokens instead.',
      playRate: 15.8,
      synergyCards: [
        {
          name: 'Parallel Lives',
          synergy: 98,
          inclusion: 89,
          type: 'Enchantment',
          reason: 'Both double token creation for exponential value',
        },
        {
          name: 'Anointed Procession',
          synergy: 96,
          inclusion: 85,
          type: 'Enchantment',
          reason: 'Another token doubler that stacks multiplicatively',
        },
        {
          name: 'Rhys the Redeemed',
          synergy: 94,
          inclusion: 78,
          type: 'Creature',
          reason: 'Creates tokens that get doubled by Doubling Season',
        },
        {
          name: 'Craterhoof Behemoth',
          synergy: 92,
          inclusion: 82,
          type: 'Creature',
          reason: 'Massive pump effect for all the doubled tokens',
        },
        {
          name: 'Avenger of Zendikar',
          synergy: 91,
          inclusion: 76,
          type: 'Creature',
          reason: 'Creates many tokens that get doubled',
        },
      ],
      themes: ['Tokens', 'Counters', 'Value'],
      commanders: [
        { name: 'Rhys the Redeemed', decks: 2150, synergy: 94 },
        { name: "Trostani, Selesnya's Voice", decks: 1890, synergy: 91 },
        { name: "Atraxa, Praetors' Voice", decks: 1650, synergy: 88 },
      ],
    },
    {
      id: 2,
      name: 'Sol Ring',
      type: 'Artifact',
      manaCost: 1,
      colors: [],
      image: '/api/placeholder/200/280',
      description: 'Tap: Add two colorless mana.',
      playRate: 89.2,
      synergyCards: [
        {
          name: 'Mana Vault',
          synergy: 85,
          inclusion: 45,
          type: 'Artifact',
          reason: 'Fast mana acceleration package',
        },
        {
          name: 'Mana Crypt',
          synergy: 84,
          inclusion: 38,
          type: 'Artifact',
          reason: 'Another explosive mana rock',
        },
        {
          name: 'Ancient Tomb',
          synergy: 82,
          inclusion: 42,
          type: 'Land',
          reason: 'Land-based fast mana',
        },
        {
          name: 'Thran Dynamo',
          synergy: 78,
          inclusion: 35,
          type: 'Artifact',
          reason: 'Higher cost mana rock for big plays',
        },
        {
          name: 'Gilded Lotus',
          synergy: 76,
          inclusion: 28,
          type: 'Artifact',
          reason: 'Expensive but powerful mana rock',
        },
      ],
      themes: ['Ramp', 'Artifacts', 'Fast Mana'],
      commanders: [
        { name: 'Urza, Lord High Artificer', decks: 2450, synergy: 92 },
        { name: 'Breya, Etherium Shaper', decks: 2100, synergy: 88 },
        { name: 'Jhoira, Weatherlight Captain', decks: 1890, synergy: 86 },
      ],
    },
    {
      id: 3,
      name: 'Rhystic Study',
      type: 'Enchantment',
      manaCost: 3,
      colors: ['U'],
      image: '/api/placeholder/200/280',
      description:
        'Whenever an opponent casts a spell, you may draw a card unless that player pays 1.',
      playRate: 42.6,
      synergyCards: [
        {
          name: 'Mystic Remora',
          synergy: 89,
          inclusion: 68,
          type: 'Enchantment',
          reason: 'Another tax-based card draw engine',
        },
        {
          name: 'Smothering Tithe',
          synergy: 87,
          inclusion: 72,
          type: 'Enchantment',
          reason: 'Tax opponents for mana while you draw cards',
        },
        {
          name: 'Consecrated Sphinx',
          synergy: 85,
          inclusion: 58,
          type: 'Creature',
          reason: 'Powerful card draw that benefits from opponents drawing',
        },
        {
          name: "Teferi's Ageless Insight",
          synergy: 83,
          inclusion: 45,
          type: 'Enchantment',
          reason: 'Doubles the cards drawn from Rhystic Study',
        },
        {
          name: 'Reliquary Tower',
          synergy: 81,
          inclusion: 78,
          type: 'Land',
          reason: 'No maximum hand size for all the cards drawn',
        },
      ],
      themes: ['Card Draw', 'Tax Effects', 'Value'],
      commanders: [
        { name: "Atraxa, Praetors' Voice", decks: 3200, synergy: 89 },
        { name: 'Chulane, Teller of Tales', decks: 2800, synergy: 87 },
        { name: 'Tatyova, Benthic Druid', decks: 2100, synergy: 85 },
      ],
    },
  ];

  const filteredCards = useMemo(() => {
    return cards
      .filter(card => {
        const matchesSearch =
          card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.themes.some(theme =>
            theme.toLowerCase().includes(searchTerm.toLowerCase()),
          );
        const matchesFilter =
          filterBy === 'all' ||
          (filterBy === 'popular' && card.playRate >= 30) ||
          (filterBy === 'artifacts' && card.type === 'Artifact') ||
          (filterBy === 'enchantments' && card.type === 'Enchantment') ||
          (filterBy === 'creatures' && card.type === 'Creature');
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'synergy':
            return b.synergyCards[0]?.synergy - a.synergyCards[0]?.synergy;
          case 'popularity':
            return b.playRate - a.playRate;
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
    if (colors.length === 0) return '⚫'; // Colorless
    const colorMap = {
      W: '⚪',
      U: '🔵',
      B: '⚫',
      R: '🔴',
      G: '🟢',
    };
    return colors.map(color => colorMap[color]).join('');
  };

  const getSynergyColor = synergy => {
    if (synergy >= 90) return 'text-green-400';
    if (synergy >= 80) return 'text-blue-400';
    if (synergy >= 70) return 'text-yellow-400';
    return 'text-gray-400';
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
            <Network className="text-purple-400" />
            Card Synergy Explorer
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Discover powerful card combinations and synergies based on real deck
            data and community insights
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
              <option value="all">All Card Types</option>
              <option value="popular">Popular Cards</option>
              <option value="artifacts">Artifacts</option>
              <option value="enchantments">Enchantments</option>
              <option value="creatures">Creatures</option>
            </select>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="synergy">Sort by Synergy</option>
              <option value="popularity">Sort by Popularity</option>
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
          {/* Card List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Zap className="text-yellow-400" />
              Cards ({filteredCards.length})
            </h2>

            <div className="space-y-4 max-h-[800px] overflow-y-auto">
              {filteredCards.map(card => (
                <motion.div
                  key={card.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCard(card)}
                  className={`bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 cursor-pointer border-2 transition-all ${
                    selectedCard?.id === card.id
                      ? 'border-purple-500 bg-purple-900/20'
                      : 'border-slate-600 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center">
                      <Sparkles className="text-purple-400 w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-lg">
                        {card.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-300 mt-1">
                        <span>{getColorSymbols(card.colors)}</span>
                        <span>•</span>
                        <span>{card.type}</span>
                        <span>•</span>
                        <span>CMC {card.manaCost}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-gray-300">
                            {card.playRate}%
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {card.themes.slice(0, 2).map((theme, index) => (
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

          {/* Synergy Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            {selectedCard ? (
              <div className="space-y-6">
                {/* Card Header */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-600">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-3xl font-bold text-white">
                        {selectedCard.name}
                      </h2>
                      <div className="flex items-center gap-2 text-gray-300 mt-1">
                        <span>{getColorSymbols(selectedCard.colors)}</span>
                        <span>•</span>
                        <span>{selectedCard.type}</span>
                        <span>•</span>
                        <span>CMC {selectedCard.manaCost}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-gray-300">
                          {selectedCard.playRate}% play rate
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => addToClipboard(selectedCard)}
                      className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-gray-300 mb-4">
                    {selectedCard.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {selectedCard.themes.map((theme, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-600/30 text-purple-300 rounded-lg"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Synergy Cards */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-600">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Link className="text-blue-400" />
                    Best Synergies
                  </h3>
                  <div className="space-y-4">
                    {selectedCard.synergyCards.map((synCard, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-slate-700/50 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-lg font-bold text-white">
                                {synCard.name}
                              </h4>
                              <span className="px-2 py-1 bg-blue-600/30 text-blue-300 text-sm rounded">
                                {synCard.type}
                              </span>
                            </div>

                            <p className="text-gray-300 text-sm mb-3">
                              {synCard.reason}
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                  <Zap className="w-4 h-4 text-yellow-400" />
                                  <span className="text-sm text-gray-400">
                                    Synergy
                                  </span>
                                </div>
                                <div
                                  className={`text-xl font-bold ${getSynergyColor(synCard.synergy)}`}
                                >
                                  {synCard.synergy}%
                                </div>
                              </div>

                              <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                  <BarChart3 className="w-4 h-4 text-green-400" />
                                  <span className="text-sm text-gray-400">
                                    Inclusion
                                  </span>
                                </div>
                                <div className="text-xl font-bold text-green-400">
                                  {synCard.inclusion}%
                                </div>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => addToClipboard(synCard)}
                            className="ml-4 p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Popular Commanders */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-600">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Crown className="text-yellow-400" />
                    Popular in These Commanders
                  </h3>
                  <div className="space-y-3">
                    {selectedCard.commanders.map((commander, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                      >
                        <div>
                          <h4 className="font-bold text-white">
                            {commander.name}
                          </h4>
                          <div className="text-sm text-gray-400">
                            {commander.decks.toLocaleString()} decks
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`text-lg font-bold ${getSynergyColor(commander.synergy)}`}
                          >
                            {commander.synergy}%
                          </div>
                          <div className="text-sm text-gray-400">Synergy</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Synergy Tips */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-600">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Lightbulb className="text-yellow-400" />
                    Synergy Tips
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-blue-900/20 border border-blue-500 rounded-lg">
                      <Target className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-blue-400 mb-1">
                          Deck Building Tip
                        </h4>
                        <p className="text-gray-300 text-sm">
                          Include multiple cards from the same synergy package
                          to increase consistency and power level.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-900/20 border border-green-500 rounded-lg">
                      <Users className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-green-400 mb-1">
                          Meta Consideration
                        </h4>
                        <p className="text-gray-300 text-sm">
                          High synergy cards often become priority removal
                          targets. Include protection spells.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 bg-slate-800/30 rounded-lg border-2 border-dashed border-slate-600">
                <div className="text-center">
                  <Network className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-400 mb-2">
                    Select a Card
                  </h3>
                  <p className="text-gray-500">
                    Choose a card from the list to explore its synergies and
                    combinations
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

export default CardSynergy;
