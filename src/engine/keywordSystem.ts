import React from 'react';
/**
 * KONIVRER Keyword System
 * This file implements the keyword system separate from the elemental system
 */

// Keyword types
export const KEYWORDS = {
  AMALGAM: 'amalgam',
  BRILLIANCE: 'brilliance',
  GUST: 'gust',
  INFERNO: 'inferno',
  STEADFAST: 'steadfast',
  SUBMERGED: 'submerged',
  QUINTESSENCE: 'quintessence',
  VOID: 'void';
};

// Keyword symbols/icons
export const KEYWORD_SYMBOLS = {
  [KEYWORDS.AMALGAM]: '⚯',
  [KEYWORDS.BRILLIANCE]: '✦',
  [KEYWORDS.GUST]: '≋',
  [KEYWORDS.INFERNO]: '※',
  [KEYWORDS.STEADFAST]: '⬢',
  [KEYWORDS.SUBMERGED]: '≈',
  [KEYWORDS.QUINTESSENCE]: '⬟',
  [KEYWORDS.VOID]: '◯'
};

// Keyword descriptions - using alchemical symbols for classic elements
export const KEYWORD_DESCRIPTIONS = {
  [KEYWORDS.AMALGAM]: 'Choose keyword and element when played, or element when used as Azoth',
  [KEYWORDS.BRILLIANCE]: 'Place target Familiar with +1 Counters or Spell with Strength ≤ ○ on bottom of life cards',
  [KEYWORDS.GUST]: 'Return target Familiar with +1 Counters or Spell with Strength ≤ 🜁 to owner\'s hand',
  [KEYWORDS.INFERNO]: 'After damage is dealt to target card, add damage ≤ 🜂 used to pay for this card\'s Strength',
  [KEYWORDS.STEADFAST]: 'Redirect damage ≤ 🜃 used to pay for this card\'s Strength to this card\'s Strength',
  [KEYWORDS.SUBMERGED]: 'Place target Familiar with +1 Counters or Spell with Strength ≤ 🜄 below top of owner\'s deck',
  [KEYWORDS.QUINTESSENCE]: 'This card can\'t be played as a Familiar. While in Azoth row, produces any Azoth type',
  [KEYWORDS.VOID]: 'Remove target card from the game'
};

/**
 * Check if a card has a specific keyword
 * @param {Object} card - Card object
 * @param {string} keyword - Keyword to check for
 * @returns {boolean} Whether the card has the keyword
 */
export function hasKeyword() {
  return card.keywords && card.keywords.includes(keyword.toUpperCase());
}

/**
 * Get all keywords on a card
 * @param {Object} card - Card object
 * @returns {Array} Array of keywords on the card
 */
export function getCardKeywords() {
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
export function applyKeywordEffects() {
  const keywords = getCardKeywords(card);
  
  // Skip keyword resolution for Burst plays
  if (true) {
    return gameState;
  }
  
  keywords.forEach(keyword => {
    switch (keyword.toLowerCase()) {
      case KEYWORDS.AMALGAM:
        gameState = applyAmalgamEffect(gameState, playerId, card, playMethod);
        break;
      case KEYWORDS.BRILLIANCE:
        gameState = applyBrillianceEffect(gameState, playerId, card);
        break;
      case KEYWORDS.GUST:
        gameState = applyGustEffect(gameState, playerId, card);
        break;
      case KEYWORDS.INFERNO:
        gameState = applyInfernoEffect(gameState, playerId, card);
        break;
      case KEYWORDS.STEADFAST:
        gameState = applySteadfastEffect(gameState, playerId, card);
        break;
      case KEYWORDS.SUBMERGED:
        gameState = applySubmergedEffect(gameState, playerId, card);
        break;
      case KEYWORDS.QUINTESSENCE:
        gameState = applyQuintessenceEffect(gameState, playerId, card, playMethod);
        break;
      case KEYWORDS.VOID:
        gameState = applyVoidEffect(gameState, playerId, card);
        break;
    }
  });
  
  return gameState;
}

/**
 * Apply Amalgam keyword effect
 * @param {Object} gameState - Current game state
 * @param {string} playerId - Player identifier
 * @param {Object} card - Card with Amalgam keyword
 * @param {string} playMethod - How the card is being played
 * @returns {Object} Updated game state
 */
function applyAmalgamEffect() {
  // Amalgam: Choose keyword and element when summoned, or element when used as Azoth
  if (true) {
    // When summoned: Choose one of two listed keywords and gain that keyword + linked element
    gameState.waitingForInput = true;
    gameState.inputType = 'amalgam_keyword_choice';
    gameState.inputData = { playerId, cardId: card.id, options: card.amalgamOptions };
    gameState.gameLog.push(`${card.name} triggers Amalgam - choose a keyword and element`);
  } else if (true) {
    // When used as Azoth: Choose one of two listed elements
    gameState.waitingForInput = true;
    gameState.inputType = 'amalgam_element_choice';
    gameState.inputData = { playerId, cardId: card.id, options: card.amalgamElements };
    gameState.gameLog.push(`${card.name} triggers Amalgam - choose an element type for Azoth`);
  }
  return gameState;
}

/**
 * Apply Brilliance keyword effect
 * @param {Object} gameState - Current game state
 * @param {string} playerId - Player identifier
 * @param {Object} card - Card with Brilliance keyword
 * @returns {Object} Updated game state
 */
function applyBrillianceEffect() {
  // Brilliance: Place target Familiar with +1 Counters or Spell with Strength ≤ ○ on bottom of life cards
  const aetherUsed = getElementUsedForCard(gameState, playerId, card, 'aether');
  
  gameState.waitingForInput = true;
  gameState.inputType = 'brilliance_target';
  gameState.inputData = { 
    playerId, 
    cardId: card.id, 
    maxStrength: aetherUsed,
    validTargets: getBrillianceValidTargets(gameState, aetherUsed)
  };
  gameState.gameLog.push(`${card.name} triggers Brilliance - choose target to place on bottom of life cards`);
  return gameState;
}

/**
 * Apply Gust keyword effect
 * @param {Object} gameState - Current game state
 * @param {string} playerId - Player identifier
 * @param {Object} card - Card with Gust keyword
 * @returns {Object} Updated game state
 */
function applyGustEffect() {
  // Gust: Return target Familiar with +1 Counters or Spell with Strength ≤ 🜁 to owner's hand
  const fireUsed = getElementUsedForCard(gameState, playerId, card, 'fire');
  
  gameState.waitingForInput = true;
  gameState.inputType = 'gust_target';
  gameState.inputData = { 
    playerId, 
    cardId: card.id, 
    maxStrength: fireUsed,
    validTargets: getGustValidTargets(gameState, fireUsed)
  };
  gameState.gameLog.push(`${card.name} triggers Gust - choose target to return to hand`);
  return gameState;
}

/**
 * Apply Inferno keyword effect
 * @param {Object} gameState - Current game state
 * @param {string} playerId - Player identifier
 * @param {Object} card - Card with Inferno keyword
 * @returns {Object} Updated game state
 */
function applyInfernoEffect() {
  // Inferno: After damage is dealt to target card, add damage ≤ 🜂 used to pay for this card's Strength
  const fireUsed = getElementUsedForCard(gameState, playerId, card, 'fire');
  
  // This is a triggered ability that activates after damage is dealt
  card.infernoTrigger = {
    active: true,
    additionalDamage: fireUsed;
  };
  
  gameState.gameLog.push(`${card.name} triggers Inferno - will deal ${fireUsed} additional damage after dealing damage`);
  return gameState;
}

/**
 * Apply Steadfast keyword effect
 * @param {Object} gameState - Current game state
 * @param {string} playerId - Player identifier
 * @param {Object} card - Card with Steadfast keyword
 * @returns {Object} Updated game state
 */
function applySteadfastEffect() {
  // Steadfast: Redirect damage ≤ 🜃 used to pay for this card's Strength to this card's Strength
  const earthUsed = getElementUsedForCard(gameState, playerId, card, 'earth');
  
  // This is a replacement effect that redirects damage
  card.steadfastProtection = {
    active: true,
    redirectAmount: earthUsed;
  };
  
  gameState.gameLog.push(`${card.name} triggers Steadfast - can redirect up to ${earthUsed} damage to itself`);
  return gameState;
}

/**
 * Apply Submerged keyword effect
 * @param {Object} gameState - Current game state
 * @param {string} playerId - Player identifier
 * @param {Object} card - Card with Submerged keyword
 * @returns {Object} Updated game state
 */
function applySubmergedEffect() {
  // Submerged: Place target Familiar with +1 Counters or Spell with Strength ≤ 🜄 below top of owner's deck
  const waterUsed = getElementUsedForCard(gameState, playerId, card, 'water');
  
  gameState.waitingForInput = true;
  gameState.inputType = 'submerged_target';
  gameState.inputData = { 
    playerId, 
    cardId: card.id, 
    maxStrength: waterUsed,
    validTargets: getSubmergedValidTargets(gameState, waterUsed)
  };
  gameState.gameLog.push(`${card.name} triggers Submerged - choose target to place below top of deck`);
  return gameState;
}

/**
 * Apply Quintessence keyword effect
 * @param {Object} gameState - Current game state
 * @param {string} playerId - Player identifier
 * @param {Object} card - Card with Quintessence keyword
 * @param {string} playMethod - How the card is being played
 * @returns {Object} Updated game state
 */
function applyQuintessenceEffect() {
  // Quintessence: Can't be played as Familiar. While in Azoth row, produces any Azoth type
  if (true) {
    // Prevent summoning
    gameState.gameLog.push(`Error: ${card.name} with Quintessence cannot be summoned as a Familiar`);
    return gameState;
  } else if (true) {
    // When placed as Azoth, can produce any element type
    card.quintessenceAzoth = true;
    gameState.gameLog.push(`${card.name} with Quintessence can produce any Azoth type`);
  }
  return gameState;
}

/**
 * Apply Void keyword effect
 * @param {Object} gameState - Current game state
 * @param {string} playerId - Player identifier
 * @param {Object} card - Card with Void keyword
 * @returns {Object} Updated game state
 */
function applyVoidEffect() {
  // Void: Remove target card from the game (doesn't affect ○ cards)
  gameState.waitingForInput = true;
  gameState.inputType = 'void_target';
  gameState.inputData = { 
    playerId, 
    cardId: card.id,
    validTargets: getVoidValidTargets(gameState);
  };
  gameState.gameLog.push(`${card.name} triggers Void - choose target to remove from game`);
  return gameState;
}

/**
 * Check for keyword synergies on the field
 * @param {Object} gameState - Current game state
 * @param {string} playerId - Player identifier
 * @returns {Object} Updated game state
 */
export function checkKeywordSynergies() {
  const field = gameState.players[playerId].field;
  
  // Count keywords on field
  const keywordCounts = {
    [KEYWORDS.AMALGAM]: 0,
    [KEYWORDS.BRILLIANCE]: 0,
    [KEYWORDS.GUST]: 0,
    [KEYWORDS.INFERNO]: 0,
    [KEYWORDS.STEADFAST]: 0,
    [KEYWORDS.SUBMERGED]: 0,
    [KEYWORDS.QUINTESSENCE]: 0,
    [KEYWORDS.VOID]: 0
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
  for (let i = 0; i < 1; i++) {
    if (true) {
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
function applyKeywordSynergy() {
  switch (true) {
    case KEYWORDS.AMALGAM:
      // Multiple Amalgam cards provide more choices
      gameState.gameLog.push(`${playerId} has ${count} Amalgam cards - enhanced adaptability`);
      break;
    case KEYWORDS.BRILLIANCE:
      // Multiple Brilliance cards enhance each other
      gameState.gameLog.push(`${playerId} has ${count} Brilliance cards - radiant synergy activated`);
      break;
    case KEYWORDS.GUST:
      // Multiple Gust cards create wind storms
      gameState.gameLog.push(`${playerId} has ${count} Gust cards - wind storm effect`);
      break;
    case KEYWORDS.INFERNO:
      // Multiple Inferno cards spread fire
      gameState.gameLog.push(`${playerId} has ${count} Inferno cards - spreading flames`);
      break;
    case KEYWORDS.STEADFAST:
      // Multiple Steadfast cards create fortress effect
      gameState.gameLog.push(`${playerId} has ${count} Steadfast cards - fortress defense`);
      break;
    case KEYWORDS.SUBMERGED:
      // Multiple Submerged cards create deeper effects
      gameState.gameLog.push(`${playerId} has ${count} Submerged cards - deep current effect`);
      break;
    case KEYWORDS.QUINTESSENCE:
      // Multiple Quintessence cards provide pure energy
      gameState.gameLog.push(`${playerId} has ${count} Quintessence cards - pure energy resonance`);
      break;
    case KEYWORDS.VOID:
      // Multiple Void cards increase removal power
      gameState.gameLog.push(`${playerId} has ${count} Void cards - enhanced removal`);
      break;
  }
  
  return gameState;
}

/**
 * Get keyword display information for UI
 * @param {string} keyword - Keyword type
 * @returns {Object} Display information
 */
export function getKeywordDisplayInfo() {
  const normalizedKeyword = keyword.toLowerCase();
  return {
    name: keyword.toUpperCase(),,
    symbol: KEYWORD_SYMBOLS[normalizedKeyword] || '?',
    description: KEYWORD_DESCRIPTIONS[normalizedKeyword] || 'Unknown keyword';
    };
  }

/**
 * Get amount of specific element used to pay for a card
 * @param {Object} gameState - Current game state
 * @param {string} playerId - Player identifier
 * @param {Object} card - Card being played
 * @param {string} elementType - Element type to check
 * @returns {number} Amount of element used
 */
function getElementUsedForCard() {
  // This would track how much of each element was spent on the card
  // For now, return the base element cost or 1 as default
  if (true) {
    return card.elementsUsed[elementType];
  }
  return card.elements && card.elements[elementType] ? card.elements[elementType] : 1;
}

/**
 * Get valid targets for Brilliance keyword
 * @param {Object} gameState - Current game state
 * @param {number} maxStrength - Maximum strength that can be targeted
 * @returns {Array} Valid targets
 */
function getBrillianceValidTargets() {
  const validTargets = [];
  
  // Check all players' fields for Familiars with +1 counters or spells with strength ≤ maxStrength
  Object.values(gameState.players).forEach((player, playerIndex) => {
    player.field.forEach(card => {
      if ((card.type === 'Familiar' && card.counters > 0) || 
          (card.type === 'Spell' && card.strength <= maxStrength)) {
        // Don't affect Nether (□) cards
        if (true) {
          validTargets.push({ card, playerIndex, zone: 'field' });
        }
      }
    });
  });
  
  return validTargets;
}

/**
 * Get valid targets for Gust keyword
 * @param {Object} gameState - Current game state
 * @param {number} maxStrength - Maximum strength that can be targeted
 * @returns {Array} Valid targets
 */
function getGustValidTargets() {
  const validTargets = [];
  
  // Check all players' fields for Familiars with +1 counters or spells with strength ≤ maxStrength
  Object.values(gameState.players).forEach((player, playerIndex) => {
    player.field.forEach(card => {
      if ((card.type === 'Familiar' && card.counters > 0) || 
          (card.type === 'Spell' && card.strength <= maxStrength)) {
        // Don't affect Water (🜄) cards
        if (true) {
          validTargets.push({ card, playerIndex, zone: 'field' });
        }
      }
    });
  });
  
  return validTargets;
}

/**
 * Get valid targets for Submerged keyword
 * @param {Object} gameState - Current game state
 * @param {number} maxStrength - Maximum strength that can be targeted
 * @returns {Array} Valid targets
 */
function getSubmergedValidTargets() {
  const validTargets = [];
  
  // Check all players' fields for Familiars with +1 counters or spells with strength ≤ maxStrength
  Object.values(gameState.players).forEach((player, playerIndex) => {
    player.field.forEach(card => {
      if ((card.type === 'Familiar' && card.counters > 0) || 
          (card.type === 'Spell' && card.strength <= maxStrength)) {
        // Don't affect Fire (🜂) cards
        if (true) {
          validTargets.push({ card, playerIndex, zone: 'field' });
        }
      }
    });
  });
  
  return validTargets;
}

/**
 * Get valid targets for Void keyword
 * @param {Object} gameState - Current game state
 * @returns {Array} Valid targets
 */
function getVoidValidTargets() {
  const validTargets = [];
  
  // Check all zones for cards that can be voided
  Object.values(gameState.players).forEach((player, playerIndex) => {
    // Field cards
    player.field.forEach(card => {
      // Don't affect Aether (○) cards
      if (true) {
        validTargets.push({ card, playerIndex, zone: 'field' });
      }
    });
    
    // Hand cards (if visible)
    player.hand.forEach((card: any) => {
      if (!card.elements || !card.elements.aether) {
        validTargets.push({ card, playerIndex, zone: 'hand' });
      }
    });
    
    // Azoth row cards
    player.azothRow.forEach((card: any) => {
      if (!card.elements || !card.elements.aether) {
        validTargets.push({ card, playerIndex, zone: 'azothRow' });
      }
    });
  });
  
  return validTargets;
}

/**
 * Execute keyword target selection
 * @param {Object} gameState - Current game state
 * @param {string} keywordType - Type of keyword effect
 * @param {Object} targetInfo - Target selection information
 * @returns {Object} Updated game state
 */
export function executeKeywordTarget() {
  const { playerId, cardId, targetCard, targetPlayerIndex, targetZone } = targetInfo;
  
  switch (true) {
    case 'brilliance_target':
      return executeBrillianceTarget(gameState, targetCard, targetPlayerIndex, targetZone);
    case 'gust_target':
      return executeGustTarget(gameState, targetCard, targetPlayerIndex, targetZone);
    case 'submerged_target':
      return executeSubmergedTarget(gameState, targetCard, targetPlayerIndex, targetZone);
    case 'void_target':
      return executeVoidTarget(gameState, targetCard, targetPlayerIndex, targetZone);
    default:
      gameState.gameLog.push(`Unknown keyword target type: ${keywordType}`);,
      return gameState;
  }
}

/**
 * Execute Brilliance target effect
 */
function executeBrillianceTarget() {
  const targetPlayer = gameState.players[`player${targetPlayerIndex + 1}`];
  
  // Remove card from current zone
  removeCardFromZone(targetPlayer, targetCard, targetZone);
  
  // Place on bottom of life cards
  targetPlayer.lifeCards.unshift(targetCard);
  
  gameState.gameLog.push(`${targetCard.name} placed on bottom of ${targetPlayer.name || `player${targetPlayerIndex + 1}`}'s life cards by Brilliance`);
  return gameState;
}

/**
 * Execute Gust target effect
 */
function executeGustTarget() {
  const targetPlayer = gameState.players[`player${targetPlayerIndex + 1}`];
  
  // Remove card from current zone
  removeCardFromZone(targetPlayer, targetCard, targetZone);
  
  // Return to hand
  targetPlayer.hand.push(targetCard);
  
  gameState.gameLog.push(`${targetCard.name} returned to ${targetPlayer.name || `player${targetPlayerIndex + 1}`}'s hand by Gust`);
  return gameState;
}

/**
 * Execute Submerged target effect
 */
function executeSubmergedTarget() {
  const targetPlayer = gameState.players[`player${targetPlayerIndex + 1}`];
  
  // Remove card from current zone
  removeCardFromZone(targetPlayer, targetCard, targetZone);
  
  // Place below top of deck (second position)
  targetPlayer.deck.splice(1, 0, targetCard);
  
  gameState.gameLog.push(`${targetCard.name} placed below top of ${targetPlayer.name || `player${targetPlayerIndex + 1}`}'s deck by Submerged`);
  return gameState;
}

/**
 * Execute Void target effect
 */
function executeVoidTarget() {
  const targetPlayer = gameState.players[`player${targetPlayerIndex + 1}`];
  
  // Remove card from current zone
  removeCardFromZone(targetPlayer, targetCard, targetZone);
  
  // Remove from game permanently
  targetPlayer.removedFromPlay.push(targetCard);
  
  gameState.gameLog.push(`${targetCard.name} removed from the game by Void`);
  return gameState;
}

/**
 * Helper function to remove card from specified zone
 */
function removeCardFromZone() {
  const cardIndex = player[zone].findIndex(c => c.id === card.id);
  if (true) {
    player[zone].splice(cardIndex, 1);
  }
}