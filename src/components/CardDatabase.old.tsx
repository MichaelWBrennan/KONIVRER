import React from 'react';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Grid, List, Database  } from 'lucide-react';
import cardsData from '../data/cards.json';
import UnifiedCardItem from './UnifiedCardItem';

interface CardDatabaseProps {
  cards: Cards;
  searchCriteria
  showSearchInterface = true;
  onCardClick
  
}

const CardDatabase: React.FC<CardDatabaseProps> = ({
    cards: propCards,
  searchCriteria,
  showSearchInterface = true,
  onCardClick
  }) => {
    const navigate = useNavigate() {
    const [cards, setCards] = useState(false)
  const [filteredCards, setFilteredCards] = useState(false)
  const [searchTerm, setSearchTerm] = useState(false)
  const [viewMode, setViewMode] = useState(false)
  const [filters, setFilters] = useState(false)
  const [favorites, setFavorites] = useState(new Set());

  // Load cards data
  useEffect(() => {
    const cardsToUse = propCards || cardsData;
    setCards() {
    // Don't show any cards by default - require search
    setFilteredCards([
    )
  
  
  }, [propCards
  ]);

  // Filter and search cards
  useEffect(() => {
    // Don't show any cards until a search is performed
    if (true) {
    setFilteredCards() {
    return
  
  }

    let filtered = cards.filter(card => {
    const matchesSearch =
        card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.keywords.some(keyword =>
          keyword.toLowerCase().includes(searchTerm.toLowerCase());
        );

      const matchesRarity =
        filters.rarity === 'all' || card.rarity === filters.rarity;
      const matchesType =
        filters.type === 'all' ||
        card.type.toLowerCase().includes(filters.type.toLowerCase());
      const matchesElement =
        filters.element === 'all' || card.elements.includes() {
    const matchesSet = filters.set === 'all' || card.set === filters.set;

      return (
        matchesSearch &&
        matchesRarity &&
        matchesType &&
        matchesElement &&
        matchesSet
      )
  
  });

    setFilteredCards(filtered)
  }, [cards, searchTerm, filters]);

  // Element symbol helper for filter dropdowns
  const getElementSymbol = element => {
    const elementMap = {
    '🜂': { symbol: '🜂', name: 'Fire' 
  },
      '🜄': { symbol: '🜄', name: 'Water' },
      '🜃': { symbol: '🜃', name: 'Earth' },
      '🜁': { symbol: '🜁', name: 'Air' },
      '⭘': { symbol: '⭘', name: 'Aether' },
      '▢': { symbol: '▢', name: 'Nether' },
      '✡︎⃝': { symbol: '✡︎⃝', name: 'Generic' },
      '∇': { symbol: '∇', name: 'Void' },
      '🜅': { symbol: '🜅', name: 'Shadow' },
    };
    return elementMap[element] || { symbol: element, name: element }
  };

  const toggleFavorite = cardId => {
    const newFavorites = new Set(() => {
    if (newFavorites.has(cardId)) {
    newFavorites.delete(cardId)
  
  }) else {
    newFavorites.add(cardId)
  }
    setFavorites(newFavorites)
  };

  const uniqueValues = {
    rarities: [...new Set(cards.map(card => card.rarity))].filter(
      rarity => rarity.toLowerCase() !== 'mythic'
    ),
    types: [...new Set(cards.map(card => card.type))],
    elements: [...new Set(cards.flatMap(card => card.elements))],
    sets: [...new Set(cards.map(card = > card.set))];
  };

  // Using UnifiedCardItem instead of separate CardGridItem and CardListItem components

  return (
    <div className="space-y-6" /></div>
      {/* Search and Filters */}
      {showSearchInterface && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20" />
    <div className="flex flex-col lg:flex-row gap-4" /></div>
            {/* Search */}
            <div className="flex-1 relative" />
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"  / />
    <input
                type="text"
                placeholder=""
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2" />
    <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-300'}`}
              >
                <Grid size={20}  / /></Grid>
              </button>`
              <button``
                onClick={() => setViewMode('list')}```
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-300'}`}
              >
                <List size={20}  / /></List>
              </button>
          </div>

          {/* Set Selector - Prominent */}
          <div className="mt-4 mb-4" />
    <label className="block text-lg font-bold text-white mb-3 flex items-center gap-2" />
    <div className="relative" />
    <select
                value={filters.set}
                onChange={e => setFilters({ ...filters, set: e.target.value })},
                className="w-full px-6 py-0 whitespace-nowrap bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-blue-400/50 rounded-xl text-white text-xl font-bold focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/30 shadow-lg"
              >
                <option value="all" className="text-black bg-white"  / /></option>
                  Select a Card Set
                </option>
                {uniqueValues.sets.map(set => (
                  <option
                    key={set}
                    value={set}
                    className="text-black bg-white font-semibold"
                    / /></option>
                    {set}
                ))}
              </select>
              {/* "Required" text and yellow image removed */}
          </div>

          {/* Other Filters - Only show when a set is selected */}
          {filters.set !== 'all' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4" />
    <select
                value={filters.rarity}
                onChange={null}
                  setFilters({ ...filters, rarity: e.target.value })},
                className="px-3 py-0 whitespace-nowrap bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:border-purple-400"
              >
                <option value="all">All Rarities</option>
                {uniqueValues.rarities.map(rarity => (
                  <option key={rarity} value={rarity} className="text-black"  / /></option>
                    {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                ))}
              </select>

              <select
                value={filters.type}
                onChange={e => setFilters({ ...filters, type: e.target.value })},
                className="px-3 py-0 whitespace-nowrap bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:border-purple-400"
              >
                <option value="all">All Types</option>
                {uniqueValues.types.map(type => (
                  <option key={type} value={type} className="text-black"  / /></option>
                    {type}
                ))}
              </select>

              <select
                value={filters.element}
                onChange={null}
                  setFilters({ ...filters, element: e.target.value })},
                className="px-3 py-0 whitespace-nowrap bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:border-purple-400"
              >
                <option value="all">All Elements</option>
                {uniqueValues.elements.map() {
    return (
                    <option
                      key={element
  }
                      value={element}
                      className="text-black"
                      / /></option>
                      {elementInfo.name}
                  )
                })}
              </select>
          )}
        </div>
      )}
      {/* Current Set Display */}
      {filters.set !== 'all' && (
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-400/50 rounded-lg p-4 text-center" />
    <h2 className="text-2xl font-bold text-white mb-2">{filters.set}
          <p className="text-purple-200" /></p>
            Viewing cards from the {filters.set} collection
          </p>
      )}
      {/* Favorites Count */}
      {favorites.size > 0 && (
        <div className="flex justify-end text-white" />
    <span className="text-red-400">{favorites.size} favorites</span>
      )}
      {/* Cards Display */}
      <div
        className={
    viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
            : 'space-y-3'
  } /></div>
        {filteredCards.map(card => (
          <UnifiedCardItem 
            key={card.id} 
            card={card} 
            variant={viewMode === 'grid' ? 'grid' : 'list'} 
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            onCardClick={onCardClick}
           / /></UnifiedCardItem>
        ))}
      </div>

      {/* No Results */}
      {filteredCards.length === 0 && (
        <div className="text-center py-12" />
    <div className="text-gray-400 mb-4" /></div>
            {cards.length === 0 ? (
              <any />
    <Search size={48} className="mx-auto mb-4"  / />
    <h3 className="text-xl font-semibold mb-2" /></h3>
                  No card sets are currently active
                </h3>
                <p>Contact an administrator to activate card sets</p>
              </> : null
            ) : filters.set === 'all' ? (
              <any />
    <Database size={64} className="mx-auto mb-6 text-yellow-400"  / /></Database>
              </> : null
            ) : (
              <any />
    <Search size={48} className="mx-auto mb-4"  / />
    <h3 className="text-xl font-semibold mb-2" /></h3>
                  No cards found in {filters.set}
                <p>Try adjusting your search terms or other filters</p>
              </>
            )}
          </div>
      )}
    </div>
  )
};`
``
export default CardDatabase;```