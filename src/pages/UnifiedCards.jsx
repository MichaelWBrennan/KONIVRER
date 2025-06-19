import {
  Search,
  Filter,
  Grid,
  List,
  Eye,
  Plus,
  Wifi,
  WifiOff,
  Package,
  FileText,
  Layers,
  ExternalLink,
  Loader2,
  Star,
  Heart,
  Download,
  Share2,
  Bookmark,
  TrendingUp,
  BarChart3,
  Activity,
  Zap,
  Shield,
  Sword,
  Crown,
  Target,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import CardViewer from '../components/CardViewer';
import AdvancedCardFilters from '../components/AdvancedCardFilters';
import CollectionManager from '../components/CollectionManager';
import cardsService from '../services/cardsService';

const UnifiedCards = () => {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [filters, setFilters] = useState({
    type: [],
    class: [],
    elements: [],
    keywords: [],
    talents: [],
    cost: { min: '', max: '' },
    power: { min: '', max: '' },
    rarity: [],
    set: [],
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // API integration
  const [cardsData, setCardsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const syncIntervalRef = useRef(null);

  // Collection management
  const [userCollection, setUserCollection] = useState([]);
  const [collectionStats, setCollectionStats] = useState({
    total: 0,
    unique: 0,
    completion: 0,
    value: 0,
  });

  // Meta analytics
  const [metaData, setMetaData] = useState({
    popularCards: [],
    trendingCards: [],
    metaBreakdown: {},
    playRates: {},
    winRates: {},
  });

  useEffect(() => {
    loadCards();
    if (isAuthenticated) {
      loadUserCollection();
    }
    loadMetaData();
  }, [isAuthenticated]);

  const loadCards = async () => {
    try {
      setLoading(true);
      const data = await cardsService.getAllCards();
      setCardsData(data);
      setConnectionStatus('online');
    } catch (err) {
      setError(err.message);
      setConnectionStatus('offline');
      // Load offline data
      const offlineData = await cardsService.getOfflineCards();
      setCardsData(offlineData);
    } finally {
      setLoading(false);
    }
  };

  const loadUserCollection = async () => {
    try {
      const collection = await cardsService.getUserCollection();
      setUserCollection(collection);
      calculateCollectionStats(collection);
    } catch (err) {
      console.error('Failed to load collection:', err);
    }
  };

  const loadMetaData = async () => {
    try {
      const meta = await cardsService.getMetaAnalytics();
      setMetaData(meta);
    } catch (err) {
      console.error('Failed to load meta data:', err);
    }
  };

  const calculateCollectionStats = (collection) => {
    const total = collection.reduce((sum, item) => sum + item.quantity, 0);
    const unique = collection.length;
    const completion = (unique / cardsData.length) * 100;
    const value = collection.reduce((sum, item) => sum + (item.value * item.quantity), 0);
    
    setCollectionStats({ total, unique, completion, value });
  };

  const filteredCards = cardsData.filter((card) => {
    const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         card.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilters = 
      (filters.type.length === 0 || filters.type.includes(card.type)) &&
      (filters.rarity.length === 0 || filters.rarity.includes(card.rarity)) &&
      (filters.elements.length === 0 || filters.elements.some(el => card.elements?.includes(el))) &&
      (!filters.cost.min || card.cost >= parseInt(filters.cost.min)) &&
      (!filters.cost.max || card.cost <= parseInt(filters.cost.max));

    return matchesSearch && matchesFilters;
  });

  const sortedCards = [...filteredCards].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'cost':
        return a.cost - b.cost;
      case 'power':
        return (a.power || 0) - (b.power || 0);
      case 'rarity':
        const rarityOrder = { common: 1, uncommon: 2, rare: 3, mythic: 4 };
        return rarityOrder[a.rarity] - rarityOrder[b.rarity];
      case 'playRate':
        return (metaData.playRates[b.id] || 0) - (metaData.playRates[a.id] || 0);
      case 'winRate':
        return (metaData.winRates[b.id] || 0) - (metaData.winRates[a.id] || 0);
      default:
        return 0;
    }
  });

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-600';
      case 'uncommon':
        return 'bg-green-600';
      case 'rare':
        return 'bg-blue-600';
      case 'mythic':
        return 'bg-purple-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getCardInCollection = (cardId) => {
    return userCollection.find(item => item.cardId === cardId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4" size={48} />
          <p>Loading cards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Unified Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Unified Card Database</h1>
              <p className="text-gray-400">
                Advanced search with real-time data and meta insights
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {connectionStatus === 'online' ? (
                <div className="flex items-center text-green-400">
                  <Wifi size={16} className="mr-1" />
                  <span className="text-sm">Online</span>
                </div>
              ) : (
                <div className="flex items-center text-yellow-400">
                  <WifiOff size={16} className="mr-1" />
                  <span className="text-sm">Offline mode</span>
                </div>
              )}
              <span className="text-sm text-gray-400">
                {cardsData.length} cards loaded
              </span>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Cards</p>
                  <p className="text-2xl font-bold">{cardsData.length}</p>
                </div>
                <Package className="text-blue-400" size={24} />
              </div>
            </div>
            {isAuthenticated && (
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Collection</p>
                    <p className="text-2xl font-bold">{collectionStats.unique}</p>
                    <p className="text-xs text-gray-500">{collectionStats.completion.toFixed(1)}% complete</p>
                  </div>
                  <Star className="text-yellow-400" size={24} />
                </div>
              </div>
            )}
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Meta Cards</p>
                  <p className="text-2xl font-bold">{metaData.popularCards.length}</p>
                </div>
                <TrendingUp className="text-green-400" size={24} />
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Filtered</p>
                  <p className="text-2xl font-bold">{filteredCards.length}</p>
                </div>
                <Filter className="text-purple-400" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Unified Search and Filters */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Search Section */}
            <div className="lg:col-span-2">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search cards by name, description, or effect..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap gap-2 mb-4">
                <select
                  value={filters.type[0] || ''}
                  onChange={(e) => setFilters({...filters, type: e.target.value ? [e.target.value] : []})}
                  className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm"
                >
                  <option value="">All Types</option>
                  <option value="creature">Creature</option>
                  <option value="spell">Spell</option>
                  <option value="artifact">Artifact</option>
                  <option value="enchantment">Enchantment</option>
                </select>
                <select
                  value={filters.rarity[0] || ''}
                  onChange={(e) => setFilters({...filters, rarity: e.target.value ? [e.target.value] : []})}
                  className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm"
                >
                  <option value="">All Rarities</option>
                  <option value="common">Common</option>
                  <option value="uncommon">Uncommon</option>
                  <option value="rare">Rare</option>
                  <option value="mythic">Mythic</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm"
                >
                  <option value="name">Sort by Name</option>
                  <option value="cost">Sort by Cost</option>
                  <option value="power">Sort by Power</option>
                  <option value="rarity">Sort by Rarity</option>
                  <option value="playRate">Sort by Play Rate</option>
                  <option value="winRate">Sort by Win Rate</option>
                </select>
              </div>

              {/* Advanced Filters Toggle */}
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Filter size={16} />
                <span>Advanced Filters</span>
              </button>
            </div>

            {/* View Controls */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">View Mode</span>
                <div className="flex space-x-2">
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
              </div>
              <div className="text-sm text-gray-400">
                Showing {sortedCards.length} of {cardsData.length} cards
              </div>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showAdvancedFilters && (
            <div className="mt-6 pt-6 border-t border-gray-700">
              <AdvancedCardFilters
                filters={filters}
                onFiltersChange={setFilters}
                cardsData={cardsData}
              />
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Cards Display */}
          <div className="xl:col-span-3">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sortedCards.map((card) => {
                  const collectionItem = getCardInCollection(card.id);
                  const playRate = metaData.playRates[card.id] || 0;
                  const winRate = metaData.winRates[card.id] || 0;
                  
                  return (
                    <div
                      key={card.id}
                      className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors cursor-pointer group"
                      onClick={() => setSelectedCard(card)}
                    >
                      <div className="relative">
                        <img
                          src={card.image || '/api/placeholder/200/280'}
                          alt={card.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${getRarityColor(card.rarity)}`}>
                          {card.rarity}
                        </div>
                        {collectionItem && (
                          <div className="absolute top-2 left-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                            {collectionItem.quantity}x
                          </div>
                        )}
                        {playRate > 0 && (
                          <div className="absolute bottom-2 right-2 bg-green-600 px-2 py-1 rounded text-xs">
                            {(playRate * 100).toFixed(1)}%
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold mb-1 group-hover:text-blue-400 transition-colors">
                          {card.name}
                        </h3>
                        <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                          <span>{card.type}</span>
                          <span className="font-bold">{card.cost}</span>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {card.description}
                        </p>
                        {(playRate > 0 || winRate > 0) && (
                          <div className="flex justify-between text-xs text-gray-400 mt-2 pt-2 border-t border-gray-700">
                            <span>Play: {(playRate * 100).toFixed(1)}%</span>
                            <span>Win: {(winRate * 100).toFixed(1)}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2">
                {sortedCards.map((card) => {
                  const collectionItem = getCardInCollection(card.id);
                  const playRate = metaData.playRates[card.id] || 0;
                  const winRate = metaData.winRates[card.id] || 0;
                  
                  return (
                    <div
                      key={card.id}
                      className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors cursor-pointer flex items-center space-x-4"
                      onClick={() => setSelectedCard(card)}
                    >
                      <img
                        src={card.image || '/api/placeholder/60/84'}
                        alt={card.name}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{card.name}</h3>
                          <div className="flex items-center space-x-2">
                            {collectionItem && (
                              <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                                {collectionItem.quantity}x
                              </span>
                            )}
                            <span className={`px-2 py-1 rounded text-xs ${getRarityColor(card.rarity)}`}>
                              {card.rarity}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-400 mt-1">
                          <span>{card.type} • Cost: {card.cost}</span>
                          {(playRate > 0 || winRate > 0) && (
                            <span>Play: {(playRate * 100).toFixed(1)}% • Win: {(winRate * 100).toFixed(1)}%</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar with Collection & Meta Info */}
          <div className="space-y-6">
            {/* Collection Summary */}
            {isAuthenticated && (
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Package className="mr-2" size={16} />
                  My Collection
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Cards:</span>
                    <span>{collectionStats.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Unique Cards:</span>
                    <span>{collectionStats.unique}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completion:</span>
                    <span>{collectionStats.completion.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Est. Value:</span>
                    <span>${collectionStats.value.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Meta Analytics */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center">
                <BarChart3 className="mr-2" size={16} />
                Meta Insights
              </h3>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Popular Cards</h4>
                  <div className="space-y-1">
                    {metaData.popularCards.slice(0, 5).map((card, index) => (
                      <div key={card.id} className="flex items-center justify-between text-xs">
                        <span className="truncate">{card.name}</span>
                        <span className="text-green-400">{(card.playRate * 100).toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Trending</h4>
                  <div className="space-y-1">
                    {metaData.trendingCards.slice(0, 3).map((card, index) => (
                      <div key={card.id} className="flex items-center justify-between text-xs">
                        <span className="truncate">{card.name}</span>
                        <TrendingUp className="text-green-400" size={12} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  to="/deckbuilder"
                  className="flex items-center space-x-2 w-full p-2 bg-blue-600 hover:bg-blue-500 rounded transition-colors text-sm"
                >
                  <Plus size={14} />
                  <span>Build Deck</span>
                </Link>
                <Link
                  to="/official-decklists"
                  className="flex items-center space-x-2 w-full p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-sm"
                >
                  <FileText size={14} />
                  <span>Official Lists</span>
                </Link>
                <Link
                  to="/products"
                  className="flex items-center space-x-2 w-full p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-sm"
                >
                  <Package size={14} />
                  <span>Products</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Card Detail Modal */}
        {selectedCard && (
          <CardViewer
            card={selectedCard}
            onClose={() => setSelectedCard(null)}
            collection={userCollection}
            metaData={metaData}
          />
        )}
      </div>
    </div>
  );
};

export default UnifiedCards;