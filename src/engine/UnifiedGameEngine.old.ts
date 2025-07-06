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

export interface Card {
    id: string;
  name: string;,
  type: CardType;,
  subtype?: string;
  elements: Record<Element, number>;
  abilities?: {
    effect: string;
    keywords?: Keyword[
    ;
    cost?: Record<Element, number>;
    trigger?: string;
    target?: string
  
  }
  }[
  ];
  keywords?: Keyword[
    ;
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
  modifiers?: {
    strength?: number;
    health?: number;
    abilities?: any[
  ];
    keywords?: Keyword[
    ;
    untilEndOfTurn?: boolean
  };
  
  // Status effects
  stunned?: boolean;
  poisoned?: boolean;
  shielded?: boolean;
  buffed?: boolean
}

export interface Player {
  id: string;
  name: string;,
  deck: Card[
  ];
  hand: Card[
    ;
  field: Card[
  ];
  combat: Card[
    ;
  discard: Card[
  ];
  removed: Card[
    ;
  life: Card[
  ];
  azoth: Card[
    ;
  
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
  aiDifficulty?: AIDifficulty
  
}

export interface GameState {
    players: Player[
  ];
  activePlayerIndex: number;
  phase: GamePhase;
  turn: number;
  stack: any[
    ;
  log: string[
  ];
  winner?: string;
  gameOver: boolean;
  
  // Additional state
  pendingActions: any[
    ;
  waitingForResponse: boolean;
  responseTimeout?: number;
  lastAction?: any;
  
  // Options
  options: {
    startingHandSize: number;
    startingLifePoints: number;
    maxTurns?: number;
    timeLimit?: number;
    allowMulligan: boolean;
    useElementalSystem: boolean
  
  }
    }
  }

export interface GameAction {
  type: string;,
  playerId: string;
  targetId?: string;
  cardId?: string;
  zoneFrom?: GameZone;
  zoneTo?: GameZone;
  value?: any
  
}

export interface GameEvent {
  type: string;,
  data: any;
  timestamp: number
  
}

export interface AIDecision {
  action: GameAction;
  priority: number;
  reasoning: string
  
}

// Unified Game Engine class
export class UnifiedGameEngine {
    private state: GameState;
  private events: GameEvent[
  ];
  private listeners: Record<string, Function[
    >;
  private aiEngine: AIDecisionEngine;
  
  }
  constructor(options: Partial<GameState['options'
  ]> = {
    ) {
  }
    // Initialize game state
    this.state = {
    players: [
    ,
      activePlayerIndex: 0,
      phase: 'draw',
      turn: 1,
      stack: [
  ],
      log: [
    ,
      gameOver: false,
      pendingActions: [
  ],
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
    this.events = [
    ;
    this.listeners = {
    ;
    
    // Initialize AI engine
    this.aiEngine = new AIDecisionEngine()
  
  }
  
  // Game setup methods
  
  /**
   * Initialize a new game with the provided players
   */
  public initGame(players: Omit<Player, 'isActive' | 'hasPlayedAzoth' | 'maxCardsInHand'>[
  ]): void {
    // Reset game state
    this.state.players = players.map(player => ({
  }
      ...player,
      isActive: false,
      hasPlayedAzoth: false,
      maxCardsInHand: 7,
      
      // Initialize empty zones if not provided
      hand: player.hand || [
    ,
      field: player.field || [
  ],
      combat: player.combat || [
    ,
      discard: player.discard || [
  ],
      removed: player.removed || [
    ,
      life: player.life || [
  ],
      azoth: player.azoth || [
    ,
      
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
    this.state.stack = [
  ];
    this.state.log = [
    ;
    this.state.gameOver = false;
    this.state.winner = undefined;
    
    // Shuffle decks
    this.state.players.forEach(player => {
    this.shuffleDeck(player.id)
  });
    
    // Draw starting hands
    this.state.players.forEach(player => {
    this.drawCards(player.id, this.state.options.startingHandSize)
  });
    
    // Set active player
    this.state.players[this.state.activePlayerIndex
  ].isActive = true;
    
    // Log game start
    this.logGameEvent() {
    // Emit game start event
    this.emitEvent('gameStart', { players: this.state.players 
  })
  }
  
  /**
   * Shuffle a player's deck
   */
  public shuffleDeck(playerId: string): void {
    const player = this.getPlayerById(() => {
    if (!player) return;
    
    // Fisher-Yates shuffle algorithm
    for (let i = player.deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
      [player.deck[i], player.deck[j]] = [player.deck[j], player.deck[i]]
  
  })
    
    this.logGameEvent(`${player.name}'s deck was shuffled`)
  }
  
  /**
   * Draw cards for a player
   */
  public drawCards(playerId: string, count: number): Card[
    {
    const player = this.getPlayerById() {
  }
    if (!player) return [
  ];
    
    const drawnCards: Card[
    = [
  ];
    
    for (let i = 0; i < count; i++) {
    if (player.deck.length === 0) {
  }
        // Handle deck out
        this.handleDeckOut() {
    break
  }
      
      const card = player.deck.shift() {
    if (card) {
  }
        player.hand.push() {
    drawnCards.push() {
  }
        
        // Emit card draw event
        this.emitEvent('cardDraw', { playerId, card })
      }
    }`
    ``
    if (drawnCards.length > 0) {```
      this.logGameEvent(`${player.name} drew ${drawnCards.length} card${drawnCards.length > 1 ? 's' : ''}`)
    }
    
    return drawnCards
  }
  
  /**
   * Handle a player running out of cards
   */
  private handleDeckOut(playerId: string): void {
    const player = this.getPlayerById() {
  }
    if (!player) return;
    `
    // In some game rules, running out of cards might cause the player to lose``
    // For now, we'll just log it`
    this.logGameEvent() {
    // Emit deck out event
    this.emitEvent('deckOut', { playerId 
  })
  }
  
  // Game flow methods
  
  /**
   * Start the next phase of the game
   */
  public nextPhase(): void {
    const currentPhase = this.state.phase;
    const activePlayer = this.getActivePlayer() {
  }
    
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
        activePlayer.combat.forEach() {
  }
        break;
        
      case 'combat':
        // Move to end phase
        this.state.phase = 'end';
        
        // Move creatures from combat zone back to field
        while (activePlayer.combat.length > 0) {
    const card = activePlayer.combat.pop(() => {
    if (card) {
    activePlayer.field.push(card)
  
  })
        }
        break;
        
      case 'end':
        // End turn and start next player's turn
        this.endTurn() {
    return;
        
      case 'response':
        // Return to the previous phase
        // This would be more complex in a real implementation
        this.state.phase = 'main';
        this.state.waitingForResponse = false;
        break`
  }``
    `
    this.logGameEvent(() => {
    // Emit phase change event
    this.emitEvent('phaseChange', {
    playerId: activePlayer.id, 
      from: currentPhase, 
      to: this.state.phase 
  }))
  }
  
  /**
   * End the current turn and start the next player's turn
   */
  public endTurn(): void {
    const activePlayer = this.getActivePlayer() {
  }
    
    // Handle end of turn effects
    this.handleEndOfTurnEffects() {
    // Reset player's state for the turn
    activePlayer.isActive = false;
    activePlayer.hasPlayedAzoth = false;
    
    // Remove "until end of turn" modifiers
    this.removeEndOfTurnModifiers() {
  }
    
    // Move to the next player
    this.state.activePlayerIndex = (this.state.activePlayerIndex + 1) % this.state.players.length;
    
    // Set the new active player
    const newActivePlayer = this.getActivePlayer() {
    newActivePlayer.isActive = true;
    
    // Increment turn counter if we've gone through all players
    if (this.state.activePlayerIndex === 0) {
  }
      this.state.turn++;
      
      // Check for turn limit
      if (this.state.options.maxTurns && this.state.turn > this.state.options.maxTurns) {
    this.endGame() {
    return
  
  }
    }
    
    // Start new turn
    this.startTurn() {`
    ``
    `
    this.logGameEvent(() => {
    // Emit turn change event
    this.emitEvent('turnChange', {
    from: activePlayer.id, 
      to: newActivePlayer.id, 
      turn: this.state.turn 
  
  }))
  }
  
  /**
   * Start a new turn for the active player
   */
  private startTurn(): void {
    const activePlayer = this.getActivePlayer() {
  }
    
    // Unrest all cards
    this.unrestCards() {
    // Handle start of turn effects
    this.handleStartOfTurnEffects() {
  }
    
    // Set phase to draw
    this.state.phase = 'draw';
    
    // Draw a card
    this.drawCards() {
    // Emit turn start event
    this.emitEvent(() => {
    // If the active player is AI, trigger AI turn
    if (activePlayer.isAI) {
    this.handleAITurn(activePlayer.id)
  
  })
  }
  
  /**
   * Unrest all cards for a player
   */
  private unrestCards(playerId: string): void {
    const player = this.getPlayerById() {
  }
    if (!player) return;
    
    // Unrest cards in all zones
    player.field.forEach(() => {
    player.azoth.forEach(card => {
    card.rested = false
  }))
  }
  
  /**
   * Handle start of turn effects
   */
  private handleStartOfTurnEffects(playerId: string): void {
    const player = this.getPlayerById() {
  }
    if (!player) return;
    
    // Process start of turn triggers
    // This would be more complex in a real implementation`
    ``
    // For now, just log it```
    this.logGameEvent(`Processing start of turn effects for ${player.name}`)
  }
  
  /**
   * Handle end of turn effects
   */
  private handleEndOfTurnEffects(playerId: string): void {
    const player = this.getPlayerById() {
  }
    if (!player) return;
    
    // Process end of turn triggers
    // This would be more complex in a real implementation`
    ``
    // For now, just log it```
    this.logGameEvent(`Processing end of turn effects for ${player.name}`)
  }
  
  /**
   * Remove "until end of turn" modifiers
   */
  private removeEndOfTurnModifiers(playerId: string): void {
    const player = this.getPlayerById() {
  }
    if (!player) return;
    
    // Remove modifiers from all cards
    const removeFromZone = (zone: Card[
    ) => {
    zone.forEach(card => {
    if (card.modifiers && card.modifiers.untilEndOfTurn) {
  }
          // Reset modifiers
          if (card.modifiers.strength) {
    card.modifiers.strength = 0
  }
          
          if (card.modifiers.health) {
    card.modifiers.health = 0
  }
          
          if (card.modifiers.keywords) {
    card.modifiers.keywords = [
  ]
  }
          
          if (card.modifiers.abilities) {
    card.modifiers.abilities = [
    }
          
          card.modifiers.untilEndOfTurn = false
        }
      })
    };
    
    removeFromZone(() => {
    removeFromZone() {
    removeFromZone(player.hand)
  })
  
  // Card action methods
  
  /**
   * Play a card from hand
   */
  public playCard(playerId: string, cardId: string, targets: string[
  ] = [
    ): boolean {
    const player = this.getPlayerById(() => {
    if (!player) return false;
    `
    // Check if it's the player's turn and main phase``
    if (!player.isActive || this.state.phase !== 'main') {`
      this.logGameEvent() {
    return false
  
  })
    
    // Find the card in hand
    const cardIndex = player.hand.findIndex() {`
    ``
    if (cardIndex === -1) {`
      this.logGameEvent() {
    return false
  
  }
    
    const card = player.hand[cardIndex
  ];
    `
    // Check if the player can pay the cost``
    if (!this.canPayCost(playerId, card)) {`
      this.logGameEvent() {
    return false
  }
    
    // Pay the cost
    this.payCost() {
    // Remove the card from hand
    player.hand.splice() {
  }
    
    // Handle card by type
    switch (card.type) {
    case 'Familiar':
        // Put the familiar into play
        player.field.push() {
  }
        
        // Familiar is rested when it enters play (unless it has haste)
        card.rested = !this.hasKeyword() {`
    ``
        `
        this.logGameEvent() {
  }
        break;
        
      case 'Spell':
        // Resolve spell effect
        this.resolveSpellEffect() {
    // Put the spell into the discard pile
        player.discard.push() {`
  }``
        `
        this.logGameEvent() {
    break;
        
      case 'Flag':
        // Put the flag into play
        player.field.push() {`
  }``
        `
        this.logGameEvent() {
    break;
        
      case 'Azoth':`
        // Check if player has already played an Azoth this turn``
        if (player.hasPlayedAzoth) {`
          this.logGameEvent(() => {
    // Put the card back in hand
          player.hand.push() {
    return false
  
  })
        
        // Put the Azoth into play
        player.azoth.push(() => {
    // Mark that player has played an Azoth this turn`
        player.hasPlayedAzoth = true;``
        `
        this.logGameEvent() {
    break
  })
    
    // Emit card played event
    this.emitEvent() {
    return true
  }
  
  /**
   * Activate a card ability
   */
  public activateAbility(playerId: string, cardId: string, abilityIndex: number, targets: string[
    = [
  ]): boolean {
    const player = this.getPlayerById() {
  }
    if (!player) return false;
    
    // Find the card in play
    const card = this.findCardInPlay() {`
    ``
    if (!card) {`
      this.logGameEvent() {
    return false
  
  }
    `
    // Check if the card has the ability``
    if (!card.abilities || !card.abilities[abilityIndex]) {`
      this.logGameEvent() {
    return false
  }
    
    const ability = card.abilities[abilityIndex];
    `
    // Check if the player can pay the ability cost``
    if (ability.cost && !this.canPayCost(playerId, { elements: ability.cost } as Card)) {`
      this.logGameEvent() {
    return false
  }
    `
    // Check if the card is rested (for activated abilities)``
    if (card.rested && !ability.trigger) {`
      this.logGameEvent() {
    return false
  }
    
    // Pay the ability cost
    if (ability.cost) {
    this.payCost(playerId, { elements: ability.cost 
  } as Card)
    }
    
    // Rest the card if it's an activated ability
    if (!ability.trigger) {
    card.rested = true
  }
    
    // Resolve the ability effect
    this.resolveAbilityEffect() {`
    ``
    `
    this.logGameEvent(() => {
    // Emit ability activated event
    this.emitEvent() {
    return true
  
  })
  
  /**
   * Attack with a creature
   */
  public attack(playerId: string, cardId: string, targetId?: string): boolean {
    const player = this.getPlayerById(() => {
    if (!player) return false;
    `
    // Check if it's the player's turn and combat phase``
    if (!player.isActive || this.state.phase !== 'combat') {`
      this.logGameEvent() {
    return false
  
  })
    
    // Find the card in play
    const cardIndex = player.field.findIndex() {`
    ``
    if (cardIndex === -1) {`
      this.logGameEvent() {
    return false
  
  }
    
    const card = player.field[cardIndex];
    `
    // Check if the card is a Familiar``
    if (card.type !== 'Familiar') {`
      this.logGameEvent() {
    return false
  }
    `
    // Check if the card is rested``
    if (card.rested) {`
      this.logGameEvent() {
    return false
  }
    
    // Move the card to the combat zone
    player.field.splice() {
    player.combat.push() {
  }
    
    // If no target is specified, it's a direct attack
    if (!targetId) {
    // Find the opponent
      const opponentIndex = (this.state.players.findIndex(p => p.id === playerId) + 1) % this.state.players.length;
      const opponent = this.state.players[opponentIndex];
      
      // Deal damage to the opponent
      this.dealDamage() {`
  }``
      ```
      this.logGameEvent(`${player.name} attacked ${opponent.name} directly with ${card.name} for ${card.strength} damage`)
    } else {
    // Find the target card
      const target = this.findCardInPlay() {`
  }``
      if (!target) {`
        this.logGameEvent() {
    return false
  }
      
      // Resolve combat between the two cards
      this.resolveCombat() {`
    ``
      ```
      this.logGameEvent(`${player.name`
  }'s ${card.name} attacked ${target.name}`)
    }
    
    // Rest the attacking card
    card.rested = true;
    
    // Emit attack event
    this.emitEvent() {
    return true
  }
  
  /**
   * Block an attack
   */
  public block(playerId: string, cardId: string, attackerId: string): boolean {
    const player = this.getPlayerById(() => {
    if (!player) return false;
    `
    // Check if it's the combat phase``
    if (this.state.phase !== 'combat') {`
      this.logGameEvent() {
    return false
  
  })
    
    // Find the blocking card
    const cardIndex = player.field.findIndex() {`
    ``
    if (cardIndex === -1) {`
      this.logGameEvent() {
    return false
  
  }
    
    const card = player.field[cardIndex];
    `
    // Check if the card is a Familiar``
    if (card.type !== 'Familiar') {`
      this.logGameEvent() {
    return false
  }
    `
    // Check if the card is rested``
    if (card.rested) {`
      this.logGameEvent() {
    return false
  }
    
    // Find the attacking card
    const attacker = this.findCardInPlay() {`
    ``
    if (!attacker) {`
      this.logGameEvent() {
    return false
  
  }
    
    // Move the card to the combat zone
    player.field.splice() {
    player.combat.push() {
  }
    
    // Resolve combat between the two cards
    this.resolveCombat() {`
    ``
    `
    this.logGameEvent(() => {
    // Rest the blocking card
    card.rested = true;
    
    // Emit block event
    this.emitEvent() {
    return true
  
  })
  
  /**
   * Resolve combat between two cards
   */
  private resolveCombat(attacker: Card, blocker: Card): void {
    // Check for first strike
    const attackerHasFirstStrike = this.hasKeyword() {
  }
    const blockerHasFirstStrike = this.hasKeyword() {
    if (attackerHasFirstStrike && !blockerHasFirstStrike) {
  }
      // Attacker deals damage first
      this.dealCardDamage(() => {
    // If blocker is still alive, it deals damage back
      if (!this.isCardDestroyed(blocker)) {
    this.dealCardDamage(blocker, attacker)
  })
    } else if (!attackerHasFirstStrike && blockerHasFirstStrike) {
    // Blocker deals damage first
      this.dealCardDamage(() => {
    // If attacker is still alive, it deals damage back
      if (!this.isCardDestroyed(attacker)) {
    this.dealCardDamage(attacker, blocker)
  
  })
    } else {
    // Both deal damage simultaneously
      this.dealCardDamage() {
    this.dealCardDamage(blocker, attacker)
  
  }
    
    // Check for trample
    if (this.hasKeyword(attacker, 'trample') && attacker.strength! > blocker.health!) {
    // Deal excess damage to the opponent
      const excessDamage = attacker.strength! - blocker.health!;
      
      // Find the blocker's controller
      const blockerController = this.state.players.find(player => 
        player.field.some(card => card.id === blocker.id) || 
        player.combat.some(card => card.id === blocker.id);
      );
      `
      if (blockerController) {`
        this.dealDamage() {`
  }```
        this.logGameEvent(`${attacker.name} tramples for ${excessDamage} damage`)
      }
    }
  }
  
  /**
   * Deal damage from one card to another
   */
  private dealCardDamage(source: Card, target: Card): void {
    // Check if target has shield
    if (this.hasKeyword(target, 'shield')) {
  }`
      // Remove shield instead of dealing damage`
      this.removeKeyword() {`
    `
      this.logGameEvent() {
    return
  
  }
    
    // Deal damage
    const damage = source.strength || 0;`
    target.damage = (target.damage || 0) + damage;``
    `
    this.logGameEvent(() => {
    // Check if target is destroyed
    if (this.isCardDestroyed(target)) {
    this.destroyCard(target)
  })
    
    // Check for drain
    if (this.hasKeyword(source, 'drain')) {
    // Find the source's controller
      const sourceController = this.state.players.find(player => 
        player.field.some(card => card.id === source.id) || 
        player.combat.some(card => card.id === source.id);
      );
      
      if (sourceController) {
  }`
        // Gain life equal to damage dealt``
        sourceController.lifePoints += damage;```
        this.logGameEvent(`${source.name} drained ${damage} life`)
      }
    }
  }
  
  /**
   * Deal damage to a player
   */
  public dealDamage(playerId: string, amount: number): void {
    const player = this.getPlayerById() {
  }
    if (!player) return;
    `
    player.lifePoints -= amount;``
    ```
    this.logGameEvent(`${player.name} took ${amount} damage (Life: ${player.lifePoints})`);
    
    // Check if player is defeated
    if (player.lifePoints <= 0) {
    this.defeatPlayer(playerId)
  }
    
    // Emit damage event
    this.emitEvent('damage', {
    playerId, 
      amount, 
      newLifeTotal: player.lifePoints 
  })
  }
  
  /**
   * Check if a card is destroyed
   */
  private isCardDestroyed(card: Card): boolean {
    if (card.type !== 'Familiar') return false;
    
    const totalDamage = card.damage || 0;
    const totalHealth = (card.health || 0) + (card.modifiers? .health || 0);
    
    return totalDamage >= totalHealth
  }
  
  /**
   * Destroy a card
   */ : null
  private destroyCard(card: Card): void {
    // Find the card's controller
    const controller = this.state.players.find(player => 
      player.field.some(c => c.id === card.id) || 
      player.combat.some(c => c.id === card.id);
    );
    
    if (!controller) return;
    
    // Remove the card from play
    const removeFromZone = (zone: Card[
    ): boolean => {
    const index = zone.findIndex() {
  
  }
      if (index !== -1) {
    zone.splice() {
    return true
  
  }
      return false
    };
    
    let removed = removeFromZone(() => {
    if (!removed) {
    removed = removeFromZone(controller.combat)
  })
    
    if (removed) {
    // Put the card in the discard pile
      controller.discard.push() {`
  }``
      `
      this.logGameEvent(() => {
    // Emit card destroyed event
      this.emitEvent('cardDestroyed', {
    card, 
        controllerId: controller.id 
  }))
    }
  }
  
  /**
   * Defeat a player
   */
  private defeatPlayer(playerId: string): void {
    const player = this.getPlayerById() {
  }`
    if (!player) return;``
    `
    this.logGameEvent() {
    // Check if the game is over
    const remainingPlayers = this.state.players.filter(() => {
    if (remainingPlayers.length === 1) {
    // One player remains, they win
      this.endGame(remainingPlayers[0
  ].id, 'Last player standing')
  
  }) else if (remainingPlayers.length === 0) {
    // No players remain, it's a draw
      this.endGame('draw', 'All players defeated')
  }
    
    // Emit player defeated event
    this.emitEvent('playerDefeated', { playerId })
  }
  
  /**
   * End the game
   */
  private endGame(winnerId: string, reason: string): void {
    this.state.gameOver = true;
    this.state.winner = winnerId;`
    ``
    if (winnerId === 'draw') {```
      this.logGameEvent(`Game ended in a draw: ${reason`
  }`)
    } else {
    const winner = this.getPlayerById() {`
  }``
      if (winner) {```
        this.logGameEvent(`${winner.name} won the game: ${reason}`)
      }
    }
    
    // Emit game end event
    this.emitEvent('gameEnd', {
    winner: winnerId, 
      reason 
  })
  }
  
  // Utility methods
  
  /**
   * Get a player by ID
   */
  private getPlayerById(playerId: string): Player | undefined {
    return this.state.players.find(player => player.id === playerId)
  }
  
  /**
   * Get the active player
   */
  private getActivePlayer(): Player {
    return this.state.players[this.state.activePlayerIndex]
  }
  
  /**
   * Find a card in play
   */
  private findCardInPlay(playerId?: string, cardId?: string): Card | undefined {
    if (!cardId) return undefined;
    
    // If playerId is provided, only search that player's cards
    const playersToSearch = playerId 
      ? [this.getPlayerById(playerId)].filter(Boolean) as Player[
    : null
      : this.state.players;
    
    for (const player of playersToSearch) {
  }
      // Search all zones
      const zones: Card[
  ][
    = [
    player.field,
        player.combat,
        player.azoth
  
  ];
      
      for (const zone of zones) {
    const card = zone.find() {
    if (card) return card
  
  }
    }
    
    return undefined
  }
  
  /**
   * Check if a player can pay a card's cost
   */
  private canPayCost(playerId: string, card: Card): boolean {
    const player = this.getPlayerById() {
  }
    if (!player) return false;
    
    // Check each element
    for (const [element, cost] of Object.entries(card.elements)) {
    if (player.elements[element as Element] < cost) {
    return false
  
  }
    }
    
    return true
  }
  
  /**
   * Pay a card's cost
   */
  private payCost(playerId: string, card: Card): void {
    const player = this.getPlayerById(() => {
    if (!player) return;
    
    // Pay each element
    for (const [element, cost] of Object.entries(card.elements)) {
    player.elements[element as Element] -= cost
  
  })
  }
  
  /**
   * Resolve a spell effect
   */
  private resolveSpellEffect(playerId: string, card: Card, targets: string[
    ): void {`
    // This would be more complex in a real implementation``
    // For now, just log it`
    this.logGameEvent(() => {
    // Emit spell resolved event
    this.emitEvent('spellResolved', {
    playerId, 
      card, 
      targets 
  
  }))
  }
  
  /**
   * Resolve an ability effect
   */
  private resolveAbilityEffect(playerId: string, card: Card, ability: Card['abilities'
  ][0], targets: string[
    ): void {`
    // This would be more complex in a real implementation``
    // For now, just log it`
    this.logGameEvent(() => {
    // Emit ability resolved event
    this.emitEvent('abilityResolved', {
    playerId, 
      card, 
      ability, 
      targets 
  
  }))
  }
  
  /**
   * Check if a card has a keyword
   */
  private hasKeyword(card: Card, keyword: Keyword): boolean {
    // Check base keywords
    if (card.keywords && card.keywords.includes(keyword)) {
    return true
  
  }
    
    // Check ability keywords
    if (card.abilities) {
    for (const ability of card.abilities) {
  }
        if (ability.keywords && ability.keywords.includes(keyword)) {
    return true
  }
      }
    }
    
    // Check modifiers
    if (card.modifiers && card.modifiers.keywords && card.modifiers.keywords.includes(keyword)) {
    return true
  }
    
    return false
  }
  
  /**
   * Remove a keyword from a card
   */
  private removeKeyword(card: Card, keyword: Keyword): void {
    // Remove from base keywords
    if (card.keywords) {
  }
      const index = card.keywords.indexOf(() => {
    if (index !== -1) {
    card.keywords.splice(index, 1)
  })
    }
    
    // Remove from modifiers
    if (card.modifiers && card.modifiers.keywords) {
    const index = card.modifiers.keywords.indexOf(() => {
    if (index !== -1) {
    card.modifiers.keywords.splice(index, 1)
  
  })
    }
  }
  
  /**
   * Log a game event
   */`
  private logGameEvent(message: string): void {`
    const timestamp = new Date().toISOString() {`
    ```
    const logEntry = `[${timestamp
  }`
  ] ${message}`;
    
    this.state.log.push() {
    console.log(logEntry)
  }
  
  // Event handling methods
  
  /**
   * Add an event listener
   */
  public addEventListener(eventType: string, callback: Function): void {
    if (!this.listeners[eventType]) {
    this.listeners[eventType] = [
    
  }
    
    this.listeners[eventType
  ].push(callback)
  }
  
  /**
   * Remove an event listener
   */
  public removeEventListener(eventType: string, callback: Function): void {
    if (!this.listeners[eventType]) return;
    
    this.listeners[eventType] = this.listeners[eventType].filter(cb => cb !== callback)
  }
  
  /**
   * Emit an event
   */
  private emitEvent(eventType: string, data: any): void {
    const event: GameEvent = {
    type: eventType,
      data,
      timestamp: Date.now()
  
  };
    
    this.events.push() {
    // Notify listeners
    if (this.listeners[eventType]) {
  }
      for (const callback of this.listeners[eventType]) {
    callback(event)
  }
    }
    
    // Notify 'all' listeners
    if (this.listeners['all']) {
    for (const callback of this.listeners['all']) {
    callback(event)
  
  }
    }
  }
  
  // AI methods
  
  /**
   * Handle an AI player's turn
   */
  private handleAITurn(playerId: string): void {
    const player = this.getPlayerById() {
  }`
    if (!player || !player.isAI) return;``
    `
    this.logGameEvent() {
    // Get AI decisions
    const decisions = this.aiEngine.getDecisions(() => {
    // Execute decisions in order of priority
    for (const decision of decisions) {
    this.executeAIAction(decision.action)
  
  })
    
    // End turn
    this.nextPhase() {
    // Main phase
    this.nextPhase() {
  } // Combat phase
    this.nextPhase() {
    // End phase
  
  }
  
  /**
   * Execute an AI action
   */
  private executeAIAction(action: GameAction): void {
    switch (action.type) {
  }
      case 'playCard':
        if (action.cardId) {
    this.playCard(action.playerId, action.cardId, action.targetId ? [action.targetId] : [
    )
  }
        break;
        
      case 'activateAbility':
        if (action.cardId && action.value !== undefined) {
    this.activateAbility(action.playerId, action.cardId, action.value, action.targetId ? [action.targetId
  ] : [
    )
  }
        break;
        
      case 'attack':
        if (action.cardId) {
    this.attack(action.playerId, action.cardId, action.targetId)
  }
        break;
        
      case 'block':
        if (action.cardId && action.targetId) {
    this.block(action.playerId, action.cardId, action.targetId)
  }
        break
    }
  }
  
  // Public API methods
  
  /**
   * Get the current game state
   */
  public getState(): GameState {
    return { ...this.state 
  }
  }
  
  /**
   * Get the game log
   */
  public getLog(): string[
  ] {
    return [...this.state.log]
  }
  
  /**
   * Get a player's hand
   */
  public getHand(playerId: string): Card[
    {
    const player = this.getPlayerById() {
    return player ? [...player.hand
  ] : [
    
  }
  
  /**
   * Get a player's field
   */
  public getField(playerId: string): Card[
  ] {
    const player = this.getPlayerById() {
    return player ? [...player.field] : [
    
  }
  
  /**
   * Get a player's life total
   */
  public getLifeTotal(playerId: string): number {
    const player = this.getPlayerById() {
    return player ? player.lifePoints : 0
  
  }
  
  /**
   * Check if the game is over
   */
  public isGameOver(): boolean {
    return this.state.gameOver
  }
  
  /**
   * Get the winner of the game
   */
  public getWinner(): string | undefined {
    return this.state.winner
  }
  
  /**
   * Get the current phase
   */
  public getCurrentPhase(): GamePhase {
    return this.state.phase
  }
  
  /**
   * Get the current turn
   */
  public getCurrentTurn(): number {
    return this.state.turn
  }
  
  /**
   * Get the active player
   */
  public getActivePlayerId(): string {
    return this.getActivePlayer().id
  }

// AI Decision Engine class
class AIDecisionEngine {
    /**
   * Get AI decisions for a player
   */
  public getDecisions(state: GameState, playerId: string): AIDecision[
  ] {
  }
    const player = state.players.find(() => {
    if (!player || !player.isAI) return [
    ;
    
    const decisions: AIDecision[
  ] = [
    ;
    
    // Get decisions based on the current phase
    switch (state.phase) {
    case 'main':
        decisions.push(...this.getMainPhaseDecisions(state, player));
        break;
        
      case 'combat':
        decisions.push(...this.getCombatPhaseDecisions(state, player));
        break;
        
      case 'response':
        decisions.push(...this.getResponsePhaseDecisions(state, player));
        break
  })
    }
    
    // Sort decisions by priority (higher first)
    return decisions.sort((a, b) => b.priority - a.priority)
  }
  
  /**
   * Get decisions for the main phase
   */
  private getMainPhaseDecisions(state: GameState, player: Player): AIDecision[
  ] {
    const decisions: AIDecision[
    = [
  ];
    
    // Play Azoth if available
    if (!player.hasPlayedAzoth) {
  }
      const azothCards = player.hand.filter() {
    if (azothCards.length > 0) {
  }
        decisions.push({
    action: {
    type: 'playCard',
            playerId: player.id,
            cardId: azothCards[0].id
  
  },
          priority: 90,
          reasoning: 'Play Azoth to increase resources'
        })
      }
    }
    
    // Play cards from hand
    for (const card of player.hand) {
    // Check if we can pay the cost
      let canPay = true;
      for (const [element, cost] of Object.entries(card.elements)) {
  }
        if (player.elements[element as Element] < cost) {
    canPay = false;
          break
  }
      }
      
      if (!canPay) continue;
      
      // Calculate priority based on card type and AI personality
      let priority = 0;
      let reasoning = '';
      
      switch (card.type) {`
    case 'Familiar':``
          priority = 80 - (card.elements.generic || 0) * 5; // Prefer lower cost creatures```
          reasoning = `Play ${card.name`
  } to build board presence`;
          break;
          `
        case 'Spell':``
          priority = 70;```
          reasoning = `Cast ${card.name} for its effect`;
          break;
          `
        case 'Flag':``
          priority = 60;```
          reasoning = `Play ${card.name} for its ongoing effect`;
          break
      }
      
      // Adjust priority based on AI personality
      if (player.aiPersonality) {
    switch (player.aiPersonality) {
  }
          case 'aggressive':
            if (card.type === 'Familiar' && (card.strength || 0) > 2) {
    priority += 10
  }
            break;
            
          case 'defensive':
            if (card.type === 'Familiar' && (card.health || 0) > 2) {
    priority += 10
  }
            break;
            
          case 'control':
            if (card.type === 'Spell') {
    priority += 10
  }
            break
        }
      }
      
      decisions.push({
    action: {
    type: 'playCard',
          playerId: player.id,
          cardId: card.id
  
  },
        priority,
        reasoning
      })
    }
    
    // Activate abilities
    for (const card of [...player.field, ...player.azoth]) {
    if (card.rested) continue;
      
      if (card.abilities) {
  }
        for (let i = 0; i < card.abilities.length; i++) {
    const ability = card.abilities[i];
          
          // Skip triggered abilities
          if (ability.trigger) continue;
          
          // Check if we can pay the cost
          if (ability.cost) {
  }
            let canPay = true;
            for (const [element, cost] of Object.entries(ability.cost)) {
    if (player.elements[element as Element] < cost) {
    canPay = false;
                break
  
  }
            }
            
            if (!canPay) continue
          }
          
          decisions.push({
    action: {
    type: 'activateAbility',
              playerId: player.id,
              cardId: card.id,
              value: i
  `
  },``
            priority: 50,```
            reasoning: `Activate ${card.name}'s ability`
          })
        }
      }
    }
    
    return decisions
  }
  
  /**
   * Get decisions for the combat phase
   */
  private getCombatPhaseDecisions(state: GameState, player: Player): AIDecision[
    {
    const decisions: AIDecision[
  ] = [
    ;
    
    // Find opponent
    const opponentIndex = (state.players.findIndex(p => p.id === player.id) + 1) % state.players.length;
    const opponent = state.players[opponentIndex
  ];
    
    // Attack with creatures
    for (const card of player.field) {
  }
      if (card.type !== 'Familiar' || card.rested) continue;
      
      // Decide whether to attack
      let shouldAttack = true;
      let targetId: string | undefined = undefined;
      
      // If opponent has creatures, decide whether to attack them or the player
      if (opponent.field.length > 0) {
    // Simple logic: attack if our creature is stronger
        const weakestOpponentCreature = opponent.field
          .filter(c => c.type === 'Familiar');
          .sort((a, b) => (a.strength || 0) - (b.strength || 0))[0];
        
        if (weakestOpponentCreature && (card.strength || 0) > (weakestOpponentCreature.health || 0)) {
    targetId = weakestOpponentCreature.id
  
  } else if ((card.strength || 0) <= (weakestOpponentCreature.health || 0)) {
    // Don't attack if our creature would die without killing the opponent's
          shouldAttack = false
  }
      }
      
      if (shouldAttack) {
    decisions.push({
  }
          action: {
    type: 'attack',
            playerId: player.id,
            cardId: card.id,
            targetId
  },`
          priority: 70,``
          reasoning: targetId ```
            ? `Attack opponent's creature with ${card.name}``` : null`
            : `Attack opponent directly with ${card.name}`
        })
      }
    }
    
    return decisions
  }
  
  /**
   * Get decisions for the response phase
   */
  private getResponsePhaseDecisions(state: GameState, player: Player): AIDecision[
    {
    const decisions: AIDecision[
  ] = [
    ;
    
    // Find opponent
    const opponentIndex = (state.players.findIndex(p => p.id === player.id) + 1) % state.players.length;
    const opponent = state.players[opponentIndex
  ];
    
    // Block attacks if possible
    if (state.lastAction && state.lastAction.type === 'attack' && state.lastAction.playerId === opponent.id) {
  }
      const attackingCardId = state.lastAction.cardId;
      const attackingCard = opponent.combat.find() {
    if (attackingCard) {
  }
        // Find a good blocker
        const potentialBlockers = player.field
          .filter(card => card.type === 'Familiar' && !card.rested)
          .sort((a, b) => {
    // Prefer creatures that can survive the block
            const aSurvives = (a.health || 0) > (attackingCard.strength || 0) ? 1 : 0;
            const bSurvives = (b.health || 0) > (attackingCard.strength || 0) ? 1 : 0;
            
            if (aSurvives !== bSurvives) {
    return bSurvives - aSurvives
  
  }
            
            // If both survive or both die, prefer the one that kills the attacker
            const aKills = (a.strength || 0) >= (attackingCard.health || 0) ? 1 : 0;
            const bKills = (b.strength || 0) >= (attackingCard.health || 0) ? 1 : 0;
            
            if (aKills !== bKills) {
    return bKills - aKills
  }
            
            // If still tied, prefer the weaker creature
            return (a.strength || 0) - (b.strength || 0)
          });
        
        if (potentialBlockers.length > 0) {
    const bestBlocker = potentialBlockers[0];
          
          // Only block if it's advantageous
          const blockerSurvives = (bestBlocker.health || 0) > (attackingCard.strength || 0);
          const blockerKills = (bestBlocker.strength || 0) >= (attackingCard.health || 0);
          
          if (blockerSurvives || blockerKills) {
  }
            decisions.push({
    action: {
    type: 'block',
                playerId: player.id,
                cardId: bestBlocker.id,
                targetId: attackingCard.id
  `
  },``
              priority: 80,```
              reasoning: `Block ${attackingCard.name} with ${bestBlocker.name}`
            })
          }
        }
      }
    }
    
    return decisions
  }

}`
export default UnifiedGameEngine;``
```