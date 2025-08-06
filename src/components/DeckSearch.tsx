import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext, Deck } from '../contexts/AppContext';
import { KONIVRER_CARDS } from '../data/cards';
import '../styles/deck-search.css';

interface DeckSearchProps {
  onDeckSelect?: (deck: Deck) => void;
  onImportDeck?: (deck: Deck) => void;
  onPlayWithDeck?: (deck: Deck) => void;
  showMyDecks?: boolean;
}

const DeckSearch: React.FC<DeckSearchProps> = ({
  onDeckSelect,
  onImportDeck,
  onPlayWithDeck,
  showMyDecks = false,
}) => {
  const { user, decks, publicDecks, setPublicDecks, importDeck } =
    useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState<
    'all' | 'familiar' | 'flag' | 'elements'
  >('all');
  const [sortBy, setSortBy] = useState<'name' | 'author' | 'cards' | 'updated'>(
    'updated',
  );
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);

  // Mock data for public decks (in a real app, this would come from an API)
  useEffect(() => {
    if (publicDecks.length === 0) {
      const mockPublicDecks: Deck[] = [
        {
          id: 'public_1',
          name: 'Fire Elemental Aggro',
          description: 'Fast-paced deck focused on fire elementals',
          cards: [
            { cardId: 'salamander', quantity: 3 },
            { cardId: 'fire_familiar_1', quantity: 2 },
            { cardId: 'solar', quantity: 1 },
          ],
          authorId: 'user_1',
          authorUsername: 'ElementMaster',
          isPublic: true,
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-20'),
          tags: ['aggro', 'fire', 'competitive'],
          format: 'Standard',
        },
        {
          id: 'public_2',
          name: 'Water Control',
          description: 'Control deck with water elementals and card draw',
          cards: [
            { cardId: 'undine', quantity: 3 },
            { cardId: 'water_familiar_1', quantity: 2 },
            { cardId: 'water_familiar_2', quantity: 2 },
          ],
          authorId: 'user_2',
          authorUsername: 'AquaStrategist',
          isPublic: true,
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-18'),
          tags: ['control', 'water', 'defensive'],
          format: 'Standard',
        },
        {
          id: 'public_3',
          name: 'Rainbow Midrange',
          description: 'Balanced deck using multiple elements',
          cards: [
            { cardId: 'rainbow', quantity: 1 },
            { cardId: 'salamander', quantity: 2 },
            { cardId: 'undine', quantity: 2 },
            { cardId: 'gnome', quantity: 2 },
          ],
          authorId: 'user_3',
          authorUsername: 'PrismBuilder',
          isPublic: true,
          createdAt: new Date('2024-01-05'),
          updatedAt: new Date('2024-01-25'),
          tags: ['midrange', 'multicolor', 'versatile'],
          format: 'Standard',
        },
      ];
      setPublicDecks(mockPublicDecks);
    }
  }, [publicDecks.length, setPublicDecks]);

  const getDecksToShow = () => {
    if (showMyDecks && user) {
      return decks.filter(deck => deck.authorId === user.id);
    }
    return publicDecks;
  };

  const getCardById = (cardId: string) => {
    return KONIVRER_CARDS.find(card => card.id === cardId);
  };

  const getDeckStats = (deck: Deck) => {
    const stats = {
      totalCards: 0,
      familiar: 0,
      flag: 0,
      elements: new Set<string>(),
      totalCost: 0,
    };

    deck.cards.forEach(deckCard => {
      const card = getCardById(deckCard.cardId);
      if (card) {
        stats.totalCards += deckCard.quantity;
        if (card.type === 'Familiar') stats.familiar += deckCard.quantity;
        if (card.type === 'Flag') stats.flag += deckCard.quantity;
        stats.totalCost += card.cost * deckCard.quantity;
        card.elements.forEach(el => stats.elements.add(el));
      }
    });

    return {
      ...stats,
      elements: Array.from(stats.elements),
      avgCost: stats.totalCards > 0 ? stats.totalCost / stats.totalCards : 0,
    };
  };

  const filteredDecks = getDecksToShow()
    .filter(deck => {
      const matchesSearch =
        deck.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deck.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deck.authorUsername.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deck.tags.some(tag =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      if (!matchesSearch) return false;

      if (filterBy === 'all') return true;

      const stats = getDeckStats(deck);
      switch (filterBy) {
        case 'familiar':
          return stats.familiar > stats.flag;
        case 'flag':
          return stats.flag > stats.familiar;
        case 'elements':
          return stats.elements.length >= 3;
        default:
          return true;
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'author':
          return a.authorUsername.localeCompare(b.authorUsername);
        case 'cards':
          return getDeckStats(b).totalCards - getDeckStats(a).totalCards;
        case 'updated':
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        default:
          return 0;
      }
    });

  const handleImport = (deck: Deck) => {
    if (!user) return;

    const importedDeck: Deck = {
      ...deck,
      id: `imported_${Date.now()}`,
      authorId: user.id,
      authorUsername: user.username,
      isPublic: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: `${deck.name} (Imported)`,
    };

    importDeck(importedDeck);
    onImportDeck?.(importedDeck);
  };

  return (
    <div className="deck-search">
      <div className="deck-search-header">
        <h2>{showMyDecks ? 'My Decks' : 'Browse Public Decks'}</h2>

        <div className="search-controls">
          <input
            type="text"
            placeholder="Search decks..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="search-input"
          />

          <select
            value={filterBy}
            onChange={e => setFilterBy(e.target.value as any)}
            className="filter-select"
          >
            <option value="all">All Decks</option>
            <option value="familiar">Familiar-Heavy</option>
            <option value="flag">Flag-Heavy</option>
            <option value="elements">Multi-Element</option>
          </select>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="sort-select"
          >
            <option value="updated">Recently Updated</option>
            <option value="name">Name</option>
            <option value="author">Author</option>
            <option value="cards">Card Count</option>
          </select>
        </div>
      </div>

      <div className="deck-search-content">
        <div className="deck-list">
          <AnimatePresence>
            {filteredDecks.map(deck => {
              const stats = getDeckStats(deck);

              return (
                <motion.div
                  key={deck.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`deck-item ${selectedDeck?.id === deck.id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedDeck(deck);
                    onDeckSelect?.(deck);
                  }}
                >
                  <div className="deck-header">
                    <h3 className="deck-name">{deck.name}</h3>
                    <div className="deck-meta">
                      <span className="deck-author">
                        by {deck.authorUsername}
                      </span>
                      <span className="deck-updated">
                        {new Date(deck.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <p className="deck-description">{deck.description}</p>

                  <div className="deck-stats">
                    <div className="stat">
                      <span className="stat-label">Cards:</span>
                      <span className="stat-value">{stats.totalCards}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Avg Cost:</span>
                      <span className="stat-value">
                        {stats.avgCost.toFixed(1)}
                      </span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Elements:</span>
                      <span className="stat-value">
                        {stats.elements.join(', ')}
                      </span>
                    </div>
                  </div>

                  <div className="deck-tags">
                    {deck.tags.map(tag => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="deck-actions">
                    {!showMyDecks && user && (
                      <>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleImport(deck);
                          }}
                          className="import-btn"
                        >
                          Import
                        </button>
                        {onPlayWithDeck && (
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              onPlayWithDeck(deck);
                            }}
                            className="play-btn"
                          >
                            Play with Deck
                          </button>
                        )}
                      </>
                    )}
                    {showMyDecks && onPlayWithDeck && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onPlayWithDeck(deck);
                        }}
                        className="play-btn"
                      >
                        Play
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredDecks.length === 0 && (
            <div className="no-decks">
              <p>No decks found matching your criteria.</p>
              {!showMyDecks && (
                <p>Try adjusting your search or filter options.</p>
              )}
            </div>
          )}
        </div>

        {selectedDeck && (
          <div className="deck-details">
            <h3>Deck Details</h3>
            <div className="deck-card-list">
              {selectedDeck.cards.map(deckCard => {
                const card = getCardById(deckCard.cardId);
                if (!card) return null;

                return (
                  <div key={deckCard.cardId} className="deck-card">
                    <span className="card-quantity">{deckCard.quantity}x</span>
                    <span className="card-name">{card.name}</span>
                    <span className="card-cost">{card.cost}</span>
                    <span className="card-type">{card.type}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeckSearch;
