// Card type definitions for KONIVRER
export interface Element {
  id: string;
  name: string;
  symbol: string;
  color: string
  
}

export interface Keyword {
  id: string;
  name: string;
  description: string;
  reminder?: string
  
}

// Updated Card interface to match the actual data structure
export interface Card {
  id: string;
  name: string;
  type: string;
  elements: string[
    ;
  cost: string[
  ];
  attack?: number | null;
  defense?: number | null;
  rarity: string;
  set: string;
  description: string;
  keywords: string[
    ;
  artist: string;
  flavorText: string;
  collectorNumber: string;
  setSymbol: string;
  quantity?: number;
  // Legacy fields for compatibility
  text?: string;
  image?: string;
  counters?: number;
  rested?: boolean
  
}

export interface Deck {
  id: string;
  name: string;
  cards: Card[
  ];
  format: string;
  isValid: boolean;
  createdAt: Date;
  updatedAt: Date
  
}