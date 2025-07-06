// Game state and mechanics types
export interface GameState {
  turn: number;
  phase: 'start' | 'main' | 'combat' | 'refresh';
  activePlayer: 'player' | 'opponent';
  playerLifeCards: number;
  opponentLifeCards: number;
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

export interface GameAction {
  type: string;
  payload: any;
  playerId: string;
  timestamp: Date;
}

export interface Player {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  wins: number;
  losses: number;
}