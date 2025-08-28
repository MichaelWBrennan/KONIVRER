import type { Card, DeckValidationResult } from '../types';

/**
 * KONIVRER Deck Validation Service
 * Validates decks according to KONIVRER construction rules
 */

export class KonivrverDeckValidator {
  /**
   * Validate a deck according to KONIVRER rules
   */
  static validateDeck(cards: Card[], flag?: Card): DeckValidationResult {
    const errors: string[]    = [];
    const warnings: string[]    = [];
    
    // Check for flag requirement
    const hasFlag    = !!flag;
    if (!hasFlag) {
      errors.push("Deck must include exactly 1 Flag card");
    }
    
    // Count cards by rarity
    const cardCounts    = {
      total: cards.length,
      common: cards.filter(c => c.rarity === 'common').length,
      uncommon: cards.filter(c => c.rarity === 'uncommon').length, 
      rare: cards.filter(c => c.rarity === 'rare').length
    };
    
    // Check total card count (must be exactly 40)
    if (cardCounts.total !== 40) {
      errors.push(`Deck must contain exactly 40 cards, but has ${cardCounts.total}`);
    }
    
    // Check rarity distribution
    if (cardCounts.common !== 25) {
      errors.push(`Deck must contain exactly 25 Common (🜠) cards, but has ${cardCounts.common}`);
    }
    
    if (cardCounts.uncommon !== 13) {
      errors.push(`Deck must contain exactly 13 Uncommon (☽) cards, but has ${cardCounts.uncommon}`);
    }
    
    if (cardCounts.rare !== 2) {
      errors.push(`Deck must contain exactly 2 Rare (☉) cards, but has ${cardCounts.rare}`);
    }
    
    // Check for duplicate cards (max 1 copy per card)
    const cardNames    = cards.map(c => c.name);
    const duplicates    = cardNames.filter((name, index) => cardNames.indexOf(name) !== index);
    const uniqueDuplicates    = [...new Set(duplicates)];
    
    if (uniqueDuplicates.length > 0) {
      errors.push(`Deck contains duplicate cards (max 1 copy per card): ${uniqueDuplicates.join(', ')}`);
    }
    
    // Check element consistency with flag
    if (hasFlag && flag) {
      const flagElements    = flag.elements || [];
      const deckElements    = new Set(cards.flatMap(c => c.elements || []));
      
      // Warn if deck contains elements not supported by flag
      const unsupportedElements    = [...deckElements].filter(e => !flagElements.includes(e));
      if (unsupportedElements.length > 0) {
        warnings.push(`Deck contains elements not supported by flag: ${unsupportedElements.join(', ')}`);
      }
    }
    
    // Check for minimum element diversity
    const uniqueElements    = new Set(cards.flatMap(c => c.elements || []));
    if (uniqueElements.size < 1) {
      errors.push("Deck must contain at least one element");
    }
    
    const isValid    = errors.length === 0;
    
    return {
      isValid,
      errors,
      warnings,
      cardCounts,
      hasFlag,
      duplicateCards: uniqueDuplicates
    };
  }
  
  /**
   * Get deck construction summary
   */
  static getDeckConstructionRules(): string {
    return `KONIVRER Deck Construction Rules:
• 1 Flag card (does not count toward total)
• Exactly 40 cards total
• Exactly 25 Common (🜠) cards
• Exactly 13 Uncommon (☽) cards  
• Exactly 2 Rare (☉) cards
• Maximum 1 copy of any single card
• Cards should match Flag's Azoth identity elements`;
  }
  
  /**
   * Suggest fixes for invalid deck
   */
  static suggestFixes(validation: DeckValidationResult): string[] {
    const suggestions: string[]    = [];
    
    if (!validation.hasFlag) {
      suggestions.push("Add a Flag card to anchor your deck's Azoth identity");
    }
    
    if (validation.cardCounts.total !== 40) {
      const diff    = 40 - validation.cardCounts.total;
      suggestions.push(diff > 0 ? 
        `Add ${diff} more cards to reach 40` : 
        `Remove ${-diff} cards to reach 40`);
    }
    
    if (validation.cardCounts.common !== 25) {
      const diff    = 25 - validation.cardCounts.common;
      suggestions.push(diff > 0 ? 
        `Add ${diff} more Common cards` : 
        `Replace ${-diff} Common cards with other rarities`);
    }
    
    if (validation.cardCounts.uncommon !== 13) {
      const diff    = 13 - validation.cardCounts.uncommon;
      suggestions.push(diff > 0 ? 
        `Add ${diff} more Uncommon cards` : 
        `Replace ${-diff} Uncommon cards with other rarities`);
    }
    
    if (validation.cardCounts.rare !== 2) {
      const diff    = 2 - validation.cardCounts.rare;
      suggestions.push(diff > 0 ? 
        `Add ${diff} more Rare cards` : 
        `Replace ${-diff} Rare cards with other rarities`);
    }
    
    if (validation.duplicateCards.length > 0) {
      suggestions.push(`Remove duplicate copies of: ${validation.duplicateCards.join(', ')}`);
    }
    
    return suggestions;
  }
  
  /**
   * Generate a valid starter deck template
   */
  static generateStarterDeckTemplate(): {
    flag: Partial<Card>;
    cards: Partial<Card>[];
    description: string;
  } {
    return {
      flag: {
        name: "Fire Azoth Flag",
        lesserType: "Flag",
        elements: ["Fire"],
        rarity: "rare",
        azothCost: 0,
        rulesText: "Your deck's Azoth identity is Fire. You may include Fire cards in your deck."
      },
      cards: [
        // 25 Common cards template
        ...Array(25).fill(null).map((_, i) => ({
          name: `Fire Common ${i + 1}`,
          lesserType: "Spell",
          elements: ["Fire"],
          rarity: "common" as const,
          azothCost: 1
        })),
        // 13 Uncommon cards template  
        ...Array(13).fill(null).map((_, i) => ({
          name: `Fire Uncommon ${i + 1}`,
          lesserType: "Familiar", 
          elements: ["Fire"],
          rarity: "uncommon" as const,
          azothCost: 2,
          power: 2,
          toughness: 2
        })),
        // 2 Rare cards template
        ...Array(2).fill(null).map((_, i) => ({
          name: `Fire Rare ${i + 1}`,
          lesserType: "Familiar",
          elements: ["Fire"],
          rarity: "rare" as const,
          azothCost: 3,
          power: 3,
          toughness: 3,
          abilities: ["inferno"]
        }))
      ],
      description: "A starter deck template following KONIVRER construction rules with Fire element focus."
    };
  }
}

export default KonivrverDeckValidator;