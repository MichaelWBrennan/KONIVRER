/**
 * KONIVRER Card Data
 * This file defines the card data structure and sample cards
 */

import { ELEMENTS } from '../engine/elementalSystem';
import cardsJson from './cards.json';

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

// Convert cards from JSON to game engine format
function convertJsonCardToGameCard(jsonCard) {
  // Map element names to engine element constants
  const elementMap = {
    'Fire': ELEMENTS.FIRE,
    'Water': ELEMENTS.WATER,
    'Earth': ELEMENTS.EARTH,
    'Air': ELEMENTS.AIR,
    'Aether': ELEMENTS.AETHER,
    'Nether': ELEMENTS.NETHER,
    'Neutral': ELEMENTS.GENERIC,
    'Brilliance': ELEMENTS.FIRE,
    'Quintessence': ELEMENTS.AETHER,
    'Void': ELEMENTS.NETHER,
    'Submerged': ELEMENTS.WATER
  };
  
  // Convert element costs to the format expected by the game engine
  const elements = {};
  if (jsonCard.cost && jsonCard.cost.length > 0) {
    jsonCard.cost.forEach(element => {
      const mappedElement = elementMap[element] || ELEMENTS.GENERIC;
      elements[mappedElement] = (elements[mappedElement] || 0) + 1;
    });
  }
  
  // Create abilities array
  const abilities = [];
  if (jsonCard.description) {
    abilities.push({
      effect: jsonCard.description,
      implementation: (gameState) => gameState // Placeholder implementation
    });
  }
  
  // Create the card based on its type
  if (jsonCard.type === 'ΦLAG' || jsonCard.type === 'FLAG') {
    return createFlag(
      jsonCard.name,
      elements,
      elementMap[jsonCard.elements[0]] || ELEMENTS.GENERIC,
      ELEMENTS.GENERIC, // Default strongAgainst
      abilities,
      jsonCard.flavorText || '',
      jsonCard.set,
      jsonCard.rarity.toLowerCase(),
      jsonCard.collectorNumber
    );
  } else if (jsonCard.type === 'SPELL') {
    return createSpell(
      jsonCard.name,
      elements,
      abilities,
      jsonCard.flavorText || '',
      jsonCard.set,
      jsonCard.rarity.toLowerCase(),
      jsonCard.collectorNumber
    );
  } else {
    // Default to Familiar for ELEMENTAL and other types
    return createFamiliar(
      jsonCard.name,
      elements,
      jsonCard.attack || 2, // Default attack
      jsonCard.defense || 2, // Default defense
      abilities,
      jsonCard.flavorText || '',
      jsonCard.set,
      jsonCard.rarity.toLowerCase(),
      jsonCard.collectorNumber
    );
  }
}

// Convert the first few cards from the JSON database
const convertedCards = cardsJson.slice(0, 10).map(convertJsonCardToGameCard);

// Create sample decks using the converted cards
export const sampleDecks = {
  fireDeck: [
    // Use the first 5 cards for the fire deck
    ...convertedCards.slice(0, 5)
  ],
  
  waterDeck: [
    // Use the next 5 cards for the water deck
    ...convertedCards.slice(5, 10)
  ]
};