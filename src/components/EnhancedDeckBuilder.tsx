import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KONIVRER_CARDS, Card } from '../data/cards';
import { audioManager } from '../game/GameEngine';

// Enhanced deck builder interface with modern features
interface DeckBuilderCard extends Card {
  count: number;
  owned: number;
  inDeck: number;
}

interface Deck {
  id: string;
  name: string;
  cards: { cardId: string; count: number }[];
  totalCards: number;
  manaCurve: number[];
  colors: string[];
  format: 'standard' | 'extended' | 'unlimited';
  isValid: boolean;
  lastModified: Date;
}

interface FilterOptions {
  nameSearch: string;
  costMin: number;
  costMax: number;
  rarity: string[];
  type: string[];
  elements: string[];
  keywords: string[];
  sortBy: 'name' | 'cost' | 'rarity' | 'type';
  sortOrder: 'asc' | 'desc';
  showOwned: boolean;
  showCraftable: boolean;
}

const EnhancedDeckBuilder: React.FC = () => {
  const [currentDeck, setCurrentDeck] = useState<Deck>({
    id: 'new-deck',
    name: 'New Deck',
    cards: [],
    totalCards: 0,
    manaCurve: [0, 0, 0, 0, 0, 0, 0, 0],
    colors: [],
    format: 'standard',
    isValid: false,
    lastModified: new Date(),
  });

  const [filters, setFilters] = useState<FilterOptions>({
    nameSearch: '',
    costMin: 0,
    costMax: 10,
    rarity: [],
    type: [],
    elements: [],
    keywords: [],
    sortBy: 'name',
    sortOrder: 'asc',
    showOwned: true,
    showCraftable: false,
  });

  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [deckValidation, setDeckValidation] = useState<{
    errors: string[];
    warnings: string[];
  }>({ errors: [], warnings: [] });

  // Mock collection - in real app this would come from backend
  const [collection, setCollection] = useState<Map<string, number>>(
    new Map(KONIVRER_CARDS.map(card => [card.id, Math.floor(Math.random() * 4) + 1]))
  );

  // Filter and sort cards
  const filteredCards = useMemo(() => {
    let filtered = KONIVRER_CARDS.filter(card => {
      // Name search
      if (filters.nameSearch && !card.name.toLowerCase().includes(filters.nameSearch.toLowerCase())) {
        return false;
      }

      // Cost range
      if (card.cost < filters.costMin || card.cost > filters.costMax) {
        return false;
      }

      // Rarity filter
      if (filters.rarity.length > 0 && !filters.rarity.includes(card.rarity)) {
        return false;
      }

      // Type filter
      if (filters.type.length > 0 && !filters.type.includes(card.type)) {
        return false;
      }

      // Elements filter
      if (filters.elements.length > 0) {
        const hasElement = filters.elements.some(element => 
          card.elements.includes(element)
        );
        if (!hasElement) return false;
      }

      // Keywords filter
      if (filters.keywords.length > 0) {
        const hasKeyword = filters.keywords.some(keyword => 
          card.keywords.includes(keyword)
        );
        if (!hasKeyword) return false;
      }

      // Collection filters
      if (filters.showOwned && !collection.has(card.id)) {
        return false;
      }

      return true;
    });

    // Sort cards
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'cost':
          comparison = a.cost - b.cost;
          break;
        case 'rarity':
          const rarityOrder = { 'Common': 0, 'Uncommon': 1, 'Rare': 2 };
          comparison = rarityOrder[a.rarity] - rarityOrder[b.rarity];
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
      }

      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [filters, collection]);

  // Calculate mana curve
  const calculateManaCurve = (deck: Deck): number[] => {
    const curve = [0, 0, 0, 0, 0, 0, 0, 0]; // 0, 1, 2, 3, 4, 5, 6, 7+
    
    deck.cards.forEach(({ cardId, count }) => {
      const card = KONIVRER_CARDS.find(c => c.id === cardId);
      if (card) {
        const costIndex = Math.min(card.cost, 7);
        curve[costIndex] += count;
      }
    });

    return curve;
  };

  // Validate deck
  const validateDeck = (deck: Deck): { errors: string[]; warnings: string[] } => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check deck size
    if (deck.totalCards < 60) {
      errors.push(`Deck must have at least 60 cards (currently ${deck.totalCards})`);
    } else if (deck.totalCards > 250) {
      errors.push(`Deck cannot have more than 250 cards (currently ${deck.totalCards})`);
    }

    // Check for too many of the same card
    deck.cards.forEach(({ cardId, count }) => {
      if (count > 4) {
        const card = KONIVRER_CARDS.find(c => c.id === cardId);
        errors.push(`Too many copies of ${card?.name} (max 4, currently ${count})`);
      }
    });

    // Warnings for deck optimization
    if (deck.totalCards > 60) {
      warnings.push('Consider reducing deck size to 60 cards for better consistency');
    }

    const curve = calculateManaCurve(deck);
    const highCostCards = curve.slice(5).reduce((sum, count) => sum + count, 0);
    if (highCostCards > deck.totalCards * 0.2) {
      warnings.push('High mana curve - consider adding more low-cost cards');
    }

    return { errors, warnings };
  };

  // Add card to deck
  const addCardToDeck = (card: Card, quantity: number = 1) => {
    audioManager.playCardPlace();
    
    setCurrentDeck(prev => {
      const existingCard = prev.cards.find(c => c.cardId === card.id);
      let newCards;
      
      if (existingCard) {
        const newCount = Math.min(existingCard.count + quantity, 4);
        newCards = prev.cards.map(c => 
          c.cardId === card.id ? { ...c, count: newCount } : c
        );
      } else {
        newCards = [...prev.cards, { cardId: card.id, count: Math.min(quantity, 4) }];
      }

      const totalCards = newCards.reduce((sum, c) => sum + c.count, 0);
      const manaCurve = calculateManaCurve({ ...prev, cards: newCards, totalCards });
      
      const updated = {
        ...prev,
        cards: newCards,
        totalCards,
        manaCurve,
        lastModified: new Date(),
      };

      return updated;
    });
  };

  // Remove card from deck
  const removeCardFromDeck = (cardId: string, quantity: number = 1) => {
    audioManager.playCardFlip();
    
    setCurrentDeck(prev => {
      const newCards = prev.cards
        .map(c => ({
          ...c,
          count: c.cardId === cardId ? Math.max(0, c.count - quantity) : c.count
        }))
        .filter(c => c.count > 0);

      const totalCards = newCards.reduce((sum, c) => sum + c.count, 0);
      const manaCurve = calculateManaCurve({ ...prev, cards: newCards, totalCards });
      
      return {
        ...prev,
        cards: newCards,
        totalCards,
        manaCurve,
        lastModified: new Date(),
      };
    });
  };

  // Update deck validation when deck changes
  useEffect(() => {
    const validation = validateDeck(currentDeck);
    setDeckValidation(validation);
    setCurrentDeck(prev => ({ ...prev, isValid: validation.errors.length === 0 }));
  }, [currentDeck.cards, currentDeck.totalCards]);

  // Export deck
  const exportDeck = () => {
    const deckCode = btoa(JSON.stringify(currentDeck));
    navigator.clipboard.writeText(deckCode);
    // In real app, would show toast notification
    console.log('Deck exported to clipboard');
  };

  // Import deck
  const importDeck = (deckCode: string) => {
    try {
      const imported = JSON.parse(atob(deckCode));
      setCurrentDeck(imported);
      // In real app, would show success notification
      console.log('Deck imported successfully');
    } catch (error) {
      // In real app, would show error notification
      console.error('Invalid deck code');
    }
  };

  return (
    <div className="enhanced-deck-builder">
      <style>{`
        .enhanced-deck-builder {
          display: flex;
          height: 100vh;
          background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
          color: white;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .deck-builder-sidebar {
          width: 350px;
          background: rgba(0, 0, 0, 0.3);
          border-right: 1px solid rgba(139, 69, 19, 0.3);
          padding: 20px;
          overflow-y: auto;
        }

        .deck-builder-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .deck-builder-header {
          display: flex;
          justify-content: between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid rgba(139, 69, 19, 0.3);
        }

        .deck-info {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .deck-name-input {
          background: rgba(139, 69, 19, 0.2);
          border: 1px solid rgba(139, 69, 19, 0.5);
          color: white;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 18px;
          font-weight: bold;
        }

        .deck-stats {
          display: flex;
          gap: 15px;
          font-size: 14px;
        }

        .deck-stat {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .filters-panel {
          display: flex;
          gap: 15px;
          align-items: center;
          padding: 20px;
          background: rgba(0, 0, 0, 0.2);
          border-bottom: 1px solid rgba(139, 69, 19, 0.3);
          flex-wrap: wrap;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .filter-label {
          font-size: 12px;
          color: #ccc;
        }

        .filter-input, .filter-select {
          background: rgba(139, 69, 19, 0.2);
          border: 1px solid rgba(139, 69, 19, 0.5);
          color: white;
          padding: 6px 10px;
          border-radius: 4px;
          font-size: 14px;
        }

        .cards-container {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 15px;
        }

        .card-item {
          background: rgba(139, 69, 19, 0.2);
          border: 1px solid rgba(139, 69, 19, 0.5);
          border-radius: 8px;
          padding: 15px;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .card-item:hover {
          background: rgba(139, 69, 19, 0.3);
          border-color: rgba(139, 69, 19, 0.7);
          transform: translateY(-2px);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .card-name {
          font-weight: bold;
          font-size: 16px;
        }

        .card-cost {
          background: rgba(0, 123, 255, 0.3);
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: bold;
        }

        .card-type {
          color: #ccc;
          font-size: 14px;
          margin-bottom: 5px;
        }

        .card-stats {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-power-toughness {
          font-weight: bold;
          color: #ffd700;
        }

        .card-rarity {
          font-size: 12px;
          padding: 2px 6px;
          border-radius: 10px;
          text-transform: uppercase;
        }

        .rarity-common { background: #808080; }
        .rarity-uncommon { background: #c0c0c0; }
        .rarity-rare { background: #ffd700; color: black; }

        .deck-list {
          padding: 20px 0;
        }

        .deck-list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .deck-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid rgba(139, 69, 19, 0.2);
        }

        .deck-card-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .deck-card-count {
          background: rgba(139, 69, 19, 0.3);
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          min-width: 24px;
          text-align: center;
        }

        .deck-card-controls {
          display: flex;
          gap: 5px;
        }

        .card-control-btn {
          background: rgba(139, 69, 19, 0.3);
          border: 1px solid rgba(139, 69, 19, 0.5);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .card-control-btn:hover {
          background: rgba(139, 69, 19, 0.5);
        }

        .mana-curve {
          margin-top: 20px;
        }

        .mana-curve-header {
          font-weight: bold;
          margin-bottom: 10px;
        }

        .mana-curve-bars {
          display: flex;
          align-items: end;
          gap: 5px;
          height: 80px;
        }

        .mana-curve-bar {
          background: rgba(0, 123, 255, 0.6);
          border-radius: 4px 4px 0 0;
          min-width: 30px;
          display: flex;
          flex-direction: column;
          justify-content: end;
          align-items: center;
          position: relative;
        }

        .mana-curve-count {
          position: absolute;
          top: -20px;
          font-size: 12px;
          font-weight: bold;
        }

        .mana-curve-cost {
          padding: 4px;
          font-size: 12px;
          font-weight: bold;
        }

        .validation-panel {
          margin-top: 20px;
          padding: 15px;
          border-radius: 8px;
        }

        .validation-errors {
          background: rgba(220, 53, 69, 0.2);
          border: 1px solid rgba(220, 53, 69, 0.5);
        }

        .validation-warnings {
          background: rgba(255, 193, 7, 0.2);
          border: 1px solid rgba(255, 193, 7, 0.5);
        }

        .validation-header {
          font-weight: bold;
          margin-bottom: 8px;
        }

        .validation-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .validation-item {
          padding: 2px 0;
          font-size: 14px;
        }

        .deck-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .action-btn {
          background: rgba(139, 69, 19, 0.3);
          border: 1px solid rgba(139, 69, 19, 0.5);
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .action-btn:hover {
          background: rgba(139, 69, 19, 0.5);
        }

        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .view-mode-toggle {
          display: flex;
          gap: 5px;
        }

        .view-mode-btn {
          background: rgba(139, 69, 19, 0.3);
          border: 1px solid rgba(139, 69, 19, 0.5);
          color: white;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .view-mode-btn.active {
          background: rgba(139, 69, 19, 0.6);
        }

        .owned-indicator {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(40, 167, 69, 0.8);
          color: white;
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 10px;
          font-weight: bold;
        }
      `}</style>

      {/* Deck Sidebar */}
      <div className="deck-builder-sidebar">
        <div className="deck-list">
          <div className="deck-list-header">
            <h3>Current Deck ({currentDeck.totalCards} cards)</h3>
            <div className="view-mode-toggle">
              <button 
                className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                Grid
              </button>
              <button 
                className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                List
              </button>
            </div>
          </div>

          {currentDeck.cards.map(({ cardId, count }) => {
            const card = KONIVRER_CARDS.find(c => c.id === cardId);
            if (!card) return null;

            return (
              <div key={cardId} className="deck-card">
                <div className="deck-card-info">
                  <span className="deck-card-count">{count}</span>
                  <span>{card.name}</span>
                  <span className="card-cost">{card.cost}</span>
                </div>
                <div className="deck-card-controls">
                  <button 
                    className="card-control-btn"
                    onClick={() => addCardToDeck(card, 1)}
                    disabled={count >= 4}
                  >
                    +
                  </button>
                  <button 
                    className="card-control-btn"
                    onClick={() => removeCardFromDeck(cardId, 1)}
                  >
                    -
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mana Curve */}
        <div className="mana-curve">
          <div className="mana-curve-header">Mana Curve</div>
          <div className="mana-curve-bars">
            {currentDeck.manaCurve.map((count, cost) => (
              <div 
                key={cost}
                className="mana-curve-bar"
                style={{ height: `${Math.max(8, (count / Math.max(...currentDeck.manaCurve)) * 60)}px` }}
              >
                <span className="mana-curve-count">{count}</span>
                <span className="mana-curve-cost">{cost === 7 ? '7+' : cost}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Deck Validation */}
        {(deckValidation.errors.length > 0 || deckValidation.warnings.length > 0) && (
          <div className="validation-panel">
            {deckValidation.errors.length > 0 && (
              <div className="validation-errors">
                <div className="validation-header">❌ Errors</div>
                <ul className="validation-list">
                  {deckValidation.errors.map((error, index) => (
                    <li key={index} className="validation-item">{error}</li>
                  ))}
                </ul>
              </div>
            )}
            {deckValidation.warnings.length > 0 && (
              <div className="validation-warnings">
                <div className="validation-header">⚠️ Warnings</div>
                <ul className="validation-list">
                  {deckValidation.warnings.map((warning, index) => (
                    <li key={index} className="validation-item">{warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Deck Actions */}
        <div className="deck-actions">
          <button className="action-btn" onClick={exportDeck}>
            Export
          </button>
          <button className="action-btn" onClick={() => {
            const code = prompt('Enter deck code:');
            if (code) importDeck(code);
          }}>
            Import
          </button>
          <button 
            className="action-btn" 
            disabled={!currentDeck.isValid}
            onClick={() => console.log('Save deck')}
          >
            Save
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="deck-builder-main">
        {/* Header */}
        <div className="deck-builder-header">
          <div className="deck-info">
            <input 
              type="text"
              className="deck-name-input"
              value={currentDeck.name}
              onChange={(e) => setCurrentDeck(prev => ({ ...prev, name: e.target.value }))}
            />
            <div className="deck-stats">
              <div className="deck-stat">
                <span>📊</span>
                <span>{currentDeck.totalCards}/60</span>
              </div>
              <div className="deck-stat">
                <span>{currentDeck.isValid ? '✅' : '❌'}</span>
                <span>{currentDeck.isValid ? 'Valid' : 'Invalid'}</span>
              </div>
              <div className="deck-stat">
                <span>⚡</span>
                <span>Avg: {(currentDeck.manaCurve.reduce((sum, count, cost) => sum + count * cost, 0) / Math.max(currentDeck.totalCards, 1)).toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-panel">
          <div className="filter-group">
            <label className="filter-label">Search</label>
            <input 
              type="text"
              className="filter-input"
              placeholder="Card name..."
              value={filters.nameSearch}
              onChange={(e) => setFilters(prev => ({ ...prev, nameSearch: e.target.value }))}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Cost</label>
            <div style={{ display: 'flex', gap: '5px' }}>
              <input 
                type="number"
                className="filter-input"
                style={{ width: '60px' }}
                value={filters.costMin}
                onChange={(e) => setFilters(prev => ({ ...prev, costMin: parseInt(e.target.value) || 0 }))}
              />
              <span>-</span>
              <input 
                type="number"
                className="filter-input"
                style={{ width: '60px' }}
                value={filters.costMax}
                onChange={(e) => setFilters(prev => ({ ...prev, costMax: parseInt(e.target.value) || 10 }))}
              />
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Type</label>
            <select 
              className="filter-select"
              multiple
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                type: Array.from(e.target.selectedOptions, option => option.value) 
              }))}
            >
              <option value="Familiar">Familiar</option>
              <option value="Flag">Flag</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Rarity</label>
            <select 
              className="filter-select"
              multiple
              value={filters.rarity}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                rarity: Array.from(e.target.selectedOptions, option => option.value) 
              }))}
            >
              <option value="Common">Common</option>
              <option value="Uncommon">Uncommon</option>
              <option value="Rare">Rare</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Sort</label>
            <select 
              className="filter-select"
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
            >
              <option value="name">Name</option>
              <option value="cost">Cost</option>
              <option value="rarity">Rarity</option>
              <option value="type">Type</option>
            </select>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="cards-container">
          <div className="cards-grid">
            {filteredCards.map(card => {
              const owned = collection.get(card.id) || 0;
              const inDeck = currentDeck.cards.find(c => c.cardId === card.id)?.count || 0;

              return (
                <motion.div
                  key={card.id}
                  className="card-item"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => addCardToDeck(card)}
                >
                  {owned > 0 && (
                    <div className="owned-indicator">{owned}</div>
                  )}
                  
                  <div className="card-header">
                    <div className="card-name">{card.name}</div>
                    <div className="card-cost">{card.cost}</div>
                  </div>
                  
                  <div className="card-type">{card.type}</div>
                  
                  <div className="card-stats">
                    {card.strength && (
                      <div className="card-power-toughness">{card.strength}/X</div>
                    )}
                    <div className={`card-rarity rarity-${card.rarity.toLowerCase()}`}>
                      {card.rarity}
                    </div>
                  </div>

                  {inDeck > 0 && (
                    <div style={{ 
                      position: 'absolute', 
                      bottom: '8px', 
                      left: '8px',
                      background: 'rgba(0, 123, 255, 0.8)',
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '10px',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}>
                      {inDeck} in deck
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDeckBuilder;