/**
 * Utility helper functions
 */

import { ELEMENT_SYMBOLS, RARITY_COLORS } from './constants.js';

/**
 * Format a number with commas
 */
export const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num);
};

/**
 * Capitalize first letter of a string
 */
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Get element symbol by element type
 */
export const getElementSymbol = (element) => {
  return ELEMENT_SYMBOLS[element] || '?';
};

/**
 * Get rarity color by rarity type
 */
export const getRarityColor = (rarity) => {
  return RARITY_COLORS[rarity] || '#6b7280';
};

/**
 * Calculate deck statistics
 */
export const calculateDeckStats = (cards) => {
  const stats = {
    totalCards: 0,
    averageCost: 0,
    elementDistribution: {},
    rarityDistribution: {},
    costCurve: {},
  };

  if (!cards || cards.length === 0) {
    return stats;
  }

  let totalCost = 0;

  cards.forEach(({ card, quantity }) => {
    stats.totalCards += quantity;
    totalCost += card.cost * quantity;

    // Element distribution
    card.elements.forEach(element => {
      stats.elementDistribution[element] = (stats.elementDistribution[element] || 0) + quantity;
    });

    // Rarity distribution
    stats.rarityDistribution[card.rarity] = (stats.rarityDistribution[card.rarity] || 0) + quantity;

    // Cost curve
    stats.costCurve[card.cost] = (stats.costCurve[card.cost] || 0) + quantity;
  });

  stats.averageCost = stats.totalCards > 0 ? (totalCost / stats.totalCards).toFixed(1) : 0;

  return stats;
};

/**
 * Filter cards based on search criteria
 */
export const filterCards = (cards, filters) => {
  return cards.filter(card => {
    // Text search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesName = card.name.toLowerCase().includes(searchLower);
      const matchesText = card.text.toLowerCase().includes(searchLower);
      const matchesKeywords = card.keywords.some(keyword => 
        keyword.toLowerCase().includes(searchLower)
      );
      
      if (!matchesName && !matchesText && !matchesKeywords) {
        return false;
      }
    }

    // Element filter
    if (filters.elements && filters.elements.length > 0) {
      const hasMatchingElement = card.elements.some(element => 
        filters.elements.includes(element)
      );
      if (!hasMatchingElement) {
        return false;
      }
    }

    // Rarity filter
    if (filters.rarities && filters.rarities.length > 0) {
      if (!filters.rarities.includes(card.rarity)) {
        return false;
      }
    }

    // Cost filter
    if (filters.costRange) {
      const [minCost, maxCost] = filters.costRange;
      if (card.cost < minCost || card.cost > maxCost) {
        return false;
      }
    }

    // Power filter
    if (filters.powerRange) {
      const [minPower, maxPower] = filters.powerRange;
      if (card.power < minPower || card.power > maxPower) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Sort cards based on criteria
 */
export const sortCards = (cards, sortBy, sortOrder = 'asc') => {
  const sorted = [...cards].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'cost':
        aValue = a.cost;
        bValue = b.cost;
        break;
      case 'power':
        aValue = a.power;
        bValue = b.power;
        break;
      case 'rarity':
        const rarityOrder = { common: 1, uncommon: 2, rare: 3, legendary: 4 };
        aValue = rarityOrder[a.rarity] || 0;
        bValue = rarityOrder[b.rarity] || 0;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted;
};

/**
 * Debounce function calls
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Generate a unique ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Deep clone an object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if deck is valid
 */
export const validateDeck = (cards) => {
  const errors = [];
  const cardCounts = {};

  // Count cards
  cards.forEach(({ card, quantity }) => {
    cardCounts[card.id] = (cardCounts[card.id] || 0) + quantity;
  });

  // Check deck size
  const totalCards = Object.values(cardCounts).reduce((sum, count) => sum + count, 0);
  if (totalCards < 30) {
    errors.push(`Deck must have at least 30 cards (currently ${totalCards})`);
  }
  if (totalCards > 60) {
    errors.push(`Deck cannot have more than 60 cards (currently ${totalCards})`);
  }

  // Check card limits
  Object.entries(cardCounts).forEach(([cardId, count]) => {
    if (count > 3) {
      const card = cards.find(c => c.card.id === cardId)?.card;
      errors.push(`Cannot have more than 3 copies of ${card?.name || 'a card'} (currently ${count})`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export default {
  formatNumber,
  capitalize,
  getElementSymbol,
  getRarityColor,
  calculateDeckStats,
  filterCards,
  sortCards,
  debounce,
  generateId,
  deepClone,
  validateDeck,
};