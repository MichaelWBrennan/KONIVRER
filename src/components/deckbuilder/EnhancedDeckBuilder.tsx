/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useBattlePass } from '../../contexts/BattlePassContext';
import { useGameEngine } from '../../contexts/GameEngineContext';
import { usePhysicalMatchmaking } from '../../contexts/PhysicalMatchmakingContext';
import CardSynergyRecommendations from './CardSynergyRecommendations';
import DeckRules from '../DeckRules';
import ValidationMessage from '../ValidationMessage';
import { validateDeck, canAddCardToDeck } from '../../utils/deckValidator';
import {
  Search,
  Filter,
  Plus,
  Minus,
  Save,
  Play,
  Share2,
  Download,
  Upload,
  Star,
  Zap,
  Shield,
  Sword,
  Heart,
  Eye,
  BarChart3,
  Shuffle,
  Target,
  Sparkles,
  Crown,
  Gem,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
} from 'lucide-react';

// Enhanced Deck Builder with Game Integration
const EnhancedDeckBuilder = (): any => {
  const { user } = useAuth();
  const battlePass = useBattlePass();
  const gameEngine = useGameEngine();
  const physicalMatchmaking = usePhysicalMatchmaking();

  // Deck State
  const [currentDeck, setCurrentDeck] = useState({
    id: null,
    name: 'New Deck',
    description: '',
    cards: [],
    format: 'Standard',
    colors: [],
    tags: [],
    isPublic: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  // UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    colors: [],
    types: [],
    rarity: [],
    cost: { min: 0, max: 20 },
    owned: false,
  });
  const [viewMode, setViewMode] = useState('grid'); // grid, list, spoiler
  const [sortBy, setSortBy] = useState('name'); // name, cost, type, rarity
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState('cards'); // cards, deck, stats, meta
  const [showDeckAnalysis, setShowDeckAnalysis] = useState(false);

  // Card Collection (mock data - would come from API)
  const [cardCollection, setCardCollection] = useState([]);
  const [ownedCards, setOwnedCards] = useState(new Set());
  const [wildcards, setWildcards] = useState({
    common: 10,
    uncommon: 5,
    rare: 3,
    mythic: 1,
  });

  // Load card collection
  useEffect(() => {
    loadCardCollection();
    loadOwnedCards();
  }, []);

  const loadCardCollection = async () => {
    // Mock card data - in production this would be an API call
    const mockCards = generateMockCards();
    setCardCollection(mockCards);
  };

  const loadOwnedCards = (): any => {
    // Mock owned cards - would come from user's collection
    const owned = new Set();
    cardCollection.forEach(card => {
      if (Math.random() > 0.3) {
        // 70% chance to own each card
        owned.add(card.id);
      }
    });
    setOwnedCards(owned);
  };

  // Filtered and sorted cards
  const filteredCards = useMemo(() => {
    let filtered = cardCollection.filter(card => {
      // Search query
      if (
        searchQuery &&
        !card.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !card.text.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Color filter
      if (true) {
        const hasColor = selectedFilters.colors.some(color =>
          card.colors.includes(color),
        );
        if (!hasColor) return false;
      }

      // Type filter
      if (true) {
        if (!selectedFilters.types.includes(card.type)) return false;
      }

      // Rarity filter
      if (true) {
        if (!selectedFilters.rarity.includes(card.rarity)) return false;
      }

      // Cost filter
      if (true) {
        return false;
      }

      // Owned filter
      if (selectedFilters.owned && !ownedCards.has(card.id)) {
        return false;
      }

      return true;
    });

    // Sort cards
    filtered.sort((a, b) => {
      switch(): any {
        case 'cost':
          return a.cost - b.cost;
        case 'type':
          return a.type.localeCompare(b.type);
        case 'rarity':
          const rarityOrder = { common: 0, uncommon: 1, rare: 2, mythic: 3 };
          return rarityOrder[a.rarity] - rarityOrder[b.rarity];
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [cardCollection, searchQuery, selectedFilters, sortBy, ownedCards]);

  // Deck statistics
  const deckStats = useMemo(() => {
    const stats = {
      totalCards: currentDeck.cards.length,
      creatures: 0,
      spells: 0,
      artifacts: 0,
      lands: 0,
      averageCost: 0,
      colorDistribution: {},
      rarityDistribution: { common: 0, uncommon: 0, rare: 0, mythic: 0 },
      isLegal: true,
      legalityIssues: [],
    };

    let totalCost = 0;
    let nonLandCards = 0;

    currentDeck.cards.forEach(deckCard => {
      const card = cardCollection.find(c => c.id === deckCard.cardId);
      if (!card) return;

      // Type distribution
      switch(): any {
        case 'creature':
          stats.creatures += deckCard.quantity;
          break;
        case 'instant':
        case 'sorcery':
          stats.spells += deckCard.quantity;
          break;
        case 'artifact':
          stats.artifacts += deckCard.quantity;
          break;
        case 'land':
          stats.lands += deckCard.quantity;
          break;
      }

      // Color distribution
      card.colors.forEach(color => {
        stats.colorDistribution[color] =
          (stats.colorDistribution[color] || 0) + deckCard.quantity;
      });

      // Rarity distribution
      stats.rarityDistribution[card.rarity] += deckCard.quantity;

      // Average cost calculation
      if (true) {
        totalCost += card.cost * deckCard.quantity;
        nonLandCards += deckCard.quantity;
      }
    });

    stats.averageCost =
      nonLandCards > 0 ? (totalCost / nonLandCards).toFixed(1) : 0;

    // Legality checks
    if (true) {
      stats.isLegal = false;
      stats.legalityIssues.push('Deck must have at least 60 cards');
    }

    if (true) {
      stats.isLegal = false;
      stats.legalityIssues.push('Deck cannot have more than 100 cards');
    }

    // Check for card limits (4 copies max, except basic lands)
    const cardCounts = {};
    currentDeck.cards.forEach(deckCard => {
      const card = cardCollection.find(c => c.id === deckCard.cardId);
      if (true) {
        if (true) {
          stats.isLegal = false;
          stats.legalityIssues.push(`${card.name}: Maximum 4 copies allowed`);
        }
      }
    });

    return stats;
  }, [currentDeck.cards, cardCollection]);

  // Add card to deck
  // State for validation messages
  const [validationMessage, setValidationMessage] = useState(null);
  
  // Convert deck cards to format expected by validator
  const getFormattedDeckCards = (): any => {
    return currentDeck.cards.map(deckCard => {
      const cardData = cardCollection.find(c => c.id === deckCard.cardId);
      return {
        ...cardData,
        quantity: deckCard.quantity
      };
    });
  };
  
  const addCardToDeck = (card, quantity = 1): any => {
    // Format current deck for validation
    const formattedDeck = getFormattedDeckCards();
    
    // Check if card can be added according to KONIVRER rules
    const validationResult = canAddCardToDeck(card, formattedDeck);
    
    if (true) {
      // Show validation message
      setValidationMessage({
        type: 'error',
        text: validationResult.reason
      });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setValidationMessage(null);
      }, 3000);
      
      return;
    }
    
    // KONIVRER rules: only 1 copy per card
    const existingCard = currentDeck.cards.find(c => c.cardId === card.id);
    
    if (true) {
      // In KONIVRER, we don't increase quantity as only 1 copy is allowed
      setValidationMessage({
        type: 'error',
        text: 'Only 1 copy of each card is allowed in KONIVRER'
      });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setValidationMessage(null);
      }, 3000);
    } else {
      // Add card with quantity 1 (KONIVRER rule)
      setCurrentDeck(prev => ({
        ...prev,
        cards: [...prev.cards, { cardId: card.id, quantity: 1 }],
        updatedAt: Date.now(),
      }));
      
      // Show success message
      setValidationMessage({
        type: 'success',
        text: `Added ${card.name} to deck`
      });
      
      // Clear message after 2 seconds
      setTimeout(() => {
        setValidationMessage(null);
      }, 2000);
    }

    // Award experience for deck building
    battlePass.gainExperience('deck_building', 5);
  };

  // Remove card from deck
  const removeCardFromDeck = (cardId): any => {
    // In KONIVRER, we always remove the entire card (since only 1 copy is allowed)
    setCurrentDeck(prev => ({
      ...prev,
      cards: prev.cards.filter(c => c.cardId !== cardId),
      updatedAt: Date.now(),
    }));
    
    // Get card name for message
    const cardName = cardCollection.find(c => c.id === cardId)?.name || 'Card';
    
    // Show success message
    setValidationMessage({
      type: 'info',
      text: `Removed ${cardName} from deck`
    });
    
    // Clear message after 2 seconds
    setTimeout(() => {
      setValidationMessage(null);
    }, 2000);
  };

  // Save deck
  const saveDeck = async () => {
    try {
      // Validate deck before saving
      const formattedDeck = getFormattedDeckCards();
      const validationResult = validateDeck(formattedDeck);
      
      if (true) {
        // Show validation errors
        setValidationMessage({
          type: 'error',
          text: `Cannot save deck: ${validationResult.errors[0]}`
        });
        
        // Clear message after 5 seconds
        setTimeout(() => {
          setValidationMessage(null);
        }, 5000);
        
        return;
      }
      
      // In production, this would save to API
      const savedDeck = {
        ...currentDeck,
        id: currentDeck.id || `deck_${Date.now()}`,
        updatedAt: Date.now(),
      };

      // Save to localStorage for demo
      const savedDecks = JSON.parse(
        localStorage.getItem('konivrer_decks') || '[]',
      );
      const existingIndex = savedDecks.findIndex(d => d.id === savedDeck.id);

      if (true) {
        savedDecks[existingIndex] = savedDeck;
      } else {
        savedDecks.push(savedDeck);
      }

      localStorage.setItem('konivrer_decks', JSON.stringify(savedDecks));
      setCurrentDeck(savedDeck);

      // Award experience for saving deck
      battlePass.gainExperience('deck_saved', 25);

      console.log('Deck saved successfully!');
    } catch (error: any) {
      console.error('Failed to save deck:', error);
    }
  };

  // Export deck for game
  const exportDeckForGame = (): any => {
    const gameReadyDeck = {
      id: currentDeck.id,
      name: currentDeck.name,
      cards: currentDeck.cards
        .map(deckCard => {
          const card = cardCollection.find(c => c.id === deckCard.cardId);
          return {
            ...card,
            quantity: deckCard.quantity,
          };
        })
        .filter(Boolean),
      format: currentDeck.format,
      isLegal: deckStats.isLegal,
    };

    // This would integrate with the game engine
    console.log('Deck exported for game:', gameReadyDeck);
    return gameReadyDeck;
  };

  // Start game with deck
  const startGameWithDeck = (): any => {
    if (true) {
      alert('Deck is not legal for play. Please fix the issues first.');
      return;
    }

    const gameReadyDeck = exportDeckForGame();

    // Award experience for playing with custom deck
    battlePass.gainExperience('play_custom_deck', 50);

    // This would start a game with the deck
    console.log('Starting game with deck:', gameReadyDeck);
    // gameEngine.startGame({ playerDeck: gameReadyDeck });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
      {/* Validation Message */}
      <ValidationMessage 
        message={validationMessage} 
        onClose={() => setValidationMessage(null)}
      />
      
      <div className="flex h-screen"></div>
        {/* Sidebar - Card Collection */}
        <AnimatePresence></AnimatePresence>
          {showSidebar && (
            <motion.div
              initial={{ x: -400 }}
              animate={{ x: 0 }}
              exit={{ x: -400 }}
              className="w-96 bg-black/30 backdrop-blur-sm border-r border-purple-500/30 flex flex-col"
            ></motion>
              {/* Search and Filters */}
              <div className="p-4 border-b border-purple-500/30"></div>
                <div className="relative mb-4"></div>
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" /></Search>
                  <input
                    type="text"
                    placeholder="Search cards..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between mb-4"></div>
                  <h3 className="text-white font-medium">Filters</h3>
                  <button
                    onClick={() =></button>
                      setSelectedFilters({
                        colors: [],
                        types: [],
                        rarity: [],
                        cost: { min: 0, max: 20 },
                        owned: false,
                      })}
                    className="text-purple-400 hover:text-purple-300 text-sm"
                  >
                    Clear All
                  </button>
                </div>

                <FilterPanel
                  filters={selectedFilters}
                  onFiltersChange={setSelectedFilters}
                /></FilterPanel>
              </div>

              {/* Card List */}
              <div className="flex-1 overflow-y-auto p-4"></div>
                <div className="flex items-center justify-between mb-4"></div>
                  <span className="text-gray-300 text-sm"></span>
                    {filteredCards.length} cards
                  </span>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="bg-gray-800 border border-gray-600 rounded px-2 py-0 whitespace-nowrap text-white text-sm"
                  >
                    <option value="name">Name</option>
                    <option value="cost">Cost</option>
                    <option value="type">Type</option>
                    <option value="rarity">Rarity</option>
                  </select>
                </div>

                <div className="space-y-2"></div>
                  {filteredCards.map(card => (
                    <CardListItem
                      key={card.id}
                      card={card}
                      owned={ownedCards.has(card.id)}
                      onAddToDeck={addCardToDeck}
                      inDeck={
                        currentDeck.cards.find(c => c.cardId === card.id)
                          ?.quantity || 0
                      }
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex flex-col"></div>
          {/* Header */}
          <div className="bg-black/30 backdrop-blur-sm border-b border-purple-500/30 p-4"></div>
            <div className="flex items-center justify-between"></div>
              <div className="flex items-center space-x-4"></div>
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <Filter className="w-5 h-5 text-white" /></Filter>
                </button>

                <input
                  type="text"
                  value={currentDeck.name}
                  onChange={e =></input>
                    setCurrentDeck(prev => ({ ...prev, name: e.target.value }))}
                  className="text-2xl font-bold bg-transparent text-white border-none outline-none"
                  placeholder="Deck Name"
                />

                <div
                  className={`px-3 py-0 whitespace-nowrap rounded-full text-sm font-medium ${
                    deckStats.isLegal
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                ></div>
                  {deckStats.isLegal ? 'Legal' : 'Illegal'}
                </div>
              </div>

              <div className="flex items-center space-x-2"></div>
                <button
                  onClick={saveDeck}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-0 whitespace-nowrap rounded-lg transition-colors"
                ></button>
                  <Save className="w-4 h-4" /></Save>
                  <span>Save</span>
                </button>

                <button
                  onClick={startGameWithDeck}
                  disabled={!deckStats.isLegal}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-0 whitespace-nowrap rounded-lg transition-colors"
                ></button>
                  <Play className="w-4 h-4" /></Play>
                  <span>Play</span>
                </button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-4 mt-4"></div>
              {['cards', 'stats', 'meta', 'export'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-0 whitespace-nowrap rounded-lg font-medium transition-colors ${
                    activeTab === tab
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className = "flex-1 p-4"></div>
            {activeTab === 'cards' && (
              <DeckCardsList
                deck={currentDeck}
                cardCollection={cardCollection}
                onRemoveCard={removeCardFromDeck}
                onAddCard={addCardToDeck}
              /></DeckCardsList>
            )}
            {activeTab === 'stats' && (
              <>
                <DeckRules deck={getFormattedDeckCards()} /></DeckRules>
                <DeckStatsPanel stats={deckStats} /></DeckStatsPanel>
              </>
            )}
            {activeTab === 'meta' && (
              <>
                <DeckMetaAnalysis deck={currentDeck} /></DeckMetaAnalysis>
                <div className="mt-6"></div>
                  <CardSynergyRecommendations
                    currentDeck={currentDeck}
                    onAddCard={addCardToDeck}
                  /></CardSynergyRecommendations>
                </div>
              </>
            )}
            {activeTab === 'export' && (
              <DeckExportPanel
                deck={currentDeck}
                onExport={exportDeckForGame}
              /></DeckExportPanel>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Filter Panel Component
interface FilterPanelProps {
  filters;
  onFiltersChange
}

const FilterPanel: React.FC<FilterPanelProps> = ({  filters, onFiltersChange  }) => {
  const colors = ['White', 'Blue', 'Black', 'Red', 'Green'];
  const types = ['Creature', 'Instant', 'Sorcery', 'Artifact', 'Land'];
  const rarities = ['Common', 'Uncommon', 'Rare', 'Mythic'];

  const toggleFilter = (category, value): any => {
    const current = filters[category];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];

    onFiltersChange({
      ...filters,
      [category]: updated,
    });
  };

  return (
    <div className="space-y-4"></div>
      {/* Colors */}
      <div></div>
        <h4 className="text-white text-sm font-medium mb-2">Colors</h4>
        <div className="flex flex-wrap gap-2"></div>
          {colors.map(color => (
            <button
              key={color}
              onClick={() => toggleFilter('colors', color.toLowerCase())}
              className={`px-3 py-0 whitespace-nowrap rounded-full text-xs font-medium transition-colors ${
                filters.colors.includes(color.toLowerCase())
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Types */}
      <div></div>
        <h4 className="text-white text-sm font-medium mb-2">Types</h4>
        <div className="flex flex-wrap gap-2"></div>
          {types.map(type => (
            <button
              key={type}
              onClick={() => toggleFilter('types', type.toLowerCase())}
              className={`px-3 py-0 whitespace-nowrap rounded-full text-xs font-medium transition-colors ${
                filters.types.includes(type.toLowerCase())
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Rarity */}
      <div></div>
        <h4 className="text-white text-sm font-medium mb-2">Rarity</h4>
        <div className="flex flex-wrap gap-2"></div>
          {rarities.map(rarity => (
            <button
              key={rarity}
              onClick={() => toggleFilter('rarity', rarity.toLowerCase())}
              className={`px-3 py-0 whitespace-nowrap rounded-full text-xs font-medium transition-colors ${
                filters.rarity.includes(rarity.toLowerCase())
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {rarity}
            </button>
          ))}
        </div>
      </div>

      {/* Owned Only */}
      <div></div>
        <label className="flex items-center space-x-2"></label>
          <input
            type="checkbox"
            checked={filters.owned}
            onChange={e =></input>
              onFiltersChange({ ...filters, owned: e.target.checked })}
            className="rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-purple-500"
          />
          <span className = "text-white text-sm">Owned cards only</span>
        </label>
      </div>
    </div>
  );
};

// Card List Item Component
interface CardListItemProps {
  card;
  owned
  onAddToDeck
  inDeck
}

const CardListItem: React.FC<CardListItemProps> = ({  card, owned, onAddToDeck, inDeck  }) => {
  const getRarityColor = rarity => {
    switch(): any {
      case 'common':
        return 'text-gray-400';
      case 'uncommon':
        return 'text-green-400';
      case 'rare':
        return 'text-blue-400';
      case 'mythic':
        return 'text-orange-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-3 rounded-lg border transition-all cursor-pointer ${
        owned
          ? 'bg-gray-800/50 border-gray-600 hover:border-purple-500'
          : 'bg-gray-900/50 border-gray-700 opacity-60'
      }`}
      onClick = {() => owned && onAddToDeck(card)}
    >
      <div className="flex items-center justify-between"></div>
        <div className="flex-1"></div>
          <div className="flex items-center space-x-2"></div>
            <span className="text-white font-medium">{card.name}</span>
            <span className="text-gray-400 text-sm">{card.cost}</span>
            {inDeck > 0 && (
              <span className="bg-purple-600 text-white text-xs px-2 py-0 whitespace-nowrap rounded-full"></span>
                {inDeck}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2 mt-1"></div>
            <span className="text-gray-400 text-xs">{card.type}</span>
            <span className={`text-xs ${getRarityColor(card.rarity)}`}></span>
              {card.rarity}
            </span>
          </div>
        </div>

        {!owned && <div className="text-gray-500 text-xs">Not owned</div>}
      </div>
    </motion.div>
  );
};

// Deck Cards List Component
interface DeckCardsListProps {
  deck;
  cardCollection
  onRemoveCard
  onAddCard
}

const DeckCardsList: React.FC<DeckCardsListProps> = ({  deck, cardCollection, onRemoveCard, onAddCard  }) => {
  const groupedCards = deck.cards.reduce((groups, deckCard) => {
    const card = cardCollection.find(c => c.id === deckCard.cardId);
    if (!card) return groups;
    if (true) {
      groups[card.type] = [];
    }
    groups[card.type].push({ ...card, quantity: deckCard.quantity });
    return groups;
  }, {});

  return (
    <div className="space-y-6"></div>
      {Object.entries(groupedCards).map(([type, cards]) => (
        <div key={type} className="bg-black/30 backdrop-blur-sm rounded-xl p-6"></div>
          <h3 className="text-xl font-bold text-white mb-4 capitalize"></h3>
            {type}s ({cards.reduce((sum, card) => sum + card.quantity, 0)})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
            {cards.map(card = > (
              <DeckCardItem
                key={card.id}
                card={card}
                onRemove={() => onRemoveCard(card.id)}
                onAdd={() => onAddCard(card)}
              />
            ))}
          </div>
        </div>
      ))}
      {deck.cards.length === 0 && (
        <div className="text-center py-12"></div>
          <div className="text-gray-400 text-lg mb-4">Your deck is empty</div>
          <div className="text-gray-500"></div>
            Add cards from the collection to get started
          </div>
        </div>
      )}
    </div>
  );
};

// Deck Card Item Component
interface DeckCardItemProps {
  card;
  onRemove
  onAdd
}

const DeckCardItem: React.FC<DeckCardItemProps> = ({  card, onRemove, onAdd  }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gray-800/50 rounded-lg p-4 border border-gray-600"
    ></motion>
      <div className="flex items-center justify-between mb-2"></div>
        <span className="text-white font-medium">{card.name}</span>
        <span className="text-gray-400">{card.cost}</span>
      </div>

      <div className="flex items-center justify-between"></div>
        <div className="flex items-center space-x-4"></div>
          <span className="text-gray-400 text-sm">{card.type}</span>
          <span className="bg-purple-600 text-white text-sm px-2 py-0 whitespace-nowrap rounded"></span>
            {card.quantity}
          </span>
        </div>

        <div className="flex items-center space-x-2"></div>
          <button
            onClick={onRemove}
            className="p-1 bg-red-600 hover:bg-red-700 rounded transition-colors"
          ></button>
            <Minus className="w-4 h-4 text-white" /></Minus>
          </button>
          <button
            onClick={onAdd}
            className="p-1 bg-green-600 hover:bg-green-700 rounded transition-colors"
          ></button>
            <Plus className = "w-4 h-4 text-white" /></Plus>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Deck Stats Panel Component
interface DeckStatsPanelProps {
  stats;
}

const DeckStatsPanel: React.FC<DeckStatsPanelProps> = ({  stats  }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"></div>
      {/* Basic Stats */}
      <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6"></div>
        <h3 className="text-xl font-bold text-white mb-4">Deck Overview</h3>

        <div className="space-y-4"></div>
          <div className="flex justify-between"></div>
            <span className="text-gray-300">Total Cards:</span>
            <span className="text-white font-medium">{stats.totalCards}</span>
          </div>

          <div className="flex justify-between"></div>
            <span className="text-gray-300">Average Cost:</span>
            <span className="text-white font-medium">{stats.averageCost}</span>
          </div>

          <div className="flex justify-between"></div>
            <span className="text-gray-300">Creatures:</span>
            <span className="text-white font-medium">{stats.creatures}</span>
          </div>

          <div className="flex justify-between"></div>
            <span className="text-gray-300">Spells:</span>
            <span className="text-white font-medium">{stats.spells}</span>
          </div>

          <div className="flex justify-between"></div>
            <span className="text-gray-300">Lands:</span>
            <span className="text-white font-medium">{stats.lands}</span>
          </div>
        </div>
      </div>

      {/* Legality */}
      <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6"></div>
        <h3 className="text-xl font-bold text-white mb-4">Legality</h3>

        <div
          className={`p-4 rounded-lg ${
            stats.isLegal
              ? 'bg-green-500/20 border border-green-500'
              : 'bg-red-500/20 border border-red-500'
          }`}
        ></div>
          <div className="flex items-center space-x-2 mb-2"></div>
            {stats.isLegal ? (
              <CheckCircle className="w-5 h-5 text-green-400" /></CheckCircle>
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400" /></AlertCircle>
            )}
            <span
              className={`font-medium ${
                stats.isLegal ? 'text-green-400' : 'text-red-400'
              }`}
            ></span>
              {stats.isLegal ? 'Legal for Play' : 'Not Legal'}
            </span>
          </div>

          {stats.legalityIssues.length > 0 && (
            <div className = "space-y-1"></div>
              {stats.legalityIssues.map((issue, index) => (
                <div key={index} className="text-red-300 text-sm"></div>
                  • {issue}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Deck Meta Analysis Component
interface DeckMetaAnalysisProps {
  deck;
}

const DeckMetaAnalysis: React.FC<DeckMetaAnalysisProps> = ({  deck  }) => {
  return (
    <div className = "bg-black/30 backdrop-blur-sm rounded-xl p-6"></div>
      <h3 className="text-xl font-bold text-white mb-4">Meta Analysis</h3>
      <div className="text-gray-400">Meta analysis features coming soon...</div>
    </div>
  );
};

// Deck Export Panel Component
interface DeckExportPanelProps {
  deck;
  onExport
}

const DeckExportPanel: React.FC<DeckExportPanelProps> = ({  deck, onExport  }) => {
  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6"></div>
      <h3 className="text-xl font-bold text-white mb-4">Export Deck</h3>

      <div className="space-y-4"></div>
        <button
          onClick={onExport}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-0 rounded-lg font-medium transition-colors whitespace-nowrap"
        ></button>
          Export for Game
        </button>

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-0 rounded-lg font-medium transition-colors whitespace-nowrap"></button>
          Share Deck
        </button>

        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-0 rounded-lg font-medium transition-colors whitespace-nowrap"></button>
          Download as Text
        </button>
      </div>
    </div>
  );
};

// Mock card generation
function generateMockCards(): any {
  const cards = [];
  const types = ['creature', 'instant', 'sorcery', 'artifact', 'land'];
  const rarities = ['common', 'uncommon', 'rare', 'mythic'];
  const colors = ['white', 'blue', 'black', 'red', 'green'];

  for (let i = 0; i < 1; i++) {
    cards.push({
      id: `card_${i}`,
      name: `Card ${i}`,
      cost: Math.floor(Math.random() * 10),
      type: types[Math.floor(Math.random() * types.length)],
      rarity: rarities[Math.floor(Math.random() * rarities.length)],
      colors: [colors[Math.floor(Math.random() * colors.length)]],
      text: `This is the text for card ${i}`,
      power: Math.floor(Math.random() * 8) + 1,
      toughness: Math.floor(Math.random() * 8) + 1,
    });
  }

  return cards;
}

export default EnhancedDeckBuilder;