/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Grid,
  List,
  Eye,
  Plus,
  Heart,
  Database,
} from 'lucide-react';
import { motion } from 'framer-motion';
import cardsData from '../data/cards.json';
import { getCardArtPathFromData } from '../utils/cardArtMapping';

const CardDatabase = ({
  cards: propCards,
  searchCriteria,
  showSearchInterface = true,
  onCardClick,
}) => {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    rarity: 'all',
    type: 'all',
    element: 'all',
    set: 'all',
  });
  const [favorites, setFavorites] = useState(new Set());

  // Load cards data
  useEffect(() => {
    const cardsToUse = propCards || cardsData;
    setCards(cardsToUse);
    // Don't show any cards by default - require set selection
    setFilteredCards([]);
  }, [propCards]);

  // Filter and search cards
  useEffect(() => {
    // Don't show any cards if no set is selected
    if (filters.set === 'all') {
      setFilteredCards([]);
      return;
    }

    let filtered = cards.filter(card => {
      const matchesSearch =
        card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.keywords.some(keyword =>
          keyword.toLowerCase().includes(searchTerm.toLowerCase()),
        );

      const matchesRarity =
        filters.rarity === 'all' || card.rarity === filters.rarity;
      const matchesType =
        filters.type === 'all' ||
        card.type.toLowerCase().includes(filters.type.toLowerCase());
      const matchesElement =
        filters.element === 'all' || card.elements.includes(filters.element);
      const matchesSet = filters.set === 'all' || card.set === filters.set;

      return (
        matchesSearch &&
        matchesRarity &&
        matchesType &&
        matchesElement &&
        matchesSet
      );
    });

    setFilteredCards(filtered);
  }, [cards, searchTerm, filters]);

  const getRarityColor = rarity => {
    switch (rarity) {
      case 'common':
        return 'border-gray-400 bg-gray-50';
      case 'uncommon':
        return 'border-green-400 bg-green-50';
      case 'rare':
        return 'border-blue-400 bg-blue-50';

      case 'legendary':
        return 'border-yellow-400 bg-yellow-50';
      default:
        return 'border-gray-400 bg-gray-50';
    }
  };

  const getElementSymbol = element => {
    const elementMap = {
      '🜂': { symbol: '🜂', name: 'Fire' },
      '🜄': { symbol: '🜄', name: 'Water' },
      '🜃': { symbol: '🜃', name: 'Earth' },
      '🜁': { symbol: '🜁', name: 'Air' },
      '⭘': { symbol: '⭘', name: 'Aether' },
      '▢': { symbol: '▢', name: 'Nether' },
      '✡︎⃝': { symbol: '✡︎⃝', name: 'Generic' },
      '∇': { symbol: '∇', name: 'Void' },
      '🜅': { symbol: '🜅', name: 'Shadow' },
    };
    return elementMap[element] || { symbol: element, name: element };
  };

  const toggleFavorite = cardId => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(cardId)) {
      newFavorites.delete(cardId);
    } else {
      newFavorites.add(cardId);
    }
    setFavorites(newFavorites);
  };

  const uniqueValues = {
    rarities: [...new Set(cards.map(card => card.rarity))].filter(
      rarity => rarity.toLowerCase() !== 'mythic',
    ),
    types: [...new Set(cards.map(card => card.type))],
    elements: [...new Set(cards.flatMap(card => card.elements))],
    sets: [...new Set(cards.map(card => card.set))],
  };

  const CardGridItem = ({ card }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      className={`relative bg-white rounded-lg border-2 p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${getRarityColor(card.rarity)}`}
      onClick={() =>
        onCardClick ? onCardClick(card) : navigate(`/card/${card.id}`)
      }
    >
      {/* Card Image */}
      <div className="mb-3 flex justify-center">
        {(() => {
          const localImagePath = getCardArtPathFromData(card);
          console.log(`Card: ${card.name}, Local Image Path: ${localImagePath}`);
          
          return (
            <img
              src={localImagePath || '/assets/card-back-new.png'}
              alt={card.name}
              className="w-32 h-44 object-cover rounded-lg border border-gray-200"
              onError={e => {
                console.log(
                  `Failed to load local image for ${card.name}: ${localImagePath}`,
                );
                e.target.onerror = null;
                e.target.src = '/assets/card-back-new.png';
              }}
              onLoad={e => {
                console.log(
                  `Successfully loaded image for ${card.name}: ${e.target.src}`,
                );
              }}
            />
          );
        })()}
      </div>

      {/* Card Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900 mb-1">{card.name}</h3>
          <div className="flex items-center gap-2 mb-2">
            {card.elements.map((element, index) => {
              const elementInfo = getElementSymbol(element);
              return (
                <span key={index} className="text-xl" title={elementInfo.name}>
                  {elementInfo.symbol}
                </span>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-sm font-medium text-gray-600">
            {typeof card.cost === 'string' ? card.cost : card.cost}
          </span>
          <button
            onClick={e => {
              e.stopPropagation();
              toggleFavorite(card.id);
            }}
            className={`p-1 rounded ${favorites.has(card.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
          >
            <Heart
              size={16}
              fill={favorites.has(card.id) ? 'currentColor' : 'none'}
            />
          </button>
        </div>
      </div>

      {/* Card Type */}
      <div className="mb-2">
        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
          {card.type}
        </span>
      </div>

      {/* Keywords */}
      {card.keywords.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {card.keywords.map((keyword, index) => (
              <span
                key={index}
                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Card Text */}
      <div className="mb-3">
        <p className="text-sm text-gray-700 line-clamp-3">{card.text}</p>
      </div>

      {/* Power/Stats */}
      {card.power !== undefined && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Power: {card.power}</span>
          <span className="text-gray-600 capitalize">{card.rarity}</span>
        </div>
      )}

      {/* Set Info */}
      <div className="absolute top-2 right-2">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
          {card.set}
        </div>
        {card.setNumber && (
          <div className="text-xs text-gray-500 text-center mt-1">
            {card.setNumber}
          </div>
        )}
      </div>
    </motion.div>
  );

  const CardListItem = ({ card }) => (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() =>
        onCardClick ? onCardClick(card) : navigate(`/card/${card.id}`)
      }
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {card.elements.map((element, index) => {
              const elementInfo = getElementSymbol(element);
              return (
                <span key={index} className="text-lg" title={elementInfo.name}>
                  {elementInfo.symbol}
                </span>
              );
            })}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{card.name}</h3>
            <p className="text-sm text-gray-600">{card.type}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            {card.set}
          </div>
          <span className="text-sm font-medium">
            {typeof card.cost === 'string' ? card.cost : card.cost}
          </span>
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${getRarityColor(card.rarity)}`}
          >
            {card.rarity}
          </span>
          <button
            onClick={e => {
              e.stopPropagation();
              toggleFavorite(card.id);
            }}
            className={`p-1 rounded ${favorites.has(card.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
          >
            <Heart
              size={16}
              fill={favorites.has(card.id) ? 'currentColor' : 'none'}
            />
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      {showSearchInterface && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder=""
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-300'}`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-300'}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>

          {/* Set Selector - Prominent */}
          <div className="mt-4 mb-4">
            <label className="block text-lg font-bold text-white mb-3 flex items-center gap-2"></label>
            <div className="relative">
              <select
                value={filters.set}
                onChange={e => setFilters({ ...filters, set: e.target.value })}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-blue-400/50 rounded-xl text-white text-xl font-bold focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/30 shadow-lg"
              >
                <option value="all" className="text-black bg-white">
                  Select a Card Set
                </option>
                {uniqueValues.sets.map(set => (
                  <option
                    key={set}
                    value={set}
                    className="text-black bg-white font-semibold"
                  >
                    {set}
                  </option>
                ))}
              </select>
              {/* "Required" text and yellow image removed */}
            </div>
          </div>

          {/* Other Filters - Only show when a set is selected */}
          {filters.set !== 'all' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
              <select
                value={filters.rarity}
                onChange={e =>
                  setFilters({ ...filters, rarity: e.target.value })
                }
                className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:border-purple-400"
              >
                <option value="all">All Rarities</option>
                {uniqueValues.rarities.map(rarity => (
                  <option key={rarity} value={rarity} className="text-black">
                    {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                  </option>
                ))}
              </select>

              <select
                value={filters.type}
                onChange={e => setFilters({ ...filters, type: e.target.value })}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:border-purple-400"
              >
                <option value="all">All Types</option>
                {uniqueValues.types.map(type => (
                  <option key={type} value={type} className="text-black">
                    {type}
                  </option>
                ))}
              </select>

              <select
                value={filters.element}
                onChange={e =>
                  setFilters({ ...filters, element: e.target.value })
                }
                className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:border-purple-400"
              >
                <option value="all">All Elements</option>
                {uniqueValues.elements.map(element => {
                  const elementInfo = getElementSymbol(element);
                  return (
                    <option
                      key={element}
                      value={element}
                      className="text-black"
                    >
                      {elementInfo.name}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Current Set Display */}
      {filters.set !== 'all' && (
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-400/50 rounded-lg p-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">{filters.set}</h2>
          <p className="text-purple-200">
            Viewing cards from the {filters.set} collection
          </p>
        </div>
      )}

      {/* Favorites Count */}
      {favorites.size > 0 && (
        <div className="flex justify-end text-white">
          <span className="text-red-400">{favorites.size} favorites</span>
        </div>
      )}

      {/* Cards Display */}
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
            : 'space-y-3'
        }
      >
        {filteredCards.map(card =>
          viewMode === 'grid' ? (
            <CardGridItem key={card.id} card={card} />
          ) : (
            <CardListItem key={card.id} card={card} />
          ),
        )}
      </div>

      {/* No Results */}
      {filteredCards.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            {cards.length === 0 ? (
              <>
                <Search size={48} className="mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No card sets are currently active
                </h3>
                <p>Contact an administrator to activate card sets</p>
              </>
            ) : filters.set === 'all' ? (
              <>
                <Database size={64} className="mx-auto mb-6 text-yellow-400" />
              </>
            ) : (
              <>
                <Search size={48} className="mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No cards found in {filters.set}
                </h3>
                <p>Try adjusting your search terms or other filters</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardDatabase;
