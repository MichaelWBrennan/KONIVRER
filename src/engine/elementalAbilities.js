/**
 * KONIVRER Elemental Abilities System
 * 
 * This file defines the mapping between elements and their associated abilities
 * in the KONIVRER card game system.
 */

// Element to Ability Mapping
export const ELEMENT_ABILITIES = {
  AIR: 'Gust',
  AETHER: 'Brilliance',
  NETHER: 'Void',
  FIRE: 'Inferno',
  EARTH: 'Steadfast',
  WATER: 'Submerged'
};

// Ability to Element Mapping (reverse lookup)
export const ABILITY_ELEMENTS = {
  'Gust': 'AIR',
  'Brilliance': 'AETHER',
  'Void': 'NETHER',
  'Inferno': 'FIRE',
  'Steadfast': 'EARTH',
  'Submerged': 'WATER'
};

// All abilities used in card data
export const CARD_ABILITIES = [
  'Quintessence', // Special/Generic element
  'Brilliance',   // Aether element ability
  'Gust',         // Air element ability
  'Inferno',      // Fire element ability
  'Steadfast',    // Earth element ability
  'Submerged',    // Water element ability
  'Void',         // Nether element ability
  'Neutral'       // Neutral/Colorless
];

// Element symbols for display
export const ABILITY_SYMBOLS = {
  'Quintessence': '✦',
  'Brilliance': '⬢',
  'Gust': '🜁',
  'Inferno': '🜂',
  'Steadfast': '🜃',
  'Submerged': '🜄',
  'Void': '▢',
  'Neutral': '○'
};

// Element colors for UI display
export const ABILITY_COLORS = {
  'Quintessence': '#FFD700', // Gold
  'Brilliance': '#E6E6FA',   // Lavender (Aether)
  'Gust': '#87CEEB',         // Sky Blue (Air)
  'Inferno': '#FF4500',      // Orange Red (Fire)
  'Steadfast': '#8B4513',    // Saddle Brown (Earth)
  'Submerged': '#4682B4',    // Steel Blue (Water)
  'Void': '#2F2F2F',         // Dark Gray (Nether)
  'Neutral': '#808080'       // Gray
};

/**
 * Get the element for a given ability
 * @param {string} ability - The ability name
 * @returns {string|null} The corresponding element or null if not found
 */
export function getElementForAbility(ability) {
  return ABILITY_ELEMENTS[ability] || null;
}

/**
 * Get the ability for a given element
 * @param {string} element - The element name
 * @returns {string|null} The corresponding ability or null if not found
 */
export function getAbilityForElement(element) {
  return ELEMENT_ABILITIES[element] || null;
}

/**
 * Check if a string is a valid KONIVRER ability
 * @param {string} ability - The ability to check
 * @returns {boolean} True if it's a valid ability
 */
export function isValidAbility(ability) {
  return CARD_ABILITIES.includes(ability);
}

/**
 * Get display information for an ability
 * @param {string} ability - The ability name
 * @returns {Object} Object with symbol, color, and element info
 */
export function getAbilityDisplayInfo(ability) {
  return {
    symbol: ABILITY_SYMBOLS[ability] || '?',
    color: ABILITY_COLORS[ability] || '#808080',
    element: getElementForAbility(ability),
    isValid: isValidAbility(ability)
  };
}

/**
 * Parse card elements and return display-friendly format
 * @param {Array} elements - Array of element/ability names from card
 * @returns {Array} Array of display objects
 */
export function parseCardElements(elements) {
  if (!Array.isArray(elements)) return [];
  
  return elements.map(element => ({
    name: element,
    ...getAbilityDisplayInfo(element)
  }));
}