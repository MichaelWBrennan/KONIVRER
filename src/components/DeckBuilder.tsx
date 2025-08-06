import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext, Deck, DeckCard } from '../contexts/AppContext';
import UnifiedCardSearch from './UnifiedCardSearch';
import { KONIVRER_CARDS } from '../data/cards';
import '../styles/deck-builder.css';

interface DeckBuilderProps {
  initialDeck?: Deck;
  onSave?: (deck: Deck) => void;
  onCancel?: () => void;
}

const DeckBuilder: React.FC<DeckBuilderProps> = ({ 
  initialDeck, 
  onSave, 
  onCancel 
}) => {
  const { 
    user, 
    currentDeck, 
    setCurrentDeck, 
    createDeck, 
    publishDeck, 
    addCardToDeck 
  } = useContext(AppContext);

  const [deckName, setDeckName] = useState(initialDeck?.name || 'New Deck');
  const [deckDescription, setDeckDescription] = useState(initialDeck?.description || '');
  const [isPublic, setIsPublic] = useState(initialDeck?.isPublic || false);
  const [deckCards, setDeckCards] = useState<DeckCard[]>(initialDeck?.cards || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  // Create a working deck if none exists
  useEffect(() => {
    if (!currentDeck && !initialDeck && user) {
      const newDeck = createDeck(deckName, deckDescription, isPublic);
      setCurrentDeck(newDeck);
    }
  }, []);

  const getCardById = (cardId: string) => {
    return KONIVRER_CARDS.find(card => card.id === cardId);
  };

  const addCardToDeckLocal = (cardId: string) => {
    const existingCard = deckCards.find(dc => dc.cardId === cardId);
    if (existingCard) {
      setDeckCards(prev => 
        prev.map(dc => 
          dc.cardId === cardId 
            ? { ...dc, quantity: dc.quantity + 1 }
            : dc
        )
      );
    } else {
      setDeckCards(prev => [...prev, { cardId, quantity: 1 }]);
    }
  };

  const removeCardFromDeck = (cardId: string) => {
    const existingCard = deckCards.find(dc => dc.cardId === cardId);
    if (existingCard && existingCard.quantity > 1) {
      setDeckCards(prev => 
        prev.map(dc => 
          dc.cardId === cardId 
            ? { ...dc, quantity: dc.quantity - 1 }
            : dc
        )
      );
    } else {
      setDeckCards(prev => prev.filter(dc => dc.cardId !== cardId));
    }
  };

  const handleSave = () => {
    if (!user) return;

    const deck: Deck = {
      id: initialDeck?.id || `deck_${Date.now()}`,
      name: deckName,
      description: deckDescription,
      cards: deckCards,
      authorId: user.id,
      authorUsername: user.username,
      isPublic,
      createdAt: initialDeck?.createdAt || new Date(),
      updatedAt: new Date(),
      tags: [],
      format: 'Standard'
    };

    if (initialDeck) {
      publishDeck(deck.id, isPublic);
    } else {
      setCurrentDeck(deck);
    }

    onSave?.(deck);
  };

  const getTotalCards = () => {
    return deckCards.reduce((total, dc) => total + dc.quantity, 0);
  };

  const getCardStats = () => {
    const stats = {
      familiar: 0,
      flag: 0,
      totalCost: 0,
      elements: new Set<string>()
    };

    deckCards.forEach(dc => {
      const card = getCardById(dc.cardId);
      if (card) {
        if (card.type === 'Familiar') stats.familiar += dc.quantity;
        if (card.type === 'Flag') stats.flag += dc.quantity;
        stats.totalCost += card.cost * dc.quantity;
        card.elements.forEach(el => stats.elements.add(el));
      }
    });

    return {
      ...stats,
      elements: Array.from(stats.elements),
      avgCost: deckCards.length > 0 ? stats.totalCost / getTotalCards() : 0
    };
  };

  const stats = getCardStats();

  return (
    <div className="deck-builder">
      <div className="deck-builder-header">
        <div className="deck-info">
          <input
            type="text"
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
            className="deck-name-input"
            placeholder="Deck Name"
          />
          <textarea
            value={deckDescription}
            onChange={(e) => setDeckDescription(e.target.value)}
            className="deck-description-input"
            placeholder="Deck Description"
            rows={2}
          />
          <div className="deck-privacy">
            <label>
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              Make deck public
            </label>
          </div>
        </div>
        <div className="deck-actions">
          <button onClick={handleSave} className="save-deck-btn">
            Save Deck
          </button>
          {onCancel && (
            <button onClick={onCancel} className="cancel-btn">
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="deck-builder-content">
        <div className="card-search-panel">
          <h3>Add Cards</h3>
          <UnifiedCardSearch
            onCardSelect={(card) => {
              setSelectedCard(card.id);
              addCardToDeckLocal(card.id);
            }}
            compact={true}
          />
        </div>

        <div className="deck-panel">
          <div className="deck-stats">
            <h3>Deck Stats ({getTotalCards()} cards)</h3>
            <div className="stats-grid">
              <div>Familiars: {stats.familiar}</div>
              <div>Flags: {stats.flag}</div>
              <div>Avg Cost: {stats.avgCost.toFixed(1)}</div>
              <div>Elements: {stats.elements.join(', ')}</div>
            </div>
          </div>

          <div className="deck-cards">
            <h3>Cards in Deck</h3>
            <div className="deck-card-list">
              <AnimatePresence>
                {deckCards.map((deckCard) => {
                  const card = getCardById(deckCard.cardId);
                  if (!card) return null;

                  return (
                    <motion.div
                      key={deckCard.cardId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="deck-card-item"
                    >
                      <div className="card-info">
                        <span className="card-name">{card.name}</span>
                        <span className="card-cost">{card.cost}</span>
                        <span className="card-type">{card.type}</span>
                      </div>
                      <div className="card-quantity">
                        <button 
                          onClick={() => removeCardFromDeck(card.id)}
                          className="quantity-btn decrease"
                        >
                          -
                        </button>
                        <span className="quantity">{deckCard.quantity}</span>
                        <button 
                          onClick={() => addCardToDeckLocal(card.id)}
                          className="quantity-btn increase"
                        >
                          +
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeckBuilder;