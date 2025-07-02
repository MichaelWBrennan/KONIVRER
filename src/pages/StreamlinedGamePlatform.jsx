/**
 * KONIVRER Deck Database
 * 
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

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
  Target,
  Wrench,
  Globe,
  Bot,
} from 'lucide-react';

// Import existing components
import CardDatabase from '../components/CardDatabase';
import VisualDeckBuilder from '../components/VisualDeckBuilder';
import GameSimulator from '../components/GameSimulator';
import DeckStats from '../components/DeckStats';
import MetaAnalysis from '../components/MetaAnalysis';
import CollectionManager from '../components/CollectionManager';
import AIAssistant from '../components/AIAssistant';
import AdvancedSearch from '../components/AdvancedSearch';
import BattlePass from './BattlePass';

const StreamlinedGamePlatform = () => {
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

  const handleAdvancedSearch = criteria => {
    setActiveSearchCriteria(criteria);
    setShowAdvancedSearch(false);
    // Mock search results
    setSearchResults([
      { id: 1, name: 'Lightning Bolt', type: 'Spell', rarity: 'Common' },
      { id: 2, name: 'Forest Guardian', type: 'Familiar', rarity: 'Rare' },
    ]);
  };

  const platformSections = [
    {
      id: 'card-explorer',
      title: 'Card Explorer',
      subtitle: 'Discover & Browse',
      icon: Database,
      color: 'from-blue-500 to-cyan-500',
      description:
        'Search, filter, and explore the complete card database with advanced tools',
    },
    {
      id: 'deck-workshop',
      title: 'Deck Workshop',
      subtitle: 'Build & Analyze',
      icon: Wrench,
      color: 'from-green-500 to-emerald-500',
      description:
        'Build decks, analyze statistics, and manage your collection',
    },
    {
      id: 'game-simulator',
      title: 'Game Simulator',
      subtitle: 'Play & Practice',
      icon: Gamepad2,
      color: 'from-purple-500 to-violet-500',
      description:
        'Experience tournament-quality gameplay with our Talishar-style simulator',
    },
    {
      id: 'analytics-hub',
      title: 'Analytics Hub',
      subtitle: 'Meta & Market',
      icon: BarChart3,
      color: 'from-orange-500 to-red-500',
      description:
        'Real-time meta analysis, market data, and competitive insights',
    },
    {
      id: 'community-tools',
      title: 'Community & Tools',
      subtitle: 'Social & AI',
      icon: Users,
      color: 'from-pink-500 to-rose-500',
      description:
        'Battle pass progression, AI assistance, and community features',
    },
  ];

  const [activeSection, setActiveSection] = useState('card-explorer');

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'card-explorer':
        return (
          <div className="space-y-6">
            {/* Search Interface */}
            <div className="bg-card rounded-lg p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Quick search cards, decks, players... or use Advanced Search for detailed filtering"
                    className="w-full pl-10 pr-4 py-3 border border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => setShowAdvancedSearch(true)}
                  className="btn btn-primary flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Advanced Search
                </button>
              </div>

              {activeSearchCriteria && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-800">
                      Active search: {JSON.stringify(activeSearchCriteria)}
                    </span>
                    <button
                      onClick={() => {
                        setActiveSearchCriteria(null);
                        setSearchResults(null);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Card Database */}
            <CardDatabase
              cards={searchResults}
              searchCriteria={activeSearchCriteria}
              showSearchInterface={true}
            />
          </div>
        );

      case 'deck-workshop':
        return (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Deck Builder */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Wrench className="w-6 h-6 text-green-500" />
                  <div>
                    <h2 className="text-xl font-bold">Deck Builder</h2>
                    <p className="text-secondary">Visual deck construction</p>
                  </div>
                </div>
                <VisualDeckBuilder deck={sampleDeck} />
              </div>
            </div>

            {/* Deck Stats & Collection */}
            <div className="space-y-6">
              <div className="bg-card rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  <h3 className="font-bold">Deck Analytics</h3>
                </div>
                <DeckStats deck={sampleDeck} />
              </div>

              <div className="bg-card rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Package className="w-5 h-5 text-purple-500" />
                  <h3 className="font-bold">Collection Manager</h3>
                </div>
                <CollectionManager />
              </div>
            </div>
          </div>
        );

      case 'game-simulator':
        return (
          <div className="bg-card rounded-lg overflow-hidden">
            <div className="p-6 border-b border-color">
              <div className="flex items-center gap-3">
                <Gamepad2 className="w-6 h-6 text-purple-500" />
                <div>
                  <h2 className="text-xl font-bold">Game Simulator</h2>
                  <p className="text-secondary">
                    Tournament-quality gameplay experience
                  </p>
                </div>
              </div>
            </div>
            <GameSimulator />
          </div>
        );

      case 'analytics-hub':
        return (
          <div className="space-y-6">
            {/* Meta Analysis */}
            <div className="bg-card rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-orange-500" />
                <div>
                  <h2 className="text-xl font-bold">
                    Meta Analysis & Market Data
                  </h2>
                  <p className="text-secondary">
                    Real-time competitive landscape insights
                  </p>
                </div>
              </div>
              <MetaAnalysis />
            </div>
          </div>
        );

      case 'community-tools':
        return (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Battle Pass */}
            <div className="bg-card rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <div>
                  <h2 className="text-xl font-bold">Battle Pass</h2>
                  <p className="text-secondary">
                    Season 3: Elemental Convergence
                  </p>
                </div>
              </div>
              <BattlePass />
            </div>

            {/* AI Assistant */}
            {isAuthenticated && (
              <div className="bg-card rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Bot className="w-6 h-6 text-blue-500" />
                  <div>
                    <h2 className="text-xl font-bold">AI Assistant</h2>
                    <p className="text-secondary">
                      Smart deck analysis and suggestions
                    </p>
                  </div>
                </div>
                <AIAssistant />
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-color">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Game Platform</h1>
            <p className="text-secondary text-lg">
              Your complete toolkit for KONIVRER card game mastery
            </p>
          </div>

          {/* Platform Sections Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {platformSections.map(section => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;

              return (
                <motion.button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`relative p-6 rounded-xl text-left transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-br ' +
                        section.color +
                        ' text-white shadow-lg scale-105'
                      : 'bg-tertiary hover:bg-card border border-color hover:shadow-md'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Icon
                      className={`w-6 h-6 ${isActive ? 'text-white' : 'text-primary'}`}
                    />
                    <div>
                      <h3
                        className={`font-bold ${isActive ? 'text-white' : 'text-primary'}`}
                      >
                        {section.title}
                      </h3>
                      <p
                        className={`text-sm ${isActive ? 'text-white/80' : 'text-secondary'}`}
                      >
                        {section.subtitle}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`text-sm ${isActive ? 'text-white/90' : 'text-secondary'}`}
                  >
                    {section.description}
                  </p>

                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-xl border-2 border-white/30"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
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
              className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <AdvancedSearch
                onSearch={handleAdvancedSearch}
                onClose={() => setShowAdvancedSearch(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StreamlinedGamePlatform;
