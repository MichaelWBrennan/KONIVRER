/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

/**
 * KONIVRER Advanced Rules Engine
 *
 * A comprehensive rules engine that automatically handles:
 * - Card interactions and effects
 * - Game state validation
 * - Turn structure and phases
 * - Triggered abilities
 * - State-based actions
 * - Priority and the stack
 *
 * This engine is designed to be KONIVRER Arena-like in its automation and precision.
 */

import { getCardRules } from './CardRules';
import { getKeywordRules } from './KeywordRules';
import { getTriggerConditions } from './TriggerConditions';

// Rule types
enum RULE_TYPES {
  STATIC = 'static', // Always-on effects
  TRIGGERED = 'triggered', // Triggered abilities
  ACTIVATED = 'activated', // Activated abilities
  REPLACEMENT = 'replacement', // Replacement effects
  STATE_BASED = 'state-based', // State-based actions
  TURN_STRUCTURE = 'turn-structure', // Turn structure rules
  COST = 'cost', // Cost calculation rules
  TARGETING = 'targeting', // Targeting rules
  RESOLUTION = 'resolution', // Resolution rules
}

// Game zones
enum ZONES {
  HAND = 'hand',
  FIELD = 'field',
  AZOTH_ROW = 'azothRow',
  GRAVEYARD = 'graveyard',
  REMOVED = 'removedZone',
  LIFE_CARDS = 'lifeCards',
  DECK = 'deck',
  STACK = 'stack',
}

// Game phases
enum PHASES {
  START = 'start',
  MAIN = 'main',
  COMBAT = 'combat',
  POST_COMBAT = 'postCombat',
  END = 'end',
}

// Card types
enum CARD_TYPES {
  FAMILIAR = 'familiar',
  SPELL = 'spell',
  AZOTH = 'azoth',
  BURST = 'burst',
  FLAG = 'flag',
}

// Elements
enum ELEMENTS {
  FIRE = 'fire',
  WATER = 'water',
  EARTH = 'earth',
  AIR = 'air',
  LIGHT = 'light',
  DARK = 'dark',
  VOID = 'void',
}

// Interface definitions
interface Card {
  id: string;
  name: string;
  type: string;
  elements: string[];
  cost: number;
  power?: number;
  health?: number;
  effects?: CardEffect[];
  keywords?: string[];
  text?: string;
  flavor?: string;
  rarity?: string;
  set?: string;
  artist?: string;
  imageUrl?: string;
  [key: string]: any;
}

interface CardEffect {
  type: string;
  trigger?: string;
  target?: string;
  value?: any;
  condition?: string;
  cost?: any;
  [key: string]: any;
}

interface Player {
  id: string;
  name: string;
  deck: Card[];
  hand: Card[];
  field: Card[];
  azothRow: Card[];
  lifeCards: Card[];
  graveyard: Card[];
  removedZone: Card[];
  azothAvailable: number;
  azothUsedThisTurn: number;
  flagCard?: Card;
  [key: string]: any;
}

interface GameState {
  players: Player[];
  activePlayer: number;
  turn: number;
  phase: string;
  stack: StackItem[];
  attackers: Card[];
  blockers: Record<string, Card>;
  winner: number | null;
  gameOver: boolean;
  turnHistory: TurnAction[];
  [key: string]: any;
}

interface StackItem {
  source: Card;
  effect: CardEffect;
  controller: number;
  targets: string[];
  timestamp: number;
}

interface TurnAction {
  type: string;
  player: number;
  data: any;
  timestamp: number;
}

interface Rule {
  id: string;
  type: RULE_TYPES;
  condition: (state: GameState, context?: any) => boolean;
  apply: (state: GameState, context?: any) => GameState;
  priority: number;
  description: string;
}

interface RuleSet {
  [key: string]: Rule;
}

interface TriggerCondition {
  id: string;
  check: (state: GameState, prevState: GameState, context?: any) => boolean;
  description: string;
}

interface KeywordRule {
  keyword: string;
  description: string;
  rules: Rule[];
}

interface RuleCheckResult {
  valid: boolean;
  message?: string;
  details?: any;
}

class RulesEngine {
  private rules: RuleSet;
  private cardRules: Record<string, Rule[]>;
  private keywordRules: KeywordRule[];
  private triggerConditions: Record<string, TriggerCondition>;
  private gameState: GameState | null;
  private previousState: GameState | null;
  private stateHistory: GameState[];
  private maxHistoryLength: number;
  private eventListeners: Record<string, Function[]>;

  constructor() {
    this.rules = {};
    this.cardRules = {};
    this.keywordRules = [];
    this.triggerConditions = {};
    this.gameState = null;
    this.previousState = null;
    this.stateHistory = [];
    this.maxHistoryLength = 20;
    this.eventListeners = {};

    this.initializeRules();
  }

  /**
   * Initialize the rules engine with default rules
   */
  private initializeRules(): void {
    // Load card-specific rules
    this.cardRules = getCardRules();

    // Load keyword rules
    this.keywordRules = getKeywordRules();

    // Load trigger conditions
    this.triggerConditions = getTriggerConditions();

    // Initialize core rules
    this.initializeCoreRules();
  }

  /**
   * Initialize core game rules
   */
  private initializeCoreRules(): void {
    // State-based actions
    this.addRule({
      id: 'sba_destroy_zero_health',
      type: RULE_TYPES.STATE_BASED,
      condition: (state: GameState) => {
        return state.players.some(player => 
          player.field.some(card => (card.health !== undefined && card.health <= 0))
        );
      },
      apply: (state: GameState) => {
        state.players.forEach(player => {
          const destroyedCards = player.field.filter(card => 
            card.health !== undefined && card.health <= 0
          );
          
          destroyedCards.forEach(card => {
            // Remove from field
            player.field = player.field.filter(c => c.id !== card.id);
            // Add to graveyard
            player.graveyard.push(card);
          });
        });
        
        return state;
      },
      priority: 100,
      description: 'Destroy creatures with 0 or less health'
    });

    // Turn structure rules
    this.addRule({
      id: 'turn_draw_card',
      type: RULE_TYPES.TURN_STRUCTURE,
      condition: (state: GameState) => {
        return state.phase === PHASES.START && 
               (state.turn > 1 || state.activePlayer === 1); // First player skips first draw
      },
      apply: (state: GameState) => {
        const activePlayer = state.players[state.activePlayer];
        
        if (activePlayer.deck.length > 0) {
          const card = activePlayer.deck.pop();
          if (card) {
            activePlayer.hand.push(card);
          }
        } else {
          // Player loses if they can't draw
          state.winner = 1 - state.activePlayer;
          state.gameOver = true;
        }
        
        return state;
      },
      priority: 90,
      description: 'Draw a card at the start of turn'
    });

    // Add more core rules here...
  }

  /**
   * Add a rule to the engine
   */
  addRule(rule: Rule): void {
    this.rules[rule.id] = rule;
  }

  /**
   * Remove a rule from the engine
   */
  removeRule(ruleId: string): void {
    delete this.rules[ruleId];
  }

  /**
   * Set the current game state
   */
  setGameState(state: GameState): void {
    this.previousState = this.gameState ? { ...this.gameState } : null;
    this.gameState = { ...state };
    
    // Add to history
    this.stateHistory.push({ ...state });
    
    // Trim history if needed
    if (this.stateHistory.length > this.maxHistoryLength) {
      this.stateHistory.shift();
    }
    
    // Apply state-based actions
    this.applyStateBased();
    
    // Check for triggers
    this.checkTriggers();
  }

  /**
   * Get the current game state
   */
  getGameState(): GameState | null {
    return this.gameState;
  }

  /**
   * Apply state-based actions
   */
  private applyStateBased(): void {
    if (!this.gameState) return;
    
    let stateChanged = true;
    let iterations = 0;
    const maxIterations = 10; // Prevent infinite loops
    
    // Apply state-based actions until the state stabilizes
    while (stateChanged && iterations < maxIterations) {
      stateChanged = false;
      iterations++;
      
      // Get all state-based rules
      const stateBased = Object.values(this.rules)
        .filter(rule => rule.type === RULE_TYPES.STATE_BASED)
        .sort((a, b) => b.priority - a.priority);
      
      for (const rule of stateBased) {
        if (rule.condition(this.gameState)) {
          const newState = rule.apply({ ...this.gameState });
          
          // Check if state changed
          if (JSON.stringify(newState) !== JSON.stringify(this.gameState)) {
            this.gameState = newState;
            stateChanged = true;
          }
        }
      }
    }
  }

  /**
   * Check for triggered abilities
   */
  private checkTriggers(): void {
    if (!this.gameState || !this.previousState) return;
    
    // Get all cards in play
    const allCards: { card: Card; player: number }[] = [];
    
    this.gameState.players.forEach((player, playerIndex) => {
      player.field.forEach(card => {
        allCards.push({ card, player: playerIndex });
      });
      
      if (player.flagCard) {
        allCards.push({ card: player.flagCard, player: playerIndex });
      }
    });
    
    // Check each card for triggered abilities
    allCards.forEach(({ card, player }) => {
      if (!card.effects) return;
      
      const triggeredEffects = card.effects.filter(effect => 
        effect.type === RULE_TYPES.TRIGGERED && effect.trigger
      );
      
      // Check each triggered effect
      triggeredEffects.forEach(effect => {
        if (!effect.trigger || !this.triggerConditions[effect.trigger]) return;
        
        // Check if trigger condition is met
        const triggerCondition = this.triggerConditions[effect.trigger];
        if (triggerCondition.check(this.gameState!, this.previousState, { card, player })) {
          // Add to stack
          this.addToStack(card, effect, player);
        }
      });
    });
  }

  /**
   * Add an effect to the stack
   */
  private addToStack(source: Card, effect: CardEffect, controller: number, targets: string[] = []): void {
    if (!this.gameState) return;
    
    const stackItem: StackItem = {
      source,
      effect,
      controller,
      targets,
      timestamp: Date.now()
    };
    
    this.gameState.stack.push(stackItem);
    
    // Emit event
    this.emitEvent('stackItemAdded', stackItem);
  }

  /**
   * Resolve the top item on the stack
   */
  resolveStack(): boolean {
    if (!this.gameState || this.gameState.stack.length === 0) return false;
    
    // Get the top item
    const item = this.gameState.stack.pop();
    if (!item) return false;
    
    // Apply the effect
    this.applyEffect(item.source, item.effect, item.controller, item.targets);
    
    // Emit event
    this.emitEvent('stackItemResolved', item);
    
    return true;
  }

  /**
   * Apply an effect to the game state
   */
  private applyEffect(source: Card, effect: CardEffect, controller: number, targets: string[] = []): void {
    if (!this.gameState) return;
    
    // Find the appropriate rule for this effect
    const effectType = effect.type;
    const effectRules = Object.values(this.rules)
      .filter(rule => rule.id.startsWith(`effect_${effectType}`))
      .sort((a, b) => b.priority - a.priority);
    
    if (effectRules.length === 0) return;
    
    // Apply the effect rule
    const context = { source, effect, controller, targets };
    for (const rule of effectRules) {
      if (rule.condition(this.gameState, context)) {
        this.gameState = rule.apply({ ...this.gameState }, context);
        break;
      }
    }
    
    // Apply state-based actions after effect resolution
    this.applyStateBased();
  }

  /**
   * Validate a game action
   */
  validateAction(action: string, params: any): RuleCheckResult {
    if (!this.gameState) {
      return { valid: false, message: 'No active game state' };
    }
    
    // Find the appropriate validation rule
    const validationRules = Object.values(this.rules)
      .filter(rule => rule.id.startsWith(`validate_${action}`))
      .sort((a, b) => b.priority - a.priority);
    
    if (validationRules.length === 0) {
      return { valid: false, message: `No validation rule found for action: ${action}` };
    }
    
    // Check each validation rule
    for (const rule of validationRules) {
      if (rule.condition(this.gameState, params)) {
        return { valid: true };
      }
    }
    
    // If we get here, no validation rule passed
    return { 
      valid: false, 
      message: `Invalid ${action} action`,
      details: params
    };
  }

  /**
   * Execute a game action
   */
  executeAction(action: string, params: any): GameState | null {
    // Validate the action first
    const validation = this.validateAction(action, params);
    if (!validation.valid || !this.gameState) {
      this.emitEvent('actionFailed', { action, params, error: validation.message });
      return null;
    }
    
    // Find the appropriate action rule
    const actionRules = Object.values(this.rules)
      .filter(rule => rule.id.startsWith(`action_${action}`))
      .sort((a, b) => b.priority - a.priority);
    
    if (actionRules.length === 0) {
      this.emitEvent('actionFailed', { 
        action, 
        params, 
        error: `No action rule found for: ${action}` 
      });
      return null;
    }
    
    // Execute the action
    let newState = { ...this.gameState };
    for (const rule of actionRules) {
      if (rule.condition(newState, params)) {
        newState = rule.apply(newState, params);
        break;
      }
    }
    
    // Record the action in turn history
    newState.turnHistory.push({
      type: action,
      player: params.player || newState.activePlayer,
      data: params,
      timestamp: Date.now()
    });
    
    // Update the game state
    this.setGameState(newState);
    
    // Emit event
    this.emitEvent('actionExecuted', { action, params });
    
    return this.gameState;
  }

  /**
   * Advance to the next phase
   */
  nextPhase(): GameState | null {
    if (!this.gameState) return null;
    
    const currentPhase = this.gameState.phase;
    let nextPhase: string;
    
    // Determine next phase
    switch (currentPhase) {
      case PHASES.START:
        nextPhase = PHASES.MAIN;
        break;
      case PHASES.MAIN:
        nextPhase = PHASES.COMBAT;
        break;
      case PHASES.COMBAT:
        nextPhase = PHASES.POST_COMBAT;
        break;
      case PHASES.POST_COMBAT:
        nextPhase = PHASES.END;
        break;
      case PHASES.END:
        // End of turn, switch players
        const newState = { ...this.gameState };
        newState.activePlayer = 1 - newState.activePlayer;
        
        // Increment turn if we've gone through both players
        if (newState.activePlayer === 0) {
          newState.turn++;
        }
        
        nextPhase = PHASES.START;
        this.setGameState(newState);
        break;
      default:
        nextPhase = PHASES.MAIN;
    }
    
    // Apply phase change
    return this.executeAction('changePhase', { newPhase: nextPhase });
  }

  /**
   * Get all applicable rules for a card
   */
  getCardRules(cardId: string): Rule[] {
    return this.cardRules[cardId] || [];
  }

  /**
   * Get all rules for a keyword
   */
  getKeywordRules(keyword: string): Rule[] {
    const keywordRule = this.keywordRules.find(kr => kr.keyword === keyword);
    return keywordRule ? keywordRule.rules : [];
  }

  /**
   * Add event listener
   */
  on(event: string, callback: Function): void {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  /**
   * Remove event listener
   */
  off(event: string, callback: Function): void {
    if (!this.eventListeners[event]) {
      return;
    }
    this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback);
  }

  /**
   * Emit event
   */
  private emitEvent(event: string, data: any): void {
    if (!this.eventListeners[event]) {
      return;
    }
    this.eventListeners[event].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in ${event} event listener:`, error);
      }
    });
  }

  /**
   * Get game history
   */
  getGameHistory(): GameState[] {
    return [...this.stateHistory];
  }

  /**
   * Get turn history
   */
  getTurnHistory(): TurnAction[] {
    return this.gameState ? [...this.gameState.turnHistory] : [];
  }

  /**
   * Reset the rules engine
   */
  reset(): void {
    this.gameState = null;
    this.previousState = null;
    this.stateHistory = [];
    this.eventListeners = {};
  }
}

// Create singleton instance
const rulesEngine = new RulesEngine();

export default rulesEngine;