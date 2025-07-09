import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/scryfall-advanced-search.css';

interface Card {
  id: string;
  name: string;
  cost: number;
  type: 'Familiar' | 'Flag';
  description: string;
  rarity: 'Common' | 'Uncommon' | 'Rare';
  elements: string[];
  keywords: string[];
  strength?: number;
  artist?: string;
}

interface SearchFilters {
  name: string;
  text: string;
  type: string;
  elements: {
    fire: boolean;
    water: boolean;
    earth: boolean;
    air: boolean;
    nether: boolean;
    aether: boolean;
  };
  elementMode: 'exactly' | 'including' | 'atMost';
  cost: {
    operator: 'equal' | 'less' | 'greater' | 'lessEqual' | 'greaterEqual';
    value: string;
  };
  strength: {
    operator: 'equal' | 'less' | 'greater' | 'lessEqual' | 'greaterEqual';
    value: string;
  };
  rarity: {
    common: boolean;
    uncommon: boolean;
    rare: boolean;
  };
  artist: string;
  keywords: string;
}

interface SearchPreferences {
  sortBy: 'name' | 'cost' | 'rarity' | 'type' | 'strength';
  sortOrder: 'asc' | 'desc';
  viewMode: 'grid' | 'list' | 'compact';
  resultsPerPage: number;
}

interface EnhancedCardSearchProps {
  cards: Card[];
  onSearchResults: (results: Card[]) => void;
  onFiltersChange?: (filters: SearchFilters) => void;
}

// KONIVRER elements with enhanced styling
const konivrElements = [
  { key: 'fire', label: 'Fire', symbol: '🜂', color: '#FF4500', bgColor: 'rgba(255, 69, 0, 0.1)' },
  { key: 'water', label: 'Water', symbol: '🜄', color: '#4169E1', bgColor: 'rgba(65, 105, 225, 0.1)' },
  { key: 'earth', label: 'Earth', symbol: '🜃', color: '#8B4513', bgColor: 'rgba(139, 69, 19, 0.1)' },
  { key: 'air', label: 'Air', symbol: '🜁', color: '#87CEEB', bgColor: 'rgba(135, 206, 235, 0.1)' },
  { key: 'nether', label: 'Nether', symbol: '□', color: '#2F2F2F', bgColor: 'rgba(47, 47, 47, 0.1)' },
  { key: 'aether', label: 'Aether', symbol: '○', color: '#FFD700', bgColor: 'rgba(255, 215, 0, 0.1)' }
];

const cardTypes = ['Familiar', 'Flag'];
const rarities = ['Common', 'Uncommon', 'Rare'];
const operators = [
  { value: 'equal', label: '=' },
  { value: 'less', label: '<' },
  { value: 'greater', label: '>' },
  { value: 'lessEqual', label: '≤' },
  { value: 'greaterEqual', label: '≥' }
];

const EnhancedCardSearch: React.FC<EnhancedCardSearchProps> = ({ 
  cards, 
  onSearchResults, 
  onFiltersChange 
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    name: '',
    text: '',
    type: '',
    elements: {
      fire: false,
      water: false,
      earth: false,
      air: false,
      nether: false,
      aether: false
    },
    elementMode: 'exactly',
    cost: { operator: 'equal', value: '' },
    strength: { operator: 'equal', value: '' },
    rarity: {
      common: false,
      uncommon: false,
      rare: false
    },
    artist: '',
    keywords: ''
  });

  const [preferences, setPreferences] = useState<SearchPreferences>({
    sortBy: 'name',
    sortOrder: 'asc',
    viewMode: 'grid',
    resultsPerPage: 20
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [savedSearches, setSavedSearches] = useState<{ name: string; filters: SearchFilters }[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [quickSearch, setQuickSearch] = useState('');
  const [showSyntaxHelp, setShowSyntaxHelp] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Debounced search function
  const debouncedSearch = useCallback((searchFilters: SearchFilters) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      setIsSearching(true);
      
      // Simulate search delay for better UX
      setTimeout(() => {
        performSearch(searchFilters);
        setIsSearching(false);
      }, 300);
    }, 300);
  }, []);

  // Advanced search logic with multiple filters
  const performSearch = useCallback((searchFilters: SearchFilters) => {
    let results = [...cards];

    // Name filter
    if (searchFilters.name.trim()) {
      const nameQuery = searchFilters.name.toLowerCase().trim();
      results = results.filter(card => 
        card.name.toLowerCase().includes(nameQuery)
      );
    }

    // Text filter (description and keywords)
    if (searchFilters.text.trim()) {
      const textQuery = searchFilters.text.toLowerCase().trim();
      results = results.filter(card => 
        card.description.toLowerCase().includes(textQuery) ||
        card.keywords.some(keyword => keyword.toLowerCase().includes(textQuery))
      );
    }

    // Type filter
    if (searchFilters.type) {
      results = results.filter(card => card.type === searchFilters.type);
    }

    // Element filter
    const selectedElements = Object.entries(searchFilters.elements)
      .filter(([_, selected]) => selected)
      .map(([key, _]) => {
        const element = konivrElements.find(e => e.key === key);
        return element?.label || key;
      });

    if (selectedElements.length > 0) {
      results = results.filter(card => {
        const cardElements = card.elements;
        
        switch (searchFilters.elementMode) {
          case 'exactly':
            return selectedElements.length === cardElements.length &&
                   selectedElements.every(e => cardElements.includes(e)) &&
                   cardElements.every(e => selectedElements.includes(e));
          case 'including':
            return selectedElements.every(e => cardElements.includes(e));
          case 'atMost':
            return cardElements.every(e => selectedElements.includes(e));
          default:
            return true;
        }
      });
    }

    // Cost filter
    if (searchFilters.cost.value.trim()) {
      const costValue = parseInt(searchFilters.cost.value);
      if (!isNaN(costValue)) {
        results = results.filter(card => {
          switch (searchFilters.cost.operator) {
            case 'equal': return card.cost === costValue;
            case 'less': return card.cost < costValue;
            case 'greater': return card.cost > costValue;
            case 'lessEqual': return card.cost <= costValue;
            case 'greaterEqual': return card.cost >= costValue;
            default: return true;
          }
        });
      }
    }

    // Strength filter (only for Familiars)
    if (searchFilters.strength.value.trim()) {
      const strengthValue = parseInt(searchFilters.strength.value);
      if (!isNaN(strengthValue)) {
        results = results.filter(card => {
          if (card.type === 'Flag') return false; // Flags don't have strength
          const cardStrength = card.strength || 0;
          
          switch (searchFilters.strength.operator) {
            case 'equal': return cardStrength === strengthValue;
            case 'less': return cardStrength < strengthValue;
            case 'greater': return cardStrength > strengthValue;
            case 'lessEqual': return cardStrength <= strengthValue;
            case 'greaterEqual': return cardStrength >= strengthValue;
            default: return true;
          }
        });
      }
    }

    // Rarity filter
    const selectedRarities = Object.entries(searchFilters.rarity)
      .filter(([_, selected]) => selected)
      .map(([key, _]) => key.charAt(0).toUpperCase() + key.slice(1));

    if (selectedRarities.length > 0) {
      results = results.filter(card => selectedRarities.includes(card.rarity));
    }

    // Artist filter
    if (searchFilters.artist.trim()) {
      const artistQuery = searchFilters.artist.toLowerCase().trim();
      results = results.filter(card => 
        card.artist?.toLowerCase().includes(artistQuery) || false
      );
    }

    // Keywords filter
    if (searchFilters.keywords.trim()) {
      const keywordQuery = searchFilters.keywords.toLowerCase().trim();
      results = results.filter(card => 
        card.keywords.some(keyword => keyword.toLowerCase().includes(keywordQuery))
      );
    }

    // Sort results
    results.sort((a, b) => {
      let comparison = 0;
      
      switch (preferences.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'cost':
          comparison = a.cost - b.cost;
          break;
        case 'rarity':
          const rarityOrder = { 'Common': 1, 'Uncommon': 2, 'Rare': 3 };
          comparison = rarityOrder[a.rarity] - rarityOrder[b.rarity];
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'strength':
          comparison = (a.strength || 0) - (b.strength || 0);
          break;
        default:
          comparison = a.name.localeCompare(b.name);
      }
      
      return preferences.sortOrder === 'desc' ? -comparison : comparison;
    });

    onSearchResults(results);
    onFiltersChange?.(searchFilters);
  }, [cards, preferences, onSearchResults, onFiltersChange]);

  // Quick search with syntax support
  const handleQuickSearch = useCallback((query: string) => {
    setQuickSearch(query);
    
    if (!query.trim()) {
      onSearchResults([]);
      return;
    }

    // Add to search history
    if (query.trim() && !searchHistory.includes(query.trim())) {
      setSearchHistory(prev => [query.trim(), ...prev.slice(0, 9)]);
    }

    // Parse syntax queries
    const tokens = query.toLowerCase().match(/(?:[^\s"]+|"[^"]*")+/g) || [];
    let tempFilters = { ...filters };
    let hasAdvancedSyntax = false;

    tokens.forEach(token => {
      const cleanToken = token.replace(/"/g, '');
      
      if (cleanToken.includes(':')) {
        const [field, value] = cleanToken.split(':', 2);
        hasAdvancedSyntax = true;
        
        switch (field) {
          case 'name':
          case 'n':
            tempFilters.name = value;
            break;
          case 'type':
          case 't':
            tempFilters.type = value.charAt(0).toUpperCase() + value.slice(1);
            break;
          case 'cost':
          case 'c':
            if (value.startsWith('>=')) {
              tempFilters.cost = { operator: 'greaterEqual', value: value.slice(2) };
            } else if (value.startsWith('<=')) {
              tempFilters.cost = { operator: 'lessEqual', value: value.slice(2) };
            } else if (value.startsWith('>')) {
              tempFilters.cost = { operator: 'greater', value: value.slice(1) };
            } else if (value.startsWith('<')) {
              tempFilters.cost = { operator: 'less', value: value.slice(1) };
            } else {
              tempFilters.cost = { operator: 'equal', value };
            }
            break;
          case 'element':
          case 'e':
            const element = konivrElements.find(e => e.label.toLowerCase() === value);
            if (element) {
              tempFilters.elements[element.key as keyof typeof tempFilters.elements] = true;
            }
            break;
          case 'rarity':
          case 'r':
            if (['common', 'uncommon', 'rare'].includes(value)) {
              tempFilters.rarity[value as keyof typeof tempFilters.rarity] = true;
            }
            break;
          case 'artist':
          case 'a':
            tempFilters.artist = value;
            break;
          case 'keyword':
          case 'k':
            tempFilters.keywords = value;
            break;
        }
      } else if (!hasAdvancedSyntax) {
        // General search
        tempFilters.name = query;
      }
    });

    setFilters(tempFilters);
    debouncedSearch(tempFilters);
  }, [filters, searchHistory, debouncedSearch]);

  // Update filters
  const updateFilter = useCallback((path: string, value: any) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      const keys = path.split('.');
      let current: any = newFilters;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return newFilters;
    });
  }, []);

  // Effect to trigger search when filters change
  useEffect(() => {
    debouncedSearch(filters);
  }, [filters, debouncedSearch]);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    const clearedFilters: SearchFilters = {
      name: '',
      text: '',
      type: '',
      elements: {
        fire: false,
        water: false,
        earth: false,
        air: false,
        nether: false,
        aether: false
      },
      elementMode: 'exactly',
      cost: { operator: 'equal', value: '' },
      strength: { operator: 'equal', value: '' },
      rarity: {
        common: false,
        uncommon: false,
        rare: false
      },
      artist: '',
      keywords: ''
    };
    
    setFilters(clearedFilters);
    setQuickSearch('');
    setCurrentPage(1);
    onSearchResults(cards);
  }, [cards, onSearchResults]);

  // Save current search
  const saveCurrentSearch = useCallback(() => {
    const name = prompt('Enter a name for this search:');
    if (name && name.trim()) {
      setSavedSearches(prev => [
        ...prev.filter(s => s.name !== name.trim()),
        { name: name.trim(), filters }
      ]);
    }
  }, [filters]);

  // Load saved search
  const loadSavedSearch = useCallback((savedFilters: SearchFilters) => {
    setFilters(savedFilters);
    setCurrentPage(1);
  }, []);

  // Render quick search bar
  const renderQuickSearch = () => (
    <div className="quick-search-container">
      <div className="search-input-wrapper">
        <input
          ref={searchInputRef}
          type="text"
          value={quickSearch}
          onChange={(e) => handleQuickSearch(e.target.value)}
          placeholder="Quick search... (try: name:fire, cost:>=3, type:familiar)"
          className="quick-search-input"
          disabled={isSearching}
        />
        <div className="search-input-actions">
          {isSearching && <div className="search-spinner" />}
          <button
            type="button"
            onClick={() => setShowSyntaxHelp(!showSyntaxHelp)}
            className="syntax-help-button"
            title="Search syntax help"
          >
            ?
          </button>
          {quickSearch && (
            <button
              type="button"
              onClick={() => {
                setQuickSearch('');
                clearAllFilters();
              }}
              className="clear-search-button"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>
      
      {/* Search History */}
      {searchHistory.length > 0 && (
        <div className="search-history">
          <span className="search-history-label">Recent:</span>
          {searchHistory.slice(0, 5).map((query, index) => (
            <button
              key={index}
              onClick={() => handleQuickSearch(query)}
              className="search-history-item"
            >
              {query}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // Render syntax help
  const renderSyntaxHelp = () => (
    <AnimatePresence>
      {showSyntaxHelp && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="syntax-help"
        >
          <h4>Search Syntax</h4>
          <div className="syntax-examples">
            <div className="syntax-group">
              <strong>Basic:</strong>
              <code>fire</code> - Search in name, description, keywords
            </div>
            <div className="syntax-group">
              <strong>Name:</strong>
              <code>name:dragon</code> or <code>n:dragon</code>
            </div>
            <div className="syntax-group">
              <strong>Type:</strong>
              <code>type:familiar</code> or <code>t:familiar</code>
            </div>
            <div className="syntax-group">
              <strong>Cost:</strong>
              <code>cost:3</code>, <code>c:{'>='}5</code>, <code>c:{'<'}2</code>
            </div>
            <div className="syntax-group">
              <strong>Element:</strong>
              <code>element:fire</code> or <code>e:water</code>
            </div>
            <div className="syntax-group">
              <strong>Rarity:</strong>
              <code>rarity:rare</code> or <code>r:common</code>
            </div>
            <div className="syntax-group">
              <strong>Combine:</strong>
              <code>type:familiar cost:{'>='}3 element:fire</code>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Render advanced filters
  const renderAdvancedFilters = () => (
    <AnimatePresence>
      {showAdvancedFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="advanced-filters"
        >
          <div className="filters-grid">
            {/* Name Filter */}
            <div className="filter-group">
              <label className="filter-label">Card Name</label>
              <input
                type="text"
                value={filters.name}
                onChange={(e) => updateFilter('name', e.target.value)}
                placeholder="Enter card name..."
                className="filter-input"
              />
            </div>

            {/* Text Filter */}
            <div className="filter-group">
              <label className="filter-label">Text</label>
              <input
                type="text"
                value={filters.text}
                onChange={(e) => updateFilter('text', e.target.value)}
                placeholder="Search in description..."
                className="filter-input"
              />
            </div>

            {/* Type Filter */}
            <div className="filter-group">
              <label className="filter-label">Type</label>
              <select
                value={filters.type}
                onChange={(e) => updateFilter('type', e.target.value)}
                className="filter-select"
              >
                <option value="">All Types</option>
                {cardTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Cost Filter */}
            <div className="filter-group">
              <label className="filter-label">Cost</label>
              <div className="filter-row">
                <select
                  value={filters.cost.operator}
                  onChange={(e) => updateFilter('cost.operator', e.target.value)}
                  className="filter-select-small"
                >
                  {operators.map(op => (
                    <option key={op.value} value={op.value}>{op.label}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={filters.cost.value}
                  onChange={(e) => updateFilter('cost.value', e.target.value)}
                  placeholder="Value"
                  className="filter-input-small"
                  min="0"
                />
              </div>
            </div>

            {/* Strength Filter */}
            <div className="filter-group">
              <label className="filter-label">Strength</label>
              <div className="filter-row">
                <select
                  value={filters.strength.operator}
                  onChange={(e) => updateFilter('strength.operator', e.target.value)}
                  className="filter-select-small"
                >
                  {operators.map(op => (
                    <option key={op.value} value={op.value}>{op.label}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={filters.strength.value}
                  onChange={(e) => updateFilter('strength.value', e.target.value)}
                  placeholder="Value"
                  className="filter-input-small"
                  min="0"
                />
              </div>
            </div>

            {/* Artist Filter */}
            <div className="filter-group">
              <label className="filter-label">Artist</label>
              <input
                type="text"
                value={filters.artist}
                onChange={(e) => updateFilter('artist', e.target.value)}
                placeholder="Artist name..."
                className="filter-input"
              />
            </div>
          </div>

          {/* Elements Filter */}
          <div className="filter-group">
            <label className="filter-label">Elements</label>
            <div className="elements-container">
              <div className="elements-grid">
                {konivrElements.map(element => (
                  <label
                    key={element.key}
                    className={`element-checkbox ${filters.elements[element.key as keyof typeof filters.elements] ? 'active' : ''}`}
                    style={{
                      backgroundColor: filters.elements[element.key as keyof typeof filters.elements] 
                        ? element.bgColor 
                        : 'transparent',
                      borderColor: element.color
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={filters.elements[element.key as keyof typeof filters.elements]}
                      onChange={(e) => updateFilter(`elements.${element.key}`, e.target.checked)}
                    />
                    <span className="element-symbol" style={{ color: element.color }}>
                      {element.symbol}
                    </span>
                    <span className="element-name">{element.label}</span>
                  </label>
                ))}
              </div>
              <div className="element-mode">
                <select
                  value={filters.elementMode}
                  onChange={(e) => updateFilter('elementMode', e.target.value)}
                  className="filter-select"
                >
                  <option value="exactly">Exactly these elements</option>
                  <option value="including">Including these elements</option>
                  <option value="atMost">At most these elements</option>
                </select>
              </div>
            </div>
          </div>

          {/* Rarity Filter */}
          <div className="filter-group">
            <label className="filter-label">Rarity</label>
            <div className="rarity-checkboxes">
              {rarities.map(rarity => (
                <label key={rarity} className="rarity-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.rarity[rarity.toLowerCase() as keyof typeof filters.rarity]}
                    onChange={(e) => updateFilter(`rarity.${rarity.toLowerCase()}`, e.target.checked)}
                  />
                  <span className={`rarity-label rarity-${rarity.toLowerCase()}`}>
                    {rarity}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Render search controls
  const renderSearchControls = () => (
    <div className="search-controls">
      <div className="search-actions">
        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className={`toggle-button ${showAdvancedFilters ? 'active' : ''}`}
        >
          <span className="toggle-icon">⚙️</span>
          Advanced Filters
        </button>
        
        <button
          onClick={saveCurrentSearch}
          className="action-button"
          disabled={!Object.values(filters).some(v => 
            typeof v === 'string' ? v.trim() : 
            typeof v === 'object' && v !== null ? Object.values(v).some(Boolean) : 
            false
          )}
        >
          <span className="action-icon">💾</span>
          Save Search
        </button>
        
        <button
          onClick={clearAllFilters}
          className="action-button"
        >
          <span className="action-icon">🗑️</span>
          Clear All
        </button>
      </div>

      <div className="search-preferences">
        <div className="preference-group">
          <label>Sort by:</label>
          <select
            value={preferences.sortBy}
            onChange={(e) => setPreferences(prev => ({ 
              ...prev, 
              sortBy: e.target.value as SearchPreferences['sortBy'] 
            }))}
            className="preference-select"
          >
            <option value="name">Name</option>
            <option value="cost">Cost</option>
            <option value="rarity">Rarity</option>
            <option value="type">Type</option>
            <option value="strength">Strength</option>
          </select>
        </div>

        <button
          onClick={() => setPreferences(prev => ({ 
            ...prev, 
            sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc' 
          }))}
          className="sort-order-button"
          title={`Sort ${preferences.sortOrder === 'asc' ? 'descending' : 'ascending'}`}
        >
          {preferences.sortOrder === 'asc' ? '↑' : '↓'}
        </button>

        <div className="view-mode-buttons">
          {(['grid', 'list', 'compact'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setPreferences(prev => ({ ...prev, viewMode: mode }))}
              className={`view-mode-button ${preferences.viewMode === mode ? 'active' : ''}`}
              title={`${mode} view`}
            >
              {mode === 'grid' ? '⊞' : mode === 'list' ? '☰' : '▤'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Render saved searches
  const renderSavedSearches = () => (
    savedSearches.length > 0 && (
      <div className="saved-searches">
        <h4>Saved Searches</h4>
        <div className="saved-searches-list">
          {savedSearches.map((saved, index) => (
            <div key={index} className="saved-search-item">
              <button
                onClick={() => loadSavedSearch(saved.filters)}
                className="saved-search-button"
              >
                {saved.name}
              </button>
              <button
                onClick={() => setSavedSearches(prev => prev.filter((_, i) => i !== index))}
                className="delete-saved-search"
                title="Delete saved search"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  );

  return (
    <div className="enhanced-card-search">
      <div className="search-header">
        <h2 className="search-title">
          <span className="search-icon">🔍</span>
          Advanced Card Search
        </h2>
      </div>

      {renderQuickSearch()}
      {renderSyntaxHelp()}
      {renderSearchControls()}
      {renderAdvancedFilters()}
      {renderSavedSearches()}

      {isSearching && (
        <div className="search-loading">
          <div className="loading-spinner" />
          <span>Searching cards...</span>
        </div>
      )}
    </div>
  );
};

export default EnhancedCardSearch;