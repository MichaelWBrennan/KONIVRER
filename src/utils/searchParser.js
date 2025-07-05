/**
 * KONIVRER Deck Database - Advanced Search Parser
 * 
 * Parses advanced search syntax and filters cards accordingly
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

/**
 * Parse advanced search query and return filtered cards
 * @param {string} query - The search query
 * @param {Array} cards - Array of card objects
 * @returns {Array} Filtered cards
 */
export const parseSearchQuery = (query, cards) => {
  if (!query || !cards) return [];
  
  // If query is less than 2 characters, return empty array
  if (query.trim().length < 2) return [];

  try {
    const tokens = tokenizeQuery(query);
    const filters = parseTokens(tokens);
    return applyFilters(cards, filters);
  } catch (error) {
    console.warn('Search parsing error:', error);
    // Fallback to simple text search
    return simpleTextSearch(query, cards);
  }
};

/**
 * Tokenize the search query into searchable components
 */
const tokenizeQuery = (query) => {
  const tokens = [];
  let current = '';
  let inQuotes = false;
  let quoteChar = '';

  for (let i = 0; i < query.length; i++) {
    const char = query[i];
    const nextChar = query[i + 1];

    if ((char === '"' || char === "'") && !inQuotes) {
      inQuotes = true;
      quoteChar = char;
      current += char;
    } else if (char === quoteChar && inQuotes) {
      inQuotes = false;
      current += char;
      quoteChar = '';
    } else if (char === ' ' && !inQuotes) {
      if (current.trim()) {
        tokens.push(current.trim());
        current = '';
      }
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    tokens.push(current.trim());
  }

  return tokens;
};

/**
 * Parse tokens into filter objects
 */
const parseTokens = (tokens) => {
  const filters = {
    text: [],
    type: [],
    element: [],
    cost: [],
    rarity: [],
    set: [],
    oracle: [],
    exclude: [],
    operators: []
  };

  for (const token of tokens) {
    if (token.startsWith('-')) {
      // Exclusion filter
      filters.exclude.push(token.substring(1));
    } else if (token.includes(':')) {
      // Structured filter
      const [key, value] = token.split(':', 2);
      parseStructuredFilter(key.toLowerCase(), value, filters);
    } else if (token.toUpperCase() === 'OR' || token.toUpperCase() === 'AND') {
      // Logical operators
      filters.operators.push(token.toUpperCase());
    } else {
      // Plain text search
      filters.text.push(token);
    }
  }

  return filters;
};

/**
 * Parse structured filters like t:familiar, e:brilliance, etc.
 */
const parseStructuredFilter = (key, value, filters) => {
  // Remove quotes from value
  const cleanValue = value.replace(/^["']|["']$/g, '');

  switch (key) {
    case 't':
    case 'type':
      filters.type.push(cleanValue);
      break;
    
    case 'e':
    case 'element':
    case 'color':
      if (value.includes('>=') || value.includes('<=') || value.includes('>') || value.includes('<') || value.includes('=')) {
        filters.element.push({ operator: extractOperator(value), value: extractValue(value) });
      } else {
        filters.element.push(cleanValue);
      }
      break;
    
    case 'c':
    case 'cost':
      filters.cost.push(parseNumericFilter(value));
      break;
    
    case 'r':
    case 'rarity':
      filters.rarity.push(cleanValue);
      break;
    
    case 's':
    case 'set':
      filters.set.push(cleanValue);
      break;
    
    case 'o':
    case 'oracle':
    case 'text':
      filters.oracle.push(cleanValue);
      break;
    
    case 'mana':
      // Handle mana cost patterns like {3}{⬢}
      filters.cost.push({ type: 'mana', pattern: cleanValue });
      break;
    
    case 'is':
      // Handle special filters like is:permanent, is:spell
      filters.type.push(`is:${cleanValue}`);
      break;
    
    case 'game':
      // Handle game format filters
      filters.set.push(`game:${cleanValue}`);
      break;
    
    default:
      // Unknown filter, treat as text
      filters.text.push(`${key}:${value}`);
  }
};

/**
 * Parse numeric filters with operators
 */
const parseNumericFilter = (value) => {
  if (value.includes('>=')) {
    return { operator: '>=', value: parseInt(value.replace('>=', '')) };
  } else if (value.includes('<=')) {
    return { operator: '<=', value: parseInt(value.replace('<=', '')) };
  } else if (value.includes('>')) {
    return { operator: '>', value: parseInt(value.replace('>', '')) };
  } else if (value.includes('<')) {
    return { operator: '<', value: parseInt(value.replace('<', '')) };
  } else if (value.includes('=')) {
    return { operator: '=', value: parseInt(value.replace('=', '')) };
  } else if (value === '*') {
    return { operator: '=', value: '*' };
  } else {
    return { operator: '=', value: parseInt(value) || 0 };
  }
};

/**
 * Extract operator from a value string
 */
const extractOperator = (value) => {
  if (value.includes('>=')) return '>=';
  if (value.includes('<=')) return '<=';
  if (value.includes('>')) return '>';
  if (value.includes('<')) return '<';
  if (value.includes('=')) return '=';
  return '=';
};

/**
 * Extract numeric value from a string with operators
 */
const extractValue = (value) => {
  const match = value.match(/\d+/);
  return match ? parseInt(match[0]) : 0;
};

/**
 * Apply all filters to the card array
 */
const applyFilters = (cards, filters) => {
  return cards.filter(card => {
    // Apply exclusion filters first
    for (const exclude of filters.exclude) {
      if (matchesTextFilter(card, exclude)) {
        return false;
      }
    }

    // Apply positive filters
    const results = [];

    // Text filters
    if (filters.text.length > 0) {
      results.push(filters.text.some(text => matchesTextFilter(card, text)));
    }

    // Type filters
    if (filters.type.length > 0) {
      results.push(filters.type.some(type => matchesTypeFilter(card, type)));
    }

    // Element filters
    if (filters.element.length > 0) {
      results.push(filters.element.some(element => matchesElementFilter(card, element)));
    }

    // Cost filters
    if (filters.cost.length > 0) {
      results.push(filters.cost.some(cost => matchesCostFilter(card, cost)));
    }

    // Rarity filters
    if (filters.rarity.length > 0) {
      results.push(filters.rarity.some(rarity => matchesRarityFilter(card, rarity)));
    }

    // Set filters
    if (filters.set.length > 0) {
      results.push(filters.set.some(set => matchesSetFilter(card, set)));
    }

    // Oracle text filters
    if (filters.oracle.length > 0) {
      results.push(filters.oracle.some(oracle => matchesOracleFilter(card, oracle)));
    }

    // If no filters were applied, return true (show all)
    if (results.length === 0) {
      return true;
    }

    // All filters must pass (AND logic by default)
    return results.every(result => result === true);
  });
};

/**
 * Check if card matches text filter
 */
const matchesTextFilter = (card, text) => {
  const searchText = text.toLowerCase().replace(/^["']|["']$/g, '');
  const cardName = (card.name || '').toLowerCase();
  const cardText = (card.text || card.description || '').toLowerCase();
  const cardType = (card.type || '').toLowerCase();

  return cardName.includes(searchText) || 
         cardText.includes(searchText) || 
         cardType.includes(searchText);
};

/**
 * Check if card matches type filter
 */
const matchesTypeFilter = (card, type) => {
  if (type.startsWith('is:')) {
    const condition = type.substring(3);
    switch (condition) {
      case 'permanent':
        return ['elemental'].includes((card.type || '').toLowerCase());
      case 'spell':
        return ['φlag', 'flag'].includes((card.type || '').toLowerCase());
      default:
        return false;
    }
  }

  const cardType = (card.type || '').toLowerCase();
  const searchType = type.toLowerCase();
  
  // Handle special case: "flag" should match "ΦLAG"
  if (searchType === 'flag' && cardType === 'φlag') {
    return true;
  }
  
  return cardType.includes(searchType);
};

/**
 * Check if card matches element filter
 */
const matchesElementFilter = (card, element) => {
  if (typeof element === 'object') {
    // Numeric element count filter
    const elementCount = getElementCount(card);
    return compareNumbers(elementCount, element.operator, element.value);
  }

  const cardElements = getCardElements(card);
  const searchElement = element.toLowerCase();
  
  // Map element names to symbols
  const elementMap = {
    'brilliance': '⬢',
    'gust': '🜁',
    'inferno': '🜂',
    'steadfast': '🜃',
    'submerged': '🜄',
    'void': '▢',
    'quintessence': '✦'
  };

  const elementSymbol = elementMap[searchElement];
  
  // Check if any card element matches (case-insensitive)
  return cardElements.some(cardElement => 
    cardElement.toLowerCase() === searchElement ||
    cardElement === elementSymbol
  );
};

/**
 * Check if card matches cost filter
 */
const matchesCostFilter = (card, cost) => {
  if (cost.type === 'mana') {
    // Handle specific mana pattern matching
    const cardMana = card.manaCost || card.cost || '';
    return cardMana.includes(cost.pattern);
  }

  const cardCost = getCardCost(card);
  return compareNumbers(cardCost, cost.operator, cost.value);
};



/**
 * Check if card matches rarity filter
 */
const matchesRarityFilter = (card, rarity) => {
  const cardRarity = (card.rarity || '').toLowerCase();
  const searchRarity = rarity.toLowerCase();
  return cardRarity === searchRarity || cardRarity.includes(searchRarity);
};

/**
 * Check if card matches set filter
 */
const matchesSetFilter = (card, set) => {
  if (set.startsWith('game:')) {
    // Handle game format filters
    return true; // Assume all cards are legal for now
  }

  const cardSet = (card.set || '').toLowerCase();
  const searchSet = set.toLowerCase();
  return cardSet === searchSet || cardSet.includes(searchSet);
};

/**
 * Check if card matches oracle text filter
 */
const matchesOracleFilter = (card, oracle) => {
  const cardText = (card.text || card.description || '').toLowerCase();
  const searchText = oracle.toLowerCase().replace(/^["']|["']$/g, '');
  
  // Handle special oracle patterns
  if (searchText.includes('~/~')) {
    // Self-reference pattern
    const cardName = (card.name || '').toLowerCase();
    return cardText.includes(cardName);
  }

  return cardText.includes(searchText);
};

/**
 * Helper functions for card property extraction
 */
const getCardElements = (card) => {
  // First check if card has an elements array (KONIVRER format)
  if (card.elements && Array.isArray(card.elements)) {
    return card.elements;
  }
  
  // Fallback: extract from mana cost symbols
  const elements = [];
  const manaCost = card.manaCost || card.cost || '';
  const text = card.text || card.description || '';
  
  // Extract from mana cost symbols
  if (manaCost.includes('⬢')) elements.push('Brilliance');
  if (manaCost.includes('🜁')) elements.push('Gust');
  if (manaCost.includes('🜂')) elements.push('Inferno');
  if (manaCost.includes('🜃')) elements.push('Steadfast');
  if (manaCost.includes('🜄')) elements.push('Submerged');
  if (manaCost.includes('▢')) elements.push('Void');
  if (manaCost.includes('✦')) elements.push('Quintessence');
  
  return elements;
};

const getElementCount = (card) => {
  return getCardElements(card).length;
};

const getCardCost = (card) => {
  // Handle KONIVRER cost format (array of elements)
  if (card.cost && Array.isArray(card.cost)) {
    return card.cost.length;
  }
  
  // Handle numeric cost
  if (typeof card.cost === 'number') {
    return card.cost;
  }
  
  // Handle mana cost string format
  if (card.manaCost) {
    // Simple cost calculation - count numbers and symbols
    const cost = card.manaCost;
    const numbers = cost.match(/\d+/g);
    const symbols = (cost.match(/[⬢🜁🜂🜃🜄▢✦]/g) || []).length;
    const totalNumbers = numbers ? numbers.reduce((sum, num) => sum + parseInt(num), 0) : 0;
    return totalNumbers + symbols;
  }
  
  return 0;
};

/**
 * Compare numbers with operators
 */
const compareNumbers = (cardValue, operator, filterValue) => {
  if (cardValue === '*' || cardValue === '∗') {
    return operator === '=' && (filterValue === '*' || filterValue === '∗');
  }

  const numCardValue = parseInt(cardValue) || 0;
  const numFilterValue = parseInt(filterValue) || 0;

  switch (operator) {
    case '=': return numCardValue === numFilterValue;
    case '>=': return numCardValue >= numFilterValue;
    case '<=': return numCardValue <= numFilterValue;
    case '>': return numCardValue > numFilterValue;
    case '<': return numCardValue < numFilterValue;
    default: return false;
  }
};

/**
 * Fallback simple text search
 */
const simpleTextSearch = (query, cards) => {
  const searchTerm = query.toLowerCase();
  return cards.filter(card => {
    const cardName = (card.name || '').toLowerCase();
    const cardText = (card.text || card.description || '').toLowerCase();
    const cardType = (card.type || '').toLowerCase();
    
    return cardName.includes(searchTerm) || 
           cardText.includes(searchTerm) || 
           cardType.includes(searchTerm);
  });
};

export default parseSearchQuery;