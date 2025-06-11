import React, { useState } from 'react';
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
  RefreshCw
} from 'lucide-react';

const AdvancedCardDatabase = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filters, setFilters] = useState({
    element: 'all',
    rarity: 'all',
    cost: 'all',
    type: 'all',
    set: 'all'
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const cards = [
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
      description: 'Deal 4 damage to target. If this hits, draw a card.',
      playRate: 67.3,
      winRate: 72.1,
      trending: 'up',
      image: '/api/placeholder/200/280'
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
      description: 'Deal 3 damage. If you control a Fire permanent, deal 1 additional damage.',
      playRate: 54.8,
      winRate: 68.9,
      trending: 'up',
      image: '/api/placeholder/200/280'
    },
    {
      id: 3,
      name: 'Crystal Shield',
      element: 'Light',
      cost: 1,
      type: 'Defense',
      rarity: 'Uncommon',
      set: 'Prismatic Dawn',
      power: 0,
      defense: 4,
      description: 'Prevent the next 4 damage that would be dealt to you this turn.',
      playRate: 43.2,
      winRate: 65.4,
      trending: 'stable',
      image: '/api/placeholder/200/280'
    },
    {
      id: 4,
      name: 'Shadow Assassin',
      element: 'Shadow',
      cost: 4,
      type: 'Creature',
      rarity: 'Legendary',
      set: 'Darkness Rising',
      power: 5,
      defense: 3,
      description: 'When this enters play, destroy target creature with cost 3 or less.',
      playRate: 28.7,
      winRate: 71.3,
      trending: 'down',
      image: '/api/placeholder/200/280'
    },
    {
      id: 5,
      name: "Nature's Blessing",
      element: 'Nature',
      cost: 2,
      type: 'Enchantment',
      rarity: 'Rare',
      set: 'Wild Growth',
      power: 0,
      defense: 0,
      description: 'At the start of your turn, gain 1 life and draw a card.',
      playRate: 41.5,
      winRate: 63.8,
      trending: 'down',
      image: '/api/placeholder/200/280'
    },
    {
      id: 6,
      name: 'Elemental Fusion',
      element: 'Multi',
      cost: 5,
      type: 'Spell',
      rarity: 'Mythic',
      set: 'Convergence',
      power: 6,
      defense: 0,
      description: 'Choose two elements. This card gains the effects of both elements.',
      playRate: 15.9,
      winRate: 74.2,
      trending: 'up',
      image: '/api/placeholder/200/280'
    }
  ];

  const filterOptions = {
    element: ['All', 'Lightning', 'Fire', 'Water', 'Earth', 'Air', 'Light', 'Shadow', 'Nature', 'Multi'],
    rarity: ['All', 'Common', 'Uncommon', 'Rare', 'Legendary', 'Mythic'],
    type: ['All', 'Action', 'Creature', 'Defense', 'Enchantment', 'Spell', 'Equipment'],
    set: ['All', 'Core Set', 'Elemental Fury', 'Prismatic Dawn', 'Darkness Rising', 'Wild Growth', 'Convergence'],
    cost: ['All', '0', '1', '2', '3', '4', '5', '6+']
  };

  const getRarityColor = (rarity) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'text-gray-500';
      case 'uncommon': return 'text-green-500';
      case 'rare': return 'text-blue-500';
      case 'legendary': return 'text-purple-500';
      case 'mythic': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  const getElementColor = (element) => {
    switch (element.toLowerCase()) {
      case 'lightning': return 'from-yellow-500 to-yellow-600';
      case 'fire': return 'from-red-500 to-red-600';
      case 'water': return 'from-blue-500 to-blue-600';
      case 'earth': return 'from-amber-600 to-amber-700';
      case 'air': return 'from-cyan-400 to-cyan-500';
      case 'light': return 'from-white to-gray-200';
      case 'shadow': return 'from-gray-800 to-black';
      case 'nature': return 'from-green-500 to-green-600';
      case 'multi': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getTrendingIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp className="text-green-500" size={14} />;
      case 'down': return <TrendingUp className="text-red-500 rotate-180" size={14} />;
      default: return <div className="w-3 h-3 bg-gray-400 rounded-full"></div>;
    }
  };

  const filteredCards = cards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesElement = filters.element === 'all' || card.element === filters.element;
    const matchesRarity = filters.rarity === 'all' || card.rarity === filters.rarity;
    const matchesType = filters.type === 'all' || card.type === filters.type;
    const matchesSet = filters.set === 'all' || card.set === filters.set;
    const matchesCost = filters.cost === 'all' || 
                       (filters.cost === '6+' ? card.cost >= 6 : card.cost === parseInt(filters.cost));

    return matchesSearch && matchesElement && matchesRarity && matchesType && matchesSet && matchesCost;
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

  const renderCardGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {sortedCards.map(card => (
        <div key={card.id} className="bg-secondary border border-color rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group">
          <div className="relative">
            <img 
              src={card.image} 
              alt={card.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-medium text-white bg-gradient-to-r ${getElementColor(card.element)}`}>
              {card.element}
            </div>
            <div className="absolute top-3 right-3 flex gap-2">
              <button className="p-1.5 bg-black/50 rounded-lg text-white hover:bg-black/70 transition-colors">
                <Heart size={14} />
              </button>
              <button className="p-1.5 bg-black/50 rounded-lg text-white hover:bg-black/70 transition-colors">
                <Bookmark size={14} />
              </button>
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-primary truncate">{card.name}</h3>
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-primary">{card.cost}</span>
                <Zap size={12} className="text-yellow-500" />
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-secondary">{card.type}</span>
              <span className="text-xs text-secondary">•</span>
              <span className={`text-sm font-medium ${getRarityColor(card.rarity)}`}>{card.rarity}</span>
            </div>
            
            <p className="text-sm text-secondary mb-3 line-clamp-2">{card.description}</p>
            
            <div className="flex items-center justify-between text-xs text-secondary">
              <div className="flex items-center gap-2">
                <span>Play: {card.playRate}%</span>
                <span>Win: {card.winRate}%</span>
              </div>
              {getTrendingIcon(card.trending)}
            </div>
            
            {card.power !== undefined && (
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-color">
                <div className="flex items-center gap-2">
                  <Sword size={12} className="text-red-500" />
                  <span className="text-sm font-medium text-primary">{card.power}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={12} className="text-blue-500" />
                  <span className="text-sm font-medium text-primary">{card.defense}</span>
                </div>
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
        <div key={card.id} className="bg-secondary border border-color rounded-xl p-4 hover:bg-tertiary transition-all duration-200">
          <div className="flex items-center gap-4">
            <img 
              src={card.image} 
              alt={card.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-semibold text-primary">{card.name}</h3>
                <div className={`px-2 py-1 rounded text-xs font-medium text-white bg-gradient-to-r ${getElementColor(card.element)}`}>
                  {card.element}
                </div>
                <span className={`text-sm font-medium ${getRarityColor(card.rarity)}`}>{card.rarity}</span>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-secondary mb-2">
                <span>{card.type}</span>
                <span>Cost: {card.cost}</span>
                {card.power !== undefined && <span>Power: {card.power}</span>}
                {card.defense !== undefined && <span>Defense: {card.defense}</span>}
              </div>
              
              <p className="text-sm text-secondary">{card.description}</p>
            </div>
            
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm text-secondary">Play Rate:</span>
                <span className="text-sm font-medium text-primary">{card.playRate}%</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-secondary">Win Rate:</span>
                <span className="text-sm font-medium text-primary">{card.winRate}%</span>
              </div>
              <div className="flex items-center gap-2">
                {getTrendingIcon(card.trending)}
                <button className="p-1 text-secondary hover:text-primary transition-colors">
                  <Heart size={14} />
                </button>
                <button className="p-1 text-secondary hover:text-primary transition-colors">
                  <Bookmark size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-primary">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-xl flex items-center justify-center">
              <Search className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary">Advanced Card Database</h1>
              <p className="text-secondary">Comprehensive card search with meta insights</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-secondary border border-color rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" size={20} />
              <input
                type="text"
                placeholder="Search cards by name, description, or effect..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-primary border border-color rounded-xl focus:ring-2 focus:ring-accent-primary focus:border-transparent"
              />
            </div>
            
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200 ${
                showAdvancedFilters 
                  ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white border-transparent' 
                  : 'border-color text-secondary hover:text-primary hover:bg-tertiary'
              }`}
            >
              <Filter size={16} />
              Advanced Filters
            </button>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-3 mb-4">
            {Object.entries(filterOptions).slice(0, 3).map(([key, options]) => (
              <select
                key={key}
                value={filters[key]}
                onChange={(e) => setFilters({...filters, [key]: e.target.value.toLowerCase()})}
                className="px-3 py-2 bg-primary border border-color rounded-lg text-sm"
              >
                {options.map(option => (
                  <option key={option} value={option.toLowerCase()}>{option}</option>
                ))}
              </select>
            ))}
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="border-t border-color pt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(filterOptions).slice(3).map(([key, options]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-primary mb-2 capitalize">{key}</label>
                    <select
                      value={filters[key]}
                      onChange={(e) => setFilters({...filters, [key]: e.target.value.toLowerCase()})}
                      className="w-full px-3 py-2 bg-primary border border-color rounded-lg text-sm"
                    >
                      {options.map(option => (
                        <option key={option} value={option.toLowerCase()}>{option}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <span className="text-secondary">
              {sortedCards.length} of {cards.length} cards
            </span>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-secondary">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 bg-secondary border border-color rounded text-sm"
              >
                <option value="name">Name</option>
                <option value="cost">Cost</option>
                <option value="playRate">Play Rate</option>
                <option value="winRate">Win Rate</option>
                <option value="rarity">Rarity</option>
              </select>
              
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-1 text-secondary hover:text-primary transition-colors"
              >
                {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-accent-primary text-white' : 'text-secondary hover:text-primary hover:bg-tertiary'
              }`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-accent-primary text-white' : 'text-secondary hover:text-primary hover:bg-tertiary'
              }`}
            >
              <List size={16} />
            </button>
            
            <button className="flex items-center gap-2 px-3 py-2 text-secondary hover:text-primary transition-colors">
              <Download size={14} />
              Export
            </button>
          </div>
        </div>

        {/* Cards Display */}
        {viewMode === 'grid' ? renderCardGrid() : renderCardList()}

        {/* Load More */}
        {sortedCards.length > 0 && (
          <div className="text-center mt-8">
            <button className="px-6 py-3 bg-gradient-to-r from-accent-primary to-accent-secondary text-white rounded-xl hover:shadow-lg transition-all duration-200">
              Load More Cards
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedCardDatabase;