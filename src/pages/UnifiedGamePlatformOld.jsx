import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import {
  Search,
  TrendingUp,
  Users,
  Zap,
  Database,
  Gamepad2,
  BarChart3,
  Package,
  Star,
  Trophy,
  Filter,
  Sparkles,
} from 'lucide-react';

// Import existing components
import CardViewer from '../components/CardViewer';
import CardDatabase from '../components/CardDatabase';
import VisualDeckBuilder from '../components/VisualDeckBuilder';
import TalisharStyleGameSimulator from '../components/TalisharStyleGameSimulator';
import DeckStats from '../components/DeckStats';
import MetaAnalysis from '../components/MetaAnalysis';
import CollectionManager from '../components/CollectionManager';
import AIAssistant from '../components/AIAssistant';
import AdvancedSearch from '../components/AdvancedSearch';

// Import remaining components
import BattlePass from './BattlePass';

const UnifiedGamePlatform = () => {
  const { isAuthenticated } = useAuth();
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [activeSearchCriteria, setActiveSearchCriteria] = useState(null);

  // Sample deck data for components that need it
  const sampleDeck = {
    name: 'Sample Deck',
    cards: [
      {
        id: 1,
        name: 'Lightning Bolt',
        cost: 1,
        elements: ['Inferno'],
        rarity: 'Common',
        count: 4,
      },
      {
        id: 2,
        name: 'Forest Guardian',
        cost: 3,
        elements: ['Steadfast'],
        rarity: 'Rare',
        count: 2,
      },
      {
        id: 3,
        name: 'Mystic Shield',
        cost: 2,
        elements: ['Submerged'],
        rarity: 'Uncommon',
        count: 3,
      },
    ],
  };

  // Sample cards data
  const sampleCards = [
    {
      id: 1,
      name: 'Lightning Bolt',
      cost: 1,
      elements: ['Inferno'],
      rarity: 'Common',
      type: 'Spell',
      set: 'PRIMA MATERIA',
      text: 'Deal 3 damage to any target.',
      keywords: ['Instant'],
      power: null,
      toughness: null,
    },
    {
      id: 2,
      name: 'Forest Guardian',
      cost: 3,
      elements: ['Steadfast'],
      rarity: 'Rare',
      type: 'Familiar',
      set: 'PRIMA MATERIA',
      text: 'When Forest Guardian enters play, gain 3 life.',
      keywords: ['Vigilance'],
      power: 2,
      toughness: 4,
    },
    {
      id: 3,
      name: 'Mystic Shield',
      cost: 2,
      elements: ['Submerged'],
      rarity: 'Uncommon',
      type: 'Enchantment',
      set: 'PRIMA MATERIA',
      text: 'Prevent the next 2 damage that would be dealt to you each turn.',
      keywords: ['Protection'],
      power: null,
      toughness: null,
    },
  ];

  // Handle advanced search
  const handleAdvancedSearch = criteria => {
    setActiveSearchCriteria(criteria);
    // Here you would typically make an API call with the search criteria
    // For now, we'll simulate filtering the sample cards
    const filteredCards = sampleCards.filter(card => {
      if (
        criteria.cardName &&
        !card.name.toLowerCase().includes(criteria.cardName.toLowerCase())
      ) {
        return false;
      }
      if (
        criteria.colors &&
        criteria.colors.length > 0 &&
        !criteria.colors.some(color => card.elements.includes(color))
      ) {
        return false;
      }
      if (
        criteria.rarity &&
        criteria.rarity.length > 0 &&
        !criteria.rarity.includes(card.rarity)
      ) {
        return false;
      }
      return true;
    });
    setSearchResults(filteredCards);
    setShowAdvancedSearch(false);
  };

  const clearSearch = () => {
    setSearchResults(null);
    setActiveSearchCriteria(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Unified Advanced Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {/* Quick Search Bar */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="flex-1 relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Quick search cards, decks, players... or use Advanced Search for detailed filtering"
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  onFocus={() => setShowAdvancedSearch(true)}
                />
              </div>
              <button
                onClick={() => setShowAdvancedSearch(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                <Filter className="w-5 h-5" />
                <span>Advanced Search</span>
              </button>
              {activeSearchCriteria && (
                <button
                  onClick={clearSearch}
                  className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* Active Search Summary */}
            {activeSearchCriteria && (
              <div className="mt-4 p-4 bg-purple-500/20 rounded-lg border border-purple-400/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-purple-300" />
                    <span className="text-purple-300 font-medium">
                      Active Search:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {activeSearchCriteria.cardName && (
                        <span className="px-2 py-1 bg-purple-500/30 text-purple-200 text-xs rounded">
                          Name: {activeSearchCriteria.cardName}
                        </span>
                      )}
                      {activeSearchCriteria.colors.length > 0 && (
                        <span className="px-2 py-1 bg-purple-500/30 text-purple-200 text-xs rounded">
                          Elements: {activeSearchCriteria.colors.join(', ')}
                        </span>
                      )}
                      {activeSearchCriteria.rarity.length > 0 && (
                        <span className="px-2 py-1 bg-purple-500/30 text-purple-200 text-xs rounded">
                          Rarity: {activeSearchCriteria.rarity.join(', ')}
                        </span>
                      )}
                      {activeSearchCriteria.sets.length > 0 && (
                        <span className="px-2 py-1 bg-purple-500/30 text-purple-200 text-xs rounded">
                          Sets: {activeSearchCriteria.sets.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-purple-300 text-sm">
                    {searchResults
                      ? `${searchResults.length} results`
                      : 'Searching...'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Advanced Search Modal */}
          <AnimatePresence>
            {showAdvancedSearch && (
              <AdvancedSearch
                onSearch={handleAdvancedSearch}
                onClose={() => setShowAdvancedSearch(false)}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Card Discovery & Database */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 p-6 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Database className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">
                  Card Discovery
                </h2>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm font-medium rounded-full">
                  12,847 Cards
                </span>
              </div>
              <div className="text-right">
                <p className="text-blue-300 text-sm font-medium">
                  🎯 Search by Set Required
                </p>
                <p className="text-blue-200 text-xs">
                  Select a card set to begin browsing
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <CardDatabase
              cards={searchResults || sampleCards}
              searchCriteria={activeSearchCriteria}
              showSearchInterface={true}
            />
          </div>
        </motion.div>

        {/* Deck Building Suite */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 xl:grid-cols-2 gap-8"
        >
          {/* Deck Builder */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-6 border-b border-white/20">
              <div className="flex items-center space-x-3">
                <Package className="w-6 h-6 text-green-400" />
                <h2 className="text-2xl font-bold text-white">Deck Builder</h2>
                <span className="px-3 py-1 bg-green-500/20 text-green-300 text-sm font-medium rounded-full">
                  Visual
                </span>
              </div>
            </div>
            <div className="p-6">
              <VisualDeckBuilder
                deck={sampleDeck}
                onDeckChange={() => {}}
                cards={sampleCards}
              />
            </div>
          </div>

          {/* Deck Analytics */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-6 border-b border-white/20">
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-6 h-6 text-green-400" />
                <h2 className="text-2xl font-bold text-white">
                  Deck Analytics
                </h2>
                <span className="px-3 py-1 bg-green-500/20 text-green-300 text-sm font-medium rounded-full">
                  Live Stats
                </span>
              </div>
            </div>
            <div className="p-6">
              <DeckStats deck={sampleDeck} />
            </div>
          </div>
        </motion.div>

        {/* Game Simulator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 p-6 border-b border-white/20">
            <div className="flex items-center space-x-3">
              <Gamepad2 className="w-6 h-6 text-red-400" />
              <h2 className="text-2xl font-bold text-white">Game Simulator</h2>
              <span className="px-3 py-1 bg-red-500/20 text-red-300 text-sm font-medium rounded-full">
                Interactive
              </span>
            </div>
          </div>
          <div className="p-6">
            <TalisharStyleGameSimulator />
          </div>
        </motion.div>

        {/* Meta Analysis & Market Data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-purple-500/20 to-violet-500/20 p-6 border-b border-white/20">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">
                Meta Analysis & Market Data
              </h2>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm font-medium rounded-full">
                Real-time
              </span>
            </div>
          </div>
          <div className="p-6">
            <MetaAnalysis />
          </div>
        </motion.div>

        {/* Collection & Personal Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-1 xl:grid-cols-2 gap-8"
        >
          {/* Collection Manager */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 p-6 border-b border-white/20">
              <div className="flex items-center space-x-3">
                <Star className="w-6 h-6 text-orange-400" />
                <h2 className="text-2xl font-bold text-white">
                  Collection Manager
                </h2>
                <span className="px-3 py-1 bg-orange-500/20 text-orange-300 text-sm font-medium rounded-full">
                  Personal
                </span>
              </div>
            </div>
            <div className="p-6">
              <CollectionManager />
            </div>
          </div>

          {/* Battle Pass */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 p-6 border-b border-white/20">
              <div className="flex items-center space-x-3">
                <Trophy className="w-6 h-6 text-orange-400" />
                <h2 className="text-2xl font-bold text-white">Battle Pass</h2>
                <span className="px-3 py-1 bg-orange-500/20 text-orange-300 text-sm font-medium rounded-full">
                  Season 3
                </span>
              </div>
            </div>
            <div className="p-6">
              <BattlePass />
            </div>
          </div>
        </motion.div>

        {/* AI Assistant */}
        {isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 p-6 border-b border-white/20">
              <div className="flex items-center space-x-3">
                <Zap className="w-6 h-6 text-indigo-400" />
                <h2 className="text-2xl font-bold text-white">AI Assistant</h2>
                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-sm font-medium rounded-full">
                  Smart Help
                </span>
              </div>
            </div>
            <div className="p-6">
              <AIAssistant />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UnifiedGamePlatform;
