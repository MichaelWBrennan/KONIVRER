/**
 * MTG Arena Card Simulator Types
 */

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
  isTapped?: boolean;
  isSelected?: boolean;
  counters?: Record<string, number>;
}

export interface GameZone {
  id: string;
  name: string;
  cards: Card[];
  isVisible: boolean;
  allowDrop: boolean;
  maxCards?: number;
  layout: 'stack' | 'grid' | 'fan';
}

export interface PlayerState {
  id: string;
  name: string;
  life: number;
  manaPool: Record<string, number>;
  zones: Record<string, GameZone>;
}

export interface GameState {
  players: [PlayerState, PlayerState];
  currentPlayer: number;
  turn: number;
  phase: 'untap' | 'upkeep' | 'draw' | 'main1' | 'combat' | 'main2' | 'end' | 'cleanup';
  stack: Card[];
  activePlayer: number;
  priorityPlayer: number;
}

export interface DragState {
  isDragging: boolean;
  draggedCard?: Card;
  dragOffset: { x: number; y: number };
  sourceZone?: string;
  validDropZones: string[];
}

export interface TouchState {
  isLongPress: boolean;
  touchStartTime: number;
  touchPosition: { x: number; y: number };
}