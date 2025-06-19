import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  Target,
  Calculator,
  Sparkles,
  BarChart3,
  Activity,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react';

// Import existing components
import PriceTracker from './PriceTracker';
import MetagameAnalysis from './MetagameAnalysis';
import BudgetDecks from './BudgetDecks';
import DeckPricing from './DeckPricing';
import CardSpoilers from './CardSpoilers';

const UnifiedMarket = () => {
  const [activeTab, setActiveTab] = useState('prices');

  const tabs = [
    {
      id: 'prices',
      name: 'Price Tracker',
      icon: DollarSign,
      description: 'Real-time card prices and market trends',
    },
    {
      id: 'metagame',
      name: 'Metagame',
      icon: TrendingUp,
      description: 'Meta analysis and competitive insights',
    },
    {
      id: 'budget',
      name: 'Budget Decks',
      icon: Target,
      description: 'Affordable deck recommendations',
    },
    {
      id: 'pricing',
      name: 'Deck Pricing',
      icon: Calculator,
      description: 'Calculate and optimize deck costs',
    },
    {
      id: 'spoilers',
      name: 'Spoilers',
      icon: Sparkles,
      description: 'Latest card previews and reveals',
    },
  ];

  const marketStats = [
    {
      label: 'Market Cap',
      value: '$2.4B',
      change: '+12.5%',
      trend: 'up',
      icon: BarChart3,
    },
    {
      label: 'Daily Volume',
      value: '$45.2M',
      change: '+8.3%',
      trend: 'up',
      icon: Activity,
    },
    {
      label: 'Active Listings',
      value: '1.2M',
      change: '-2.1%',
      trend: 'down',
      icon: Eye,
    },
    {
      label: 'Avg. Deck Cost',
      value: '$247',
      change: '0.0%',
      trend: 'neutral',
      icon: Calculator,
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'prices':
        return <PriceTracker />;
      case 'metagame':
        return <MetagameAnalysis />;
      case 'budget':
        return <BudgetDecks />;
      case 'pricing':
        return <DeckPricing />;
      case 'spoilers':
        return <CardSpoilers />;
      default:
        return <PriceTracker />;
    }
  };

  const getTrendIcon = trend => {
    switch (trend) {
      case 'up':
        return <ArrowUpRight className="w-4 h-4 text-green-500" />;
      case 'down':
        return <ArrowDownRight className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendColor = trend => {
    switch (trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Market Intelligence
          </h1>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Comprehensive market analysis, pricing data, and competitive
            insights for informed decision making
          </p>
        </motion.div>

        {/* Market Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {marketStats.map((stat, index) => (
            <div
              key={stat.label}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="w-8 h-8 text-blue-400" />
                {getTrendIcon(stat.trend)}
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-300">{stat.label}</p>
                <p
                  className={`text-sm font-medium ${getTrendColor(stat.trend)}`}
                >
                  {stat.change}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-2 mb-8 border border-white/20"
        >
          <div className="flex flex-wrap gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-6 py-4 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">{tab.name}</div>
                  <div className="text-xs opacity-75">{tab.description}</div>
                </div>
              </button>
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

export default UnifiedMarket;
