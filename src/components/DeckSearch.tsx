import { useState, useMemo } from 'react';
import { Deck, sampleDecks, cardDatabase } from '../data/cards';

interface DeckSearchProps {
  onDeckSelect?: (deck: Deck) => void;
}

export const DeckSearch: React.FC<DeckSearchProps> = ({ onDeckSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [elementFilter, setElementFilter] = useState('');
  const [formatFilter, setFormatFilter] = useState('');

  // Get unique values for filters
  const elements = useMemo(() => 
    [...new Set(sampleDecks.map(deck => deck.mainElement))].sort(), []);
  const formats = useMemo(() => 
    [...new Set(sampleDecks.map(deck => deck.format))].sort(), []);

  // Filter decks based on search criteria
  const filteredDecks = useMemo(() => {
    return sampleDecks.filter(deck => {
      const matchesSearch = searchTerm === '' || 
        deck.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deck.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesElement = elementFilter === '' || deck.mainElement === elementFilter;
      const matchesFormat = formatFilter === '' || deck.format === formatFilter;

      return matchesSearch && matchesElement && matchesFormat;
    });
  }, [searchTerm, elementFilter, formatFilter]);

  const getDeckPreviewCards = (deck: Deck) => {
    // Get first 3 cards from deck for preview
    return deck.cards.slice(0, 3)
      .map(cardId => cardDatabase.find(card => card.id === cardId))
      .filter(Boolean);
  };

  return (
    <div>
      <div className="search-container">
        <h1 className="nav-title">Deck Search</h1>
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
              onClick={() => onDeckSelect?.(deck)}
              style={{ cursor: onDeckSelect ? 'pointer' : 'default' }}
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
                  <div>{deck.cards.length} cards</div>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
                    {deck.description}
                  </div>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    Updated: {deck.updatedAt.toLocaleDateString()}
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