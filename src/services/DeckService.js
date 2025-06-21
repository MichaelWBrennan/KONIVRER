/**
 * DeckService.js
 * 
 * Service for managing decks, providing integration between the deck builder,
 * card search, battle pass, and game engine.
 */

// Deck storage keys
const STORAGE_KEYS = {
  PLAYER_DECK: 'playerDeck',
  SAVED_DECKS: 'savedDecks',
  DECK_METADATA: 'deckMetadata',
  RECENT_DECKS: 'recentDecks',
  BATTLE_PASS_DECKS: 'battlePassDecks'
};

// Deck validation rules
const DECK_RULES = {
  MIN_CARDS: 60,
  MAX_CARDS: 100,
  MAX_COPIES: 4, // Maximum copies of a single card
  BANNED_CARDS: [], // IDs of banned cards
  RESTRICTED_CARDS: [] // IDs of restricted cards (limit 1 per deck)
};

/**
 * Save a deck to local storage
 * @param {Object} deck - The deck object to save
 * @param {string} deckName - Name of the deck
 * @param {string} deckId - Optional ID for the deck (generated if not provided)
 * @returns {string} The ID of the saved deck
 */
export const saveDeck = (deck, deckName, deckId = null) => {
  // Generate ID if not provided
  const id = deckId || `deck_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Get existing saved decks
  const savedDecks = JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED_DECKS) || '{}');
  
  // Create metadata
  const metadata = {
    id,
    name: deckName,
    created: Date.now(),
    lastModified: Date.now(),
    cardCount: deck.cards.length,
    colors: calculateDeckColors(deck)
  };
  
  // Save deck and metadata
  savedDecks[id] = deck;
  localStorage.setItem(STORAGE_KEYS.SAVED_DECKS, JSON.stringify(savedDecks));
  
  // Update metadata store
  const deckMetadata = JSON.parse(localStorage.getItem(STORAGE_KEYS.DECK_METADATA) || '{}');
  deckMetadata[id] = metadata;
  localStorage.setItem(STORAGE_KEYS.DECK_METADATA, JSON.stringify(deckMetadata));
  
  // Update recent decks list
  updateRecentDecks(id);
  
  return id;
};

/**
 * Load a deck from storage by ID
 * @param {string} deckId - ID of the deck to load
 * @returns {Object|null} The deck object or null if not found
 */
export const loadDeck = (deckId) => {
  const savedDecks = JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED_DECKS) || '{}');
  
  if (!savedDecks[deckId]) {
    console.error(`Deck with ID ${deckId} not found`);
    return null;
  }
  
  // Update recent decks list
  updateRecentDecks(deckId);
  
  return savedDecks[deckId];
};

/**
 * Delete a deck from storage
 * @param {string} deckId - ID of the deck to delete
 * @returns {boolean} Success status
 */
export const deleteDeck = (deckId) => {
  const savedDecks = JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED_DECKS) || '{}');
  const deckMetadata = JSON.parse(localStorage.getItem(STORAGE_KEYS.DECK_METADATA) || '{}');
  
  if (!savedDecks[deckId]) {
    return false;
  }
  
  // Remove deck and metadata
  delete savedDecks[deckId];
  delete deckMetadata[deckId];
  
  localStorage.setItem(STORAGE_KEYS.SAVED_DECKS, JSON.stringify(savedDecks));
  localStorage.setItem(STORAGE_KEYS.DECK_METADATA, JSON.stringify(deckMetadata));
  
  // Remove from recent decks
  const recentDecks = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECENT_DECKS) || '[]');
  const updatedRecentDecks = recentDecks.filter(id => id !== deckId);
  localStorage.setItem(STORAGE_KEYS.RECENT_DECKS, JSON.stringify(updatedRecentDecks));
  
  return true;
};

/**
 * Set the active player deck for the game
 * @param {string} deckId - ID of the deck to set as active
 * @returns {boolean} Success status
 */
export const setActivePlayerDeck = (deckId) => {
  const deck = loadDeck(deckId);
  
  if (!deck) {
    return false;
  }
  
  localStorage.setItem(STORAGE_KEYS.PLAYER_DECK, JSON.stringify(deck));
  return true;
};

/**
 * Get the active player deck
 * @returns {Object|null} The active deck or null if not set
 */
export const getActivePlayerDeck = () => {
  const deckData = localStorage.getItem(STORAGE_KEYS.PLAYER_DECK);
  return deckData ? JSON.parse(deckData) : null;
};

/**
 * Get all saved deck metadata
 * @returns {Array} Array of deck metadata objects
 */
export const getAllDeckMetadata = () => {
  const deckMetadata = JSON.parse(localStorage.getItem(STORAGE_KEYS.DECK_METADATA) || '{}');
  return Object.values(deckMetadata);
};

/**
 * Get recent decks
 * @param {number} limit - Maximum number of recent decks to return
 * @returns {Array} Array of deck metadata objects for recent decks
 */
export const getRecentDecks = (limit = 5) => {
  const recentDeckIds = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECENT_DECKS) || '[]');
  const deckMetadata = JSON.parse(localStorage.getItem(STORAGE_KEYS.DECK_METADATA) || '{}');
  
  return recentDeckIds
    .slice(0, limit)
    .map(id => deckMetadata[id])
    .filter(Boolean); // Filter out any null values
};

/**
 * Validate a deck against game rules
 * @param {Object} deck - The deck to validate
 * @returns {Object} Validation result with isValid flag and any errors
 */
export const validateDeck = (deck) => {
  const result = {
    isValid: true,
    errors: [],
    warnings: []
  };
  
  // Check card count
  if (deck.cards.length < DECK_RULES.MIN_CARDS) {
    result.isValid = false;
    result.errors.push(`Deck must contain at least ${DECK_RULES.MIN_CARDS} cards`);
  }
  
  if (deck.cards.length > DECK_RULES.MAX_CARDS) {
    result.isValid = false;
    result.errors.push(`Deck cannot contain more than ${DECK_RULES.MAX_CARDS} cards`);
  }
  
  // Check for too many copies of a card
  const cardCounts = {};
  deck.cards.forEach(card => {
    cardCounts[card.id] = (cardCounts[card.id] || 0) + 1;
  });
  
  Object.entries(cardCounts).forEach(([cardId, count]) => {
    // Skip basic resources
    if (isBasicResource(cardId)) return;
    
    if (count > DECK_RULES.MAX_COPIES) {
      result.isValid = false;
      result.errors.push(`Too many copies of card ${cardId} (max: ${DECK_RULES.MAX_COPIES})`);
    }
    
    // Check restricted list
    if (DECK_RULES.RESTRICTED_CARDS.includes(cardId) && count > 1) {
      result.isValid = false;
      result.errors.push(`Card ${cardId} is restricted (max: 1 copy)`);
    }
    
    // Check banned list
    if (DECK_RULES.BANNED_CARDS.includes(cardId)) {
      result.isValid = false;
      result.errors.push(`Card ${cardId} is banned`);
    }
  });
  
  return result;
};

/**
 * Import a deck from a deck code string
 * @param {string} deckCode - Encoded deck string
 * @returns {Object|null} Decoded deck object or null if invalid
 */
export const importDeckFromCode = (deckCode) => {
  try {
    // Base64 decode and parse
    const decodedString = atob(deckCode);
    const deckData = JSON.parse(decodedString);
    
    // Validate basic structure
    if (!deckData.cards || !Array.isArray(deckData.cards)) {
      throw new Error('Invalid deck format');
    }
    
    return deckData;
  } catch (error) {
    console.error('Failed to import deck:', error);
    return null;
  }
};

/**
 * Export a deck to a deck code string
 * @param {Object} deck - The deck to export
 * @returns {string} Encoded deck string
 */
export const exportDeckToCode = (deck) => {
  try {
    const deckString = JSON.stringify(deck);
    return btoa(deckString);
  } catch (error) {
    console.error('Failed to export deck:', error);
    return '';
  }
};

/**
 * Get decks unlocked from the battle pass
 * @returns {Array} Array of battle pass deck metadata
 */
export const getBattlePassDecks = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.BATTLE_PASS_DECKS) || '[]');
};

/**
 * Add a battle pass deck to the player's collection
 * @param {Object} deck - The deck to add
 * @param {string} source - Source of the deck (e.g., 'battle_pass_level_10')
 * @returns {string} ID of the saved deck
 */
export const addBattlePassDeck = (deck, source) => {
  const deckName = deck.name || `Battle Pass Deck (${new Date().toLocaleDateString()})`;
  const deckId = saveDeck(deck, deckName);
  
  // Update battle pass decks list
  const battlePassDecks = getBattlePassDecks();
  battlePassDecks.push({
    deckId,
    source,
    unlocked: Date.now()
  });
  
  localStorage.setItem(STORAGE_KEYS.BATTLE_PASS_DECKS, JSON.stringify(battlePassDecks));
  
  return deckId;
};

// Helper functions

/**
 * Update the recent decks list
 * @param {string} deckId - ID of the deck to add to recent list
 */
const updateRecentDecks = (deckId) => {
  const recentDecks = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECENT_DECKS) || '[]');
  
  // Remove if already in list
  const filteredDecks = recentDecks.filter(id => id !== deckId);
  
  // Add to front of list
  filteredDecks.unshift(deckId);
  
  // Keep only the 10 most recent
  const trimmedDecks = filteredDecks.slice(0, 10);
  
  localStorage.setItem(STORAGE_KEYS.RECENT_DECKS, JSON.stringify(trimmedDecks));
};

/**
 * Calculate the color identity of a deck
 * @param {Object} deck - The deck to analyze
 * @returns {Array} Array of color identities
 */
const calculateDeckColors = (deck) => {
  const colors = new Set();
  
  deck.cards.forEach(card => {
    if (card.colors && Array.isArray(card.colors)) {
      card.colors.forEach(color => colors.add(color));
    }
  });
  
  return Array.from(colors);
};

/**
 * Check if a card is a basic resource
 * @param {string} cardId - ID of the card to check
 * @returns {boolean} True if the card is a basic resource
 */
const isBasicResource = (cardId) => {
  // Basic resource IDs would be defined here
  const basicResourceIds = [
    'basic_fire',
    'basic_water',
    'basic_earth',
    'basic_air',
    'basic_void'
  ];
  
  return basicResourceIds.includes(cardId);
};

export default {
  saveDeck,
  loadDeck,
  deleteDeck,
  setActivePlayerDeck,
  getActivePlayerDeck,
  getAllDeckMetadata,
  getRecentDecks,
  validateDeck,
  importDeckFromCode,
  exportDeckToCode,
  getBattlePassDecks,
  addBattlePassDeck,
  STORAGE_KEYS,
  DECK_RULES
};