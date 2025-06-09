import {
  Search,
  Filter,
  Grid,
  List,
  Eye,
  Plus,
  RefreshCw,
  Wifi,
  WifiOff,
  Package,
} from 'lucide-react';
import { useState, useEffect } from 'react';

import CardViewer from '../components/CardViewer';
import AdvancedCardFilters from '../components/AdvancedCardFilters';
import CollectionManager from '../components/CollectionManager';
import cardsService from '../services/cardsService';

const EnhancedCardDatabase = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
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
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' or 'collection'

  // New state for API integration
  const [cardsData, setCardsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);

  // Load cards on component mount
  useEffect(() => {
    loadCards();
    checkConnection();
  }, []);

  const loadCards = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      const cards = await cardsService.getCards(forceRefresh);
      setCardsData(cards);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      const result = await cardsService.syncCards();
      if (result.success) {
        setCardsData(result.cards);
        alert(`Success: ${result.message}`);
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setSyncing(false);
    }
  };

  const checkConnection = async () => {
    try {
      const status = await cardsService.testConnection();
      setConnectionStatus(status);
    } catch (err) {
      setConnectionStatus({ connected: false, error: err.message });
    }
  };

  // Filter and sort cards
  const filteredAndSortedCards = cardsData
    .filter(card => {
      const matchesSearch =
        card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (card.flavor && card.flavor.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType =
        filters.type.length === 0 ||
        filters.type.includes(card.type);

      const matchesClass =
        filters.class.length === 0 ||
        filters.class.includes(card.class);

      const matchesElements =
        filters.elements.length === 0 ||
        filters.elements.some(element => card.elements.includes(element));

      const matchesKeywords =
        filters.keywords.length === 0 ||
        filters.keywords.some(keyword => card.keywords.includes(keyword));

      const matchesTalents =
        filters.talents.length === 0 ||
        filters.talents.some(talent => card.talents && card.talents.includes(talent));

      const matchesRarity =
        filters.rarity.length === 0 ||
        filters.rarity.includes(card.rarity);

      const matchesSet =
        filters.set.length === 0 ||
        filters.set.includes(card.set);

      const matchesCost = 
        (!filters.cost.min || card.cost >= parseInt(filters.cost.min)) &&
        (!filters.cost.max || card.cost <= parseInt(filters.cost.max));

      const matchesPower = 
        (!filters.power.min || card.power >= parseInt(filters.power.min)) &&
        (!filters.power.max || card.power <= parseInt(filters.power.max));

      return (
        matchesSearch &&
        matchesType &&
        matchesClass &&
        matchesElements &&
        matchesKeywords &&
        matchesTalents &&
        matchesRarity &&
        matchesSet &&
        matchesCost &&
        matchesPower
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'cost':
          return a.cost - b.cost;
        case 'power':
          return b.power - a.power;
        case 'rarity': {
          const rarityOrder = { common: 1, uncommon: 2, rare: 3, mythic: 4 };
          return rarityOrder[a.rarity] - rarityOrder[b.rarity];
        }
        default:
          return 0;
      }
    });

  const getRarityColor = rarity => {
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

  const hasActiveFilters = () => {
    return (
      filters.type.length > 0 ||
      filters.class.length > 0 ||
      filters.elements.length > 0 ||
      filters.keywords.length > 0 ||
      filters.talents.length > 0 ||
      filters.rarity.length > 0 ||
      filters.set.length > 0 ||
      filters.cost.min ||
      filters.cost.max ||
      filters.power.min ||
      filters.power.max
    );
  };

  if (activeTab === 'collection') {
    return <CollectionManager cards={cardsData} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Card Database</h1>
              <p className="text-gray-400">
                Browse and search through all {cardsData.length} KONIVRER cards
              </p>
              
              {/* Tabs */}
              <div className="flex items-center space-x-4 mt-4">
                <button
                  onClick={() => setActiveTab('browse')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded ${
                    activeTab === 'browse' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  <Search size={16} />
                  <span>Browse Cards</span>
                </button>
                <button
                  onClick={() => setActiveTab('collection')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded ${
                    activeTab === 'collection' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  <Package size={16} />
                  <span>My Collection</span>
                </button>
              </div>
            </div>

            {/* Sync Controls */}
            <div className="flex items-center gap-3">
              {/* Connection Status */}
              <div className="flex items-center gap-2">
                {connectionStatus?.connected ? (
                  <Wifi className="text-green-500" size={16} />
                ) : (
                  <WifiOff className="text-red-500" size={16} />
                )}
                <span className="text-sm text-gray-400">
                  {connectionStatus?.connected ? 'Connected' : 'Offline'}
                </span>
              </div>

              {/* Refresh Button */}
              <button
                onClick={() => loadCards(true)}
                disabled={loading}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors disabled:opacity-50"
                title="Refresh cards from cache"
              >
                <RefreshCw
                  className={loading ? 'animate-spin' : ''}
                  size={16}
                />
                Refresh
              </button>

              {/* Sync Button */}
              <button
                onClick={handleSync}
                disabled={syncing || !connectionStatus?.connected}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                title="Sync cards from Google Sheets"
              >
                <RefreshCw
                  className={syncing ? 'animate-spin' : ''}
                  size={16}
                />
                {syncing ? 'Syncing...' : 'Sync'}
              </button>
            </div>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search cards by name, text, or flavor..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500 lg:w-48"
            >
              <option value="name">Sort by Name</option>
              <option value="cost">Sort by Cost</option>
              <option value="power">Sort by Power</option>
              <option value="rarity">Sort by Rarity</option>
            </select>

            {/* View Mode */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
              >
                <List size={16} />
              </button>
            </div>

            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setShowAdvancedFilters(true)}
              className={`flex items-center space-x-2 px-3 py-2 rounded transition-colors ${
                hasActiveFilters() ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Filter size={16} />
              <span>Advanced Filters</span>
              {hasActiveFilters() && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  Active
                </span>
              )}
            </button>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-400">
            Showing {filteredAndSortedCards.length} of {cardsData.length} cards
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="animate-spin mx-auto mb-4" size={32} />
              <p className="text-gray-400">Loading cards...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-6">
            <div className="text-center">
              <h3 className="font-semibold text-red-300">Error loading cards</h3>
              <p className="text-sm text-red-400">{error}</p>
              <button
                onClick={() => loadCards(true)}
                className="mt-2 text-sm text-red-300 underline hover:no-underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Cards Display */}
        {!loading && !error && (
          <>
            {filteredAndSortedCards.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Search size={48} className="mx-auto mb-4 opacity-50" />
                <p>No cards found matching your criteria</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredAndSortedCards.map(card => (
                  <div
                    key={card.id}
                    className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 cursor-pointer transition-all group border border-gray-700 hover:border-blue-500"
                    onClick={() => setSelectedCard(card)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold group-hover:text-blue-400 transition-colors">
                          {card.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <span>Cost: {card.cost}</span>
                          <span>•</span>
                          <span>Power: {card.power}</span>
                        </div>
                      </div>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          // TODO: Add to deck functionality
                        }}
                        className="p-1 text-gray-400 hover:text-green-400 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      {card.elements.map(element => (
                        <span key={element} className="text-lg">
                          {element}
                        </span>
                      ))}
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium text-white ${getRarityColor(card.rarity)}`}
                      >
                        {card.rarity}
                      </span>
                    </div>

                    <p className="text-sm text-gray-300 line-clamp-3 mb-2">
                      {card.text}
                    </p>

                    {card.keywords && card.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {card.keywords.map(keyword => (
                          <span
                            key={keyword}
                            className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredAndSortedCards.map(card => (
                  <div
                    key={card.id}
                    className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 cursor-pointer transition-all border border-gray-700 hover:border-blue-500"
                    onClick={() => setSelectedCard(card)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-semibold">{card.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span>Cost: {card.cost}</span>
                            <span>•</span>
                            <span>Power: {card.power}</span>
                            <span>•</span>
                            <span className="capitalize">{card.rarity}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {card.elements.map(element => (
                            <span key={element} className="text-lg">
                              {element}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            // TODO: Add to deck functionality
                          }}
                          className="p-2 text-gray-400 hover:text-green-400 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedCard(card);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Card Viewer Modal */}
        {selectedCard && (
          <CardViewer
            card={selectedCard}
            onClose={() => setSelectedCard(null)}
          />
        )}

        {/* Advanced Filters Modal */}
        {showAdvancedFilters && (
          <AdvancedCardFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClose={() => setShowAdvancedFilters(false)}
          />
        )}
      </div>
    </div>
  );
};

export default EnhancedCardDatabase;