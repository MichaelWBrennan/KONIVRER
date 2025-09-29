export {};
// Re-export all types from various type definition files
export * from "./game";

// Import types from data/cards.ts to maintain consistency
export type { Card, Deck } from "../data/cards";

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

// Import types for API responses
import type { Card, DeckValidationResult } from "./game";

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
