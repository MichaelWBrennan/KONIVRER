import React from 'react';
/**
 * KONIVRER Deck Database - Comprehensive Advanced Search
 * Based on Advanced advanced search with KONIVRER adaptations
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ChevronDown,
  ChevronUp,
  X,
  Filter,
  Type,
  Palette,
  DollarSign,
  Calendar,
  Star,
  User,
  BookOpen,
  Globe,
  Settings,
  Hash,
  Zap,
  Target,
  Shield,
  Sword,
  Eye,
  RotateCcw,
  Plus,
  Minus,
} from 'lucide-react';

const ComprehensiveAdvancedSearch = ({ onSearch, onClose, initialCriteria = {} }): any => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');
  const [searchCriteria, setSearchCriteria] = useState({
    // Basic Search
    cardName: '',
    nameComparison: 'contains', // contains, exact, starts, ends
    text: '',
    textComparison: 'contains', // contains, exact, word-order-matters
    
    // Type Line
    typeLine: '',
    allowPartialTypes: true,
    selectedTypes: [],
    typeComparison: 'including', // including, excluding
    
    // Elements & Identity (KONIVRER's version of colors)
    elements: [],
    elementComparison: 'including', // including, exactly, at-most, at-least
    elementIdentity: [], // for deck building restrictions
    
    // Mana Cost
    manaCost: '',
    manaCostComparison: 'exact', // exact, less, greater, less-equal, greater-equal
    convertedManaCost: { operator: '=', value: '' },
    
    // Stats
    attack: { operator: '=', value: '' },
    defense: { operator: '=', value: '' },
    strength: { operator: '=', value: '' }, // KONIVRER combined stat
    
    // Keywords & Abilities
    keywords: [],
    keywordComparison: 'including', // including, excluding, exactly
    abilities: [],
    
    // Sets & Rarity
    sets: [],
    setComparison: 'including', // including, excluding
    rarity: [],
    rarityComparison: 'including', // including, excluding
    
    // Collector Info
    collectorNumber: '',
    collectorComparison: 'exact', // exact, range
    collectorRange: { min: '', max: '' },
    
    // Prices
    priceRange: { min: '', max: '', currency: 'usd' },
    priceComparison: 'between', // between, less, greater
    
    // Flavor & Lore
    artist: '',
    artistComparison: 'contains', // contains, exact
    flavorText: '',
    flavorComparison: 'contains', // contains, exact, word-order-matters
    loreFinder: '', // searches all text fields
    

    
    // Language & Localization
    language: 'en',
    includeTranslations: false,
    
    // Advanced Criteria
    criteria: [],
    criteriaComparison: 'including', // including, excluding
    
    // Display & Sorting
    sortBy: 'name',
    sortOrder: 'asc',
    showAllPrints: false,
    includeTokens: false,
    includeExtras: false,
    groupBy: 'none', // none, set, type, element, rarity
    
    // Search Options
    caseSensitive: false,
    useRegex: false,
    searchMode: 'and', // and, or
    
    ...initialCriteria
  });

  // KONIVRER specific data
  const cardTypes = [
    'ΦLAG', 'ELEMENTAL', 'FAMILIAR', 'SPELL', 'ARTIFACT', 'ENCHANTMENT', 
    'LAND', 'PLANESWALKER', 'TOKEN', 'EMBLEM'
  ];

  const elements = [
    { name: 'Fire', symbol: '🔥', color: 'text-black', description: 'Aggressive, direct damage' },
    { name: 'Water', symbol: '💧', color: 'text-black', description: 'Control, card draw' },
    { name: 'Earth', symbol: '🌍', color: 'text-black', description: 'Growth, permanents' },
    { name: 'Air', symbol: '💨', color: 'text-black', description: 'Speed, evasion' },
    { name: 'Quintessence', symbol: '✨', color: 'text-black', description: 'Pure energy' },
    { name: 'Void', symbol: '🕳️', color: 'text-black', description: 'Destruction, exile' },
    { name: 'Neutral', symbol: '⚪', color: 'text-black', description: 'Colorless' },
  ];

  const keywords = [
    'BRILLIANCE', 'VOID', 'GUST', 'SUBMERGED', 'INFERNO', 'STEADFAST',
    'HASTE', 'VIGILANCE', 'FLYING', 'TRAMPLE', 'LIFELINK', 'DEATHTOUCH',
    'FIRST STRIKE', 'DOUBLE STRIKE', 'HEXPROOF', 'INDESTRUCTIBLE'
  ];

  const rarities = ['Common', 'Uncommon', 'Rare', 'Mythic', 'Special', 'Legendary'];

  const sets = ['PRIMA MATERIA', 'Core Set', 'Expansion 1', 'Expansion 2'];



  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
  ];

  const operators = [
    { symbol: '=', label: 'Equal to' },
    { symbol: '≠', label: 'Not equal to' },
    { symbol: '<', label: 'Less than' },
    { symbol: '≤', label: 'Less than or equal' },
    { symbol: '>', label: 'Greater than' },
    { symbol: '≥', label: 'Greater than or equal' },
  ];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'cost', label: 'Mana Cost' },
    { value: 'type', label: 'Type' },
    { value: 'rarity', label: 'Rarity' },
    { value: 'set', label: 'Set' },
    { value: 'collector', label: 'Collector Number' },
    { value: 'artist', label: 'Artist' },
    { value: 'price', label: 'Price' },
    { value: 'power', label: 'Attack' },
    { value: 'toughness', label: 'Defense' },
    { value: 'random', label: 'Random' },
  ];

  const updateCriteria = (field, value): any => {
    setSearchCriteria(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateNestedCriteria = (field, subfield, value): any => {
    setSearchCriteria(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [subfield]: value,
      },
    }));
  };

  const toggleArrayValue = (field, value): any => {
    setSearchCriteria(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value],
    }));
  };

  const addCriteria = (criteria): any => {
    setSearchCriteria(prev => ({
      ...prev,
      criteria: [...prev.criteria, criteria],
    }));
  };

  const removeCriteria = (index): any => {
    setSearchCriteria(prev => ({
      ...prev,
      criteria: prev.criteria.filter((_, i) => i !== index),
    }));
  };

  const handleSearch = (): any => {
    onSearch(searchCriteria);
  };

  const clearAll = (): any => {
    setSearchCriteria({
      cardName: '',
      nameComparison: 'contains',
      text: '',
      textComparison: 'contains',
      typeLine: '',
      allowPartialTypes: true,
      selectedTypes: [],
      typeComparison: 'including',
      elements: [],
      elementComparison: 'including',
      elementIdentity: [],
      manaCost: '',
      manaCostComparison: 'exact',
      convertedManaCost: { operator: '=', value: '' },
      attack: { operator: '=', value: '' },
      defense: { operator: '=', value: '' },
      strength: { operator: '=', value: '' },
      keywords: [],
      keywordComparison: 'including',
      abilities: [],
      sets: [],
      setComparison: 'including',
      rarity: [],
      rarityComparison: 'including',
      collectorNumber: '',
      collectorComparison: 'exact',
      collectorRange: { min: '', max: '' },
      priceRange: { min: '', max: '', currency: 'usd' },
      priceComparison: 'between',
      artist: '',
      artistComparison: 'contains',
      flavorText: '',
      flavorComparison: 'contains',
      loreFinder: '',

      language: 'en',
      includeTranslations: false,
      criteria: [],
      criteriaComparison: 'including',
      sortBy: 'name',
      sortOrder: 'asc',
      showAllPrints: false,
      includeTokens: false,
      includeExtras: false,

      caseSensitive: false,
      useRegex: false,
      searchMode: 'and',
    });
  };

  const sections = [
    { id: 'basic', label: 'Basic', icon: Search },
    { id: 'types', label: 'Types', icon: Type },
    { id: 'elements', label: 'Elements', icon: Palette },
    { id: 'stats', label: 'Stats', icon: Target },
    { id: 'sets', label: 'Sets', icon: Calendar },
    { id: 'prices', label: 'Prices', icon: DollarSign },
    { id: 'flavor', label: 'Flavor', icon: BookOpen },

    { id: 'advanced', label: 'Advanced', icon: Settings },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden max-w-7xl mx-auto"
     />
      {/* Header */}
      <div className="p-6 border-b border-white/20"></div>
        <div className="flex items-center justify-between"></div>
          <div className="flex items-center space-x-3"></div>
            <Search className="w-6 h-6 text-purple-400" / />
            <h2 className="text-2xl font-bold text-white">Comprehensive Card Search</h2>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm font-medium rounded-full"></span>
              Powered by KONIVRER
            </span>
          <div className="flex items-center space-x-2"></div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <span className="text-white text-sm"></span>
                {isExpanded ? 'Simple' : 'Advanced'}
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-white" / />
              ) : (
                <ChevronDown className="w-4 h-4 text-white" / />
              )}
            <button
              onClick={clearAll}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
             />
              <RotateCcw className="w-4 h-4 text-red-400" / />
              <span className="text-red-400 text-sm">Clear All</span>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
             />
              <X className="w-5 h-5 text-white" / />
            </button>
        </div>

      <div className="p-6"></div>
        {/* Basic Search - Always Visible */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"></div>
          <div></div>
            <label className="block text-sm font-medium text-white mb-2"></label>
              <Type className="w-4 h-4 inline mr-2" / />
              Card Name
            </label>
            <div className="flex space-x-2"></div>
              <select
                value={searchCriteria.nameComparison}
                onChange={e => updateCriteria('nameComparison', e.target.value)}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400"
              >
                <option value="contains">Contains</option>
                <option value="exact">Exact</option>
                <option value="starts">Starts with</option>
                <option value="ends">Ends with</option>
              <input
                type="text"
                value={searchCriteria.cardName}
                onChange={e => updateCriteria('cardName', e.target.value)}
                placeholder="Enter card name..."
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
              />
            </div>

          <div></div>
            <label className="block text-sm font-medium text-white mb-2"></label>
              <BookOpen className="w-4 h-4 inline mr-2" / />
              Rules Text
            </label>
            <div className="flex space-x-2"></div>
              <select
                value={searchCriteria.textComparison}
                onChange={e => updateCriteria('textComparison', e.target.value)}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400"
              >
                <option value="contains">Contains</option>
                <option value="exact">Exact</option>
                <option value="word-order-matters">Word Order Matters</option>
              <input
                type="text"
                value={searchCriteria.text}
                onChange={e => updateCriteria('text', e.target.value)}
                placeholder="Enter rules text... (use ~ for card name)"
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
              />
            </div>
        </div>

        {/* Quick Search Actions */}
        <div className="flex items-center justify-between mb-6"></div>
          <div className="flex items-center space-x-2"></div>
            <span className="text-gray-300 text-sm">Search Mode:</span>
            <select
              value={searchCriteria.searchMode}
              onChange={e => updateCriteria('searchMode', e.target.value)}
              className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-purple-400"
            >
              <option value="and">Match All (AND)</option>
              <option value="or">Match Any (OR)</option>
          </div>
          <button
            onClick={handleSearch}
            className="flex items-center space-x-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
           />
            <Search className="w-4 h-4 text-white" / />
            <span className="text-white font-medium">Search</span>
        </div>

        {/* Advanced Sections */}
        <AnimatePresence />
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-8"
             />
              {/* Section Navigation */}
              <div className="flex flex-wrap gap-2 mb-6"></div>
                {sections.map(section => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        activeSection === section.id
                          ? 'bg-purple-500/30 text-purple-300 border border-purple-400'
                          : 'bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20'
                      }`}
                    >
                      <Icon className="w-4 h-4" / />
                      <span className="text-sm font-medium">{section.label}
                    </button>
                  );
                })}
              </div>

              {/* Section Content */}
              <AnimatePresence mode="wait" />
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                 />
                  {activeSection === 'basic' && (
                    <div className="space-y-6"></div>
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center" />
                        <Search className="w-5 h-5 mr-2" / />
                        Basic Search Options
                      </h3>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"></div>
                        <div></div>
                          <label className="block text-sm font-medium text-white mb-2"></label>
                            Lore Finder™
                          </label>
                          <input
                            type="text"
                            value={searchCriteria.loreFinder}
                            onChange={e => updateCriteria('loreFinder', e.target.value)}
                            placeholder="Search all card text fields..."
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                          />
                          <p className="text-xs text-gray-400 mt-1"></p>
                            Searches name, type, text, flavor text, and artist
                          </p>
                        
                        <div></div>
                          <label className="block text-sm font-medium text-white mb-2"></label>
                            Search Options
                          </label>
                          <div className="space-y-2"></div>
                            <label className="flex items-center space-x-2"></label>
                              <input
                                type="checkbox"
                                checked={searchCriteria.caseSensitive}
                                onChange={e => updateCriteria('caseSensitive', e.target.checked)}
                                className="rounded border-white/20 bg-white/10 text-purple-600 focus:ring-purple-500"
                              />
                              <span className="text-white text-sm">Case sensitive</span>
                            <label className="flex items-center space-x-2"></label>
                              <input
                                type="checkbox"
                                checked={searchCriteria.useRegex}
                                onChange={e => updateCriteria('useRegex', e.target.checked)}
                                className="rounded border-white/20 bg-white/10 text-purple-600 focus:ring-purple-500"
                              />
                              <span className="text-white text-sm">Use regular expressions</span>
                          </div>
                      </div>
                  )}
                  {activeSection === 'types' && (
                    <div className="space-y-6"></div>
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center" />
                        <Type className="w-5 h-5 mr-2" / />
                        Type Line & Card Types
                      </h3>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"></div>
                        <div></div>
                          <label className="block text-sm font-medium text-white mb-2"></label>
                            Type Line
                          </label>
                          <div className="flex space-x-2 mb-2"></div>
                            <select
                              value={searchCriteria.typeComparison}
                              onChange={e => updateCriteria('typeComparison', e.target.value)}
                              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400"
                            >
                              <option value="including">Including</option>
                              <option value="excluding">Excluding</option>
                            <input
                              type="text"
                              value={searchCriteria.typeLine}
                              onChange={e => updateCriteria('typeLine', e.target.value)}
                              placeholder="e.g., ELEMENTAL, FAMILIAR"
                              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                            />
                          </div>
                          <label className="flex items-center space-x-2"></label>
                            <input
                              type="checkbox"
                              checked={searchCriteria.allowPartialTypes}
                              onChange={e => updateCriteria('allowPartialTypes', e.target.checked)}
                              className="rounded border-white/20 bg-white/10 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="text-white text-sm">Allow partial type matches</span>
                        </div>
                        
                        <div></div>
                          <label className="block text-sm font-medium text-white mb-2"></label>
                            Card Types
                          </label>
                          <div className="flex flex-wrap gap-2"></div>
                            {cardTypes.map(type => (
                              <button
                                key={type}
                                onClick={() => toggleArrayValue('selectedTypes', type)}
                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                  searchCriteria.selectedTypes.includes(type)
                                    ? 'bg-purple-500/30 text-purple-300 border border-purple-400'
                                    : 'bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20'
                                }`}
                              >
                                {type}
                            ))}
                          </div>
                      </div>
                  )}
                  {activeSection === 'elements' && (
                    <div className="space-y-6"></div>
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center" />
                        <Palette className="w-5 h-5 mr-2" / />
                        Elements & Identity
                      </h3>
                      
                      <div className="space-y-4"></div>
                        <div></div>
                          <div className="flex items-center justify-between mb-2"></div>
                            <label className="block text-sm font-medium text-white"></label>
                              Elements
                            </label>
                            <select
                              value={searchCriteria.elementComparison}
                              onChange={e => updateCriteria('elementComparison', e.target.value)}
                              className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-purple-400"
                            >
                              <option value="including">Including</option>
                              <option value="exactly">Exactly</option>
                              <option value="at-most">At most</option>
                              <option value="at-least">At least</option>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2"></div>
                            {elements.map(element => (
                              <button
                                key={element.name}
                                onClick={() => toggleArrayValue('elements', element.name)}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  searchCriteria.elements.includes(element.name)
                                    ? 'bg-purple-500/30 text-purple-300 border border-purple-400'
                                    : 'bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20'
                                }`}
                                title={element.description}
                              >
                                <span className={element.color}>{element.symbol}
                                <span>{element.name}
                              </button>
                            ))}
                          </div>
                        
                        <div></div>
                          <label className="block text-sm font-medium text-white mb-2"></label>
                            Element Identity (for deck building)
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2"></div>
                            {elements.map(element => (
                              <button
                                key={element.name}
                                onClick={() => toggleArrayValue('elementIdentity', element.name)}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  searchCriteria.elementIdentity.includes(element.name)
                                    ? 'bg-green-500/30 text-green-300 border border-green-400'
                                    : 'bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20'
                                }`}
                                title={`Cards that fit in ${element.name} identity decks`}
                              >
                                <span className={element.color}>{element.symbol}
                                <span>{element.name}
                              </button>
                            ))}
                          </div>
                        
                        <div></div>
                          <div className="flex items-center justify-between mb-2"></div>
                            <label className="block text-sm font-medium text-white"></label>
                              Keywords & Abilities
                            </label>
                            <select
                              value={searchCriteria.keywordComparison}
                              onChange={e => updateCriteria('keywordComparison', e.target.value)}
                              className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-purple-400"
                            >
                              <option value="including">Including</option>
                              <option value="excluding">Excluding</option>
                              <option value="exactly">Exactly</option>
                          </div>
                          <div className="flex flex-wrap gap-2"></div>
                            {keywords.map(keyword => (
                              <button
                                key={keyword}
                                onClick={() => toggleArrayValue('keywords', keyword)}
                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                  searchCriteria.keywords.includes(keyword)
                                    ? 'bg-blue-500/30 text-blue-300 border border-blue-400'
                                    : 'bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20'
                                }`}
                              >
                                {keyword}
                            ))}
                          </div>
                      </div>
                  )}
                  {activeSection === 'stats' && (
                    <div className="space-y-6"></div>
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center" />
                        <Target className="w-5 h-5 mr-2" / />
                        Stats & Mana Cost
                      </h3>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"></div>
                        <div className="space-y-4"></div>
                          <div></div>
                            <label className="block text-sm font-medium text-white mb-2"></label>
                              Mana Cost
                            </label>
                            <div className="flex space-x-2"></div>
                              <select
                                value={searchCriteria.manaCostComparison}
                                onChange={e => updateCriteria('manaCostComparison', e.target.value)}
                                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400"
                              >
                                <option value="exact">Exact</option>
                                <option value="less">Less than</option>
                                <option value="greater">Greater than</option>
                                <option value="less-equal">Less or equal</option>
                                <option value="greater-equal">Greater or equal</option>
                              <input
                                type="text"
                                value={searchCriteria.manaCost}
                                onChange={e => updateCriteria('manaCost', e.target.value)}
                                placeholder="e.g., 2RR, XUU"
                                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                              />
                            </div>
                          
                          <div></div>
                            <label className="block text-sm font-medium text-white mb-2"></label>
                              Converted Mana Cost
                            </label>
                            <div className="flex space-x-2"></div>
                              <select
                                value={searchCriteria.convertedManaCost.operator}
                                onChange={e => updateNestedCriteria('convertedManaCost', 'operator', e.target.value)}
                                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400"
                              >
                                {operators.map(op => (
                                  <option key={op.symbol} value={op.symbol}>{op.label}
                                ))}
                              </select>
                              <input
                                type="number"
                                value={searchCriteria.convertedManaCost.value}
                                onChange={e => updateNestedCriteria('convertedManaCost', 'value', e.target.value)}
                                placeholder="0"
                                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                              />
                            </div>
                        </div>
                        
                        <div className="space-y-4"></div>
                          <div></div>
                            <label className="block text-sm font-medium text-white mb-2"></label>
                              <Sword className="w-4 h-4 inline mr-1" / />
                              Attack
                            </label>
                            <div className="flex space-x-2"></div>
                              <select
                                value={searchCriteria.attack.operator}
                                onChange={e => updateNestedCriteria('attack', 'operator', e.target.value)}
                                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400"
                              >
                                {operators.map(op => (
                                  <option key={op.symbol} value={op.symbol}>{op.label}
                                ))}
                              </select>
                              <input
                                type="text"
                                value={searchCriteria.attack.value}
                                onChange={e => updateNestedCriteria('attack', 'value', e.target.value)}
                                placeholder="0, *, X"
                                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                              />
                            </div>
                          
                          <div></div>
                            <label className="block text-sm font-medium text-white mb-2"></label>
                              <Shield className="w-4 h-4 inline mr-1" / />
                              Defense
                            </label>
                            <div className="flex space-x-2"></div>
                              <select
                                value={searchCriteria.defense.operator}
                                onChange={e => updateNestedCriteria('defense', 'operator', e.target.value)}
                                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400"
                              >
                                {operators.map(op => (
                                  <option key={op.symbol} value={op.symbol}>{op.label}
                                ))}
                              </select>
                              <input
                                type="text"
                                value={searchCriteria.defense.value}
                                onChange={e => updateNestedCriteria('defense', 'value', e.target.value)}
                                placeholder="0, *, X"
                                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                              />
                            </div>
                          
                          <div></div>
                            <label className="block text-sm font-medium text-white mb-2"></label>
                              <Zap className="w-4 h-4 inline mr-1" / />
                              Strength (Combined)
                            </label>
                            <div className="flex space-x-2"></div>
                              <select
                                value={searchCriteria.strength.operator}
                                onChange={e => updateNestedCriteria('strength', 'operator', e.target.value)}
                                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400"
                              >
                                {operators.map(op => (
                                  <option key={op.symbol} value={op.symbol}>{op.label}
                                ))}
                              </select>
                              <input
                                type="text"
                                value={searchCriteria.strength.value}
                                onChange={e => updateNestedCriteria('strength', 'value', e.target.value)}
                                placeholder="0, *, X"
                                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                              />
                            </div>
                            <p className="text-xs text-gray-400 mt-1"></p>
                              KONIVRER's combined power/toughness stat
                            </p>
                        </div>
                    </div>
                  )}
                  {activeSection === 'sets' && (
                    <div className="space-y-6"></div>
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center" />
                        <Calendar className="w-5 h-5 mr-2" / />
                        Sets & Rarity
                      </h3>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"></div>
                        <div></div>
                          <div className="flex items-center justify-between mb-2"></div>
                            <label className="block text-sm font-medium text-white"></label>
                              Sets
                            </label>
                            <select
                              value={searchCriteria.setComparison}
                              onChange={e => updateCriteria('setComparison', e.target.value)}
                              className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-purple-400"
                            >
                              <option value="including">Including</option>
                              <option value="excluding">Excluding</option>
                          </div>
                          <div className="space-y-2"></div>
                            {sets.map(set => (
                              <label key={set} className="flex items-center space-x-2"></label>
                                <input
                                  type="checkbox"
                                  checked={searchCriteria.sets.includes(set)}
                                  onChange={() => toggleArrayValue('sets', set)}
                                  className="rounded border-white/20 bg-white/10 text-purple-600 focus:ring-purple-500"
                                />
                                <span className="text-white text-sm">{set}
                              </label>
                            ))}
                          </div>
                        
                        <div></div>
                          <div className="flex items-center justify-between mb-2"></div>
                            <label className="block text-sm font-medium text-white"></label>
                              Rarity
                            </label>
                            <select
                              value={searchCriteria.rarityComparison}
                              onChange={e => updateCriteria('rarityComparison', e.target.value)}
                              className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-purple-400"
                            >
                              <option value="including">Including</option>
                              <option value="excluding">Excluding</option>
                          </div>
                          <div className="flex flex-wrap gap-2"></div>
                            {rarities.map(rarity => (
                              <button
                                key={rarity}
                                onClick={() => toggleArrayValue('rarity', rarity)}
                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                  searchCriteria.rarity.includes(rarity)
                                    ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-400'
                                    : 'bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20'
                                }`}
                              >
                                <Star className="w-3 h-3 inline mr-1" / />
                                {rarity}
                            ))}
                          </div>
                      </div>
                      
                      <div></div>
                        <label className="block text-sm font-medium text-white mb-2"></label>
                          <Hash className="w-4 h-4 inline mr-2" / />
                          Collector Number
                        </label>
                        <div className="flex space-x-2"></div>
                          <select
                            value={searchCriteria.collectorComparison}
                            onChange={e => updateCriteria('collectorComparison', e.target.value)}
                            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400"
                          >
                            <option value="exact">Exact</option>
                            <option value="range">Range</option>
                          {searchCriteria.collectorComparison === 'exact' ? (
                            <input
                              type="text"
                              value={searchCriteria.collectorNumber}
                              onChange={e => updateCriteria('collectorNumber', e.target.value)}
                              placeholder="e.g., 1/63, 42"
                              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                            />
                          ) : (
                            <div className="flex-1 flex space-x-2"></div>
                              <input
                                type="number"
                                value={searchCriteria.collectorRange.min}
                                onChange={e => updateNestedCriteria('collectorRange', 'min', e.target.value)}
                                placeholder="Min"
                                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                              />
                              <span className="text-white self-center">to</span>
                              <input
                                type="number"
                                value={searchCriteria.collectorRange.max}
                                onChange={e => updateNestedCriteria('collectorRange', 'max', e.target.value)}
                                placeholder="Max"
                                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                              />
                            </div>
                          )}
                        </div>
                    </div>
                  )}
                  {activeSection === 'prices' && (
                    <div className="space-y-6"></div>
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center" />
                        <DollarSign className="w-5 h-5 mr-2" / />
                        Price & Market
                      </h3>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"></div>
                        <div></div>
                          <label className="block text-sm font-medium text-white mb-2"></label>
                            Price Range
                          </label>
                          <div className="space-y-2"></div>
                            <select
                              value={searchCriteria.priceRange.currency}
                              onChange={e => updateNestedCriteria('priceRange', 'currency', e.target.value)}
                              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400"
                            >
                              <option value="usd">USD ($)</option>
                              <option value="eur">EUR (€)</option>
                              <option value="tix">KONIVRERO Tickets</option>
                            <div className="flex space-x-2"></div>
                              <input
                                type="number"
                                step="0.01"
                                value={searchCriteria.priceRange.min}
                                onChange={e => updateNestedCriteria('priceRange', 'min', e.target.value)}
                                placeholder="Min price"
                                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                              />
                              <span className="text-white self-center">to</span>
                              <input
                                type="number"
                                step="0.01"
                                value={searchCriteria.priceRange.max}
                                onChange={e => updateNestedCriteria('priceRange', 'max', e.target.value)}
                                placeholder="Max price"
                                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                              />
                            </div>
                        </div>
                        
                        <div></div>
                          <label className="block text-sm font-medium text-white mb-2"></label>
                            Price Comparison
                          </label>
                          <select
                            value={searchCriteria.priceComparison}
                            onChange={e => updateCriteria('priceComparison', e.target.value)}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400"
                          >
                            <option value="between">Between range</option>
                            <option value="less">Less than max</option>
                            <option value="greater">Greater than min</option>
                          <p className="text-xs text-gray-400 mt-2"></p>
                            Prices are updated daily from major marketplaces
                          </p>
                      </div>
                  )}
                  {activeSection === 'flavor' && (
                    <div className="space-y-6"></div>
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center" />
                        <BookOpen className="w-5 h-5 mr-2" / />
                        Flavor & Lore
                      </h3>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"></div>
                        <div></div>
                          <label className="block text-sm font-medium text-white mb-2"></label>
                            <User className="w-4 h-4 inline mr-2" / />
                            Artist
                          </label>
                          <div className="flex space-x-2"></div>
                            <select
                              value={searchCriteria.artistComparison}
                              onChange={e => updateCriteria('artistComparison', e.target.value)}
                              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400"
                            >
                              <option value="contains">Contains</option>
                              <option value="exact">Exact</option>
                            <input
                              type="text"
                              value={searchCriteria.artist}
                              onChange={e => updateCriteria('artist', e.target.value)}
                              placeholder="Artist name..."
                              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                            />
                          </div>
                        
                        <div></div>
                          <label className="block text-sm font-medium text-white mb-2"></label>
                            Flavor Text
                          </label>
                          <div className="flex space-x-2"></div>
                            <select
                              value={searchCriteria.flavorComparison}
                              onChange={e => updateCriteria('flavorComparison', e.target.value)}
                              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400"
                            >
                              <option value="contains">Contains</option>
                              <option value="exact">Exact</option>
                              <option value="word-order-matters">Word Order Matters</option>
                            <input
                              type="text"
                              value={searchCriteria.flavorText}
                              onChange={e => updateCriteria('flavorText', e.target.value)}
                              placeholder="Flavor text..."
                              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                            />
                          </div>
                      </div>
                  )}
                  {activeSection === 'advanced' && (
                    <div className="space-y-6"></div>
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center" />
                        <Settings className="w-5 h-5 mr-2" / />
                        Advanced Options
                      </h3>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"></div>
                        <div className="space-y-4"></div>
                          <div></div>
                            <label className="block text-sm font-medium text-white mb-2"></label>
                              <Globe className="w-4 h-4 inline mr-2" / />
                              Language
                            </label>
                            <select
                              value={searchCriteria.language}
                              onChange={e => updateCriteria('language', e.target.value)}
                              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400"
                            >
                              {languages.map(lang => (
                                <option key={lang.code} value={lang.code}>{lang.name}
                              ))}
                            </select>
                            <label className="flex items-center space-x-2 mt-2"></label>
                              <input
                                type="checkbox"
                                checked={searchCriteria.includeTranslations}
                                onChange={e => updateCriteria('includeTranslations', e.target.checked)}
                                className="rounded border-white/20 bg-white/10 text-purple-600 focus:ring-purple-500"
                              />
                              <span className="text-white text-sm">Include translations</span>
                          </div>
                          
                          <div></div>
                            <label className="block text-sm font-medium text-white mb-2"></label>
                              Sort By
                            </label>
                            <div className="flex space-x-2"></div>
                              <select
                                value={searchCriteria.sortBy}
                                onChange={e => updateCriteria('sortBy', e.target.value)}
                                className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400"
                              >
                                {sortOptions.map(option => (
                                  <option key={option.value} value={option.value}>{option.label}
                                ))}
                              </select>
                              <select
                                value={searchCriteria.sortOrder}
                                onChange={e => updateCriteria('sortOrder', e.target.value)}
                                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400"
                              >
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </div>
                          

                        </div>
                        
                        <div className="space-y-4"></div>
                          <div></div>
                            <label className="block text-sm font-medium text-white mb-2"></label>
                              Display Options
                            </label>
                            <div className="space-y-2"></div>
                              <label className="flex items-center space-x-2"></label>
                                <input
                                  type="checkbox"
                                  checked={searchCriteria.showAllPrints}
                                  onChange={e => updateCriteria('showAllPrints', e.target.checked)}
                                  className="rounded border-white/20 bg-white/10 text-purple-600 focus:ring-purple-500"
                                />
                                <span className="text-white text-sm">Show all card prints</span>
                              <label className="flex items-center space-x-2"></label>
                                <input
                                  type="checkbox"
                                  checked={searchCriteria.includeTokens}
                                  onChange={e => updateCriteria('includeTokens', e.target.checked)}
                                  className="rounded border-white/20 bg-white/10 text-purple-600 focus:ring-purple-500"
                                />
                                <span className="text-white text-sm">Include tokens</span>
                              <label className="flex items-center space-x-2"></label>
                                <input
                                  type="checkbox"
                                  checked={searchCriteria.includeExtras}
                                  onChange={e => updateCriteria('includeExtras', e.target.checked)}
                                  className="rounded border-white/20 bg-white/10 text-purple-600 focus:ring-purple-500"
                                />
                                <span className="text-white text-sm">Include extras (emblems, planes, etc.)</span>
                            </div>
                          
                          <div></div>
                            <label className="block text-sm font-medium text-white mb-2"></label>
                              Custom Criteria
                            </label>
                            <div className="space-y-2"></div>
                              {searchCriteria.criteria.map((criteria, index) => (
                                <div key={index} className="flex items-center space-x-2"></div>
                                  <input
                                    type="text"
                                    value={criteria}
                                    onChange={e => {
                                      const newCriteria = [...searchCriteria.criteria];
                                      newCriteria[index] = e.target.value;
                                      updateCriteria('criteria', newCriteria);
                                    }}
                                    placeholder="Custom search criteria..."
                                    className="flex-1 px-3 py-1 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                                  />
                                  <button
                                    onClick={() => removeCriteria(index)}
                                    className="p-1 text-red-400 hover:text-red-300"
                                  >
                                    <Minus className="w-4 h-4" / />
                                  </button>
                              ))}
                              <button
                                onClick={() => addCriteria('')}
                                className="flex items-center space-x-2 px-3 py-1 bg-green-500/20 hover:bg-green-500/30 rounded text-green-400 text-sm transition-colors"
                              >
                                <Plus className="w-4 h-4" / />
                                <span>Add criteria</span>
                            </div>
                        </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Search Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-white/20"></div>
                <div className="text-sm text-gray-400"></div>
                  {Object.values(searchCriteria).some(value => 
                    Array.isArray(value) ? value.length > 0 : 
                    typeof value === 'object' ? Object.values(value).some(v => v !== '' && v !== false) :
                    value !== '' && value !== false
                  ) && (
                    <span>Active filters detected</span>
                  )}
                <div className="flex items-center space-x-3"></div>
                  <button
                    onClick={clearAll}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                   />
                    Clear All
                  </button>
                  <button
                    onClick={handleSearch}
                    className="flex items-center space-x-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                   />
                    <Search className="w-4 h-4" / />
                    <span>Search Cards</span>
                </div>
            </motion.div>
          )}
        </AnimatePresence>
    </motion.div>
  );
};

export default ComprehensiveAdvancedSearch;