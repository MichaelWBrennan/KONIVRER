import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';

// Import existing components
import CardViewer from '../components/CardViewer';
import VisualDeckBuilder from '../components/VisualDeckBuilder';
import DeckStats from '../components/DeckStats';
import MetaAnalysis from '../components/MetaAnalysis';
import CollectionManager from '../components/CollectionManager';
import AIAssistant from '../components/AIAssistant';

// Import remaining components
import BattlePass from './BattlePass';
import CardMaker from './CardMaker';

const UnifiedGamePlatform = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState('discover');

  // Initialize from URL parameters
  useEffect(() => {
    const section = searchParams.get('section') || 'discover';
    setActiveSection(section);
  }, [searchParams]);

  // Update URL when section changes
  const updateURL = section => {
    setSearchParams({ section });
    setActiveSection(section);
  };

  // Main sections with integrated functionality
  const sections = [
    {
      id: 'discover',
      name: 'Discover',

      color: 'from-blue-500 to-cyan-500',
      features: [
        {
          id: 'cards',
          name: 'Card Database',
          component: CardViewer,
        },
        {
          id: 'spoilers',
          name: 'Spoilers & Previews',
          component: CardViewer,
        },
        {
          id: 'commanders',
          name: 'Commander Hub',
          component: null,
        },
      ],
    },
    {
      id: 'build',
      name: 'Build',

      color: 'from-green-500 to-emerald-500',
      features: [
        {
          id: 'builder',
          name: 'Deck Builder',
          component: VisualDeckBuilder,
        },
        {
          id: 'stats',
          name: 'Deck Analytics',
          component: DeckStats,
        },
      ],
    },
    {
      id: 'analyze',
      name: 'Analyze',

      color: 'from-purple-500 to-violet-500',
      features: [
        {
          id: 'meta',
          name: 'Metagame',
          component: MetaAnalysis,
        },
        {
          id: 'prices',
          name: 'Price Tracker',
          component: MetaAnalysis,
        },
        {
          id: 'trends',
          name: 'Market Trends',
          component: MetaAnalysis,
        },
        {
          id: 'tournaments',
          name: 'Tournament Data',
          component: MetaAnalysis,
        },
      ],
    },
    {
      id: 'manage',
      name: 'Manage',

      color: 'from-orange-500 to-red-500',
      features: [
        {
          id: 'collection',
          name: 'Collection',
          component: CollectionManager,
        },
        {
          id: 'battlepass',
          name: 'Battle Pass',
          component: BattlePass,
        },
        {
          id: 'favorites',
          name: 'Favorites',
          component: CollectionManager,
        },
      ],
    },
    {
      id: 'create',
      name: 'Create',

      color: 'from-pink-500 to-rose-500',
      features: [
        {
          id: 'cardmaker',
          name: 'Card Maker',
          component: CardMaker,
        },
        {
          id: 'templates',
          name: 'Templates',
          component: CardMaker,
        },
        {
          id: 'share',
          name: 'Share Creations',
          component: CardMaker,
        },
      ],
    },
  ];

  // Platform statistics
  const platformStats = [
    {
      label: 'Total Cards',
      value: '12,847',
      change: '+12 new',
      color: 'text-blue-400',
    },
    {
      label: 'Active Decks',
      value: '3,492',
      change: '+3 this week',
      color: 'text-green-400',
    },
    {
      label: 'Market Cap',
      value: '$2.4B',
      change: '+5.2%',
      color: 'text-yellow-400',
    },
    {
      label: 'Community',
      value: '89.7K',
      change: '+2.1%',
      color: 'text-purple-400',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Game Platform
            <span className="ml-3 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-full">
              UNIFIED
            </span>
          </h1>
        </motion.div>

        {/* Platform Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {platformStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-green-400 bg-green-400/20 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Global Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-8 border border-white/20"
        >
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search cards, decks, players, or anything..."
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
              />
            </div>
            <select className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400">
              <option value="all">All Formats</option>
              <option value="standard">Standard</option>
              <option value="legacy">Legacy</option>
              <option value="limited">Limited</option>
            </select>
            <select className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400">
              <option value="30">Last 30 days</option>
              <option value="7">Last 7 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
        </motion.div>

        {/* Section Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8"
        >
          {sections.map((section, index) => (
            <motion.button
              key={section.id}
              onClick={() => updateURL(section.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`relative overflow-hidden rounded-xl p-6 border transition-all duration-300 ${
                activeSection === section.id
                  ? 'border-white/40 bg-white/20 shadow-lg'
                  : 'border-white/20 bg-white/10 hover:border-white/30 hover:bg-white/15'
              }`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-10`}
              />
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-3"></div>
                <h3 className="font-semibold text-white text-center mb-2">
                  {section.name}
                </h3>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default UnifiedGamePlatform;
