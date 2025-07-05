/**
 * KONIVRER Keyword System
 * This file implements the keyword system separate from the elemental system
 */

// Keyword types
export const KEYWORDS = {
  BRILLIANCE: 'brilliance',
  VOID: 'void',
  GUST: 'gust',
  SUBMERGED: 'submerged',
  INFERNO: 'inferno',
  STEADFAST: 'steadfast'
};

// Keyword symbols/icons
export const KEYWORD_SYMBOLS = {
  [KEYWORDS.BRILLIANCE]: '✦',
  [KEYWORDS.VOID]: '◯',
  [KEYWORDS.GUST]: '≋',
  [KEYWORDS.SUBMERGED]: '≈',
  [KEYWORDS.INFERNO]: '※',
  [KEYWORDS.STEADFAST]: '⬢'
};

// Keyword descriptions
export const KEYWORD_DESCRIPTIONS = {
  [KEYWORDS.BRILLIANCE]: 'Provides enhanced effects when conditions are met',
  [KEYWORDS.VOID]: 'Removes cards from play permanently',
  [KEYWORDS.GUST]: 'Affects movement and positioning',
  [KEYWORDS.SUBMERGED]: 'Interacts with hidden or face-down cards',
  [KEYWORDS.INFERNO]: 'Deals damage over time or area effects',
  [KEYWORDS.STEADFAST]: 'Provides defensive bonuses or resistance'
};

/**
 * Check if a card has a specific keyword
 * @param {Object} card - Card object
 * @param {string} keyword - Keyword to check for
 * @returns {boolean} Whether the card has the keyword
 */
export function hasKeyword(card, keyword) {
  return card.keywords && card.keywords.includes(keyword.toUpperCase());
}

/**
 * Get all keywords on a card
 * @param {Object} card - Card object
 * @returns {Array} Array of keywords on the card
 */
export function getCardKeywords(card) {
  return card.keywords || [];
}

/**
 * Apply keyword effects when a card is played
 * @param {Object} gameState - Current game state
 * @param {string} playerId - Player identifier
 * @param {Object} card - Card being played
 * @param {string} playMethod - How the card is being played (summon, spell, etc.)
 * @returns {Object} Updated game state
 */
export function applyKeywordEffects(gameState, playerId, card, playMethod) {
  const keywords = getCardKeywords(card);
  
  // Skip keyword resolution for Burst plays
  if (playMethod === 'burst') {
    return gameState;
  }
  
  keywords.forEach(keyword => {
    switch (keyword.toLowerCase()) {
      case KEYWORDS.BRILLIANCE:
        gameState = applyBrillianceEffect(gameState, playerId, card);
        break;
      case KEYWORDS.VOID:
        gameState = applyVoidEffect(gameState, playerId, card);
        break;
      case KEYWORDS.GUST:
        gameState = applyGustEffect(gameState, playerId, card);
        break;
      case KEYWORDS.SUBMERGED:
        gameState = applySubmergedEffect(gameState, playerId, card);
        break;
      case KEYWORDS.INFERNO:
        gameState = applyInfernoEffect(gameState, playerId, card);
        break;
      case KEYWORDS.STEADFAST:
        gameState = applySteadfastEffect(gameState, playerId, card);
        break;
    }
  });
  
  return gameState;
}

/**
 * Apply Brilliance keyword effect
 * @param {Object} gameState - Current game state
 * @param {string} playerId - Player identifier
 * @param {Object} card - Card with Brilliance keyword
 * @returns {Object} Updated game state
 */
function applyBrillianceEffect(gameState, playerId, card) {
  // Brilliance: Enhanced effects when conditions are met
  // Implementation depends on specific card abilities
  gameState.gameLog.push(`${card.name} triggers Brilliance effect`);
  return gameState;
}

/**
 * Apply Void keyword effect
 * @param {Object} gameState - Current game state
 * @param {string} playerId - Player identifier
 * @param {Object} card - Card with Void keyword
 * @returns {Object} Updated game state
 */
function applyVoidEffect(gameState, playerId, card) {
  // Void: Removes cards from play permanently
  gameState.gameLog.push(`${card.name} triggers Void effect`);
  return gameState;
}

/**
 * Apply Gust keyword effect
 * @param {Object} gameState - Current game state
 * @param {string} playerId - Player identifier
 * @param {Object} card - Card with Gust keyword
 * @returns {Object} Updated game state
 */
function applyGustEffect(gameState, playerId, card) {
  // Gust: Affects movement and positioning
  gameState.gameLog.push(`${card.name} triggers Gust effect`);
  return gameState;
}

/**
 * Apply Submerged keyword effect
 * @param {Object} gameState - Current game state
 * @param {string} playerId - Player identifier
 * @param {Object} card - Card with Submerged keyword
 * @returns {Object} Updated game state
 */
function applySubmergedEffect(gameState, playerId, card) {
  // Submerged: Interacts with hidden or face-down cards
  gameState.gameLog.push(`${card.name} triggers Submerged effect`);
  return gameState;
}

/**
 * Apply Inferno keyword effect
 * @param {Object} gameState - Current game state
 * @param {string} playerId - Player identifier
 * @param {Object} card - Card with Inferno keyword
 * @returns {Object} Updated game state
 */
function applyInfernoEffect(gameState, playerId, card) {
  // Inferno: Deals damage over time or area effects
  gameState.gameLog.push(`${card.name} triggers Inferno effect`);
  return gameState;
}

/**
 * Apply Steadfast keyword effect
 * @param {Object} gameState - Current game state
 * @param {string} playerId - Player identifier
 * @param {Object} card - Card with Steadfast keyword
 * @returns {Object} Updated game state
 */
function applySteadfastEffect(gameState, playerId, card) {
  // Steadfast: Provides defensive bonuses or resistance
  gameState.gameLog.push(`${card.name} triggers Steadfast effect`);
  return gameState;
}

/**
 * Check for keyword synergies on the field
 * @param {Object} gameState - Current game state
 * @param {string} playerId - Player identifier
 * @returns {Object} Updated game state
 */
export function checkKeywordSynergies(gameState, playerId) {
  const field = gameState.players[playerId].field;
  
  // Count keywords on field
  const keywordCounts = {
    [KEYWORDS.BRILLIANCE]: 0,
    [KEYWORDS.VOID]: 0,
    [KEYWORDS.GUST]: 0,
    [KEYWORDS.SUBMERGED]: 0,
    [KEYWORDS.INFERNO]: 0,
    [KEYWORDS.STEADFAST]: 0
  };
  
  // Count keywords across all cards on field
  field.forEach(card => {
    const keywords = getCardKeywords(card);
    keywords.forEach(keyword => {
      const normalizedKeyword = keyword.toLowerCase();
      if (keywordCounts.hasOwnProperty(normalizedKeyword)) {
        keywordCounts[normalizedKeyword]++;
      }
    });
  });
  
  // Apply synergy effects for multiple instances of same keyword
  for (const keyword in keywordCounts) {
    if (keywordCounts[keyword] >= 2) {
      gameState = applyKeywordSynergy(gameState, playerId, keyword, keywordCounts[keyword]);
    }
  }
  
  return gameState;
}

/**
 * Apply keyword synergy effects
 * @param {Object} gameState - Current game state
 * @param {string} playerId - Player identifier
 * @param {string} keyword - Keyword type
 * @param {number} count - Number of instances
 * @returns {Object} Updated game state
 */
function applyKeywordSynergy(gameState, playerId, keyword, count) {
  switch (keyword) {
    case KEYWORDS.BRILLIANCE:
      // Multiple Brilliance cards enhance each other
      gameState.gameLog.push(`${playerId} has ${count} Brilliance cards - synergy activated`);
      break;
    case KEYWORDS.VOID:
      // Multiple Void cards increase removal power
      gameState.gameLog.push(`${playerId} has ${count} Void cards - enhanced removal`);
      break;
    case KEYWORDS.GUST:
      // Multiple Gust cards create wind storms
      gameState.gameLog.push(`${playerId} has ${count} Gust cards - wind storm effect`);
      break;
    case KEYWORDS.SUBMERGED:
      // Multiple Submerged cards create deeper effects
      gameState.gameLog.push(`${playerId} has ${count} Submerged cards - deep current effect`);
      break;
    case KEYWORDS.INFERNO:
      // Multiple Inferno cards spread fire
      gameState.gameLog.push(`${playerId} has ${count} Inferno cards - spreading flames`);
      break;
    case KEYWORDS.STEADFAST:
      // Multiple Steadfast cards create fortress effect
      gameState.gameLog.push(`${playerId} has ${count} Steadfast cards - fortress defense`);
      break;
  }
  
  return gameState;
}

/**
 * Get keyword display information for UI
 * @param {string} keyword - Keyword type
 * @returns {Object} Display information
 */
export function getKeywordDisplayInfo(keyword) {
  const normalizedKeyword = keyword.toLowerCase();
  return {
    name: keyword.toUpperCase(),
    symbol: KEYWORD_SYMBOLS[normalizedKeyword] || '?',
    description: KEYWORD_DESCRIPTIONS[normalizedKeyword] || 'Unknown keyword'
  };
}