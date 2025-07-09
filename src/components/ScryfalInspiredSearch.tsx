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

interface SearchQuery {
  text: string;
  filters: {
    name: string;
    oracle: string;
    type: string;
    elements: {
      fire: boolean;
      water: boolean;
      earth: boolean;
      air: boolean;
      nether: boolean;
      aether: boolean;
    };
    elementMode: 'exactly' | 'including' | 'atMost' | 'excluding';
    cost: {
      operator: '=' | '<' | '>' | '<=' | '>=' | '!';
      value: string;
    };
    strength: {
      operator: '=' | '<' | '>' | '<=' | '>=' | '!';
      value: string;
    };
    rarity: {
      common: boolean;
      uncommon: boolean;
      rare: boolean;
    };
    artist: string;
    keywords: string;
    format: 'standard' | 'extended' | 'legacy' | 'all';
    is: {
      familiar: boolean;
      flag: boolean;
      multiElement: boolean;
      vanilla: boolean;
      legendary: boolean;
    };
  };
  sort: {
    by: 'name' | 'cost' | 'rarity' | 'type' | 'strength' | 'released' | 'artist';
    direction: 'asc' | 'desc';
  };
  display: {
    mode: 'images' | 'text' | 'full' | 'checklist';
    unique: 'cards' | 'art' | 'prints';
    showExtras: boolean;
  };
}

interface ScryfalInspiredSearchProps {
  cards: Card[];
  onSearchResults: (results: Card[], query: SearchQuery) => void;
  onQueryChange?: (query: SearchQuery) => void;
}

// Enhanced KONIVRER elements with Scryfall-style properties
const konivrElements = [
  { 
    key: 'fire', 
    label: 'Fire', 
    symbol: '🜂', 
    color: '#FF4500', 
    bgColor: 'rgba(255, 69, 0, 0.1)',
    shorthand: 'F',
    description: 'Aggressive and direct damage'
  },
  { 
    key: 'water', 
    label: 'Water', 
    symbol: '🜄', 
    color: '#4169E1', 
    bgColor: 'rgba(65, 105, 225, 0.1)',
    shorthand: 'W',
    description: 'Control and manipulation'
  },
  { 
    key: 'earth', 
    label: 'Earth', 
    symbol: '🜃', 
    color: '#8B4513', 
    bgColor: 'rgba(139, 69, 19, 0.1)',
    shorthand: 'E',
    description: 'Defense and stability'
  },
  { 
    key: 'air', 
    label: 'Air', 
    symbol: '🜁', 
    color: '#87CEEB', 
    bgColor: 'rgba(135, 206, 235, 0.1)',
    shorthand: 'A',
    description: 'Speed and evasion'
  },
  { 
    key: 'nether', 
    label: 'Nether', 
    symbol: '□', 
    color: '#2F2F2F', 
    bgColor: 'rgba(47, 47, 47, 0.1)',
    shorthand: 'N',
    description: 'Dark magic and sacrifice'
  },
  { 
    key: 'aether', 
    label: 'Aether', 
    symbol: '○', 
    color: '#FFD700', 
    bgColor: 'rgba(255, 215, 0, 0.1)',
    shorthand: 'T',
    description: 'Pure energy and transcendence'
  }
];

// Scryfall-inspired search syntax patterns
const searchPatterns = [
  { pattern: /^name:(.+)$/i, field: 'name', description: 'Card name contains text' },
  { pattern: /^n:(.+)$/i, field: 'name', description: 'Card name (shorthand)' },
  { pattern: /^oracle:(.+)$/i, field: 'oracle', description: 'Rules text contains' },
  { pattern: /^o:(.+)$/i, field: 'oracle', description: 'Rules text (shorthand)' },
  { pattern: /^type:(.+)$/i, field: 'type', description: 'Type line contains' },
  { pattern: /^t:(.+)$/i, field: 'type', description: 'Type (shorthand)' },
  { pattern: /^element:([FWEANTU])$/i, field: 'element', description: 'Has element' },
  { pattern: /^e:([FWEANTU])$/i, field: 'element', description: 'Element (shorthand)' },
  { pattern: /^cost([<>=!]+)(\d+)$/i, field: 'cost', description: 'Cost comparison' },
  { pattern: /^c([<>=!]+)(\d+)$/i, field: 'cost', description: 'Cost (shorthand)' },
  { pattern: /^strength([<>=!]+)(\d+)$/i, field: 'strength', description: 'Strength comparison' },
  { pattern: /^s([<>=!]+)(\d+)$/i, field: 'strength', description: 'Strength (shorthand)' },
  { pattern: /^rarity:([cur])$/i, field: 'rarity', description: 'Rarity (c/u/r)' },
  { pattern: /^r:([cur])$/i, field: 'rarity', description: 'Rarity (shorthand)' },
  { pattern: /^artist:(.+)$/i, field: 'artist', description: 'Artist name' },
  { pattern: /^a:(.+)$/i, field: 'artist', description: 'Artist (shorthand)' },
  { pattern: /^keyword:(.+)$/i, field: 'keyword', description: 'Has keyword' },
  { pattern: /^k:(.+)$/i, field: 'keyword', description: 'Keyword (shorthand)' },
  { pattern: /^is:(.+)$/i, field: 'is', description: 'Card property' },
  { pattern: /^format:(.+)$/i, field: 'format', description: 'Legal in format' },
  { pattern: /^f:(.+)$/i, field: 'format', description: 'Format (shorthand)' }
];

const ScryfalInspiredSearch: React.FC<ScryfalInspiredSearchProps> = ({ 
  cards, 
  onSearchResults, 
  onQueryChange 
}) => {
  const [query, setQuery] = useState<SearchQuery>({
    text: '',
    filters: {
      name: '',
      oracle: '',
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
      cost: { operator: '=', value: '' },
      strength: { operator: '=', value: '' },
      rarity: {
        common: false,
        uncommon: false,
        rare: false
      },
      artist: '',
      keywords: '',
      format: 'all',
      is: {
        familiar: false,
        flag: false,
        multiElement: false,
        vanilla: false,
        legendary: false
      }
    },
    sort: {
      by: 'name',
      direction: 'asc'
    },
    display: {
      mode: 'images',
      unique: 'cards',
      showExtras: false
    }
  });

  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [savedQueries, setSavedQueries] = useState<{ name: string; query: SearchQuery }[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showSyntaxHelp, setShowSyntaxHelp] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchStats, setSearchStats] = useState({ total: 0, filtered: 0, time: 0 });
  const [autoComplete, setAutoComplete] = useState<string[]>([]);
  const [showAutoComplete, setShowAutoComplete] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Parse search text into structured query
  const parseSearchText = useCallback((text: string): Partial<SearchQuery['filters']> => {
    const filters: Partial<SearchQuery['filters']> = {};
    const tokens = text.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
    
    tokens.forEach(token => {
      const cleanToken = token.replace(/"/g, '');
      let matched = false;

      for (const { pattern, field } of searchPatterns) {
        const match = cleanToken.match(pattern);
        if (match) {
          matched = true;
          
          switch (field) {
            case 'name':
              filters.name = match[1];
              break;
            case 'oracle':
              filters.oracle = match[1];
              break;
            case 'type':
              filters.type = match[1];
              break;
            case 'element':
              const elementKey = konivrElements.find(e => 
                e.shorthand.toLowerCase() === match[1].toLowerCase()
              )?.key;
              if (elementKey && filters.elements) {
                filters.elements[elementKey as keyof typeof filters.elements] = true;
              }
              break;
            case 'cost':
              if (filters.cost) {
                filters.cost.operator = match[1] as any;
                filters.cost.value = match[2];
              }
              break;
            case 'strength':
              if (filters.strength) {
                filters.strength.operator = match[1] as any;
                filters.strength.value = match[2];
              }
              break;
            case 'rarity':
              if (filters.rarity) {
                const rarityMap = { c: 'common', u: 'uncommon', r: 'rare' };
                const rarity = rarityMap[match[1].toLowerCase() as keyof typeof rarityMap];
                if (rarity) {
                  filters.rarity[rarity as keyof typeof filters.rarity] = true;
                }
              }
              break;
            case 'artist':
              filters.artist = match[1];
              break;
            case 'keyword':
              filters.keywords = match[1];
              break;
            case 'is':
              if (filters.is) {
                const property = match[1].toLowerCase();
                if (property in filters.is) {
                  filters.is[property as keyof typeof filters.is] = true;
                }
              }
              break;
            case 'format':
              filters.format = match[1].toLowerCase() as any;
              break;
          }
          break;
        }
      }

      // If no pattern matched, treat as general search
      if (!matched && !filters.name) {
        filters.name = cleanToken;
      }
    });

    return filters;
  }, []);

  // Generate autocomplete suggestions
  const generateAutoComplete = useCallback((text: string): string[] => {
    const suggestions: string[] = [];
    const lastToken = text.split(' ').pop() || '';
    
    if (lastToken.includes(':')) {
      const [prefix, value] = lastToken.split(':', 2);
      
      switch (prefix.toLowerCase()) {
        case 'type':
        case 't':
          ['Familiar', 'Flag'].forEach(type => {
            if (type.toLowerCase().includes(value.toLowerCase())) {
              suggestions.push(`${prefix}:${type}`);
            }
          });
          break;
        case 'element':
        case 'e':
          konivrElements.forEach(element => {
            if (element.label.toLowerCase().includes(value.toLowerCase()) ||
                element.shorthand.toLowerCase().includes(value.toLowerCase())) {
              suggestions.push(`${prefix}:${element.shorthand}`);
            }
          });
          break;
        case 'rarity':
        case 'r':
          ['c', 'u', 'r'].forEach(rarity => {
            if (rarity.includes(value.toLowerCase())) {
              suggestions.push(`${prefix}:${rarity}`);
            }
          });
          break;
        case 'is':
          ['familiar', 'flag', 'multiElement', 'vanilla', 'legendary'].forEach(prop => {
            if (prop.toLowerCase().includes(value.toLowerCase())) {
              suggestions.push(`${prefix}:${prop}`);
            }
          });
          break;
        case 'format':
        case 'f':
          ['standard', 'extended', 'legacy', 'all'].forEach(format => {
            if (format.toLowerCase().includes(value.toLowerCase())) {
              suggestions.push(`${prefix}:${format}`);
            }
          });
          break;
      }
    } else {
      // Suggest field prefixes
      const prefixes = ['name:', 'oracle:', 'type:', 'element:', 'cost:', 'strength:', 'rarity:', 'artist:', 'keyword:', 'is:', 'format:'];
      prefixes.forEach(prefix => {
        if (prefix.includes(lastToken.toLowerCase())) {
          suggestions.push(prefix);
        }
      });
      
      // Suggest card names
      cards.forEach(card => {
        if (card.name.toLowerCase().includes(lastToken.toLowerCase()) && suggestions.length < 10) {
          suggestions.push(card.name);
        }
      });
    }
    
    return suggestions.slice(0, 8);
  }, [cards]);

  // Advanced search with Scryfall-like filtering
  const performSearch = useCallback((searchQuery: SearchQuery) => {
    const startTime = Date.now();
    setIsSearching(true);
    
    setTimeout(() => {
      let results = [...cards];
      const filters = searchQuery.filters;

      // Name filter
      if (filters.name) {
        const nameQuery = filters.name.toLowerCase();
        results = results.filter(card => 
          card.name.toLowerCase().includes(nameQuery)
        );
      }

      // Oracle text filter (description + keywords)
      if (filters.oracle) {
        const oracleQuery = filters.oracle.toLowerCase();
        results = results.filter(card => 
          card.description.toLowerCase().includes(oracleQuery) ||
          card.keywords.some(keyword => keyword.toLowerCase().includes(oracleQuery))
        );
      }

      // Type filter
      if (filters.type) {
        const typeQuery = filters.type.toLowerCase();
        results = results.filter(card => 
          card.type.toLowerCase().includes(typeQuery)
        );
      }

      // Element filter with advanced modes
      const selectedElements = Object.entries(filters.elements)
        .filter(([_, selected]) => selected)
        .map(([key, _]) => {
          const element = konivrElements.find(e => e.key === key);
          return element?.label || key;
        });

      if (selectedElements.length > 0) {
        results = results.filter(card => {
          const cardElements = card.elements;
          
          switch (filters.elementMode) {
            case 'exactly':
              return selectedElements.length === cardElements.length &&
                     selectedElements.every(e => cardElements.includes(e)) &&
                     cardElements.every(e => selectedElements.includes(e));
            case 'including':
              return selectedElements.every(e => cardElements.includes(e));
            case 'atMost':
              return cardElements.every(e => selectedElements.includes(e));
            case 'excluding':
              return !selectedElements.some(e => cardElements.includes(e));
            default:
              return true;
          }
        });
      }

      // Cost filter with operators
      if (filters.cost.value) {
        const costValue = parseInt(filters.cost.value);
        if (!isNaN(costValue)) {
          results = results.filter(card => {
            switch (filters.cost.operator) {
              case '=': return card.cost === costValue;
              case '<': return card.cost < costValue;
              case '>': return card.cost > costValue;
              case '<=': return card.cost <= costValue;
              case '>=': return card.cost >= costValue;
              case '!': return card.cost !== costValue;
              default: return true;
            }
          });
        }
      }

      // Strength filter (Familiars only)
      if (filters.strength.value) {
        const strengthValue = parseInt(filters.strength.value);
        if (!isNaN(strengthValue)) {
          results = results.filter(card => {
            if (card.type === 'Flag') return false;
            const cardStrength = card.strength || 0;
            
            switch (filters.strength.operator) {
              case '=': return cardStrength === strengthValue;
              case '<': return cardStrength < strengthValue;
              case '>': return cardStrength > strengthValue;
              case '<=': return cardStrength <= strengthValue;
              case '>=': return cardStrength >= strengthValue;
              case '!': return cardStrength !== strengthValue;
              default: return true;
            }
          });
        }
      }

      // Rarity filter
      const selectedRarities = Object.entries(filters.rarity)
        .filter(([_, selected]) => selected)
        .map(([key, _]) => key.charAt(0).toUpperCase() + key.slice(1));

      if (selectedRarities.length > 0) {
        results = results.filter(card => selectedRarities.includes(card.rarity));
      }

      // Artist filter
      if (filters.artist) {
        const artistQuery = filters.artist.toLowerCase();
        results = results.filter(card => 
          card.artist?.toLowerCase().includes(artistQuery) || false
        );
      }

      // Keywords filter
      if (filters.keywords) {
        const keywordQuery = filters.keywords.toLowerCase();
        results = results.filter(card => 
          card.keywords.some(keyword => keyword.toLowerCase().includes(keywordQuery))
        );
      }

      // "Is" filters
      if (filters.is.familiar) {
        results = results.filter(card => card.type === 'Familiar');
      }
      if (filters.is.flag) {
        results = results.filter(card => card.type === 'Flag');
      }
      if (filters.is.multiElement) {
        results = results.filter(card => card.elements.length > 1);
      }
      if (filters.is.vanilla) {
        results = results.filter(card => card.keywords.length === 0);
      }
      if (filters.is.legendary) {
        results = results.filter(card => card.keywords.includes('Legendary'));
      }

      // Sort results
      results.sort((a, b) => {
        let comparison = 0;
        
        switch (searchQuery.sort.by) {
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
          case 'artist':
            comparison = (a.artist || '').localeCompare(b.artist || '');
            break;
          default:
            comparison = a.name.localeCompare(b.name);
        }
        
        return searchQuery.sort.direction === 'desc' ? -comparison : comparison;
      });

      const endTime = Date.now();
      setSearchStats({
        total: cards.length,
        filtered: results.length,
        time: endTime - startTime
      });

      setIsSearching(false);
      onSearchResults(results, searchQuery);
    }, 200);
  }, [cards, onSearchResults]);

  // Handle search text change with debouncing
  const handleSearchTextChange = useCallback((text: string) => {
    setQuery(prev => ({ ...prev, text }));
    
    // Generate autocomplete
    const suggestions = generateAutoComplete(text);
    setAutoComplete(suggestions);
    setShowAutoComplete(suggestions.length > 0 && text.length > 0);
    
    // Parse and merge filters
    const parsedFilters = parseSearchText(text);
    const newQuery = {
      ...query,
      text,
      filters: { ...query.filters, ...parsedFilters }
    };
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      performSearch(newQuery);
      onQueryChange?.(newQuery);
      
      // Add to search history
      if (text.trim() && !searchHistory.includes(text.trim())) {
        setSearchHistory(prev => [text.trim(), ...prev.slice(0, 9)]);
      }
    }, 300);
  }, [query, generateAutoComplete, parseSearchText, performSearch, onQueryChange, searchHistory]);

  // Update filters
  const updateFilter = useCallback((path: string, value: any) => {
    setQuery(prev => {
      const newQuery = { ...prev };
      const keys = path.split('.');
      let current: any = newQuery;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      
      // Rebuild search text from filters
      const textParts: string[] = [];
      if (newQuery.filters.name) textParts.push(`name:"${newQuery.filters.name}"`);
      if (newQuery.filters.oracle) textParts.push(`oracle:"${newQuery.filters.oracle}"`);
      if (newQuery.filters.type) textParts.push(`type:"${newQuery.filters.type}"`);
      if (newQuery.filters.artist) textParts.push(`artist:"${newQuery.filters.artist}"`);
      if (newQuery.filters.keywords) textParts.push(`keyword:"${newQuery.filters.keywords}"`);
      
      // Add element filters
      Object.entries(newQuery.filters.elements).forEach(([key, selected]) => {
        if (selected) {
          const element = konivrElements.find(e => e.key === key);
          if (element) textParts.push(`e:${element.shorthand}`);
        }
      });
      
      // Add cost filter
      if (newQuery.filters.cost.value) {
        textParts.push(`c${newQuery.filters.cost.operator}${newQuery.filters.cost.value}`);
      }
      
      // Add strength filter
      if (newQuery.filters.strength.value) {
        textParts.push(`s${newQuery.filters.strength.operator}${newQuery.filters.strength.value}`);
      }
      
      // Add rarity filters
      Object.entries(newQuery.filters.rarity).forEach(([key, selected]) => {
        if (selected) {
          const rarityMap = { common: 'c', uncommon: 'u', rare: 'r' };
          textParts.push(`r:${rarityMap[key as keyof typeof rarityMap]}`);
        }
      });
      
      // Add "is" filters
      Object.entries(newQuery.filters.is).forEach(([key, selected]) => {
        if (selected) {
          textParts.push(`is:${key}`);
        }
      });
      
      newQuery.text = textParts.join(' ');
      return newQuery;
    });
  }, []);

  // Save current query
  const saveQuery = useCallback(() => {
    const name = prompt('Enter a name for this search:');
    if (name && name.trim()) {
      setSavedQueries(prev => [
        ...prev.filter(q => q.name !== name.trim()),
        { name: name.trim(), query }
      ]);
    }
  }, [query]);

  // Load saved query
  const loadQuery = useCallback((savedQuery: SearchQuery) => {
    setQuery(savedQuery);
    performSearch(savedQuery);
  }, [performSearch]);

  // Clear all filters
  const clearAll = useCallback(() => {
    const clearedQuery: SearchQuery = {
      text: '',
      filters: {
        name: '',
        oracle: '',
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
        cost: { operator: '=', value: '' },
        strength: { operator: '=', value: '' },
        rarity: {
          common: false,
          uncommon: false,
          rare: false
        },
        artist: '',
        keywords: '',
        format: 'all',
        is: {
          familiar: false,
          flag: false,
          multiElement: false,
          vanilla: false,
          legendary: false
        }
      },
      sort: {
        by: 'name',
        direction: 'asc'
      },
      display: {
        mode: 'images',
        unique: 'cards',
        showExtras: false
      }
    };
    
    setQuery(clearedQuery);
    setShowAutoComplete(false);
    performSearch(clearedQuery);
  }, [performSearch]);

  // Initialize with all cards
  useEffect(() => {
    performSearch(query);
  }, []);

  // Render search input with autocomplete
  const renderSearchInput = () => (
    <div className="scryfall-search-input-container">
      <div className="search-input-wrapper">
        <input
          ref={searchInputRef}
          type="text"
          value={query.text}
          onChange={(e) => handleSearchTextChange(e.target.value)}
          placeholder="Search for cards... (try: name:fire, e:F, cost>=3, is:familiar)"
          className="scryfall-search-input"
          onFocus={() => setShowAutoComplete(autoComplete.length > 0)}
          onBlur={() => setTimeout(() => setShowAutoComplete(false), 200)}
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
          {query.text && (
            <button
              type="button"
              onClick={clearAll}
              className="clear-search-button"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>
      
      {/* Autocomplete dropdown */}
      <AnimatePresence>
        {showAutoComplete && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="autocomplete-dropdown"
          >
            {autoComplete.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  const words = query.text.split(' ');
                  words[words.length - 1] = suggestion;
                  handleSearchTextChange(words.join(' ') + ' ');
                  searchInputRef.current?.focus();
                }}
                className="autocomplete-item"
              >
                {suggestion}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Search history */}
      {searchHistory.length > 0 && (
        <div className="search-history">
          <span className="search-history-label">Recent:</span>
          {searchHistory.slice(0, 5).map((historyQuery, index) => (
            <button
              key={index}
              onClick={() => handleSearchTextChange(historyQuery)}
              className="search-history-item"
            >
              {historyQuery}
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
          className="scryfall-syntax-help"
        >
          <h4>Search Syntax Reference</h4>
          <div className="syntax-categories">
            <div className="syntax-category">
              <h5>Basic Search</h5>
              <div className="syntax-examples">
                <div><code>fire</code> - Search in name, text, and keywords</div>
                <div><code>"exact phrase"</code> - Search for exact phrase</div>
              </div>
            </div>
            
            <div className="syntax-category">
              <h5>Card Properties</h5>
              <div className="syntax-examples">
                <div><code>name:dragon</code> or <code>n:dragon</code> - Card name</div>
                <div><code>oracle:draw</code> or <code>o:draw</code> - Rules text</div>
                <div><code>type:familiar</code> or <code>t:familiar</code> - Card type</div>
                <div><code>artist:smith</code> or <code>a:smith</code> - Artist name</div>
              </div>
            </div>
            
            <div className="syntax-category">
              <h5>Elements & Stats</h5>
              <div className="syntax-examples">
                <div><code>element:F</code> or <code>e:F</code> - Has Fire element</div>
                <div><code>cost=3</code> or <code>c=3</code> - Exact cost</div>
                <div><code>cost&gt;=5</code> or <code>c&gt;=5</code> - Cost 5 or more</div>
                <div><code>strength&lt;2</code> or <code>s&lt;2</code> - Strength less than 2</div>
              </div>
            </div>
            
            <div className="syntax-category">
              <h5>Advanced Filters</h5>
              <div className="syntax-examples">
                <div><code>rarity:r</code> or <code>r:r</code> - Rare cards</div>
                <div><code>is:familiar</code> - Only Familiars</div>
                <div><code>is:multiElement</code> - Multi-element cards</div>
                <div><code>is:vanilla</code> - No keywords</div>
                <div><code>format:standard</code> - Legal in format</div>
              </div>
            </div>
            
            <div className="syntax-category">
              <h5>Element Shortcuts</h5>
              <div className="element-shortcuts">
                {konivrElements.map(element => (
                  <div key={element.key} className="element-shortcut">
                    <span className="element-symbol" style={{ color: element.color }}>
                      {element.symbol}
                    </span>
                    <code>{element.shorthand}</code>
                    <span>{element.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Render advanced filters panel
  const renderAdvancedFilters = () => (
    <AnimatePresence>
      {showAdvanced && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="scryfall-advanced-panel"
        >
          <div className="advanced-filters-grid">
            {/* Text Filters */}
            <div className="filter-section">
              <h5>Text Filters</h5>
              <div className="filter-group">
                <label>Card Name</label>
                <input
                  type="text"
                  value={query.filters.name}
                  onChange={(e) => updateFilter('filters.name', e.target.value)}
                  placeholder="Enter card name..."
                />
              </div>
              <div className="filter-group">
                <label>Rules Text</label>
                <input
                  type="text"
                  value={query.filters.oracle}
                  onChange={(e) => updateFilter('filters.oracle', e.target.value)}
                  placeholder="Search in rules text..."
                />
              </div>
              <div className="filter-group">
                <label>Type</label>
                <select
                  value={query.filters.type}
                  onChange={(e) => updateFilter('filters.type', e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="Familiar">Familiar</option>
                  <option value="Flag">Flag</option>
                </select>
              </div>
            </div>

            {/* Elements */}
            <div className="filter-section">
              <h5>Elements</h5>
              <div className="elements-filter">
                <div className="element-checkboxes">
                  {konivrElements.map(element => (
                    <label
                      key={element.key}
                      className={`element-checkbox ${query.filters.elements[element.key as keyof typeof query.filters.elements] ? 'active' : ''}`}
                      style={{
                        backgroundColor: query.filters.elements[element.key as keyof typeof query.filters.elements] 
                          ? element.bgColor 
                          : 'transparent',
                        borderColor: element.color
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={query.filters.elements[element.key as keyof typeof query.filters.elements]}
                        onChange={(e) => updateFilter(`filters.elements.${element.key}`, e.target.checked)}
                      />
                      <span className="element-symbol" style={{ color: element.color }}>
                        {element.symbol}
                      </span>
                      <span className="element-name">{element.label}</span>
                      <span className="element-shorthand">({element.shorthand})</span>
                    </label>
                  ))}
                </div>
                <div className="element-mode-selector">
                  <label>Element Mode:</label>
                  <select
                    value={query.filters.elementMode}
                    onChange={(e) => updateFilter('filters.elementMode', e.target.value)}
                  >
                    <option value="exactly">Exactly these elements</option>
                    <option value="including">Including these elements</option>
                    <option value="atMost">At most these elements</option>
                    <option value="excluding">Excluding these elements</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="filter-section">
              <h5>Stats</h5>
              <div className="stat-filters">
                <div className="stat-filter">
                  <label>Cost</label>
                  <div className="stat-input-group">
                    <select
                      value={query.filters.cost.operator}
                      onChange={(e) => updateFilter('filters.cost.operator', e.target.value)}
                    >
                      <option value="=">=</option>
                      <option value="<">&lt;</option>
                      <option value=">">&gt;</option>
                      <option value="<=">&lt;=</option>
                      <option value=">=">&gt;=</option>
                      <option value="!">≠</option>
                    </select>
                    <input
                      type="number"
                      value={query.filters.cost.value}
                      onChange={(e) => updateFilter('filters.cost.value', e.target.value)}
                      placeholder="Value"
                      min="0"
                    />
                  </div>
                </div>
                <div className="stat-filter">
                  <label>Strength</label>
                  <div className="stat-input-group">
                    <select
                      value={query.filters.strength.operator}
                      onChange={(e) => updateFilter('filters.strength.operator', e.target.value)}
                    >
                      <option value="=">=</option>
                      <option value="<">&lt;</option>
                      <option value=">">&gt;</option>
                      <option value="<=">&lt;=</option>
                      <option value=">=">&gt;=</option>
                      <option value="!">≠</option>
                    </select>
                    <input
                      type="number"
                      value={query.filters.strength.value}
                      onChange={(e) => updateFilter('filters.strength.value', e.target.value)}
                      placeholder="Value"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Properties */}
            <div className="filter-section">
              <h5>Properties</h5>
              <div className="property-checkboxes">
                <label>
                  <input
                    type="checkbox"
                    checked={query.filters.is.familiar}
                    onChange={(e) => updateFilter('filters.is.familiar', e.target.checked)}
                  />
                  Familiars only
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={query.filters.is.flag}
                    onChange={(e) => updateFilter('filters.is.flag', e.target.checked)}
                  />
                  Flags only
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={query.filters.is.multiElement}
                    onChange={(e) => updateFilter('filters.is.multiElement', e.target.checked)}
                  />
                  Multi-element
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={query.filters.is.vanilla}
                    onChange={(e) => updateFilter('filters.is.vanilla', e.target.checked)}
                  />
                  Vanilla (no keywords)
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={query.filters.is.legendary}
                    onChange={(e) => updateFilter('filters.is.legendary', e.target.checked)}
                  />
                  Legendary
                </label>
              </div>
            </div>

            {/* Rarity */}
            <div className="filter-section">
              <h5>Rarity</h5>
              <div className="rarity-checkboxes">
                <label className="rarity-common">
                  <input
                    type="checkbox"
                    checked={query.filters.rarity.common}
                    onChange={(e) => updateFilter('filters.rarity.common', e.target.checked)}
                  />
                  Common
                </label>
                <label className="rarity-uncommon">
                  <input
                    type="checkbox"
                    checked={query.filters.rarity.uncommon}
                    onChange={(e) => updateFilter('filters.rarity.uncommon', e.target.checked)}
                  />
                  Uncommon
                </label>
                <label className="rarity-rare">
                  <input
                    type="checkbox"
                    checked={query.filters.rarity.rare}
                    onChange={(e) => updateFilter('filters.rarity.rare', e.target.checked)}
                  />
                  Rare
                </label>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Render search controls
  const renderSearchControls = () => (
    <div className="scryfall-search-controls">
      <div className="search-actions">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`control-button ${showAdvanced ? 'active' : ''}`}
        >
          <span className="control-icon">⚙️</span>
          Advanced
        </button>
        
        <button
          onClick={saveQuery}
          className="control-button"
          disabled={!query.text.trim()}
        >
          <span className="control-icon">💾</span>
          Save
        </button>
        
        <button
          onClick={clearAll}
          className="control-button"
        >
          <span className="control-icon">🗑️</span>
          Clear
        </button>
      </div>

      <div className="search-options">
        <div className="sort-controls">
          <label>Sort:</label>
          <select
            value={query.sort.by}
            onChange={(e) => updateFilter('sort.by', e.target.value)}
          >
            <option value="name">Name</option>
            <option value="cost">Cost</option>
            <option value="rarity">Rarity</option>
            <option value="type">Type</option>
            <option value="strength">Strength</option>
            <option value="artist">Artist</option>
          </select>
          <button
            onClick={() => updateFilter('sort.direction', query.sort.direction === 'asc' ? 'desc' : 'asc')}
            className="sort-direction-button"
            title={`Sort ${query.sort.direction === 'asc' ? 'descending' : 'ascending'}`}
          >
            {query.sort.direction === 'asc' ? '↑' : '↓'}
          </button>
        </div>

        <div className="display-controls">
          <label>View:</label>
          <select
            value={query.display.mode}
            onChange={(e) => updateFilter('display.mode', e.target.value)}
          >
            <option value="images">Images</option>
            <option value="text">Text</option>
            <option value="full">Full</option>
            <option value="checklist">Checklist</option>
          </select>
        </div>
      </div>
    </div>
  );

  // Render search stats
  const renderSearchStats = () => (
    <div className="search-stats">
      <span className="stats-text">
        {searchStats.filtered} of {searchStats.total} cards
        {searchStats.time > 0 && ` (${searchStats.time}ms)`}
      </span>
      {isSearching && <span className="searching-indicator">Searching...</span>}
    </div>
  );

  // Render saved queries
  const renderSavedQueries = () => (
    savedQueries.length > 0 && (
      <div className="saved-queries">
        <h5>Saved Searches</h5>
        <div className="saved-queries-list">
          {savedQueries.map((saved, index) => (
            <div key={index} className="saved-query-item">
              <button
                onClick={() => loadQuery(saved.query)}
                className="saved-query-button"
                title={saved.query.text}
              >
                {saved.name}
              </button>
              <button
                onClick={() => setSavedQueries(prev => prev.filter((_, i) => i !== index))}
                className="delete-saved-query"
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
    <div className="scryfall-inspired-search">
      <div className="search-header">
        <h2 className="search-title">
          <span className="search-icon">🔍</span>
          Advanced Card Search
          <span className="scryfall-badge">Scryfall-Inspired</span>
        </h2>
      </div>

      {renderSearchInput()}
      {renderSyntaxHelp()}
      {renderSearchControls()}
      {renderAdvancedFilters()}
      {renderSearchStats()}
      {renderSavedQueries()}
    </div>
  );
};

export default ScryfalInspiredSearch;