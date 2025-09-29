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
  abilities: string[] | undefined; // Keyword and other abilities
  azothCost: number; // KONIVRER uses Azoth instead of mana
  power: number | undefined;
  toughness: number | undefined;
  rulesText: string | undefined;
  flavorText: string | undefined;
  rarity: "common" | "uncommon" | "rare"; // KONIVRER uses ☽, ☉, 🜠 symbols
  setCode: string;
  setNumber: number;
  imageUrl: string;
  webpUrl: string | undefined;
  imageHash: string | undefined; // For caching
  isTapped: boolean | undefined;
  isSelected: boolean | undefined;
  counters: Record<string, number> | undefined;
  // Legacy fields for backward compatibility
  type: string | undefined;
  element: string | undefined;
  cost: number | undefined;
  description: string | undefined;
  manaCost: number | undefined;
  color: string | undefined;
  text: string | undefined;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface DeckApiResponse {
  id: string;
  name: string;
  description?: string;
  cards: Card[];
  flag?: Card;
  ownerId: string;
  isPublic: boolean;
  format?: string;
  createdAt: string;
  updatedAt: string;
  azothIdentity?: string[];
  validationResult?: DeckValidationResult;
}

export interface UserApiResponse {
  id: string;
  username: string;
  email: string;
  rating?: number;
  level?: number;
  experience?: number;
  lastActive?: string;
}

export interface EventApiResponse {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  format: string;
  maxParticipants?: number;
  currentParticipants: number;
  status: "upcoming" | "active" | "completed" | "cancelled";
  organizerId: string;
  location?: string;
  entryFee?: number;
  prizes?: string[];
  rules?: string;
}

export interface CardStatistics {
  totalCards: number;
  byRarity: Record<string, number>;
  byElement: Record<string, number>;
  byType: Record<string, number>;
}

export interface SearchFilters {
  rarity?: string;
  element?: string;
  type?: string;
  cost?: number;
  power?: number;
  toughness?: number;
  [key: string]: unknown;
}

// Asset module declarations
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
