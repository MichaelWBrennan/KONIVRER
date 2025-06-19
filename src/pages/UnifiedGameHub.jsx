import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import {
  Search,
  Filter,
  Grid,
  List,
  Eye,
  Plus,
  Star,
  TrendingUp,
  BarChart3,
  Activity,
  Zap,
  Shield,
  Sword,
  Crown,
  Target,
  Sparkles,
  Database,
  Layers,
  DollarSign,
  Calculator,
  BookOpen,
  Settings,
  PlusCircle,
  Edit3,
  Save,
  Download,
  Share2,
  Bookmark,
  Heart,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Package,
  Gamepad2,
  Brain,
  Palette,
  Microscope,
  LineChart,
  PieChart,
  BarChart2,
  Wifi,
  WifiOff,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
} from 'lucide-react';

// Import existing components
import CardViewer from '../components/CardViewer';
import VisualDeckBuilder from '../components/VisualDeckBuilder';
import AdvancedCardFilters from '../components/AdvancedCardFilters';
import DeckValidator from '../components/DeckValidator';
import AIAssistant from '../components/AIAssistant';
import CollectionManager from '../components/CollectionManager';
import PriceTracker from './PriceTracker';
import MetagameAnalysis from './MetagameAnalysis';
import BudgetDecks from './BudgetDecks';
import DeckPricing from './DeckPricing';
import CardSpoilers from './CardSpoilers';
import CardSynergy from './CardSynergy';
import FormatStaples from './FormatStaples';
import cardsData from '../data/cards.json';

const UnifiedGameHub = () => {
  const { user, isAuthenticated } = useAuth();
  const { addDeck, updateDeck, decks } = useData();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Main navigation state
  const [activeSection, setActiveSection] = useState('explore');
  const [activeSubTab, setActiveSubTab] = useState('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [globalFilters, setGlobalFilters] = useState({
    format: 'all',
    timeframe: '30d',
    competitive: false,
  });

  // Shared states
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('online');

  // Deck builder state
  const [builderDeck, setBuilderDeck] = useState({
    name: 'Untitled Deck',
    cards: [],
    description: '',
    hero: '',
    format: 'standard',
  });

  // Initialize from URL parameters
  useEffect(() => {
    const section = searchParams.get('section') || 'explore';
    const tab = searchParams.get('tab') || getDefaultTab(section);
    const search = searchParams.get('search') || '';
    
    setActiveSection(section);
    setActiveSubTab(tab);
    setSearchQuery(search);
  }, [searchParams]);

  const getDefaultTab = (section) => {
    switch (section) {
      case 'explore': return 'cards';
      case 'build': return 'builder';
      case 'analyze': return 'meta';
      case 'manage': return 'collection';
      default: return 'cards';
    }
  };

  const updateURL = (section, tab, additionalParams = {}) => {
    const newParams = new URLSearchParams();
    newParams.set('section', section);
    newParams.set('tab', tab);
    if (searchQuery) newParams.set('search', searchQuery);
    
    Object.entries(additionalParams).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
    });
    
    setSearchParams(newParams);
  };

  const handleSectionChange = (section) => {
    const defaultTab = getDefaultTab(section);
    setActiveSection(section);
    setActiveSubTab(defaultTab);
    updateURL(section, defaultTab);
  };

  const handleTabChange = (tab) => {
    setActiveSubTab(tab);
    updateURL(activeSection, tab);
  };

  // Main sections configuration
  const sections = [
    {
      id: 'explore',
      name: 'Explore',
      icon: Database,
      description: 'Discover cards, spoilers, and synergies',
      color: 'from-blue-500 to-cyan-500',
      tabs: [
        { id: 'cards', name: 'Card Database', icon: Database },
        { id: 'spoilers', name: 'Spoilers', icon: Sparkles },
        { id: 'synergy', name: 'Synergy', icon: Zap },
        { id: 'staples', name: 'Format Staples', icon: Star },
      ]
    },
    {
      id: 'build',
      name: 'Build',
      icon: Layers,
      description: 'Create and optimize decks',
      color: 'from-green-500 to-emerald-500',
      tabs: [
        { id: 'builder', name: 'Deck Builder', icon: Edit3 },
        { id: 'pricing', name: 'Deck Pricing', icon: Calculator },
        { id: 'budget', name: 'Budget Decks', icon: Target },
        { id: 'validator', name: 'Deck Validator', icon: CheckCircle },
      ]
    },
    {
      id: 'analyze',
      name: 'Analyze',
      icon: BarChart3,
      description: 'Market trends and meta analysis',
      color: 'from-purple-500 to-pink-500',
      tabs: [
        { id: 'meta', name: 'Metagame', icon: TrendingUp },
        { id: 'prices', name: 'Price Tracker', icon: DollarSign },
        { id: 'analytics', name: 'Deck Analytics', icon: BarChart2 },
        { id: 'trends', name: 'Market Trends', icon: LineChart },
      ]
    },
    {
      id: 'manage',
      name: 'Manage',
      icon: Settings,
      description: 'Collections and personal decks',
      color: 'from-orange-500 to-red-500',
      tabs: [
        { id: 'collection', name: 'Collection', icon: Package },
        { id: 'mydecks', name: 'My Decks', icon: BookOpen },
        { id: 'portfolio', name: 'Portfolio', icon: PieChart },
        { id: 'watchlist', name: 'Watchlist', icon: Eye },
      ]
    },
  ];

  // Quick stats for dashboard
  const quickStats = [
    {
      label: 'Total Cards',
      value: cardsData.length.toLocaleString(),
      change: '+12 new',
      icon: Database,
      color: 'text-blue-400',
    },
    {
      label: 'Active Decks',
      value: decks.length.toLocaleString(),
      change: '+3 this week',
      icon: Layers,
      color: 'text-green-400',
    },
    {
      label: 'Market Cap',
      value: '$2.4B',
      change: '+5.2%',
      icon: DollarSign,
      color: 'text-purple-400',
    },
    {
      label: 'Meta Diversity',
      value: '87%',
      change: '+2.1%',
      icon: Activity,
      color: 'text-orange-400',
    },
  ];

  // Render content based on active section and tab
  const renderContent = () => {
    const key = `${activeSection}-${activeSubTab}`;
    
    switch (key) {
      // Explore section
      case 'explore-cards':
        return <CardDatabaseView />;
      case 'explore-spoilers':
        return <CardSpoilers />;
      case 'explore-synergy':
        return <CardSynergy />;
      case 'explore-staples':
        return <FormatStaples />;
      
      // Build section
      case 'build-builder':
        return <DeckBuilderView />;
      case 'build-pricing':
        return <DeckPricing />;
      case 'build-budget':
        return <BudgetDecks />;
      case 'build-validator':
        return <DeckValidatorView />;
      
      // Analyze section
      case 'analyze-meta':
        return <MetagameAnalysis />;
      case 'analyze-prices':
        return <PriceTracker />;
      case 'analyze-analytics':
        return <DeckAnalyticsView />;
      case 'analyze-trends':
        return <MarketTrendsView />;
      
      // Manage section
      case 'manage-collection':
        return <CollectionManager />;
      case 'manage-mydecks':
        return <MyDecksView />;
      case 'manage-portfolio':
        return <PortfolioView />;
      case 'manage-watchlist':
        return <WatchlistView />;
      
      default:
        return <CardDatabaseView />;
    }
  };

  // Individual view components
  const CardDatabaseView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Card Database</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600' : 'bg-gray-700'}`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600' : 'bg-gray-700'}`}
            >
              <List size={16} />
            </button>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
          >
            <Filter size={16} />
            Filters
          </button>
        </div>
      </div>
      
      {showFilters && (
        <div className="bg-gray-800 rounded-lg p-6">
          <AdvancedCardFilters />
        </div>
      )}
      
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-2'}>
        {cardsData.slice(0, 20).map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 cursor-pointer"
            onClick={() => setSelectedCard(card)}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white truncate">{card.name}</h3>
              <span className="text-sm text-gray-400">{card.cost}</span>
            </div>
            <p className="text-sm text-gray-300 line-clamp-2">{card.description}</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs px-2 py-1 bg-blue-600 rounded">{card.type}</span>
              <span className="text-xs text-gray-400">{card.rarity}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const DeckBuilderView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Deck Builder</h2>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700">
            <Save size={16} />
            Save Deck
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600">
            <Share2 size={16} />
            Share
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <VisualDeckBuilder 
            deck={builderDeck}
            onDeckChange={setBuilderDeck}
            onCardSelect={setSelectedCard}
          />
        </div>
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-3">Deck Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Cards:</span>
                <span className="text-white">{builderDeck.cards.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Avg. Cost:</span>
                <span className="text-white">3.2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Est. Price:</span>
                <span className="text-white">$127.50</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-3">AI Suggestions</h3>
            <AIAssistant deck={builderDeck} />
          </div>
        </div>
      </div>
    </div>
  );

  const DeckValidatorView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Deck Validator</h2>
      <DeckValidator deck={builderDeck} />
    </div>
  );

  const DeckAnalyticsView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Deck Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="font-semibold text-white mb-4">Win Rate Trends</h3>
          <div className="h-32 bg-gray-700 rounded flex items-center justify-center">
            <LineChart className="text-gray-500" size={48} />
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="font-semibold text-white mb-4">Meta Share</h3>
          <div className="h-32 bg-gray-700 rounded flex items-center justify-center">
            <PieChart className="text-gray-500" size={48} />
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="font-semibold text-white mb-4">Performance</h3>
          <div className="h-32 bg-gray-700 rounded flex items-center justify-center">
            <BarChart2 className="text-gray-500" size={48} />
          </div>
        </div>
      </div>
    </div>
  );

  const MarketTrendsView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Market Trends</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="font-semibold text-white mb-4">Price Movements</h3>
          <div className="space-y-3">
            {['Lightning Bolt', 'Storm Elemental', 'Fire Imp'].map((card) => (
              <div key={card} className="flex items-center justify-between">
                <span className="text-gray-300">{card}</span>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">+12.5%</span>
                  <TrendingUp className="text-green-400" size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="font-semibold text-white mb-4">Market Activity</h3>
          <div className="h-32 bg-gray-700 rounded flex items-center justify-center">
            <Activity className="text-gray-500" size={48} />
          </div>
        </div>
      </div>
    </div>
  );

  const MyDecksView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">My Decks</h2>
        <button 
          onClick={() => handleTabChange('builder')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <PlusCircle size={16} />
          New Deck
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decks.map((deck) => (
          <div key={deck.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white">{deck.name}</h3>
              <button className="text-gray-400 hover:text-white">
                <Edit3 size={16} />
              </button>
            </div>
            <p className="text-sm text-gray-400 mb-3">{deck.description}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">{deck.cards?.length || 0} cards</span>
              <span className="text-gray-400">{deck.format}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const PortfolioView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Portfolio</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="font-semibold text-white mb-2">Total Value</h3>
          <p className="text-3xl font-bold text-green-400">$1,247.50</p>
          <p className="text-sm text-green-400">+8.3% this month</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="font-semibold text-white mb-2">Cards Owned</h3>
          <p className="text-3xl font-bold text-blue-400">1,234</p>
          <p className="text-sm text-gray-400">87% collection</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="font-semibold text-white mb-2">Top Gainer</h3>
          <p className="text-lg font-bold text-white">Lightning Bolt</p>
          <p className="text-sm text-green-400">+25.7%</p>
        </div>
      </div>
    </div>
  );

  const WatchlistView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Watchlist</h2>
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="space-y-4">
          {['Storm Elemental', 'Fire Imp', 'Water Shield'].map((card) => (
            <div key={card} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div>
                <h3 className="font-semibold text-white">{card}</h3>
                <p className="text-sm text-gray-400">Rare • Lightning</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-white">$12.50</p>
                <p className="text-sm text-green-400">+5.2%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

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
            Game Hub
          </h1>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Your unified platform for cards, decks, market analysis, and collection management
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {quickStats.map((stat, index) => (
            <div
              key={stat.label}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                <span className="text-xs text-gray-400">{stat.change}</span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-300">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Global Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search cards, decks, or market data..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={globalFilters.format}
                onChange={(e) => setGlobalFilters({...globalFilters, format: e.target.value})}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
              >
                <option value="all">All Formats</option>
                <option value="standard">Standard</option>
                <option value="limited">Limited</option>
                <option value="legacy">Legacy</option>
              </select>
              <select
                value={globalFilters.timeframe}
                onChange={(e) => setGlobalFilters({...globalFilters, timeframe: e.target.value})}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Main Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-2 mb-8 border border-white/20"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionChange(section.id)}
                className={`relative overflow-hidden rounded-lg p-6 transition-all duration-300 ${
                  activeSection === section.id
                    ? `bg-gradient-to-r ${section.color} text-white shadow-lg scale-105`
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <section.icon className="w-8 h-8" />
                  <div>
                    <div className="font-semibold text-lg">{section.name}</div>
                    <div className="text-xs opacity-75">{section.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Sub Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-2 mb-8 border border-white/20"
        >
          <div className="flex flex-wrap gap-2">
            {sections.find(s => s.id === activeSection)?.tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeSubTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content Area */}
        <motion.div
          key={`${activeSection}-${activeSubTab}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden"
        >
          <div className="p-6">
            {renderContent()}
          </div>
        </motion.div>

        {/* Card Detail Modal */}
        <AnimatePresence>
          {selectedCard && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedCard(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white">{selectedCard.name}</h2>
                  <button
                    onClick={() => setSelectedCard(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={24} />
                  </button>
                </div>
                <CardViewer card={selectedCard} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UnifiedGameHub;