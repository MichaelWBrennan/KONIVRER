import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Database,
  Gamepad2,
  BarChart3,
  Package,
  Star,
  Trophy,
  Filter,
  Sparkles,
  Settings,
  Users,
  Bot,
  TrendingUp,
  DollarSign,
  Target,
  Zap,
  Eye,
  Plus,
  Grid3X3,
  List,
} from 'lucide-react';

// Import existing components
import CardDatabase from '../components/CardDatabase';
import VisualDeckBuilder from '../components/VisualDeckBuilder';
import TalisharStyleGameSimulator from '../components/TalisharStyleGameSimulator';
import DeckStats from '../components/DeckStats';
import MetaAnalysis from '../components/MetaAnalysis';
import CollectionManager from '../components/CollectionManager';
import AIAssistant from '../components/AIAssistant';
import AdvancedSearch from '../components/AdvancedSearch';
import BattlePass from './BattlePass';

const UnifiedGamePlatformReorganized = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('cards');
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

  const handleSearch = (query, criteria) => {
    // Mock search functionality
    setSearchResults([]);
    setActiveSearchCriteria(criteria);
  };

  const handleAdvancedSearch = (criteria) => {
    setActiveSearchCriteria(criteria);
    setSearchResults([]);
    setShowAdvancedSearch(false);
  };

  // Navigation sections with combined tools
  const sections = [
    {
      id: 'cards',
      title: 'Card Explorer',
      subtitle: 'Browse & Search',
      icon: Database,
      description: 'Discover cards, advanced search, and detailed card information',
      color: 'from-blue-600 to-purple-600',
    },
    {
      id: 'deckbuilding',
      title: 'Deck Workshop',
      subtitle: 'Build & Analyze',
      icon: Target,
      description: 'Deck builder, statistics, validation, and optimization tools',
      color: 'from-green-600 to-blue-600',
    },
    {
      id: 'gameplay',
      title: 'Game Simulator',
      subtitle: 'Play & Practice',
      icon: Gamepad2,
      description: 'Interactive game simulator with AI opponents and tutorials',
      color: 'from-purple-600 to-pink-600',
    },
    {
      id: 'analytics',
      title: 'Meta & Market',
      subtitle: 'Data & Trends',
      icon: BarChart3,
      description: 'Meta analysis, market prices, and competitive insights',
      color: 'from-yellow-600 to-red-600',
    },
    {
      id: 'collection',
      title: 'Collection Hub',
      subtitle: 'Manage & Track',
      icon: Package,
      description: 'Collection management, wishlists, and progress tracking',
      color: 'from-indigo-600 to-purple-600',
    },
    {
      id: 'progression',
      title: 'Battle Pass',
      subtitle: 'Rewards & Goals',
      icon: Trophy,
      description: 'Seasonal rewards, achievements, and progression tracking',
      color: 'from-orange-600 to-yellow-600',
    },
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'cards':
        return (
          <div className="space-y-6">
            {/* Enhanced Card Database with integrated search */}
            <div className="bg-gray-800 rounded-xl border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                      <Database className="w-8 h-8 text-blue-400" />
                      Card Explorer
                    </h2>
                    <p className="text-gray-400 mt-1">Discover and explore the complete card database</p>
                  </div>
                  <button
                    onClick={() => setShowAdvancedSearch(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Filter className="w-4 h-4" />
                    Advanced Search
                  </button>
                </div>
              </div>
              <div className="p-6">
                <CardDatabase 
                  onCardClick={(card) => navigate(`/card/${card.id}`)}
                  showAdvancedSearch={showAdvancedSearch}
                  onAdvancedSearch={handleAdvancedSearch}
                />
              </div>
            </div>
          </div>
        );

      case 'deckbuilding':
        return (
          <div className="space-y-6">
            {/* Combined Deck Builder and Analytics */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Deck Builder */}
              <div className="xl:col-span-2 bg-gray-800 rounded-xl border border-gray-700">
                <div className="p-6 border-b border-gray-700">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Target className="w-8 h-8 text-green-400" />
                    Deck Workshop
                  </h2>
                  <p className="text-gray-400 mt-1">Build and optimize your decks</p>
                </div>
                <div className="p-6">
                  <VisualDeckBuilder deck={sampleDeck} />
                </div>
              </div>

              {/* Deck Analytics */}
              <div className="bg-gray-800 rounded-xl border border-gray-700">
                <div className="p-6 border-b border-gray-700">
                  <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 text-blue-400" />
                    Analytics
                  </h2>
                  <p className="text-gray-400 mt-1 text-sm">Live deck statistics</p>
                </div>
                <div className="p-6">
                  <DeckStats deck={sampleDeck} />
                </div>
              </div>
            </div>

            {/* AI Assistant for Deck Building */}
            <div className="bg-gray-800 rounded-xl border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <Bot className="w-6 h-6 text-purple-400" />
                  AI Deck Assistant
                </h2>
                <p className="text-gray-400 mt-1">Get intelligent suggestions and deck analysis</p>
              </div>
              <div className="p-6">
                <AIAssistant />
              </div>
            </div>
          </div>
        );

      case 'gameplay':
        return (
          <div className="space-y-6">
            {/* Game Simulator */}
            <div className="bg-gray-800 rounded-xl border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                      <Gamepad2 className="w-8 h-8 text-purple-400" />
                      Game Simulator
                    </h2>
                    <p className="text-gray-400 mt-1">Professional tournament-style gameplay</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
                      <Users className="w-4 h-4" />
                      Multiplayer
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                      <Bot className="w-4 h-4" />
                      vs AI
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors">
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <TalisharStyleGameSimulator />
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            {/* Meta Analysis */}
            <div className="bg-gray-800 rounded-xl border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                      <TrendingUp className="w-8 h-8 text-yellow-400" />
                      Meta Analysis & Market Data
                    </h2>
                    <p className="text-gray-400 mt-1">Competitive insights and market trends</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                      <Eye className="w-4 h-4" />
                      Live Data
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
                      <DollarSign className="w-4 h-4" />
                      Price Alerts
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <MetaAnalysis />
              </div>
            </div>
          </div>
        );

      case 'collection':
        return (
          <div className="space-y-6">
            {/* Collection Manager */}
            <div className="bg-gray-800 rounded-xl border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                      <Package className="w-8 h-8 text-indigo-400" />
                      Collection Hub
                    </h2>
                    <p className="text-gray-400 mt-1">Manage your card collection and wishlists</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
                      <Plus className="w-4 h-4" />
                      Add Cards
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                      <Star className="w-4 h-4" />
                      Wishlist
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <CollectionManager />
              </div>
            </div>
          </div>
        );

      case 'progression':
        return (
          <div className="space-y-6">
            {/* Battle Pass */}
            <div className="bg-gray-800 rounded-xl border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                      <Trophy className="w-8 h-8 text-yellow-400" />
                      Battle Pass & Progression
                    </h2>
                    <p className="text-gray-400 mt-1">Seasonal rewards and achievement tracking</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors">
                      <Sparkles className="w-4 h-4" />
                      Premium Pass
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <BattlePass />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Game Platform
              </h1>
              <p className="text-gray-400 mt-1">Your complete KONIVRER gaming experience</p>
            </div>

            {/* Global Search */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Quick search cards, decks, players..."
                  className="pl-10 pr-4 py-2 w-80 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setShowAdvancedSearch(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Advanced Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-80 flex-shrink-0">
            <div className="sticky top-32 space-y-2">
              {sections.map(section => (
                <motion.button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r ' + section.color + ' text-white shadow-lg'
                      : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <section.icon className="w-6 h-6" />
                    <div>
                      <div className="font-bold">{section.title}</div>
                      <div className="text-sm opacity-80">{section.subtitle}</div>
                    </div>
                  </div>
                  <p className="text-sm opacity-70">{section.description}</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderSectionContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Advanced Search Modal */}
      <AnimatePresence>
        {showAdvancedSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAdvancedSearch(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-xl border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Advanced Search</h2>
                  <button
                    onClick={() => setShowAdvancedSearch(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-6">
                <AdvancedSearch
                  onSearch={handleAdvancedSearch}
                  onClose={() => setShowAdvancedSearch(false)}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UnifiedGamePlatformReorganized;