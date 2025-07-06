/**
 * KONIVRER Deck Database - Comprehensive Search Engine
 * Advanced search functionality with all Advanced features
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

// Card interface
export interface Card {
  id: string;
  name: string;
  type: string;
  subtype?: string;
  rarity: string;
  cost: number;
  power?: number;
  defense?: number;
  element?: string;
  faction?: string;
  abilities?: string[];
  keywords?: string[];
  flavorText?: string;
  artist?: string;
  setCode: string;
  setName: string;
  collectorNumber: string;
  imageUrl?: string;
  foil?: boolean;
  promo?: boolean;
  fullArt?: boolean;
  alternateArt?: boolean;
  releaseDate?: string;
  legality?: {
    standard: boolean;
    modern: boolean;
    legacy: boolean;
    vintage: boolean;
    commander: boolean;
    [key: string]: boolean;
  };
  price?: {
    low: number;
    average: number;
    high: number;
    foil?: number;
    trend?: number;
  };
  tags?: string[];
  [key: string]: any;
}

// Search criteria interface
export interface SearchCriteria {
  name?: string;
  text?: string;
  type?: string | string[];
  subtype?: string | string[];
  rarity?: string | string[];
  cost?: number | [number, number] | string;
  power?: number | [number, number] | string;
  defense?: number | [number, number] | string;
  element?: string | string[];
  faction?: string | string[];
  keyword?: string | string[];
  ability?: string;
  artist?: string;
  setCode?: string | string[];
  setName?: string;
  collectorNumber?: string;
  foil?: boolean;
  promo?: boolean;
  fullArt?: boolean;
  alternateArt?: boolean;
  releaseDate?: string | [string, string];
  legality?: string | string[];
  price?: number | [number, number] | string;
  tag?: string | string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  groupBy?: string;
  limit?: number;
  offset?: number;
  searchMode?: 'AND' | 'OR';
  fuzzy?: boolean;
  [key: string]: any;
}

// Search result group interface
export interface SearchResultGroup {
  key: string;
  label: string;
  cards: Card[];
}

// Sort options
export enum SortField {
  NAME = 'name',
  COST = 'cost',
  POWER = 'power',
  DEFENSE = 'defense',
  RARITY = 'rarity',
  TYPE = 'type',
  ELEMENT = 'element',
  FACTION = 'faction',
  SET = 'setCode',
  RELEASE_DATE = 'releaseDate',
  COLLECTOR_NUMBER = 'collectorNumber',
  PRICE = 'price'
}

// Rarity order for sorting
const RARITY_ORDER = {
  common: 1,
  uncommon: 2,
  rare: 3,
  'super-rare': 4,
  legendary: 5,
  mythic: 6,
  promo: 7
};

// Type order for sorting
const TYPE_ORDER = {
  character: 1,
  spell: 2,
  item: 3,
  location: 4,
  event: 5,
  quest: 6,
  token: 7
};

/**
 * Comprehensive search engine for KONIVRER cards
 * @param cards - Array of card objects
 * @param criteria - Search criteria object
 * @returns Filtered and sorted cards or grouped results
 */
export const searchCards = (
  cards: Card[], 
  criteria: SearchCriteria
): Card[] | SearchResultGroup[] => {
  // Validate inputs
  if (!cards || !Array.isArray(cards)) return [];
  if (!criteria || Object.keys(criteria).length === 0) return cards;
  
  let results: Card[] = [...cards];
  
  // Apply filters based on search mode (AND/OR)
  if (criteria.searchMode === 'OR') {
    results = searchWithOrMode(cards, criteria);
  } else {
    results = searchWithAndMode(cards, criteria);
  }
  
  // Sort results
  results = sortResults(results, criteria.sortBy || 'name', criteria.sortOrder || 'asc');
  
  // Group results if specified
  if (criteria.groupBy) {
    return groupResults(results, criteria.groupBy);
  }
  
  // Apply pagination if specified
  if (criteria.limit !== undefined) {
    const offset = criteria.offset || 0;
    results = results.slice(offset, offset + criteria.limit);
  }
  
  return results;
};

/**
 * Search with AND mode - all criteria must match
 */
const searchWithAndMode = (cards: Card[], criteria: SearchCriteria): Card[] => {
  return cards.filter(card => {
    return Object.entries(criteria).every(([key, value]) => {
      // Skip special keys used for controlling search behavior
      if (['sortBy', 'sortOrder', 'groupBy', 'limit', 'offset', 'searchMode', 'fuzzy'].includes(key)) {
        return true;
      }
      return matchesCriteria(card, key, value, criteria);
    });
  });
};

/**
 * Search with OR mode - any criteria can match
 */
const searchWithOrMode = (cards: Card[], criteria: SearchCriteria): Card[] => {
  return cards.filter(card => {
    return Object.entries(criteria).some(([key, value]) => {
      // Skip special keys used for controlling search behavior
      if (['sortBy', 'sortOrder', 'groupBy', 'limit', 'offset', 'searchMode', 'fuzzy'].includes(key)) {
        return false;
      }
      return matchesCriteria(card, key, value, criteria);
    });
  });
};

/**
 * Check if a card matches specific criteria
 */
const matchesCriteria = (
  card: Card, 
  key: string, 
  value: any, 
  criteria: SearchCriteria
): boolean => {
  // Handle null or undefined values
  if (value === null || value === undefined) return true;
  
  // Special case for text search (searches across multiple fields)
  if (key === 'text') {
    return matchesTextSearch(card, value, criteria.fuzzy || false);
  }
  
  // Handle price which is an object
  if (key === 'price') {
    return matchesPriceSearch(card, value);
  }
  
  // Handle legality which is an object
  if (key === 'legality') {
    return matchesLegalitySearch(card, value);
  }
  
  // Handle array criteria (OR logic within the array)
  if (Array.isArray(value)) {
    if (key === 'cost' || key === 'power' || key === 'defense' || key === 'releaseDate') {
      // Range search for numeric or date fields
      return matchesRangeSearch(card, key, value);
    }
    
    // Array of possible values (OR logic)
    return value.some(v => matchesSingleCriteria(card, key, v, criteria.fuzzy || false));
  }
  
  // Handle single value criteria
  return matchesSingleCriteria(card, key, value, criteria.fuzzy || false);
};

/**
 * Check if a card matches a single criterion
 */
const matchesSingleCriteria = (
  card: Card, 
  key: string, 
  value: any, 
  fuzzy: boolean
): boolean => {
  // Handle special keys that map to different card properties
  if (key === 'keyword') {
    return card.keywords ? 
      matchesArrayField(card.keywords, value, fuzzy) : false;
  }
  
  if (key === 'ability') {
    return card.abilities ? 
      matchesArrayField(card.abilities, value, fuzzy) : false;
  }
  
  if (key === 'tag') {
    return card.tags ? 
      matchesArrayField(card.tags, value, fuzzy) : false;
  }
  
  // Handle numeric comparisons with operators
  if (['cost', 'power', 'defense'].includes(key) && typeof value === 'string') {
    return matchesNumericOperator(card[key], value);
  }
  
  // Handle date range as string
  if (key === 'releaseDate' && typeof value === 'string' && value.includes('..')) {
    const [start, end] = value.split('..');
    return matchesDateRange(card.releaseDate || '', start, end);
  }
  
  // Handle regular field comparison
  const cardValue = card[key];
  
  // If card doesn't have this field, no match
  if (cardValue === undefined || cardValue === null) return false;
  
  // Handle different value types
  if (typeof cardValue === 'string') {
    if (fuzzy) {
      return cardValue.toLowerCase().includes(String(value).toLowerCase());
    } else {
      return cardValue.toLowerCase() === String(value).toLowerCase();
    }
  } else if (typeof cardValue === 'number') {
    if (typeof value === 'string') {
      return matchesNumericOperator(cardValue, value);
    }
    return cardValue === Number(value);
  } else if (typeof cardValue === 'boolean') {
    return cardValue === (value === 'true' || value === true);
  } else if (Array.isArray(cardValue)) {
    return matchesArrayField(cardValue, value, fuzzy);
  }
  
  // Default case
  return false;
};

/**
 * Check if a card matches text search across multiple fields
 */
const matchesTextSearch = (card: Card, text: string, fuzzy: boolean): boolean => {
  const searchText = text.toLowerCase();
  
  // Fields to search in
  const fieldsToSearch = [
    'name',
    'type',
    'subtype',
    'flavorText',
    'abilities',
    'keywords'
  ];
  
  return fieldsToSearch.some(field => {
    const value = card[field];
    
    if (!value) return false;
    
    if (typeof value === 'string') {
      return value.toLowerCase().includes(searchText);
    } else if (Array.isArray(value)) {
      return value.some(v => 
        typeof v === 'string' && v.toLowerCase().includes(searchText)
      );
    }
    
    return false;
  });
};

/**
 * Check if a card matches a price search
 */
const matchesPriceSearch = (card: Card, value: number | [number, number] | string): boolean => {
  if (!card.price) return false;
  
  const cardPrice = card.price.average;
  
  if (typeof value === 'number') {
    return cardPrice === value;
  } else if (Array.isArray(value)) {
    const [min, max] = value;
    return cardPrice >= min && cardPrice <= max;
  } else if (typeof value === 'string') {
    return matchesNumericOperator(cardPrice, value);
  }
  
  return false;
};

/**
 * Check if a card matches a legality search
 */
const matchesLegalitySearch = (card: Card, value: string | string[]): boolean => {
  if (!card.legality) return false;
  
  if (Array.isArray(value)) {
    // Check if card is legal in any of the specified formats
    return value.some(format => card.legality?.[format] === true);
  } else {
    // Check if card is legal in the specified format
    return card.legality[value] === true;
  }
};

/**
 * Check if a value matches a range search
 */
const matchesRangeSearch = (card: Card, key: string, range: [any, any]): boolean => {
  const [min, max] = range;
  const value = card[key];
  
  if (value === undefined || value === null) return false;
  
  if (key === 'releaseDate') {
    return matchesDateRange(value, min, max);
  } else {
    // Numeric range
    const numValue = Number(value);
    return numValue >= Number(min) && numValue <= Number(max);
  }
};

/**
 * Check if a date is within a range
 */
const matchesDateRange = (dateStr: string, startStr: string, endStr: string): boolean => {
  if (!dateStr) return false;
  
  try {
    const date = new Date(dateStr);
    const start = startStr ? new Date(startStr) : new Date(0);
    const end = endStr ? new Date(endStr) : new Date();
    
    return date >= start && date <= end;
  } catch (e) {
    return false;
  }
};

/**
 * Check if a numeric value matches an operator expression
 */
const matchesNumericOperator = (value: number | undefined, expression: string): boolean => {
  if (value === undefined || value === null) return false;
  
  // Handle various operator formats: >10, >=10, <10, <=10, =10, 10..20
  if (expression.includes('..')) {
    const [min, max] = expression.split('..').map(Number);
    return value >= min && value <= max;
  } else if (expression.startsWith('>=')) {
    return value >= Number(expression.substring(2));
  } else if (expression.startsWith('>')) {
    return value > Number(expression.substring(1));
  } else if (expression.startsWith('<=')) {
    return value <= Number(expression.substring(2));
  } else if (expression.startsWith('<')) {
    return value < Number(expression.substring(1));
  } else if (expression.startsWith('=')) {
    return value === Number(expression.substring(1));
  } else {
    return value === Number(expression);
  }
};

/**
 * Check if an array field contains a value
 */
const matchesArrayField = (array: any[], value: any, fuzzy: boolean): boolean => {
  if (!array || !Array.isArray(array)) return false;
  
  const searchValue = String(value).toLowerCase();
  
  return array.some(item => {
    const itemStr = String(item).toLowerCase();
    return fuzzy ? itemStr.includes(searchValue) : itemStr === searchValue;
  });
};

/**
 * Sort results based on specified field and order
 */
const sortResults = (
  cards: Card[], 
  sortBy: string = 'name', 
  sortOrder: 'asc' | 'desc' = 'asc'
): Card[] => {
  const direction = sortOrder === 'desc' ? -1 : 1;
  
  return [...cards].sort((a, b) => {
    let valueA: any;
    let valueB: any;
    
    // Handle special sort fields
    switch (sortBy) {
      case SortField.RARITY:
        valueA = RARITY_ORDER[a.rarity?.toLowerCase()] || 0;
        valueB = RARITY_ORDER[b.rarity?.toLowerCase()] || 0;
        break;
      
      case SortField.TYPE:
        valueA = TYPE_ORDER[a.type?.toLowerCase()] || 0;
        valueB = TYPE_ORDER[b.type?.toLowerCase()] || 0;
        break;
      
      case SortField.PRICE:
        valueA = a.price?.average || 0;
        valueB = b.price?.average || 0;
        break;
      
      case SortField.RELEASE_DATE:
        valueA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
        valueB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
        break;
      
      default:
        valueA = a[sortBy];
        valueB = b[sortBy];
    }
    
    // Handle undefined values
    if (valueA === undefined) valueA = sortOrder === 'asc' ? '' : Infinity;
    if (valueB === undefined) valueB = sortOrder === 'asc' ? '' : Infinity;
    
    // Compare values
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return direction * valueA.localeCompare(valueB);
    } else {
      return direction * (valueA - valueB);
    }
  });
};

/**
 * Group results by a specified field
 */
const groupResults = (cards: Card[], groupBy: string): SearchResultGroup[] => {
  const groups: Record<string, Card[]> = {};
  
  // Group cards
  cards.forEach(card => {
    let groupKey = String(card[groupBy] || 'Unknown');
    
    // Handle array fields
    if (Array.isArray(card[groupBy])) {
      // Create a group for each array value
      card[groupBy].forEach((value: any) => {
        const key = String(value);
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(card);
      });
      return;
    }
    
    // Handle special grouping cases
    if (groupBy === 'cost') {
      if (card.cost >= 7) {
        groupKey = '7+';
      }
    } else if (groupBy === 'releaseDate') {
      if (card.releaseDate) {
        const date = new Date(card.releaseDate);
        groupKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }
    }
    
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    
    groups[groupKey].push(card);
  });
  
  // Convert to array of groups
  const result: SearchResultGroup[] = Object.entries(groups).map(([key, cards]) => ({
    key,
    label: formatGroupLabel(key, groupBy),
    cards
  }));
  
  // Sort groups
  return sortGroups(result, groupBy);
};

/**
 * Format a group label based on the group key and field
 */
const formatGroupLabel = (key: string, groupBy: string): string => {
  switch (groupBy) {
    case 'type':
      return key.charAt(0).toUpperCase() + key.slice(1);
    
    case 'rarity':
      return key.charAt(0).toUpperCase() + key.slice(1);
    
    case 'cost':
      return `Cost: ${key}`;
    
    case 'element':
      return key.charAt(0).toUpperCase() + key.slice(1);
    
    case 'faction':
      return key.charAt(0).toUpperCase() + key.slice(1);
    
    case 'setCode':
      return `Set: ${key}`;
    
    case 'releaseDate':
      return key;
    
    default:
      return key;
  }
};

/**
 * Sort groups based on the grouping field
 */
const sortGroups = (groups: SearchResultGroup[], groupBy: string): SearchResultGroup[] => {
  switch (groupBy) {
    case 'cost':
      return groups.sort((a, b) => {
        if (a.key === '7+') return 1;
        if (b.key === '7+') return -1;
        return Number(a.key) - Number(b.key);
      });
    
    case 'rarity':
      return groups.sort((a, b) => {
        const orderA = RARITY_ORDER[a.key.toLowerCase()] || 0;
        const orderB = RARITY_ORDER[b.key.toLowerCase()] || 0;
        return orderA - orderB;
      });
    
    case 'type':
      return groups.sort((a, b) => {
        const orderA = TYPE_ORDER[a.key.toLowerCase()] || 0;
        const orderB = TYPE_ORDER[b.key.toLowerCase()] || 0;
        return orderA - orderB;
      });
    
    case 'releaseDate':
      return groups.sort((a, b) => a.key.localeCompare(b.key));
    
    default:
      return groups.sort((a, b) => a.key.localeCompare(b.key));
  }
};

/**
 * Advanced search with support for complex queries
 * @param cards - Array of card objects
 * @param query - Complex query string
 * @param options - Additional search options
 * @returns Filtered and sorted cards
 */
export const advancedSearch = (
  cards: Card[], 
  query: string, 
  options: Partial<SearchCriteria> = {}
): Card[] | SearchResultGroup[] => {
  // Parse query into criteria
  const parsedCriteria = parseQueryString(query);
  
  // Merge with additional options
  const criteria: SearchCriteria = {
    ...parsedCriteria,
    ...options
  };
  
  return searchCards(cards, criteria);
};

/**
 * Parse a complex query string into search criteria
 */
const parseQueryString = (query: string): SearchCriteria => {
  const criteria: SearchCriteria = {};
  
  if (!query) return criteria;
  
  // Split by spaces, but respect quotes
  const tokens: string[] = [];
  let currentToken = '';
  let inQuotes = false;
  
  for (let i = 0; i < query.length; i++) {
    const char = query[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
      currentToken += char;
    } else if (char === ' ' && !inQuotes) {
      if (currentToken) {
        tokens.push(currentToken);
        currentToken = '';
      }
    } else {
      currentToken += char;
    }
  }
  
  if (currentToken) {
    tokens.push(currentToken);
  }
  
  // Process tokens
  tokens.forEach(token => {
    // Check for field:value syntax
    if (token.includes(':')) {
      const [field, ...valueParts] = token.split(':');
      let value = valueParts.join(':');
      
      // Remove quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      
      // Handle special operators
      if (value.includes('..') || value.startsWith('>') || value.startsWith('<') || value.startsWith('=')) {
        criteria[field] = value;
      } else if (field === 'type' || field === 'subtype' || field === 'rarity' || 
                field === 'element' || field === 'faction' || field === 'setCode' || 
                field === 'legality' || field === 'keyword' || field === 'tag') {
        // These fields support multiple values
        if (!criteria[field]) {
          criteria[field] = [];
        }
        
        if (Array.isArray(criteria[field])) {
          (criteria[field] as string[]).push(value);
        }
      } else {
        criteria[field] = value;
      }
    } else {
      // Plain text search
      if (!criteria.text) {
        criteria.text = token;
      } else {
        criteria.text += ' ' + token;
      }
    }
  });
  
  return criteria;
};

/**
 * Get unique values for a specific field across all cards
 * Useful for building filter options
 */
export const getUniqueValues = (cards: Card[], field: string): string[] => {
  const values = new Set<string>();
  
  cards.forEach(card => {
    const value = card[field];
    
    if (value === undefined || value === null) return;
    
    if (Array.isArray(value)) {
      value.forEach(v => {
        if (v !== undefined && v !== null) {
          values.add(String(v));
        }
      });
    } else {
      values.add(String(value));
    }
  });
  
  return Array.from(values).sort();
};

/**
 * Get statistics about the card collection
 */
export const getCollectionStats = (cards: Card[]): Record<string, any> => {
  if (!cards || !Array.isArray(cards) || cards.length === 0) {
    return {};
  }
  
  const stats: Record<string, any> = {
    totalCards: cards.length,
    byType: {},
    byRarity: {},
    byElement: {},
    byFaction: {},
    bySet: {},
    costDistribution: {
      '0': 0, '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7+': 0
    },
    averageCost: 0,
    totalValue: 0
  };
  
  let totalCost = 0;
  let cardsWithCost = 0;
  
  cards.forEach(card => {
    // Count by type
    const type = card.type || 'Unknown';
    stats.byType[type] = (stats.byType[type] || 0) + 1;
    
    // Count by rarity
    const rarity = card.rarity || 'Unknown';
    stats.byRarity[rarity] = (stats.byRarity[rarity] || 0) + 1;
    
    // Count by element
    if (card.element) {
      const element = card.element;
      stats.byElement[element] = (stats.byElement[element] || 0) + 1;
    }
    
    // Count by faction
    if (card.faction) {
      const faction = card.faction;
      stats.byFaction[faction] = (stats.byFaction[faction] || 0) + 1;
    }
    
    // Count by set
    const set = card.setCode || 'Unknown';
    stats.bySet[set] = (stats.bySet[set] || 0) + 1;
    
    // Cost distribution
    if (card.cost !== undefined) {
      const costKey = card.cost >= 7 ? '7+' : String(card.cost);
      stats.costDistribution[costKey] = (stats.costDistribution[costKey] || 0) + 1;
      
      totalCost += card.cost;
      cardsWithCost++;
    }
    
    // Total value
    if (card.price?.average) {
      stats.totalValue += card.price.average;
    }
  });
  
  // Calculate average cost
  stats.averageCost = cardsWithCost > 0 ? totalCost / cardsWithCost : 0;
  
  return stats;
};

export default {
  searchCards,
  advancedSearch,
  getUniqueValues,
  getCollectionStats
};