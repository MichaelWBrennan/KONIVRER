// Card type definitions for KONIVRER
export interface Element {
  id: string;
  name: string;,
  symbol: string;
  color: string;
}

export interface Keyword {
  id: string;
  name: string;,
  description: string;
  reminder?: string;
}

export interface Card {
  id: string;
  name: string;,
  elements: Element[];
  cost: number;,
  type: 'Familiar' | 'Spell';,
  counters?: number;
  keywords: Keyword[];
  text: string;,
  image: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'mythic';
  rested?: boolean;
  set?: string;
  artist?: string;
  flavorText?: string;
}

export interface Deck {
  id: string;
  name: string;,
  cards: Card[];
  format: string;
  isValid: boolean;
  createdAt: Date;
  updatedAt: Date;
}