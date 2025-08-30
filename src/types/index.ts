export {};
export {};
export {};
export {};
export {};
export {};
export {};
export {};
export {};
export {};
export {};
export {};
export {};
export {};
export {};
export {};
export {};
export {};
export {};
export {};
export {};
export {};
export {};
export {};
export {};
export {};
export {};
export {};
// Re-export all types from various type definition files
export * from "./game";

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

// Import DeckValidationResult from game.ts
import type { DeckValidationResult } from "./game";

export interface Deck {
  id: string;
  name: string;
  description?: string;
  cards: Card[];
  flag?: Card; // KONIVRER requires a Flag card
  ownerId: string;
  isPublic: boolean;
  format?: string;
  createdAt: Date;
  updatedAt: Date;
  // KONIVRER-specific fields
  azothIdentity?: string[]; // Elements supported by the deck's flag
  validationResult?: DeckValidationResult;
}

// Re-export Card type with KONIVRER extensions
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
declare module "*.css";
declare module "*.svg";
declare module "*.png";
declare module "*.css";
declare module "*.svg";
declare module "*.png";
declare module "*.css";
declare module "*.svg";
declare module "*.png";
declare module "*.css";
declare module "*.svg";
declare module "*.png";
declare module "*.css";
declare module "*.svg";
declare module "*.png";
declare module "*.css";
declare module "*.svg";
declare module "*.png";
declare module "*.css";
declare module "*.svg";
declare module "*.png";
declare module "*.css";
declare module "*.svg";
declare module "*.png";
declare module "*.css";
declare module "*.svg";
declare module "*.png";
declare module "*.css";
declare module "*.svg";
declare module "*.png";
declare module "*.css";
declare module "*.svg";
declare module "*.png";
declare module "*.css";
declare module "*.svg";
declare module "*.png";
declare module "*.css";
declare module "*.svg";
declare module "*.png";
declare module "*.css";
declare module "*.svg";
declare module "*.png";
declare module "*.css";
declare module "*.svg";
declare module "*.png";
declare module "*.css";
declare module "*.svg";
declare module "*.png";
declare module "*.css";
declare module "*.svg";
declare module "*.png";
declare module "*.css";
declare module "*.svg";
declare module "*.png";
declare module "*.css";
declare module "*.svg";
declare module "*.png";
declare module "*.css";
declare module "*.svg";
declare module "*.png";
declare module "*.css";
declare module "*.svg";
declare module "*.png";
declare module "*.css";
declare module "*.svg";
declare module "*.png";
declare module "*.css";
declare module "*.svg";
declare module "*.png";
declare module "*.css";
declare module "*.svg";
declare module "*.png";
declare module "*.css";
declare module "*.svg";
declare module "*.png";
declare module "*.css";
declare module "*.svg";
declare module "*.png";
declare module "*.css";
declare module "*.svg";
declare module "*.png";
declare module '*.css';
declare module '*.svg';
declare module '*.png';
