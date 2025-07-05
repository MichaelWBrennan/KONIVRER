/**
 * KONIVRER Deck Database - Card Type Definitions
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

/**
 * Element represents one of the elemental types in KONIVRER
 */
export interface Element {
  id: string;
  name: string;
  symbol: string;
  color: string;
}

/**
 * Keyword represents a special ability or mechanic in KONIVRER
 */
export interface Keyword {
  id: string;
  name: string;
  description: string;
}

/**
 * Card represents a KONIVRER card with all its properties
 */
export interface Card {
  id: string;
  name: string;
  elements: Element[];
  cost: number;
  type: 'Familiar' | 'Spell';
  counters?: number;
  keywords: Keyword[];
  text: string;
  image: string;
  rarity?: 'common' | 'uncommon' | 'rare';
  rested?: boolean;
}

/**
 * Deck represents a collection of cards for play
 */
export interface Deck {
  id: string;
  name: string;
  description: string;
  cards: Card[];
  owner: string;
  created: Date;
  updated: Date;
  isPublic: boolean;
  format: string;
  tags: string[];
}

/**
 * Flag represents a player's elemental identity
 */
export interface Flag {
  name: string;
  elements: Element[];
  image: string;
}

/**
 * CardFilter represents search criteria for filtering cards
 */
export interface CardFilter {
  name?: string;
  elements?: string[];
  type?: string;
  keywords?: string[];
  rarity?: string[];
  cost?: {
    min?: number;
    max?: number;
  };
  counters?: {
    min?: number;
    max?: number;
  };
}

/**
 * DeckFilter represents search criteria for filtering decks
 */
export interface DeckFilter {
  name?: string;
  owner?: string;
  format?: string;
  tags?: string[];
  elements?: string[];
  isPublic?: boolean;
}

/**
 * CardStats represents statistical information about a card
 */
export interface CardStats {
  usageCount: number;
  winRate: number;
  popularDecks: string[];
  averageCopiesPerDeck: number;
}

/**
 * DeckStats represents statistical information about a deck
 */
export interface DeckStats {
  winRate: number;
  matchCount: number;
  tournamentResults: {
    wins: number;
    losses: number;
    draws: number;
  };
  mostPlayedCards: {
    cardId: string;
    count: number;
  }[];
}

export type CardType = 'Familiar' | 'Spell';
export type CardRarity = 'common' | 'uncommon' | 'rare';
export type ElementType = 'FIRE' | 'WATER' | 'EARTH' | 'AIR' | 'AETHER' | 'NETHER' | 'GENERIC';