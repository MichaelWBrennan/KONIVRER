import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Search, Filter, Plus, Minus, Eye } from 'lucide-react';

import CardViewer from '../components/CardViewer';
import VisualDeckBuilder from '../components/VisualDeckBuilder';
import AdvancedCardFilters from '../components/AdvancedCardFilters';
import DeckValidator from '../components/DeckValidator';
import cardsData from '../data/cards.json';

const EnhancedDeckBuilder = () => {
  const { deckId } = useParams();
  const [deck, setDeck] = useState({
    name: 'Untitled Deck',
    cards: [],
    description: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
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
  const [viewMode, setViewMode] = useState('split'); // 'split', 'cards', 'deck', 'validate'
  const [selectedFormat, setSelectedFormat] = useState('standard');

  // Load deck if deckId is provided
  useEffect(() => {
    if (deckId) {
      // TODO: Load deck from storage/API
      const savedDecks = JSON.parse(localStorage.getItem('konivrer-decks') || '[]');
      const foundDeck = savedDecks.find(d => d.id === deckId);
      if (foundDeck) {
        setDeck(foundDeck);
      }
    }
  }, [deckId]);

  // Filter cards based on search and filters
  const filteredCards = cardsData.filter(card => {
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
  });

  const addCardToDeck = (card) => {
    const existingCard = deck.cards.find(c => c.id === card.id);
    const currentCount = existingCard ? existingCard.quantity : 0;
    
    if (currentCount < 4) { // Max 4 copies per card
      const newCards = existingCard
        ? deck.cards.map(c => 
            c.id === card.id 
              ? { ...c, quantity: c.quantity + 1 }
              : c
          )
        : [...deck.cards, { ...card, quantity: 1 }];
      
      setDeck({ ...deck, cards: newCards });
    }
  };

  const removeCardFromDeck = (cardId) => {
    const newCards = deck.cards
      .map(c => 
        c.id === cardId 
          ? { ...c, quantity: c.quantity - 1 }
          : c
      )
      .filter(c => c.quantity > 0);
    
    setDeck({ ...deck, cards: newCards });
  };

  const saveDeck = () => {
    const savedDecks = JSON.parse(localStorage.getItem('konivrer-decks') || '[]');
    const deckToSave = {
      ...deck,
      id: deckId || Date.now().toString(),
      lastModified: new Date().toISOString(),
    };
    
    const existingIndex = savedDecks.findIndex(d => d.id === deckToSave.id);
    if (existingIndex >= 0) {
      savedDecks[existingIndex] = deckToSave;
    } else {
      savedDecks.push(deckToSave);
    }
    
    localStorage.setItem('konivrer-decks', JSON.stringify(savedDecks));
    alert('Deck saved successfully!');
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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Enhanced Deck Builder</h1>
          <p className="text-gray-400">
            Build and test your deck with advanced tools and statistics
          </p>
          
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-4 mt-4">
            <button
              onClick={() => setViewMode('split')}
              className={`px-4 py-2 rounded ${
                viewMode === 'split' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-4 py-2 rounded ${
                viewMode === 'cards' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
              }`}
            >
              Cards Only
            </button>
            <button
              onClick={() => setViewMode('deck')}
              className={`px-4 py-2 rounded ${
                viewMode === 'deck' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
              }`}
            >
              Deck Only
            </button>
            <button
              onClick={() => setViewMode('validate')}
              className={`px-4 py-2 rounded ${
                viewMode === 'validate' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
              }`}
            >
              Validate
            </button>
          </div>
        </div>

        <div className={`grid gap-6 ${viewMode === 'split' ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
          {/* Card Browser */}
          {(viewMode === 'split' || viewMode === 'cards') && (
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <h2 className="text-xl font-bold mb-4">Card Browser</h2>
                
                {/* Search and Filters */}
                <div className="space-y-4">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                    <input
                      type="text"
                      placeholder="Search cards..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
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
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto">
                {filteredCards.map(card => (
                  <div
                    key={card.id}
                    className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors border border-gray-700"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-white">{card.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <span>Cost: {card.cost}</span>
                          <span>•</span>
                          <span>Power: {card.power}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => addCardToDeck(card)}
                          className="p-1 text-green-400 hover:text-green-300 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                        <button
                          onClick={() => setSelectedCard(card)}
                          className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
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
                    
                    <p className="text-sm text-gray-300 line-clamp-2">
                      {card.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deck Builder */}
          {(viewMode === 'split' || viewMode === 'deck') && (
            <div>
              <VisualDeckBuilder
                deck={deck}
                onDeckChange={setDeck}
                cards={cardsData}
              />
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={saveDeck}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Save Deck
                </button>
              </div>
            </div>
          )}

          {/* Deck Validation */}
          {viewMode === 'validate' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Deck Validation</h2>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="standard">Standard</option>
                  <option value="limited">Limited</option>
                  <option value="eternal">Eternal</option>
                </select>
              </div>
              
              <DeckValidator deck={deck} format={selectedFormat} />
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={saveDeck}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Save Deck
                </button>
              </div>
            </div>
          )}
        </div>

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

export default EnhancedDeckBuilder;