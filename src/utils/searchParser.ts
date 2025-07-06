/**
 * KONIVRER Deck Database - Advanced Search Parser
 * 
 * Parses advanced search syntax and filters cards accordingly
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

// Import types from comprehensiveSearchEngine
import { Card } from './comprehensiveSearchEngine';

// Token types
export enum TokenType {
  KEYWORD = 'keyword',
  OPERATOR = 'operator',
  VALUE = 'value',
  LOGICAL = 'logical',
  GROUP_START = 'group_start',
  GROUP_END = 'group_end'
}

// Operators
export enum Operator {
  EQUALS = ':',
  NOT_EQUALS = '!:',
  GREATER_THAN = '>',
  LESS_THAN = '<',
  GREATER_THAN_EQUALS = '>=',
  LESS_THAN_EQUALS = '<=',
  CONTAINS = '~',
  NOT_CONTAINS = '!~',
  STARTS_WITH = '^',
  ENDS_WITH = '$',
  REGEX = 'r:'
}

// Logical operators
export enum LogicalOperator {
  AND = 'AND',
  OR = 'OR',
  NOT = 'NOT'
}

// Token interface
export interface Token {
  type: TokenType;
  value: string;
  position: number;
}

// Filter interface
export interface Filter {
  field: string;
  operator: Operator;
  value: string | number | boolean;
  negate?: boolean;
}

// Group interface
export interface FilterGroup {
  filters: (Filter | FilterGroup)[];
  operator: LogicalOperator;
}

// Field mapping for common search terms
const FIELD_MAPPING: Record<string, string> = {
  name: 'name',
  title: 'name',
  text: 'text',
  type: 'type',
  subtype: 'subtype',
  rarity: 'rarity',
  cost: 'cost',
  power: 'power',
  defense: 'defense',
  element: 'element',
  faction: 'faction',
  keyword: 'keywords',
  ability: 'abilities',
  flavor: 'flavorText',
  artist: 'artist',
  set: 'setCode',
  collection: 'setName',
  number: 'collectorNumber',
  id: 'id',
  foil: 'foil',
  promo: 'promo',
  fullart: 'fullArt',
  altart: 'alternateArt',
  date: 'releaseDate',
  legal: 'legality',
  price: 'price',
  tag: 'tags'
};

// Operator mapping for search syntax
const OPERATOR_MAPPING: Record<string, Operator> = {
  ':': Operator.EQUALS,
  '=': Operator.EQUALS,
  '!:': Operator.NOT_EQUALS,
  '!=': Operator.NOT_EQUALS,
  '>': Operator.GREATER_THAN,
  '<': Operator.LESS_THAN,
  '>=': Operator.GREATER_THAN_EQUALS,
  '<=': Operator.LESS_THAN_EQUALS,
  '~': Operator.CONTAINS,
  '!~': Operator.NOT_CONTAINS,
  '^': Operator.STARTS_WITH,
  '$': Operator.ENDS_WITH,
  'r:': Operator.REGEX
};

/**
 * Parse advanced search query and return filtered cards
 * @param query - The search query
 * @param cards - Array of card objects
 * @returns Filtered cards
 */
export const parseSearchQuery = (query: string, cards: Card[]): Card[] => {
  if (!query || !cards) return [];
  
  // If query is less than 2 characters, return empty array
  if (query.trim().length < 2) return [];
  
  try {
    const tokens = tokenizeQuery(query);
    const filters = parseTokens(tokens);
    return applyFilters(cards, filters);
  } catch (error) {
    console.warn('Error parsing search query:', error);
    // Fallback to simple text search
    return simpleTextSearch(query, cards);
  }
};

/**
 * Tokenize the search query into searchable components
 */
const tokenizeQuery = (query: string): Token[] => {
  const tokens: Token[] = [];
  let current = '';
  let inQuotes = false;
  let quoteChar = '';
  
  for (let i = 0; i < query.length; i++) {
    const char = query[i];
    const nextChar = query[i + 1] || '';
    
    // Handle quotes
    if ((char === '"' || char === "'") && (i === 0 || query[i - 1] !== '\\')) {
      if (!inQuotes) {
        // Start of quoted string
        inQuotes = true;
        quoteChar = char;
        
        // If we have accumulated text, add it as a token
        if (current) {
          tokens.push({
            type: determineTokenType(current),
            value: current,
            position: i - current.length
          });
          current = '';
        }
      } else if (char === quoteChar) {
        // End of quoted string
        inQuotes = false;
        tokens.push({
          type: TokenType.VALUE,
          value: current,
          position: i - current.length
        });
        current = '';
      } else {
        // Quote character inside another type of quote
        current += char;
      }
      continue;
    }
    
    if (inQuotes) {
      // Inside quotes, just accumulate the character
      current += char;
      continue;
    }
    
    // Handle spaces (token separators)
    if (char === ' ') {
      if (current) {
        tokens.push({
          type: determineTokenType(current),
          value: current,
          position: i - current.length
        });
        current = '';
      }
      continue;
    }
    
    // Handle operators
    if (isOperatorChar(char)) {
      // Check for two-character operators
      const twoCharOp = char + nextChar;
      if (isOperator(twoCharOp)) {
        // We have a two-character operator
        if (current) {
          tokens.push({
            type: determineTokenType(current),
            value: current,
            position: i - current.length
          });
          current = '';
        }
        
        tokens.push({
          type: TokenType.OPERATOR,
          value: twoCharOp,
          position: i
        });
        
        // Skip the next character
        i++;
        continue;
      }
      
      // Single character operator
      if (isOperator(char)) {
        if (current) {
          tokens.push({
            type: determineTokenType(current),
            value: current,
            position: i - current.length
          });
          current = '';
        }
        
        tokens.push({
          type: TokenType.OPERATOR,
          value: char,
          position: i
        });
        continue;
      }
    }
    
    // Handle parentheses for grouping
    if (char === '(') {
      if (current) {
        tokens.push({
          type: determineTokenType(current),
          value: current,
          position: i - current.length
        });
        current = '';
      }
      
      tokens.push({
        type: TokenType.GROUP_START,
        value: '(',
        position: i
      });
      continue;
    }
    
    if (char === ')') {
      if (current) {
        tokens.push({
          type: determineTokenType(current),
          value: current,
          position: i - current.length
        });
        current = '';
      }
      
      tokens.push({
        type: TokenType.GROUP_END,
        value: ')',
        position: i
      });
      continue;
    }
    
    // Accumulate the character
    current += char;
  }
  
  // Add any remaining token
  if (current) {
    tokens.push({
      type: determineTokenType(current),
      value: current,
      position: query.length - current.length
    });
  }
  
  return tokens;
};

/**
 * Determine the type of a token based on its value
 */
const determineTokenType = (value: string): TokenType => {
  const upperValue = value.toUpperCase();
  
  // Check for logical operators
  if (upperValue === 'AND' || upperValue === 'OR' || upperValue === 'NOT') {
    return TokenType.LOGICAL;
  }
  
  // Check if it's a field name
  if (Object.keys(FIELD_MAPPING).includes(value.toLowerCase())) {
    return TokenType.KEYWORD;
  }
  
  // Default to value
  return TokenType.VALUE;
};

/**
 * Check if a character is part of an operator
 */
const isOperatorChar = (char: string): boolean => {
  return [
    ':', '=', '!', '>', '<', '~', '^', '$', 'r'
  ].includes(char);
};

/**
 * Check if a string is a valid operator
 */
const isOperator = (str: string): boolean => {
  return Object.keys(OPERATOR_MAPPING).includes(str);
};

/**
 * Parse tokens into a filter structure
 */
const parseTokens = (tokens: Token[]): FilterGroup => {
  const rootGroup: FilterGroup = {
    filters: [],
    operator: LogicalOperator.AND // Default to AND
  };
  
  let currentGroup = rootGroup;
  const groupStack: FilterGroup[] = [];
  
  // Track the current state
  let currentField: string | null = null;
  let currentOperator: Operator | null = null;
  let expectingValue = false;
  let lastLogicalOperator: LogicalOperator = LogicalOperator.AND;
  
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const nextToken = i < tokens.length - 1 ? tokens[i + 1] : null;
    
    switch (token.type) {
      case TokenType.KEYWORD:
        // Field name
        currentField = FIELD_MAPPING[token.value.toLowerCase()] || token.value.toLowerCase();
        
        // If the next token is not an operator, assume equals
        if (!nextToken || nextToken.type !== TokenType.OPERATOR) {
          currentOperator = Operator.EQUALS;
          expectingValue = true;
        }
        break;
        
      case TokenType.OPERATOR:
        // Operator
        currentOperator = OPERATOR_MAPPING[token.value] || Operator.EQUALS;
        expectingValue = true;
        break;
        
      case TokenType.VALUE:
        // Value
        if (expectingValue && currentField && currentOperator) {
          // Create a filter
          const filter: Filter = {
            field: currentField,
            operator: currentOperator,
            value: parseValue(token.value, currentField)
          };
          
          currentGroup.filters.push(filter);
          
          // Reset state
          currentField = null;
          currentOperator = null;
          expectingValue = false;
        } else {
          // Standalone value, treat as text search
          const filter: Filter = {
            field: 'text',
            operator: Operator.CONTAINS,
            value: token.value
          };
          
          currentGroup.filters.push(filter);
        }
        break;
        
      case TokenType.LOGICAL:
        // Logical operator
        const logicalOp = token.value.toUpperCase() as LogicalOperator;
        
        if (logicalOp === LogicalOperator.NOT) {
          // NOT applies to the next filter
          if (nextToken && (nextToken.type === TokenType.KEYWORD || nextToken.type === TokenType.VALUE)) {
            // Skip this token and handle in the next iteration
            continue;
          }
        } else {
          // AND or OR
          currentGroup.operator = logicalOp;
          lastLogicalOperator = logicalOp;
        }
        break;
        
      case TokenType.GROUP_START:
        // Start of a group
        const newGroup: FilterGroup = {
          filters: [],
          operator: lastLogicalOperator
        };
        
        // Add to current group and push to stack
        currentGroup.filters.push(newGroup);
        groupStack.push(currentGroup);
        currentGroup = newGroup;
        break;
        
      case TokenType.GROUP_END:
        // End of a group
        if (groupStack.length > 0) {
          currentGroup = groupStack.pop()!;
        }
        break;
    }
  }
  
  return rootGroup;
};

/**
 * Parse a value based on the field type
 */
const parseValue = (value: string, field: string): string | number | boolean => {
  // Handle numeric fields
  if (['cost', 'power', 'defense'].includes(field)) {
    const num = parseFloat(value);
    return isNaN(num) ? value : num;
  }
  
  // Handle boolean fields
  if (['foil', 'promo', 'fullArt', 'alternateArt'].includes(field)) {
    const lowerValue = value.toLowerCase();
    if (['true', 'yes', 'y', '1'].includes(lowerValue)) {
      return true;
    }
    if (['false', 'no', 'n', '0'].includes(lowerValue)) {
      return false;
    }
  }
  
  // Default to string
  return value;
};

/**
 * Apply filters to cards
 */
const applyFilters = (cards: Card[], filterGroup: FilterGroup): Card[] => {
  return cards.filter(card => evaluateFilterGroup(card, filterGroup));
};

/**
 * Evaluate a filter group against a card
 */
const evaluateFilterGroup = (card: Card, group: FilterGroup): boolean => {
  if (group.filters.length === 0) {
    return true;
  }
  
  const results = group.filters.map(filter => {
    if ('field' in filter) {
      // It's a simple filter
      return evaluateFilter(card, filter);
    } else {
      // It's a nested group
      return evaluateFilterGroup(card, filter);
    }
  });
  
  // Apply the logical operator
  if (group.operator === LogicalOperator.AND) {
    return results.every(result => result);
  } else {
    return results.some(result => result);
  }
};

/**
 * Evaluate a single filter against a card
 */
const evaluateFilter = (card: Card, filter: Filter): boolean => {
  const { field, operator, value, negate } = filter;
  
  // Get the card value
  let cardValue = card[field];
  
  // Handle special fields
  if (field === 'text') {
    // Text search across multiple fields
    return evaluateTextSearch(card, value.toString(), operator, negate);
  }
  
  if (field === 'price' && typeof cardValue === 'object') {
    // Use average price for comparison
    cardValue = cardValue.average;
  }
  
  if (field === 'legality' && typeof cardValue === 'object') {
    // Check if legal in the specified format
    return evaluateLegalityFilter(cardValue, value.toString(), negate);
  }
  
  // Handle array fields
  if (Array.isArray(cardValue)) {
    return evaluateArrayFilter(cardValue, value.toString(), operator, negate);
  }
  
  // Handle undefined values
  if (cardValue === undefined || cardValue === null) {
    return negate ? true : false;
  }
  
  // Evaluate based on operator
  let result: boolean;
  
  switch (operator) {
    case Operator.EQUALS:
      result = compareValues(cardValue, value) === 0;
      break;
      
    case Operator.NOT_EQUALS:
      result = compareValues(cardValue, value) !== 0;
      break;
      
    case Operator.GREATER_THAN:
      result = compareValues(cardValue, value) > 0;
      break;
      
    case Operator.LESS_THAN:
      result = compareValues(cardValue, value) < 0;
      break;
      
    case Operator.GREATER_THAN_EQUALS:
      result = compareValues(cardValue, value) >= 0;
      break;
      
    case Operator.LESS_THAN_EQUALS:
      result = compareValues(cardValue, value) <= 0;
      break;
      
    case Operator.CONTAINS:
      result = String(cardValue).toLowerCase().includes(String(value).toLowerCase());
      break;
      
    case Operator.NOT_CONTAINS:
      result = !String(cardValue).toLowerCase().includes(String(value).toLowerCase());
      break;
      
    case Operator.STARTS_WITH:
      result = String(cardValue).toLowerCase().startsWith(String(value).toLowerCase());
      break;
      
    case Operator.ENDS_WITH:
      result = String(cardValue).toLowerCase().endsWith(String(value).toLowerCase());
      break;
      
    case Operator.REGEX:
      try {
        const regex = new RegExp(String(value), 'i');
        result = regex.test(String(cardValue));
      } catch (e) {
        result = false;
      }
      break;
      
    default:
      result = false;
  }
  
  return negate ? !result : result;
};

/**
 * Compare two values for sorting/filtering
 */
const compareValues = (a: any, b: any): number => {
  if (typeof a === 'number' && typeof b === 'string') {
    const bNum = parseFloat(b);
    if (!isNaN(bNum)) {
      b = bNum;
    }
  } else if (typeof a === 'string' && typeof b === 'number') {
    const aNum = parseFloat(a);
    if (!isNaN(aNum)) {
      a = aNum;
    }
  }
  
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }
  
  if (typeof a === 'boolean' && typeof b === 'boolean') {
    return a === b ? 0 : (a ? 1 : -1);
  }
  
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() - b.getTime();
  }
  
  if (typeof a === 'string' && typeof b === 'string') {
    return a.localeCompare(b);
  }
  
  // Convert to strings for comparison
  return String(a).localeCompare(String(b));
};

/**
 * Evaluate a text search across multiple card fields
 */
const evaluateTextSearch = (card: Card, value: string, operator: Operator, negate?: boolean): boolean => {
  // Fields to search in
  const fieldsToSearch = [
    'name',
    'type',
    'subtype',
    'flavorText',
    'abilities',
    'keywords'
  ];
  
  const searchValue = value.toLowerCase();
  
  // Check each field
  const results = fieldsToSearch.map(field => {
    const fieldValue = card[field];
    
    if (!fieldValue) return false;
    
    if (typeof fieldValue === 'string') {
      return evaluateStringFilter(fieldValue, searchValue, operator);
    } else if (Array.isArray(fieldValue)) {
      return evaluateArrayFilter(fieldValue, searchValue, operator);
    }
    
    return false;
  });
  
  // If any field matches, the card matches
  const result = results.some(r => r);
  return negate ? !result : result;
};

/**
 * Evaluate a string filter
 */
const evaluateStringFilter = (value: string, searchValue: string, operator: Operator): boolean => {
  const lowerValue = value.toLowerCase();
  
  switch (operator) {
    case Operator.EQUALS:
      return lowerValue === searchValue;
      
    case Operator.NOT_EQUALS:
      return lowerValue !== searchValue;
      
    case Operator.CONTAINS:
    case Operator.EQUALS: // Default for text search
      return lowerValue.includes(searchValue);
      
    case Operator.NOT_CONTAINS:
      return !lowerValue.includes(searchValue);
      
    case Operator.STARTS_WITH:
      return lowerValue.startsWith(searchValue);
      
    case Operator.ENDS_WITH:
      return lowerValue.endsWith(searchValue);
      
    case Operator.REGEX:
      try {
        const regex = new RegExp(searchValue, 'i');
        return regex.test(lowerValue);
      } catch (e) {
        return false;
      }
      
    default:
      return false;
  }
};

/**
 * Evaluate an array filter
 */
const evaluateArrayFilter = (values: any[], searchValue: string, operator: Operator, negate?: boolean): boolean => {
  if (!values || !Array.isArray(values)) return negate ? true : false;
  
  const results = values.map(item => {
    if (typeof item === 'string') {
      return evaluateStringFilter(item, searchValue, operator);
    } else {
      return evaluateStringFilter(String(item), searchValue, operator);
    }
  });
  
  // If any value matches, the array matches
  const result = results.some(r => r);
  return negate ? !result : result;
};

/**
 * Evaluate a legality filter
 */
const evaluateLegalityFilter = (legality: Record<string, boolean>, format: string, negate?: boolean): boolean => {
  const result = legality[format.toLowerCase()] === true;
  return negate ? !result : result;
};

/**
 * Simple text search fallback
 */
const simpleTextSearch = (query: string, cards: Card[]): Card[] => {
  const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0);
  
  if (searchTerms.length === 0) return [];
  
  return cards.filter(card => {
    // Fields to search in
    const fieldsToSearch = [
      'name',
      'type',
      'subtype',
      'flavorText',
      'abilities',
      'keywords'
    ];
    
    // Check if all search terms are found in at least one field
    return searchTerms.every(term => {
      return fieldsToSearch.some(field => {
        const value = card[field];
        
        if (!value) return false;
        
        if (typeof value === 'string') {
          return value.toLowerCase().includes(term);
        } else if (Array.isArray(value)) {
          return value.some(item => 
            typeof item === 'string' && item.toLowerCase().includes(term)
          );
        }
        
        return false;
      });
    });
  });
};

/**
 * Format a search query from a filter object
 * @param filters - Filter object
 * @returns Formatted search query string
 */
export const formatSearchQuery = (filters: FilterGroup): string => {
  const parts: string[] = [];
  
  filters.filters.forEach((filter, index) => {
    if (index > 0) {
      parts.push(filters.operator);
    }
    
    if ('field' in filter) {
      // Simple filter
      const fieldName = Object.entries(FIELD_MAPPING).find(
        ([_, value]) => value === filter.field
      )?.[0] || filter.field;
      
      const operatorStr = Object.entries(OPERATOR_MAPPING).find(
        ([_, value]) => value === filter.operator
      )?.[0] || ':';
      
      parts.push(`${fieldName}${operatorStr}${formatFilterValue(filter.value)}`);
    } else {
      // Group
      parts.push(`(${formatSearchQuery(filter)})`);
    }
  });
  
  return parts.join(' ');
};

/**
 * Format a filter value for display
 */
const formatFilterValue = (value: string | number | boolean): string => {
  if (typeof value === 'string' && value.includes(' ')) {
    return `"${value}"`;
  }
  return String(value);
};

/**
 * Suggest search completions based on partial input
 * @param partial - Partial search query
 * @param cards - Card data for suggestions
 * @returns Suggested completions
 */
export const suggestCompletions = (partial: string, cards: Card[]): string[] => {
  if (!partial || partial.length < 2) return [];
  
  const suggestions: string[] = [];
  const lowerPartial = partial.toLowerCase();
  
  // Suggest field names
  Object.keys(FIELD_MAPPING).forEach(field => {
    if (field.toLowerCase().startsWith(lowerPartial)) {
      suggestions.push(field + ':');
    }
  });
  
  // If partial ends with a field name and colon, suggest values
  const fieldMatch = partial.match(/(\w+):$/);
  if (fieldMatch) {
    const fieldName = fieldMatch[1].toLowerCase();
    const mappedField = FIELD_MAPPING[fieldName];
    
    if (mappedField) {
      // Get unique values for this field
      const values = new Set<string>();
      
      cards.forEach(card => {
        const value = card[mappedField];
        
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
      
      // Add top values as suggestions
      Array.from(values)
        .sort()
        .slice(0, 10)
        .forEach(value => {
          suggestions.push(`${fieldName}:${value}`);
        });
    }
  }
  
  // Suggest logical operators
  ['AND', 'OR', 'NOT'].forEach(op => {
    if (op.toLowerCase().startsWith(lowerPartial)) {
      suggestions.push(op);
    }
  });
  
  return suggestions;
};

export default {
  parseSearchQuery,
  formatSearchQuery,
  suggestCompletions
};