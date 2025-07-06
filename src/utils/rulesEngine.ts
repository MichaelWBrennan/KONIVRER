/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

// Rules Engine for KONIVRER
// This utility provides functions to validate game rules and deck building constraints

import { Card } from './comprehensiveSearchEngine';

// Game formats
export enum GameFormat {
  STANDARD = 'standard',
  EXTENDED = 'extended',
  LEGACY = 'legacy',
  DRAFT = 'draft',
  SEALED = 'sealed',
  COMMANDER = 'commander',
  BRAWL = 'brawl',
  TOURNAMENT = 'tournament'
}

// Card rarity
export enum CardRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  MYTHIC = 'mythic',
  LEGENDARY = 'legendary',
  PROMO = 'promo',
  SPECIAL = 'special'
}

// Card type
export enum CardType {
  CHARACTER = 'character',
  SPELL = 'spell',
  ITEM = 'item',
  LOCATION = 'location',
  EVENT = 'event',
  QUEST = 'quest',
  COMPANION = 'companion',
  RESOURCE = 'resource'
}

// Card element
export enum CardElement {
  FIRE = 'fire',
  WATER = 'water',
  EARTH = 'earth',
  AIR = 'air',
  LIGHT = 'light',
  DARK = 'dark',
  NEUTRAL = 'neutral',
  MULTI = 'multi'
}

// Card faction
export enum CardFaction {
  IMPERIAL = 'imperial',
  NOMAD = 'nomad',
  MYSTIC = 'mystic',
  TECH = 'tech',
  WILD = 'wild',
  VOID = 'void',
  NEUTRAL = 'neutral',
  MULTI = 'multi'
}

// Validation result
export interface ValidationResult {
  isValid: boolean;
  validations: ValidationIssue[];
}

// Validation issue
export interface ValidationIssue {
  type: 'error' | 'warning' | 'info';
  rule: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  affectedCards?: string[];
}

// Deck interface
export interface Deck {
  id: string;
  name: string;
  format: GameFormat;
  cards: DeckCard[];
  commander?: DeckCard;
  companion?: DeckCard;
  sideboard?: DeckCard[];
  metadata?: Record<string, any>;
}

// Deck card interface
export interface DeckCard {
  id: string;
  quantity: number;
  card: Card;
}

// Format rules
export interface FormatRules {
  minDeckSize: number;
  maxDeckSize: number;
  maxCopiesOfCard: number;
  allowedSets: string[];
  bannedCards: string[];
  restrictedCards: string[];
  allowedCardTypes: CardType[];
  allowedElements: CardElement[];
  allowedFactions: CardFaction[];
  requiresCommander: boolean;
  allowsCompanion: boolean;
  maxSideboardSize: number;
  specialRules?: Record<string, any>;
}

// Rules data
export interface RulesData {
  formats: Record<GameFormat, FormatRules>;
  cardRules: Record<string, any>;
  interactions: Record<string, any>;
  keywords: Record<string, any>;
  abilities: Record<string, any>;
  version: string;
}

class RulesEngine {
  private rules: RulesData | null;
  private formatRules: Record<GameFormat, FormatRules>;
  private cardDatabase: Record<string, Card>;

  constructor() {
    this.rules = null;
    this.formatRules = {
      [GameFormat.STANDARD]: {
        minDeckSize: 60,
        maxDeckSize: 100,
        maxCopiesOfCard: 4,
        allowedSets: [],
        bannedCards: [],
        restrictedCards: [],
        allowedCardTypes: Object.values(CardType),
        allowedElements: Object.values(CardElement),
        allowedFactions: Object.values(CardFaction),
        requiresCommander: false,
        allowsCompanion: true,
        maxSideboardSize: 15,
      },
      [GameFormat.EXTENDED]: {
        minDeckSize: 60,
        maxDeckSize: 100,
        maxCopiesOfCard: 4,
        allowedSets: [],
        bannedCards: [],
        restrictedCards: [],
        allowedCardTypes: Object.values(CardType),
        allowedElements: Object.values(CardElement),
        allowedFactions: Object.values(CardFaction),
        requiresCommander: false,
        allowsCompanion: true,
        maxSideboardSize: 15,
      },
      [GameFormat.LEGACY]: {
        minDeckSize: 60,
        maxDeckSize: 200,
        maxCopiesOfCard: 4,
        allowedSets: [],
        bannedCards: [],
        restrictedCards: [],
        allowedCardTypes: Object.values(CardType),
        allowedElements: Object.values(CardElement),
        allowedFactions: Object.values(CardFaction),
        requiresCommander: false,
        allowsCompanion: true,
        maxSideboardSize: 15,
      },
      [GameFormat.DRAFT]: {
        minDeckSize: 40,
        maxDeckSize: 60,
        maxCopiesOfCard: 999, // No limit in draft
        allowedSets: [],
        bannedCards: [],
        restrictedCards: [],
        allowedCardTypes: Object.values(CardType),
        allowedElements: Object.values(CardElement),
        allowedFactions: Object.values(CardFaction),
        requiresCommander: false,
        allowsCompanion: false,
        maxSideboardSize: 999, // No limit in draft
      },
      [GameFormat.SEALED]: {
        minDeckSize: 40,
        maxDeckSize: 60,
        maxCopiesOfCard: 999, // No limit in sealed
        allowedSets: [],
        bannedCards: [],
        restrictedCards: [],
        allowedCardTypes: Object.values(CardType),
        allowedElements: Object.values(CardElement),
        allowedFactions: Object.values(CardFaction),
        requiresCommander: false,
        allowsCompanion: false,
        maxSideboardSize: 999, // No limit in sealed
      },
      [GameFormat.COMMANDER]: {
        minDeckSize: 99,
        maxDeckSize: 99,
        maxCopiesOfCard: 1,
        allowedSets: [],
        bannedCards: [],
        restrictedCards: [],
        allowedCardTypes: Object.values(CardType),
        allowedElements: Object.values(CardElement),
        allowedFactions: Object.values(CardFaction),
        requiresCommander: true,
        allowsCompanion: false,
        maxSideboardSize: 0,
      },
      [GameFormat.BRAWL]: {
        minDeckSize: 59,
        maxDeckSize: 59,
        maxCopiesOfCard: 1,
        allowedSets: [],
        bannedCards: [],
        restrictedCards: [],
        allowedCardTypes: Object.values(CardType),
        allowedElements: Object.values(CardElement),
        allowedFactions: Object.values(CardFaction),
        requiresCommander: true,
        allowsCompanion: false,
        maxSideboardSize: 0,
      },
      [GameFormat.TOURNAMENT]: {
        minDeckSize: 60,
        maxDeckSize: 60,
        maxCopiesOfCard: 4,
        allowedSets: [],
        bannedCards: [],
        restrictedCards: [],
        allowedCardTypes: Object.values(CardType),
        allowedElements: Object.values(CardElement),
        allowedFactions: Object.values(CardFaction),
        requiresCommander: false,
        allowsCompanion: true,
        maxSideboardSize: 15,
      },
    };
    this.cardDatabase = {};
    this.loadRules();
  }

  /**
   * Load rules from the server or local storage
   */
  async loadRules(): Promise<void> {
    try {
      // Try to load from local storage first
      const cachedRules = localStorage.getItem('konivrer_rules');
      if (cachedRules) {
        this.rules = JSON.parse(cachedRules);
        
        // Check if rules are outdated
        const lastUpdated = localStorage.getItem('konivrer_rules_updated');
        if (lastUpdated) {
          const updateTime = new Date(lastUpdated);
          const now = new Date();
          const daysSinceUpdate = (now.getTime() - updateTime.getTime()) / (1000 * 60 * 60 * 24);
          
          // If rules are older than 1 day, fetch new ones
          if (daysSinceUpdate > 1) {
            this.fetchRules();
          }
        }
      } else {
        // No cached rules, fetch from server
        await this.fetchRules();
      }
    } catch (error) {
      console.error('Failed to load rules:', error);
    }
  }

  /**
   * Fetch rules from the server
   */
  private async fetchRules(): Promise<void> {
    try {
      const response = await fetch('/api/rules');
      if (!response.ok) {
        throw new Error(`Failed to fetch rules: ${response.status} ${response.statusText}`);
      }
      
      const rulesData = await response.json();
      this.rules = rulesData;
      
      // Update format rules with server data
      if (rulesData.formats) {
        this.formatRules = rulesData.formats;
      }
      
      // Cache rules
      localStorage.setItem('konivrer_rules', JSON.stringify(rulesData));
      localStorage.setItem('konivrer_rules_updated', new Date().toISOString());
    } catch (error) {
      console.error('Failed to fetch rules from server:', error);
    }
  }

  /**
   * Load card database
   * @param cards - Card database
   */
  loadCardDatabase(cards: Card[]): void {
    this.cardDatabase = {};
    cards.forEach(card => {
      this.cardDatabase[card.id] = card;
    });
  }

  /**
   * Validate a deck against the rules
   * @param deck - Deck to validate
   * @param format - Game format
   * @returns Validation result
   */
  validateDeck(deck: Deck): ValidationResult {
    const validations: ValidationIssue[] = [];
    const format = deck.format || GameFormat.STANDARD;
    const rules = this.formatRules[format];
    
    if (!rules) {
      validations.push({
        type: 'error',
        rule: 'unknown-format',
        message: `Unknown format: ${format}`,
        severity: 'high'
      });
      return { isValid: false, validations };
    }

    // Basic deck size validation
    const totalCards = this.getTotalCards(deck);
    const minCards = rules.minDeckSize;
    const maxCards = rules.maxDeckSize;

    if (totalCards < minCards) {
      validations.push({
        type: 'error',
        rule: 'deck-size-min',
        message: `Deck must have at least ${minCards} cards (currently ${totalCards})`,
        severity: 'high'
      });
    }

    if (totalCards > maxCards) {
      validations.push({
        type: 'error',
        rule: 'deck-size-max',
        message: `Deck must have at most ${maxCards} cards (currently ${totalCards})`,
        severity: 'high'
      });
    }

    // Commander validation
    if (rules.requiresCommander) {
      if (!deck.commander) {
        validations.push({
          type: 'error',
          rule: 'commander-required',
          message: 'This format requires a commander',
          severity: 'high'
        });
      } else {
        // Validate commander is a valid card for the format
        const commanderCard = deck.commander.card;
        if (!this.isCardLegal(commanderCard, format)) {
          validations.push({
            type: 'error',
            rule: 'commander-legality',
            message: `Commander ${commanderCard.name} is not legal in ${format}`,
            severity: 'high',
            affectedCards: [commanderCard.id]
          });
        }
        
        // Validate commander has the commander trait
        if (!commanderCard.keywords?.includes('Commander')) {
          validations.push({
            type: 'error',
            rule: 'commander-trait',
            message: `Commander ${commanderCard.name} does not have the Commander trait`,
            severity: 'high',
            affectedCards: [commanderCard.id]
          });
        }
      }
    } else if (deck.commander) {
      validations.push({
        type: 'warning',
        rule: 'commander-not-allowed',
        message: `This format does not use commanders`,
        severity: 'medium'
      });
    }

    // Companion validation
    if (deck.companion) {
      if (!rules.allowsCompanion) {
        validations.push({
          type: 'error',
          rule: 'companion-not-allowed',
          message: 'This format does not allow companions',
          severity: 'high'
        });
      } else {
        // Validate companion is a valid card for the format
        const companionCard = deck.companion.card;
        if (!this.isCardLegal(companionCard, format)) {
          validations.push({
            type: 'error',
            rule: 'companion-legality',
            message: `Companion ${companionCard.name} is not legal in ${format}`,
            severity: 'high',
            affectedCards: [companionCard.id]
          });
        }
        
        // Validate companion has the companion trait
        if (!companionCard.keywords?.includes('Companion')) {
          validations.push({
            type: 'error',
            rule: 'companion-trait',
            message: `Companion ${companionCard.name} does not have the Companion trait`,
            severity: 'high',
            affectedCards: [companionCard.id]
          });
        }
        
        // Validate companion requirements
        const companionRequirements = this.getCompanionRequirements(companionCard);
        if (companionRequirements && !this.checkCompanionRequirements(deck, companionRequirements)) {
          validations.push({
            type: 'error',
            rule: 'companion-requirements',
            message: `Deck does not meet the requirements for companion ${companionCard.name}`,
            severity: 'high',
            affectedCards: [companionCard.id]
          });
        }
      }
    }

    // Sideboard validation
    if (deck.sideboard && deck.sideboard.length > 0) {
      const sideboardSize = deck.sideboard.reduce((total, card) => total + card.quantity, 0);
      if (sideboardSize > rules.maxSideboardSize) {
        validations.push({
          type: 'error',
          rule: 'sideboard-size',
          message: `Sideboard must have at most ${rules.maxSideboardSize} cards (currently ${sideboardSize})`,
          severity: 'high'
        });
      }
      
      // Validate sideboard cards are legal
      const illegalSideboardCards = deck.sideboard
        .filter(card => !this.isCardLegal(card.card, format))
        .map(card => card.card.id);
      
      if (illegalSideboardCards.length > 0) {
        validations.push({
          type: 'error',
          rule: 'sideboard-legality',
          message: `Sideboard contains ${illegalSideboardCards.length} illegal cards`,
          severity: 'high',
          affectedCards: illegalSideboardCards
        });
      }
    }

    // Card copy limit validation
    const cardCounts: Record<string, number> = {};
    deck.cards.forEach(deckCard => {
      const cardId = deckCard.card.id;
      cardCounts[cardId] = (cardCounts[cardId] || 0) + deckCard.quantity;
    });
    
    const maxCopies = rules.maxCopiesOfCard;
    const cardsOverLimit = Object.entries(cardCounts)
      .filter(([_, count]) => count > maxCopies)
      .map(([cardId, count]) => ({
        cardId,
        count,
        name: this.cardDatabase[cardId]?.name || 'Unknown Card'
      }));
    
    if (cardsOverLimit.length > 0) {
      cardsOverLimit.forEach(card => {
        validations.push({
          type: 'error',
          rule: 'card-copy-limit',
          message: `Deck contains ${card.count} copies of ${card.name} (maximum is ${maxCopies})`,
          severity: 'high',
          affectedCards: [card.cardId]
        });
      });
    }

    // Card legality validation
    const illegalCards = deck.cards
      .filter(deckCard => !this.isCardLegal(deckCard.card, format))
      .map(deckCard => ({
        cardId: deckCard.card.id,
        name: deckCard.card.name,
        reason: this.getIllegalityReason(deckCard.card, format)
      }));
    
    if (illegalCards.length > 0) {
      illegalCards.forEach(card => {
        validations.push({
          type: 'error',
          rule: 'card-legality',
          message: `${card.name} is not legal in ${format}: ${card.reason}`,
          severity: 'high',
          affectedCards: [card.cardId]
        });
      });
    }

    // Element/faction balance check (warning only)
    const elementCounts: Record<CardElement, number> = {} as Record<CardElement, number>;
    const factionCounts: Record<CardFaction, number> = {} as Record<CardFaction, number>;
    
    deck.cards.forEach(deckCard => {
      const card = deckCard.card;
      const element = card.element as CardElement;
      const faction = card.faction as CardFaction;
      
      if (element) {
        elementCounts[element] = (elementCounts[element] || 0) + deckCard.quantity;
      }
      
      if (faction) {
        factionCounts[faction] = (factionCounts[faction] || 0) + deckCard.quantity;
      }
    });
    
    // Check if deck is heavily skewed towards one element
    const totalCards = Object.values(elementCounts).reduce((sum, count) => sum + count, 0);
    const dominantElement = Object.entries(elementCounts)
      .sort(([_, a], [__, b]) => b - a)
      .shift();
    
    if (dominantElement && totalCards > 0) {
      const [element, count] = dominantElement;
      const percentage = Math.round((count / totalCards) * 100);
      
      if (percentage > 80) {
        validations.push({
          type: 'info',
          rule: 'element-balance',
          message: `Deck is ${percentage}% ${element} element cards`,
          severity: 'low'
        });
      }
    }

    // Format-specific validations
    if (format === GameFormat.COMMANDER) {
      // Check color identity matches commander
      if (deck.commander) {
        const commanderElement = deck.commander.card.element as CardElement;
        const commanderFaction = deck.commander.card.faction as CardFaction;
        
        const invalidElementCards = deck.cards
          .filter(deckCard => {
            const cardElement = deckCard.card.element as CardElement;
            return cardElement !== CardElement.NEUTRAL && 
                   cardElement !== commanderElement && 
                   commanderElement !== CardElement.MULTI;
          })
          .map(deckCard => deckCard.card.id);
        
        const invalidFactionCards = deck.cards
          .filter(deckCard => {
            const cardFaction = deckCard.card.faction as CardFaction;
            return cardFaction !== CardFaction.NEUTRAL && 
                   cardFaction !== commanderFaction && 
                   commanderFaction !== CardFaction.MULTI;
          })
          .map(deckCard => deckCard.card.id);
        
        if (invalidElementCards.length > 0) {
          validations.push({
            type: 'error',
            rule: 'commander-element-identity',
            message: `Deck contains cards with elements that don't match the commander's element`,
            severity: 'high',
            affectedCards: invalidElementCards
          });
        }
        
        if (invalidFactionCards.length > 0) {
          validations.push({
            type: 'error',
            rule: 'commander-faction-identity',
            message: `Deck contains cards with factions that don't match the commander's faction`,
            severity: 'high',
            affectedCards: invalidFactionCards
          });
        }
      }
    }

    // Check for overall validity
    const hasErrors = validations.some(v => v.type === 'error');
    return {
      isValid: !hasErrors,
      validations
    };
  }

  /**
   * Get the total number of cards in a deck
   * @param deck - Deck to count
   * @returns Total number of cards
   */
  private getTotalCards(deck: Deck): number {
    return deck.cards.reduce((total, card) => total + card.quantity, 0);
  }

  /**
   * Check if a card is legal in a format
   * @param card - Card to check
   * @param format - Game format
   * @returns Whether the card is legal
   */
  isCardLegal(card: Card, format: GameFormat): boolean {
    const rules = this.formatRules[format];
    if (!rules) return false;
    
    // Check if card is banned
    if (rules.bannedCards.includes(card.id)) {
      return false;
    }
    
    // Check if card's set is allowed
    if (rules.allowedSets.length > 0 && !rules.allowedSets.includes(card.setCode)) {
      return false;
    }
    
    // Check if card type is allowed
    if (rules.allowedCardTypes.length > 0 && !rules.allowedCardTypes.includes(card.type as CardType)) {
      return false;
    }
    
    // Check if card element is allowed
    if (rules.allowedElements.length > 0 && !rules.allowedElements.includes(card.element as CardElement)) {
      return false;
    }
    
    // Check if card faction is allowed
    if (rules.allowedFactions.length > 0 && !rules.allowedFactions.includes(card.faction as CardFaction)) {
      return false;
    }
    
    return true;
  }

  /**
   * Get the reason a card is illegal in a format
   * @param card - Card to check
   * @param format - Game format
   * @returns Reason for illegality
   */
  private getIllegalityReason(card: Card, format: GameFormat): string {
    const rules = this.formatRules[format];
    if (!rules) return 'Unknown format';
    
    if (rules.bannedCards.includes(card.id)) {
      return 'Card is banned';
    }
    
    if (rules.allowedSets.length > 0 && !rules.allowedSets.includes(card.setCode)) {
      return `Set ${card.setCode} is not allowed in ${format}`;
    }
    
    if (rules.allowedCardTypes.length > 0 && !rules.allowedCardTypes.includes(card.type as CardType)) {
      return `Card type ${card.type} is not allowed in ${format}`;
    }
    
    if (rules.allowedElements.length > 0 && !rules.allowedElements.includes(card.element as CardElement)) {
      return `Element ${card.element} is not allowed in ${format}`;
    }
    
    if (rules.allowedFactions.length > 0 && !rules.allowedFactions.includes(card.faction as CardFaction)) {
      return `Faction ${card.faction} is not allowed in ${format}`;
    }
    
    return 'Unknown reason';
  }

  /**
   * Get companion requirements
   * @param card - Companion card
   * @returns Companion requirements or null if not found
   */
  private getCompanionRequirements(card: Card): Record<string, any> | null {
    if (!this.rules || !this.rules.cardRules) return null;
    
    const cardRules = this.rules.cardRules[card.id];
    if (!cardRules || !cardRules.companionRequirements) return null;
    
    return cardRules.companionRequirements;
  }

  /**
   * Check if a deck meets companion requirements
   * @param deck - Deck to check
   * @param requirements - Companion requirements
   * @returns Whether the deck meets the requirements
   */
  private checkCompanionRequirements(deck: Deck, requirements: Record<string, any>): boolean {
    // This would implement specific companion requirement checks
    // For example, "all cards must have even cost" or "no duplicates"
    
    if (requirements.noRepeats) {
      // Check if all cards are unique (singleton)
      const cardIds = new Set<string>();
      for (const deckCard of deck.cards) {
        if (deckCard.quantity > 1) return false;
        if (cardIds.has(deckCard.card.id)) return false;
        cardIds.add(deckCard.card.id);
      }
    }
    
    if (requirements.minCost !== undefined) {
      // Check if all cards have at least the minimum cost
      for (const deckCard of deck.cards) {
        if (deckCard.card.cost < requirements.minCost) return false;
      }
    }
    
    if (requirements.maxCost !== undefined) {
      // Check if all cards have at most the maximum cost
      for (const deckCard of deck.cards) {
        if (deckCard.card.cost > requirements.maxCost) return false;
      }
    }
    
    if (requirements.evenCost) {
      // Check if all cards have even cost
      for (const deckCard of deck.cards) {
        if (deckCard.card.cost % 2 !== 0) return false;
      }
    }
    
    if (requirements.oddCost) {
      // Check if all cards have odd cost
      for (const deckCard of deck.cards) {
        if (deckCard.card.cost % 2 === 0) return false;
      }
    }
    
    if (requirements.requiredElement) {
      // Check if all cards have the required element
      for (const deckCard of deck.cards) {
        const cardElement = deckCard.card.element as CardElement;
        if (cardElement !== requirements.requiredElement && 
            cardElement !== CardElement.NEUTRAL) {
          return false;
        }
      }
    }
    
    if (requirements.requiredFaction) {
      // Check if all cards have the required faction
      for (const deckCard of deck.cards) {
        const cardFaction = deckCard.card.faction as CardFaction;
        if (cardFaction !== requirements.requiredFaction && 
            cardFaction !== CardFaction.NEUTRAL) {
          return false;
        }
      }
    }
    
    if (requirements.requiredKeyword) {
      // Check if all cards have the required keyword
      for (const deckCard of deck.cards) {
        if (!deckCard.card.keywords?.includes(requirements.requiredKeyword)) {
          return false;
        }
      }
    }
    
    return true;
  }

  /**
   * Get the minimum deck size for a format
   * @param format - Game format
   * @returns Minimum deck size
   */
  getMinDeckSize(format: GameFormat = GameFormat.STANDARD): number {
    return this.formatRules[format]?.minDeckSize || 60;
  }

  /**
   * Get the maximum deck size for a format
   * @param format - Game format
   * @returns Maximum deck size
   */
  getMaxDeckSize(format: GameFormat = GameFormat.STANDARD): number {
    return this.formatRules[format]?.maxDeckSize || 100;
  }

  /**
   * Get the maximum copies of a card allowed in a format
   * @param format - Game format
   * @returns Maximum copies allowed
   */
  getMaxCopiesOfCard(format: GameFormat = GameFormat.STANDARD): number {
    return this.formatRules[format]?.maxCopiesOfCard || 4;
  }

  /**
   * Get the maximum sideboard size for a format
   * @param format - Game format
   * @returns Maximum sideboard size
   */
  getMaxSideboardSize(format: GameFormat = GameFormat.STANDARD): number {
    return this.formatRules[format]?.maxSideboardSize || 15;
  }

  /**
   * Get all legal sets for a format
   * @param format - Game format
   * @returns Array of legal set codes
   */
  getLegalSets(format: GameFormat = GameFormat.STANDARD): string[] {
    return this.formatRules[format]?.allowedSets || [];
  }

  /**
   * Get all banned cards for a format
   * @param format - Game format
   * @returns Array of banned card IDs
   */
  getBannedCards(format: GameFormat = GameFormat.STANDARD): string[] {
    return this.formatRules[format]?.bannedCards || [];
  }

  /**
   * Get all restricted cards for a format
   * @param format - Game format
   * @returns Array of restricted card IDs
   */
  getRestrictedCards(format: GameFormat = GameFormat.STANDARD): string[] {
    return this.formatRules[format]?.restrictedCards || [];
  }

  /**
   * Check if a format requires a commander
   * @param format - Game format
   * @returns Whether the format requires a commander
   */
  requiresCommander(format: GameFormat = GameFormat.STANDARD): boolean {
    return this.formatRules[format]?.requiresCommander || false;
  }

  /**
   * Check if a format allows a companion
   * @param format - Game format
   * @returns Whether the format allows a companion
   */
  allowsCompanion(format: GameFormat = GameFormat.STANDARD): boolean {
    return this.formatRules[format]?.allowsCompanion || false;
  }

  /**
   * Get all available formats
   * @returns Array of game formats
   */
  getAvailableFormats(): GameFormat[] {
    return Object.keys(this.formatRules) as GameFormat[];
  }

  /**
   * Get rules for a specific format
   * @param format - Game format
   * @returns Format rules
   */
  getFormatRules(format: GameFormat): FormatRules | null {
    return this.formatRules[format] || null;
  }

  /**
   * Get rules for a specific card
   * @param cardId - Card ID
   * @returns Card rules or null if not found
   */
  getCardRules(cardId: string): Record<string, any> | null {
    if (!this.rules || !this.rules.cardRules) return null;
    return this.rules.cardRules[cardId] || null;
  }

  /**
   * Get rules for a specific keyword
   * @param keyword - Keyword name
   * @returns Keyword rules or null if not found
   */
  getKeywordRules(keyword: string): Record<string, any> | null {
    if (!this.rules || !this.rules.keywords) return null;
    return this.rules.keywords[keyword] || null;
  }

  /**
   * Get rules for a specific ability
   * @param ability - Ability name
   * @returns Ability rules or null if not found
   */
  getAbilityRules(ability: string): Record<string, any> | null {
    if (!this.rules || !this.rules.abilities) return null;
    return this.rules.abilities[ability] || null;
  }

  /**
   * Get interaction rules between cards
   * @param cardId1 - First card ID
   * @param cardId2 - Second card ID
   * @returns Interaction rules or null if not found
   */
  getInteractionRules(cardId1: string, cardId2: string): Record<string, any> | null {
    if (!this.rules || !this.rules.interactions) return null;
    
    // Check for specific interaction
    const key1 = `${cardId1}:${cardId2}`;
    const key2 = `${cardId2}:${cardId1}`;
    
    return this.rules.interactions[key1] || 
           this.rules.interactions[key2] || 
           null;
  }

  /**
   * Get the rules version
   * @returns Rules version
   */
  getRulesVersion(): string {
    return this.rules?.version || 'unknown';
  }
}

// Create singleton instance
const rulesEngine = new RulesEngine();

export default rulesEngine;