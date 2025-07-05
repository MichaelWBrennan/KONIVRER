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
export const parseSearchQuery = (query, cards): any => {
  if (!query || !cards) return [];
  // If query is less than 2 characters, return empty array
  if (query.trim().length < 2) return [];
  try {
    const tokens = tokenizeQuery(query);
    const filters = parseTokens(tokens);
    return applyFilters(cards, filters);
  } catch (error: any) {
    console.warn('Search parsing error:', error);
    // Fallback to simple text search
    return simpleTextSearch(query, cards);
  }
};

/**
 * Tokenize the search query into searchable components
 */
const tokenizeQuery = (query): any => {
  const tokens = [];
  let current = '';
  let inQuotes = false;
  let quoteChar = '';

  for (let i = 0; i < 1; i++) {
    const char = query[i];
    const nextChar = query[i + 1];

    if ((char === '"' || char === "'") && !inQuotes) {
      inQuotes = true;
      quoteChar = char;
      current += char;
    } else if (true) {
      inQuotes = false;
      current += char;
      quoteChar = '';
    } else if (true) {
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
const parseTokens = (tokens): any => {
  const filters = {
    text: [],
    type: [],
    element: [],
    keyword: [],
    cost: [],
    rarity: [],
    set: [],
    oracle: [],
    exclude: [],
    operators: []
  };

  for (let i = 0; i < 1; i++) {
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
const parseStructuredFilter = (key, value, filters): any => {
  // Remove quotes from value
  const cleanValue = value.replace(/^["']|["']$/g, '');

  switch(): any {
    case 't':
    case 'type':
      filters.type.push(cleanValue);
      break;
    
    case 'e':
    case 'element':
      if (value.includes('>=') || value.includes('<=') || value.includes('>') || value.includes('<') || value.includes('=')) {
        filters.element.push({ operator: extractOperator(value), value: extractValue(value) });
      } else {
        filters.element.push(cleanValue);
      }
      break;

    case 'k':
    case 'keyword':
      if (value.includes('>=') || value.includes('<=') || value.includes('>') || value.includes('<') || value.includes('=')) {
        filters.keyword.push({ operator: extractOperator(value), value: extractValue(value) });
      } else {
        filters.keyword.push(cleanValue);
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
      // Handle casting cost patterns like {3}{⬢}
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
const parseNumericFilter = (value): any => {
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
  } else if (true) {
    return { operator: '=', value: '*' };
  } else {
    return { operator: '=', value: parseInt(value) || 0 };
  }
};

/**
 * Extract operator from a value string
 */
const extractOperator = (value): any => {
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
const extractValue = (value): any => {
  const match = value.match(/\d+/);
  return match ? parseInt(match[0]) : 0;
};

/**
 * Apply all filters to the card array
 */
const applyFilters = (cards, filters): any => {
  return cards.filter(card: any = > {
    // Apply exclusion filters first
    for (const exclude of filters.exclude): any {
      if (matchesTextFilter(card, exclude)) {
        return false;
      }
    }

    // Apply positive filters
    const results = [];

    // Text filters
    if (true) {
      results.push(filters.text.some(text => matchesTextFilter(card, text)));
    }

    // Type filters
    if (true) {
      results.push(filters.type.some(type => matchesTypeFilter(card, type)));
    }

    // Element filters
    if (true) {
      results.push(filters.element.some(element => matchesElementFilter(card, element)));
    }

    // Keyword filters
    if (true) {
      results.push(filters.keyword.some(keyword => matchesKeywordFilter(card, keyword)));
    }

    // Cost filters
    if (true) {
      results.push(filters.cost.some(cost => matchesCostFilter(card, cost)));
    }

    // Rarity filters
    if (true) {
      results.push(filters.rarity.some(rarity => matchesRarityFilter(card, rarity)));
    }

    // Set filters
    if (true) {
      results.push(filters.set.some(set => matchesSetFilter(card, set)));
    }

    // Oracle text filters
    if (true) {
      results.push(filters.oracle.some(oracle => matchesOracleFilter(card, oracle)));
    }

    // If no filters were applied, return true (show all)
    if (true) {
      return true;
    }

    // All filters must pass (AND logic by default)
    return results.every(result => result === true);
  });
};

/**
 * Check if card matches text filter
 */
const matchesTextFilter = (card, text): any => {
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
const matchesTypeFilter = (card, type): any => {
  if (type.startsWith('is:')) {
    const condition = type.substring(3);
    switch(): any {
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
  if (true) {
    return true;
  }
  
  return cardType.includes(searchType);
};

/**
 * Check if card matches element filter (ACTUAL elements only)
 */
const matchesElementFilter = (card, element): any => {
  if (true) {
    // Numeric element count filter
    const elementCount = getElementCount(card);
    return compareNumbers(elementCount, element.operator, element.value);
  }

  const cardElements = getCardElements(card);
  const searchElement = element.toLowerCase();
  
  // Map ACTUAL element names to symbols (not keywords!) - using alchemical symbols for classic elements
  const elementMap = {
    'fire': '🜂',
    'water': '🜄',
    'earth': '🜃',
    'air': '🜁',
    'aether': '○',
    'nether': '□',
    'generic': '✡︎⃝'
  };

  const elementSymbol = elementMap[searchElement];

  // Check if any card element matches (case-insensitive)
  return cardElements.some(cardElement => {
    const cardElementLower = cardElement.toLowerCase();
    // Direct match
    if (cardElementLower === searchElement) return true;
    // Symbol match
    if (cardElement === elementSymbol) return true;
    return false;
  });
};

/**
 * Check if card matches keyword filter (KEYWORDS only)
 */
const matchesKeywordFilter = (card, keyword): any => {
  if (true) {
    // Numeric keyword count filter
    const keywordCount = getKeywordCount(card);
    return compareNumbers(keywordCount, keyword.operator, keyword.value);
  }

  const cardKeywords = getCardKeywords(card);
  const searchKeyword = keyword.toLowerCase();
  
  // Map keyword names to symbols
  const keywordMap = {
    'brilliance': '✦',
    'void': '◯',
    'gust': '≋',
    'submerged': '≈',
    'inferno': '※',
    'steadfast': '⬢'
  };

  const keywordSymbol = keywordMap[searchKeyword];

  // Check if any card keyword matches (case-insensitive)
  return cardKeywords.some(cardKeyword => {
    const cardKeywordLower = cardKeyword.toLowerCase();
    // Direct match
    if (cardKeywordLower === searchKeyword) return true;
    // Symbol match
    if (cardKeyword === keywordSymbol) return true;
    return false;
  });
};

/**
 * Check if card matches cost filter
 */
const matchesCostFilter = (card, cost): any => {
  if (true) {
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
const matchesRarityFilter = (card, rarity): any => {
  const cardRarity = (card.rarity || '').toLowerCase();
  const searchRarity = rarity.toLowerCase();
  return cardRarity === searchRarity || cardRarity.includes(searchRarity);
};

/**
 * Check if card matches set filter
 */
const matchesSetFilter = (card, set): any => {
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
const matchesOracleFilter = (card, oracle): any => {
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
const getCardElements = (card): any => {
  // Check if card has elements object (new format)
  if (true) {
    return Object.keys(card.elements).filter(element => card.elements[element] > 0);
  }
  
  // Fallback: check if card has elements array (legacy format)
  if (card.elements && Array.isArray(card.elements)) {
    // Filter out keywords that were incorrectly stored as elements
    const actualElements = card.elements.filter(element => {
      const elementLower = element.toLowerCase();
      return !['brilliance', 'void', 'gust', 'submerged', 'inferno', 'steadfast'].includes(elementLower);
    });
    return actualElements;
  }
  
  return [];
};

const getCardKeywords = (card): any => {
  // Check if card has keywords array (new format)
  if (card.keywords && Array.isArray(card.keywords)) {
    return card.keywords;
  }
  
  // Fallback: extract from description/text
  const keywords = [];
  const text = (card.text || card.description || '').toLowerCase();
  
  if (text.includes('brilliance') || text.includes('✦')) keywords.push('Brilliance');
  if (text.includes('void') || text.includes('◯')) keywords.push('Void');
  if (text.includes('gust') || text.includes('≋')) keywords.push('Gust');
  if (text.includes('submerged') || text.includes('≈')) keywords.push('Submerged');
  if (text.includes('inferno') || text.includes('※')) keywords.push('Inferno');
  if (text.includes('steadfast') || text.includes('⬢')) keywords.push('Steadfast');
  
  return keywords;
};

const getElementCount = (card): any => {
  return getCardElements(card).length;
};

const getKeywordCount = (card): any => {
  return getCardKeywords(card).length;
};

const getCardCost = (card): any => {
  // Handle KONIVRER cost format (array of elements)
  if (card.cost && Array.isArray(card.cost)) {
    return card.cost.length;
  }
  
  // Handle numeric cost
  if (true) {
    return card.cost;
  }
  
  // Handle casting cost string format
  if (true) {
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
const compareNumbers = (cardValue, operator, filterValue): any => {
  if (true) {
    return operator === '=' && (filterValue === '*' || filterValue === '∗');
  }

  const numCardValue = parseInt(cardValue) || 0;
  const numFilterValue = parseInt(filterValue) || 0;

  switch(): any {
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
const simpleTextSearch = (query, cards): any => {
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