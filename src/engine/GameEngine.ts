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

interface Card {
  id: string;
  name: string;
  type: string;
  cost?: number;
  power?: number;
  health?: number;
  abilities?: any[];
  effects?: any[];
  faceDown?: boolean;
  [key: string]: any;
}

interface Player {
  id: number;
  name: string;
  avatar?: string | null;
  rank?: string;
  rankTier?: number;
  deck: Card[];
  hand: Card[];
  lifeCards: Card[];
  field: Card[];
  azothRow: Card[];
  graveyard: Card[];
  removedZone: Card[];
  life: number;
  azothAvailable: number;
  azothPlacedThisTurn: boolean;
  passedPriority: boolean;
  mulligans: number;
  timeRemaining: number | null;
  flag?: string | null;
  cardBack?: string;
  avatarFrame?: string;
  emotes?: any[];
  cardsDrawn: number;
  damageDealt: number;
  creaturesSummoned: number;
  spellsCast: number;
}

interface GameState {
  gameId: string;
  gameMode: string;
  ranked: boolean;
  settings: any;
  turn: number;
  phase: string;
  currentPlayer: number | null;
  activePlayer: number | null;
  players: Player[];
  stack: any[];
  drcActive: boolean;
  drcInitiator: number | null;
  drcWaitingFor: number | null;
  drcResponses: any[];
  animations: any[];
  triggers: any[];
  gameLog: GameLogEntry[];
  isOnline: boolean;
  isAI: boolean;
  winner: number | null;
  waitingFor: number | null;
  timer: number;
  startTime: number;
  lastActionTime: number;
  performanceData: {
    deviceType: string;
    frameRate: number;
    animationLevel: string;
    performanceMode: string;
    performanceIssues: boolean;
  };
}

interface GameLogEntry {
  type: string;
  message: string;
  timestamp: number;
}

interface GameInitOptions {
  players: any[];
  isOnline?: boolean;
  isAI?: boolean;
  gameMode?: string;
  ranked?: boolean;
  settings?: any;
}

interface AnimationSystem {
  name?: string;
  [key: string]: any;
}

interface RulesEngine {
  name?: string;
  [key: string]: any;
}

class GameEngine {
  // Core state
  private gameState: GameState | null;
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
  private animationSystem: AnimationSystem | null;
  private rulesEngine: RulesEngine | null;
  
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
  public setAnimationSystem(animationSystem: AnimationSystem): GameEngine {
    this.animationSystem = animationSystem;
    console.log('Animation system set:', animationSystem.name || 'Unknown');
    return this;
  }

  /**
   * Set the rules engine for the game engine
   * @param rulesEngine - The rules engine to use
   */
  public setRulesEngine(rulesEngine: RulesEngine): GameEngine {
    this.rulesEngine = rulesEngine;
    console.log('Rules engine set:', rulesEngine.name || 'Unknown');
    return this;
  }

  /**
   * Initialize a new game with the given players and decks
   * @param options Game initialization options
   */
  public initializeGame(options: GameInitOptions): GameState {
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
    this.gameState.players.forEach((player: Player) => {
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
  private shuffleDeck(deck: Card[]): Card[] {
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
  public startGame(): GameState {
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
  public processAction(playerId: number, actionType: string, actionData: any): GameState {
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
  private getPlayerById(playerId: number): Player | null {
    if (!this.gameState) return null;
    return this.gameState.players.find((p) => p.id === playerId) || null;
  }

  /**
   * Place a card as Azoth (resource)
   * @param playerId Player ID
   * @param cardId Card ID to place as Azoth
   */
  private placeAzoth(playerId: number, cardId: string): GameState {
    if (!this.gameState) {
      throw new Error('Game not initialized');
    }
    
    const player = this.getPlayerById(playerId);
    if (!player) {
      throw new Error('Player not found');
    }

    // Find the card in hand
    const cardIndex = player.hand.findIndex((card) => card.id === cardId);
    if (cardIndex === -1) {
      throw new Error('Card not found in hand');
    }

    // Remove from hand and add to Azoth row
    const card = player.hand.splice(cardIndex, 1)[0];
    player.azothRow.push(card);
    
    // Increment available Azoth
    player.azothAvailable += 1;
    
    // Mark that player has placed Azoth this turn
    player.azothPlacedThisTurn = true;
    
    // Log action
    this.addToGameLog('action', `${player.name} placed ${card.name} as Azoth`);
    
    // Emit event
    this.emitEvent('azothPlaced', {
      playerId,
      card,
      azothAvailable: player.azothAvailable
    });
    
    return this.gameState;
  }

  /**
   * Summon a familiar
   * @param playerId Player ID
   * @param cardId Card ID to summon
   * @param azothPaid Azoth paid to summon the familiar
   */
  private summonFamiliar(playerId: number, cardId: string, azothPaid: any): GameState {
    if (!this.gameState) {
      throw new Error('Game not initialized');
    }
    
    const player = this.getPlayerById(playerId);
    if (!player) {
      throw new Error('Player not found');
    }

    // Find the card in hand
    const cardIndex = player.hand.findIndex((card) => card.id === cardId);
    if (cardIndex === -1) {
      throw new Error('Card not found in hand');
    }

    const card = player.hand[cardIndex];
    
    // Check if player has enough Azoth
    if (player.azothAvailable < (card.cost || 0)) {
      throw new Error('Not enough Azoth');
    }
    
    // Pay Azoth cost
    player.azothAvailable -= (card.cost || 0);
    
    // Remove from hand and add to field
    player.hand.splice(cardIndex, 1);
    player.field.push(card);
    
    // Increment stats
    player.creaturesSummoned += 1;
    
    // Log action
    this.addToGameLog('action', `${player.name} summoned ${card.name}`);
    
    // Emit event
    this.emitEvent('familiarSummoned', {
      playerId,
      card,
      azothPaid
    });
    
    return this.gameState;
  }

  /**
   * Cast a spell
   * @param playerId Player ID
   * @param cardId Card ID to cast
   * @param azothPaid Azoth paid to cast the spell
   * @param targets Targets for the spell
   */
  private castSpell(playerId: number, cardId: string, azothPaid: any, targets: any[]): GameState {
    if (!this.gameState) {
      throw new Error('Game not initialized');
    }
    
    const player = this.getPlayerById(playerId);
    if (!player) {
      throw new Error('Player not found');
    }

    // Find the card in hand
    const cardIndex = player.hand.findIndex((card) => card.id === cardId);
    if (cardIndex === -1) {
      throw new Error('Card not found in hand');
    }

    const card = player.hand[cardIndex];
    
    // Check if player has enough Azoth
    if (player.azothAvailable < (card.cost || 0)) {
      throw new Error('Not enough Azoth');
    }
    
    // Pay Azoth cost
    player.azothAvailable -= (card.cost || 0);
    
    // Remove from hand
    player.hand.splice(cardIndex, 1);
    
    // Add to graveyard (after resolving)
    player.graveyard.push(card);
    
    // Increment stats
    player.spellsCast += 1;
    
    // Log action
    this.addToGameLog('action', `${player.name} cast ${card.name}`);
    
    // Emit event
    this.emitEvent('spellCast', {
      playerId,
      card,
      azothPaid,
      targets
    });
    
    // Resolve spell effects (would be more complex in real implementation)
    
    return this.gameState;
  }

  /**
   * Declare attackers
   * @param playerId Player ID
   * @param attackers Array of card IDs to attack with
   */
  private declareAttack(playerId: number, attackers: string[]): GameState {
    if (!this.gameState) {
      throw new Error('Game not initialized');
    }
    
    // Implementation would go here
    
    return this.gameState;
  }

  /**
   * Declare blockers
   * @param playerId Player ID
   * @param blockers Object mapping attacker IDs to blocker IDs
   */
  private declareBlock(playerId: number, blockers: Record<string, string>): GameState {
    if (!this.gameState) {
      throw new Error('Game not initialized');
    }
    
    // Implementation would go here
    
    return this.gameState;
  }

  /**
   * Activate an ability on a card
   * @param playerId Player ID
   * @param cardId Card ID with the ability
   * @param abilityIndex Index of the ability to activate
   * @param targets Targets for the ability
   */
  private activateAbility(playerId: number, cardId: string, abilityIndex: number, targets: any[]): GameState {
    if (!this.gameState) {
      throw new Error('Game not initialized');
    }
    
    // Implementation would go here
    
    return this.gameState;
  }

  /**
   * Pass priority in a Dynamic Resolution Chain
   * @param playerId Player ID
   */
  private passPriority(playerId: number): GameState {
    if (!this.gameState) {
      throw new Error('Game not initialized');
    }
    
    // Implementation would go here
    
    return this.gameState;
  }

  /**
   * End the current phase
   * @param playerId Player ID
   */
  private endPhase(playerId: number): GameState {
    if (!this.gameState) {
      throw new Error('Game not initialized');
    }
    
    // Implementation would go here
    
    return this.gameState;
  }

  /**
   * End the current turn
   * @param playerId Player ID
   */
  private endTurn(playerId: number): GameState {
    if (!this.gameState) {
      throw new Error('Game not initialized');
    }
    
    // Implementation would go here
    
    return this.gameState;
  }

  /**
   * Add an event listener
   * @param eventType Type of event to listen for
   * @param callback Function to call when event occurs
   */
  public addEventListener(eventType: string, callback: Function): void {
    if (!this.eventListeners[eventType]) {
      this.eventListeners[eventType] = [];
    }
    
    this.eventListeners[eventType].push(callback);
  }

  /**
   * Remove an event listener
   * @param eventType Type of event
   * @param callback Function to remove
   */
  public removeEventListener(eventType: string, callback: Function): void {
    if (!this.eventListeners[eventType]) return;
    
    this.eventListeners[eventType] = this.eventListeners[eventType].filter(
      listener => listener !== callback
    );
  }

  /**
   * Get the current game state
   */
  public getGameState(): GameState | null {
    return this.gameState;
  }

  /**
   * Get performance data
   */
  public getPerformanceData(): any {
    return {
      deviceType: this.deviceType,
      frameRate: this.frameRate,
      frameRateHistory: [...this.frameRateHistory],
      animationLevel: this.animationLevel,
      performanceMode: this.performanceMode,
      performanceIssues: this.performanceIssues
    };
  }
}

export default GameEngine;