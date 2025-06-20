import { useState } from 'react';
import { motion } from 'framer-motion';
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
} from 'lucide-react';

// Import existing components
import CardViewer from '../components/CardViewer';
import CardDatabase from '../components/CardDatabase';
import VisualDeckBuilder from '../components/VisualDeckBuilder';
import GameSimulatorSimple from '../components/GameSimulatorSimple';
import DeckStats from '../components/DeckStats';
import MetaAnalysis from '../components/MetaAnalysis';
import CollectionManager from '../components/CollectionManager';
import AIAssistant from '../components/AIAssistant';

// Import remaining components
import BattlePass from './BattlePass';

const UnifiedGamePlatform = () => {
  const [globalSearch, setGlobalSearch] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('all');

  // Sample deck data for components that need it
  const sampleDeck = {
    name: 'Sample Deck',
    cards: [
      {
        id: 1,
        name: 'Lightning Bolt',
        cost: 1,
        elements: ['Fire'],
        rarity: 'Common',
        count: 4,
      },
      {
        id: 2,
        name: 'Forest Guardian',
        cost: 3,
        elements: ['Nature'],
        rarity: 'Rare',
        count: 2,
      },
      {
        id: 3,
        name: 'Mystic Shield',
        cost: 2,
        elements: ['Water'],
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
      elements: ['Fire'],
      rarity: 'Common',
    },
    {
      id: 2,
      name: 'Forest Guardian',
      cost: 3,
      elements: ['Nature'],
      rarity: 'Rare',
    },
    {
      id: 3,
      name: 'Mystic Shield',
      cost: 2,
      elements: ['Water'],
      rarity: 'Uncommon',
    },
  ];

  // Platform statistics
  const platformStats = [
    {
      label: 'Total Cards',
      value: '12,847',
      change: '+12 new',
      color: 'text-blue-400',
      icon: Database,
    },
    {
      label: 'Active Decks',
      value: '3,492',
      change: '+3 this week',
      color: 'text-green-400',
      icon: Package,
    },
    {
      label: 'Market Cap',
      value: '$2.4B',
      change: '+5.2%',
      color: 'text-yellow-400',
      icon: TrendingUp,
    },
    {
      label: 'Community',
      value: '89.7K',
      change: '+2.1%',
      color: 'text-purple-400',
      icon: Users,
    },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Platform Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {platformStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <IconComponent className={`w-8 h-8 ${stat.color}`} />
                  <span className="text-xs text-green-400 bg-green-400/20 px-2 py-1 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Global Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
        >
          <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1 relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={globalSearch}
                onChange={e => setGlobalSearch(e.target.value)}
                placeholder="Search cards, decks, players, or anything across all tools..."
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
              />
            </div>
            <select
              value={selectedFormat}
              onChange={e => setSelectedFormat(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
            >
              <option value="all">All Formats</option>
              <option value="standard">Standard</option>
              <option value="legacy">Legacy</option>
              <option value="limited">Limited</option>
            </select>
          </div>
        </motion.div>

        {/* Card Discovery & Database */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 p-6 border-b border-white/20">
            <div className="flex items-center space-x-3">
              <Database className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">Card Discovery</h2>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm font-medium rounded-full">
                12,847 Cards
              </span>
            </div>
          </div>
          <div className="p-6">
            <CardDatabase
              searchTerm={globalSearch}
              format={selectedFormat}
              cards={sampleCards}
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
            <GameSimulatorSimple />
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
      </div>
    </div>
  );
};

export default UnifiedGamePlatform;
