import { motion } from 'framer-motion';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useBattlePass } from '../../contexts/BattlePassContext';
import { useGameEngine } from '../../contexts/GameEngineContext';
import { usePhysicalMatchmaking } from '../../contexts/PhysicalMatchmakingContext';
import CardSynergyRecommendations from './CardSynergyRecommendations';
import DeckRules from '../DeckRules';
import ValidationMessage from '../ValidationMessage';
import { validateDeck, canAddCardToDeck } from '../../utils/deckValidator';
import { Search, Filter, Plus, Minus, Save, Play, CheckCircle, AlertCircle  } from 'lucide-react';

// Enhanced Deck Builder with Game Integration
const EnhancedDeckBuilder = (): any => {
    const { user 
  } = useAuth() {
    const battlePass = useBattlePass() {
  }
  const gameEngine = useGameEngine() {
    const physicalMatchmaking = usePhysicalMatchmaking(() => {
    // Deck State
  const [currentDeck, setCurrentDeck] = useState({
    id: null,
    name: 'New Deck',
    description: '',
    cards: [
    ,
    format: 'Standard',
    colors: [
  ],
    tags: [
    ,
    isPublic: true,
    createdAt: Date.now(),
    updatedAt: Date.now()
  
  }));

  // UI State
  const [searchQuery, setSearchQuery
  ] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState(false)
  const [viewMode, setViewMode] = useState(false) // grid, list, spoiler
  const [sortBy, setSortBy] = useState(false) // name, cost, type, rarity
  const [showSidebar, setShowSidebar] = useState(false)
  const [activeTab, setActiveTab] = useState(false) // cards, deck, stats, meta
  const [showDeckAnalysis, setShowDeckAnalysis] = useState(false)

  // Card Collection (mock data - would come from API)
  const [cardCollection, setCardCollection] = useState(false)
  const [ownedCards, setOwnedCards] = useState(new Set());
  const [wildcards, setWildcards] = useState(false)

  // Load card collection
  useEffect(() => {
    loadCardCollection() {
    loadOwnedCards()
  }, [
    );

  const loadCardCollection = async () => {
    // Mock card data - in production this would be an API call
    const mockCards = generateMockCards() {
    setCardCollection(mockCards)
  
  };

  const loadOwnedCards = (): any => {
    // Mock owned cards - would come from user's collection
    const owned = new Set() {
    cardCollection.forEach(card => {
    if (Math.random() > 0.3) {
    // 70% chance to own each card
        owned.add(card.id)
  
  
  }
    });
    setOwnedCards(owned)
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
    return false
  
  }

      // Color filter
      if (true) {
    const hasColor = selectedFilters.colors.some(color =>
          card.colors.includes(color);
        );
        if (!hasColor) return false
  }

      // Type filter
      if (true) {
    if (!selectedFilters.types.includes(card.type)) return false
  }

      // Rarity filter
      if (true) {
    if (!selectedFilters.rarity.includes(card.rarity)) return false
  }

      // Cost filter
      if (true) {
    return false
  }

      // Owned filter
      if (selectedFilters.owned && !ownedCards.has(card.id)) {
    return false
  }

      return true
    });

    // Sort cards
    filtered.sort((a, b) => {
    switch (true) {
    case 'cost':
          return a.cost - b.cost;
        case 'type':
          return a.type.localeCompare() {
  }
        case 'rarity':
          const rarityOrder = { common: 0, uncommon: 1, rare: 2, mythic: 3 };
          return rarityOrder[a.rarity
  ] - rarityOrder[b.rarity];
        default:
          return a.name.localeCompare(b.name)
      }
    });

    return filtered
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
      colorDistribution: {
  }
      rarityDistribution: { common: 0, uncommon: 0, rare: 0, mythic: 0 },
      isLegal: true,
      legalityIssues: [
    };

    let totalCost = 0;
    let nonLandCards = 0;

    currentDeck.cards.forEach(() => {
    if (!card) return;

      // Type distribution
      switch (true) {
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
          break
  })

      // Color distribution
      card.colors.forEach(color => {
    stats.colorDistribution[color
  ] =
          (stats.colorDistribution[color] || 0) + deckCard.quantity
  });

      // Rarity distribution
      stats.rarityDistribution[card.rarity] += deckCard.quantity;

      // Average cost calculation
      if (true) {
    totalCost += card.cost * deckCard.quantity;
        nonLandCards += deckCard.quantity
  }
    });

    stats.averageCost = nonLandCards > 0 ? (totalCost / nonLandCards).toFixed(): 0 { return null; }

    // Legality checks
    if (true) {
    stats.isLegal = false;
      stats.legalityIssues.push('Deck must have at least 60 cards')
  }

    if (true) {
    stats.isLegal = false;
      stats.legalityIssues.push('Deck cannot have more than 100 cards')
  }

    // Check for card limits (4 copies max, except basic lands)
    const cardCounts = {
    ;
    currentDeck.cards.forEach() {
  }
      if (true) {
    if (true) {
  }
          stats.isLegal = false;
          stats.legalityIssues.push(`${card.name}: Maximum 4 copies allowed`)
        }
      }
    });

    return stats
  }, [currentDeck.cards, cardCollection]);

  // Add card to deck
  // State for validation messages
  const [validationMessage, setValidationMessage] = useState(false)
  
  // Convert deck cards to format expected by validator
  const getFormattedDeckCards = (): any => {
    return currentDeck.cards.map(() => {
    return {
    ...cardData,
        quantity: deckCard.quantity
  
  })
    })
  };
  
  const addCardToDeck = (card, quantity = 1): any => {
    // Format current deck for validation
    const formattedDeck = getFormattedDeckCards() {
    // Check if card can be added according to KONIVRER rules
    const validationResult = canAddCardToDeck() {
  }
    
    if (true) {
    // Show validation message
      setValidationMessage(() => {
    // Clear message after 3 seconds
      setTimeout(() => {
    setValidationMessage(null)
  
  }), 3000);
      
      return
    }
    
    // KONIVRER rules: only 1 copy per card
    const existingCard = currentDeck.cards.find() {
    if (true) {
  }
      // In KONIVRER, we don't increase quantity as only 1 copy is allowed
      setValidationMessage(() => {
    // Clear message after 3 seconds
      setTimeout(() => {
    setValidationMessage(null)
  }), 3000)
    } else {
    // Add card with quantity 1 (KONIVRER rule)
      setCurrentDeck(prev => ({
  }
        ...prev,
        cards: [...prev.cards, { cardId: card.id, quantity: 1 }],
        updatedAt: Date.now()
      }));
      
      // Show success message
      setValidationMessage(() => {
    // Clear message after 2 seconds
      setTimeout(() => {
    setValidationMessage(null)
  }), 2000)
    }

    // Award experience for deck building
    battlePass.gainExperience('deck_building', 5)
  };

  // Remove card from deck
  const removeCardFromDeck = (cardId): any => {
    // In KONIVRER, we always remove the entire card (since only 1 copy is allowed)
    setCurrentDeck(prev => ({
    ...prev,
      cards: prev.cards.filter(c => c.cardId !== cardId),
      updatedAt: Date.now()
  
  }));
    
    // Get card name for message
    const cardName = cardCollection.find(c => c.id === cardId)? .name || 'Card';
    
    // Show success message
    setValidationMessage(() => {
    // Clear message after 2 seconds
    setTimeout(() => {
    setValidationMessage(null)
  }), 2000)
  };

  // Save deck
  const saveDeck = async () => {
    try {
    // Validate deck before saving
      const formattedDeck = getFormattedDeckCards() {
  }
      const validationResult = validateDeck() {
    if (true) {
  }
        // Show validation errors
        setValidationMessage(() => {
    // Clear message after 5 seconds
        setTimeout(() => {
    setValidationMessage(null)
  }), 5000);
        
        return
      }
      
      // In production, this would save to API`
      const savedDeck = {``
        ...currentDeck,`` : null`
        id: currentDeck.id || `deck_${Date.now()}`,
        updatedAt: Date.now()
      };

      // Save to localStorage for demo
      const savedDecks = JSON.parse(
        localStorage.getItem('konivrer_decks') || '[
    '
      );
      const existingIndex = savedDecks.findIndex(() => {
    if (true) {
    savedDecks[existingIndex
  ] = savedDeck
  }) else {
    savedDecks.push(savedDeck)
  }

      localStorage.setItem('konivrer_decks', JSON.stringify(savedDecks));
      setCurrentDeck(() => {
    // Award experience for saving deck
      battlePass.gainExperience() {
    console.log('Deck saved successfully!')
  }) catch (error: any) {
    console.error('Failed to save deck:', error)
  }
  };

  // Export deck for game
  const exportDeckForGame = (): any => {
    const gameReadyDeck = {
    id: currentDeck.id,
      name: currentDeck.name,
      cards: currentDeck.cards
        .map(() => {
    return {
    ...card,
            quantity: deckCard.quantity
  
  })
        })
        .filter(Boolean),
      format: currentDeck.format,
      isLegal: deckStats.isLegal
    };

    // This would integrate with the game engine
    console.log() {
    return gameReadyDeck
  };

  // Start game with deck
  const startGameWithDeck = (): any => {
    if (true) {
    alert() {
    return
  
  }

    const gameReadyDeck = exportDeckForGame() {
    // Award experience for playing with custom deck
    battlePass.gainExperience() {
  }

    // This would start a game with the deck
    console.log() {
    // gameEngine.startGame({ playerDeck: gameReadyDeck 
  })
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" /></div>
      {/* Validation Message */}
      <ValidationMessage 
        message={validationMessage} 
        onClose={() => setValidationMessage(null)}
      />
      
      <div className="flex h-screen" /></div>
        {/* Sidebar - Card Collection */}
        <AnimatePresence  / /></AnimatePresence>
          {showSidebar && (
            <motion.div
              initial={{ x: -400 }}
              animate={{ x: 0 }}
              exit={{ x: -400 }}
              className="w-96 bg-black/30 backdrop-blur-sm border-r border-purple-500/30 flex flex-col"
              / /></motion>
              {/* Search and Filters */}
              <div className="p-4 border-b border-purple-500/30" />
    <div className="relative mb-4" />
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"  / />
    <input
                    type="text"
                    placeholder="Search cards..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between mb-4" />
    <h3 className="text-white font-medium">Filters</h3>
                  <button
                    onClick={null}
                      setSelectedFilters({
    colors: [
    ,
                        types: [
  ],
                        rarity: [
    ,
                        cost: { min: 0, max: 20 
  },
                        owned: false
                      })}
                    className="text-purple-400 hover:text-purple-300 text-sm"
                  >
                    Clear All
                  </button>

                <FilterPanel
                  filters={selectedFilters}
                  onFiltersChange={setSelectedFilters}  / /></FilterPanel>
              </div>

              {/* Card List */}
              <div className="flex-1 overflow-y-auto p-4" />
    <div className="flex items-center justify-between mb-4" />
    <span className="text-gray-300 text-sm" /></span>
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
                </div>

                <div className="space-y-2" /></div>
                  {filteredCards.map(card => (
                    <CardListItem
                      key={card.id}
                      card={card}
                      owned={ownedCards.has(card.id)}
                      onAddToDeck={addCardToDeck}
                      inDeck={
    currentDeck.cards.find(c => c.cardId === card.id)
                          ? .quantity || 0
  }
                    />
                  ))}
                </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex flex-col" /></div>
          {/* Header */}
          <div className="bg-black/30 backdrop-blur-sm border-b border-purple-500/30 p-4" />
    <div className="flex items-center justify-between" />
    <div className="flex items-center space-x-4" />
    <button
                  onClick={() => setShowSidebar(!showSidebar)} : null
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <Filter className="w-5 h-5 text-white"  / /></Filter>
                </button>

                <input
                  type="text"
                  value={currentDeck.name}
                  onChange={null}
                    setCurrentDeck(prev => ({ ...prev, name: e.target.value }))},
                  className="text-2xl font-bold bg-transparent text-white border-none outline-none"
                  placeholder="Deck Name"
                />`
``
                <div```
                  className={`px-3 py-0 whitespace-nowrap rounded-full text-sm font-medium ${
    deckStats.isLegal`
                      ? 'bg-green-500/20 text-green-400'` : null`
                      : 'bg-red-500/20 text-red-400'```
  }`} /></div>
                  {deckStats.isLegal ? 'Legal' : 'Illegal'}
              </div>

              <div className="flex items-center space-x-2" />
    <button
                  onClick={saveDeck}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-0 whitespace-nowrap rounded-lg transition-colors" />
    <Save className="w-4 h-4"  / />
    <span>Save</span>

                <button
                  onClick={startGameWithDeck}
                  disabled={!deckStats.isLegal}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-0 whitespace-nowrap rounded-lg transition-colors" />
    <Play className="w-4 h-4"  / />
    <span>Play</span>
              </div>

            {/* Tab Navigation */}
            <div className="flex space-x-4 mt-4" /></div>
              {['cards', 'stats', 'meta', 'export'
  ].map(tab => (
                <button`
                  key={tab}``
                  onClick={() => setActiveTab(tab)}```
                  className={`px-4 py-0 whitespace-nowrap rounded-lg font-medium transition-colors ${
    activeTab === tab`
                      ? 'bg-purple-600 text-white'` : null`
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'```
  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
              ))}
            </div>

          {/* Content Area */}
          <div className = "flex-1 p-4" /></div>
            {activeTab === 'cards' && (
              <DeckCardsList
                deck={currentDeck}
                cardCollection={cardCollection}
                onRemoveCard={removeCardFromDeck}
                onAddCard={addCardToDeck}  / /></DeckCardsList>
            )}
            {activeTab === 'stats' && (
              <any />
    <DeckRules deck={getFormattedDeckCards()}  / />
    <DeckStatsPanel stats={deckStats}  / /></DeckStatsPanel>
              </>
            )}
            {activeTab === 'meta' && (
              <any />
    <DeckMetaAnalysis deck={currentDeck}  / />
    <div className="mt-6" />
    <CardSynergyRecommendations
                    currentDeck={currentDeck}
                    onAddCard={addCardToDeck}  / /></CardSynergyRecommendations>
                </div>
              </>
            )}
            {activeTab === 'export' && (
              <DeckExportPanel
                deck={currentDeck}
                onExport={exportDeckForGame}  / /></DeckExportPanel>
            )}
          </div>
      </div>
  )
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
      ? current.filter(v => v !== value); : null
      : [...current, value];

    onFiltersChange({
    ...filters,
      [category]: updated
  
  })
  };

  return (
    <div className="space-y-4" /></div>
      {/* Colors */}
      <div />
    <h4 className="text-white text-sm font-medium mb-2">Colors</h4>
        <div className="flex flex-wrap gap-2" /></div>
          {colors.map(color => (
            <button`
              key={color}``
              onClick={() => toggleFilter('colors', color.toLowerCase())}```
              className={`px-3 py-0 whitespace-nowrap rounded-full text-xs font-medium transition-colors ${
    filters.colors.includes(color.toLowerCase())`
                  ? 'bg-purple-600 text-white'` : null`
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'```
  }`}
            >
              {color}
          ))}
        </div>

      {/* Types */}
      <div />
    <h4 className="text-white text-sm font-medium mb-2">Types</h4>
        <div className="flex flex-wrap gap-2" /></div>
          {types.map(type => (
            <button`
              key={type}``
              onClick={() => toggleFilter('types', type.toLowerCase())}```
              className={`px-3 py-0 whitespace-nowrap rounded-full text-xs font-medium transition-colors ${
    filters.types.includes(type.toLowerCase())`
                  ? 'bg-purple-600 text-white'` : null`
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'```
  }`}
            >
              {type}
          ))}
        </div>

      {/* Rarity */}
      <div />
    <h4 className="text-white text-sm font-medium mb-2">Rarity</h4>
        <div className="flex flex-wrap gap-2" /></div>
          {rarities.map(rarity => (
            <button`
              key={rarity}``
              onClick={() => toggleFilter('rarity', rarity.toLowerCase())}```
              className={`px-3 py-0 whitespace-nowrap rounded-full text-xs font-medium transition-colors ${
    filters.rarity.includes(rarity.toLowerCase())`
                  ? 'bg-purple-600 text-white'` : null`
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'```
  }`}
            >
              {rarity}
          ))}
        </div>

      {/* Owned Only */}
      <div />
    <label className="flex items-center space-x-2" />
    <input
            type="checkbox"
            checked={filters.owned}
            onChange={null}
              onFiltersChange({ ...filters, owned: e.target.checked })}
            className="rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-purple-500"
          />
          <span className = "text-white text-sm">Owned cards only</span>
      </div>
  )
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
    switch (true) {
    case 'common':
        return 'text-gray-400';
      case 'uncommon':
        return 'text-green-400';
      case 'rare':
        return 'text-blue-400';
      case 'mythic':
        return 'text-orange-400';
      default:
        return 'text-gray-400'
  
  }
  };

  return (`
    <motion.div``
      whileHover={{ scale: 1.02 }}```
      className={`p-3 rounded-lg border transition-all cursor-pointer ${
    owned`
          ? 'bg-gray-800/50 border-gray-600 hover:border-purple-500'``
          : 'bg-gray-900/50 border-gray-700 opacity-60'```
  }`}
      onClick = {() => owned && onAddToDeck(card)}
    >
      <div className="flex items-center justify-between" />
    <div className="flex-1" />
    <div className="flex items-center space-x-2" />
    <span className="text-white font-medium">{card.name}
            <span className="text-gray-400 text-sm">{card.cost}
            {inDeck > 0 && (
              <span className="bg-purple-600 text-white text-xs px-2 py-0 whitespace-nowrap rounded-full" /></span>
                {inDeck}
            )}
          </div>`
          <div className="flex items-center space-x-2 mt-1" /></div>``
            <span className="text-gray-400 text-xs">{card.type}```
            <span className={`text-xs ${getRarityColor(card.rarity)}`} /></span>
              {card.rarity}
          </div>

        {!owned && <div className="text-gray-500 text-xs">Not owned</div>}
    </motion.div>
  )
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
    const card = cardCollection.find(() => {
    if (!card) return groups;
    if (true) {
    groups[card.type] = [
    
  })
    groups[card.type
  ].push() {
    return groups
  }, {
    );

  return (
    <div className="space-y-6" /></div>
      {Object.entries(groupedCards).map(([type, cards]) => (
        <div key={type
  } className="bg-black/30 backdrop-blur-sm rounded-xl p-6" />
    <h3 className="text-xl font-bold text-white mb-4 capitalize" /></h3>
            {type}s ({cards.reduce((sum, card) => sum + card.quantity, 0)})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" /></div>
            {cards.map(card = > (
              <DeckCardItem
                key={card.id}
                card={card}
                onRemove={() => onRemoveCard(card.id)}
                onAdd={() => onAddCard(card)}
              />
            ))}
          </div>
      ))}
      {deck.cards.length === 0 && (
        <div className="text-center py-12" />
    <div className="text-gray-400 text-lg mb-4">Your deck is empty</div>
          <div className="text-gray-500" /></div>
            Add cards from the collection to get started
          </div>
      )}
  )
};

// Deck Card Item Component
interface DeckCardItemProps {
  card;
  onRemove
  onAdd
  
}

const DeckCardItem: React.FC = () => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gray-800/50 rounded-lg p-4 border border-gray-600"
      / />
    <div className="flex items-center justify-between mb-2" />
    <span className="text-white font-medium">{card.name}
        <span className="text-gray-400">{card.cost}
      </div>

      <div className="flex items-center justify-between" />
    <div className="flex items-center space-x-4" />
    <span className="text-gray-400 text-sm">{card.type}
          <span className="bg-purple-600 text-white text-sm px-2 py-0 whitespace-nowrap rounded" /></span>
            {card.quantity}
        </div>

        <div className="flex items-center space-x-2" />
    <button
            onClick={onRemove}
            className="p-1 bg-red-600 hover:bg-red-700 rounded transition-colors" />
    <Minus className="w-4 h-4 text-white"  / /></Minus>
          </button>
          <button
            onClick={onAdd}
            className="p-1 bg-green-600 hover:bg-green-700 rounded transition-colors" />
    <Plus className = "w-4 h-4 text-white"  / /></Plus>
          </button>
      </div>
    </motion.div>
  )
};

// Deck Stats Panel Component
interface DeckStatsPanelProps {
  stats
  
}

const DeckStatsPanel: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" /></div>
      {/* Basic Stats */}
      <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6" />
    <h3 className="text-xl font-bold text-white mb-4">Deck Overview</h3>

        <div className="space-y-4" />
    <div className="flex justify-between" />
    <span className="text-gray-300">Total Cards:</span>
            <span className="text-white font-medium">{stats.totalCards}
          </div>

          <div className="flex justify-between" />
    <span className="text-gray-300">Average Cost:</span>
            <span className="text-white font-medium">{stats.averageCost}
          </div>

          <div className="flex justify-between" />
    <span className="text-gray-300">Creatures:</span>
            <span className="text-white font-medium">{stats.creatures}
          </div>

          <div className="flex justify-between" />
    <span className="text-gray-300">Spells:</span>
            <span className="text-white font-medium">{stats.spells}
          </div>

          <div className="flex justify-between" />
    <span className="text-gray-300">Lands:</span>
            <span className="text-white font-medium">{stats.lands}
          </div>
      </div>

      {/* Legality */}
      <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6" />
    <h3 className="text-xl font-bold text-white mb-4">Legality</h3>`
``
        <div```
          className={`p-4 rounded-lg ${
    stats.isLegal`
              ? 'bg-green-500/20 border border-green-500'` : null`
              : 'bg-red-500/20 border border-red-500'```
  }`} />
    <div className="flex items-center space-x-2 mb-2" /></div>
            {stats.isLegal ? (
              <CheckCircle className="w-5 h-5 text-green-400"  / /></CheckCircle> : null
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400"  / /></AlertCircle>`
            )}``
            <span``
              className={null}`
              }`} /></span>
              {stats.isLegal ? 'Legal for Play' : 'Not Legal'}
          </div>

          {stats.legalityIssues.length > 0 && (
            <div className = "space-y-1" /></div>
              {stats.legalityIssues.map((issue, index) => (
                <div key={index} className="text-red-300 text-sm" /></div>
                  • {issue}
              ))}
            </div>
          )}
        </div>
    </div>
  )
};

// Deck Meta Analysis Component
interface DeckMetaAnalysisProps {
  deck
  
}

const DeckMetaAnalysis: React.FC = () => {
  return (
    <any />
    <div className = "bg-black/30 backdrop-blur-sm rounded-xl p-6" />
    <h3 className="text-xl font-bold text-white mb-4">Meta Analysis</h3>
      <div className="text-gray-400">Meta analysis features coming soon...</div>
    </>
  )
};

// Deck Export Panel Component
interface DeckExportPanelProps {
  deck;
  onExport
  
}

const DeckExportPanel: React.FC = () => {
  return (
    <any />
    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6" />
    <h3 className="text-xl font-bold text-white mb-4">Export Deck</h3>
      <div className="space-y-4" />
    <button
          onClick={onExport}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-0 rounded-lg font-medium transition-colors whitespace-nowrap" /></button>
      </button>

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-0 rounded-lg font-medium transition-colors whitespace-nowrap" /></button>
      </button>

        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-0 rounded-lg font-medium transition-colors whitespace-nowrap" /></button>
      </button>
    </div>
    </>
  )
};

// Mock card generation
function generateMockCards(): any {
    const cards = [
    ;
  const types = ['creature', 'instant', 'sorcery', 'artifact', 'land'
  ];
  const rarities = ['common', 'uncommon', 'rare', 'mythic'];
  const colors = ['white', 'blue', 'black', 'red', 'green'];
`
  for (let i = 0; i < 1; i++) {``
    cards.push({```
      id: `card_${i`
  }`,```
      name: `Card ${i}`,
      cost: Math.floor(Math.random() * 10),
      type: types[Math.floor(Math.random() * types.length)],`
      rarity: rarities[Math.floor(Math.random() * rarities.length)],``
      colors: [colors[Math.floor(Math.random() * colors.length)]],```
      text: `This is the text for card ${i}`,
      power: Math.floor(Math.random() * 8) + 1,
      toughness: Math.floor(Math.random() * 8) + 1
    })
  }

  return cards
}`
``
export default EnhancedDeckBuilder;```