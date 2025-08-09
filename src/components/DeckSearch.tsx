import { useState, useCallback, useEffect } from 'react';
import { Search, Loader2, AlertCircle, Users, Calendar, Tag } from 'lucide-react';
import { searchDecks, getDecksByFormat } from '../services/deckDatabase';
import { Deck } from '../types';

const DeckSearch = () => {
  const [query, setQuery] = useState('');
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string>('');

  const formats = ['Standard', 'Modern', 'Legacy', 'Vintage', 'Commander', 'Pioneer'];

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string, format: string) => {
      setLoading(true);
      setError(null);

      try {
        let result: Deck[];
        
        if (format) {
          result = await getDecksByFormat(format);
          if (searchQuery.trim()) {
            const lowercaseQuery = searchQuery.toLowerCase();
            result = result.filter(deck => 
              deck.name.toLowerCase().includes(lowercaseQuery) ||
              deck.description.toLowerCase().includes(lowercaseQuery) ||
              deck.author?.toLowerCase().includes(lowercaseQuery) ||
              deck.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
            );
          }
        } else {
          result = await searchDecks(searchQuery);
        }
        
        setDecks(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to search decks');
        setDecks([]);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSearch(query, selectedFormat);
  }, [query, selectedFormat, debouncedSearch]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFormat(e.target.value);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  const getColorFromTags = (tags?: string[]): string => {
    if (!tags || tags.length === 0) return '#666';
    
    const colorMap: Record<string, string> = {
      'aggro': '#ef4444',
      'control': '#3b82f6', 
      'midrange': '#10b981',
      'combo': '#8b5cf6',
      'ramp': '#84cc16',
      'burn': '#f97316',
      'competitive': '#fbbf24'
    };
    
    for (const tag of tags) {
      if (colorMap[tag.toLowerCase()]) {
        return colorMap[tag.toLowerCase()];
      }
    }
    
    return '#666';
  };

  return (
    <section className="deck-search-container">
      <h2>Deck Search</h2>
      <p>Find and explore community decks for different formats</p>
      
      <div className="deck-search-controls">
        <div className="search-wrapper">
          <div className="search-input-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              value={query}
              onChange={handleQueryChange}
              placeholder="Search decks by name, description, author, or cards..."
              className="search-input"
            />
          </div>
        </div>
        
        <div className="format-filter">
          <select
            value={selectedFormat}
            onChange={handleFormatChange}
            className="format-select"
          >
            <option value="">All Formats</option>
            {formats.map(format => (
              <option key={format} value={format}>{format}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <div className="loading">
          <Loader2 className="animate-spin" size={24} />
          <span>Searching decks...</span>
        </div>
      )}

      {error && (
        <div className="error">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {decks.length > 0 && (
        <div className="search-results">
          <h3>Found {decks.length} decks</h3>
          <div className="deck-grid">
            {decks.map((deck) => (
              <div key={deck.id} className="deck-item">
                <div className="deck-header">
                  <div className="deck-name">{deck.name}</div>
                  <div className="deck-format">{deck.format}</div>
                </div>
                
                <div className="deck-description">{deck.description}</div>
                
                <div className="deck-stats">
                  <div className="stat">
                    <span>Main: {deck.mainboard_count}</span>
                  </div>
                  <div className="stat">
                    <span>Side: {deck.sideboard_count}</span>
                  </div>
                  <div className="stat">
                    <Users size={14} />
                    <span>{deck.author}</span>
                  </div>
                </div>
                
                <div className="deck-meta">
                  <div className="deck-date">
                    <Calendar size={14} />
                    <span>Updated {formatDate(deck.updated_at)}</span>
                  </div>
                  
                  {deck.tags && deck.tags.length > 0 && (
                    <div className="deck-tags">
                      {deck.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="deck-tag"
                          style={{ backgroundColor: getColorFromTags([tag]) }}
                        >
                          <Tag size={12} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="deck-cards-preview">
                  <h4>Key Cards:</h4>
                  <div className="key-cards">
                    {deck.cards.slice(0, 4).map((card, index) => (
                      <span key={index} className="key-card">
                        {card.quantity}x {card.name}
                      </span>
                    ))}
                    {deck.cards.length > 4 && (
                      <span className="more-cards">
                        +{deck.cards.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {query && !loading && decks.length === 0 && !error && (
        <div className="no-results">
          <p>No decks found for "{query}"</p>
          <p>Try searching by:</p>
          <ul>
            <li>Deck name (e.g., "Lightning Aggro")</li>
            <li>Format (e.g., "Standard", "Modern")</li>
            <li>Author name</li>
            <li>Card names in the deck</li>
            <li>Deck archetype tags</li>
          </ul>
        </div>
      )}
    </section>
  );
};

// Utility function for debouncing
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default DeckSearch;