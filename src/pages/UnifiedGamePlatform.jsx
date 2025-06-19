import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Database,
  Layers,
  BarChart3,
  Settings,
  Search,
  TrendingUp,
  Users,
  Zap,
  Package,
  Target,
  DollarSign,
  Activity,
  Star,
  Filter,
  Calendar,
  Trophy,
  Sparkles,
  Bot,
  Crown,
  Palette,
  Calculator,
  Wrench,
  Gamepad2,
  Brain,
  Microscope,
  LineChart,
  PieChart,
  Eye,
  Plus,
  Edit3,
  Bookmark,
  Heart,
} from 'lucide-react';

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
  const updateURL = (section) => {
    setSearchParams({ section });
    setActiveSection(section);
  };

  // Main sections with integrated functionality
  const sections = [
    {
      id: 'discover',
      name: 'Discover',
      icon: Database,
      description: 'Explore cards, spoilers, and synergies',
      color: 'from-blue-500 to-cyan-500',
      features: [
        { id: 'cards', name: 'Card Database', icon: Database, component: CardViewer },
        { id: 'spoilers', name: 'Spoilers & Previews', icon: Eye, component: CardViewer },
        { id: 'synergy', name: 'Card Synergy', icon: Zap, component: CardSynergy },
        { id: 'commanders', name: 'Commander Hub', icon: Crown, component: CommanderRecommendations },
      ]
    },
    {
      id: 'build',
      name: 'Build',
      icon: Layers,
      description: 'Create, optimize, and analyze decks',
      color: 'from-green-500 to-emerald-500',
      features: [
        { id: 'builder', name: 'Deck Builder', icon: Plus, component: VisualDeckBuilder },
        { id: 'power', name: 'Power Level', icon: Calculator, component: PowerLevelCalculator },
        { id: 'stats', name: 'Deck Analytics', icon: BarChart3, component: DeckStats },
        { id: 'ai', name: 'AI Assistant', icon: Bot, component: AIAssistant },
      ]
    },
    {
      id: 'analyze',
      name: 'Analyze',
      icon: LineChart,
      description: 'Market trends and competitive analysis',
      color: 'from-purple-500 to-violet-500',
      features: [
        { id: 'meta', name: 'Metagame', icon: TrendingUp, component: MetaAnalysis },
        { id: 'prices', name: 'Price Tracker', icon: DollarSign, component: MetaAnalysis },
        { id: 'trends', name: 'Market Trends', icon: Activity, component: MetaAnalysis },
        { id: 'tournaments', name: 'Tournament Data', icon: Trophy, component: MetaAnalysis },
      ]
    },
    {
      id: 'manage',
      name: 'Manage',
      icon: Package,
      description: 'Collections, decks, and progression',
      color: 'from-orange-500 to-red-500',
      features: [
        { id: 'collection', name: 'Collection', icon: Package, component: CollectionManager },
        { id: 'portfolio', name: 'Portfolio', icon: PieChart, component: CollectionPortfolio },
        { id: 'battlepass', name: 'Battle Pass', icon: Trophy, component: BattlePass },
        { id: 'favorites', name: 'Favorites', icon: Heart, component: CollectionManager },
      ]
    },
    {
      id: 'create',
      name: 'Create',
      icon: Palette,
      description: 'Design and customize content',
      color: 'from-pink-500 to-rose-500',
      features: [
        { id: 'cardmaker', name: 'Card Maker', icon: Palette, component: CardMaker },
        { id: 'templates', name: 'Templates', icon: Edit3, component: CardMaker },
        { id: 'gallery', name: 'Gallery', icon: Eye, component: CardMaker },
        { id: 'share', name: 'Share Creations', icon: Users, component: CardMaker },
      ]
    }
  ];

  // Platform statistics
  const platformStats = [
    {
      label: 'Total Cards',
      value: '12,847',
      change: '+12 new',
      icon: Database,
      color: 'text-blue-400',
    },
    {
      label: 'Active Decks',
      value: '3,492',
      change: '+3 this week',
      icon: Layers,
      color: 'text-green-400',
    },
    {
      label: 'Market Cap',
      value: '$2.4B',
      change: '+5.2%',
      icon: DollarSign,
      color: 'text-yellow-400',
    },
    {
      label: 'Community',
      value: '89.7K',
      change: '+2.1%',
      icon: Users,
      color: 'text-purple-400',
    },
  ];

  const renderSectionContent = () => {
    const section = sections.find(s => s.id === activeSection);
    if (!section) return null;

    return (
      <div className="space-y-6">
        {/* Section Header */}
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${section.color} mb-4`}>
            <section.icon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">{section.name}</h2>
          <p className="text-gray-300 text-lg">{section.description}</p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {section.features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-white">{feature.name}</h3>
              </div>
              <div className="h-32 bg-gray-800/50 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-sm">Feature Preview</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 min-h-[400px] p-6">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <section.icon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {section.name} Interface
              </h3>
              <p className="text-gray-400">
                Select a feature above to get started with {section.name.toLowerCase()}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
            <Gamepad2 className="inline-block w-10 h-10 mr-3 text-purple-400" />
            Game Platform
            <span className="ml-3 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-full">
              UNIFIED
            </span>
          </h1>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            Your complete gaming ecosystem - discover, build, analyze, manage, and create all in one place
          </p>
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
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                <span className="text-xs text-green-400 bg-green-400/20 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-300">{stat.label}</p>
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
              <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-10`} />
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-3">
                  <section.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-white text-center mb-2">
                  {section.name}
                </h3>
                <p className="text-xs text-gray-300 text-center line-clamp-2">
                  {section.description}
                </p>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Content Area */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderSectionContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default UnifiedGamePlatform;