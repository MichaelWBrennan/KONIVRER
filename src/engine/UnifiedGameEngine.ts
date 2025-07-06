/**
 * KONIVRER Unified Game Engine
 * 
 * A unified game engine that combines functionality from:
 * - GameEngine
 * - KonivrERGameEngine
 * - AIDecisionEngine
 * - AIPlayer
 * - AdvancedAI
 * - CuttingEdgeAI
 * - NeuralAI
 * 
 * Features:
 * - Core game mechanics
 * - Turn-based gameplay
 * - Card interactions
 * - AI opponents with multiple difficulty levels
 * - Game state management
 * - Event handling
 * 
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { ELEMENT_SYMBOLS } from './elementalSystem';
import { KEYWORD_SYMBOLS, getKeywordDisplayInfo } from './keywordSystem';
import { cardActions } from './cardActions';
import { elementalAbilities } from './elementalAbilities';
import { gamePhases } from './gamePhases';

// Types
export type GamePhase = 'draw' | 'main' | 'combat' | 'end' | 'response';
export type GameZone = 'deck' | 'hand' | 'field' | 'combat' | 'discard' | 'removed' | 'life' | 'azoth';
export type CardType = 'Familiar' | 'Spell' | 'Flag' | 'Azoth';
export type Element = 'fire' | 'water' | 'earth' | 'air' | 'light' | 'dark' | 'generic';
export type Keyword = 'haste' | 'shield' | 'flying' | 'stealth' | 'regenerate' | 'drain' | 'first_strike' | 'trample';
export type AIPersonality = 'aggressive' | 'defensive' | 'balanced' | 'control' | 'combo' | 'random';
export type AIDifficulty = 'easy' | 'medium' | 'hard' | 'expert' | 'master';

export interface CardAbility {
  effect: string;
  keywords?: Keyword[];
  cost?: Record<Element, number>;
  trigger?: string;
  target?: string;
}

export interface CardModifier {
  strength?: number;
  health?: number;
  abilities?: any[];
  keywords?: Keyword[];
  untilEndOfTurn?: boolean;
}

export interface Card {
  id: string;
  name: string;
  type: CardType;
  subtype?: string;
  elements: Record<Element, number>;
  abilities?: CardAbility[];
  keywords?: Keyword[];
  strength?: number;
  health?: number;
  value?: number;
  rarity?: string;
  set?: string;
  artist?: string;
  flavor?: string;
  image?: string;
  
  // Runtime properties
  rested?: boolean;
  counters?: number;
  damage?: number;
  modifiers?: CardModifier;
  
  // Status effects
  stunned?: boolean;
  poisoned?: boolean;
  shielded?: boolean;
  buffed?: boolean;
}

export interface Player {
  id: string;
  name: string;
  deck: Card[];
  hand: Card[];
  field: Card[];
  combat: Card[];
  discard: Card[];
  removed: Card[];
  life: Card[];
  azoth: Card[];
  
  // Resources
  elements: Record<Element, number>;
  lifePoints: number;
  
  // State
  isActive: boolean;
  hasPlayedAzoth: boolean;
  maxCardsInHand: number;
  
  // AI properties
  isAI?: boolean;
  aiPersonality?: AIPersonality;
  aiDifficulty?: AIDifficulty;
}

export interface GameOptions {
  startingHandSize: number;
  startingLifePoints: number;
  maxTurns?: number;
  timeLimit?: number;
  allowMulligan: boolean;
  useElementalSystem: boolean;
}

export interface GameState {
  players: Player[];
  activePlayerIndex: number;
  phase: GamePhase;
  turn: number;
  stack: any[];
  log: string[];
  winner?: string;
  gameOver: boolean;
  
  // Additional state
  pendingActions: any[];
  waitingForResponse: boolean;
  responseTimeout?: number;
  lastAction?: any;
  
  // Options
  options: GameOptions;
}

export interface GameAction {
  type: string;
  playerId: string;
  targetId?: string;
  cardId?: string;
  zoneFrom?: GameZone;
  zoneTo?: GameZone;
  value?: any;
}

export interface GameEvent {
  type: string;
  data: any;
  timestamp: number;
}

export interface AIDecision {
  action: GameAction;
  priority: number;
  reasoning: string;
}

// Mock class for compilation
class AIDecisionEngine {
  // Mock implementation
}

// Unified Game Engine class
export class UnifiedGameEngine {
  private state: GameState;
  private events: GameEvent[];
  private listeners: Record<string, Function[]>;
  private aiEngine: AIDecisionEngine;
  
  constructor(options: Partial<GameOptions> = {}) {
    // Initialize game state
    this.state = {
      players: [],
      activePlayerIndex: 0,
      phase: 'draw',
      turn: 1,
      stack: [],
      log: [],
      gameOver: false,
      pendingActions: [],
      waitingForResponse: false,
      
      // Default options
      options: {
        startingHandSize: 5,
        startingLifePoints: 20,
        allowMulligan: true,
        useElementalSystem: true,
        ...options
      }
    };
    
    // Initialize events and listeners
    this.events = [];
    this.listeners = {};
    
    // Initialize AI engine
    this.aiEngine = new AIDecisionEngine();
  }
  
  // Game setup methods
  
  /**
   * Initialize a new game with the provided players
   */
  public initGame(players: Omit<Player, 'isActive' | 'hasPlayedAzoth' | 'maxCardsInHand'>[]): void {
    // Reset game state
    this.state.players = players.map(player => ({
      ...player,
      isActive: false,
      hasPlayedAzoth: false,
      maxCardsInHand: 7,
      
      // Initialize empty zones if not provided
      hand: player.hand || [],
      field: player.field || [],
      combat: player.combat || [],
      discard: player.discard || [],
      removed: player.removed || [],
      life: player.life || [],
      azoth: player.azoth || [],
      
      // Initialize resources
      elements: player.elements || {
        fire: 0,
        water: 0,
        earth: 0,
        air: 0,
        light: 0,
        dark: 0,
        generic: 0
      },
      lifePoints: player.lifePoints || this.state.options.startingLifePoints
    }));
    
    this.state.activePlayerIndex = 0;
    this.state.phase = 'draw';
    this.state.turn = 1;
    this.state.stack = [];
    this.state.log = [];
    this.state.gameOver = false;
    this.state.winner = undefined;
    
    // Shuffle decks
    this.state.players.forEach(player => {
      this.shuffleDeck(player.id);
    });
    
    // Draw starting hands
    this.state.players.forEach(player => {
      this.drawCards(player.id, this.state.options.startingHandSize);
    });
    
    // Set active player
    this.state.players[this.state.activePlayerIndex].isActive = true;
    
    // Log game start
    this.logGameEvent(`Game started with ${this.state.players.length} players`);
    
    // Emit game start event
    this.emitEvent('gameStart', { players: this.state.players });
  }
  
  /**
   * Shuffle a player's deck
   */
  public shuffleDeck(playerId: string): void {
    const player = this.getPlayerById(playerId);
    if (!player) return;
    
    // Fisher-Yates shuffle algorithm
    for (let i = player.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [player.deck[i], player.deck[j]] = [player.deck[j], player.deck[i]];
    }
    
    this.logGameEvent(`${player.name}'s deck was shuffled`);
  }
  
  /**
   * Draw cards for a player
   */
  public drawCards(playerId: string, count: number): Card[] {
    const player = this.getPlayerById(playerId);
    if (!player) return [];
    
    const drawnCards: Card[] = [];
    
    for (let i = 0; i < count; i++) {
      if (player.deck.length === 0) {
        // Handle deck out
        this.handleDeckOut(playerId);
        break;
      }
      
      const card = player.deck.shift();
      if (card) {
        player.hand.push(card);
        drawnCards.push(card);
        
        // Emit card draw event
        this.emitEvent('cardDraw', { playerId, card });
      }
    }
    
    if (drawnCards.length > 0) {
      this.logGameEvent(`${player.name} drew ${drawnCards.length} card${drawnCards.length > 1 ? 's' : ''}`);
    }
    
    return drawnCards;
  }
  
  /**
   * Handle a player running out of cards
   */
  private handleDeckOut(playerId: string): void {
    const player = this.getPlayerById(playerId);
    if (!player) return;
    
    // In some game rules, running out of cards might cause the player to lose
    // For now, we'll just log it
    this.logGameEvent(`${player.name} has run out of cards!`);
    
    // Emit deck out event
    this.emitEvent('deckOut', { playerId });
  }
  
  // Game flow methods
  
  /**
   * Start the next phase of the game
   */
  public nextPhase(): void {
    const currentPhase = this.state.phase;
    const activePlayer = this.getActivePlayer();
    if (!activePlayer) return;
    
    // Handle phase-specific actions
    switch (currentPhase) {
      case 'draw':
        // Move to main phase
        this.state.phase = 'main';
        break;
        
      case 'main':
        // Move to combat phase
        this.state.phase = 'combat';
        
        // Rest all creatures that attacked this turn
        activePlayer.combat.forEach(card => {
          card.rested = true;
        });
        break;
        
      case 'combat':
        // Move to end phase
        this.state.phase = 'end';
        
        // Move creatures from combat zone back to field
        while (activePlayer.combat.length > 0) {
          const card = activePlayer.combat.pop();
          if (card) {
            activePlayer.field.push(card);
          }
        }
        break;
        
      case 'end':
        // End turn and start next player's turn
        this.endTurn();
        return;
        
      case 'response':
        // Return to the previous phase
        // This would be more complex in a real implementation
        this.state.phase = 'main';
        this.state.waitingForResponse = false;
        break;
    }
    
    this.logGameEvent(`Phase changed from ${currentPhase} to ${this.state.phase}`);
    
    // Emit phase change event
    this.emitEvent('phaseChange', {
      playerId: activePlayer.id, 
      from: currentPhase, 
      to: this.state.phase 
    });
  }
  
  /**
   * End the current turn and start the next player's turn
   */
  public endTurn(): void {
    const activePlayer = this.getActivePlayer();
    if (!activePlayer) return;
    
    // Handle end of turn effects
    this.handleEndOfTurnEffects(activePlayer.id);
    
    // Reset player's state for the turn
    activePlayer.isActive = false;
    activePlayer.hasPlayedAzoth = false;
    
    // Remove "until end of turn" modifiers
    this.removeEndOfTurnModifiers(activePlayer.id);
    
    // Move to the next player
    this.state.activePlayerIndex = (this.state.activePlayerIndex + 1) % this.state.players.length;
    
    // Set the new active player
    const newActivePlayer = this.getActivePlayer();
    if (!newActivePlayer) return;
    
    newActivePlayer.isActive = true;
    
    // Increment turn counter if we've gone through all players
    if (this.state.activePlayerIndex === 0) {
      this.state.turn++;
      
      // Check for turn limit
      if (this.state.options.maxTurns && this.state.turn > this.state.options.maxTurns) {
        this.endGame('draw', 'Turn limit reached');
        return;
      }
    }
    
    // Start new turn
    this.startTurn();
    
    this.logGameEvent(`Turn ended for ${activePlayer.name}, now it's ${newActivePlayer.name}'s turn`);
    
    // Emit turn change event
    this.emitEvent('turnChange', {
      from: activePlayer.id, 
      to: newActivePlayer.id, 
      turn: this.state.turn 
    });
  }
  
  /**
   * Start a new turn for the active player
   */
  private startTurn(): void {
    const activePlayer = this.getActivePlayer();
    if (!activePlayer) return;
    
    // Unrest all cards
    this.unrestCards(activePlayer.id);
    
    // Handle start of turn effects
    this.handleStartOfTurnEffects(activePlayer.id);
    
    // Set phase to draw
    this.state.phase = 'draw';
    
    // Draw a card
    this.drawCards(activePlayer.id, 1);
    
    // Emit turn start event
    this.emitEvent('turnStart', { playerId: activePlayer.id, turn: this.state.turn });
    
    // If the active player is AI, trigger AI turn
    if (activePlayer.isAI) {
      this.handleAITurn(activePlayer.id);
    }
  }
  
  /**
   * Unrest all cards for a player
   */
  private unrestCards(playerId: string): void {
    const player = this.getPlayerById(playerId);
    if (!player) return;
    
    // Unrest cards in all zones
    player.field.forEach(card => {
      card.rested = false;
    });
    
    player.azoth.forEach(card => {
      card.rested = false;
    });
  }
  
  /**
   * Handle start of turn effects
   */
  private handleStartOfTurnEffects(playerId: string): void {
    const player = this.getPlayerById(playerId);
    if (!player) return;
    
    // Process start of turn triggers
    // This would be more complex in a real implementation
    
    // For now, just log it
    this.logGameEvent(`Processing start of turn effects for ${player.name}`);
  }
  
  /**
   * Handle end of turn effects
   */
  private handleEndOfTurnEffects(playerId: string): void {
    const player = this.getPlayerById(playerId);
    if (!player) return;
    
    // Process end of turn triggers
    // This would be more complex in a real implementation
    
    // For now, just log it
    this.logGameEvent(`Processing end of turn effects for ${player.name}`);
  }
  
  /**
   * Remove "until end of turn" modifiers
   */
  private removeEndOfTurnModifiers(playerId: string): void {
    const player = this.getPlayerById(playerId);
    if (!player) return;
    
    // Remove modifiers from all cards
    const removeFromZone = (zone: Card[]) => {
      zone.forEach(card => {
        if (card.modifiers && card.modifiers.untilEndOfTurn) {
          // Reset modifiers
          if (card.modifiers.strength) {
            card.modifiers.strength = 0;
          }
          
          if (card.modifiers.health) {
            card.modifiers.health = 0;
          }
          
          if (card.modifiers.keywords) {
            card.modifiers.keywords = [];
          }
          
          if (card.modifiers.abilities) {
            card.modifiers.abilities = [];
          }
          
          card.modifiers.untilEndOfTurn = false;
        }
      });
    };
    
    removeFromZone(player.field);
    removeFromZone(player.combat);
    removeFromZone(player.hand);
  }
  
  // Card action methods
  
  /**
   * Play a card from hand
   */
  public playCard(playerId: string, cardId: string, targets: string[] = []): boolean {
    const player = this.getPlayerById(playerId);
    if (!player) return false;
    
    // Check if it's the player's turn and main phase
    if (!player.isActive || this.state.phase !== 'main') {
      this.logGameEvent(`Cannot play card: not ${player.name}'s turn or not in main phase`);
      return false;
    }
    
    // Find the card in hand
    const cardIndex = player.hand.findIndex(card => card.id === cardId);
    
    if (cardIndex === -1) {
      this.logGameEvent(`Card not found in ${player.name}'s hand`);
      return false;
    }
    
    const card = player.hand[cardIndex];
    
    // Check if the player can pay the cost
    if (!this.canPayCost(playerId, card)) {
      this.logGameEvent(`${player.name} cannot pay the cost for ${card.name}`);
      return false;
    }
    
    // Pay the cost
    this.payCost(playerId, card);
    
    // Remove the card from hand
    player.hand.splice(cardIndex, 1);
    
    // Handle card by type
    switch (card.type) {
      case 'Familiar':
        // Put the familiar into play
        player.field.push(card);
        
        // Familiar is rested when it enters play (unless it has haste)
        card.rested = !this.hasKeyword(card, 'haste');
        
        this.logGameEvent(`${player.name} played ${card.name} (Familiar)`);
        break;
        
      case 'Spell':
        // Resolve spell effect
        this.resolveSpellEffect(playerId, card, targets);
        
        // Put the spell into the discard pile
        player.discard.push(card);
        
        this.logGameEvent(`${player.name} cast ${card.name} (Spell)`);
        break;
        
      case 'Flag':
        // Put the flag into play
        player.field.push(card);
        
        this.logGameEvent(`${player.name} played ${card.name} (Flag)`);
        break;
        
      case 'Azoth':
        // Check if player has already played an Azoth this turn
        if (player.hasPlayedAzoth) {
          this.logGameEvent(`${player.name} has already played an Azoth this turn`);
          
          // Put the card back in hand
          player.hand.push(card);
          return false;
        }
        
        // Put the Azoth into play
        player.azoth.push(card);
        
        // Mark that player has played an Azoth this turn
        player.hasPlayedAzoth = true;
        
        this.logGameEvent(`${player.name} played ${card.name} (Azoth)`);
        break;
    }
    
    // Emit card played event
    this.emitEvent('cardPlayed', { playerId, card, targets });
    
    return true;
  }
  
  /**
   * Helper methods
   */
  
  private getPlayerById(playerId: string): Player | undefined {
    return this.state.players.find(player => player.id === playerId);
  }
  
  private getActivePlayer(): Player | undefined {
    return this.state.players[this.state.activePlayerIndex];
  }
  
  private canPayCost(playerId: string, card: Card): boolean {
    // Mock implementation
    return true;
  }
  
  private payCost(playerId: string, card: Card): void {
    // Mock implementation
  }
  
  private hasKeyword(card: Card, keyword: Keyword): boolean {
    return card.keywords?.includes(keyword) || false;
  }
  
  private resolveSpellEffect(playerId: string, card: Card, targets: string[]): void {
    // Mock implementation
  }
  
  private handleAITurn(playerId: string): void {
    // Mock implementation
  }
  
  private endGame(winner?: string, reason?: string): void {
    this.state.gameOver = true;
    this.state.winner = winner;
    
    this.logGameEvent(`Game over! ${winner ? `Winner: ${winner}` : 'Draw'} - ${reason || ''}`);
    
    this.emitEvent('gameEnd', { winner, reason });
  }
  
  private logGameEvent(message: string): void {
    this.state.log.push(message);
    console.log(`[Game] ${message}`);
  }
  
  private emitEvent(type: string, data: any): void {
    const event: GameEvent = {
      type,
      data,
      timestamp: Date.now()
    };
    
    this.events.push(event);
    
    // Notify listeners
    if (this.listeners[type]) {
      this.listeners[type].forEach(listener => listener(event));
    }
  }
  
  // Event handling
  
  public on(eventType: string, callback: Function): void {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }
    
    this.listeners[eventType].push(callback);
  }
  
  public off(eventType: string, callback: Function): void {
    if (!this.listeners[eventType]) return;
    
    this.listeners[eventType] = this.listeners[eventType].filter(
      listener => listener !== callback
    );
  }
  
  // Game state access
  
  public getGameState(): GameState {
    return { ...this.state };
  }
  
  public getPlayerState(playerId: string): Player | undefined {
    const player = this.getPlayerById(playerId);
    return player ? { ...player } : undefined;
  }
}