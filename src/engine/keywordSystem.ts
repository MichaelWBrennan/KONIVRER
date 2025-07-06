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
  VOID: 'void'
};

// Keyword symbols/icons
export const KEYWORD_SYMBOLS: Record<string, string> = {
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
export const KEYWORD_DESCRIPTIONS: Record<string, string> = {
  [KEYWORDS.AMALGAM]: 'Choose keyword and element when played, or element when used as Azoth',
  [KEYWORDS.BRILLIANCE]: 'Place target Familiar with +1 Counters or Spell with Strength ≤ ○ on bottom of life cards',
  [KEYWORDS.GUST]: 'Return target Familiar with +1 Counters or Spell with Strength ≤ 🜁 to owner\'s hand',
  [KEYWORDS.INFERNO]: 'After damage is dealt to target card, add damage ≤ 🜂 used to pay for this card\'s Strength',
  [KEYWORDS.STEADFAST]: 'Redirect damage ≤ 🜃 used to pay for this card\'s Strength to this card\'s Strength',
  [KEYWORDS.SUBMERGED]: 'Place target Familiar with +1 Counters or Spell with Strength ≤ 🜄 below top of owner\'s deck',
  [KEYWORDS.QUINTESSENCE]: 'This card can\'t be played as a Familiar. While in Azoth row, produces any Azoth type',
  [KEYWORDS.VOID]: 'Remove target card from the game'
};

interface Card {
  id: string;
  name: string;
  type?: string;
  keywords?: string[];
  elements?: Record<string, number>;
  elementsUsed?: Record<string, number>;
  strength?: number;
  counters?: number;
  amalgamOptions?: any[];
  amalgamElements?: any[];
  infernoTrigger?: {
    active: boolean;
    additionalDamage: number;
  };
  steadfastProtection?: {
    active: boolean;
    redirectAmount: number;
  };
  quintessenceAzoth?: boolean;
  [key: string]: any;
}

interface Player {
  field: Card[];
  hand: Card[];
  [key: string]: any;
}

interface GameState {
  players: Record<string, Player>;
  waitingForInput?: boolean;
  inputType?: string;
  inputData?: any;
  gameLog: string[];
  [key: string]: any;
}

interface Target {
  card: Card;
  playerIndex: number;
  zone: string;
}

/**
 * Check if a card has a specific keyword
 * @param card - Card object
 * @param keyword - Keyword to check for
 * @returns Whether the card has the keyword
 */
export function hasKeyword(card: Card, keyword: string): boolean {
  return card.keywords !== undefined && card.keywords.includes(keyword.toUpperCase());
}

/**
 * Get all keywords on a card
 * @param card - Card object
 * @returns Array of keywords on the card
 */
export function getCardKeywords(card: Card): string[] {
  return card.keywords || [];
}

/**
 * Apply keyword effects when a card is played
 * @param gameState - Current game state
 * @param playerId - Player identifier
 * @param card - Card being played
 * @param playMethod - How the card is being played (summon, spell, etc.)
 * @returns Updated game state
 */
export function applyKeywordEffects(gameState: GameState, playerId: string, card: Card, playMethod: string): GameState {
  const keywords = getCardKeywords(card);
  
  // Skip keyword resolution for Burst plays
  if (playMethod === 'burst') {
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
 * @param gameState - Current game state
 * @param playerId - Player identifier
 * @param card - Card with Amalgam keyword
 * @param playMethod - How the card is being played
 * @returns Updated game state
 */
function applyAmalgamEffect(gameState: GameState, playerId: string, card: Card, playMethod: string): GameState {
  // Amalgam: Choose keyword and element when summoned, or element when used as Azoth
  if (playMethod === 'summon') {
    // When summoned: Choose one of two listed keywords and gain that keyword + linked element
    gameState.waitingForInput = true;
    gameState.inputType = 'amalgam_keyword_choice';
    gameState.inputData = { playerId, cardId: card.id, options: card.amalgamOptions };
    gameState.gameLog.push(`${card.name} triggers Amalgam - choose a keyword and element`);
  } else if (playMethod === 'azoth') {
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
 * @param gameState - Current game state
 * @param playerId - Player identifier
 * @param card - Card with Brilliance keyword
 * @returns Updated game state
 */
function applyBrillianceEffect(gameState: GameState, playerId: string, card: Card): GameState {
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
  gameState.gameLog.push(`${card.name} triggers Brilliance - choose a target to place on bottom of life cards`);
  return gameState;
}

/**
 * Apply Gust keyword effect
 * @param gameState - Current game state
 * @param playerId - Player identifier
 * @param card - Card with Gust keyword
 * @returns Updated game state
 */
function applyGustEffect(gameState: GameState, playerId: string, card: Card): GameState {
  // Gust: Return target Familiar with +1 Counters or Spell with Strength ≤ 🜁 to owner's hand
  const airUsed = getElementUsedForCard(gameState, playerId, card, 'air');
  gameState.waitingForInput = true;
  gameState.inputType = 'gust_target';
  gameState.inputData = {
    playerId, 
    cardId: card.id, 
    maxStrength: airUsed,
    validTargets: getGustValidTargets(gameState, airUsed)
  };
  gameState.gameLog.push(`${card.name} triggers Gust - choose a target to return to owner's hand`);
  return gameState;
}

/**
 * Apply Inferno keyword effect
 * @param gameState - Current game state
 * @param playerId - Player identifier
 * @param card - Card with Inferno keyword
 * @returns Updated game state
 */
function applyInfernoEffect(gameState: GameState, playerId: string, card: Card): GameState {
  // Inferno: After damage is dealt to target card, add damage ≤ 🜂 used to pay for this card's Strength
  const fireUsed = getElementUsedForCard(gameState, playerId, card, 'fire');
  // This is a triggered ability that activates after damage is dealt
  card.infernoTrigger = {
    active: true,
    additionalDamage: fireUsed
  };
  
  gameState.gameLog.push(`${card.name} triggers Inferno - will add ${fireUsed} additional damage when damage is dealt`);
  return gameState;
}

/**
 * Apply Steadfast keyword effect
 * @param gameState - Current game state
 * @param playerId - Player identifier
 * @param card - Card with Steadfast keyword
 * @returns Updated game state
 */
function applySteadfastEffect(gameState: GameState, playerId: string, card: Card): GameState {
  // Steadfast: Redirect damage ≤ 🜃 used to pay for this card's Strength to this card's Strength
  const earthUsed = getElementUsedForCard(gameState, playerId, card, 'earth');
  // This is a replacement effect that redirects damage
  card.steadfastProtection = {
    active: true,
    redirectAmount: earthUsed
  };
  
  gameState.gameLog.push(`${card.name} triggers Steadfast - can redirect up to ${earthUsed} damage`);
  return gameState;
}

/**
 * Apply Submerged keyword effect
 * @param gameState - Current game state
 * @param playerId - Player identifier
 * @param card - Card with Submerged keyword
 * @returns Updated game state
 */
function applySubmergedEffect(gameState: GameState, playerId: string, card: Card): GameState {
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
  gameState.gameLog.push(`${card.name} triggers Submerged - choose a target to place below top of owner's deck`);
  return gameState;
}

/**
 * Apply Quintessence keyword effect
 * @param gameState - Current game state
 * @param playerId - Player identifier
 * @param card - Card with Quintessence keyword
 * @param playMethod - How the card is being played
 * @returns Updated game state
 */
function applyQuintessenceEffect(gameState: GameState, playerId: string, card: Card, playMethod: string): GameState {
  // Quintessence: Can't be played as Familiar. While in Azoth row, produces any Azoth type
  if (playMethod === 'summon') {
    // Prevent summoning
    gameState.gameLog.push(`${card.name} with Quintessence cannot be played as a Familiar`);
    return gameState;
  } else if (playMethod === 'azoth') {
    // When placed as Azoth, can produce any element type
    card.quintessenceAzoth = true;
    gameState.gameLog.push(`${card.name} with Quintessence can produce any Azoth type`);
  }
  return gameState;
}

/**
 * Apply Void keyword effect
 * @param gameState - Current game state
 * @param playerId - Player identifier
 * @param card - Card with Void keyword
 * @returns Updated game state
 */
function applyVoidEffect(gameState: GameState, playerId: string, card: Card): GameState {
  // Void: Remove target card from the game (doesn't affect ○ cards)
  gameState.waitingForInput = true;
  gameState.inputType = 'void_target';
  gameState.inputData = {
    playerId, 
    cardId: card.id,
    validTargets: getVoidValidTargets(gameState)
  };
  gameState.gameLog.push(`${card.name} triggers Void - choose a target to remove from the game`);
  return gameState;
}

/**
 * Check for keyword synergies on the field
 * @param gameState - Current game state
 * @param playerId - Player identifier
 * @returns Updated game state
 */
export function checkKeywordSynergies(gameState: GameState, playerId: string): GameState {
  const field = gameState.players[playerId].field;
  
  // Count keywords on field
  const keywordCounts: Record<string, number> = {
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
    if (card && card.keywords) {
      card.keywords.forEach(keyword => {
        const normalizedKeyword = keyword.toLowerCase();
        if (keywordCounts.hasOwnProperty(normalizedKeyword)) {
          keywordCounts[normalizedKeyword]++;
        }
      });
    }
  });
  
  // Apply synergy effects for multiple instances of same keyword
  for (const keyword in keywordCounts) {
    if (keywordCounts[keyword] > 1) {
      gameState = applyKeywordSynergy(gameState, playerId, keyword, keywordCounts[keyword]);
    }
  }
  
  return gameState;
}

/**
 * Apply keyword synergy effects
 * @param gameState - Current game state
 * @param playerId - Player identifier
 * @param keyword - Keyword type
 * @param count - Number of instances
 * @returns Updated game state
 */
function applyKeywordSynergy(gameState: GameState, playerId: string, keyword: string, count: number): GameState {
  switch (keyword) {
    case KEYWORDS.AMALGAM:
      // Multiple Amalgam cards provide more choices
      gameState.gameLog.push(`${count} Amalgam cards on field - increased element choices`);
      break;
    case KEYWORDS.BRILLIANCE:
      // Multiple Brilliance cards enhance each other
      gameState.gameLog.push(`${count} Brilliance cards on field - enhanced Aether effects`);
      break;
    case KEYWORDS.GUST:
      // Multiple Gust cards create wind storms
      gameState.gameLog.push(`${count} Gust cards on field - wind storm active`);
      break;
    case KEYWORDS.INFERNO:
      // Multiple Inferno cards spread fire
      gameState.gameLog.push(`${count} Inferno cards on field - fire spread active`);
      break;
    case KEYWORDS.STEADFAST:
      // Multiple Steadfast cards create fortress effect
      gameState.gameLog.push(`${count} Steadfast cards on field - fortress effect active`);
      break;
    case KEYWORDS.SUBMERGED:
      // Multiple Submerged cards create deeper effects
      gameState.gameLog.push(`${count} Submerged cards on field - deep waters active`);
      break;
    case KEYWORDS.QUINTESSENCE:
      // Multiple Quintessence cards provide pure energy
      gameState.gameLog.push(`${count} Quintessence cards on field - pure energy active`);
      break;
    case KEYWORDS.VOID:
      // Multiple Void cards increase removal power
      gameState.gameLog.push(`${count} Void cards on field - enhanced removal active`);
      break;
  }
  
  return gameState;
}

/**
 * Get keyword display information for UI
 * @param keyword - Keyword type
 * @returns Display information
 */
export function getKeywordDisplayInfo(keyword: string): { name: string; symbol: string; description: string } {
  const normalizedKeyword = keyword.toLowerCase();
  return {
    name: keyword.toUpperCase(),
    symbol: KEYWORD_SYMBOLS[normalizedKeyword] || '?',
    description: KEYWORD_DESCRIPTIONS[normalizedKeyword] || 'Unknown keyword'
  };
}

/**
 * Get amount of specific element used to pay for a card
 * @param gameState - Current game state
 * @param playerId - Player identifier
 * @param card - Card being played
 * @param elementType - Element type to check
 * @returns Amount of element used
 */
function getElementUsedForCard(gameState: GameState, playerId: string, card: Card, elementType: string): number {
  // This would track how much of each element was spent on the card
  // For now, return the base element cost or 1 as default
  if (card.elementsUsed && card.elementsUsed[elementType] !== undefined) {
    return card.elementsUsed[elementType];
  }
  return card.elements && card.elements[elementType] ? card.elements[elementType] : 1;
}

/**
 * Get valid targets for Brilliance keyword
 * @param gameState - Current game state
 * @param maxStrength - Maximum strength that can be targeted
 * @returns Valid targets
 */
function getBrillianceValidTargets(gameState: GameState, maxStrength: number): Target[] {
  const validTargets: Target[] = [];
  
  // Check all players' fields for Familiars with +1 counters or spells with strength ≤ maxStrength
  Object.entries(gameState.players).forEach(([_, player], playerIndex) => {
    player.field.forEach(card => {
      if (card && ((card.type === 'Familiar' && card.counters && card.counters > 0) || 
          (card.type === 'Spell' && card.strength !== undefined && card.strength <= maxStrength))) {
        // Don't affect Nether (□) cards
        if (!card.elements || !card.elements.nether) {
          validTargets.push({ card, playerIndex, zone: 'field' });
        }
      }
    });
  });
  
  return validTargets;
}

/**
 * Get valid targets for Gust keyword
 * @param gameState - Current game state
 * @param maxStrength - Maximum strength that can be targeted
 * @returns Valid targets
 */
function getGustValidTargets(gameState: GameState, maxStrength: number): Target[] {
  const validTargets: Target[] = [];
  
  // Check all players' fields for Familiars with +1 counters or spells with strength ≤ maxStrength
  Object.entries(gameState.players).forEach(([_, player], playerIndex) => {
    player.field.forEach(card => {
      if (card && ((card.type === 'Familiar' && card.counters && card.counters > 0) || 
          (card.type === 'Spell' && card.strength !== undefined && card.strength <= maxStrength))) {
        // Don't affect Water (🜄) cards
        if (!card.elements || !card.elements.water) {
          validTargets.push({ card, playerIndex, zone: 'field' });
        }
      }
    });
  });
  
  return validTargets;
}

/**
 * Get valid targets for Submerged keyword
 * @param gameState - Current game state
 * @param maxStrength - Maximum strength that can be targeted
 * @returns Valid targets
 */
function getSubmergedValidTargets(gameState: GameState, maxStrength: number): Target[] {
  const validTargets: Target[] = [];
  
  // Check all players' fields for Familiars with +1 counters or spells with strength ≤ maxStrength
  Object.entries(gameState.players).forEach(([_, player], playerIndex) => {
    player.field.forEach(card => {
      if (card && ((card.type === 'Familiar' && card.counters && card.counters > 0) || 
          (card.type === 'Spell' && card.strength !== undefined && card.strength <= maxStrength))) {
        // Don't affect Fire (🜂) cards
        if (!card.elements || !card.elements.fire) {
          validTargets.push({ card, playerIndex, zone: 'field' });
        }
      }
    });
  });
  
  return validTargets;
}

/**
 * Get valid targets for Void keyword
 * @param gameState - Current game state
 * @returns Valid targets
 */
function getVoidValidTargets(gameState: GameState): Target[] {
  const validTargets: Target[] = [];
  
  // Check all zones for cards that can be voided
  Object.entries(gameState.players).forEach(([_, player], playerIndex) => {
    // Field cards
    player.field.forEach(card => {
      if (card) {
        // Don't affect Aether (○) cards
        if (!card.elements || !card.elements.aether) {
          validTargets.push({ card, playerIndex, zone: 'field' });
        }
      }
    });
    
    // Hand cards (if visible)
    player.hand.forEach(card => {
      if (card && card.revealed) {
        // Don't affect Aether (○) cards
        if (!card.elements || !card.elements.aether) {
          validTargets.push({ card, playerIndex, zone: 'hand' });
        }
      }
    });
  });
  
  return validTargets;
}

export default {
  KEYWORDS,
  KEYWORD_SYMBOLS,
  KEYWORD_DESCRIPTIONS,
  hasKeyword,
  getCardKeywords,
  applyKeywordEffects,
  checkKeywordSynergies,
  getKeywordDisplayInfo
};