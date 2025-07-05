/**
 * KONIVRER Deck Database - Game Type Definitions
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { Card, Flag } from './card';

/**
 * Game phase types in KONIVRER
 */
export type GamePhase = 'start' | 'main' | 'combat' | 'refresh';

/**
 * Player types in the game
 */
export type PlayerType = 'player' | 'opponent';

/**
 * Complete game state for KONIVRER
 */
export interface GameState {
  turn: number;
  phase: GamePhase;
  activePlayer: PlayerType;
  playerLifeCards: number;
  opponentLifeCards: number;
  playerFlag: Flag;
  opponentFlag: Flag;
  playerField: Card[];
  opponentField: Card[];
  playerCombatRow: Card[];
  opponentCombatRow: Card[];
  playerAzoth: Card[];
  opponentAzoth: Card[];
  playerHand: Card[];
  opponentHandCount: number;
  playerDeckCount: number;
  opponentDeckCount: number;
  playerRemovedFromPlay: Card[];
  opponentRemovedFromPlay: Card[];
}

/**
 * Entry in the Dynamic Resolution Chain stack
 */
export interface StackEntry {
  effect: {
    type: string;
    card: Card;
    target?: any;
  };
  player: PlayerType;
  timestamp: number;
}

/**
 * Game action types
 */
export type GameAction = 
  | { type: 'PLAY_CARD'; card: Card; mode: 'familiar' | 'spell' }
  | { type: 'PLACE_AZOTH'; card: Card }
  | { type: 'MOVE_TO_COMBAT'; card: Card }
  | { type: 'TOGGLE_REST'; card: Card; zone: 'field' | 'azoth' }
  | { type: 'PASS_PRIORITY' }
  | { type: 'NEXT_PHASE' }
  | { type: 'DRAW_CARD' }
  | { type: 'ATTACK'; cards: Card[] }
  | { type: 'BLOCK'; attackerId: string; blockerId: string }
  | { type: 'RESOLVE_COMBAT' }
  | { type: 'CHANGE_LIFE'; player: PlayerType; amount: number };

/**
 * AI decision for KONIVRER
 */
export interface AIDecision {
  action: 'placeAzoth' | 'summon' | 'spell' | 'tribute' | 'attack' | 'pass';
  card?: Card;
  attackers?: { card: Card; value: number }[];
  tributeTargets?: Card[];
  target?: Card;
  thinkingTime?: number;
}

/**
 * Game result
 */
export interface GameResult {
  winner: PlayerType | 'draw';
  playerLifeRemaining: number;
  opponentLifeRemaining: number;
  turns: number;
  duration: number; // in seconds
  playerDeckName?: string;
  opponentDeckName?: string;
}

/**
 * Game options for setup
 */
export interface GameOptions {
  playerDeck?: Card[];
  opponentDeck?: Card[];
  playerFlag?: Flag;
  opponentFlag?: Flag;
  startingPlayer?: PlayerType;
  timeLimit?: number; // in seconds
  format?: string;
}

/**
 * Game event for logging and analysis
 */
export interface GameEvent {
  type: string;
  player: PlayerType;
  data: any;
  timestamp: number;
  turn: number;
  phase: GamePhase;
}