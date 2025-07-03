/**
 * KONIVRER Card Data
 * This file defines the card data structure and sample cards
 */

import { ELEMENTS } from '../engine/elementalSystem';

/**
 * Generate a unique card ID
 * @returns {string} Unique card ID
 */
function generateCardId() {
  return 'card-' + Math.random().toString(36).substring(2, 9);
}

/**
 * Create a Familiar card
 * @param {string} name - Card name
 * @param {Object} elements - Elemental costs
 * @param {number} baseStrength - Base strength
 * @param {number} baseHealth - Base health
 * @param {Array} abilities - Card abilities
 * @param {string} flavorText - Flavor text
 * @param {string} set - Card set
 * @param {string} rarity - Card rarity
 * @param {string} setNumber - Card set number
 * @returns {Object} Familiar card object
 */
export function createFamiliar(name, elements, baseStrength, baseHealth, abilities, flavorText, set, rarity, setNumber) {
  return {
    id: generateCardId(),
    name,
    type: 'Familiar',
    elements,
    baseStrength,
    baseHealth,
    strength: baseStrength,
    health: baseHealth,
    abilities,
    flavorText,
    set,
    rarity,
    setNumber,
    counters: 0,
    summoningSickness: true,
    tapped: false
  };
}

/**
 * Create a Spell card
 * @param {string} name - Card name
 * @param {Object} elements - Elemental costs
 * @param {Array} abilities - Card abilities
 * @param {string} flavorText - Flavor text
 * @param {string} set - Card set
 * @param {string} rarity - Card rarity
 * @param {string} setNumber - Card set number
 * @returns {Object} Spell card object
 */
export function createSpell(name, elements, abilities, flavorText, set, rarity, setNumber) {
  return {
    id: generateCardId(),
    name,
    type: 'Spell',
    elements,
    abilities,
    flavorText,
    set,
    rarity,
    setNumber
  };
}

/**
 * Create a Flag card
 * @param {string} name - Card name
 * @param {Object} elements - Elemental costs
 * @param {string} primaryElement - Primary element
 * @param {string} strongAgainst - Element strong against
 * @param {Array} abilities - Card abilities
 * @param {string} flavorText - Flavor text
 * @param {string} set - Card set
 * @param {string} rarity - Card rarity
 * @param {string} setNumber - Card set number
 * @returns {Object} Flag card object
 */
export function createFlag(name, elements, primaryElement, strongAgainst, abilities, flavorText, set, rarity, setNumber) {
  return {
    id: generateCardId(),
    name,
    type: 'Flag',
    elements,
    primaryElement,
    strongAgainst,
    abilities,
    flavorText,
    set,
    rarity,
    setNumber
  };
}

// Sample cards
export const sampleCards = {
  // Familiars
  dragonLord: createFamiliar(
    'Dragon Lord',
    { [ELEMENTS.FIRE]: 2, [ELEMENTS.GENERIC]: 3 },
    5,
    5,
    [
      {
        trigger: 'enter',
        effect: 'When this card enters the field, deal 2 damage to target Familiar.',
        implementation: (gameState, playerId, targetId) => {
          // Implementation would go here
          return gameState;
        }
      }
    ],
    'The ancient dragons ruled the skies with fire and fury.',
    'Alpha',
    'rare',
    '1/63'
  ),
  
  mysticSage: createFamiliar(
    'Mystic Sage',
    { [ELEMENTS.WATER]: 1, [ELEMENTS.AETHER]: 1, [ELEMENTS.GENERIC]: 1 },
    2,
    3,
    [
      {
        trigger: 'enter',
        effect: 'When this card enters the field, draw a card.',
        implementation: (gameState, playerId) => {
          // Implementation would go here
          return gameState;
        }
      }
    ],
    'Knowledge flows like water through the mind of the sage.',
    'Alpha',
    'uncommon',
    '12/63'
  ),
  
  shadowAssassin: createFamiliar(
    'Shadow Assassin',
    { [ELEMENTS.NETHER]: 1, [ELEMENTS.GENERIC]: 1 },
    2,
    1,
    [
      {
        trigger: 'enter',
        effect: 'When this card enters the field, target Familiar gets -1/-1 until end of turn.',
        implementation: (gameState, playerId, targetId) => {
          // Implementation would go here
          return gameState;
        }
      }
    ],
    'Death comes silently from the shadows.',
    'Alpha',
    'common',
    '23/63'
  ),
  
  // Spells
  inferno: createSpell(
    'Inferno',
    { [ELEMENTS.FIRE]: 1, [ELEMENTS.GENERIC]: 2 },
    [
      {
        effect: 'Deal ⊗ damage to all Familiars.',
        implementation: (gameState, playerId, genericValue) => {
          // Implementation would go here
          return gameState;
        }
      }
    ],
    'The world burned in a sea of flames.',
    'Alpha',
    'uncommon',
    '34/63'
  ),
  
  timeWarp: createSpell(
    'Time Warp',
    { [ELEMENTS.AETHER]: 2, [ELEMENTS.GENERIC]: 3 },
    [
      {
        effect: 'Take an extra turn after this one.',
        implementation: (gameState, playerId) => {
          // Implementation would go here
          return gameState;
        }
      }
    ],
    'Time is but a construct to be bent by those with the power.',
    'Alpha',
    'rare',
    '45/63'
  ),
  
  // Flags
  flameSovereign: createFlag(
    'Flame Sovereign',
    { [ELEMENTS.FIRE]: 2 },
    ELEMENTS.FIRE,
    ELEMENTS.EARTH,
    [
      {
        trigger: 'continuous',
        effect: 'Your Fire Familiars get +1 Strength.',
        implementation: (gameState, playerId) => {
          // Implementation would go here
          return gameState;
        }
      }
    ],
    'The sovereign of flames rules with an iron will and a burning heart.',
    'Alpha',
    'rare',
    'F1/7'
  ),
  
  tideMaster: createFlag(
    'Tide Master',
    { [ELEMENTS.WATER]: 2 },
    ELEMENTS.WATER,
    ELEMENTS.FIRE,
    [
      {
        trigger: 'continuous',
        effect: 'Your Water Familiars get +1 Health.',
        implementation: (gameState, playerId) => {
          // Implementation would go here
          return gameState;
        }
      }
    ],
    'The master of tides controls the ebb and flow of battle.',
    'Alpha',
    'rare',
    'F2/7'
  )
};

// Sample decks
export const sampleDecks = {
  fireDeck: [
    sampleCards.flameSovereign,
    sampleCards.dragonLord,
    sampleCards.shadowAssassin,
    sampleCards.inferno,
    // In a real implementation, this would have 40 cards
  ],
  
  waterDeck: [
    sampleCards.tideMaster,
    sampleCards.mysticSage,
    sampleCards.shadowAssassin,
    sampleCards.timeWarp,
    // In a real implementation, this would have 40 cards
  ]
};