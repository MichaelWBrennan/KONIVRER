/**
 * Constants for the KONIVRER Physical Matchmaking component
 */

// Application version
export const APP_VERSION = '1.0.0';

// Default values
export const DEFAULT_RATING = 1500;
export const DEFAULT_QR_SIZE = 200;
export const DEFAULT_CONFIDENCE_FACTOR = 100;

// Match status options
export const MATCH_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Tournament status options
export const TOURNAMENT_STATUS = {
  REGISTRATION: 'registration',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Tournament formats
export const TOURNAMENT_FORMATS = {
  SWISS: 'Swiss',
  SINGLE_ELIMINATION: 'Single Elimination',
  DOUBLE_ELIMINATION: 'Double Elimination',
  ROUND_ROBIN: 'Round Robin',
};

// Tournament types
export const TOURNAMENT_TYPES = {
  STANDARD: 'Standard',
  MODERN: 'Modern',
  LEGACY: 'Legacy',
  VINTAGE: 'Vintage',
  COMMANDER: 'Commander',
  DRAFT: 'Draft',
  SEALED: 'Sealed',
};

// Match formats
export const MATCH_FORMATS = {
  BEST_OF_1: 'Best of 1',
  BEST_OF_3: 'Best of 3',
  BEST_OF_5: 'Best of 5',
};

// QR code types
export const QR_CODE_TYPES = {
  MATCH: 'match',
  TOURNAMENT: 'tournament',
  PLAYER: 'player',
};

// Error messages
export const ERROR_MESSAGES = {
  MATCH_NOT_FOUND: 'Match not found',
  TOURNAMENT_NOT_FOUND: 'Tournament not found',
  PLAYER_NOT_FOUND: 'Player not found',
  INVALID_QR_DATA: 'Invalid QR code data',
  MISSING_REQUIRED_FIELD: 'Missing required field',
  NETWORK_ERROR: 'Network error, please try again',
  UNKNOWN_ERROR: 'An unknown error occurred',
};

// Local storage keys
export const STORAGE_KEYS = {
  PLAYERS: 'konivrer_players',
  TOURNAMENTS: 'konivrer_tournaments',
  MATCHES: 'konivrer_matches',
  THEME_PREFERENCE: 'konivrer_theme_preference',
  DEBUG_MODE: 'konivrer_debug_mode',
  SELECTED_MATCH_ID: 'konivrer_selected_match_id',
  SELECTED_TOURNAMENT_ID: 'konivrer_selected_tournament_id',
};

// Theme options
export const THEMES = {
  STANDARD: 'standard',
  ANCIENT: 'ancient',
};

// API endpoints (for future use)
export const API_ENDPOINTS = {
  PLAYERS: '/api/players',
  TOURNAMENTS: '/api/tournaments',
  MATCHES: '/api/matches',
};
