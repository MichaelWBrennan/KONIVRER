import { motion } from 'framer-motion';
import React from 'react';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, X, Filter, Zap, Type, Palette, DollarSign, Calendar, Star, BookOpen, Settings  } from 'lucide-react';

interface AdvancedSearchProps {
    onSearch
  onClose

  }
const AdvancedSearch: React.FC<AdvancedSearchProps> = ({  onSearch, onClose  }) => {
    const [isExpanded, setIsExpanded] = useState(false)
  const [searchCriteria, setSearchCriteria] = useState(false)

  // KONIVRER specific data
  const cardTypes = [
    'Familiar',
    'Spell',
    'Artifact',
    'Enchantment',
    'Land',
    'Planeswalker'
  ];

  // KONIVRER Elements (for costs and Azoth generation) - using alchemical symbols for classic elements
  const elements = [
    { name: 'Fire', symbol: '🜂', color: 'text-black' 
  },
    { name: 'Water', symbol: '🜄', color: 'text-black' },
    { name: 'Earth', symbol: '🜃', color: 'text-black' },
    { name: 'Air', symbol: '🜁', color: 'text-black' },
    { name: 'Aether', symbol: '○', color: 'text-black' },
    { name: 'Nether', symbol: '□', color: 'text-black' },
    { name: 'Generic', symbol: '✡︎⃝', color: 'text-black' },
  ];

  // KONIVRER Keywords (special abilities, separate from elements)
  const keywords = [
    { name: 'Brilliance', symbol: '✦', color: 'text-yellow-400' },
    { name: 'Void', symbol: '◯', color: 'text-purple-400' },
    { name: 'Gust', symbol: '≋', color: 'text-blue-400' },
    { name: 'Submerged', symbol: '≈', color: 'text-cyan-400' },
    { name: 'Inferno', symbol: '※', color: 'text-red-400' },
    { name: 'Steadfast', symbol: '⬢', color: 'text-green-400' },
  ];

  const rarities = ['Common', 'Uncommon', 'Rare', 'Mythic', 'Legendary'];

  const sets = ['PRIMA MATERIA', 'Core Set', 'Expansion 1', 'Expansion 2'];

  const operators = ['=', '≠', '<', '≤', '>', '≥'];

  const updateCriteria = (field, value): any => {
    setSearchCriteria(prev => ({
    ...prev,
      [field]: value
  
  }))
  };

  const updateNestedCriteria = (field, subfield, value): any => {
    setSearchCriteria(prev => ({
    ...prev,
      [field]: {
    ...prev[field],
        [subfield]: value
  
  }
    }))
  };

  const toggleArrayValue = (field, value): any => {
    setSearchCriteria(prev => ({
    ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(): [...prev[field], value]
  
  }))
  } { return null; }

  const handleSearch = (): any => {
    onSearch(searchCriteria)
  };

  const clearAll = (): any => {
    setSearchCriteria({
    cardName: '',
      text: '',
      typeLine: '',
      allowPartialTypes: true,
      selectedTypes: [
    ,
      colors: [
  ],
      colorComparison: 'including',
      colorIdentity: [
    ,
      manaCost: '',
      power: { operator: '=', value: '' 
  },
      toughness: { operator: '=', value: '' },
      sets: [
  ],
      rarity: [],
      priceRange: { min: '', max: '', currency: 'usd' },
      artist: '',
      flavorText: '',
      loreFinder: '',
      sortBy: 'name',
      sortOrder: 'asc',
      showAllPrints: false,
      includeTokens: false
    })
  };

  return (
    <any />
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden"
      / /></motion>
      {/* Header */}
      <div className="p-6 border-b border-white/20" />
    <div className="flex items-center justify-between" />
    <div className="flex items-center space-x-3" />
    <Search className="w-6 h-6 text-purple-400"  / />
    <h2 className="text-2xl font-bold text-white">Advanced Search</h2>
            <span className="px-3 py-0 whitespace-nowrap bg-purple-500/20 text-purple-300 text-sm font-medium rounded-full" /></span>
              Powered by KONIVRER

          <div className="flex items-center space-x-2" />
    <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-2 px-4 py-0 whitespace-nowrap bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            ></button>
              <span className="text-white text-sm" /></span>
                {isExpanded ? 'Simple' : 'Advanced'}
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-white"  / /></ChevronUp> : null
              ) : (
                <ChevronDown className="w-4 h-4 text-white"  / /></ChevronDown>
              )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors" />
    <X className="w-5 h-5 text-white"  / />
    <div className="p-6" /></div>
        {/* Basic Search */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8" />
    <div />
    <label className="block text-sm font-medium text-white mb-2" />
    <Type className="w-4 h-4 inline mr-2"  / /></Type>
              Card Name

            <input
              type="text"
              value={searchCriteria.cardName}
              onChange={e => updateCriteria('cardName', e.target.value)}
              placeholder="Enter card name..."
              className="w-full px-4 py-0 whitespace-nowrap bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
            />

          <div />
    <label className="block text-sm font-medium text-white mb-2" />
    <BookOpen className="w-4 h-4 inline mr-2"  / /></BookOpen>
              Rules Text

            <input
              type="text"
              value={searchCriteria.text}
              onChange={e => updateCriteria('text', e.target.value)}
              placeholder="Enter rules text... (use ~ for card name)"
              className="w-full px-4 py-0 whitespace-nowrap bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
            />

        <AnimatePresence  / /></AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-8"
              / /></motion>
              {/* Type Line */}
              <div />
    <h3 className="text-lg font-semibold text-white mb-4 flex items-center" />
    <Filter className="w-5 h-5 mr-2"  / /></Filter>
                  Type & Mechanics

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" />
    <div />
    <label className="block text-sm font-medium text-white mb-2" /></label>
                      Type Line

                    <input
                      type="text"
                      value={searchCriteria.typeLine}
                      onChange={e => updateCriteria('typeLine', e.target.value)}
                      placeholder="e.g., Familiar, Spell, Artifact"
                      className="w-full px-4 py-0 whitespace-nowrap bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                    />

                  <div />
    <label className="block text-sm font-medium text-white mb-2" /></label>
                      Card Types

                    <div className="flex flex-wrap gap-2" /></div>
                      {cardTypes.map(type => (
                        <button
                          key={type}
                          onClick={null}
                            toggleArrayValue('selectedTypes', type)}
                          className={`px-3 py-0 whitespace-nowrap rounded-lg text-sm font-medium transition-colors ${
    searchCriteria.selectedTypes.includes(type)`
                              ? 'bg-purple-500/30 text-purple-300 border border-purple-400'` : null`
                              : 'bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20'```
  }`}
                        >
                          {type}
                      ))}


              {/* Elements & Colors */}
              <div />
    <h3 className="text-lg font-semibold text-white mb-4 flex items-center" />
    <Palette className="w-5 h-5 mr-2"  / /></Palette>
                  Elements & Identity

                <div className="space-y-4" />
    <div />
    <label className="block text-sm font-medium text-white mb-2" /></label>
                      Elements

                    <div className="flex flex-wrap gap-2" /></div>
                      {elements.map(element => (
                        <button
                          key={element.name}
                          onClick={null}`
                            toggleArrayValue('colors', element.name)}```
                          className={`flex items-center space-x-2 px-3 py-0 whitespace-nowrap rounded-lg text-sm font-medium transition-colors ${
    searchCriteria.colors.includes(element.name)`
                              ? 'bg-purple-500/30 text-purple-300 border border-purple-400'` : null`
                              : 'bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20'```
  }`}``
                        >```
                          <span className={`text-lg ${element.color}`} /></span>
                            {element.symbol}
                          <span>{element.name}</span>

                      ))}

                  <div />
    <label className="block text-sm font-medium text-white mb-2" /></label>
                      Element Comparison

                    <select
                      value={searchCriteria.colorComparison}
                      onChange={null}
                        updateCriteria('colorComparison', e.target.value)}
                      className="px-4 py-0 whitespace-nowrap bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                    >
                      <option value="including"  / /></option>
                        Including (with or without others)

                      <option value="exactly">Exactly these elements</option>
                      <option value="at-most">At most these elements</option>


              {/* Mana & Stats */}
              <div />
    <h3 className="text-lg font-semibold text-white mb-4 flex items-center" />
    <Zap className="w-5 h-5 mr-2"  / /></Zap>
                  Mana & Statistics

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" />
    <div />
    <label className="block text-sm font-medium text-white mb-2" /></label>
                      Mana Cost

                    <input
                      type="text"
                      value={searchCriteria.manaCost}
                      onChange={e => updateCriteria('manaCost', e.target.value)}
                      placeholder="e.g., 3, {2}{R}, X"
                      className="w-full px-4 py-0 whitespace-nowrap bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                    />

                  <div />
    <label className="block text-sm font-medium text-white mb-2" /></label>
                      Power

                    <div className="flex space-x-2" />
    <select
                        value={searchCriteria.power.operator}
                        onChange={null}
                          )}
                        className="px-3 py-0 whitespace-nowrap bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                      >
                        {operators.map(op => (
                          <option key={op} value={op}  / /></option>
                            {op}
                        ))}

                      <input
                        type="number"
                        value={searchCriteria.power.value}
                        onChange={null}
                          updateNestedCriteria('power', 'value', e.target.value)}
                        placeholder="0"
                        className="flex-1 px-4 py-0 whitespace-nowrap bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                      />

                  <div />
    <label className="block text-sm font-medium text-white mb-2" /></label>
                      Toughness

                    <div className="flex space-x-2" />
    <select
                        value={searchCriteria.toughness.operator}
                        onChange={null}
                          )}
                        className="px-3 py-0 whitespace-nowrap bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                      >
                        {operators.map(op => (
                          <option key={op} value={op}  / /></option>
                            {op}
                        ))}

                      <input
                        type="number"
                        value={searchCriteria.toughness.value}
                        onChange={null}
                          )}
                        placeholder="0"
                        className="flex-1 px-4 py-0 whitespace-nowrap bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                      />


              {/* Sets & Rarity */}
              <div />
    <h3 className="text-lg font-semibold text-white mb-4 flex items-center" />
    <Calendar className="w-5 h-5 mr-2"  / /></Calendar>
                  Sets & Rarity

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" />
    <div />
    <label className="block text-sm font-medium text-white mb-2" /></label>
                      Sets

                    <div className="flex flex-wrap gap-2" /></div>
                      {sets.map(set => (
                        <button`
                          key={set}``
                          onClick={() => toggleArrayValue('sets', set)}```
                          className={`px-3 py-0 whitespace-nowrap rounded-lg text-sm font-medium transition-colors ${
    searchCriteria.sets.includes(set)`
                              ? 'bg-purple-500/30 text-purple-300 border border-purple-400'` : null`
                              : 'bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20'```
  }`}
                        >
                          {set}
                      ))}</button>

                  <div />
    <label className="block text-sm font-medium text-white mb-2" /></label>
                      Rarity

                    <div className="flex flex-wrap gap-2" /></div>
                      {rarities.map(rarity => (
                        <button`
                          key={rarity}``
                          onClick={() => toggleArrayValue('rarity', rarity)}```
                          className={`flex items-center space-x-2 px-3 py-0 whitespace-nowrap rounded-lg text-sm font-medium transition-colors ${
    searchCriteria.rarity.includes(rarity)`
                              ? 'bg-purple-500/30 text-purple-300 border border-purple-400'` : null`
                              : 'bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20'```
  }`}
                        ></button>
                          <Star className="w-4 h-4"  / />
    <span>{rarity}</span>

                      ))}


              {/* Price & Market */}
              <div />
    <h3 className="text-lg font-semibold text-white mb-4 flex items-center" />
    <DollarSign className="w-5 h-5 mr-2"  / /></DollarSign>
                  Price & Market

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" />
    <div />
    <label className="block text-sm font-medium text-white mb-2" /></label>
                      Min Price

                    <input
                      type="number"
                      value={searchCriteria.priceRange.min}
                      onChange={null}
                        )}
                      placeholder="0.00"
                      step="0.01"
                      className="w-full px-4 py-0 whitespace-nowrap bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                    />

                  <div />
    <label className="block text-sm font-medium text-white mb-2" /></label>
                      Max Price

                    <input
                      type="number"
                      value={searchCriteria.priceRange.max}
                      onChange={null}
                        )}
                      placeholder="999.99"
                      step="0.01"
                      className="w-full px-4 py-0 whitespace-nowrap bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                    />

                  <div />
    <label className="block text-sm font-medium text-white mb-2" /></label>
                      Currency

                    <select
                      value={searchCriteria.priceRange.currency}
                      onChange={null}
                        )}
                      className="w-full px-4 py-0 whitespace-nowrap bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                    >
                      <option value="usd">USD ($)</option>
                      <option value="eur">EUR (€)</option>
                      <option value="tix">KONIVRERO Tix</option>


              {/* Flavor & Lore */}
              <div />
    <h3 className="text-lg font-semibold text-white mb-4 flex items-center" />
    <BookOpen className="w-5 h-5 mr-2"  / /></BookOpen>
                  Flavor & Lore

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" />
    <div />
    <label className="block text-sm font-medium text-white mb-2" /></label>
                      Artist

                    <input
                      type="text"
                      value={searchCriteria.artist}
                      onChange={e => updateCriteria('artist', e.target.value)}
                      placeholder="Artist name..."
                      className="w-full px-4 py-0 whitespace-nowrap bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                    />

                  <div />
    <label className="block text-sm font-medium text-white mb-2" /></label>
                      Flavor Text

                    <input
                      type="text"
                      value={searchCriteria.flavorText}
                      onChange={null}
                        updateCriteria('flavorText', e.target.value)}
                      placeholder="Flavor text..."
                      className="w-full px-4 py-0 whitespace-nowrap bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                    />

                  <div />
    <label className="block text-sm font-medium text-white mb-2" /></label>
                      Lore Finder™

                    <input
                      type="text"
                      value={searchCriteria.loreFinder}
                      onChange={null}
                        updateCriteria('loreFinder', e.target.value)}
                      placeholder="Character or lore..."
                      className="w-full px-4 py-0 whitespace-nowrap bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                    />


              {/* Display Options */}
              <div />
    <h3 className="text-lg font-semibold text-white mb-4 flex items-center" />
    <Settings className="w-5 h-5 mr-2"  / /></Settings>
                  Display Options

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" />
    <div />
    <label className="block text-sm font-medium text-white mb-2" /></label>
                      Sort By

                    <select
                      value={searchCriteria.sortBy}
                      onChange={e => updateCriteria('sortBy', e.target.value)}
                      className="w-full px-4 py-0 whitespace-nowrap bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                    >
                      <option value="name">Name</option>
                      <option value="cost">Mana Cost</option>
                      <option value="power">Power</option>
                      <option value="toughness">Toughness</option>
                      <option value="rarity">Rarity</option>
                      <option value="set">Set</option>
                      <option value="price">Price</option>
                      <option value="released">Release Date</option>

                  <div />
    <label className="block text-sm font-medium text-white mb-2" /></label>
                      Sort Order

                    <select
                      value={searchCriteria.sortOrder}
                      onChange={null}
                        updateCriteria('sortOrder', e.target.value)}
                      className="w-full px-4 py-0 whitespace-nowrap bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                    >
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>

                <div className="flex flex-wrap gap-4 mt-4" />
    <label className="flex items-center space-x-2 cursor-pointer" />
    <input
                      type="checkbox"
                      checked={searchCriteria.showAllPrints}
                      onChange={null}
                        updateCriteria('showAllPrints', e.target.checked)}
                      className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500"
                    />
                    <span className="text-white text-sm">Show all prints</span>
                  <label className="flex items-center space-x-2 cursor-pointer" />
    <input
                      type="checkbox"
                      checked={searchCriteria.includeTokens}
                      onChange={null}
                        updateCriteria('includeTokens', e.target.checked)}
                      className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500"
                    />
                    <span className="text-white text-sm" /></span>
                      Include tokens & extras



    </>
  )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/20" />
    <button
            onClick={clearAll}
            className="px-6 py-0 whitespace-nowrap bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors" /></button>
            Clear All

          <div className="flex items-center space-x-4" />
    <span className="text-sm text-gray-400" /></span>
              {
    Object.values(searchCriteria).filter(v =>
                  Array.isArray(v)
                    ? v.length > 0 : null
                    : typeof v === 'object'
                      ? Object.values(v).some(
                          val =>
                            val !== '' &&
                            val !== 'usd' &&
                            val !== '=' &&
                            val !== 'including' &&
                            val !== 'name' &&
                            val !== 'asc' &&
                            val !== false
                        ) : null
                      : v !== '' &&
                        v !== 'including' &&
                        v !== 'name' &&
                        v !== 'asc' &&
                        v !== false &&
                        v !== true
                ).length
  }{' '}
              filters active

            <button
              onClick={handleSearch}
              className="px-8 py-0 whitespace-nowrap bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105" /></button>
              Search Cards



  )
};`
``
export default AdvancedSearch;```