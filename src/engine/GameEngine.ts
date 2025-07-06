/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

/**
 * KONIVRER Game Engine - KONIVRER Arena Edition
 *
 * This enhanced game engine provides an KONIVRER Arena-like experience with:
 * - Improved performance for all devices
 * - Advanced animations and visual effects
 * - Optimized state management
 * - Cross-platform compatibility
 * - Enhanced AI opponent
 *
 * The engine manages game state, enforces rules, and processes player actions
 * while providing a smooth, responsive experience on any browser.
 */

interface GameOptions {
  performanceMode?: 'high' | 'medium' | 'low' | 'auto';
  animationLevel?: 'full' | 'reduced' | 'minimal' | 'none';
  deviceType?: string;
  enableBattlefield3D?: boolean;
  enableCardHovers?: boolean;
  enableSoundEffects?: boolean;
  enableVoiceLines?: boolean;
  enableParticleEffects?: boolean;
  timerEnabled?: boolean;
  timerDuration?: number;
  mulligan?: 'london' | 'paris' | 'vancouver';
  startingHandSize?: number;
}

class GameEngine {
  // Core state
  private gameState: any;
  private eventListeners: Record<string, Function[]>;
  private gameId: string;
  
  // Performance options
  private performanceMode: string;
  private animationLevel: string;
  private deviceType: string;
  
  // KONIVRER Arena-like features
  private enableBattlefield3D: boolean;
  private enableCardHovers: boolean;
  private enableSoundEffects: boolean;
  private enableVoiceLines: boolean;
  private enableParticleEffects: boolean;
  
  // Advanced game options
  private timerEnabled: boolean;
  private timerDuration: number;
  private mulligan: string;
  private startingHandSize: number;
  
  // Animation and rules systems
  private animationSystem: any;
  private rulesEngine: any;
  
  // Performance monitoring
  private lastFrameTime: number;
  private frameCount: number;
  private frameRate: number;
  private frameRateHistory: number[];
  private performanceIssues: boolean;
  
  constructor(options: GameOptions = {}) {
    // Core state
    this.gameState = null;
    this.eventListeners = {};
    this.gameId = this.generateGameId();
    
    // Performance options
    this.performanceMode = options.performanceMode || 'auto'; // 'high', 'medium', 'low', 'auto'
    this.animationLevel = options.animationLevel || 'full'; // 'full', 'reduced', 'minimal', 'none'
    this.deviceType = options.deviceType || this.detectDeviceType();
    
    // KONIVRER Arena-like features
    this.enableBattlefield3D = options.enableBattlefield3D !== false && this.canSupport3D();
    this.enableCardHovers = options.enableCardHovers !== false;
    this.enableSoundEffects = options.enableSoundEffects !== false;
    this.enableVoiceLines = options.enableVoiceLines !== false && this.canSupportAudio();
    this.enableParticleEffects = options.enableParticleEffects !== false && this.canSupportParticles();
    
    // Advanced game options
    this.timerEnabled = options.timerEnabled || false;
    this.timerDuration = options.timerDuration || 45; // seconds per turn
    this.mulligan = options.mulligan || 'london'; // 'london', 'paris', 'vancouver'
    this.startingHandSize = options.startingHandSize || 7;
    
    // Animation and rules systems
    this.animationSystem = null;
    this.rulesEngine = null;
    
    // Performance monitoring
    this.lastFrameTime = performance.now();
    this.frameCount = 0;
    this.frameRate = 0;
    this.frameRateHistory = [];
    this.performanceIssues = false;
    
    // Initialize performance monitoring
    this.initPerformanceMonitoring();
  }
  
  /**
   * Generate a unique game ID
   */
  private generateGameId(): string {
    return 'game_' + Math.random().toString(36).substring(2, 15);
  }
  
  /**
   * Detect the device type
   */
  private detectDeviceType(): string {
    // Simple device detection
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    
    if (/android/i.test(userAgent)) {
      return 'android';
    }
    
    if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      return 'ios';
    }
    
    return 'desktop';
  }
  
  /**
   * Check if the device can support 3D rendering
   */
  private canSupport3D(): boolean {
    // Simple check for WebGL support
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && 
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }
  
  /**
   * Check if the device can support audio
   */
  private canSupportAudio(): boolean {
    return !!(window.AudioContext || (window as any).webkitAudioContext);
  }
  
  /**
   * Check if the device can support particle effects
   */
  private canSupportParticles(): boolean {
    // Simplified check - in reality would be more complex
    return this.canSupport3D() && this.deviceType !== 'low-end-mobile';
  }
  
  /**
   * Initialize performance monitoring
   */
  private initPerformanceMonitoring(): void {
    // Set up performance monitoring
    this.lastFrameTime = performance.now();
    this.frameCount = 0;
    this.frameRate = 60; // Assume 60fps to start
    
    // Set up frame rate monitoring
    const monitorFrameRate = () => {
      const now = performance.now();
      const elapsed = now - this.lastFrameTime;
      
      if (elapsed >= 1000) { // Update every second
        this.frameRate = this.frameCount / (elapsed / 1000);
        this.frameRateHistory.push(this.frameRate);
        
        // Keep history to a reasonable size
        if (this.frameRateHistory.length > 60) {
          this.frameRateHistory.shift();
        }
        
        // Check for performance issues
        this.performanceIssues = this.frameRate < 30;
        
        // Reset counters
        this.frameCount = 0;
        this.lastFrameTime = now;
        
        // Adjust animation level if needed
        this.adjustAnimationLevel();
      }
      
      this.frameCount++;
      requestAnimationFrame(monitorFrameRate);
    };
    
    // Start monitoring
    requestAnimationFrame(monitorFrameRate);
  }
  
  /**
   * Adjust animation level based on performance
   */
  private adjustAnimationLevel(): void {
    if (this.performanceMode !== 'auto') return;
    
    const avgFrameRate = this.frameRateHistory.reduce((sum, rate) => sum + rate, 0) / 
      this.frameRateHistory.length;
    
    if (avgFrameRate < 20) {
      this.animationLevel = 'minimal';
    } else if (avgFrameRate < 40) {
      this.animationLevel = 'reduced';
    } else {
      this.animationLevel = 'full';
    }
  }

  /**
   * Set the animation system for the game engine
   * @param animationSystem - The animation system to use
   */
  public setAnimationSystem(animationSystem: any): GameEngine {
    this.animationSystem = animationSystem;
    console.log('Animation system set:', animationSystem.name || 'Unknown');
    return this;
  }

  /**
   * Set the rules engine for the game engine
   * @param rulesEngine - The rules engine to use
   */
  public setRulesEngine(rulesEngine: any): GameEngine {
    this.rulesEngine = rulesEngine;
    console.log('Rules engine set:', rulesEngine.name || 'Unknown');
    return this;
  }

  /**
   * Initialize a new game with the given players and decks
   * @param options Game initialization options
   */
  public initializeGame(options: {
    players: any[];
    isOnline?: boolean;
    isAI?: boolean;
    gameMode?: string;
    ranked?: boolean;
    settings?: any;
  }): any {
    const {
      players,
      isOnline = false,
      isAI = false,
      gameMode = 'standard',
      ranked = false,
      settings = {}
    } = options;

    if (players.length !== 2) {
      throw new Error('Game requires exactly 2 players');
    }

    // Apply game settings
    const gameSettings = {
      startingHandSize: settings.startingHandSize || this.startingHandSize,
      mulliganType: settings.mulliganType || this.mulligan,
      timerEnabled: settings.timerEnabled !== undefined ? settings.timerEnabled : this.timerEnabled,
      timerDuration: settings.timerDuration || this.timerDuration,
      allowTakebacks: settings.allowTakebacks !== undefined ? settings.allowTakebacks : false,
      showHints: settings.showHints !== undefined ? settings.showHints : true,
      autoPassPriority: settings.autoPassPriority !== undefined ? settings.autoPassPriority : true,
      autoTapAzoth: settings.autoTapAzoth !== undefined ? settings.autoTapAzoth : true,
      enableEmotes: settings.enableEmotes !== undefined ? settings.enableEmotes : true,
      enableBattlefield3D: settings.enableBattlefield3D !== undefined ? settings.enableBattlefield3D : this.enableBattlefield3D
    };

    // Initialize game state with simultaneous turns structure
    this.gameState = {
      // Core game info
      gameId: this.gameId,
      gameMode,
      ranked,
      settings: gameSettings,

      // Game state
      turn: 1,
      phase: 'simultaneous', // No phases, just simultaneous play
      currentPlayer: null, // No concept of current player
      activePlayer: null, // Both players are active simultaneously

      // Players
      players: players.map((player, index) => ({
        // Basic player info
        id: index,
        name: player.name,
        avatar: player.avatar || null,
        rank: player.rank || 'Bronze',
        rankTier: player.rankTier || 4,

        // Game zones
        deck: this.shuffleDeck([...player.deck]),
        hand: [],
        lifeCards: [],
        field: [],
        azothRow: [],
        graveyard: [],
        removedZone: [],

        // Player state
        life: 20, // For visual display only - actual life is tracked via life cards
        azothAvailable: 0,
        azothPlacedThisTurn: false,
        passedPriority: false,
        mulligans: 0,
        timeRemaining: gameSettings.timerEnabled ? gameSettings.timerDuration : null,

        // Cosmetics
        flag: player.flag || null,
        cardBack: player.cardBack || 'default',
        avatarFrame: player.avatarFrame || 'default',
        emotes: player.emotes || [],

        // Stats
        cardsDrawn: 0,
        damageDealt: 0,
        creaturesSummoned: 0,
        spellsCast: 0
      })),

      // Game elements
      stack: [], // For resolving abilities and effects
      drcActive: false, // Whether a Dynamic Resolution Chain is active
      drcInitiator: null, // Player who initiated the current DRC
      drcWaitingFor: null, // Player who needs to respond or pass
      drcResponses: [], // Track which players have passed in the current DRC round
      animations: [], // Visual animations queue
      triggers: [], // Waiting triggered abilities
      gameLog: [],

      // Game status
      isOnline,
      isAI,
      winner: null,
      waitingFor: null,
      timer: 0,
      startTime: Date.now(),
      lastActionTime: Date.now(),

      // Performance metrics
      performanceData: {
        deviceType: this.deviceType,
        frameRate: this.frameRate,
        animationLevel: this.animationLevel,
        performanceMode: this.performanceMode,
        performanceIssues: this.performanceIssues
      }
    };

    // Initial setup - draw life cards
    this.gameState.players.forEach((player: any) => {
      // Draw 4 life cards
      for (let i = 0; i < 4; i++) {
        const card = player.deck.pop();
        if (card) {
          player.lifeCards.push({ ...card, faceDown: true });
        }
      }

      // Draw initial hand (7 cards)
      for (let i = 0; i < gameSettings.startingHandSize; i++) {
        const card = player.deck.pop();
        if (card) {
          player.hand.push(card);
        }
      }
    });

    // Log game start
    this.addToGameLog('game', 'Game initialized');
    
    // Emit game initialized event
    this.emitEvent('gameInitialized', this.gameState);
    
    return this.gameState;
  }
  
  /**
   * Shuffle a deck of cards
   */
  private shuffleDeck(deck: any[]): any[] {
    // Fisher-Yates shuffle algorithm
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }
  
  /**
   * Add an entry to the game log
   */
  private addToGameLog(type: string, message: string): void {
    if (!this.gameState) return;
    
    this.gameState.gameLog.push({
      type,
      message,
      timestamp: Date.now()
    });
  }
  
  /**
   * Emit an event to all listeners
   */
  private emitEvent(eventType: string, data: any): void {
    if (!this.eventListeners[eventType]) return;
    
    this.eventListeners[eventType].forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        console.error(`Error in ${eventType} event listener:`, error);
      }
    });
  }

  /**
   * Start the game after setup is complete
   */
  public startGame(): any {
    if (!this.gameState) {
      throw new Error('Game not initialized');
    }
    
    if (this.gameState.phase !== 'simultaneous') {
      throw new Error('Game has already started');
    }

    this.gameState.phase = 'simultaneous';
    this.addToGameLog('game', 'Game started');
    
    // Emit game started event
    this.emitEvent('gameStarted', this.gameState);
    
    // No phases to start in simultaneous mode
    
    return this.gameState;
  }

  /**
   * Process a player action
   * @param playerId ID of the player taking the action
   * @param actionType Type of action (play, summon, cast, attack, etc.)
   * @param actionData Data associated with the action
   */
  public processAction(playerId: number, actionType: string, actionData: any): any {
    if (!this.gameState) {
      throw new Error('Game not initialized');
    }
    
    // In simultaneous mode, any player can take actions at any time
    // No turn or priority restrictions

    // Process different action types
    switch (actionType) {
      case 'placeAzoth':
        return this.placeAzoth(playerId, actionData.cardId);
        
      case 'summonFamiliar':
        return this.summonFamiliar(playerId, actionData.cardId, actionData.azothPaid);
        
      case 'castSpell':
        return this.castSpell(playerId, actionData.cardId, actionData.azothPaid, actionData.targets);
        
      case 'declareAttack':
        return this.declareAttack(playerId, actionData.attackers);
        
      case 'declareBlock':
        return this.declareBlock(playerId, actionData.blockers);
        
      case 'activateAbility':
        return this.activateAbility(playerId, actionData.cardId, actionData.abilityIndex, actionData.targets);
        
      case 'passPriority':
        return this.passPriority(playerId);
        
      case 'endPhase':
        return this.endPhase(playerId);
        
      case 'endTurn':
        return this.endTurn(playerId);
        
      default:
        throw new Error(`Unknown action type: ${actionType}`);
    }
  }
  
  /**
   * Get a player by ID
   */
  private getPlayerById(playerId: number): any {
    if (!this.gameState) return null;
    return this.gameState.players.find((p: any) => p.id === playerId);
  }

  /**
   * Place a card as Azoth (resource)
   * @param playerId Player ID
   * @param cardId Card ID to place as Azoth
   */
  private placeAzoth(playerId: number, cardId: string): any {
    const player = this.getPlayerById(playerId);
    if (!player) {
      throw new Error('Player not found');
    }

    // In simultaneous mode, players can place Azoth at any time
    // No phase restrictions

    // Find the card in hand
    const cardIndex = player.hand.findIndex((card: any) => card.id === cardId);
    if (cardIndex === -1) {
      throw new Error('Card not found in hand');
    }

    // In simultaneous mode, players can place multiple Azoth
    // No restriction on number of Azoth placed per turn

    // Remove from hand and add to Azoth row
    const card = player.hand.splice(cardIndex, 1)[0];
    player.azothRow.push(card);
    
    // Mark that player has placed Azoth this turn
    player.azothPlacedThisTurn = true;

    // Log the action
    this.addToGameLog('azoth', `${player.name} placed ${card.name} as Azoth`);
    
    // Emit event
    this.emitEvent('azothPlaced', {
      playerId,
      card,
      gameState: this.gameState
    });
    
    return this.gameState;
  }

  /**
   * Summon a Familiar
   * @param playerId Player ID
   * @param cardId Card ID to summon
   * @param azothPaid Array of Azoth card IDs used to pay the cost
   */
  private summonFamiliar(playerId: number, cardId: string, azothPaid: string[]): any {
    const player = this.getPlayerById(playerId);
    if (!player) {
      throw new Error('Player not found');
    }
    
    // Find the card in hand
    const cardIndex = player.hand.findIndex((card: any) => card.id === cardId);
    if (cardIndex === -1) {
      throw new Error('Card not found in hand');
    }
    
    const card = player.hand[cardIndex];
    
    // Check if card is a Familiar
    if (card.type !== 'familiar') {
      throw new Error('Card is not a Familiar');
    }
    
    // Verify Azoth payment
    this.verifyAzothPayment(player, card, azothPaid);
    
    // Remove from hand
    player.hand.splice(cardIndex, 1);
    
    // Calculate strength counters based on Azoth paid
    const strengthPaid = azothPaid.reduce((total, azothId) => {
      const azoth = player.azothRow.find((a: any) => a.id === azothId);
      return total + (azoth.elements.includes('Strength') ? 1 : 0);
    }, 0);
    
    // Tap the Azoth cards used
    azothPaid.forEach(azothId => {
      const azoth = player.azothRow.find((a: any) => a.id === azothId);
      if (azoth) {
        azoth.tapped = true;
      }
    });
    
    // Create stack item for the familiar
    const stackItem = {
      type: 'creature',
      card: {
        ...card,
        counters: strengthPaid,
        summoningSickness: true, // Can't attack the turn it's summoned
      },
      controller: playerId,
      targets: [],
      timestamp: Date.now(),
    };
    
    // Start a Dynamic Resolution Chain if not already in one
    if (!this.gameState.drcActive) {
      // This is a new DRC
      this.startDynamicResolutionChain(playerId, stackItem);
    } else {
      // This is a response in an existing DRC
      // Add to stack
      this.gameState.stack.push(stackItem);
      
      // Log the action
      this.addToGameLog('summon', `${player.name} summoned ${card.name} with ${strengthPaid} strength counters in response`);
    }
    
    // Emit event
    this.emitEvent('familiarSummoned', {
      playerId,
      card,
      strengthPaid,
      gameState: this.gameState
    });
    
    return this.gameState;
  }
  
  /**
   * Verify Azoth payment for a card
   */
  private verifyAzothPayment(player: any, card: any, azothPaid: string[]): void {
    // This would be implemented with actual cost verification logic
    // For now, just a stub
  }
  
  /**
   * Start a Dynamic Resolution Chain
   */
  private startDynamicResolutionChain(playerId: number, stackItem: any): void {
    this.gameState.drcActive = true;
    this.gameState.drcInitiator = playerId;
    this.gameState.drcWaitingFor = 1 - playerId; // Other player
    this.gameState.drcResponses = [];
    this.gameState.stack.push(stackItem);
    
    // Log the action
    this.addToGameLog('drc', `${this.getPlayerById(playerId).name} started a Dynamic Resolution Chain`);
  }

  /**
   * Cast a Spell
   * @param playerId Player ID
   * @param cardId Card ID to cast
   * @param azothPaid Array of Azoth card IDs used to pay the cost
   * @param targets Array of target objects (if required)
   */
  private castSpell(playerId: number, cardId: string, azothPaid: string[], targets: any[] = []): any {
    const player = this.getPlayerById(playerId);
    if (!player) {
      throw new Error('Player not found');
    }
    
    // Find the card in hand
    const cardIndex = player.hand.findIndex((card: any) => card.id === cardId);
    if (cardIndex === -1) {
      throw new Error('Card not found in hand');
    }
    
    const card = player.hand[cardIndex];
    
    // Check if card is a Spell
    if (card.type !== 'spell') {
      throw new Error('Card is not a Spell');
    }
    
    // Verify Azoth payment
    this.verifyAzothPayment(player, card, azothPaid);
    
    // Verify targets if required
    if (card.requiresTarget && (!targets || targets.length === 0)) {
      throw new Error('Spell requires targets');
    }
    
    // Remove from hand
    player.hand.splice(cardIndex, 1);
    
    // Tap the Azoth cards used
    azothPaid.forEach(azothId => {
      const azoth = player.azothRow.find((a: any) => a.id === azothId);
      if (azoth) {
        azoth.tapped = true;
      }
    });
    
    // Create stack item for the spell
    const stackItem = {
      type: 'spell',
      card,
      controller: playerId,
      targets,
      timestamp: Date.now(),
    };
    
    // Start a Dynamic Resolution Chain if not already in one
    if (!this.gameState.drcActive) {
      // This is a new DRC
      this.startDynamicResolutionChain(playerId, stackItem);
    } else {
      // This is a response in an existing DRC
      // Add to stack
      this.gameState.stack.push(stackItem);
      
      // Log the action
      this.addToGameLog('cast', `${player.name} cast ${card.name} in response`);
    }
    
    // Emit event
    this.emitEvent('spellCast', {
      playerId,
      card,
      targets,
      gameState: this.gameState
    });
    
    return this.gameState;
  }

  /**
   * Declare attackers for combat
   * @param playerId Player ID
   * @param attackers Array of card IDs that are attacking
   */
  private declareAttack(playerId: number, attackers: string[]): any {
    const player = this.getPlayerById(playerId);
    if (!player) {
      throw new Error('Player not found');
    }
    
    // Verify all attackers are valid
    const attackingCards = attackers.map(attackerId => {
      const attacker = player.field.find((card: any) => card.id === attackerId);
      
      if (!attacker) {
        throw new Error(`Attacker ${attackerId} not found on field`);
      }
      
      if (attacker.tapped) {
        throw new Error(`Attacker ${attacker.name} is already tapped`);
      }
      
      if (attacker.summoningSickness) {
        throw new Error(`Attacker ${attacker.name} has summoning sickness`);
      }
      
      return attacker;
    });
    
    // Mark attackers as attacking and tap them
    attackingCards.forEach(attacker => {
      attacker.attacking = true;
      attacker.tapped = true;
    });
    
    // Set game state to waiting for blocks
    this.gameState.phase = 'combat-blocks';
    this.gameState.activePlayer = 1 - playerId; // Give priority to defender
    this.gameState.waitingFor = 'blocks';
    
    // Log the action
    this.addToGameLog('attack', `${player.name} declared ${attackers.length} attackers`);
    
    // Emit event
    this.emitEvent('attackDeclared', {
      playerId,
      attackers: attackingCards,
      gameState: this.gameState
    });
    
    return this.gameState;
  }

  /**
   * Declare blockers for combat
   * @param playerId Player ID
   * @param blockers Array of {blocker: cardId, attacker: cardId} pairs
   */
  private declareBlock(playerId: number, blockers: {blocker: string, attacker: string}[]): any {
    const player = this.getPlayerById(playerId);
    if (!player) {
      throw new Error('Player not found');
    }
    
    const attacker = this.getPlayerById(1 - playerId);
    if (!attacker) {
      throw new Error('Attacker not found');
    }
    
    // Check if in the correct phase
    if (this.gameState.phase !== 'combat-blocks') {
      throw new Error('Can only declare blocks during Combat-Blocks phase');
    }
    
    // Check if it's the player's priority
    if (this.gameState.activePlayer !== playerId) {
      throw new Error('Not your priority to block');
    }
    
    // Stub implementation - would be more complex in reality
    
    // Log the action
    this.addToGameLog('block', `${player.name} declared ${blockers.length} blockers`);
    
    // Emit event
    this.emitEvent('blockDeclared', {
      playerId,
      blockers,
      gameState: this.gameState
    });
    
    return this.gameState;
  }
  
  /**
   * Activate an ability on a card
   */
  private activateAbility(playerId: number, cardId: string, abilityIndex: number, targets: any[] = []): any {
    // Stub implementation
    return this.gameState;
  }
  
  /**
   * Pass priority in a Dynamic Resolution Chain
   */
  private passPriority(playerId: number): any {
    // Stub implementation
    return this.gameState;
  }
  
  /**
   * End the current phase
   */
  private endPhase(playerId: number): any {
    // Stub implementation
    return this.gameState;
  }
  
  /**
   * End the current turn
   */
  private endTurn(playerId: number): any {
    // Stub implementation
    return this.gameState;
  }
}

export default GameEngine;