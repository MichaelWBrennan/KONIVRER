// Rules Engine for KONIVRER
// This utility provides functions to validate game rules and deck building constraints

class RulesEngine {
  constructor() {
    this.rules = null;
    this.loadRules();
  }

  async loadRules() {
    try {
      const rulesModule = await import('../data/rules.json');
      this.rules = rulesModule.gameRules;
    } catch (error) {
      console.error('Failed to load rules:', error);
    }
  }

  // Deck Building Validation
  validateDeck(deck, format = 'standard') {
    const validations = [];

    // Basic deck size validation
    const totalCards = this.getTotalCards(deck);
    const minCards = this.getMinDeckSize(format);
    const maxCards = this.getMaxDeckSize(format);

    if (totalCards < minCards) {
      validations.push({
        type: 'error',
        rule: 'deck-size',
        message: `Deck must have at least ${minCards} cards (currently ${totalCards})`,
        severity: 'high'
      });
    }

    if (totalCards > maxCards) {
      validations.push({
        type: 'error',
        rule: 'deck-size',
        message: `Deck cannot exceed ${maxCards} cards (currently ${totalCards})`,
        severity: 'high'
      });
    }

    // Element validation
    const elementValidation = this.validateElements(deck);
    validations.push(...elementValidation);

    // Card copy limits
    const copyValidation = this.validateCardCopies(deck, format);
    validations.push(...copyValidation);

    // Flag card validation
    const flagValidation = this.validateFlagCards(deck);
    validations.push(...flagValidation);

    return {
      isValid: validations.filter(v => v.type === 'error').length === 0,
      validations,
      summary: this.generateValidationSummary(validations)
    };
  }

  validateElements(deck) {
    const validations = [];
    const flagCard = deck.cards.find(card => card.type === 'ΦLAG');
    
    if (!flagCard) {
      validations.push({
        type: 'error',
        rule: 'flag-required',
        message: 'Deck must include exactly one Flag card',
        severity: 'high'
      });
      return validations;
    }

    // Get allowed elements from flag card
    const allowedElements = this.getAllowedElements(flagCard);
    
    // Check each card's elements
    deck.cards.forEach(card => {
      if (card.type === 'ΦLAG') return; // Skip flag cards
      
      const cardElements = card.elements || [];
      const invalidElements = cardElements.filter(element => 
        !allowedElements.includes(element) && element !== 'Neutral'
      );

      if (invalidElements.length > 0) {
        validations.push({
          type: 'error',
          rule: 'element-restriction',
          message: `${card.name} contains forbidden elements: ${invalidElements.join(', ')}`,
          severity: 'medium',
          cardId: card.id
        });
      }
    });

    return validations;
  }

  validateCardCopies(deck, format) {
    const validations = [];
    const maxCopies = this.getMaxCopies(format);
    const cardCounts = {};

    // Count card copies
    deck.cards.forEach(card => {
      if (card.type === 'ΦLAG') return; // Flag cards have different rules
      
      cardCounts[card.name] = (cardCounts[card.name] || 0) + (card.quantity || 1);
    });

    // Check limits
    Object.entries(cardCounts).forEach(([cardName, count]) => {
      if (count > maxCopies) {
        validations.push({
          type: 'error',
          rule: 'copy-limit',
          message: `Too many copies of ${cardName} (${count}/${maxCopies})`,
          severity: 'medium'
        });
      }
    });

    return validations;
  }

  validateFlagCards(deck) {
    const validations = [];
    const flagCards = deck.cards.filter(card => card.type === 'ΦLAG');

    if (flagCards.length === 0) {
      validations.push({
        type: 'error',
        rule: 'flag-required',
        message: 'Deck must include exactly one Flag card',
        severity: 'high'
      });
    } else if (flagCards.length > 1) {
      validations.push({
        type: 'error',
        rule: 'flag-limit',
        message: 'Deck can only include one Flag card',
        severity: 'high'
      });
    }

    return validations;
  }

  // Helper functions
  getTotalCards(deck) {
    return deck.cards.reduce((sum, card) => sum + (card.quantity || 1), 0);
  }

  getMinDeckSize(format) {
    const formatRules = {
      'standard': 40,
      'limited': 40,
      'eternal': 40
    };
    return formatRules[format] || 40;
  }

  getMaxDeckSize(format) {
    const formatRules = {
      'standard': 60,
      'limited': 40,
      'eternal': 60
    };
    return formatRules[format] || 60;
  }

  getMaxCopies(format) {
    const formatRules = {
      'standard': 4,
      'limited': 4,
      'eternal': 4
    };
    return formatRules[format] || 4;
  }

  getAllowedElements(flagCard) {
    // This would parse the flag card's description to determine allowed elements
    // For now, return a default set
    if (flagCard.name === 'ΦIVE ELEMENT ΦLAG') {
      // Player chooses 5 of 6 elements
      return ['Quintessence', 'Inferno', 'Submerged', 'Steadfast', 'Brilliance']; // Example selection
    }
    
    // Default to all elements if flag not recognized
    return ['Quintessence', 'Inferno', 'Submerged', 'Steadfast', 'Brilliance', 'Void'];
  }

  generateValidationSummary(validations) {
    const errors = validations.filter(v => v.type === 'error');
    const warnings = validations.filter(v => v.type === 'warning');
    
    return {
      errorCount: errors.length,
      warningCount: warnings.length,
      isLegal: errors.length === 0,
      highSeverityIssues: validations.filter(v => v.severity === 'high').length
    };
  }

  // Keyword ability definitions
  getKeywordDefinition(keyword) {
    const keywords = {
      'VOID': {
        name: 'VOID',
        description: 'This ability allows the card to bypass certain defenses and effects.',
        rulesText: 'Cards with VOID cannot be targeted by certain protective effects.'
      },
      'SUBMERGED': {
        name: 'SUBMERGED',
        description: 'This ability relates to water-based mechanics and flow effects.',
        rulesText: 'SUBMERGED cards have enhanced interaction with water-element effects.'
      },
      'BRILLIANCE': {
        name: 'BRILLIANCE',
        description: 'This ability represents speed, clarity, and light-based effects.',
        rulesText: 'BRILLIANCE cards can activate certain effects more quickly.'
      }
    };

    return keywords[keyword.toUpperCase()];
  }

  // Element interaction rules
  getElementInteractions(element1, element2) {
    // Define element interaction matrix
    const interactions = {
      'Inferno': {
        'Submerged': 'opposed',
        'Steadfast': 'neutral',
        'Brilliance': 'synergy',
        'Void': 'neutral',
        'Quintessence': 'neutral'
      },
      'Submerged': {
        'Inferno': 'opposed',
        'Steadfast': 'synergy',
        'Brilliance': 'neutral',
        'Void': 'neutral',
        'Quintessence': 'neutral'
      }
      // Add more interactions as defined in the rules
    };

    return interactions[element1]?.[element2] || 'neutral';
  }
}

// Export singleton instance
export const rulesEngine = new RulesEngine();
export default rulesEngine;