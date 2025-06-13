import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Filter,
  Grid,
  List,
  SortAsc,
  SortDesc,
  Star,
  Heart,
  Eye,
  Download,
  Share2,
  Bookmark,
  TrendingUp,
  BarChart3,
  Zap,
  Shield,
  Sword,
  Crown,
  Sparkles,
  Target,
  Wifi,
  WifiOff,
  Package,
  X,
  ChevronDown,
  ChevronUp,
  Settings,
  Database,
  Activity,
  Loader2,
} from 'lucide-react';

import CardViewer from './CardViewer';
import CollectionManager from './CollectionManager';
import cardsService from '../services/cardsService';

const UnifiedCardDatabase = () => {
  // Search and filtering state
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filters, setFilters] = useState({
    element: 'all',
    elements: [],
    rarity: 'all',
    cost: 'all',
    type: 'all',
    set: 'all',
    class: [],
    keywords: [],
    talents: [],
    costRange: { min: '', max: '' },
    powerRange: { min: '', max: '' },
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('browse');

  // Data integration state
  const [cardsData, setCardsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const syncIntervalRef = useRef(null);
  const connectionCheckRef = useRef(null);

  // UI state
  const [selectedCard, setSelectedCard] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [bookmarks, setBookmarks] = useState(new Set());
  const [expandedSections, setExpandedSections] = useState({
    type: true,
    class: true,
    elements: true,
    keywords: true,
    talents: true,
    cost: true,
    power: true,
    rarity: true,
    set: true,
  });

  // Load cards on component mount and set up automatic syncing
  useEffect(() => {
    loadCards();
    checkConnection();
    loadUserPreferences();

    // Set up automatic syncing every 10 minutes
    syncIntervalRef.current = setInterval(
      () => {
        loadCards(true); // Force refresh to get latest data
      },
      10 * 60 * 1000,
    );

    // Set up automatic connection checking every 2 minutes
    connectionCheckRef.current = setInterval(
      () => {
        checkConnection();
      },
      2 * 60 * 1000,
    );

    // Cleanup intervals on unmount
    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
      if (connectionCheckRef.current) {
        clearInterval(connectionCheckRef.current);
      }
    };
  }, []);

  const loadCards = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      // Try to get cards from cache first
      const cards = await cardsService.getCards(forceRefresh);
      setCardsData(cards);

      // If we're forcing refresh and connected, also try to sync from source
      if (forceRefresh && connectionStatus?.connected) {
        try {
          const syncResult = await cardsService.syncCards();
          if (syncResult.success) {
            setCardsData(syncResult.cards);
            console.log('Auto-sync successful:', syncResult.message);
          }
        } catch (syncErr) {
          console.warn('Auto-sync failed, using cached data:', syncErr.message);
        }
      }
    } catch (err) {
      setError(err.message);
      console.error('Error loading cards:', err);
      // Fallback to sample data if API fails
      setCardsData(getSampleCards());
    } finally {
      setLoading(false);
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

  const loadUserPreferences = () => {
    const savedFavorites = localStorage.getItem('cardFavorites');
    const savedBookmarks = localStorage.getItem('cardBookmarks');
    const savedViewMode = localStorage.getItem('cardViewMode');

    if (savedFavorites) setFavorites(new Set(JSON.parse(savedFavorites)));
    if (savedBookmarks) setBookmarks(new Set(JSON.parse(savedBookmarks)));
    if (savedViewMode) setViewMode(savedViewMode);
  };

  const toggleFavorite = cardId => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(cardId)) {
      newFavorites.delete(cardId);
    } else {
      newFavorites.add(cardId);
    }
    setFavorites(newFavorites);
    localStorage.setItem('cardFavorites', JSON.stringify([...newFavorites]));
  };

  const toggleBookmark = cardId => {
    const newBookmarks = new Set(bookmarks);
    if (newBookmarks.has(cardId)) {
      newBookmarks.delete(cardId);
    } else {
      newBookmarks.add(cardId);
    }
    setBookmarks(newBookmarks);
    localStorage.setItem('cardBookmarks', JSON.stringify([...newBookmarks]));
  };

  const getSampleCards = () => [
    {
      id: 1,
      name: 'Lightning Strike',
      element: 'Lightning',
      cost: 3,
      type: 'Action',
      rarity: 'Common',
      set: 'Core Set',
      power: 4,
      defense: 2,
      text: 'Deal 4 damage to target. If this hits, draw a card.',
      playRate: 67.3,
      winRate: 72.1,
      trending: 'up',
      image: '/api/placeholder/200/280',
      keywords: ['Instant'],
      elements: ['Lightning'],
      class: 'Spell',
    },
    {
      id: 2,
      name: 'Flame Burst',
      element: 'Fire',
      cost: 2,
      type: 'Action',
      rarity: 'Rare',
      set: 'Elemental Fury',
      power: 3,
      defense: 1,
      text: 'Deal 3 damage. If you control a Fire permanent, deal 1 additional damage.',
      playRate: 54.8,
      winRate: 68.9,
      trending: 'up',
      image: '/api/placeholder/200/280',
      keywords: ['Inferno'],
      elements: ['Fire'],
      class: 'Spell',
    },
    // Add more sample cards as needed
  ];

  // Filter options derived from actual data
  const getFilterOptions = () => {
    const allElements = [
      ...new Set(
        cardsData
          .flatMap(card => card.elements || [card.element])
          .filter(Boolean),
      ),
    ];
    const allRarities = [
      ...new Set(cardsData.map(card => card.rarity).filter(Boolean)),
    ];
    const allTypes = [
      ...new Set(cardsData.map(card => card.type).filter(Boolean)),
    ];
    const allSets = [
      ...new Set(cardsData.map(card => card.set).filter(Boolean)),
    ];
    const allKeywords = [
      ...new Set(cardsData.flatMap(card => card.keywords || [])),
    ];
    const allClasses = [
      ...new Set(cardsData.map(card => card.class).filter(Boolean)),
    ];

    return {
      element: ['All', ...allElements],
      rarity: ['All', ...allRarities],
      type: ['All', ...allTypes],
      set: ['All', ...allSets],
      keywords: allKeywords,
      class: allClasses,
      cost: ['All', '0', '1', '2', '3', '4', '5', '6+'],
    };
  };

  const filterOptions = getFilterOptions();

  const getRarityColor = rarity => {
    switch (rarity?.toLowerCase()) {
      case 'common':
        return 'text-gray-500';
      case 'uncommon':
        return 'text-green-500';
      case 'rare':
        return 'text-blue-500';
      case 'legendary':
        return 'text-purple-500';
      case 'mythic':
        return 'text-orange-500';
      default:
        return 'text-gray-500';
    }
  };

  const getElementColor = element => {
    switch (element?.toLowerCase()) {
      case 'lightning':
        return 'from-yellow-500 to-yellow-600';
      case 'fire':
        return 'from-red-500 to-red-600';
      case 'water':
        return 'from-blue-500 to-blue-600';
      case 'earth':
        return 'from-amber-600 to-amber-700';
      case 'air':
        return 'from-cyan-400 to-cyan-500';
      case 'light':
        return 'from-white to-gray-200';
      case 'shadow':
        return 'from-gray-800 to-black';
      case 'nature':
        return 'from-green-500 to-green-600';
      case 'multi':
        return 'from-purple-500 to-pink-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getTrendingIcon = trend => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="text-green-500" size={14} />;
      case 'down':
        return <TrendingUp className="text-red-500 rotate-180" size={14} />;
      default:
        return <div className="w-3 h-3 bg-gray-400 rounded-full"></div>;
    }
  };

  const filteredCards = cardsData.filter(card => {
    const matchesSearch =
      card.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.flavor?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesElement =
      (filters.element === 'all' ||
        card.element === filters.element ||
        (card.elements && card.elements.includes(filters.element))) &&
      (filters.elements.length === 0 ||
        filters.elements.some(
          element =>
            card.element === element ||
            (card.elements && card.elements.includes(element)),
        ));

    const matchesRarity =
      filters.rarity === 'all' || card.rarity === filters.rarity;

    const matchesType = filters.type === 'all' || card.type === filters.type;

    const matchesSet = filters.set === 'all' || card.set === filters.set;

    const matchesCost =
      filters.cost === 'all' ||
      (filters.cost === '6+'
        ? card.cost >= 6
        : card.cost === parseInt(filters.cost));

    const matchesClass =
      filters.class.length === 0 || filters.class.includes(card.class);

    const matchesKeywords =
      filters.keywords.length === 0 ||
      filters.keywords.some(keyword => card.keywords?.includes(keyword));

    const matchesCostRange =
      (!filters.costRange.min ||
        card.cost >= parseInt(filters.costRange.min)) &&
      (!filters.costRange.max || card.cost <= parseInt(filters.costRange.max));

    const matchesPowerRange =
      (!filters.powerRange.min ||
        card.power >= parseInt(filters.powerRange.min)) &&
      (!filters.powerRange.max ||
        card.power <= parseInt(filters.powerRange.max));

    return (
      matchesSearch &&
      matchesElement &&
      matchesRarity &&
      matchesType &&
      matchesSet &&
      matchesCost &&
      matchesClass &&
      matchesKeywords &&
      matchesCostRange &&
      matchesPowerRange
    );
  });

  const sortedCards = [...filteredCards].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const toggleSection = section => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const updateFilter = (category, value, isMultiple = false) => {
    if (isMultiple) {
      const currentValues = filters[category] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      setFilters({ ...filters, [category]: newValues });
    } else {
      setFilters({ ...filters, [category]: value });
    }
  };

  const clearFilters = () => {
    setFilters({
      element: 'all',
      elements: [],
      rarity: 'all',
      cost: 'all',
      type: 'all',
      set: 'all',
      class: [],
      keywords: [],
      talents: [],
      costRange: { min: '', max: '' },
      powerRange: { min: '', max: '' },
    });
  };

  const renderAdvancedFilters = () => {
    const FilterSection = ({ title, section, children }) => (
      <div className="border-b border-color pb-4">
        <button
          onClick={() => toggleSection(section)}
          className="flex items-center justify-between w-full text-left font-medium text-primary hover:text-accent-primary transition-colors"
        >
          {title}
          {expandedSections[section] ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </button>
        {expandedSections[section] && (
          <div className="mt-3 space-y-2">{children}</div>
        )}
      </div>
    );

    const CheckboxFilter = ({ options, category }) => (
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {options.map(option => (
          <label
            key={option}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={(filters[category] || []).includes(option)}
              onChange={() => updateFilter(category, option, true)}
              className="rounded border-color bg-secondary text-accent-primary focus:ring-accent-primary"
            />
            <span className="text-sm text-secondary">{option}</span>
          </label>
        ))}
      </div>
    );

    const RangeFilter = ({ category, label, min = 0, max = 10 }) => (
      <div className="space-y-2">
        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="Min"
            value={filters[category]?.min || ''}
            onChange={e =>
              updateFilter(category, {
                ...filters[category],
                min: e.target.value,
              })
            }
            className="w-20 px-2 py-1 bg-primary border border-color rounded text-primary text-sm"
            min={min}
            max={max}
          />
          <span className="text-secondary self-center">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters[category]?.max || ''}
            onChange={e =>
              updateFilter(category, {
                ...filters[category],
                max: e.target.value,
              })
            }
            className="w-20 px-2 py-1 bg-primary border border-color rounded text-primary text-sm"
            min={min}
            max={max}
          />
        </div>
      </div>
    );

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-secondary rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-color">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
              <Settings size={20} />
              Advanced Filters
            </h2>
            <button
              onClick={() => setShowAdvancedFilters(false)}
              className="text-secondary hover:text-primary transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FilterSection title="Card Type" section="type">
              <CheckboxFilter
                options={filterOptions.type.filter(t => t !== 'All')}
                category="type"
              />
            </FilterSection>

            <FilterSection title="Class" section="class">
              <CheckboxFilter options={filterOptions.class} category="class" />
            </FilterSection>

            <FilterSection title="Elements" section="elements">
              <CheckboxFilter
                options={filterOptions.element.filter(e => e !== 'All')}
                category="elements"
              />
            </FilterSection>

            <FilterSection title="Keywords" section="keywords">
              <CheckboxFilter
                options={filterOptions.keywords}
                category="keywords"
              />
            </FilterSection>

            <FilterSection title="Cost Range" section="cost">
              <RangeFilter
                category="costRange"
                label="Mana Cost"
                min={0}
                max={10}
              />
            </FilterSection>

            <FilterSection title="Power Range" section="power">
              <RangeFilter
                category="powerRange"
                label="Power"
                min={0}
                max={10}
              />
            </FilterSection>
          </div>

          <div className="flex justify-between mt-8">
            <button onClick={clearFilters} className="btn btn-ghost">
              Clear All Filters
            </button>
            <button
              onClick={() => setShowAdvancedFilters(false)}
              className="btn btn-primary"
            >
              Apply Filters ({filteredCards.length} cards)
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderCardGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {sortedCards.map(card => (
        <div
          key={card.id}
          className="bg-secondary border border-color rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer"
          onClick={() => setSelectedCard(card)}
        >
          <div className="relative">
            <img
              src={card.image || '/api/placeholder/200/280'}
              alt={card.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div
              className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-medium text-white bg-gradient-to-r ${getElementColor(card.element || card.elements?.[0])}`}
            >
              {card.element || card.elements?.[0] || 'Neutral'}
            </div>
            <div className="absolute top-3 right-3 flex gap-2">
              <button
                onClick={e => {
                  e.stopPropagation();
                  toggleFavorite(card.id);
                }}
                className={`p-1.5 bg-black/50 rounded-lg transition-colors ${
                  favorites.has(card.id)
                    ? 'text-red-500'
                    : 'text-white hover:text-red-400'
                }`}
              >
                <Heart
                  size={14}
                  fill={favorites.has(card.id) ? 'currentColor' : 'none'}
                />
              </button>
              <button
                onClick={e => {
                  e.stopPropagation();
                  toggleBookmark(card.id);
                }}
                className={`p-1.5 bg-black/50 rounded-lg transition-colors ${
                  bookmarks.has(card.id)
                    ? 'text-blue-500'
                    : 'text-white hover:text-blue-400'
                }`}
              >
                <Bookmark
                  size={14}
                  fill={bookmarks.has(card.id) ? 'currentColor' : 'none'}
                />
              </button>
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-primary truncate">
                {card.name}
              </h3>
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-primary">
                  {card.cost}
                </span>
                <Zap size={12} className="text-yellow-500" />
              </div>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-secondary">{card.type}</span>
              <span className="text-xs text-secondary">•</span>
              <span
                className={`text-sm font-medium ${getRarityColor(card.rarity)}`}
              >
                {card.rarity}
              </span>
            </div>

            <p className="text-sm text-secondary mb-3 line-clamp-2">
              {card.text || card.description}
            </p>

            {(card.playRate || card.winRate) && (
              <div className="flex items-center justify-between text-xs text-secondary">
                <div className="flex items-center gap-2">
                  {card.playRate && <span>Play: {card.playRate}%</span>}
                  {card.winRate && <span>Win: {card.winRate}%</span>}
                </div>
                {card.trending && getTrendingIcon(card.trending)}
              </div>
            )}

            {card.power !== undefined && (
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-color">
                <div className="flex items-center gap-2">
                  <Sword size={12} className="text-red-500" />
                  <span className="text-sm font-medium text-primary">
                    {card.power}
                  </span>
                </div>
                {card.defense !== undefined && (
                  <div className="flex items-center gap-2">
                    <Shield size={12} className="text-blue-500" />
                    <span className="text-sm font-medium text-primary">
                      {card.defense}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderCardList = () => (
    <div className="space-y-4">
      {sortedCards.map(card => (
        <div
          key={card.id}
          className="bg-secondary border border-color rounded-xl p-4 hover:bg-tertiary transition-all duration-200 cursor-pointer"
          onClick={() => setSelectedCard(card)}
        >
          <div className="flex items-center gap-4">
            <img
              src={card.image || '/api/placeholder/200/280'}
              alt={card.name}
              className="w-16 h-16 object-cover rounded-lg"
            />

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-semibold text-primary">{card.name}</h3>
                <div
                  className={`px-2 py-1 rounded text-xs font-medium text-white bg-gradient-to-r ${getElementColor(card.element || card.elements?.[0])}`}
                >
                  {card.element || card.elements?.[0] || 'Neutral'}
                </div>
                <span
                  className={`text-sm font-medium ${getRarityColor(card.rarity)}`}
                >
                  {card.rarity}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-secondary mb-2">
                <span>{card.type}</span>
                <span>Cost: {card.cost}</span>
                {card.power !== undefined && <span>Power: {card.power}</span>}
                {card.defense !== undefined && (
                  <span>Defense: {card.defense}</span>
                )}
              </div>

              <p className="text-sm text-secondary">
                {card.text || card.description}
              </p>
            </div>

            <div className="text-right">
              {(card.playRate || card.winRate) && (
                <>
                  {card.playRate && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-secondary">Play Rate:</span>
                      <span className="text-sm font-medium text-primary">
                        {card.playRate}%
                      </span>
                    </div>
                  )}
                  {card.winRate && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-secondary">Win Rate:</span>
                      <span className="text-sm font-medium text-primary">
                        {card.winRate}%
                      </span>
                    </div>
                  )}
                </>
              )}
              <div className="flex items-center gap-2">
                {card.trending && getTrendingIcon(card.trending)}
                <button
                  onClick={e => {
                    e.stopPropagation();
                    toggleFavorite(card.id);
                  }}
                  className={`p-1 transition-colors ${
                    favorites.has(card.id)
                      ? 'text-red-500'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  <Heart
                    size={14}
                    fill={favorites.has(card.id) ? 'currentColor' : 'none'}
                  />
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    toggleBookmark(card.id);
                  }}
                  className={`p-1 transition-colors ${
                    bookmarks.has(card.id)
                      ? 'text-blue-500'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  <Bookmark
                    size={14}
                    fill={bookmarks.has(card.id) ? 'currentColor' : 'none'}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <Loader2
            className="animate-spin mx-auto mb-4 text-accent-primary"
            size={48}
          />
          <p className="text-secondary">Loading card database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-xl flex items-center justify-center">
              <Database className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary">
                Unified Card Database
              </h1>
              <p className="text-secondary">
                Advanced search with real-time data and meta insights
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => setActiveTab('browse')}
              className={`btn flex items-center gap-2 ${
                activeTab === 'browse' ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              <Search size={16} />
              <span>Browse Cards</span>
            </button>
            <button
              onClick={() => setActiveTab('collection')}
              className={`btn flex items-center gap-2 ${
                activeTab === 'collection' ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              <Package size={16} />
              <span>My Collection</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`btn flex items-center gap-2 ${
                activeTab === 'analytics' ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              <Activity size={16} />
              <span>Meta Analytics</span>
            </button>
          </div>

          {/* Connection Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {connectionStatus?.connected ? (
                  <Wifi className="text-green-500" size={16} />
                ) : (
                  <WifiOff className="text-red-500" size={16} />
                )}
                <span className="text-sm text-secondary">
                  {connectionStatus?.connected
                    ? 'Auto-sync enabled'
                    : 'Offline mode'}
                </span>
              </div>
              <span className="text-sm text-secondary">
                {cardsData.length} cards loaded
              </span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-secondary border border-color rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary"
                size={20}
              />
              <input
                type="text"
                placeholder="Search cards by name, description, or effect..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-primary border border-color rounded-xl focus:ring-2 focus:ring-accent-primary focus:border-transparent"
              />
            </div>

            <button
              onClick={() => setShowAdvancedFilters(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border border-color text-secondary hover:text-primary hover:bg-tertiary transition-all duration-200"
            >
              <Filter size={16} />
              Advanced Filters
            </button>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-3 mb-4">
            {Object.entries(filterOptions)
              .slice(0, 4)
              .map(([key, options]) => (
                <select
                  key={key}
                  value={filters[key]}
                  onChange={e => updateFilter(key, e.target.value)}
                  className="px-3 py-2 bg-primary border border-color rounded-lg text-sm"
                >
                  {options.map(option => (
                    <option key={option} value={option.toLowerCase()}>
                      {option}
                    </option>
                  ))}
                </select>
              ))}
          </div>

          {/* View Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="px-3 py-2 bg-primary border border-color rounded-lg text-sm"
              >
                <option value="name">Sort by Name</option>
                <option value="cost">Sort by Cost</option>
                <option value="power">Sort by Power</option>
                <option value="rarity">Sort by Rarity</option>
                <option value="playRate">Sort by Play Rate</option>
                <option value="winRate">Sort by Win Rate</option>
              </select>

              <button
                onClick={() =>
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                }
                className="p-2 border border-color rounded-lg hover:bg-tertiary transition-colors"
              >
                {sortOrder === 'asc' ? (
                  <SortAsc size={16} />
                ) : (
                  <SortDesc size={16} />
                )}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-secondary">
                {filteredCards.length} of {cardsData.length} cards
              </span>
              <button
                onClick={() => setViewMode('grid')}
                className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'browse' && (
          <>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
                <p className="text-red-400">Error: {error}</p>
                <p className="text-sm text-red-300 mt-1">
                  Showing sample data instead.
                </p>
              </div>
            )}

            {viewMode === 'grid' ? renderCardGrid() : renderCardList()}

            {filteredCards.length === 0 && (
              <div className="text-center py-12">
                <Search className="mx-auto mb-4 text-secondary" size={48} />
                <h3 className="text-xl font-semibold text-primary mb-2">
                  No cards found
                </h3>
                <p className="text-secondary">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </>
        )}

        {activeTab === 'collection' && (
          <CollectionManager
            cards={cardsData}
            favorites={favorites}
            bookmarks={bookmarks}
          />
        )}

        {/* Advanced Filters Modal */}
        {showAdvancedFilters && renderAdvancedFilters()}

        {/* Card Viewer Modal */}
        {selectedCard && (
          <CardViewer
            card={selectedCard}
            onClose={() => setSelectedCard(null)}
            isFavorite={favorites.has(selectedCard.id)}
            isBookmarked={bookmarks.has(selectedCard.id)}
            onToggleFavorite={() => toggleFavorite(selectedCard.id)}
            onToggleBookmark={() => toggleBookmark(selectedCard.id)}
          />
        )}
      </div>
    </div>
  );
};

export default UnifiedCardDatabase;
