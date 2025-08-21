import React, { useState, useMemo } from 'react';
import * as nav from '../nav.css.ts';
import { Deck, cardDatabase } from '../data/cards';

interface DeckSearchProps {
  onDeckSelect?: (deck: Deck) => void;
}

export const DeckSearch: React.FC<DeckSearchProps> = ({ onDeckSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [elementFilter, setElementFilter] = useState('');
  const [formatFilter, setFormatFilter] = useState('');

  // Available decks will be loaded from backend
  const availableDecks: Deck[] = [];

  // Get unique values for filters
  const elements = useMemo(() => 
    [...new Set(availableDecks.map(deck => deck.mainElement))].sort(), [availableDecks]);
  const formats = useMemo(() => 
    [...new Set(availableDecks.map(deck => deck.format))].sort(), [availableDecks]);

  // Filter decks based on search criteria
  const filteredDecks = useMemo(() => {
    return availableDecks.filter(deck => {
      const matchesSearch = searchTerm === '' || 
        deck.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deck.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesElement = elementFilter === '' || deck.mainElement === elementFilter;
      const matchesFormat = formatFilter === '' || deck.format === formatFilter;

      return matchesSearch && matchesElement && matchesFormat;
    });
  }, [searchTerm, elementFilter, formatFilter, availableDecks]);

  const getDeckPreviewCards = (deck: Deck) => {
    // Get first 3 cards from deck for preview
    return deck.cards.slice(0, 3)
      .map(cardId => cardDatabase.find(card => card.id === cardId))
      .filter(Boolean);
  };

  const handleAddToMyAccount = (deck: Deck) => {
    console.log('Adding deck to my account:', deck.name);
    alert(`"${deck.name}" will be imported to your account... (Feature coming soon)`);
  };

  const handlePlayInSimulator = (deck: Deck) => {
    console.log('Loading deck in simulator:', deck.name);
    alert(`Loading "${deck.name}" in simulator... (Feature coming soon)`);
  };

  return (
    <div>
      <div className="search-container">
        <h1 className={nav.navTitle}>Deck Search</h1>
        <input
          type="text"
          placeholder="Search decks by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <div className="filters">
          <select 
            value={elementFilter} 
            onChange={(e) => setElementFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Elements</option>
            {elements.map(element => (
              <option key={element} value={element}>{element}</option>
            ))}
          </select>

          <select 
            value={formatFilter} 
            onChange={(e) => setFormatFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Formats</option>
            {formats.map(format => (
              <option key={format} value={format}>{format}</option>
            ))}
          </select>
        </div>

        <div className="results-count">
          {filteredDecks.length} decks found
        </div>
      </div>

      <div className="card-grid">
        {filteredDecks.map(deck => {
          const previewCards = getDeckPreviewCards(deck);
          
          return (
            <div 
              key={deck.id} 
              className="card-item"
              style={{ cursor: 'default' }}
            >
              <div style={{ display: 'flex', height: '200px', overflow: 'hidden' }}>
                {previewCards.map((card, index) => (
                  <img 
                    key={card?.id}
                    src={card?.webpUrl} 
                    alt={card?.name}
                    style={{
                      width: `${100 / previewCards.length}%`,
                      height: '100%',
                      objectFit: 'cover',
                      opacity: 1 - (index * 0.1)
                    }}
                    onError={(e) => {
                      // Fallback to PNG if WebP fails
                      if (card) {
                        (e.target as HTMLImageElement).src = card.imageUrl;
                      }
                    }}
                  />
                ))}
              </div>
              <div className="card-info">
                <div className="card-name">{deck.name}</div>
                <div className="card-details">
                  <div>{deck.mainElement} • {deck.format}</div>
                  <div>{deck.cards.length} cards • Win Rate: {(deck.winRate * 100).toFixed(0)}%</div>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
                    {deck.description}
                  </div>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    Updated: {deck.updatedAt.toLocaleDateString()}
                  </div>
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <button
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        fontSize: '0.8rem',
                        background: 'var(--accent-color)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToMyAccount(deck);
                      }}
                    >
                      + My Account
                    </button>
                    <button
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        fontSize: '0.8rem',
                        background: 'var(--secondary-bg)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayInSimulator(deck);
                      }}
                    >
                      🎮 Play
                    </button>
                    <button
                      style={{
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.8rem',
                        background: 'var(--secondary-bg)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeckSelect?.(deck);
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};