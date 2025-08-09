// Re-export all types from various type definition files
export * from './game';

// Additional common types that might be referenced from components
export interface User {
  id: string;
  username: string;
  email: string;
  rating?: number;
  level?: number;
  experience?: number;
  lastActive?: Date;
}

export interface Deck {
  id: string;
  name: string;
  description?: string;
  cards: Card[];
  ownerId: string;
  isPublic: boolean;
  format?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Re-export Card type with extended properties that might be needed
export interface Card {
  id: string;
  name: string;
  manaCost: number;
  type: string;
  subtype?: string;
  power?: number;
  toughness?: number;
  text?: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'mythic';
  color: 'white' | 'blue' | 'black' | 'red' | 'green' | 'colorless' | 'multicolor';
  imageUrl?: string;
  webpUrl?: string;
  element?: string;
  cost?: number;
  description?: string;
  keywords?: string[];
  isTapped?: boolean;
  isSelected?: boolean;
  counters?: Record<string, number>;
}