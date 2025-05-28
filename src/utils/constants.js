/**
 * Application constants
 */

// Element types
export const ELEMENTS = {
  AIR: 'air',
  FIRE: 'fire',
  EARTH: 'earth',
  WATER: 'water',
};

// Element symbols
export const ELEMENT_SYMBOLS = {
  [ELEMENTS.AIR]: '🜁',
  [ELEMENTS.FIRE]: '🜂',
  [ELEMENTS.EARTH]: '🜃',
  [ELEMENTS.WATER]: '🜄',
};

// Card rarities
export const RARITIES = {
  COMMON: 'common',
  UNCOMMON: 'uncommon',
  RARE: 'rare',
  LEGENDARY: 'legendary',
};

// Rarity colors
export const RARITY_COLORS = {
  [RARITIES.COMMON]: '#9ca3af',
  [RARITIES.UNCOMMON]: '#10b981',
  [RARITIES.RARE]: '#3b82f6',
  [RARITIES.LEGENDARY]: '#f59e0b',
};

// Deck constraints
export const DECK_CONSTRAINTS = {
  MIN_SIZE: 30,
  MAX_SIZE: 60,
  MAX_COPIES_PER_CARD: 3,
};

// API endpoints
export const API_ENDPOINTS = {
  CARDS: '/cards',
  DECKS: '/decks',
  USERS: '/users',
  AUTH: '/auth',
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_PREFERENCES: 'userPreferences',
  DECK_DRAFTS: 'deckDrafts',
};

// Animation durations (in milliseconds)
export const ANIMATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
};

// Breakpoints for responsive design
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
};

export default {
  ELEMENTS,
  ELEMENT_SYMBOLS,
  RARITIES,
  RARITY_COLORS,
  DECK_CONSTRAINTS,
  API_ENDPOINTS,
  STORAGE_KEYS,
  ANIMATIONS,
  BREAKPOINTS,
};
