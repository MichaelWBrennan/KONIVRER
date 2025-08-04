/**
 * KONIVRER Unified Card Search Component
 *
 * Combines all search functionality into one comprehensive component:
 * - Advanced syntax search (name:, cost:, type:, element:, etc.)
 * - Visual filter interface
 * - Search history and saved searches
 * - Auto-complete suggestions
 * - Multiple display modes
 * - Performance optimizations with indexing
 *
 * Replaces: EnhancedCardSearch, ScryfalInspiredSearch, ScryfalLikeAdvancedSearch,
 *          SyntaxAdvancedSearch, ScryfallSearchEngine, ScryfallSearchInterface, SearchIntegration
 */

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/unified-card-search.css';

// Unified Card Interface
export interface Card {
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
  set?: string;
  setName?: string;
  flavorText?: string;
  legalities?: { [format: string]: 'legal' | 'banned' | 'restricted' };
  price?: number;
  imageUrl?: string;
}

// Search Filters Interface
export interface SearchFilters {
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
    generic: boolean;
  };
  elementMode: 'exactly' | 'including' | 'atMost' | 'excluding';
  cost: {
    operator: '=' | '<' | '>' | '<=' | '>=' | '!';
    value: string;
    numericValue: string;
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
  // keywords field is now merged with text field
  set: string;
  flavorText: string;
  criteria: string;
  allowPartialTypeMatches?: boolean;
}

// Search Preferences
export interface SearchPreferences {
  sortBy: 'name' | 'cost' | 'rarity' | 'type' | 'strength' | 'set' | 'price';
  sortOrder: 'asc' | 'desc';
  viewMode: 'grid' | 'list' | 'compact' | 'images' | 'text' | 'full';
  resultsPerPage: number;
  showExtras: boolean;
  displayAsImages: boolean;
  showAllCardPrints: boolean;
  includeExtraCards: boolean;
  onlySelectedRarities: boolean;
  allowPartialCriteriaMatches: boolean;
  language: string;
}

// Search Result Interface
export interface SearchResult {
  cards: Card[];
  totalCount: number;
  searchTime: number;
  suggestions?: string[];
  warnings?: string[];
}

// Auto-complete Suggestion
export interface SearchSuggestion {
  text: string;
  type: 'card' | 'keyword' | 'set' | 'artist' | 'type' | 'element';
  count?: number;
}

// KONIVRER Elements Configuration
const KONIVR_ELEMENTS = [
  {
    key: 'fire',
    label: 'Fire',
    symbol: '🜂',
    color: '#FF4500',
    bgColor: 'rgba(255, 69, 0, 0.1)',
    shorthand: 'F',
    description: 'Aggressive and direct damage',
  },
  {
    key: 'water',
    label: 'Water',
    symbol: '🜄',
    color: '#4169E1',
    bgColor: 'rgba(65, 105, 225, 0.1)',
    shorthand: 'W',
    description: 'Control and manipulation',
  },
  {
    key: 'earth',
    label: 'Earth',
    symbol: '🜃',
    color: '#8B4513',
    bgColor: 'rgba(139, 69, 19, 0.1)',
    shorthand: 'E',
    description: 'Defense and growth',
  },
  {
    key: 'air',
    label: 'Air',
    symbol: '🜁',
    color: '#87CEEB',
    bgColor: 'rgba(135, 206, 235, 0.1)',
    shorthand: 'A',
    description: 'Speed and evasion',
  },
  {
    key: 'nether',
    label: 'Nether',
    symbol: '□',
    color: '#2F2F2F',
    bgColor: 'rgba(47, 47, 47, 0.1)',
    shorthand: 'N',
    description: 'Dark magic and sacrifice',
  },
  {
    key: 'aether',
    label: 'Aether',
    symbol: '○',
    color: '#FFD700',
    bgColor: 'rgba(255, 215, 0, 0.1)',
    shorthand: 'T',
    description: 'Pure magic and transcendence',
  },
  {
    key: 'generic',
    label: 'Generic',
    symbol: '\u2721',
    color: '#888888',
    bgColor: 'rgba(136, 136, 136, 0.1)',
    shorthand: 'G',
    description: 'Universal mana',
    circled: true,
  },
];

const CARD_TYPES = ['Familiar', 'Flag'];
const RARITIES = ['Common', 'Uncommon', 'Rare'];
const OPERATORS = [
  { value: '=', label: '=' },
  { value: '<', label: '<' },
  { value: '>', label: '>' },
  { value: '<=', label: '≤' },
  { value: '>=', label: '≥' },
  { value: '!', label: '≠' },
];

// Search Engine Class
class UnifiedSearchEngine {
  private cards: Card[] = [];
  private searchIndex: Map<string, Set<string>> = new Map();
  private nameIndex: Map<string, Card> = new Map();

  constructor(cards: Card[] = []) {
    this.cards = cards;
    this.buildSearchIndex();
  }

  private buildSearchIndex(): void {
    this.searchIndex.clear();
    this.nameIndex.clear();

    this.cards.forEach(card => {
      // Name index
      this.nameIndex.set(card.name.toLowerCase(), card);

      // Search index (for general text search)
      const searchTerms = [
        card.name,
        card.description,
        card.type,
        ...card.elements,
        ...card.keywords,
        card.artist || '',
        card.set || '',
        card.flavorText || '',
      ]
        .join(' ')
        .toLowerCase();

      const words = searchTerms.split(/\s+/).filter(word => word.length > 0);
      words.forEach(word => {
        if (!this.searchIndex.has(word)) {
          this.searchIndex.set(word, new Set());
        }
        this.searchIndex.get(word)!.add(card.id);
      });
    });
  }

  public updateCards(cards: Card[]): void {
    this.cards = cards;
    this.buildSearchIndex();
  }

  public search(
    query: string,
    filters: SearchFilters,
    preferences: SearchPreferences,
  ): SearchResult {
    const startTime = Date.now();
    let results = [...this.cards];

    // Apply filters
    results = this.applyFilters(results, filters);

    // Apply text search
    if (query.trim()) {
      results = this.applyTextSearch(results, query);
    }

    // Sort results
    results = this.sortResults(results, preferences);

    const searchTime = Date.now() - startTime;

    return {
      cards: results,
      totalCount: results.length,
      searchTime,
      suggestions: this.generateSuggestions(query),
      warnings: this.generateWarnings(results, query),
    };
  }

  private applyFilters(cards: Card[], filters: SearchFilters): Card[] {
    let results = cards;

    // Name filter
    if (filters.name.trim()) {
      const nameQuery = filters.name.toLowerCase().trim();
      results = results.filter(card =>
        card.name.toLowerCase().includes(nameQuery),
      );
    }

    // Keywords and Text filter (description, keywords, flavor text)
    if (filters.text.trim()) {
      const textQuery = filters.text.toLowerCase().trim();
      results = results.filter(
        card =>
          card.description.toLowerCase().includes(textQuery) ||
          card.keywords.some(keyword =>
            keyword.toLowerCase().includes(textQuery),
          ) ||
          (card.flavorText &&
            card.flavorText.toLowerCase().includes(textQuery)),
      );
    }

    // Type filter
    if (filters.type) {
      results = results.filter(card => card.type === filters.type);
    }

    // Element filter
    const selectedElements = Object.entries(filters.elements)
      .filter(([_, selected]) => selected)
      .map(([key, _]) => {
        const element = KONIVR_ELEMENTS.find(e => e.key === key);
        return element?.label || key;
      });

    if (selectedElements.length > 0) {
      results = results.filter(card => {
        const cardElements = card.elements;

        switch (filters.elementMode) {
          case 'exactly':
            return (
              selectedElements.length === cardElements.length &&
              selectedElements.every(e => cardElements.includes(e)) &&
              cardElements.every(e => selectedElements.includes(e))
            );
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

    // Cost filter
    if (filters.cost.numericValue && filters.cost.numericValue.trim()) {
      const costValue = parseInt(filters.cost.numericValue);
      if (!isNaN(costValue)) {
        results = results.filter(card => {
          switch (filters.cost.operator) {
            case '=':
              return card.cost === costValue;
            case '<':
              return card.cost < costValue;
            case '>':
              return card.cost > costValue;
            case '<=':
              return card.cost <= costValue;
            case '>=':
              return card.cost >= costValue;
            case '!':
              return card.cost !== costValue;
            default:
              return true;
          }
        });
      }
    }

    // Strength filter (only for Familiars)
    if (filters.strength.value.trim()) {
      const strengthValue = parseInt(filters.strength.value);
      if (!isNaN(strengthValue)) {
        results = results.filter(card => {
          if (card.type === 'Flag') return false;
          const cardStrength = card.strength || 0;

          switch (filters.strength.operator) {
            case '=':
              return cardStrength === strengthValue;
            case '<':
              return cardStrength < strengthValue;
            case '>':
              return cardStrength > strengthValue;
            case '<=':
              return cardStrength <= strengthValue;
            case '>=':
              return cardStrength >= strengthValue;
            case '!':
              return cardStrength !== strengthValue;
            default:
              return true;
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
    if (filters.artist.trim()) {
      const artistQuery = filters.artist.toLowerCase().trim();
      results = results.filter(
        card => card.artist?.toLowerCase().includes(artistQuery) || false,
      );
    }

    // Keywords filter is now merged with Text filter

    // Set filter
    if (filters.set.trim()) {
      const setQuery = filters.set.toLowerCase().trim();
      results = results.filter(
        card => card.set?.toLowerCase().includes(setQuery) || false,
      );
    }

    // Flavor text filter
    if (filters.flavorText.trim()) {
      const flavorQuery = filters.flavorText.toLowerCase().trim();
      results = results.filter(
        card => card.flavorText?.toLowerCase().includes(flavorQuery) || false,
      );
    }

    return results;
  }

  private applyTextSearch(cards: Card[], query: string): Card[] {
    const tokens: string[] =
      query.toLowerCase().match(/(?:[^\s"]+|"[^"]*")+/g) || [];

    return cards.filter(card => {
      return tokens.every((token: string) => {
        const cleanToken = token.replace(/"/g, '');

        // Check for syntax patterns
        if (cleanToken.includes(':')) {
          const [field, value] = cleanToken.split(':', 2);
          return this.matchSyntaxField(card, field, value);
        } else {
          // General search across all text fields
          return this.matchGeneralSearch(card, cleanToken);
        }
      });
    });
  }

  private matchSyntaxField(card: Card, field: string, value: string): boolean {
    switch (field) {
      case 'name':
      case 'n':
        return card.name.toLowerCase().includes(value);

      case 'cost':
      case 'c':
        if (value.startsWith('>='))
          return card.cost >= parseInt(value.slice(2));
        if (value.startsWith('<='))
          return card.cost <= parseInt(value.slice(2));
        if (value.startsWith('>')) return card.cost > parseInt(value.slice(1));
        if (value.startsWith('<')) return card.cost < parseInt(value.slice(1));
        if (value.startsWith('!'))
          return card.cost !== parseInt(value.slice(1));
        return card.cost === parseInt(value);

      case 'type':
      case 't':
        return card.type.toLowerCase().includes(value);

      case 'rarity':
      case 'r':
        return card.rarity.toLowerCase().includes(value);

      case 'element':
      case 'e':
        return card.elements.some(el => el.toLowerCase().includes(value));

      case 'keyword':
      case 'k':
        return card.keywords.some(kw => kw.toLowerCase().includes(value));

      case 'artist':
      case 'a':
        return card.artist?.toLowerCase().includes(value) || false;

      case 'description':
      case 'desc':
      case 'd':
        return card.description.toLowerCase().includes(value);

      case 'set':
      case 's':
        return card.set?.toLowerCase().includes(value) || false;

      case 'flavor':
      case 'f':
        return card.flavorText?.toLowerCase().includes(value) || false;

      case 'strength':
      case 'str':
        if (card.type === 'Flag') return false;
        const strength = card.strength || 0;
        if (value.startsWith('>=')) return strength >= parseInt(value.slice(2));
        if (value.startsWith('<=')) return strength <= parseInt(value.slice(2));
        if (value.startsWith('>')) return strength > parseInt(value.slice(1));
        if (value.startsWith('<')) return strength < parseInt(value.slice(1));
        if (value.startsWith('!')) return strength !== parseInt(value.slice(1));
        return strength === parseInt(value);

      default:
        return false;
    }
  }

  private matchGeneralSearch(card: Card, token: string): boolean {
    return (
      card.name.toLowerCase().includes(token) ||
      card.description.toLowerCase().includes(token) ||
      card.keywords.some(kw => kw.toLowerCase().includes(token)) ||
      card.elements.some(el => el.toLowerCase().includes(token)) ||
      card.type.toLowerCase().includes(token) ||
      card.rarity.toLowerCase().includes(token) ||
      (card.artist && card.artist.toLowerCase().includes(token)) ||
      (card.set && card.set.toLowerCase().includes(token)) ||
      (card.flavorText && card.flavorText.toLowerCase().includes(token))
    );
  }

  private sortResults(cards: Card[], preferences: SearchPreferences): Card[] {
    return cards.sort((a, b) => {
      let comparison = 0;

      switch (preferences.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'cost':
          comparison = a.cost - b.cost;
          break;
        case 'rarity':
          const rarityOrder = { Common: 1, Uncommon: 2, Rare: 3 };
          comparison = rarityOrder[a.rarity] - rarityOrder[b.rarity];
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'strength':
          comparison = (a.strength || 0) - (b.strength || 0);
          break;
        case 'set':
          comparison = (a.set || '').localeCompare(b.set || '');
          break;
        case 'price':
          comparison = (a.price || 0) - (b.price || 0);
          break;
        default:
          comparison = a.name.localeCompare(b.name);
      }

      return preferences.sortOrder === 'desc' ? -comparison : comparison;
    });
  }

  private generateSuggestions(query: string): string[] {
    if (!query.trim() || query.length < 2) return [];

    const suggestions: string[] = [];
    const queryLower = query.toLowerCase();

    // Name suggestions
    this.cards.forEach(card => {
      if (card.name.toLowerCase().includes(queryLower)) {
        suggestions.push(card.name);
      }
    });

    // Keyword suggestions
    const allKeywords = new Set<string>();
    this.cards.forEach(card => {
      card.keywords.forEach(keyword => {
        if (keyword.toLowerCase().includes(queryLower)) {
          allKeywords.add(keyword);
        }
      });
    });

    suggestions.push(...Array.from(allKeywords));

    return suggestions.slice(0, 10);
  }

  private generateWarnings(results: Card[], query: string): string[] {
    const warnings: string[] = [];

    if (results.length === 0 && query.trim()) {
      warnings.push('No cards found matching your search criteria.');
    }

    if (results.length > 1000) {
      warnings.push('Large result set. Consider adding more specific filters.');
    }

    return warnings;
  }

  public getAutocompleteSuggestions(input: string): SearchSuggestion[] {
    const suggestions: SearchSuggestion[] = [];
    const inputLower = input.toLowerCase();

    if (input.length < 2) return suggestions;

    // Card name suggestions
    this.cards.forEach(card => {
      if (card.name.toLowerCase().includes(inputLower)) {
        suggestions.push({
          text: card.name,
          type: 'card',
        });
      }
    });

    // Element suggestions
    KONIVR_ELEMENTS.forEach(element => {
      if (element.label.toLowerCase().includes(inputLower)) {
        suggestions.push({
          text: `element:${element.label.toLowerCase()}`,
          type: 'element',
        });
      }
    });

    // Type suggestions
    CARD_TYPES.forEach(type => {
      if (type.toLowerCase().includes(inputLower)) {
        suggestions.push({
          text: `type:${type.toLowerCase()}`,
          type: 'type',
        });
      }
    });

    return suggestions.slice(0, 8);
  }
}

// Main Component Props
export interface UnifiedCardSearchProps {
  cards: Card[];
  onSearchResults: (results: SearchResult) => void;
  onFiltersChange?: (filters: SearchFilters) => void;
  placeholder?: string;
  showAdvancedFilters?: boolean;
  showSortOptions?: boolean;
  showSearchHistory?: boolean;
  maxResults?: number;
  initialMode?: 'advanced' | 'syntax';
}

// Main Unified Card Search Component
const UnifiedCardSearch: React.FC<UnifiedCardSearchProps> = ({
  cards,
  onSearchResults,
  onFiltersChange,
  placeholder = 'Search cards... (try: name:fire, cost:>=3, type:familiar)',
  showAdvancedFilters = true,
  showSortOptions = true,
  showSearchHistory = true,
  maxResults = 50,
  initialMode = 'advanced',
}) => {
  // Search engine instance
  const searchEngine = useMemo(() => new UnifiedSearchEngine(cards), []);

  // Update search engine when cards change
  useEffect(() => {
    searchEngine.updateCards(cards);
  }, [cards, searchEngine]);

  // State management
  const [searchMode, setSearchMode] = useState<'advanced' | 'syntax'>(
    initialMode,
  );
  const [quickSearch, setQuickSearch] = useState('');
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
      aether: false,
      generic: false,
    },
    elementMode: 'exactly',
    cost: { operator: '=', value: '', numericValue: '' },
    strength: { operator: '=', value: '' },
    rarity: {
      common: false,
      uncommon: false,
      rare: false,
    },
    artist: '',
    // keywords field is now merged with text field
    set: '',
    flavorText: '',
    criteria: '',
    allowPartialTypeMatches: false,
  });

  const [preferences, setPreferences] = useState<SearchPreferences>({
    sortBy: 'name',
    sortOrder: 'asc',
    viewMode: 'grid',
    resultsPerPage: maxResults,
    showExtras: false,
    displayAsImages: false,
    showAllCardPrints: false,
    includeExtraCards: false,
    onlySelectedRarities: false,
    allowPartialCriteriaMatches: false,
    language: 'Default',
  });

  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [savedSearches, setSavedSearches] = useState<
    { name: string; query: string; filters: SearchFilters }[]
  >([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showSyntaxHelp, setShowSyntaxHelp] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Handle search mode changes
  useEffect(() => {
    // Close syntax help when switching away from syntax mode
    if (searchMode !== 'syntax') {
      setShowSyntaxHelp(false);
    }
  }, [searchMode]);

  // Debounced search function
  const debouncedSearch = useCallback(
    (query: string, searchFilters: SearchFilters, userInitiated = false) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        setIsSearching(true);

        try {
          // Only perform search if user has initiated a search or if there's actual search content
          const hasSearchContent =
            query.trim() ||
            Object.values(searchFilters).some(value => {
              if (typeof value === 'string') return value.trim();
              if (typeof value === 'boolean') return value;
              if (typeof value === 'object' && value !== null) {
                if ('operator' in value && 'value' in value)
                  return value.value.trim();
                if ('min' in value && 'max' in value)
                  return value.min.trim() || value.max.trim();
                return Object.values(value).some(v =>
                  typeof v === 'boolean'
                    ? v
                    : typeof v === 'string'
                      ? v.trim()
                      : false,
                );
              }
              return false;
            });

          if (hasSearched || userInitiated || hasSearchContent) {
            if (userInitiated) setHasSearched(true);
            const results = searchEngine.search(
              query,
              searchFilters,
              preferences,
            );
            onSearchResults(results);
            onFiltersChange?.(searchFilters);
          } else {
            // Return empty results if no search has been initiated
            onSearchResults({ cards: [], totalCount: 0, searchTime: 0 });
          }
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsSearching(false);
        }
      }, 300);
    },
    [searchEngine, preferences, onSearchResults, onFiltersChange, hasSearched],
  );

  // Update filter programmatically (without triggering search)
  const setFiltersQuietly = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
  }, []);

  // Handle quick search
  const handleQuickSearch = useCallback(
    (query: string) => {
      setQuickSearch(query);

      if (!query.trim()) {
        onSearchResults({ cards: [], totalCount: 0, searchTime: 0 });
        return;
      }

      // Add to search history
      if (query.trim() && !searchHistory.includes(query.trim())) {
        setSearchHistory(prev => [query.trim(), ...prev.slice(0, 9)]);
      }

      // Parse syntax and update filters if needed
      const updatedFilters = parseSyntaxToFilters(query, filters);
      setFiltersQuietly(updatedFilters);

      debouncedSearch(query, updatedFilters, true);
    },
    [
      filters,
      searchHistory,
      debouncedSearch,
      onSearchResults,
      setFiltersQuietly,
    ],
  );

  // Parse syntax search to filters
  const parseSyntaxToFilters = (
    query: string,
    currentFilters: SearchFilters,
  ): SearchFilters => {
    const tokens: string[] =
      query.toLowerCase().match(/(?:[^\s"]+|"[^"]*")+/g) || [];
    let tempFilters = { ...currentFilters };
    let hasAdvancedSyntax = false;

    tokens.forEach((token: string) => {
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
              const numValue = value.slice(2);
              tempFilters.cost = {
                operator: '>=',
                value: numValue,
                numericValue: numValue,
              };
            } else if (value.startsWith('<=')) {
              const numValue = value.slice(2);
              tempFilters.cost = {
                operator: '<=',
                value: numValue,
                numericValue: numValue,
              };
            } else if (value.startsWith('>')) {
              const numValue = value.slice(1);
              tempFilters.cost = {
                operator: '>',
                value: numValue,
                numericValue: numValue,
              };
            } else if (value.startsWith('<')) {
              const numValue = value.slice(1);
              tempFilters.cost = {
                operator: '<',
                value: numValue,
                numericValue: numValue,
              };
            } else if (value.startsWith('!')) {
              const numValue = value.slice(1);
              tempFilters.cost = {
                operator: '!',
                value: numValue,
                numericValue: numValue,
              };
            } else {
              tempFilters.cost = { operator: '=', value, numericValue: value };
            }
            break;
          case 'element':
          case 'e':
            const element = KONIVR_ELEMENTS.find(
              e => e.label.toLowerCase() === value,
            );
            if (element) {
              tempFilters.elements[
                element.key as keyof typeof tempFilters.elements
              ] = true;
            }
            break;
          case 'rarity':
          case 'r':
            if (['common', 'uncommon', 'rare'].includes(value)) {
              tempFilters.rarity[value as keyof typeof tempFilters.rarity] =
                true;
            }
            break;
          case 'artist':
          case 'a':
            tempFilters.artist = value;
            break;
          case 'keyword':
          case 'k':
            tempFilters.text = value; // keywords merged with text field
            break;
          case 'set':
          case 's':
            tempFilters.set = value;
            break;
        }
      } else if (!hasAdvancedSyntax) {
        // General search
        tempFilters.name = query;
      }
    });

    return tempFilters;
  };

  // Handle auto-complete
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleQuickSearch(value);

    if (value.length >= 2) {
      const autocompleteSuggestions =
        searchEngine.getAutocompleteSuggestions(value);
      setSuggestions(autocompleteSuggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Update filter
  const updateFilter = useCallback(
    (path: string, value: any, userInitiated = true) => {
      const updateFiltersAndSearch = (prev: SearchFilters) => {
        const newFilters = { ...prev };
        const keys = path.split('.');
        let current: any = newFilters;

        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }

        current[keys[keys.length - 1]] = value;

        // Trigger search immediately for user-initiated filter changes
        if (userInitiated) {
          debouncedSearch(quickSearch, newFilters, true);
        }

        return newFilters;
      };

      setFilters(updateFiltersAndSearch);
    },
    [quickSearch, debouncedSearch],
  );

  // Effect to trigger search when filters change (only for non-user initiated changes)
  useEffect(() => {
    if (hasSearched) {
      debouncedSearch(quickSearch, filters);
    }
  }, [filters, debouncedSearch, quickSearch, hasSearched]);

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
        aether: false,
        generic: false,
      },
      elementMode: 'exactly',
      cost: { operator: '=', value: '', numericValue: '' },
      strength: { operator: '=', value: '' },
      rarity: {
        common: false,
        uncommon: false,
        rare: false,
      },
      artist: '',
      // keywords field is now merged with text field
      set: '',
      flavorText: '',
      criteria: '',
      allowPartialTypeMatches: false,
    };

    setFiltersQuietly(clearedFilters);
    setQuickSearch('');
    setHasSearched(false);
    onSearchResults({ cards: [], totalCount: 0, searchTime: 0 });
  }, [onSearchResults, setFiltersQuietly]);

  // Save current search
  const saveCurrentSearch = useCallback(() => {
    const name = prompt('Enter a name for this search:');
    if (name && name.trim()) {
      setSavedSearches(prev => [
        ...prev.filter(s => s.name !== name.trim()),
        { name: name.trim(), query: quickSearch, filters },
      ]);
    }
  }, [quickSearch, filters]);

  // Load saved search
  const loadSavedSearch = useCallback(
    (savedSearch: { name: string; query: string; filters: SearchFilters }) => {
      setQuickSearch(savedSearch.query);
      setFiltersQuietly(savedSearch.filters);
      setHasSearched(true);
      debouncedSearch(savedSearch.query, savedSearch.filters, true);
    },
    [setFiltersQuietly, debouncedSearch],
  );

  return (
    <div className="unified-card-search">
      {/* Search Mode Tabs */}
      <div className="search-modes">
        <button
          className={`mode-tab ${searchMode === 'syntax' ? 'active' : ''}`}
          onClick={() => setSearchMode('syntax')}
        >
          Syntax
        </button>
        {showAdvancedFilters && (
          <button
            className={`mode-tab ${searchMode === 'advanced' ? 'active' : ''}`}
            onClick={() => setSearchMode('advanced')}
          >
            Search
          </button>
        )}
      </div>

      {/* Quick Search Bar */}
      <div className="quick-search-container">
        <div className="search-input-wrapper">
          <input
            ref={searchInputRef}
            type="text"
            value={quickSearch}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="quick-search-input"
            disabled={isSearching}
          />
          <div className="search-input-actions">
            {isSearching && <div className="search-spinner" />}
            {searchMode !== 'syntax' && (
              <button
                type="button"
                onClick={() => setShowSyntaxHelp(!showSyntaxHelp)}
                className="syntax-help-button"
                title="Search syntax help"
              >
                ?
              </button>
            )}
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
                {'\u{2715}'}
              </button>
            )}
          </div>
        </div>

        {/* Auto-complete suggestions */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="search-suggestions"
            >
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className={`suggestion-item ${suggestion.type}`}
                  onClick={() => {
                    handleQuickSearch(suggestion.text);
                    setShowSuggestions(false);
                  }}
                >
                  <span className="suggestion-text">{suggestion.text}</span>
                  <span className="suggestion-type">{suggestion.type}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search History */}
        {showSearchHistory && searchHistory.length > 0 && (
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

      {/* Syntax Help */}
      <AnimatePresence>
        {(searchMode === 'syntax' || showSyntaxHelp) && (
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
                <strong>Cost:</strong>
                <code>cost:3</code>, <code>c:&gt;=4</code>,{' '}
                <code>c:&lt;=2</code>
              </div>
              <div className="syntax-group">
                <strong>Type:</strong>
                <code>type:familiar</code> or <code>t:flag</code>
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
                <strong>Artist:</strong>
                <code>artist:smith</code> or <code>a:jones</code>
              </div>
              <div className="syntax-group">
                <strong>Combine:</strong>
                <code>type:familiar cost:&gt;=3 element:fire</code>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Advanced Filters */}
      <AnimatePresence>
        {searchMode === 'advanced' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="advanced-filters"
          >
            <div className="filter-grid">
              {/* Card Name Filter */}
              <div className="filter-group">
                <label className="section-title">SEARCH NAME</label>
                <input
                  type="text"
                  value={filters.name}
                  onChange={e => updateFilter('name', e.target.value)}
                  placeholder='Any words in the name, e.g. "Fi'
                  className="search-input"
                />
              </div>

              {/* Keywords and Text Filter */}
              <div className="filter-group">
                <label className="section-title">KEYWORDS</label>
                <input
                  type="text"
                  value={filters.text}
                  onChange={e => updateFilter('text', e.target.value)}
                  placeholder='Keywords or card text, e.g. "draw a card"'
                  className="search-input"
                />
                <button className="add-symbol-btn" type="button">
                  + Add symbol
                </button>
                <div className="filter-description">
                  Search for keywords or text that appears in the rules box. You
                  can use ~ as a placeholder for the card name. Word order
                  doesn't matter.
                </div>
              </div>

              {/* Type Line Filter */}
              <div className="filter-group">
                <label className="section-title">CARD TYPE</label>
                <select
                  value={filters.type}
                  onChange={e => updateFilter('type', e.target.value)}
                  className="search-select"
                >
                  <option value="">All Types</option>
                  {CARD_TYPES.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <div className="filter-description">
                  Filter cards by their type (Familiar or Flag).
                </div>
              </div>

              {/* Elements Filter */}
              <div className="filter-group">
                <label className="section-title">ELEMENTS</label>
                <label className="section-subtitle">CARD ELEMENTS</label>
                <div className="element-checkboxes">
                  {KONIVR_ELEMENTS.map(element => (
                    <label key={element.key} className="element-checkbox">
                      <input
                        type="checkbox"
                        checked={
                          filters.elements[
                            element.key as keyof typeof filters.elements
                          ]
                        }
                        onChange={e =>
                          updateFilter(
                            `elements.${element.key}`,
                            e.target.checked,
                          )
                        }
                      />
                      <span
                        className={`element-symbol ${element.circled ? 'circled' : ''}`}
                        dangerouslySetInnerHTML={{ __html: element.symbol }}
                      ></span>
                      {element.label}
                    </label>
                  ))}
                </div>

                {/* Element Comparison Section */}
                <div className="element-comparison">
                  <label className="section-title">ELEMENT COMPARISON</label>
                  <div className="element-mode-selector">
                    <select
                      value={filters.elementMode}
                      onChange={e =>
                        updateFilter('elementMode', e.target.value)
                      }
                    >
                      <option value="exactly">Exactly these elements</option>
                      <option value="including">
                        Including these elements
                      </option>
                      <option value="atMost">At most these elements</option>
                      <option value="excluding">
                        Excluding these elements
                      </option>
                    </select>
                  </div>
                  <div className="element-description">
                    "Including" means cards that are all the elements you
                    select, with or without any others. "At most" means cards
                    that have some or all of the elements you select, plus void.
                  </div>
                </div>
              </div>

              {/* Flag Section */}
              <div className="filter-group">
                <label className="section-title">FLAG</label>
                <label className="section-subtitle">FLAG ELEMENTS</label>
                <div className="element-checkboxes">
                  {KONIVR_ELEMENTS.filter(
                    element => element.key !== 'generic',
                  ).map(element => (
                    <label
                      key={`flag-${element.key}`}
                      className="element-checkbox"
                    >
                      <input
                        type="checkbox"
                        checked={
                          filters.elements[
                            element.key as keyof typeof filters.elements
                          ]
                        }
                        onChange={e =>
                          updateFilter(
                            `elements.${element.key}`,
                            e.target.checked,
                          )
                        }
                      />
                      <span
                        className={`element-symbol ${element.circled ? 'circled' : ''}`}
                        dangerouslySetInnerHTML={{ __html: element.symbol }}
                      ></span>
                      {element.label}
                    </label>
                  ))}
                </div>

                <div className="element-description">
                  Select your flag's element identity, and only cards that fit
                  in your deck will be returned.
                </div>
              </div>

              {/* Mana Cost Section */}
              <div className="filter-group">
                <label className="section-title">MANA COST</label>
                <div className="cost-filter">
                  <select
                    value={filters.cost.operator || '='}
                    onChange={e =>
                      updateFilter('cost.operator', e.target.value)
                    }
                    className="cost-operator"
                  >
                    <option value="=">=</option>
                    <option value="<">&lt;</option>
                    <option value="<=">&lt;=</option>
                    <option value=">">&gt;</option>
                    <option value=">=">&gt;=</option>
                  </select>
                  <input
                    type="number"
                    value={filters.cost.numericValue || ''}
                    onChange={e =>
                      updateFilter('cost.numericValue', e.target.value)
                    }
                    placeholder="Cost"
                    min="0"
                    max="20"
                    className="cost-number"
                  />
                </div>
                <div className="filter-description">
                  Filter cards by their mana cost value.
                </div>
              </div>

              {/* Strength Filter */}
              <div className="filter-group">
                <label>Strength</label>
                <div className="numeric-filter">
                  <select
                    value={filters.strength.operator}
                    onChange={e =>
                      updateFilter('strength.operator', e.target.value)
                    }
                  >
                    {OPERATORS.map(op => (
                      <option key={op.value} value={op.value}>
                        {op.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={filters.strength.value}
                    onChange={e =>
                      updateFilter('strength.value', e.target.value)
                    }
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              {/* Rarity Section */}
              <div className="filter-group">
                <label className="section-title">RARITY</label>
                <div className="rarity-selector">
                  <select
                    multiple
                    value={Object.entries(filters.rarity)
                      .filter(([_, selected]) => selected)
                      .map(([rarity, _]) => rarity)}
                    onChange={e => {
                      const selectedRarities = Array.from(
                        e.target.selectedOptions,
                        option => option.value,
                      );
                      updateFilter(
                        'rarity.common',
                        selectedRarities.includes('common'),
                      );
                      updateFilter(
                        'rarity.uncommon',
                        selectedRarities.includes('uncommon'),
                      );
                      updateFilter(
                        'rarity.rare',
                        selectedRarities.includes('rare'),
                      );
                    }}
                    className="rarity-multiselect"
                    size={3}
                  >
                    <option value="common">Common</option>
                    <option value="uncommon">Uncommon</option>
                    <option value="rare">Rare</option>
                  </select>
                </div>
                <div className="filter-description">
                  Hold Ctrl/Cmd to select multiple rarities. Leave empty for all
                  rarities.
                </div>
              </div>

              {/* Artist Filter */}
              <div className="filter-group">
                <label>Artist</label>
                <input
                  type="text"
                  value={filters.artist}
                  onChange={e => updateFilter('artist', e.target.value)}
                  placeholder="Artist name..."
                />
              </div>

              {/* Sets Section */}
              <div className="filter-group">
                <label className="section-subtitle">SET</label>
                <textarea
                  className="set-input"
                  value={filters.set}
                  onChange={e => updateFilter('set', e.target.value)}
                  placeholder="Enter a set name or choose from"
                  rows={2}
                />
                <div className="filter-description">
                  Restrict cards based on their set.
                </div>
              </div>

              {/* Criteria Section */}
              <div className="filter-group">
                <label className="section-title">CRITERIA</label>
                <textarea
                  className="criteria-input"
                  value={filters.criteria}
                  onChange={e => updateFilter('criteria', e.target.value)}
                  placeholder="Enter a criterion or choose from"
                  rows={3}
                />
              </div>

              {/* Allow Partial Criteria Matches */}
              <div className="filter-group">
                <label className="partial-criteria-checkbox">
                  <input
                    type="checkbox"
                    checked={preferences.allowPartialCriteriaMatches}
                    onChange={e =>
                      setPreferences(prev => ({
                        ...prev,
                        allowPartialCriteriaMatches: e.target.checked,
                      }))
                    }
                  />
                  Allow partial criteria matches
                </label>
                <div className="filter-description">
                  Enter any card criteria to match, in any order. Click the "IS"
                  or "NOT" button to toggle between including and excluding an
                  item.
                </div>
              </div>

              {/* Artist Section */}
              <div className="filter-group">
                <label className="section-title">ARTIST</label>
                <input
                  type="text"
                  value={filters.artist}
                  onChange={e => updateFilter('artist', e.target.value)}
                  placeholder="Artist name..."
                  className="artist-input"
                />
              </div>

              {/* Flavor Text Section */}
              <div className="filter-group">
                <label className="section-title">FLAVOR TEXT</label>
                <textarea
                  className="flavor-text-input"
                  value={filters.flavorText}
                  onChange={e => updateFilter('flavorText', e.target.value)}
                  placeholder="Enter flavor text..."
                  rows={3}
                />
                <div className="filter-description">
                  Enter words that should appear in the flavor text. Word order
                  doesn't matter.
                </div>
              </div>

              {/* Language Section */}
              <div className="filter-group">
                <label className="section-title">LANGUAGE</label>
                <select
                  value={preferences.language}
                  onChange={e =>
                    setPreferences(prev => ({
                      ...prev,
                      language: e.target.value,
                    }))
                  }
                  className="language-select"
                >
                  <option value="Default">Default</option>
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Italian">Italian</option>
                  <option value="Portuguese">Portuguese</option>
                  <option value="Russian">Russian</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Korean">Korean</option>
                  <option value="Chinese Simplified">Chinese Simplified</option>
                  <option value="Chinese Traditional">
                    Chinese Traditional
                  </option>
                </select>
                <div className="filter-description">
                  Specify a language to return results in.
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preferences Display */}
      {showSortOptions && (
        <div className="preferences-section">
          <div className="preferences-display">
            <h3 className="section-title">PREFERENCES DISPLAY</h3>
            <button
              className={`display-option ${preferences.displayAsImages ? 'active' : ''}`}
              onClick={() =>
                setPreferences(prev => ({
                  ...prev,
                  displayAsImages: !prev.displayAsImages,
                }))
              }
            >
              Display as Images
            </button>
          </div>

          <div className="order-section">
            <h3 className="section-title">ORDER</h3>
            <button
              className={`sort-option ${preferences.sortBy === 'name' ? 'active' : ''}`}
              onClick={() =>
                setPreferences(prev => ({ ...prev, sortBy: 'name' }))
              }
            >
              Sort by Name
            </button>
          </div>

          <div className="card-options">
            <label className="card-option-checkbox">
              <input
                type="checkbox"
                checked={preferences.showAllCardPrints}
                onChange={e =>
                  setPreferences(prev => ({
                    ...prev,
                    showAllCardPrints: e.target.checked,
                  }))
                }
              />
              <span className="checkbox-text">Show all search prints</span>
            </label>

            <label className="card-option-checkbox">
              <input
                type="checkbox"
                checked={preferences.includeExtraCards}
                onChange={e =>
                  setPreferences(prev => ({
                    ...prev,
                    includeExtraCards: e.target.checked,
                  }))
                }
              />
              <span className="checkbox-text">
                Include extra searches (tokens, planes, schemes, etc)
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Saved Searches */}
      {savedSearches.length > 0 && (
        <div className="saved-searches">
          <h4>Saved Searches</h4>
          <div className="saved-search-list">
            {savedSearches.map((savedSearch, index) => (
              <button
                key={index}
                className="saved-search-item"
                onClick={() => loadSavedSearch(savedSearch)}
                title={`Query: ${savedSearch.query}`}
              >
                {savedSearch.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="search-actions">
        <button
          onClick={clearAllFilters}
          className="action-button clear-button"
          title="Clear all filters"
        >
          Clear All
        </button>
        <button
          onClick={saveCurrentSearch}
          className="action-button save-button"
          title="Save current search"
          disabled={!quickSearch.trim()}
        >
          Save Search
        </button>
      </div>
    </div>
  );
};

export default UnifiedCardSearch;
