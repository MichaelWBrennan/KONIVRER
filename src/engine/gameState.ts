/**
 * KONIVRER Game State Management
 * This file defines the core game state structure and initialization functions
 */

export interface Card {
  id: string;
  name: string;
  type?: string;
  isFlag?: boolean;
  [key: string]: any;
}

export interface PlayerState {
  id: string;
  name: string;
  flagZone: Card | null;
  lifeCards: Card[];
  hand: Card[];
  field: Card[];
  combatRow: Card[];
  azothRow: Card[];
  deck: Card[];
  discardPile: Card[];
  removedFromPlay: Card[];
  drawBonus: number;
  effectModifiers: any[];
}

export interface GameState {
  gameId: string;
  startTime: number;
  currentTurn: number;
  activePlayer: string;
  phase: string;
  gameOver: boolean;
  winner: string | null;
  players: {
    player1: PlayerState;
    player2: PlayerState;
  };
  gameLog: string[];
  pendingActions: any[];
  actionHistory: any[];
  waitingForInput?: boolean;
  inputType?: string;
  inputData?: any;
}

/**
 * Create an empty game state with all required properties
 * @returns Empty game state
 */
export function createEmptyGameState(): GameState {
  return {
    // Game metadata
    gameId: generateGameId(),
    startTime: Date.now(),
    currentTurn: 1,
    activePlayer: 'player1',
    phase: 'PRE_GAME',
    gameOver: false,
    winner: null,
    
    // Players
    players: {
      player1: createEmptyPlayerState('player1'),
      player2: createEmptyPlayerState('player2')
    },
    
    // Game log
    gameLog: [],
    
    // Current actions
    pendingActions: [],
    actionHistory: []
  };
}

/**
 * Create an empty player state with all required zones
 * @param playerId - Player identifier
 * @returns Empty player state
 */
function createEmptyPlayerState(playerId: string): PlayerState {
  return {
    // Identity
    id: playerId,
    name: playerId === 'player1' ? 'Player 1' : 'Player 2',
    
    // Zones
    flagZone: null,
    lifeCards: [],
    hand: [],
    field: [],
    combatRow: [],
    azothRow: [],
    deck: [],
    discardPile: [],
    removedFromPlay: [],
    
    // Status
    drawBonus: 0,
    effectModifiers: []
  };
}

/**
 * Initialize a new game with decks
 * @param player1Deck - Array of card objects for player 1
 * @param player2Deck - Array of card objects for player 2
 * @returns Initialized game state
 */
export function initializeGame(player1Deck: Card[], player2Deck: Card[]): GameState {
  // Create initial game state
  const gameState = createEmptyGameState();
  
  // Set up player 1
  gameState.players.player1.deck = shuffleDeck(player1Deck);
  // Pre-Game Action: Take top 4 cards as Life Cards
  const player1LifeCards = gameState.players.player1.deck.splice(0, 4);
  gameState.players.player1.lifeCards = player1LifeCards;
  
  // Set up player 2
  gameState.players.player2.deck = shuffleDeck(player2Deck);
  // Pre-Game Action: Take top 4 cards as Life Cards
  const player2LifeCards = gameState.players.player2.deck.splice(0, 4);
  gameState.players.player2.lifeCards = player2LifeCards;
  
  // Set up Flags
  const player1Flag = player1Deck.find(card => card.isFlag);
  const player2Flag = player2Deck.find(card => card.isFlag);
  
  if (player1Flag) {
    gameState.players.player1.flagZone = player1Flag;
  }
  
  if (player2Flag) {
    gameState.players.player2.flagZone = player2Flag;
  }
  
  // Start Phase: Draw 2 cards (only at game start)
  let updatedGameState = drawCards(gameState, 'player1', 2);
  updatedGameState = drawCards(updatedGameState, 'player2', 2);
  
  // Initialize first turn
  updatedGameState.currentTurn = 1;
  updatedGameState.activePlayer = 'player1';
  updatedGameState.phase = 'START';
  
  // Log game start
  updatedGameState.gameLog.push('Game started');
  
  return updatedGameState;
}

/**
 * Shuffle a deck of cards
 * @param deck - Array of card objects
 * @returns Shuffled deck
 */
export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Draw multiple cards
 * @param gameState - Current game state
 * @param playerId - Player identifier
 * @param count - Number of cards to draw
 * @returns Updated game state
 */
export function drawCards(gameState: GameState, playerId: string, count: number): GameState {
  let updatedGameState = { ...gameState };
  for (let i = 0; i < count; i++) {
    updatedGameState = drawCard(updatedGameState, playerId);
  }
  return updatedGameState;
}

/**
 * Draw a single card
 * @param gameState - Current game state
 * @param playerId - Player identifier
 * @returns Updated game state
 */
export function drawCard(gameState: GameState, playerId: string): GameState {
  const updatedGameState = { ...gameState };
  
  if (updatedGameState.players[playerId].deck.length > 0) {
    const drawnCard = updatedGameState.players[playerId].deck.pop();
    if (drawnCard) {
      updatedGameState.players[playerId].hand.push(drawnCard);
      updatedGameState.gameLog.push(`${playerId} draws a card`);
    }
  } else {
    updatedGameState.gameLog.push(`${playerId} has no cards left to draw!`);
  }
  
  return updatedGameState;
}

/**
 * Get the opponent's player ID
 * @param playerId - Player identifier
 * @returns Opponent's player identifier
 */
export function getOpponent(playerId: string): string {
  return playerId === 'player1' ? 'player2' : 'player1';
}

/**
 * Generate a unique game ID
 * @returns Unique game ID
 */
function generateGameId(): string {
  return 'game-' + Math.random().toString(36).substring(2, 9);
}

export default {
  createEmptyGameState,
  initializeGame,
  shuffleDeck,
  drawCards,
  drawCard,
  getOpponent
};