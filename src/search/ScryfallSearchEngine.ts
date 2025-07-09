export interface KonivrCard {
  id: string;
  name: string;
  manaCost: string;
  cmc: number;
  colors: string[];
  colorIdentity: string[];
  type: string;
  subtypes: string[];
  supertypes: string[];
  rarity: 'common' | 'uncommon' | 'rare' | 'mythic' | 'legendary';
  set: string;
  setName: string;
  power?: number;
  toughness?: number;
  loyalty?: number;
  oracleText: string;
  flavorText?: string;
  artist: string;
  imageUrl: string;
  legalities: { [format: string]: 'legal' | 'banned' | 'restricted' };
  keywords: string[];
  abilities: string[];
  price?: number;
  collectorNumber: string;
  layout: 'normal' | 'split' | 'flip' | 'transform' | 'modal' | 'adventure';
  faces?: KonivrCard[];
  relatedCards?: string[];
  rulings?: Array<{ date: string; text: string }>;
}

export interface SearchQuery {
  query: string;
  filters: SearchFilters;
  sort: SortOption;
  order: 'asc' | 'desc';
  page: number;
  pageSize: number;
}

export interface SearchFilters {
  colors?: string[];
  colorIdentity?: string[];
  colorOperator?: 'exactly' | 'including' | 'at-most';
  types?: string[];
  subtypes?: string[];
  supertypes?: string[];
  rarity?: string[];
  sets?: string[];
  cmc?: { min?: number; max?: number; exact?: number };
  power?: { min?: number; max?: number; exact?: number };
  toughness?: { min?: number; max?: number; exact?: number };
  loyalty?: { min?: number; max?: number; exact?: number };
  price?: { min?: number; max?: number };
  legality?: { [format: string]: 'legal' | 'banned' | 'restricted' };
  keywords?: string[];
  artist?: string;
  layout?: string[];
  isReprint?: boolean;
  hasImage?: boolean;
  language?: string;
}

export interface SearchResult {
  cards: KonivrCard[];
  totalCount: number;
  hasMore: boolean;
  searchTime: number;
  suggestions?: string[];
  warnings?: string[];
}

export interface SortOption {
  field: 'name' | 'cmc' | 'power' | 'toughness' | 'rarity' | 'set' | 'price' | 'released' | 'artist';
  direction: 'asc' | 'desc';
}

export interface SearchSuggestion {
  text: string;
  type: 'card' | 'keyword' | 'set' | 'artist' | 'type';
  count?: number;
}

export class ScryfallSearchEngine {
  private cards: KonivrCard[] = [];
  private searchIndex: Map<string, Set<string>> = new Map();
  private nameIndex: Map<string, KonivrCard> = new Map();
  private typeIndex: Map<string, Set<string>> = new Map();
  private setIndex: Map<string, Set<string>> = new Map();
  private artistIndex: Map<string, Set<string>> = new Map();
  private keywordIndex: Map<string, Set<string>> = new Map();
  private searchHistory: string[] = [];
  private savedSearches: Map<string, SearchQuery> = new Map();

  constructor(cards: KonivrCard[] = []) {
    this.cards = cards;
    this.buildSearchIndex();
  }

  private buildSearchIndex(): void {
    this.searchIndex.clear();
    this.nameIndex.clear();
    this.typeIndex.clear();
    this.setIndex.clear();
    this.artistIndex.clear();
    this.keywordIndex.clear();

    this.cards.forEach(card => {
      // Name index
      this.nameIndex.set(card.name.toLowerCase(), card);
      this.addToIndex('name', card.name.toLowerCase(), card.id);

      // Oracle text index
      this.addToIndex('oracle', card.oracleText.toLowerCase(), card.id);

      // Type index
      this.addToIndex('type', card.type.toLowerCase(), card.id);
      this.typeIndex.set(card.type.toLowerCase(), 
        (this.typeIndex.get(card.type.toLowerCase()) || new Set()).add(card.id));

      // Subtype index
      card.subtypes.forEach(subtype => {
        this.addToIndex('subtype', subtype.toLowerCase(), card.id);
      });

      // Color index
      card.colors.forEach(color => {
        this.addToIndex('color', color.toLowerCase(), card.id);
      });

      // Set index
      this.addToIndex('set', card.set.toLowerCase(), card.id);
      this.setIndex.set(card.set.toLowerCase(),
        (this.setIndex.get(card.set.toLowerCase()) || new Set()).add(card.id));

      // Artist index
      this.addToIndex('artist', card.artist.toLowerCase(), card.id);
      this.artistIndex.set(card.artist.toLowerCase(),
        (this.artistIndex.get(card.artist.toLowerCase()) || new Set()).add(card.id));

      // Keyword index
      card.keywords.forEach(keyword => {
        this.addToIndex('keyword', keyword.toLowerCase(), card.id);
        this.keywordIndex.set(keyword.toLowerCase(),
          (this.keywordIndex.get(keyword.toLowerCase()) || new Set()).add(card.id));
      });

      // Rarity index
      this.addToIndex('rarity', card.rarity.toLowerCase(), card.id);

      // CMC index
      this.addToIndex('cmc', card.cmc.toString(), card.id);

      // Power/Toughness index
      if (card.power !== undefined) {
        this.addToIndex('power', card.power.toString(), card.id);
      }
      if (card.toughness !== undefined) {
        this.addToIndex('toughness', card.toughness.toString(), card.id);
      }
    });
  }

  private addToIndex(category: string, term: string, cardId: string): void {
    const key = `${category}:${term}`;
    if (!this.searchIndex.has(key)) {
      this.searchIndex.set(key, new Set());
    }
    this.searchIndex.get(key)!.add(cardId);
  }

  search(query: string, options: Partial<SearchQuery> = {}): SearchResult {
    const startTime = Date.now();
    
    // Add to search history
    if (query.trim()) {
      this.addToSearchHistory(query);
    }

    // Parse the query
    const parsedQuery = this.parseQuery(query);
    
    // Apply filters
    let results = this.executeQuery(parsedQuery);
    
    // Apply additional filters from options
    if (options.filters) {
      results = this.applyFilters(results, options.filters);
    }

    // Sort results
    const sortOption = options.sort || { field: 'name', direction: 'asc' };
    results = this.sortResults(results, sortOption);

    // Paginate
    const page = options.page || 1;
    const pageSize = options.pageSize || 50;
    const startIndex = (page - 1) * pageSize;
    const paginatedResults = results.slice(startIndex, startIndex + pageSize);

    const searchTime = Date.now() - startTime;

    return {
      cards: paginatedResults.map(id => this.cards.find(c => c.id === id)!),
      totalCount: results.length,
      hasMore: startIndex + pageSize < results.length,
      searchTime,
      suggestions: this.generateSuggestions(query),
      warnings: this.generateWarnings(query, results.length)
    };
  }

  private parseQuery(query: string): ParsedQuery {
    const tokens = this.tokenizeQuery(query);
    return this.buildQueryTree(tokens);
  }

  private tokenizeQuery(query: string): QueryToken[] {
    const tokens: QueryToken[] = [];
    const regex = /(\w+):([^\s"]+|"[^"]*")|([^\s()]+)|([()])/g;
    let match;

    while ((match = regex.exec(query)) !== null) {
      if (match[1] && match[2]) {
        // Field:value syntax (e.g., c:red, cmc:3)
        tokens.push({
          type: 'field',
          field: match[1],
          value: match[2].replace(/"/g, ''),
          operator: this.getOperatorFromField(match[1], match[2])
        });
      } else if (match[3]) {
        // Regular term or boolean operator
        const term = match[3].toLowerCase();
        if (['and', 'or', 'not'].includes(term)) {
          tokens.push({ type: 'operator', value: term });
        } else {
          tokens.push({ type: 'term', value: match[3] });
        }
      } else if (match[4]) {
        // Parentheses
        tokens.push({ type: 'paren', value: match[4] });
      }
    }

    return tokens;
  }

  private getOperatorFromField(field: string, value: string): string {
    if (value.startsWith('>=')) return 'gte';
    if (value.startsWith('<=')) return 'lte';
    if (value.startsWith('>')) return 'gt';
    if (value.startsWith('<')) return 'lt';
    if (value.startsWith('!')) return 'not';
    return 'equals';
  }

  private buildQueryTree(tokens: QueryToken[]): ParsedQuery {
    // Simplified query tree building - in production, you'd want a proper parser
    const conditions: QueryCondition[] = [];
    
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      
      if (token.type === 'field') {
        conditions.push({
          type: 'field',
          field: token.field!,
          value: token.value,
          operator: token.operator || 'equals'
        });
      } else if (token.type === 'term') {
        conditions.push({
          type: 'text',
          value: token.value,
          operator: 'contains'
        });
      }
    }

    return { conditions, operator: 'and' };
  }

  private executeQuery(query: ParsedQuery): string[] {
    let results: Set<string> = new Set();
    let isFirstCondition = true;

    for (const condition of query.conditions) {
      let conditionResults: Set<string>;

      if (condition.type === 'field') {
        conditionResults = this.executeFieldCondition(condition);
      } else {
        conditionResults = this.executeTextCondition(condition);
      }

      if (isFirstCondition) {
        results = conditionResults;
        isFirstCondition = false;
      } else {
        if (query.operator === 'and') {
          results = new Set([...results].filter(id => conditionResults.has(id)));
        } else if (query.operator === 'or') {
          results = new Set([...results, ...conditionResults]);
        }
      }
    }

    return Array.from(results);
  }

  private executeFieldCondition(condition: QueryCondition): Set<string> {
    const field = condition.field!;
    const value = condition.value.toLowerCase();
    const operator = condition.operator;

    switch (field) {
      case 'c':
      case 'color':
        return this.searchByColor(value, operator);
      
      case 'ci':
      case 'coloridentity':
        return this.searchByColorIdentity(value, operator);
      
      case 'cmc':
        return this.searchByNumericField('cmc', value, operator);
      
      case 't':
      case 'type':
        return this.searchIndex.get(`type:${value}`) || new Set();
      
      case 'o':
      case 'oracle':
        return this.searchByOracleText(value, operator);
      
      case 'r':
      case 'rarity':
        return this.searchIndex.get(`rarity:${value}`) || new Set();
      
      case 's':
      case 'set':
        return this.searchIndex.get(`set:${value}`) || new Set();
      
      case 'a':
      case 'artist':
        return this.searchByArtist(value, operator);
      
      case 'pow':
      case 'power':
        return this.searchByNumericField('power', value, operator);
      
      case 'tou':
      case 'toughness':
        return this.searchByNumericField('toughness', value, operator);
      
      case 'k':
      case 'keyword':
        return this.searchIndex.get(`keyword:${value}`) || new Set();
      
      case 'is':
        return this.searchBySpecialProperty(value);
      
      case 'legal':
      case 'banned':
      case 'restricted':
        return this.searchByLegality(field, value);
      
      default:
        return new Set();
    }
  }

  private executeTextCondition(condition: QueryCondition): Set<string> {
    const value = condition.value.toLowerCase();
    const results = new Set<string>();

    // Search in card names (fuzzy matching)
    this.cards.forEach(card => {
      if (this.fuzzyMatch(card.name.toLowerCase(), value)) {
        results.add(card.id);
      }
    });

    // Search in oracle text
    const oracleResults = this.searchByOracleText(value, 'contains');
    oracleResults.forEach(id => results.add(id));

    return results;
  }

  private searchByColor(color: string, operator: string): Set<string> {
    const colorMap: { [key: string]: string } = {
      'w': 'white', 'u': 'blue', 'b': 'black', 'r': 'red', 'g': 'green',
      'c': 'colorless'
    };
    
    const fullColor = colorMap[color] || color;
    return this.searchIndex.get(`color:${fullColor}`) || new Set();
  }

  private searchByColorIdentity(color: string, operator: string): Set<string> {
    // Similar to color search but for color identity
    return this.searchByColor(color, operator);
  }

  private searchByNumericField(field: string, value: string, operator: string): Set<string> {
    const numValue = this.parseNumericValue(value);
    const results = new Set<string>();

    this.cards.forEach(card => {
      let cardValue: number | undefined;
      
      switch (field) {
        case 'cmc':
          cardValue = card.cmc;
          break;
        case 'power':
          cardValue = card.power;
          break;
        case 'toughness':
          cardValue = card.toughness;
          break;
        case 'loyalty':
          cardValue = card.loyalty;
          break;
      }

      if (cardValue !== undefined && this.compareNumeric(cardValue, numValue, operator)) {
        results.add(card.id);
      }
    });

    return results;
  }

  private searchByOracleText(text: string, operator: string): Set<string> {
    const results = new Set<string>();
    
    this.cards.forEach(card => {
      const oracleText = card.oracleText.toLowerCase();
      
      switch (operator) {
        case 'contains':
          if (oracleText.includes(text)) {
            results.add(card.id);
          }
          break;
        case 'equals':
          if (oracleText === text) {
            results.add(card.id);
          }
          break;
        case 'not':
          if (!oracleText.includes(text)) {
            results.add(card.id);
          }
          break;
      }
    });

    return results;
  }

  private searchByArtist(artist: string, operator: string): Set<string> {
    const results = new Set<string>();
    
    this.cards.forEach(card => {
      const cardArtist = card.artist.toLowerCase();
      
      if (operator === 'contains' && cardArtist.includes(artist)) {
        results.add(card.id);
      } else if (operator === 'equals' && cardArtist === artist) {
        results.add(card.id);
      }
    });

    return results;
  }

  private searchBySpecialProperty(property: string): Set<string> {
    const results = new Set<string>();
    
    this.cards.forEach(card => {
      switch (property) {
        case 'reprint':
          // Logic to determine if card is a reprint
          break;
        case 'new':
          // Logic to determine if card is new
          break;
        case 'digital':
          // Logic for digital-only cards
          break;
        case 'paper':
          // Logic for paper cards
          break;
        case 'funny':
          // Logic for joke/un-cards
          break;
      }
    });

    return results;
  }

  private searchByLegality(format: string, legality: string): Set<string> {
    const results = new Set<string>();
    
    this.cards.forEach(card => {
      if (card.legalities[legality] === format) {
        results.add(card.id);
      }
    });

    return results;
  }

  private parseNumericValue(value: string): number {
    // Remove operator prefixes and parse
    const cleanValue = value.replace(/^[><=!]+/, '');
    return parseFloat(cleanValue) || 0;
  }

  private compareNumeric(cardValue: number, searchValue: number, operator: string): boolean {
    switch (operator) {
      case 'equals': return cardValue === searchValue;
      case 'gt': return cardValue > searchValue;
      case 'gte': return cardValue >= searchValue;
      case 'lt': return cardValue < searchValue;
      case 'lte': return cardValue <= searchValue;
      case 'not': return cardValue !== searchValue;
      default: return cardValue === searchValue;
    }
  }

  private fuzzyMatch(text: string, pattern: string): boolean {
    // Simple fuzzy matching - in production, use a library like Fuse.js
    const distance = this.levenshteinDistance(text, pattern);
    const threshold = Math.max(1, Math.floor(pattern.length * 0.3));
    return distance <= threshold || text.includes(pattern);
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  private applyFilters(cardIds: string[], filters: SearchFilters): string[] {
    return cardIds.filter(id => {
      const card = this.cards.find(c => c.id === id);
      if (!card) return false;

      // Apply all filters
      if (filters.colors && !this.matchesColorFilter(card, filters.colors, filters.colorOperator)) {
        return false;
      }
      
      if (filters.types && !filters.types.some(type => card.type.toLowerCase().includes(type.toLowerCase()))) {
        return false;
      }
      
      if (filters.rarity && !filters.rarity.includes(card.rarity)) {
        return false;
      }
      
      if (filters.sets && !filters.sets.includes(card.set)) {
        return false;
      }
      
      if (filters.cmc && !this.matchesNumericFilter(card.cmc, filters.cmc)) {
        return false;
      }
      
      if (filters.power && card.power !== undefined && !this.matchesNumericFilter(card.power, filters.power)) {
        return false;
      }
      
      if (filters.toughness && card.toughness !== undefined && !this.matchesNumericFilter(card.toughness, filters.toughness)) {
        return false;
      }

      return true;
    });
  }

  private matchesColorFilter(card: KonivrCard, colors: string[], operator?: string): boolean {
    switch (operator) {
      case 'exactly':
        return card.colors.length === colors.length && 
               colors.every(color => card.colors.includes(color));
      case 'including':
        return colors.every(color => card.colors.includes(color));
      case 'at-most':
        return card.colors.every(color => colors.includes(color));
      default:
        return colors.some(color => card.colors.includes(color));
    }
  }

  private matchesNumericFilter(value: number, filter: { min?: number; max?: number; exact?: number }): boolean {
    if (filter.exact !== undefined) return value === filter.exact;
    if (filter.min !== undefined && value < filter.min) return false;
    if (filter.max !== undefined && value > filter.max) return false;
    return true;
  }

  private sortResults(cardIds: string[], sort: SortOption): string[] {
    return cardIds.sort((a, b) => {
      const cardA = this.cards.find(c => c.id === a)!;
      const cardB = this.cards.find(c => c.id === b)!;
      
      let comparison = 0;
      
      switch (sort.field) {
        case 'name':
          comparison = cardA.name.localeCompare(cardB.name);
          break;
        case 'cmc':
          comparison = cardA.cmc - cardB.cmc;
          break;
        case 'power':
          comparison = (cardA.power || 0) - (cardB.power || 0);
          break;
        case 'toughness':
          comparison = (cardA.toughness || 0) - (cardB.toughness || 0);
          break;
        case 'rarity':
          const rarityOrder = { common: 1, uncommon: 2, rare: 3, mythic: 4, legendary: 5 };
          comparison = rarityOrder[cardA.rarity] - rarityOrder[cardB.rarity];
          break;
        case 'set':
          comparison = cardA.set.localeCompare(cardB.set);
          break;
        case 'price':
          comparison = (cardA.price || 0) - (cardB.price || 0);
          break;
        case 'artist':
          comparison = cardA.artist.localeCompare(cardB.artist);
          break;
      }
      
      return sort.direction === 'desc' ? -comparison : comparison;
    });
  }

  private generateSuggestions(query: string): string[] {
    const suggestions: string[] = [];
    const queryLower = query.toLowerCase();
    
    // Card name suggestions
    this.cards.forEach(card => {
      if (card.name.toLowerCase().startsWith(queryLower)) {
        suggestions.push(card.name);
      }
    });
    
    // Keyword suggestions
    this.keywordIndex.forEach((_, keyword) => {
      if (keyword.startsWith(queryLower)) {
        suggestions.push(`k:${keyword}`);
      }
    });
    
    // Type suggestions
    this.typeIndex.forEach((_, type) => {
      if (type.startsWith(queryLower)) {
        suggestions.push(`t:${type}`);
      }
    });
    
    return suggestions.slice(0, 10);
  }

  private generateWarnings(query: string, resultCount: number): string[] {
    const warnings: string[] = [];
    
    if (resultCount === 0) {
      warnings.push('No cards found matching your search criteria.');
    }
    
    if (query.length < 2) {
      warnings.push('Search query is too short. Try adding more characters.');
    }
    
    return warnings;
  }

  private addToSearchHistory(query: string): void {
    this.searchHistory = [query, ...this.searchHistory.filter(q => q !== query)].slice(0, 50);
  }

  // Public utility methods
  getSearchHistory(): string[] {
    return [...this.searchHistory];
  }

  saveSearch(name: string, query: SearchQuery): void {
    this.savedSearches.set(name, query);
  }

  getSavedSearches(): Map<string, SearchQuery> {
    return new Map(this.savedSearches);
  }

  getAutocompleteSuggestions(partial: string): SearchSuggestion[] {
    const suggestions: SearchSuggestion[] = [];
    const partialLower = partial.toLowerCase();
    
    // Card names
    this.nameIndex.forEach((card, name) => {
      if (name.startsWith(partialLower)) {
        suggestions.push({ text: card.name, type: 'card' });
      }
    });
    
    // Keywords
    this.keywordIndex.forEach((cardIds, keyword) => {
      if (keyword.startsWith(partialLower)) {
        suggestions.push({ 
          text: keyword, 
          type: 'keyword', 
          count: cardIds.size 
        });
      }
    });
    
    return suggestions.slice(0, 20);
  }

  updateCards(cards: KonivrCard[]): void {
    this.cards = cards;
    this.buildSearchIndex();
  }
}

// Types for internal query parsing
interface QueryToken {
  type: 'field' | 'term' | 'operator' | 'paren';
  value: string;
  field?: string;
  operator?: string;
}

interface ParsedQuery {
  conditions: QueryCondition[];
  operator: 'and' | 'or';
}

interface QueryCondition {
  type: 'field' | 'text';
  field?: string;
  value: string;
  operator: string;
}

export default ScryfallSearchEngine;