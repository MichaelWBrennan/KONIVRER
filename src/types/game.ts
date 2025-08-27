/**
 * KONIVRER Azoth TCG Card Simulator Types
 */

export interface Card {
  id: string;
  name: string;
  elements: string[]; // KONIVRER supports multiple elements per card
  lesserType: string; // KONIVRER-specific card type system
  abilities?: string[]; // Keyword and other abilities
  azothCost: number; // KONIVRER uses Azoth instead of mana
  power?: number;
  toughness?: number;
  rulesText?: string;
  flavorText?: string;
  rarity: "common" | "uncommon" | "rare"; // KONIVRER uses ☽, ☉, 🜠 symbols
  setCode: string;
  setNumber: number;
  imageUrl?: string;
  webpUrl?: string;
  isTapped?: boolean;
  isSelected?: boolean;
  counters?: Record<string, number>;
  // Legacy fields for backward compatibility
  type?: string;
  element?: string;
  cost?: number;
  description?: string;
  manaCost?: number;
  color?: string;
  text?: string;
}

export interface GameZone {
  id: string;
  name: string;
  cards: Card[];
  isVisible: boolean;
  allowDrop: boolean;
  maxCards?: number;
  layout: "stack" | "grid" | "fan" | "row";
  position?: { x: number; y: number; width: number; height: number };
}

// KONIVRER-specific zones
export type KonivrverZoneType =
  | "field" // Main battlefield for creatures and permanents
  | "combatRow" // Active combat and temporary effects (horizontal above Field)
  | "azothRow" // Resource management and energy system (full-width bottom)
  | "hand" // Player's hand
  | "deck" // Player library and draw pile
  | "lifeCards" // Life Cards instead of life points
  | "flag" // Special objective markers and game state indicators
  | "removedFromPlay" // Exiled and removed cards (also called "Void")
  | "stack"; // The stack for resolving spells and abilities

export interface PlayerState {
  id: string;
  name: string;
  azothPool: Record<string, number>; // KONIVRER uses Azoth instead of mana
  zones: Record<KonivrverZoneType, GameZone>;
  flag?: Card; // KONIVRER has a Flag card that anchors deck identity
  // Legacy compatibility
  life?: number; // For backward compatibility with existing UI
  manaPool?: Record<string, number>; // For backward compatibility
}

// KONIVRER game phases
export type KonivrverPhase =
  | "preGame" // Pre-Game setup
  | "start" // Start phase
  | "main" // Main phase
  | "combat" // Combat phase
  | "postCombat" // Post-Combat phase
  | "refresh"; // Refresh phase

export interface GameState {
  players: [PlayerState, PlayerState];
  currentPlayer: number;
  turn: number;
  phase: KonivrverPhase;
  stack: Card[]; // Dynamic Resolution Chain (DRC)
  activePlayer: number;
  priorityPlayer: number;

  // KONIVRER-specific state
  deckConstructionRules: {
    totalCards: number; // 40 cards total
    commonCards: number; // 25 Common (🜠) cards
    uncommonCards: number; // 13 Uncommon (☽) cards
    rareCards: number; // 2 Rare (☉) cards
    flagRequired: boolean; // 1 Flag required (does not count toward total)
    maxCopiesPerCard: number; // 1 copy per card maximum
  };
}

export interface DragState {
  isDragging: boolean;
  draggedCard?: Card;
  dragOffset: { x: number; y: number };
  sourceZone?: KonivrverZoneType;
  validDropZones: KonivrverZoneType[];
}

export interface TouchState {
  isLongPress: boolean;
  touchStartTime: number;
  touchPosition: { x: number; y: number };
}

// KONIVRER Keyword Abilities
export type KonivrverKeywordAbility =
  | "amalgam" // Combines with other cards
  | "brilliance" // Light-based ability
  | "gust" // Air-based ability
  | "inferno" // Fire-based ability
  | "steadfast" // Earth-based ability
  | "submerged" // Water-based ability
  | "quintessence" // Multi-element ability
  | "void"; // Dark-based ability

// KONIVRER Rule System Structure for JSON parsing
export interface KonivrverRule {
  section: string;
  title: string;
  content: string;
  keywords: string[];
  subsections?: KonivrverRule[];
}

// KONIVRER Deck Validation
export interface DeckValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  cardCounts: {
    total: number;
    common: number;
    uncommon: number;
    rare: number;
  };
  hasFlag: boolean;
  duplicateCards: string[];
}
