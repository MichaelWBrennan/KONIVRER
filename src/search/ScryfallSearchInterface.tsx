import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScryfallSearchEngine, { 
  KonivrCard, 
  SearchQuery, 
  SearchResult, 
  SearchFilters, 
  SearchSuggestion,
  SortOption 
} from './ScryfallSearchEngine';

interface ScryfallSearchInterfaceProps {
  searchEngine: ScryfallSearchEngine;
  onCardSelect?: (card: KonivrCard) => void;
  onSearchResults?: (results: SearchResult) => void;
  placeholder?: string;
  showAdvancedFilters?: boolean;
  showSortOptions?: boolean;
  showSearchHistory?: boolean;
  maxResults?: number;
}

export const ScryfallSearchInterface: React.FC<ScryfallSearchInterfaceProps> = ({
  searchEngine,
  onCardSelect,
  onSearchResults,
  placeholder = "Search for cards... (e.g., c:red cmc:3, t:creature pow>=4)",
  showAdvancedFilters = true,
  showSortOptions = true,
  showSearchHistory = true,
  maxResults = 50
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [sortOption, setSortOption] = useState<SortOption>({ field: 'name', direction: 'asc' });
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(-1);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Debounced search
  const debouncedSearch = useCallback((searchQuery: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);
  }, []);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults(null);
      return;
    }

    setIsLoading(true);
    
    try {
      const searchResult = searchEngine.search(searchQuery, {
        filters,
        sort: sortOption,
        pageSize: maxResults
      });
      
      setResults(searchResult);
      onSearchResults?.(searchResult);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchEngine, filters, sortOption, maxResults, onSearchResults]);

  // Auto-complete suggestions
  const updateSuggestions = useCallback((input: string) => {
    if (input.length < 2) {
      setSuggestions([]);
      return;
    }

    const autocompleteSuggestions = searchEngine.getAutocompleteSuggestions(input);
    setSuggestions(autocompleteSuggestions);
  }, [searchEngine]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.trim()) {
      debouncedSearch(value);
      updateSuggestions(value);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedCardIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedCardIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedCardIndex >= 0) {
          selectSuggestion(suggestions[selectedCardIndex]);
        } else {
          performSearch(query);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedCardIndex(-1);
        break;
    }
  };

  const selectSuggestion = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    setShowSuggestions(false);
    setSelectedCardIndex(-1);
    performSearch(suggestion.text);
  };

  // Load search history
  useEffect(() => {
    setSearchHistory(searchEngine.getSearchHistory());
  }, [searchEngine]);

  // Advanced filter components
  const ColorFilter = () => (
    <div className="filter-group">
      <label>Colors:</label>
      <div className="color-buttons">
        {['white', 'blue', 'black', 'red', 'green', 'colorless'].map(color => (
          <button
            key={color}
            className={`color-btn ${color} ${filters.colors?.includes(color) ? 'active' : ''}`}
            onClick={() => {
              const newColors = filters.colors?.includes(color)
                ? filters.colors.filter(c => c !== color)
                : [...(filters.colors || []), color];
              setFilters({ ...filters, colors: newColors });
            }}
          >
            {color[0].toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );

  const RarityFilter = () => (
    <div className="filter-group">
      <label>Rarity:</label>
      <select
        multiple
        value={filters.rarity || []}
        onChange={(e) => {
          const values = Array.from(e.target.selectedOptions, option => option.value);
          setFilters({ ...filters, rarity: values });
        }}
      >
        <option value="common">Common</option>
        <option value="uncommon">Uncommon</option>
        <option value="rare">Rare</option>
        <option value="mythic">Mythic</option>
        <option value="legendary">Legendary</option>
      </select>
    </div>
  );

  const CMCFilter = () => (
    <div className="filter-group">
      <label>Converted Mana Cost:</label>
      <div className="numeric-filter">
        <input
          type="number"
          placeholder="Min"
          value={filters.cmc?.min || ''}
          onChange={(e) => {
            const min = e.target.value ? parseInt(e.target.value) : undefined;
            setFilters({ 
              ...filters, 
              cmc: { ...filters.cmc, min } 
            });
          }}
        />
        <span>to</span>
        <input
          type="number"
          placeholder="Max"
          value={filters.cmc?.max || ''}
          onChange={(e) => {
            const max = e.target.value ? parseInt(e.target.value) : undefined;
            setFilters({ 
              ...filters, 
              cmc: { ...filters.cmc, max } 
            });
          }}
        />
      </div>
    </div>
  );

  const PowerToughnessFilter = () => (
    <div className="filter-group">
      <label>Power/Toughness:</label>
      <div className="pt-filter">
        <div className="numeric-filter">
          <label>Power:</label>
          <input
            type="number"
            placeholder="Min"
            value={filters.power?.min || ''}
            onChange={(e) => {
              const min = e.target.value ? parseInt(e.target.value) : undefined;
              setFilters({ 
                ...filters, 
                power: { ...filters.power, min } 
              });
            }}
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.power?.max || ''}
            onChange={(e) => {
              const max = e.target.value ? parseInt(e.target.value) : undefined;
              setFilters({ 
                ...filters, 
                power: { ...filters.power, max } 
              });
            }}
          />
        </div>
        <div className="numeric-filter">
          <label>Toughness:</label>
          <input
            type="number"
            placeholder="Min"
            value={filters.toughness?.min || ''}
            onChange={(e) => {
              const min = e.target.value ? parseInt(e.target.value) : undefined;
              setFilters({ 
                ...filters, 
                toughness: { ...filters.toughness, min } 
              });
            }}
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.toughness?.max || ''}
            onChange={(e) => {
              const max = e.target.value ? parseInt(e.target.value) : undefined;
              setFilters({ 
                ...filters, 
                toughness: { ...filters.toughness, max } 
              });
            }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="scryfall-search-interface">
      {/* Search Input */}
      <div className="search-container">
        <div className="search-input-wrapper">
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
            placeholder={placeholder}
            className="search-input"
          />
          
          {isLoading && (
            <div className="search-loading">
              <div className="spinner" />
            </div>
          )}

          {/* Search History Button */}
          {showSearchHistory && (
            <button
              className="history-btn"
              onClick={() => setShowHistory(!showHistory)}
              title="Search History"
            >
              📜
            </button>
          )}

          {/* Advanced Filters Button */}
          {showAdvancedFilters && (
            <button
              className="filters-btn"
              onClick={() => setShowFilters(!showFilters)}
              title="Advanced Filters"
            >
              🔍
            </button>
          )}
        </div>

        {/* Auto-complete Suggestions */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              ref={suggestionsRef}
              className="suggestions-dropdown"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {suggestions.map((suggestion, index) => (
                <div
                  key={`${suggestion.type}-${suggestion.text}`}
                  className={`suggestion-item ${index === selectedCardIndex ? 'selected' : ''}`}
                  onClick={() => selectSuggestion(suggestion)}
                >
                  <span className={`suggestion-type ${suggestion.type}`}>
                    {suggestion.type}
                  </span>
                  <span className="suggestion-text">{suggestion.text}</span>
                  {suggestion.count && (
                    <span className="suggestion-count">({suggestion.count})</span>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search History */}
        <AnimatePresence>
          {showHistory && searchHistory.length > 0 && (
            <motion.div
              className="history-dropdown"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="history-header">Recent Searches</div>
              {searchHistory.slice(0, 10).map((historyQuery, index) => (
                <div
                  key={index}
                  className="history-item"
                  onClick={() => {
                    setQuery(historyQuery);
                    setShowHistory(false);
                    performSearch(historyQuery);
                  }}
                >
                  {historyQuery}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="filters-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="filters-content">
              <ColorFilter />
              <RarityFilter />
              <CMCFilter />
              <PowerToughnessFilter />
              
              <div className="filter-actions">
                <button
                  onClick={() => {
                    setFilters({});
                    performSearch(query);
                  }}
                  className="clear-filters-btn"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sort Options */}
      {showSortOptions && results && (
        <div className="sort-options">
          <label>Sort by:</label>
          <select
            value={`${sortOption.field}-${sortOption.direction}`}
            onChange={(e) => {
              const [field, direction] = e.target.value.split('-') as [any, 'asc' | 'desc'];
              const newSort = { field, direction };
              setSortOption(newSort);
              performSearch(query);
            }}
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="cmc-asc">CMC (Low to High)</option>
            <option value="cmc-desc">CMC (High to Low)</option>
            <option value="power-desc">Power (High to Low)</option>
            <option value="toughness-desc">Toughness (High to Low)</option>
            <option value="rarity-asc">Rarity (Common to Mythic)</option>
            <option value="rarity-desc">Rarity (Mythic to Common)</option>
            <option value="set-asc">Set (A-Z)</option>
            <option value="price-desc">Price (High to Low)</option>
          </select>
        </div>
      )}

      {/* Search Results */}
      {results && (
        <div className="search-results">
          <div className="results-header">
            <span className="results-count">
              {results.totalCount} cards found
              {results.searchTime && (
                <span className="search-time"> ({results.searchTime}ms)</span>
              )}
            </span>
          </div>

          {results.warnings && results.warnings.length > 0 && (
            <div className="search-warnings">
              {results.warnings.map((warning, index) => (
                <div key={index} className="warning">{warning}</div>
              ))}
            </div>
          )}

          <div className="cards-grid">
            {results.cards.map((card) => (
              <motion.div
                key={card.id}
                className="card-result"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onCardSelect?.(card)}
              >
                <div className="card-image">
                  <img src={card.imageUrl} alt={card.name} loading="lazy" />
                </div>
                <div className="card-info">
                  <div className="card-name">{card.name}</div>
                  <div className="card-cost">{card.manaCost}</div>
                  <div className="card-type">{card.type}</div>
                  {card.power !== undefined && card.toughness !== undefined && (
                    <div className="card-pt">{card.power}/{card.toughness}</div>
                  )}
                  <div className="card-rarity">{card.rarity}</div>
                  <div className="card-set">{card.set}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {results.hasMore && (
            <div className="load-more">
              <button onClick={() => {
                // Implement pagination
              }}>
                Load More Cards
              </button>
            </div>
          )}
        </div>
      )}

      {/* Search Syntax Help */}
      <div className="search-help">
        <details>
          <summary>Search Syntax Help</summary>
          <div className="help-content">
            <h4>Basic Search:</h4>
            <ul>
              <li><code>lightning bolt</code> - Search card names</li>
              <li><code>"exact phrase"</code> - Exact phrase matching</li>
            </ul>
            
            <h4>Field Searches:</h4>
            <ul>
              <li><code>c:red</code> or <code>color:red</code> - Cards with red in their color</li>
              <li><code>cmc:3</code> - Cards with converted mana cost 3</li>
              <li><code>cmc&gt;=4</code> - Cards with CMC 4 or higher</li>
              <li><code>t:creature</code> or <code>type:creature</code> - Creature cards</li>
              <li><code>o:flying</code> or <code>oracle:flying</code> - Cards with "flying" in text</li>
              <li><code>pow&gt;=4</code> - Creatures with power 4 or greater</li>
              <li><code>tou&lt;=2</code> - Creatures with toughness 2 or less</li>
              <li><code>r:rare</code> or <code>rarity:rare</code> - Rare cards</li>
              <li><code>s:war</code> or <code>set:war</code> - Cards from specific set</li>
              <li><code>a:"john doe"</code> or <code>artist:"john doe"</code> - Cards by artist</li>
            </ul>
            
            <h4>Boolean Operators:</h4>
            <ul>
              <li><code>c:red AND t:creature</code> - Red creatures</li>
              <li><code>c:blue OR c:black</code> - Blue or black cards</li>
              <li><code>t:creature NOT c:red</code> - Non-red creatures</li>
              <li><code>(c:red OR c:blue) AND cmc:3</code> - Red or blue cards with CMC 3</li>
            </ul>
          </div>
        </details>
      </div>
    </div>
  );
};

export default ScryfallSearchInterface;