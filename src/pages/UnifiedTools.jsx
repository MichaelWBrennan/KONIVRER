import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Crown,
  Zap,
  BarChart3,
  Trophy,
  Palette,
  Package,
  Calculator,
  Target,
  Sparkles,
  Bot,
} from 'lucide-react';

// Import existing components
import CommanderRecommendations from './CommanderRecommendations';
import CardSynergy from './CardSynergy';
import PowerLevelCalculator from './PowerLevelCalculator';
import CollectionPortfolio from './CollectionPortfolio';
import BattlePass from './BattlePass';
import CardMaker from './CardMaker';

const UnifiedTools = () => {
  const [activeTab, setActiveTab] = useState('commanders');

  const tabs = [
    {
      id: 'commanders',
      name: 'Commander Hub',
      icon: Crown,
      description: 'AI-powered commander recommendations and analysis',
      component: CommanderRecommendations,
    },
    {
      id: 'synergy',
      name: 'Card Synergy',
      icon: Zap,
      description: 'Discover powerful card interactions and combos',
      component: CardSynergy,
    },
    {
      id: 'power',
      name: 'Power Level',
      icon: BarChart3,
      description: 'Calculate and analyze deck power levels',
      component: PowerLevelCalculator,
    },
    {
      id: 'collection',
      name: 'Collection',
      icon: Package,
      description: 'Manage and track your card collection',
      component: CollectionPortfolio,
    },
    {
      id: 'battlepass',
      name: 'Battle Pass',
      icon: Trophy,
      description: 'Seasonal progression and exclusive rewards',
      component: BattlePass,
    },
    {
      id: 'cardmaker',
      name: 'Card Maker',
      icon: Palette,
      description: 'Create custom cards with professional tools',
      component: CardMaker,
    },
  ];

  const toolStats = [
    {
      label: 'Commanders Analyzed',
      value: '2,847',
      icon: Crown,
      color: 'text-yellow-400',
    },
    {
      label: 'Synergies Found',
      value: '45,231',
      icon: Zap,
      color: 'text-purple-400',
    },
    {
      label: 'Decks Evaluated',
      value: '18,492',
      icon: BarChart3,
      color: 'text-blue-400',
    },
    {
      label: 'Cards Created',
      value: '3,156',
      icon: Palette,
      color: 'text-green-400',
    },
  ];

  const renderContent = () => {
    const activeTabData = tabs.find(tab => tab.id === activeTab);
    if (activeTabData && activeTabData.component) {
      const Component = activeTabData.component;
      return <Component />;
    }
    return null;
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
            <Bot className="inline-block w-10 h-10 mr-3 text-purple-400" />
            Deck Building Tools
          </h1>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            Advanced utilities and AI-powered tools to enhance your deck building experience
          </p>
        </motion.div>

        {/* Tool Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {toolStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-purple-400/50 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                <Sparkles className="w-5 h-5 text-purple-300 opacity-60" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-300">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-2 mb-8 border border-white/20"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 p-4 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-lg border border-purple-400'
                    : 'text-gray-300 hover:text-white hover:bg-white/10 border border-transparent'
                }`}
              >
                <tab.icon className="w-6 h-6 flex-shrink-0" />
                <div className="text-left flex-1">
                  <div className="font-medium">{tab.name}</div>
                  <div className="text-xs opacity-75 line-clamp-2">{tab.description}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Content Area */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden"
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default UnifiedTools;