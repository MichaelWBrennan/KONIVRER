/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ChevronDown,
  ChevronUp,
  X,
  Filter,
  Zap,
  Type,
  Palette,
  DollarSign,
  Calendar,
  Star,
  User,
  BookOpen,
  Globe,
  Settings,
} from 'lucide-react';

const AdvancedSearch = ({ onSearch, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    // Basic Search
    cardName: '',
    text: '',

    // Type & Mechanics
    typeLine: '',
    allowPartialTypes: true,
    selectedTypes: [],

    // Colors & Identity
    colors: [],
    colorComparison: 'including', // including, exactly, at-most
    colorIdentity: [],

    // Mana & Stats
    manaCost: '',
    power: { operator: '=', value: '' },
    toughness: { operator: '=', value: '' },

    // Sets & Rarity
    sets: [],
    rarity: [],

    // Price & Market
    priceRange: { min: '', max: '', currency: 'usd' },

    // Flavor & Lore
    artist: '',
    flavorText: '',
    loreFinder: '',

    // Display Options
    sortBy: 'name',
    sortOrder: 'asc',
    showAllPrints: false,
    includeTokens: false,
  });

  // KONIVRER specific data
  const cardTypes = [
    'Familiar',
    'Spell',
    'Artifact',
    'Enchantment',
    'Land',
    'Planeswalker',
  ];

  const elements = [
    { name: 'Generic', symbol: '✡︎⃝', color: 'text-gray-400' },
    { name: 'Brilliance', symbol: '⬢', color: 'text-yellow-400' },
    { name: 'Gust', symbol: '🜁', color: 'text-blue-400' },
    { name: 'Inferno', symbol: '🜂', color: 'text-red-400' },
    { name: 'Steadfast', symbol: '🜃', color: 'text-green-400' },
    { name: 'Submerged', symbol: '🜄', color: 'text-cyan-400' },
    { name: 'Void', symbol: '▢', color: 'text-purple-400' },
    { name: 'Quintessence', symbol: '✦', color: 'text-pink-400' },
  ];

  const rarities = ['Common', 'Uncommon', 'Rare', 'Mythic', 'Legendary'];

  const sets = ['PRIMA MATERIA', 'Core Set', 'Expansion 1', 'Expansion 2'];

  const operators = ['=', '≠', '<', '≤', '>', '≥'];

  const updateCriteria = (field, value) => {
    setSearchCriteria(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateNestedCriteria = (field, subfield, value) => {
    setSearchCriteria(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [subfield]: value,
      },
    }));
  };

  const toggleArrayValue = (field, value) => {
    setSearchCriteria(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value],
    }));
  };

  const handleSearch = () => {
    onSearch(searchCriteria);
  };

  const clearAll = () => {
    setSearchCriteria({
      cardName: '',
      text: '',
      typeLine: '',
      allowPartialTypes: true,
      selectedTypes: [],
      colors: [],
      colorComparison: 'including',
      colorIdentity: [],
      manaCost: '',
      power: { operator: '=', value: '' },
      toughness: { operator: '=', value: '' },
      sets: [],
      rarity: [],
      priceRange: { min: '', max: '', currency: 'usd' },
      artist: '',
      flavorText: '',
      loreFinder: '',
      sortBy: 'name',
      sortOrder: 'asc',
      showAllPrints: false,
      includeTokens: false,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Search className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Advanced Search</h2>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm font-medium rounded-full">
              Powered by KONIVRER
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <span className="text-white text-sm">
                {isExpanded ? 'Simple' : 'Advanced'}
              </span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-white" />
              ) : (
                <ChevronDown className="w-4 h-4 text-white" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Basic Search */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              <Type className="w-4 h-4 inline mr-2" />
              Card Name
            </label>
            <input
              type="text"
              value={searchCriteria.cardName}
              onChange={e => updateCriteria('cardName', e.target.value)}
              placeholder="Enter card name..."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              <BookOpen className="w-4 h-4 inline mr-2" />
              Rules Text
            </label>
            <input
              type="text"
              value={searchCriteria.text}
              onChange={e => updateCriteria('text', e.target.value)}
              placeholder="Enter rules text... (use ~ for card name)"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
            />
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-8"
            >
              {/* Type Line */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Type & Mechanics
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Type Line
                    </label>
                    <input
                      type="text"
                      value={searchCriteria.typeLine}
                      onChange={e => updateCriteria('typeLine', e.target.value)}
                      placeholder="e.g., Familiar, Spell, Artifact"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Card Types
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {cardTypes.map(type => (
                        <button
                          key={type}
                          onClick={() =>
                            toggleArrayValue('selectedTypes', type)
                          }
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            searchCriteria.selectedTypes.includes(type)
                              ? 'bg-purple-500/30 text-purple-300 border border-purple-400'
                              : 'bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Elements & Colors */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Palette className="w-5 h-5 mr-2" />
                  Elements & Identity
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Elements
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {elements.map(element => (
                        <button
                          key={element.name}
                          onClick={() =>
                            toggleArrayValue('colors', element.name)
                          }
                          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            searchCriteria.colors.includes(element.name)
                              ? 'bg-purple-500/30 text-purple-300 border border-purple-400'
                              : 'bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20'
                          }`}
                        >
                          <span className={`text-lg ${element.color}`}>
                            {element.symbol}
                          </span>
                          <span>{element.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Element Comparison
                    </label>
                    <select
                      value={searchCriteria.colorComparison}
                      onChange={e =>
                        updateCriteria('colorComparison', e.target.value)
                      }
                      className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                    >
                      <option value="including">
                        Including (with or without others)
                      </option>
                      <option value="exactly">Exactly these elements</option>
                      <option value="at-most">At most these elements</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Mana & Stats */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Mana & Statistics
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Mana Cost
                    </label>
                    <input
                      type="text"
                      value={searchCriteria.manaCost}
                      onChange={e => updateCriteria('manaCost', e.target.value)}
                      placeholder="e.g., 3, {2}{R}, X"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Power
                    </label>
                    <div className="flex space-x-2">
                      <select
                        value={searchCriteria.power.operator}
                        onChange={e =>
                          updateNestedCriteria(
                            'power',
                            'operator',
                            e.target.value,
                          )
                        }
                        className="px-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                      >
                        {operators.map(op => (
                          <option key={op} value={op}>
                            {op}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={searchCriteria.power.value}
                        onChange={e =>
                          updateNestedCriteria('power', 'value', e.target.value)
                        }
                        placeholder="0"
                        className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Toughness
                    </label>
                    <div className="flex space-x-2">
                      <select
                        value={searchCriteria.toughness.operator}
                        onChange={e =>
                          updateNestedCriteria(
                            'toughness',
                            'operator',
                            e.target.value,
                          )
                        }
                        className="px-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                      >
                        {operators.map(op => (
                          <option key={op} value={op}>
                            {op}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={searchCriteria.toughness.value}
                        onChange={e =>
                          updateNestedCriteria(
                            'toughness',
                            'value',
                            e.target.value,
                          )
                        }
                        placeholder="0"
                        className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sets & Rarity */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Sets & Rarity
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Sets
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {sets.map(set => (
                        <button
                          key={set}
                          onClick={() => toggleArrayValue('sets', set)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            searchCriteria.sets.includes(set)
                              ? 'bg-purple-500/30 text-purple-300 border border-purple-400'
                              : 'bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20'
                          }`}
                        >
                          {set}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Rarity
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {rarities.map(rarity => (
                        <button
                          key={rarity}
                          onClick={() => toggleArrayValue('rarity', rarity)}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            searchCriteria.rarity.includes(rarity)
                              ? 'bg-purple-500/30 text-purple-300 border border-purple-400'
                              : 'bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20'
                          }`}
                        >
                          <Star className="w-4 h-4" />
                          <span>{rarity}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & Market */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Price & Market
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Min Price
                    </label>
                    <input
                      type="number"
                      value={searchCriteria.priceRange.min}
                      onChange={e =>
                        updateNestedCriteria(
                          'priceRange',
                          'min',
                          e.target.value,
                        )
                      }
                      placeholder="0.00"
                      step="0.01"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Max Price
                    </label>
                    <input
                      type="number"
                      value={searchCriteria.priceRange.max}
                      onChange={e =>
                        updateNestedCriteria(
                          'priceRange',
                          'max',
                          e.target.value,
                        )
                      }
                      placeholder="999.99"
                      step="0.01"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Currency
                    </label>
                    <select
                      value={searchCriteria.priceRange.currency}
                      onChange={e =>
                        updateNestedCriteria(
                          'priceRange',
                          'currency',
                          e.target.value,
                        )
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                    >
                      <option value="usd">USD ($)</option>
                      <option value="eur">EUR (€)</option>
                      <option value="tix">MTGO Tix</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Flavor & Lore */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Flavor & Lore
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Artist
                    </label>
                    <input
                      type="text"
                      value={searchCriteria.artist}
                      onChange={e => updateCriteria('artist', e.target.value)}
                      placeholder="Artist name..."
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Flavor Text
                    </label>
                    <input
                      type="text"
                      value={searchCriteria.flavorText}
                      onChange={e =>
                        updateCriteria('flavorText', e.target.value)
                      }
                      placeholder="Flavor text..."
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Lore Finder™
                    </label>
                    <input
                      type="text"
                      value={searchCriteria.loreFinder}
                      onChange={e =>
                        updateCriteria('loreFinder', e.target.value)
                      }
                      placeholder="Character or lore..."
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>
              </div>

              {/* Display Options */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Display Options
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Sort By
                    </label>
                    <select
                      value={searchCriteria.sortBy}
                      onChange={e => updateCriteria('sortBy', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                    >
                      <option value="name">Name</option>
                      <option value="cost">Mana Cost</option>
                      <option value="power">Power</option>
                      <option value="toughness">Toughness</option>
                      <option value="rarity">Rarity</option>
                      <option value="set">Set</option>
                      <option value="price">Price</option>
                      <option value="released">Release Date</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Sort Order
                    </label>
                    <select
                      value={searchCriteria.sortOrder}
                      onChange={e =>
                        updateCriteria('sortOrder', e.target.value)
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                    >
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={searchCriteria.showAllPrints}
                      onChange={e =>
                        updateCriteria('showAllPrints', e.target.checked)
                      }
                      className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500"
                    />
                    <span className="text-white text-sm">Show all prints</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={searchCriteria.includeTokens}
                      onChange={e =>
                        updateCriteria('includeTokens', e.target.checked)
                      }
                      className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500"
                    />
                    <span className="text-white text-sm">
                      Include tokens & extras
                    </span>
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/20">
          <button
            onClick={clearAll}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            Clear All
          </button>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">
              {
                Object.values(searchCriteria).filter(v =>
                  Array.isArray(v)
                    ? v.length > 0
                    : typeof v === 'object'
                      ? Object.values(v).some(
                          val =>
                            val !== '' &&
                            val !== 'usd' &&
                            val !== '=' &&
                            val !== 'including' &&
                            val !== 'name' &&
                            val !== 'asc' &&
                            val !== false,
                        )
                      : v !== '' &&
                        v !== 'including' &&
                        v !== 'name' &&
                        v !== 'asc' &&
                        v !== false &&
                        v !== true,
                ).length
              }{' '}
              filters active
            </span>
            <button
              onClick={handleSearch}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Search Cards
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdvancedSearch;
