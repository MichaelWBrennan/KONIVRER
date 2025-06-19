import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  Star,
  Filter,
  Search,
  Download,
  Eye,
  Heart,
  Trophy,
  Users,
  Clock,
  Target,
} from 'lucide-react';

const BudgetDecks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('standard');
  const [priceRange, setPriceRange] = useState('budget');
  const [sortBy, setSortBy] = useState('popularity');
  const [favoriteDecks, setFavoriteDecks] = useState(new Set());

  // Mock budget deck data
  const [budgetDecks] = useState([
    {
      id: 1,
      name: 'Lightning Rush',
      hero: 'Flame Dancer Kai',
      format: 'Standard',
      price: 45,
      winRate: 68.5,
      popularity: 15.2,
      difficulty: 'Easy',
      archetype: 'Aggro',
      description:
        'Fast and aggressive deck that wins through direct damage and quick creatures.',
      keyCards: ['Lightning Strike', 'Flame Burst', 'Quick Draw'],
      author: 'BudgetMaster',
      dateCreated: '2024-06-10',
      matches: 1247,
      wins: 854,
      image: '/api/placeholder/300/200',
      tags: ['Beginner Friendly', 'Fast Games', 'Competitive'],
      upgradePath: {
        tier2Price: 85,
        tier3Price: 150,
        tier2Cards: ['Premium Lightning', 'Elite Flame Dancer'],
        tier3Cards: ['Legendary Fire Sword', 'Ancient Flame Spirit'],
      },
    },
    {
      id: 2,
      name: "Nature's Might",
      hero: 'Grove Guardian Elm',
      format: 'Standard',
      price: 38,
      winRate: 62.3,
      popularity: 12.8,
      difficulty: 'Medium',
      archetype: 'Midrange',
      description:
        "Balanced deck using nature's power with efficient creatures and spells.",
      keyCards: ['Forest Growth', 'Wild Companion', "Nature's Blessing"],
      author: 'EcoWarrior',
      dateCreated: '2024-06-08',
      matches: 892,
      wins: 556,
      image: '/api/placeholder/300/200',
      tags: ['Versatile', 'Good Value', 'Stable'],
      upgradePath: {
        tier2Price: 75,
        tier3Price: 140,
        tier2Cards: ['Ancient Grove', 'Elite Guardian'],
        tier3Cards: ['World Tree', "Gaia's Champion"],
      },
    },
    {
      id: 3,
      name: 'Shadow Weaver',
      hero: 'Nyx, Shadow Weaver',
      format: 'Standard',
      price: 52,
      winRate: 59.7,
      popularity: 9.4,
      difficulty: 'Hard',
      archetype: 'Combo',
      description:
        'Complex combo deck that manipulates shadows for powerful late-game plays.',
      keyCards: ['Shadow Manipulation', 'Dark Ritual', 'Void Walker'],
      author: 'ComboKing',
      dateCreated: '2024-06-05',
      matches: 634,
      wins: 378,
      image: '/api/placeholder/300/200',
      tags: ['High Skill', 'Combo', 'Rewarding'],
      upgradePath: {
        tier2Price: 95,
        tier3Price: 180,
        tier2Cards: ['Master Shadow Weaver', 'Elite Void Walker'],
        tier3Cards: ['Legendary Shadow Realm', 'Ancient Darkness'],
      },
    },
    {
      id: 4,
      name: 'Steel Defense',
      hero: 'Iron Wall Gareth',
      format: 'Standard',
      price: 41,
      winRate: 64.1,
      popularity: 11.7,
      difficulty: 'Easy',
      archetype: 'Control',
      description:
        'Defensive control deck that wins through attrition and powerful late-game threats.',
      keyCards: ['Steel Barrier', 'Defensive Stance', 'Iron Resolve'],
      author: 'DefenseFirst',
      dateCreated: '2024-06-12',
      matches: 1089,
      wins: 698,
      image: '/api/placeholder/300/200',
      tags: ['Defensive', 'Late Game', 'Consistent'],
      upgradePath: {
        tier2Price: 80,
        tier3Price: 160,
        tier2Cards: ['Fortress Wall', 'Elite Guardian'],
        tier3Cards: ['Legendary Fortress', 'Immortal Defender'],
      },
    },
    {
      id: 5,
      name: 'Wind Walker',
      hero: 'Wind Walker Aria',
      format: 'Standard',
      price: 49,
      winRate: 61.8,
      popularity: 8.9,
      difficulty: 'Medium',
      archetype: 'Tempo',
      description:
        'Tempo-based deck that controls the pace of the game with efficient threats.',
      keyCards: ['Wind Slash', 'Swift Strike', 'Aerial Maneuver'],
      author: 'TempoMaster',
      dateCreated: '2024-06-07',
      matches: 756,
      wins: 467,
      image: '/api/placeholder/300/200',
      tags: ['Tempo', 'Flexible', 'Interactive'],
      upgradePath: {
        tier2Price: 90,
        tier3Price: 170,
        tier2Cards: ['Master Wind Walker', 'Elite Aerial Unit'],
        tier3Cards: ['Legendary Storm Lord', 'Ancient Wind Spirit'],
      },
    },
    {
      id: 6,
      name: 'Artifact Assembly',
      hero: 'Tinker Zara',
      format: 'Standard',
      price: 55,
      winRate: 57.2,
      popularity: 7.3,
      difficulty: 'Hard',
      archetype: 'Ramp',
      description:
        'Artifact-based ramp deck that builds towards powerful late-game constructs.',
      keyCards: ['Scrap Assembly', 'Gear Works', 'Mechanical Marvel'],
      author: 'ArtifactLover',
      dateCreated: '2024-06-03',
      matches: 523,
      wins: 299,
      image: '/api/placeholder/300/200',
      tags: ['Artifacts', 'Ramp', 'Big Plays'],
      upgradePath: {
        tier2Price: 105,
        tier3Price: 200,
        tier2Cards: ['Master Tinker', 'Elite Construct'],
        tier3Cards: ['Legendary Workshop', 'Ancient Automaton'],
      },
    },
  ]);

  const [priceRanges] = useState([
    { value: 'ultra', label: 'Ultra Budget (<$30)', max: 30 },
    { value: 'budget', label: 'Budget ($30-$60)', max: 60 },
    { value: 'mid', label: 'Mid Budget ($60-$100)', max: 100 },
    { value: 'competitive', label: 'Competitive Budget ($100-$150)', max: 150 },
  ]);

  const filteredDecks = budgetDecks.filter(deck => {
    const matchesSearch =
      deck.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deck.hero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deck.archetype.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFormat =
      selectedFormat === 'all' ||
      deck.format.toLowerCase() === selectedFormat.toLowerCase();

    const selectedRange = priceRanges.find(range => range.value === priceRange);
    const matchesPrice = !selectedRange || deck.price <= selectedRange.max;

    return matchesSearch && matchesFormat && matchesPrice;
  });

  const sortedDecks = [...filteredDecks].sort((a, b) => {
    switch (sortBy) {
      case 'popularity':
        return b.popularity - a.popularity;
      case 'winrate':
        return b.winRate - a.winRate;
      case 'price_low':
        return a.price - b.price;
      case 'price_high':
        return b.price - a.price;
      case 'newest':
        return new Date(b.dateCreated) - new Date(a.dateCreated);
      default:
        return 0;
    }
  });

  const toggleFavorite = deckId => {
    const newFavorites = new Set(favoriteDecks);
    if (newFavorites.has(deckId)) {
      newFavorites.delete(deckId);
    } else {
      newFavorites.add(deckId);
    }
    setFavoriteDecks(newFavorites);
  };

  const getDifficultyColor = difficulty => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-400';
      case 'Medium':
        return 'text-yellow-400';
      case 'Hard':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getArchetypeColor = archetype => {
    switch (archetype) {
      case 'Aggro':
        return 'bg-red-500';
      case 'Control':
        return 'bg-blue-500';
      case 'Midrange':
        return 'bg-green-500';
      case 'Combo':
        return 'bg-purple-500';
      case 'Tempo':
        return 'bg-cyan-500';
      case 'Ramp':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Budget Deck Collection
          </h1>
          <p className="text-gray-300 text-lg">
            Competitive decks that won't break the bank
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Budget Decks</p>
                <p className="text-2xl font-bold text-green-400">
                  {budgetDecks.length}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg Win Rate</p>
                <p className="text-2xl font-bold text-blue-400">62.3%</p>
              </div>
              <Trophy className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Matches</p>
                <p className="text-2xl font-bold text-purple-400">5,141</p>
              </div>
              <Target className="w-8 h-8 text-purple-400" />
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg Price</p>
                <p className="text-2xl font-bold text-yellow-400">$47</p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-400" />
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
                placeholder="Search decks..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Format */}
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

            {/* Price Range */}
            <select
              value={priceRange}
              onChange={e => setPriceRange(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              {priceRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="popularity">Most Popular</option>
              <option value="winrate">Highest Win Rate</option>
              <option value="price_low">Price (Low to High)</option>
              <option value="price_high">Price (High to Low)</option>
              <option value="newest">Newest</option>
            </select>

            {/* Export */}
            <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors flex items-center justify-center">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </motion.div>

        {/* Deck Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {sortedDecks.map(deck => (
            <motion.div
              key={deck.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 overflow-hidden"
            >
              {/* Deck Header */}
              <div className="relative p-6 pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-xl mb-1">{deck.name}</h3>
                    <p className="text-gray-400 text-sm">{deck.hero}</p>
                  </div>
                  <button
                    onClick={() => toggleFavorite(deck.id)}
                    className={`p-2 rounded-full transition-colors ${
                      favoriteDecks.has(deck.id)
                        ? 'text-red-400 hover:text-red-300'
                        : 'text-gray-400 hover:text-red-400'
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${favoriteDecks.has(deck.id) ? 'fill-current' : ''}`}
                    />
                  </button>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getArchetypeColor(deck.archetype)} text-white`}
                  >
                    {deck.archetype}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-600 text-white">
                    {deck.format}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(deck.difficulty)}`}
                  >
                    {deck.difficulty}
                  </span>
                </div>

                {/* Price and Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      ${deck.price}
                    </div>
                    <div className="text-gray-400 text-xs">Total Cost</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-400">
                      {deck.winRate}%
                    </div>
                    <div className="text-gray-400 text-xs">Win Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-400">
                      {deck.popularity}%
                    </div>
                    <div className="text-gray-400 text-xs">Meta Share</div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm mb-4">{deck.description}</p>

                {/* Key Cards */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">
                    Key Cards:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {deck.keyCards.map((card, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-700 rounded text-xs"
                      >
                        {card}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Upgrade Path */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">
                    Upgrade Path:
                  </h4>
                  <div className="text-xs text-gray-300 space-y-1">
                    <div>
                      Tier 2: ${deck.upgradePath.tier2Price} (+
                      {deck.upgradePath.tier2Cards.join(', ')})
                    </div>
                    <div>
                      Tier 3: ${deck.upgradePath.tier3Price} (+
                      {deck.upgradePath.tier3Cards.join(', ')})
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-400 mb-4">
                  <div className="flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    {deck.matches} matches
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {deck.dateCreated}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button className="flex-1 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors text-sm">
                    View Decklist
                  </button>
                  <button className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors text-sm">
                    Copy Build
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {sortedDecks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">
              No budget decks found
            </h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BudgetDecks;
