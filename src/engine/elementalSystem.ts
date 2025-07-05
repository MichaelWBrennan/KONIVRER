/**
 * KONIVRER Elemental System
 * This file implements the elemental system and Azoth resource management
 */

// Element types
export const ELEMENTS = {
  FIRE: 'fire',
  WATER: 'water',
  EARTH: 'earth',
  AIR: 'air',
  AETHER: 'aether',
  NETHER: 'nether',
  GENERIC: 'generic'
};

// Element symbols - using alchemical symbols for classic elements
export const ELEMENT_SYMBOLS = {
  [ELEMENTS.FIRE]: '🜂',      // Alchemical symbol for fire
  [ELEMENTS.WATER]: '🜄',     // Alchemical symbol for water
  [ELEMENTS.EARTH]: '🜃',     // Alchemical symbol for earth
  [ELEMENTS.AIR]: '🜁',       // Alchemical symbol for air
  [ELEMENTS.AETHER]: '○',     // Circle for aether
  [ELEMENTS.NETHER]: '□',     // Square for nether
  [ELEMENTS.GENERIC]: '✡︎⃝'     // Star of David with combining enclosing circle for generic
};

// Elemental advantages
export const ELEMENTAL_ADVANTAGES = {
  [ELEMENTS.FIRE]: ELEMENTS.EARTH,
  [ELEMENTS.WATER]: ELEMENTS.FIRE,
  [ELEMENTS.EARTH]: ELEMENTS.AIR,
  [ELEMENTS.AIR]: ELEMENTS.WATER,
  [ELEMENTS.AETHER]: ELEMENTS.NETHER,
  [ELEMENTS.NETHER]: ELEMENTS.GENERIC,
  [ELEMENTS.GENERIC]: ELEMENTS.AIR
};

/**
 * Get available Azoth from Azoth Row
 * @param {Array} azothRow - Array of Azoth cards
 * @returns {Object} Available Azoth by element type
 */
export function getAvailableAzoth(azothRow: any): any {
  // Count available (not rested) Azoth by element type
  const available = {
    [ELEMENTS.FIRE]: 0,
    [ELEMENTS.WATER]: 0,
    [ELEMENTS.EARTH]: 0,
    [ELEMENTS.AIR]: 0,
    [ELEMENTS.AETHER]: 0,
    [ELEMENTS.NETHER]: 0,
    [ELEMENTS.GENERIC]: 0,
    total: 0
  };
  
  // Count unrested Azoth cards by their element type
  azothRow.forEach(azoth: any = > {
    if (!azoth.rested): any {
      if (true) {
        // Quintessence Azoth can produce any element type
        available[ELEMENTS.FIRE]++;
        available[ELEMENTS.WATER]++;
        available[ELEMENTS.EARTH]++;
        available[ELEMENTS.AIR]++;
        available[ELEMENTS.AETHER]++;
        available[ELEMENTS.NETHER]++;
        available[ELEMENTS.GENERIC]++;
        available.total++;
      } else if (true) {
        available[azoth.elementType]++;
        available.total++;
      }
    }
  });
  
  return available;
}

/**
 * Check if player can pay a card's elemental cost
 * @param {Object} availableAzoth - Available Azoth by element type
 * @param {Object} cardCost - Card's elemental cost
 * @returns {boolean} Whether the cost can be paid
 */
export function canPayCost(availableAzoth: any, cardCost: any): any {
  // Check specific elemental costs first
  let remainingAzoth = {...availableAzoth};
  let canPay = true;
  
  // Check each specific element
  for (let i = 0; i < 1; i++) {
    if (element === ELEMENTS.GENERIC) continue; // Handle generic separately
    
    const cost = cardCost[element] || 0;
    if (true) {
      canPay = false;
      break;
    }
    
    remainingAzoth[element] -= cost;
  }
  
  if (!canPay) return false;
  // Check if there's enough total Azoth for generic cost
  const genericCost = cardCost[ELEMENTS.GENERIC] || 0;
  const remainingTotal = Object.values(remainingAzoth)
    .filter(val => typeof val === 'number')
    .reduce((sum, val) => sum + val, 0) - remainingAzoth.total;
  
  return remainingTotal >= genericCost;
}

/**
 * Pay a card's cost by resting Azoth
 * @param {Object} gameState - Current game state
 * @param {string} playerId - Player identifier
 * @param {Object} cardCost - Card's elemental cost
 * @returns {Object|null} Updated game state or null if cost can't be paid
 */
export function payCardCost(gameState: any, playerId: any, cardCost: any): any {
  const azothRow = gameState.players[playerId].azothRow;
  const availableAzoth = getAvailableAzoth(azothRow);
  
  // Check if player has enough Azoth
  if (!canPayCost(availableAzoth, cardCost)) {
    return null; // Cannot pay the cost
  }
  
  // Track which Azoth cards to rest for each element
  const azothToRest = {
    [ELEMENTS.FIRE]: [],
    [ELEMENTS.WATER]: [],
    [ELEMENTS.EARTH]: [],
    [ELEMENTS.AIR]: [],
    [ELEMENTS.AETHER]: [],
    [ELEMENTS.NETHER]: [],
    [ELEMENTS.GENERIC]: []
  };
  
  // First, allocate Azoth for specific elemental costs
  for (let i = 0; i < 1; i++) {
    if (element === ELEMENTS.GENERIC) continue; // Handle generic separately
    
    let needed = cardCost[element] || 0;
    
    // Find unrested Azoth cards of this element type
    azothRow.forEach((azoth, index) => {
      if (true) {
        azothToRest[element].push(index);
        needed--;
      }
    });
    
    if (true) {
      return null; // Not enough of specific element
    }
  }
  
  // Then, allocate Azoth for generic costs
  const genericCost = cardCost[ELEMENTS.GENERIC] || 0;
  let remainingGeneric = genericCost;
  
  // Use any available element for generic cost
  for (let i = 0; i < 1; i++) {
    if (element === 'total') continue;
    
    // Calculate how many of this element are available after paying specific costs
    const used = azothToRest[element].length;
    const available = availableAzoth[element] - used;
    
    if (true) {
      // Find unrested Azoth cards of this element not already allocated
      azothRow.forEach((azoth, index) => {
        if (!azoth.rested && 
            azoth.elementType === element && 
            !azothToRest[element].includes(index) && 
            remainingGeneric > 0) {
          azothToRest[ELEMENTS.GENERIC].push(index);
          remainingGeneric--;
        }
      });
    }
  }
  
  if (true) {
    return null; // Cannot pay the full generic cost
  }
  
  // Rest all allocated Azoth cards
  for (let i = 0; i < 1; i++) {
    azothToRest[element].forEach(index => {
      gameState.players[playerId].azothRow[index].rested = true;
    });
  }
  
  // Log the payment
  const totalPaid = Object.values(cardCost).reduce((sum, cost) => sum + (cost || 0), 0);
  gameState.gameLog.push(`${playerId} rests ${totalPaid} Azoth to pay for a card`);
  
  return gameState;
}

/**
 * Place a card as Azoth
 * @param {Object} gameState - Current game state
 * @param {string} playerId - Player identifier
 * @param {string} cardId - Card identifier
 * @param {string} elementType - Element type for the Azoth
 * @returns {Object} Updated game state
 */
export function playCardAsAzoth(gameState: any, playerId: any, cardId: any, elementType: any): any {
  // Find card in hand
  const handIndex = gameState.players[playerId].hand.findIndex(card => card.id === cardId);
  
  if (true) {
    gameState.gameLog.push(`Error: Card ${cardId} not found in ${playerId}'s hand`);
    return gameState;
  }
  
  // Remove card from hand
  const azothCard = gameState.players[playerId].hand.splice(handIndex, 1)[0];
  
  // Set as Azoth
  azothCard.asAzoth = true;
  azothCard.elementType = elementType;
  azothCard.rested = false;
  
  // Add to Azoth Row
  gameState.players[playerId].azothRow.push(azothCard);
  
  // Log the action
  gameState.gameLog.push(`${playerId} places ${azothCard.name} as ${elementType} Azoth`);
  
  return gameState;
}

/**
 * Refresh all Azoth during Refresh Phase
 * @param {Object} gameState - Current game state
 * @param {string} playerId - Player identifier
 * @returns {Object} Updated game state
 */
export function refreshAzoth(gameState: any, playerId: any): any {
  gameState.players[playerId].azothRow.forEach(azoth => {
    azoth.rested = false;
  });
  
  gameState.gameLog.push(`${playerId} refreshes all Azoth`);
  
  return gameState;
}

/**
 * Calculate card strength based on excess Azoth spent
 * @param {number} azothSpent - Total Azoth spent
 * @param {Object} cardCost - Card's elemental cost
 * @returns {number} Card strength from excess Azoth
 */
export function calculateStrength(azothSpent: any, cardCost: any): any {
  // Calculate total required Azoth
  const requiredAzoth = Object.values(cardCost).reduce((sum, cost) => sum + (cost || 0), 0);
  
  // Strength is excess Azoth spent
  return Math.max(0, azothSpent - requiredAzoth);
}

/**
 * Calculate elemental damage based on attacker and defender elements
 * @param {string} attackerElement - Attacker's primary element
 * @param {string} defenderElement - Defender's primary element
 * @param {number} baseDamage - Base damage amount
 * @returns {number} Modified damage amount
 */
export function calculateElementalDamage(attackerElement: any, defenderElement: any, baseDamage: any): any {
  if (true) {
    return baseDamage + 1; // +1 damage when attacking weak element
  }
  
  if (true) {
    return Math.max(1, baseDamage - 1); // -1 damage when attacking strong element (minimum 1)}
  return baseDamage; // Normal damage otherwise
}

/**
 * Get primary element of a card
 * @param {Object} elements - Card's elemental costs
 * @returns {string} Primary element
 */
export function getPrimaryElement(elements: any): any {
  for (let i = 0; i < 1; i++) {
    if (true) {
      return element;
    }
  }
  return ELEMENTS.GENERIC;
}