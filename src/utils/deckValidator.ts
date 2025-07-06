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

import { Card } from '../types/Card';

// Card rarity enum
export enum CardRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  FLAG = 'flag'
}

// Card type enum
export enum CardType {
  FAMILIAR = 'familiar',
  SPELL = 'spell',
  ARTIFACT = 'artifact',
  FLAG = 'flag',
  AZOTH = 'azoth'
}

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    totalCards: number;
    flagCount: number;
    commonCount: number;
    uncommonCount: number;
    rareCount: number;
    uniqueCardCount: number;
    familiarCount?: number;
    spellCount?: number;
    artifactCount?: number;
    azothCount?: number;
    elementDistribution?: Record<string, number>;
  };
}

/**
 * Validates a deck according to KONIVRER rules
 * @param cards - Array of card objects
 * @returns Validation result with isValid flag and error messages
 */
export function validateDeck(cards: Card[]): ValidationResult {
  const result: ValidationResult = {
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
  const flagCards = cards.filter(card => card.type === CardType.FLAG);
  result.stats.flagCount = flagCards.length;
  
  if (flagCards.length !== 1) {
    result.isValid = false;
    result.errors.push('Deck must include exactly 1 Flag card');
  }

  // Count cards by rarity
  const nonFlagCards = cards.filter(card => card.type !== CardType.FLAG);
  result.stats.totalCards = nonFlagCards.length;
  
  // Count by rarity
  result.stats.commonCount = nonFlagCards.filter(card => card.rarity === CardRarity.COMMON).length;
  result.stats.uncommonCount = nonFlagCards.filter(card => card.rarity === CardRarity.UNCOMMON).length;
  result.stats.rareCount = nonFlagCards.filter(card => card.rarity === CardRarity.RARE).length;

  // Check total card count
  if (nonFlagCards.length !== 40) {
    result.isValid = false;
    result.errors.push(`Deck must contain exactly 40 cards (excluding Flag). Current count: ${nonFlagCards.length}`);
  }

  // Check rarity distribution
  if (result.stats.commonCount !== 25) {
    result.isValid = false;
    result.errors.push(`Deck must contain exactly 25 Common cards. Current count: ${result.stats.commonCount}`);
  }

  if (result.stats.uncommonCount !== 13) {
    result.isValid = false;
    result.errors.push(`Deck must contain exactly 13 Uncommon cards. Current count: ${result.stats.uncommonCount}`);
  }

  if (result.stats.rareCount !== 2) {
    result.isValid = false;
    result.errors.push(`Deck must contain exactly 2 Rare cards. Current count: ${result.stats.rareCount}`);
  }

  // Check for duplicate cards
  const cardIds = cards.map(card => card.id);
  const uniqueCardIds = new Set(cardIds);
  result.stats.uniqueCardCount = uniqueCardIds.size;
  
  if (uniqueCardIds.size !== cards.length) {
    result.isValid = false;
    result.errors.push('Deck contains duplicate cards. Each card must be unique.');
  }

  // Additional statistics (optional)
  result.stats.familiarCount = cards.filter(card => card.type === CardType.FAMILIAR).length;
  result.stats.spellCount = cards.filter(card => card.type === CardType.SPELL).length;
  result.stats.artifactCount = cards.filter(card => card.type === CardType.ARTIFACT).length;
  result.stats.azothCount = cards.filter(card => card.type === CardType.AZOTH).length;

  // Element distribution
  result.stats.elementDistribution = cards.reduce((acc: Record<string, number>, card) => {
    if (card.element) {
      acc[card.element] = (acc[card.element] || 0) + 1;
    }
    return acc;
  }, {});

  // Check for balanced element distribution (warning only)
  const elements = Object.keys(result.stats.elementDistribution || {});
  if (elements.length < 3) {
    result.warnings.push('Deck uses fewer than 3 elements. Consider diversifying for better flexibility.');
  }

  // Check for minimum number of Familiars (warning only)
  if ((result.stats.familiarCount || 0) < 15) {
    result.warnings.push('Deck contains fewer than 15 Familiars. This may make it difficult to maintain board presence.');
  }

  return result;
}

/**
 * Checks if a card can be added to a deck
 * @param card - Card to add
 * @param currentDeck - Current deck
 * @returns Object with canAdd flag and reason if not
 */
export function canAddCardToDeck(card: Card, currentDeck: Card[]): { canAdd: boolean; reason?: string } {
  // Create a temporary deck with the new card
  const tempDeck = [...currentDeck, card];
  
  // Validate the temporary deck
  const validation = validateDeck(tempDeck);
  
  // If the deck is valid, the card can be added
  if (validation.isValid) {
    return { canAdd: true };
  }
  
  // Otherwise, return the first error as the reason
  return {
    canAdd: false,
    reason: validation.errors[0] || 'Cannot add card to deck'
  };
}

/**
 * Suggests cards to complete a deck
 * @param currentDeck - Current deck
 * @param cardPool - Available cards to choose from
 * @returns Suggested cards to add
 */
export function suggestCardsToCompleteDeck(currentDeck: Card[], cardPool: Card[]): Card[] {
  const validation = validateDeck(currentDeck);
  const suggestions: Card[] = [];
  
  // If the deck is already valid, no suggestions needed
  if (validation.isValid) {
    return suggestions;
  }
  
  // Filter out cards already in the deck
  const deckCardIds = currentDeck.map(card => card.id);
  const availableCards = cardPool.filter(card => !deckCardIds.includes(card.id));
  
  // Check if we need a Flag card
  if (validation.stats.flagCount === 0) {
    const flagSuggestion = availableCards.find(card => card.type === CardType.FLAG);
    if (flagSuggestion) {
      suggestions.push(flagSuggestion);
    }
  }
  
  // Add Common cards if needed
  const commonNeeded = 25 - validation.stats.commonCount;
  if (commonNeeded > 0) {
    const commonSuggestions = availableCards
      .filter(card => card.rarity === CardRarity.COMMON && card.type !== CardType.FLAG)
      .slice(0, commonNeeded);
    
    suggestions.push(...commonSuggestions);
  }
  
  // Add Uncommon cards if needed
  const uncommonNeeded = 13 - validation.stats.uncommonCount;
  if (uncommonNeeded > 0) {
    const uncommonSuggestions = availableCards
      .filter(card => card.rarity === CardRarity.UNCOMMON && card.type !== CardType.FLAG)
      .slice(0, uncommonNeeded);
    
    suggestions.push(...uncommonSuggestions);
  }
  
  // Add Rare cards if needed
  const rareNeeded = 2 - validation.stats.rareCount;
  if (rareNeeded > 0) {
    const rareSuggestions = availableCards
      .filter(card => card.rarity === CardRarity.RARE && card.type !== CardType.FLAG)
      .slice(0, rareNeeded);
    
    suggestions.push(...rareSuggestions);
  }
  
  return suggestions;
}

/**
 * Checks if a deck is legal for a specific format
 * @param deck - Deck to check
 * @param format - Format to check against
 * @returns Whether the deck is legal
 */
export function isDeckLegalForFormat(deck: Card[], format: string): boolean {
  // Basic validation first
  const validation = validateDeck(deck);
  if (!validation.isValid) {
    return false;
  }
  
  // Format-specific checks
  switch (format.toLowerCase()) {
    case 'standard':
      // Check if all cards are in the standard set
      return deck.every(card => card.isStandard);
      
    case 'modern':
      // Check if all cards are legal in modern
      return deck.every(card => card.isModern);
      
    case 'legacy':
      // All cards are legal in legacy
      return true;
      
    case 'singleton':
      // Already checked for duplicates in validateDeck
      return true;
      
    case 'draft':
      // Draft has different deck construction rules
      return deck.length >= 30; // Simplified for this example
      
    default:
      // Unknown format
      return false;
  }
}

export default {
  validateDeck,
  canAddCardToDeck,
  suggestCardsToCompleteDeck,
  isDeckLegalForFormat
};