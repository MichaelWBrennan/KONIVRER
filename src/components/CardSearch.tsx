import { useState, useCallback, useEffect } from 'react';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { searchCards, autocompleteCardName } from '../services/scryfall';
import { ScryfallCard } from '../types';

const CardSearch = () => {
  const [query, setQuery] = useState('');
  const [cards, setCards] = useState<ScryfallCard[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setCards([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await searchCards(searchQuery);
        setCards(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to search cards');
        setCards([]);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  // Debounced autocomplete function
  const debouncedAutocomplete = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length >= 2) {
        try {
          const suggestions = await autocompleteCardName(searchQuery);
          setSuggestions(suggestions.slice(0, 8)); // Limit to 8 suggestions
        } catch (err) {
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(query);
    debouncedAutocomplete(query);
  }, [query, debouncedSearch, debouncedAutocomplete]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(value.length >= 2);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
  };

  const getCardImage = (card: ScryfallCard): string => {
    return card.image_uris?.normal || 
           card.card_faces?.[0]?.image_uris?.normal || 
           '/placeholder-card.png';
  };

  const formatManaCost = (manaCost?: string): string => {
    if (!manaCost) return '';
    // Convert {R}{R} to more readable format
    return manaCost.replace(/\{([^}]+)\}/g, '$1');
  };

  return (
    <section className="card-search-container">
      <h2>Card Search</h2>
      <p>Search for Magic: The Gathering cards using Scryfall database</p>
      
      <div className="search-wrapper">
        <div className="search-input-container">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setShowSuggestions(query.length >= 2)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Search for cards... (e.g., 'Lightning Bolt', 'type:creature', 'cmc:3')"
            className="search-input"
          />
        </div>
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="suggestions-dropdown">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>

      {loading && (
        <div className="loading">
          <Loader2 className="animate-spin" size={24} />
          <span>Searching cards...</span>
        </div>
      )}

      {error && (
        <div className="error">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {cards.length > 0 && (
        <div className="search-results">
          <h3>Found {cards.length} cards</h3>
          <div className="card-grid">
            {cards.map((card) => (
              <div key={card.id} className="card-item">
                <img
                  src={getCardImage(card)}
                  alt={card.name}
                  className="card-image"
                  loading="lazy"
                />
                <div className="card-info">
                  <div className="card-name">{card.name}</div>
                  <div className="card-cost">{formatManaCost(card.mana_cost)}</div>
                  <div className="card-type">{card.type_line}</div>
                  {card.power && card.toughness && (
                    <div className="card-stats">{card.power}/{card.toughness}</div>
                  )}
                  <div className="card-rarity">{card.rarity}</div>
                  <div className="card-set">{card.set_name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {query && !loading && cards.length === 0 && !error && (
        <div className="no-results">
          <p>No cards found for "{query}"</p>
          <p>Try a different search term or use Scryfall syntax like:</p>
          <ul>
            <li><code>type:creature</code> - Search by card type</li>
            <li><code>cmc:3</code> - Search by converted mana cost</li>
            <li><code>color:red</code> - Search by color</li>
            <li><code>set:dom</code> - Search by set code</li>
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

export default CardSearch;