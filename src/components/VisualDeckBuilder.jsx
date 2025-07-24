<<<<<<< HEAD
import { useState, useEffect } from 'react';
import {
  Plus,
  Minus,
  Eye,
  BarChart3,
  Shuffle,
  Download,
  Upload,
  Share2,
  AlertTriangle,
  CheckCircle,
  Book,
  Gamepad2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import rulesEngine from '../utils/rulesEngine';
import RuleTooltip from './RuleTooltip';
import { useDeck } from '../contexts/DeckContext';
import DeckService from '../services/DeckService';
import DeckExportModal from './DeckExportModal';
import DeckImportModal from './DeckImportModal';

const VisualDeckBuilder = ({ deck, onDeckChange, cards }) => {
  const [viewMode, setViewMode] = useState('gallery'); // 'gallery' or 'list'
  const [showStats, setShowStats] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [deckTest, setDeckTest] = useState({ hand: [], library: [] });
  const [deckValidation, setDeckValidation] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const { setActivePlayerDeck } = useDeck();

  // Validate deck whenever it changes
  useEffect(() => {
    if (deck && deck.cards) {
      const validation = DeckService.validateDeck(deck);
      setDeckValidation(validation);
    }
  }, [deck]);

  const addCardToDeck = card => {
    const existingCard = deck.cards.find(c => c.id === card.id);
    const currentCount = existingCard ? existingCard.quantity : 0;

    if (currentCount < 4) {
      // Max 4 copies per card
      const newCards = existingCard
        ? deck.cards.map(c =>
            c.id === card.id ? { ...c, quantity: c.quantity + 1 } : c,
          )
        : [...deck.cards, { ...card, quantity: 1 }];

      onDeckChange({ ...deck, cards: newCards });
    }
  };

  const removeCardFromDeck = cardId => {
    const newCards = deck.cards
      .map(c => (c.id === cardId ? { ...c, quantity: c.quantity - 1 } : c))
      .filter(c => c.quantity > 0);

    onDeckChange({ ...deck, cards: newCards });
  };

  const getTotalCards = () => {
    return deck.cards.reduce((total, card) => total + card.quantity, 0);
  };

  const getManaCurve = () => {
    const curve = {};
    deck.cards.forEach(card => {
      const cost = card.cost;
      curve[cost] = (curve[cost] || 0) + card.quantity;
    });
    return curve;
  };

  const getCardTypeDistribution = () => {
    const distribution = {};
    deck.cards.forEach(card => {
      const type = card.type;
      distribution[type] = (distribution[type] || 0) + card.quantity;
=======

import React, { useState, useEffect } from 'react';
import { Plus, Minus, Search, Filter, Grid, List } from 'lucide-react';

const VisualDeckBuilder = ({ onDeckUpdate, initialDeck = null }) => {
  const [deck, setDeck] = useState(initialDeck || { name: '', cards: [], format: 'standard' });
  const [cardSearch, setCardSearch] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    element: 'all',
    type: 'all',
    cost: 'all',
    rarity: 'all'
  });
  const [viewMode, setViewMode] = useState('grid');
  const [availableCards, setAvailableCards] = useState([]);

  // Mock card data - in a real app, this would come from your cards service
  useEffect(() => {
    // Load available cards
    const mockCards = [
      { id: 1, name: 'Lightning Bolt', cost: 1, element: 'Inferno', type: 'Spell', rarity: 'common', description: 'Deal 3 damage to any target.' },
      { id: 2, name: 'Forest Guardian', cost: 3, element: 'Steadfast', type: 'Creature', rarity: 'uncommon', description: 'A mighty protector of the woods.' },
      { id: 3, name: 'Tidal Wave', cost: 4, element: 'Submerged', type: 'Spell', rarity: 'rare', description: 'Return all creatures to their owners hands.' },
      { id: 4, name: 'Void Walker', cost: 2, element: 'Void', type: 'Creature', rarity: 'mythic', description: 'Cannot be blocked.' },
      { id: 5, name: 'Mystic Orb', cost: 0, element: 'Aether', type: 'Artifact', rarity: 'legendary', description: 'Draw a card at the beginning of your turn.' }
    ];
    setAvailableCards(mockCards);
  }, []);

  const filteredCards = availableCards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(cardSearch.toLowerCase()) ||
                         card.description.toLowerCase().includes(cardSearch.toLowerCase());
    const matchesElement = selectedFilters.element === 'all' || card.element === selectedFilters.element;
    const matchesType = selectedFilters.type === 'all' || card.type === selectedFilters.type;
    const matchesRarity = selectedFilters.rarity === 'all' || card.rarity === selectedFilters.rarity;
    
    let matchesCost = true;
    if (selectedFilters.cost !== 'all') {
      const [min, max] = selectedFilters.cost.split('-').map(Number);
      matchesCost = card.cost >= min && (max === undefined || card.cost <= max);
    }
    
    return matchesSearch && matchesElement && matchesType && matchesRarity && matchesCost;
  });

  const addCardToDeck = (card) => {
    const existingCard = deck.cards.find(c => c.id === card.id);
    const newCards = existingCard 
      ? deck.cards.map(c => c.id === card.id ? { ...c, quantity: (c.quantity || 1) + 1 } : c)
      : [...deck.cards, { ...card, quantity: 1 }];
    
    const updatedDeck = { ...deck, cards: newCards };
    setDeck(updatedDeck);
    onDeckUpdate?.(updatedDeck);
  };

  const removeCardFromDeck = (cardId) => {
    const existingCard = deck.cards.find(c => c.id === cardId);
    if (!existingCard) return;
    
    const newCards = existingCard.quantity > 1
      ? deck.cards.map(c => c.id === cardId ? { ...c, quantity: c.quantity - 1 } : c)
      : deck.cards.filter(c => c.id !== cardId);
    
    const updatedDeck = { ...deck, cards: newCards };
    setDeck(updatedDeck);
    onDeckUpdate?.(updatedDeck);
  };

  const getTotalCards = () => {
    return deck.cards.reduce((total, card) => total + (card.quantity || 1), 0);
  };

  const getCostDistribution = () => {
    const distribution = {};
    deck.cards.forEach(card => {
      const cost = card.cost;
      distribution[cost] = (distribution[cost] || 0) + (card.quantity || 1);
>>>>>>> af774a41 (Initial commit)
    });
    return distribution;
  };

<<<<<<< HEAD
  const simulateHand = () => {
    const allCards = [];
    deck.cards.forEach(card => {
      for (let i = 0; i < card.quantity; i++) {
        allCards.push(card);
      }
    });

    // Shuffle deck
    const shuffled = [...allCards].sort(() => Math.random() - 0.5);
    const hand = shuffled.slice(0, 7);
    const library = shuffled.slice(7);

    setDeckTest({ hand, library });
  };

  const exportDeck = () => {
    const deckText = `${deck.name}\n\n${deck.cards
      .map(card => `${card.quantity}x ${card.name}`)
      .join('\n')}\n\nTotal: ${getTotalCards()} cards`;

    navigator.clipboard.writeText(deckText);
    alert('Deck copied to clipboard!');
  };

  const importDeck = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.txt';
    input.onchange = e => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = e => {
          try {
            const content = e.target.result;
            let importedDeck;

            if (file.name.endsWith('.json')) {
              importedDeck = JSON.parse(content);
              if (importedDeck.cards) {
                onDeckChange({
                  ...deck,
                  name: importedDeck.name || deck.name,
                  description: importedDeck.description || deck.description,
                  cards: importedDeck.cards,
                });
                alert('Deck imported successfully!');
              }
            } else {
              // Parse text format
              const lines = content.split('\n').filter(line => line.trim());
              const importedCards = [];

              for (const line of lines) {
                const match = line.match(/^(\d+)x?\s+(.+)$/);
                if (match) {
                  const quantity = parseInt(match[1]);
                  const cardName = match[2].trim();
                  const foundCard = cards.find(
                    c => c.name.toLowerCase() === cardName.toLowerCase(),
                  );
                  if (foundCard) {
                    importedCards.push({ ...foundCard, quantity });
                  }
                }
              }

              if (importedCards.length > 0) {
                onDeckChange({
                  ...deck,
                  cards: importedCards,
                });
                alert(`Imported ${importedCards.length} cards successfully!`);
              } else {
                alert('No valid cards found in the import file.');
              }
            }
          } catch (error) {
            alert('Error importing deck: ' + error.message);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const DeckStats = () => {
    const manaCurve = getManaCurve();
    const typeDistribution = getCardTypeDistribution();
    const totalCards = getTotalCards();
    const avgManaCost =
      deck.cards.reduce((sum, card) => sum + card.cost * card.quantity, 0) /
        totalCards || 0;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-lg p-4 space-y-4"
      >
        <h3 className="text-lg font-bold text-white">Deck Statistics</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">
              Mana Curve
            </h4>
            <div className="space-y-1">
              {Object.entries(manaCurve).map(([cost, count]) => (
                <div key={cost} className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400 w-4">{cost}</span>
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${(count / Math.max(...Object.values(manaCurve))) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-4">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">
              Card Types
            </h4>
            <div className="space-y-1">
              {Object.entries(typeDistribution).map(([type, count]) => (
                <div key={type} className="flex justify-between text-xs">
                  <span className="text-gray-400">{type}</span>
                  <span className="text-white">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-white">{totalCards}</div>
            <div className="text-xs text-gray-400">Total Cards</div>
          </div>
          <div>
            <div className="text-lg font-bold text-white">
              {avgManaCost.toFixed(1)}
            </div>
            <div className="text-xs text-gray-400">Avg. Cost</div>
          </div>
          <div>
            <div className="text-lg font-bold text-white">
              {deck.cards.length}
            </div>
            <div className="text-xs text-gray-400">Unique Cards</div>
          </div>
        </div>
      </motion.div>
    );
  };

  const HandSimulator = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Hand Simulator</h3>
        <button
          onClick={simulateHand}
          className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          <Shuffle size={16} />
          <span>Draw Hand</span>
        </button>
      </div>

      {deckTest.hand.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">
            Opening Hand (7 cards)
          </h4>
          <div className="grid grid-cols-7 gap-2">
            {deckTest.hand.map((card, index) => (
              <div
                key={index}
                className="bg-gray-700 rounded p-2 text-center cursor-pointer hover:bg-gray-600 transition-colors"
                onClick={() => setSelectedCard(card)}
              >
                <div className="text-xs font-medium text-white truncate">
                  {card.name}
                </div>
                <div className="text-xs text-gray-400">{card.cost}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Export/Import Modals */}
      <DeckExportModal 
        isOpen={showExportModal} 
        onClose={() => setShowExportModal(false)} 
        deck={deck} 
      />
      
      <DeckImportModal 
        isOpen={showImportModal} 
        onClose={() => setShowImportModal(false)} 
        onImportSuccess={(deckId) => {
          // Reload deck after import
          const importedDeck = DeckService.loadDeck(deckId);
          if (importedDeck && onDeckChange) {
            onDeckChange(importedDeck);
          }
        }} 
      />
      
      {/* Deck Header */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={deck.name}
              onChange={e => onDeckChange({ ...deck, name: e.target.value })}
              className="text-xl font-bold bg-transparent text-white border-none outline-none"
              placeholder="Deck Name"
            />
            <span className="text-gray-400">{getTotalCards()}/40 cards</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowStats(!showStats)}
              className="flex items-center space-x-2 px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
            >
              <BarChart3 size={16} />
              <span>Stats</span>
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center space-x-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              <Upload size={16} />
              <span>Import</span>
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center space-x-2 px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
            >
              <Download size={16} />
              <span>Export</span>
            </button>
            <button
              onClick={() => {
                // Set as active player deck
                const deckToSave = { ...deck, lastUpdated: Date.now() };
                localStorage.setItem(DeckService.STORAGE_KEYS.PLAYER_DECK, JSON.stringify(deckToSave));
                alert('Deck set as active for gameplay!');
              }}
              className="flex items-center space-x-2 px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
              title="Use this deck in the game"
            >
              <Gamepad2 size={16} />
              <span>Use in Game</span>
            </button>
            <button className="btn btn-sm btn-primary">
              <Share2 size={16} />
              <span>Share</span>
            </button>
          </div>
        </div>

        <textarea
          value={deck.description}
          onChange={e => onDeckChange({ ...deck, description: e.target.value })}
          placeholder="Describe your deck strategy..."
          className="w-full bg-gray-700 text-white rounded p-3 resize-none"
          rows={3}
        />
      </div>

      {/* Stats and Simulator */}
      <AnimatePresence>
        {showStats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DeckStats />
            <HandSimulator />
          </div>
        )}
      </AnimatePresence>

      {/* Deck List */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Deck List</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('gallery')}
              className={`px-3 py-1 rounded ${viewMode === 'gallery' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Gallery
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              List
            </button>
            <button
              onClick={() => {
                // Set as active player deck
                const deckToSave = { ...deck, lastUpdated: Date.now() };
                localStorage.setItem(DeckService.STORAGE_KEYS.PLAYER_DECK, JSON.stringify(deckToSave));
                alert('Deck set as active for gameplay!');
              }}
              className="px-3 py-1 rounded bg-green-600 text-white flex items-center"
              title="Use this deck in the game"
            >
              <Gamepad2 size={14} className="mr-1" />
              Use in Game
            </button>
          </div>
        </div>

        {deck.cards.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No cards in deck</p>
            <p className="text-sm">Add cards from the database</p>
          </div>
        ) : (
          <div
            className={
              viewMode === 'gallery'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                : 'space-y-2'
            }
          >
            {deck.cards.map(card => (
              <motion.div
                key={card.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={
                  viewMode === 'gallery'
                    ? 'bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors'
                    : 'flex items-center justify-between bg-gray-700 rounded p-2 hover:bg-gray-600 transition-colors'
                }
              >
                <div
                  className={
                    viewMode === 'gallery'
                      ? 'space-y-2'
                      : 'flex items-center space-x-3'
                  }
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-white">{card.name}</h4>
                    <span className="text-sm text-gray-400">
                      ×{card.quantity}
                    </span>
                  </div>

                  {viewMode === 'gallery' && (
                    <>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <span>Cost: {card.cost}</span>
                        <span>•</span>
                        <span>Power: {card.power}</span>
                      </div>
                      <p className="text-sm text-gray-300">{card.text}</p>
                    </>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => removeCardFromDeck(card.id)}
                    className="p-1 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <button
                    onClick={() => addCardToDeck(card)}
                    className="p-1 text-green-400 hover:text-green-300 transition-colors"
                    disabled={card.quantity >= 4}
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
              </motion.div>
            ))}
=======
  const getRarityColor = (rarity) => {
    const colors = {
      common: 'text-gray-600',
      uncommon: 'text-green-600',
      rare: 'text-blue-600',
      mythic: 'text-purple-600',
      legendary: 'text-yellow-600'
    };
    return colors[rarity] || 'text-gray-600';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-screen">
      {/* Card Browser */}
      <div className="lg:col-span-2 bg-card rounded-lg p-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-4">Card Browser</h2>
          
          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary" />
              <input
                type="text"
                placeholder="Search cards..."
                value={cardSearch}
                onChange={(e) => setCardSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-color rounded-lg bg-background"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <select
                value={selectedFilters.element}
                onChange={(e) => setSelectedFilters({...selectedFilters, element: e.target.value})}
                className="px-3 py-1 border border-color rounded bg-background text-sm"
              >
                <option value="all">All Elements</option>
                <option value="Inferno">Inferno</option>
                <option value="Steadfast">Steadfast</option>
                <option value="Submerged">Submerged</option>
                <option value="Aether">Aether</option>
                <option value="Void">Void</option>
              </select>
              
              <select
                value={selectedFilters.type}
                onChange={(e) => setSelectedFilters({...selectedFilters, type: e.target.value})}
                className="px-3 py-1 border border-color rounded bg-background text-sm"
              >
                <option value="all">All Types</option>
                <option value="Creature">Creature</option>
                <option value="Spell">Spell</option>
                <option value="Artifact">Artifact</option>
                <option value="Enhancement">Enhancement</option>
              </select>
              
              <select
                value={selectedFilters.cost}
                onChange={(e) => setSelectedFilters({...selectedFilters, cost: e.target.value})}
                className="px-3 py-1 border border-color rounded bg-background text-sm"
              >
                <option value="all">All Costs</option>
                <option value="0-1">0-1</option>
                <option value="2-3">2-3</option>
                <option value="4-5">4-5</option>
                <option value="6">6+</option>
              </select>
              
              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="p-2 border border-color rounded hover:bg-tertiary"
                  title={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
                >
                  {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Cards Grid/List */}
        <div className="flex-1 overflow-y-auto">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredCards.map(card => (
                <div key={card.id} className="border border-color rounded-lg p-4 hover:bg-tertiary cursor-pointer transition-colors"
                     onClick={() => addCardToDeck(card)}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{card.name}</h3>
                    <div className="flex items-center gap-1">
                      <span className="font-bold">{card.cost}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-secondary mb-2">
                    <span>{card.type}</span>
                    <span className={getRarityColor(card.rarity)}>{card.rarity}</span>
                  </div>
                  <p className="text-sm text-secondary">{card.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredCards.map(card => (
                <div key={card.id} className="flex items-center justify-between p-3 border border-color rounded-lg hover:bg-tertiary cursor-pointer transition-colors"
                     onClick={() => addCardToDeck(card)}>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{card.name}</span>
                      <span className="text-sm text-secondary">{card.type}</span>
                      <span className={`text-sm ${getRarityColor(card.rarity)}`}>{card.rarity}</span>
                    </div>
                    <p className="text-sm text-secondary mt-1">{card.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-lg">{card.cost}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Deck Builder */}
      <div className="bg-card rounded-lg p-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Deck Builder</h2>
          <input
            type="text"
            placeholder="Deck name..."
            value={deck.name}
            onChange={(e) => {
              const updatedDeck = {...deck, name: e.target.value};
              setDeck(updatedDeck);
              onDeckUpdate?.(updatedDeck);
            }}
            className="w-full p-2 border border-color rounded bg-background mb-2"
          />
          <div className="text-sm text-secondary">
            {getTotalCards()} cards total
          </div>
        </div>
        
        {/* Deck List */}
        <div className="space-y-2 mb-4">
          {deck.cards.length === 0 ? (
            <div className="text-center text-secondary py-8">
              <p>Your deck is empty.</p>
              <p className="text-sm">Click cards from the browser to add them.</p>
            </div>
          ) : (
            deck.cards.map(card => (
              <div key={card.id} className="flex items-center justify-between p-2 border border-color rounded">
                <div className="flex-1">
                  <div className="font-semibold">{card.name}</div>
                  <div className="text-sm text-secondary">{card.type} • Cost {card.cost}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => removeCardFromDeck(card.id)}
                    className="p-1 hover:bg-tertiary rounded"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center">{card.quantity || 1}</span>
                  <button
                    onClick={() => addCardToDeck(card)}
                    className="p-1 hover:bg-tertiary rounded"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Deck Stats */}
        {deck.cards.length > 0 && (
          <div className="border-t border-color pt-4">
            <h3 className="font-semibold mb-2">Deck Statistics</h3>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="text-secondary">Cost Distribution:</span>
                <div className="flex gap-1 mt-1">
                  {Object.entries(getCostDistribution()).map(([cost, count]) => (
                    <div key={cost} className="bg-tertiary rounded px-2 py-1 text-xs">
                      {cost}: {count}
                    </div>
                  ))}
                </div>
              </div>
            </div>
>>>>>>> af774a41 (Initial commit)
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualDeckBuilder;
