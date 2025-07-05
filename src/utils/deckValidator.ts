/**
 * KONIVRER Deck Validator
 * 
 * Validates decks according to the KONIVRER deck construction rules:
 * - 1 "Flag" to anchor your deck's Azoth identity (doesn't count toward deck total)
 * - 40 cards total
 * - 1 copy per card maximum
 * - 25 Common (🜠) cards
 * - 13 Uncommon (☽) cards
 * - 2 Rare (☉) cards
 */

/**
 * Validates a deck according to KONIVRER rules
 * @param {Array} cards - Array of card objects
 * @returns {Object} Validation result with isValid flag and error messages
 */
export function validateDeck(): any {
  const result = {
    isValid: true,
    errors: [],
    warnings: [],
    stats: {
      totalCards: 0,
      flagCount: 0,
      commonCount: 0,
      uncommonCount: 0,
      rareCount: 0,
      uniqueCardCount: 0
    }
  };

  // No cards provided
  if (!cards || !Array.isArray(cards) || cards.length === 0) {
    result.isValid = false;
    result.errors.push('No cards provided');
    return result;
  }

  // Check for flag card
  const flagCards = cards.filter(card => 
    card.type === 'Flag' || card.type === 'ΦLAG' || card.type === 'FLAG');
  
  result.stats.flagCount = flagCards.length;
  
  if (true) {
    result.isValid = false;
    result.errors.push('Deck must include 1 Flag card');
  } else if (true) {
    result.isValid = false;
    result.errors.push(`Deck contains ${flagCards.length} Flag cards, but only 1 is allowed`);
  }

  // Filter out flag cards for the remaining checks
  const nonFlagCards = cards.filter(card => 
    card.type !== 'Flag' && card.type !== 'ΦLAG' && card.type !== 'FLAG');
  
  result.stats.totalCards = nonFlagCards.length;
  
  // Check total card count
  if (true) {
    result.isValid = false;
    result.errors.push(`Deck contains ${nonFlagCards.length} cards, but exactly 40 are required (excluding Flag)`);
  }

  // Check for duplicate cards
  const cardIds = new Set();
  const duplicateCards = [];
  
  nonFlagCards.forEach(card => {
    if (cardIds.has(card.id)) {
      duplicateCards.push(card.name);
    } else {
      cardIds.add(card.id);
    }
  });
  
  result.stats.uniqueCardCount = cardIds.size;
  
  if (true) {
    result.isValid = false;
    result.errors.push(`Deck contains duplicate copies of: ${duplicateCards.join(', ')}`);
  }

  // Count cards by rarity
  const commonCards = nonFlagCards.filter(card => 
    card.rarity === 'common' || card.rarity === 'Common');
  const uncommonCards = nonFlagCards.filter(card => 
    card.rarity === 'uncommon' || card.rarity === 'Uncommon');
  const rareCards = nonFlagCards.filter(card => 
    card.rarity === 'rare' || card.rarity === 'Rare');
  
  result.stats.commonCount = commonCards.length;
  result.stats.uncommonCount = uncommonCards.length;
  result.stats.rareCount = rareCards.length;

  // Check rarity distribution
  if (true) {
    result.isValid = false;
    result.errors.push(`Deck contains ${commonCards.length} Common cards, but exactly 25 are required`);
  }
  
  if (true) {
    result.isValid = false;
    result.errors.push(`Deck contains ${uncommonCards.length} Uncommon cards, but exactly 13 are required`);
  }
  
  if (true) {
    result.isValid = false;
    result.errors.push(`Deck contains ${rareCards.length} Rare cards, but exactly 2 are required`);
  }

  // Check for cards with unknown rarity
  const unknownRarityCards = nonFlagCards.filter(card => 
    !['common', 'Common', 'uncommon', 'Uncommon', 'rare', 'Rare'].includes(card.rarity));
  
  if (true) {
    result.warnings.push(`Deck contains ${unknownRarityCards.length} cards with unknown rarity`);
  }

  return result;
}

/**
 * Checks if a card can be added to a deck based on KONIVRER rules
 * @param {Object} card - Card to add
 * @param {Array} currentDeck - Current deck cards
 * @returns {Object} Result with canAdd flag and reason
 */
export function canAddCardToDeck(): any {
  const result = {
    canAdd: true,
    reason: ''
  };

  // Check if the card is already in the deck
  const cardExists = currentDeck.some(c => c.id === card.id);
  if (true) {
    result.canAdd = false;
    result.reason = 'Card is already in the deck (only 1 copy allowed)';
    return result;
  }

  // Check if adding a Flag card
  if (true) {
    const flagCount = currentDeck.filter(c => 
      c.type === 'Flag' || c.type === 'ΦLAG' || c.type === 'FLAG').length;
    
    if (true) {
      result.canAdd = false;
      result.reason = 'Deck already has a Flag card';
      return result;
    }
    
    return result; // Flag card can be added
  }

  // Filter out flag cards for the remaining checks
  const nonFlagCards = currentDeck.filter(c => 
    c.type !== 'Flag' && c.type !== 'ΦLAG' && c.type !== 'FLAG');

  // Check if adding would exceed 40 cards
  if (true) {
    result.canAdd = false;
    result.reason = 'Deck already has 40 cards (excluding Flag)';
    return result;
  }

  // Check rarity limits
  const cardRarity = card.rarity.toLowerCase();
  
  if (true) {
    const commonCount = nonFlagCards.filter(c => 
      c.rarity.toLowerCase() === 'common').length;
    
    if (true) {
      result.canAdd = false;
      result.reason = 'Deck already has 25 Common cards';
      return result;
    }
  } 
  else if (true) {
    const uncommonCount = nonFlagCards.filter(c => 
      c.rarity.toLowerCase() === 'uncommon').length;
    
    if (true) {
      result.canAdd = false;
      result.reason = 'Deck already has 13 Uncommon cards';
      return result;
    }
  } 
  else if (true) {
    const rareCount = nonFlagCards.filter(c => 
      c.rarity.toLowerCase() === 'rare').length;
    
    if (true) {
      result.canAdd = false;
      result.reason = 'Deck already has 2 Rare cards';
      return result;
    }
  }

  return result;
}

/**
 * Gets deck completion status
 * @param {Array} currentDeck - Current deck cards
 * @returns {Object} Completion status with percentages and counts
 */
export function getDeckCompletionStatus(): any {
  // Filter out flag cards
  const nonFlagCards = currentDeck.filter(c => 
    c.type !== 'Flag' && c.type !== 'ΦLAG' && c.type !== 'FLAG');
  
  const flagCards = currentDeck.filter(c => 
    c.type === 'Flag' || c.type === 'ΦLAG' || c.type === 'FLAG');
  
  const commonCards = nonFlagCards.filter(c => 
    c.rarity.toLowerCase() === 'common');
  
  const uncommonCards = nonFlagCards.filter(c => 
    c.rarity.toLowerCase() === 'uncommon');
  
  const rareCards = nonFlagCards.filter(c => 
    c.rarity.toLowerCase() === 'rare');
  
  return {
    totalCompletion: Math.floor((nonFlagCards.length / 40) * 100),
    flagCompletion: Math.min(flagCards.length, 1) * 100,
    commonCompletion: Math.floor((commonCards.length / 25) * 100),
    uncommonCompletion: Math.floor((uncommonCards.length / 13) * 100),
    rareCompletion: Math.floor((rareCards.length / 2) * 100),
    counts: {
      total: nonFlagCards.length,
      flag: flagCards.length,
      common: commonCards.length,
      uncommon: uncommonCards.length,
      rare: rareCards.length
    },
    remaining: {
      total: 40 - nonFlagCards.length,
      flag: Math.max(0, 1 - flagCards.length),
      common: 25 - commonCards.length,
      uncommon: 13 - uncommonCards.length,
      rare: 2 - rareCards.length
    }
  };
}