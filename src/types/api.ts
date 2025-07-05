/**
 * KONIVRER Deck Database - API Type Definitions
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

/**
 * Standard API response format
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Paginated API response format
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * User data structure
 */
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  created: Date;
  lastLogin?: Date;
  isAdmin: boolean;
}

/**
 * Authentication response
 */
export interface AuthResponse extends ApiResponse<User> {
  token?: string;
}

/**
 * Push notification subscription
 */
export interface NotificationSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  userId: string;
}

/**
 * Message between users
 */
export interface Message {
  id: string;
  sender: string;
  recipient: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

/**
 * Tournament data structure
 */
export interface Tournament {
  id: string;
  name: string;
  description: string;
  format: string;
  startDate: Date;
  endDate?: Date;
  status: 'upcoming' | 'active' | 'completed';
  participants: string[];
  rounds: TournamentRound[];
  organizer: string;
}

/**
 * Tournament round
 */
export interface TournamentRound {
  id: string;
  number: number;
  matches: TournamentMatch[];
  status: 'upcoming' | 'active' | 'completed';
  startTime?: Date;
  endTime?: Date;
}

/**
 * Tournament match
 */
export interface TournamentMatch {
  id: string;
  player1: string;
  player2: string;
  winner?: string;
  score?: {
    player1: number;
    player2: number;
  };
  status: 'upcoming' | 'active' | 'completed';
  tableNumber?: number;
}

/**
 * API endpoints
 */
export enum ApiEndpoints {
  // Auth endpoints
  LOGIN = '/api/auth/login',
  REGISTER = '/api/auth/register',
  LOGOUT = '/api/auth/logout',
  REFRESH_TOKEN = '/api/auth/refresh',
  
  // User endpoints
  USERS = '/api/users',
  USER_BY_ID = '/api/users/:id',
  USER_PROFILE = '/api/users/profile',
  
  // Card endpoints
  CARDS = '/api/cards',
  CARD_BY_ID = '/api/cards/:id',
  CARD_SEARCH = '/api/cards/search',
  
  // Deck endpoints
  DECKS = '/api/decks',
  DECK_BY_ID = '/api/decks/:id',
  DECK_SEARCH = '/api/decks/search',
  
  // Tournament endpoints
  TOURNAMENTS = '/api/tournaments',
  TOURNAMENT_BY_ID = '/api/tournaments/:id',
  TOURNAMENT_REGISTER = '/api/tournaments/:id/register',
  TOURNAMENT_RESULTS = '/api/tournaments/:id/results',
  
  // Notification endpoints
  NOTIFICATIONS = '/api/notifications',
  NOTIFICATION_SUBSCRIBE = '/api/notifications/subscribe',
  NOTIFICATION_UNSUBSCRIBE = '/api/notifications/unsubscribe',
  
  // Message endpoints
  MESSAGES = '/api/messages',
  MESSAGE_BY_ID = '/api/messages/:id',
  MESSAGE_SEND = '/api/messages/send',
  MESSAGE_READ = '/api/messages/:id/read'
}

/**
 * API request options
 */
export interface ApiRequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
  withCredentials?: boolean;
}

/**
 * API error
 */
export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: any;
}