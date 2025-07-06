/**
 * KONIVRER Deck Database - Adaptive AI Opponent Service
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

// Elements in KONIVRER
export enum ELEMENTS {
  FIRE = '🜂',
  WATER = '🜄',
  EARTH = '🜃',
  AIR = '🜁',
  AETHER = '⭘',
  NETHER = '▢',
  GENERIC = '✡︎⃝'
}

// Keywords in KONIVRER
export enum KEYWORDS {
  AMALGAM = 'Amalgam',
  BRILLIANCE = 'Brilliance',
  GUST = 'Gust',
  INFERNO = 'Inferno',
  STEADFAST = 'Steadfast',
  SUBMERGED = 'Submerged',
  QUINTESSENCE = 'Quintessence',
  VOID = 'Void'
}

// Game phase types
export type GamePhase = 'start' | 'draw' | 'main' | 'combat' | 'post-combat' | 'end';

// Card types
export interface Card {
  id: string;
  name: string;
  cost: number;
  type: string;
  elements: string[];
  rarity: string;
  power?: number;
  health?: number;
  text?: string;
  keywords?: string[];
  effects?: CardEffect[];
  imageUrl?: string;
  [key: string]: any;
}

export interface CardEffect {
  type: string;
  value?: number | string;
  target?: string;
  condition?: string;
  [key: string]: any;
}

// Player state
export interface PlayerState {
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
  [key: string]: any;
}

// Game state
export interface GameState {
  turn: number;
  phase: GamePhase;
  activePlayer: number;
  players: PlayerState[];
  stack: any[];
  attackers: Card[];
  blockers: Record<string, Card[]>;
  winner: number | null;
  gameOver: boolean;
  [key: string]: any;
}

// Player action
export interface PlayerAction {
  type: string;
  player: number;
  cardId?: string;
  targetId?: string;
  azothIds?: string[];
  params?: any;
  timestamp: number;
  [key: string]: any;
}

// AI decision
export interface AIDecision {
  type: string;
  cardId?: string;
  targetId?: string;
  azothIds?: string[];
  params?: any;
  confidence: number;
  reasoning: string[];
  [key: string]: any;
}

// Learning data
export interface LearningData {
  playerDeckProfile: {
    archetypes: Record<string, number>;
    elementDistribution: Record<string, number>;
    keyCards: string[];
    playPatterns: string[];
    [key: string]: any;
  };
  playerPlayStyle: {
    aggressionLevel: number;
    controlTendency: number;
    comboAffinity: number;
    riskTolerance: number;
    [key: string]: any;
  };
  matchHistory: {
    playerActions: PlayerAction[];
    aiDecisions: AIDecision[];
    gameResult: 'win' | 'loss' | 'draw';
    [key: string]: any;
  }[];
  cardPerformance: Record<string, {
    playCount: number;
    winRate: number;
    effectivenessScore: number;
    [key: string]: any;
  }>;
  [key: string]: any;
}

// Strategy profile
export interface StrategyProfile {
  name: string;
  description: string;
  aggressionLevel: number;
  controlTendency: number;
  comboAffinity: number;
  riskTolerance: number;
  elementPreferences: Record<string, number>;
  cardPreferences: Record<string, number>;
  counterStrategies: Record<string, number>;
  [key: string]: any;
}

/**
 * Adaptive AI Opponent class that learns from player actions
 */
class AdaptiveAI {
  private gameState: GameState;
  private playerHistory: PlayerAction[];
  private aiHistory: AIDecision[];
  private learningData: LearningData;
  private currentStrategy: StrategyProfile;
  private adaptationRate: number;
  private explorationRate: number;
  private aiPlayerId: number;
  private opponentId: number;
  private turnStartTime: number;
  private decisionTime: number;
  private initialized: boolean;
  private difficultyLevel: number;
  private predefinedStrategies: Record<string, StrategyProfile>;

  constructor() {
    // Initialize AI state
    this.reset();
  }

  /**
   * Reset the AI state for a new game
   */
  reset(): void {
    // Game state tracking
    this.gameState = {
      turn: 1,
      phase: 'start',
      activePlayer: 0,
      players: [],
      stack: [],
      attackers: [],
      blockers: {},
      winner: null,
      gameOver: false
    };
    
    // Action history
    this.playerHistory = [];
    this.aiHistory = [];
    
    // Learning data (persists between games)
    if (!this.learningData) {
      this.learningData = {
        playerDeckProfile: {
          archetypes: {},
          elementDistribution: {},
          keyCards: [],
          playPatterns: []
        },
        playerPlayStyle: {
          aggressionLevel: 0.5,
          controlTendency: 0.5,
          comboAffinity: 0.5,
          riskTolerance: 0.5
        },
        matchHistory: [],
        cardPerformance: {}
      };
    }
    
    // Current strategy
    this.currentStrategy = this.getDefaultStrategy();
    
    // Learning parameters
    this.adaptationRate = 0.2; // How quickly AI adapts to player's style
    this.explorationRate = 0.1; // Chance to try new strategies
    
    // Player IDs
    this.aiPlayerId = 1; // Default AI is player 2
    this.opponentId = 0; // Default human is player 1
    
    // Timing
    this.turnStartTime = 0;
    this.decisionTime = 1000; // Default decision time in ms
    
    // Initialization flag
    this.initialized = false;
    
    // Difficulty level (0-1)
    this.difficultyLevel = 0.5;
    
    // Predefined strategies
    this.predefinedStrategies = this.initializePredefinedStrategies();
  }

  /**
   * Initialize predefined strategies
   */
  private initializePredefinedStrategies(): Record<string, StrategyProfile> {
    return {
      'aggressive': {
        name: 'Aggressive',
        description: 'Focuses on dealing damage quickly with low-cost creatures and direct damage spells',
        aggressionLevel: 0.8,
        controlTendency: 0.2,
        comboAffinity: 0.3,
        riskTolerance: 0.7,
        elementPreferences: {
          [ELEMENTS.FIRE]: 0.8,
          [ELEMENTS.AIR]: 0.6,
          [ELEMENTS.EARTH]: 0.4,
          [ELEMENTS.WATER]: 0.3,
          [ELEMENTS.AETHER]: 0.4,
          [ELEMENTS.NETHER]: 0.5
        },
        cardPreferences: {},
        counterStrategies: {
          'control': 0.4,
          'combo': 0.7,
          'midrange': 0.6,
          'aggressive': 0.5
        }
      },
      'control': {
        name: 'Control',
        description: 'Focuses on countering opponent\'s plays and winning through card advantage',
        aggressionLevel: 0.2,
        controlTendency: 0.8,
        comboAffinity: 0.4,
        riskTolerance: 0.3,
        elementPreferences: {
          [ELEMENTS.WATER]: 0.8,
          [ELEMENTS.EARTH]: 0.5,
          [ELEMENTS.FIRE]: 0.3,
          [ELEMENTS.AIR]: 0.4,
          [ELEMENTS.AETHER]: 0.6,
          [ELEMENTS.NETHER]: 0.7
        },
        cardPreferences: {},
        counterStrategies: {
          'aggressive': 0.7,
          'combo': 0.5,
          'midrange': 0.6,
          'control': 0.5
        }
      },
      'midrange': {
        name: 'Midrange',
        description: 'Balances between aggression and control, playing efficient creatures',
        aggressionLevel: 0.5,
        controlTendency: 0.5,
        comboAffinity: 0.4,
        riskTolerance: 0.5,
        elementPreferences: {
          [ELEMENTS.EARTH]: 0.8,
          [ELEMENTS.FIRE]: 0.5,
          [ELEMENTS.WATER]: 0.5,
          [ELEMENTS.AIR]: 0.5,
          [ELEMENTS.AETHER]: 0.5,
          [ELEMENTS.NETHER]: 0.4
        },
        cardPreferences: {},
        counterStrategies: {
          'aggressive': 0.6,
          'control': 0.4,
          'combo': 0.6,
          'midrange': 0.5
        }
      },
      'combo': {
        name: 'Combo',
        description: 'Focuses on assembling specific card combinations for powerful effects',
        aggressionLevel: 0.3,
        controlTendency: 0.4,
        comboAffinity: 0.9,
        riskTolerance: 0.6,
        elementPreferences: {
          [ELEMENTS.AETHER]: 0.8,
          [ELEMENTS.NETHER]: 0.7,
          [ELEMENTS.WATER]: 0.6,
          [ELEMENTS.AIR]: 0.5,
          [ELEMENTS.FIRE]: 0.3,
          [ELEMENTS.EARTH]: 0.4
        },
        cardPreferences: {},
        counterStrategies: {
          'aggressive': 0.3,
          'control': 0.4,
          'midrange': 0.6,
          'combo': 0.5
        }
      },
      'tempo': {
        name: 'Tempo',
        description: 'Focuses on controlling the pace of the game while applying pressure',
        aggressionLevel: 0.6,
        controlTendency: 0.6,
        comboAffinity: 0.3,
        riskTolerance: 0.5,
        elementPreferences: {
          [ELEMENTS.AIR]: 0.8,
          [ELEMENTS.WATER]: 0.7,
          [ELEMENTS.FIRE]: 0.5,
          [ELEMENTS.EARTH]: 0.4,
          [ELEMENTS.AETHER]: 0.4,
          [ELEMENTS.NETHER]: 0.3
        },
        cardPreferences: {},
        counterStrategies: {
          'aggressive': 0.5,
          'control': 0.6,
          'midrange': 0.5,
          'combo': 0.7
        }
      }
    };
  }

  /**
   * Get default strategy
   */
  private getDefaultStrategy(): StrategyProfile {
    return {
      name: 'Balanced',
      description: 'Balanced strategy that adapts to the game state',
      aggressionLevel: 0.5,
      controlTendency: 0.5,
      comboAffinity: 0.5,
      riskTolerance: 0.5,
      elementPreferences: {
        [ELEMENTS.FIRE]: 0.5,
        [ELEMENTS.WATER]: 0.5,
        [ELEMENTS.EARTH]: 0.5,
        [ELEMENTS.AIR]: 0.5,
        [ELEMENTS.AETHER]: 0.5,
        [ELEMENTS.NETHER]: 0.5
      },
      cardPreferences: {},
      counterStrategies: {
        'aggressive': 0.5,
        'control': 0.5,
        'midrange': 0.5,
        'combo': 0.5,
        'tempo': 0.5
      }
    };
  }

  /**
   * Initialize the AI with game state
   */
  initialize(gameState: GameState, aiPlayerId: number = 1): void {
    this.gameState = { ...gameState };
    this.aiPlayerId = aiPlayerId;
    this.opponentId = aiPlayerId === 0 ? 1 : 0;
    this.initialized = true;
    
    // Analyze opponent's deck
    this.analyzeOpponentDeck();
    
    // Select initial strategy based on opponent's deck
    this.selectInitialStrategy();
  }

  /**
   * Set difficulty level (0-1)
   */
  setDifficultyLevel(level: number): void {
    this.difficultyLevel = Math.max(0, Math.min(1, level));
    
    // Adjust learning parameters based on difficulty
    this.adaptationRate = 0.1 + (this.difficultyLevel * 0.3); // 0.1 to 0.4
    this.explorationRate = 0.2 - (this.difficultyLevel * 0.15); // 0.2 to 0.05
    
    // Adjust decision time based on difficulty
    this.decisionTime = 2000 - (this.difficultyLevel * 1500); // 2000ms to 500ms
  }

  /**
   * Update game state
   */
  updateGameState(gameState: GameState): void {
    const previousState = { ...this.gameState };
    this.gameState = { ...gameState };
    
    // Check for new player actions
    if (previousState.turn !== gameState.turn || previousState.phase !== gameState.phase) {
      this.processStateChange(previousState);
    }
  }

  /**
   * Process state change to learn from player actions
   */
  private processStateChange(previousState: GameState): void {
    // Only process if it was the opponent's turn
    if (previousState.activePlayer === this.opponentId) {
      // Extract player actions by comparing states
      const actions = this.extractPlayerActions(previousState, this.gameState);
      
      // Add actions to history
      this.playerHistory.push(...actions);
      
      // Learn from actions
      this.learnFromActions(actions);
    }
  }

  /**
   * Extract player actions by comparing game states
   */
  private extractPlayerActions(previousState: GameState, currentState: GameState): PlayerAction[] {
    const actions: PlayerAction[] = [];
    const player = previousState.players[this.opponentId];
    const newPlayer = currentState.players[this.opponentId];
    
    // Check for cards played (cards that moved from hand to field)
    const previousHand = new Set(player.hand.map(card => card.id));
    const currentHand = new Set(newPlayer.hand.map(card => card.id));
    const previousField = new Set(player.field.map(card => card.id));
    const currentField = new Set(newPlayer.field.map(card => card.id));
    
    // Find cards that left hand
    const cardsLeftHand = [...previousHand].filter(id => !currentHand.has(id));
    
    // Find cards that entered field
    const cardsEnteredField = [...currentField].filter(id => !previousField.has(id));
    
    // Match cards that moved from hand to field
    cardsLeftHand.forEach(cardId => {
      if (cardsEnteredField.includes(cardId)) {
        // Card was played from hand to field
        actions.push({
          type: 'playCard',
          player: this.opponentId,
          cardId,
          timestamp: Date.now()
        });
      }
    });
    
    // Check for attacks
    if (previousState.phase === 'combat' && currentState.attackers.length > 0) {
      actions.push({
        type: 'attack',
        player: this.opponentId,
        params: {
          attackers: currentState.attackers.map(card => card.id)
        },
        timestamp: Date.now()
      });
    }
    
    // Check for azoth played
    const previousAzoth = new Set(player.azothRow.map(card => card.id));
    const currentAzoth = new Set(newPlayer.azothRow.map(card => card.id));
    
    const newAzoth = [...currentAzoth].filter(id => !previousAzoth.has(id));
    
    newAzoth.forEach(cardId => {
      actions.push({
        type: 'playAzoth',
        player: this.opponentId,
        cardId,
        timestamp: Date.now()
      });
    });
    
    return actions;
  }

  /**
   * Learn from player actions
   */
  private learnFromActions(actions: PlayerAction[]): void {
    if (actions.length === 0) return;
    
    // Update player play style based on actions
    actions.forEach(action => {
      switch (action.type) {
        case 'playCard':
          this.updatePlayStyleFromCardPlay(action);
          break;
        case 'attack':
          this.updatePlayStyleFromAttack(action);
          break;
        case 'block':
          this.updatePlayStyleFromBlock(action);
          break;
        default:
          // Other action types
          break;
      }
    });
    
    // Adjust strategy based on updated play style
    this.adjustStrategy();
  }

  /**
   * Update player play style from card play action
   */
  private updatePlayStyleFromCardPlay(action: PlayerAction): void {
    const { cardId } = action;
    if (!cardId) return;
    
    // Find the card
    const card = this.findCardById(cardId);
    if (!card) return;
    
    // Update play style based on card type
    if (card.type === 'familiar') {
      // Playing creatures tends to be more aggressive
      this.learningData.playerPlayStyle.aggressionLevel = 
        this.weightedAverage(
          this.learningData.playerPlayStyle.aggressionLevel,
          0.6,
          this.adaptationRate
        );
      
      // Check for combo pieces
      if (card.text && (card.text.includes('combo') || card.text.includes('when you play'))) {
        this.learningData.playerPlayStyle.comboAffinity = 
          this.weightedAverage(
            this.learningData.playerPlayStyle.comboAffinity,
            0.7,
            this.adaptationRate
          );
      }
    } else if (card.type === 'spell') {
      // Check spell type
      if (card.text) {
        if (card.text.includes('counter') || card.text.includes('return')) {
          // Control spells
          this.learningData.playerPlayStyle.controlTendency = 
            this.weightedAverage(
              this.learningData.playerPlayStyle.controlTendency,
              0.8,
              this.adaptationRate
            );
        } else if (card.text.includes('damage') || card.text.includes('destroy')) {
          // Removal spells
          this.learningData.playerPlayStyle.aggressionLevel = 
            this.weightedAverage(
              this.learningData.playerPlayStyle.aggressionLevel,
              0.6,
              this.adaptationRate
            );
        } else if (card.text.includes('draw') || card.text.includes('search')) {
          // Card advantage spells
          this.learningData.playerPlayStyle.controlTendency = 
            this.weightedAverage(
              this.learningData.playerPlayStyle.controlTendency,
              0.7,
              this.adaptationRate
            );
        }
      }
    }
    
    // Update element distribution
    if (card.elements) {
      card.elements.forEach(element => {
        if (!this.learningData.playerDeckProfile.elementDistribution[element]) {
          this.learningData.playerDeckProfile.elementDistribution[element] = 0;
        }
        this.learningData.playerDeckProfile.elementDistribution[element]++;
      });
    }
  }

  /**
   * Update player play style from attack action
   */
  private updatePlayStyleFromAttack(action: PlayerAction): void {
    const { params } = action;
    if (!params || !params.attackers || params.attackers.length === 0) return;
    
    // Attacking with many creatures is aggressive
    const attackerCount = params.attackers.length;
    const availableCreatures = this.gameState.players[this.opponentId].field.filter(
      card => !card.tapped && card.type === 'familiar'
    ).length;
    
    // Calculate attack ratio (0-1)
    const attackRatio = availableCreatures > 0 ? attackerCount / availableCreatures : 0;
    
    // Update aggression level based on attack ratio
    this.learningData.playerPlayStyle.aggressionLevel = 
      this.weightedAverage(
        this.learningData.playerPlayStyle.aggressionLevel,
        attackRatio,
        this.adaptationRate
      );
    
    // Attacking with everything is risky
    if (attackRatio > 0.8) {
      this.learningData.playerPlayStyle.riskTolerance = 
        this.weightedAverage(
          this.learningData.playerPlayStyle.riskTolerance,
          0.8,
          this.adaptationRate
        );
    }
  }

  /**
   * Update player play style from block action
   */
  private updatePlayStyleFromBlock(action: PlayerAction): void {
    const { params } = action;
    if (!params || !params.blockers || Object.keys(params.blockers).length === 0) return;
    
    // Blocking a lot is defensive
    const blockerCount = Object.keys(params.blockers).length;
    const availableBlockers = this.gameState.players[this.opponentId].field.filter(
      card => !card.tapped && card.type === 'familiar'
    ).length;
    
    // Calculate block ratio (0-1)
    const blockRatio = availableBlockers > 0 ? blockerCount / availableBlockers : 0;
    
    // Update control tendency based on block ratio
    this.learningData.playerPlayStyle.controlTendency = 
      this.weightedAverage(
        this.learningData.playerPlayStyle.controlTendency,
        blockRatio,
        this.adaptationRate
      );
    
    // Not blocking is risky
    if (blockRatio < 0.2 && this.gameState.attackers.length > 0) {
      this.learningData.playerPlayStyle.riskTolerance = 
        this.weightedAverage(
          this.learningData.playerPlayStyle.riskTolerance,
          0.8,
          this.adaptationRate
        );
    }
  }

  /**
   * Adjust strategy based on player play style
   */
  private adjustStrategy(): void {
    // Determine if we should explore a new strategy
    if (Math.random() < this.explorationRate) {
      // Randomly select a predefined strategy
      const strategies = Object.values(this.predefinedStrategies);
      this.currentStrategy = { ...strategies[Math.floor(Math.random() * strategies.length)] };
      return;
    }
    
    // Find the best counter strategy based on player's play style
    const playerStyle = this.learningData.playerPlayStyle;
    
    // Calculate similarity scores with predefined strategies
    const scores: Record<string, number> = {};
    
    Object.entries(this.predefinedStrategies).forEach(([name, strategy]) => {
      // Calculate how well this strategy counters the player's style
      let counterScore = 0;
      
      // Aggressive players are countered by control strategies
      if (playerStyle.aggressionLevel > 0.6) {
        counterScore += strategy.controlTendency * 2;
      }
      
      // Control players are countered by aggressive or combo strategies
      if (playerStyle.controlTendency > 0.6) {
        counterScore += strategy.aggressionLevel + strategy.comboAffinity;
      }
      
      // Combo players are countered by aggressive or control strategies
      if (playerStyle.comboAffinity > 0.6) {
        counterScore += strategy.aggressionLevel + strategy.controlTendency;
      }
      
      // Match risk tolerance
      const riskDiff = Math.abs(playerStyle.riskTolerance - strategy.riskTolerance);
      counterScore -= riskDiff;
      
      scores[name] = counterScore;
    });
    
    // Find the strategy with the highest score
    const bestStrategy = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)[0][0];
    
    // Gradually shift toward the best strategy
    const targetStrategy = this.predefinedStrategies[bestStrategy];
    
    // Blend current strategy with target strategy
    this.currentStrategy = {
      ...this.currentStrategy,
      name: targetStrategy.name,
      description: targetStrategy.description,
      aggressionLevel: this.weightedAverage(
        this.currentStrategy.aggressionLevel,
        targetStrategy.aggressionLevel,
        this.adaptationRate
      ),
      controlTendency: this.weightedAverage(
        this.currentStrategy.controlTendency,
        targetStrategy.controlTendency,
        this.adaptationRate
      ),
      comboAffinity: this.weightedAverage(
        this.currentStrategy.comboAffinity,
        targetStrategy.comboAffinity,
        this.adaptationRate
      ),
      riskTolerance: this.weightedAverage(
        this.currentStrategy.riskTolerance,
        targetStrategy.riskTolerance,
        this.adaptationRate
      )
    };
    
    // Update element preferences based on player's deck
    Object.keys(this.currentStrategy.elementPreferences).forEach(element => {
      // Prefer elements that counter the player's most used elements
      const counterElement = this.getCounterElement(element);
      const playerUsage = this.learningData.playerDeckProfile.elementDistribution[counterElement] || 0;
      
      if (playerUsage > 0) {
        this.currentStrategy.elementPreferences[element] = this.weightedAverage(
          this.currentStrategy.elementPreferences[element],
          0.8,
          this.adaptationRate
        );
      }
    });
  }

  /**
   * Get counter element
   */
  private getCounterElement(element: string): string {
    const counterMap: Record<string, string> = {
      [ELEMENTS.FIRE]: ELEMENTS.WATER,
      [ELEMENTS.WATER]: ELEMENTS.EARTH,
      [ELEMENTS.EARTH]: ELEMENTS.AIR,
      [ELEMENTS.AIR]: ELEMENTS.FIRE,
      [ELEMENTS.AETHER]: ELEMENTS.NETHER,
      [ELEMENTS.NETHER]: ELEMENTS.AETHER
    };
    
    return counterMap[element] || element;
  }

  /**
   * Calculate weighted average
   */
  private weightedAverage(currentValue: number, newValue: number, weight: number): number {
    return (currentValue * (1 - weight)) + (newValue * weight);
  }

  /**
   * Analyze opponent's deck
   */
  private analyzeOpponentDeck(): void {
    const opponentDeck = this.gameState.players[this.opponentId].deck;
    
    // Reset element distribution
    this.learningData.playerDeckProfile.elementDistribution = {};
    
    // Count elements
    opponentDeck.forEach(card => {
      if (card.elements) {
        card.elements.forEach(element => {
          if (!this.learningData.playerDeckProfile.elementDistribution[element]) {
            this.learningData.playerDeckProfile.elementDistribution[element] = 0;
          }
          this.learningData.playerDeckProfile.elementDistribution[element]++;
        });
      }
    });
    
    // Identify key cards
    this.learningData.playerDeckProfile.keyCards = opponentDeck
      .filter(card => card.rarity === 'rare' || card.rarity === 'mythic')
      .map(card => card.id);
    
    // Determine archetypes
    const archetypes: Record<string, number> = {
      'aggressive': 0,
      'control': 0,
      'midrange': 0,
      'combo': 0,
      'tempo': 0
    };
    
    // Count cards that fit each archetype
    opponentDeck.forEach(card => {
      if (card.type === 'familiar') {
        // Creature analysis
        const power = card.power || 0;
        const health = card.health || 0;
        const cost = card.cost || 0;
        
        if (cost <= 3 && power >= health) {
          archetypes['aggressive'] += 1;
        }
        
        if (cost >= 4 && health >= power) {
          archetypes['midrange'] += 1;
        }
        
        if (card.text && (card.text.includes('draw') || card.text.includes('counter'))) {
          archetypes['control'] += 1;
        }
        
        if (card.text && (card.text.includes('combo') || card.text.includes('when you play'))) {
          archetypes['combo'] += 1;
        }
        
        if (card.keywords && (card.keywords.includes('evasion') || card.keywords.includes('rush'))) {
          archetypes['tempo'] += 1;
        }
      } else if (card.type === 'spell') {
        // Spell analysis
        if (card.text) {
          if (card.text.includes('damage') || card.text.includes('destroy')) {
            archetypes['aggressive'] += 0.5;
            archetypes['midrange'] += 0.5;
          }
          
          if (card.text.includes('counter') || card.text.includes('return')) {
            archetypes['control'] += 1;
            archetypes['tempo'] += 0.5;
          }
          
          if (card.text.includes('draw') || card.text.includes('search')) {
            archetypes['control'] += 0.5;
            archetypes['combo'] += 0.5;
          }
        }
      }
    });
    
    // Normalize archetype scores
    const totalScore = Object.values(archetypes).reduce((sum, score) => sum + score, 0);
    if (totalScore > 0) {
      Object.keys(archetypes).forEach(archetype => {
        archetypes[archetype] /= totalScore;
      });
    }
    
    this.learningData.playerDeckProfile.archetypes = archetypes;
  }

  /**
   * Select initial strategy based on opponent's deck
   */
  private selectInitialStrategy(): void {
    const archetypes = this.learningData.playerDeckProfile.archetypes;
    
    // Find the dominant archetype
    let dominantArchetype = 'midrange';
    let highestScore = 0;
    
    Object.entries(archetypes).forEach(([archetype, score]) => {
      if (score > highestScore) {
        highestScore = score;
        dominantArchetype = archetype;
      }
    });
    
    // Select a counter strategy
    const counterStrategies: Record<string, string> = {
      'aggressive': 'control',
      'control': 'combo',
      'midrange': 'aggressive',
      'combo': 'aggressive',
      'tempo': 'midrange'
    };
    
    const counterStrategy = counterStrategies[dominantArchetype] || 'midrange';
    
    // Set initial strategy
    this.currentStrategy = { ...this.predefinedStrategies[counterStrategy] };
  }

  /**
   * Make a decision based on the current game state
   */
  makeDecision(): AIDecision {
    if (!this.initialized || !this.gameState) {
      return {
        type: 'pass',
        confidence: 1.0,
        reasoning: ['AI not initialized']
      };
    }
    
    // Record turn start time
    this.turnStartTime = Date.now();
    
    // Check if it's AI's turn
    if (this.gameState.activePlayer !== this.aiPlayerId) {
      // Only make decisions during opponent's turn if we need to respond
      if (this.needsResponse()) {
        return this.makeResponseDecision();
      }
      return {
        type: 'pass',
        confidence: 1.0,
        reasoning: ['Not AI\'s turn']
      };
    }
    
    // Generate possible actions
    const possibleActions = this.generatePossibleActions();
    
    // Evaluate actions
    const evaluatedActions = this.evaluateActions(possibleActions);
    
    // Select best action
    const selectedAction = this.selectBestAction(evaluatedActions);
    
    // Apply error factor based on difficulty
    const finalAction = this.applyErrorFactor(selectedAction);
    
    // Add to decision history
    this.aiHistory.push(finalAction);
    
    // Simulate thinking time
    this.simulateThinkingTime();
    
    return finalAction;
  }

  /**
   * Check if AI needs to respond during opponent's turn
   */
  private needsResponse(): boolean {
    // Check if there's something on the stack that needs a response
    if (this.gameState.stack && this.gameState.stack.length > 0) {
      return true;
    }
    
    // Check if we're in combat and need to declare blockers
    if (this.gameState.phase === 'combat' && 
        this.gameState.activePlayer !== this.aiPlayerId &&
        this.gameState.attackers && 
        this.gameState.attackers.length > 0) {
      return true;
    }
    
    return false;
  }

  /**
   * Make a response decision during opponent's turn
   */
  private makeResponseDecision(): AIDecision {
    // Check if we need to declare blockers
    if (this.gameState.phase === 'combat' && 
        this.gameState.attackers && 
        this.gameState.attackers.length > 0) {
      return this.makeBlockingDecision();
    }
    
    // Check if we need to respond to something on the stack
    if (this.gameState.stack && this.gameState.stack.length > 0) {
      return this.makeStackResponseDecision();
    }
    
    // Default to passing
    return {
      type: 'pass',
      confidence: 1.0,
      reasoning: ['No response needed']
    };
  }

  /**
   * Make a blocking decision
   */
  private makeBlockingDecision(): AIDecision {
    const aiPlayer = this.gameState.players[this.aiPlayerId];
    const attackers = this.gameState.attackers;
    const availableBlockers = aiPlayer.field.filter(card => 
      !card.tapped && card.type === 'familiar'
    );
    
    // If no blockers available, we must pass
    if (availableBlockers.length === 0) {
      return {
        type: 'pass',
        confidence: 1.0,
        reasoning: ['No blockers available']
      };
    }
    
    // Analyze attackers and determine optimal blocking strategy
    const blockingAssignments: Record<string, string[]> = {};
    const blockedAttackers = new Set<string>();
    const reasoning: string[] = [];
    
    // Sort attackers by threat level
    const sortedAttackers = [...attackers].sort((a, b) => {
      // Prioritize high power attackers
      return (b.power || 0) - (a.power || 0);
    });
    
    // Sort blockers by expendability
    const sortedBlockers = [...availableBlockers].sort((a, b) => {
      // Prioritize low value blockers
      return this.calculateCardValue(a) - this.calculateCardValue(b);
    });
    
    // Assign blockers to attackers
    for (const attacker of sortedAttackers) {
      // Skip if already blocked
      if (blockedAttackers.has(attacker.id)) continue;
      
      // Find suitable blocker
      for (let i = 0; i < sortedBlockers.length; i++) {
        const blocker = sortedBlockers[i];
        
        // Check if blocker can survive or trade favorably
        const blockerPower = blocker.power || 0;
        const blockerHealth = blocker.health || 0;
        const attackerPower = attacker.power || 0;
        const attackerHealth = attacker.health || 0;
        
        // Favorable trade: blocker survives or kills a more valuable attacker
        const favorableTrade = 
          (blockerHealth > attackerPower) || 
          (blockerPower >= attackerHealth && 
           this.calculateCardValue(attacker) > this.calculateCardValue(blocker));
        
        // Check if we should block based on strategy
        const shouldBlock = this.shouldBlock(attacker, blocker, favorableTrade);
        
        if (shouldBlock) {
          if (!blockingAssignments[attacker.id]) {
            blockingAssignments[attacker.id] = [];
          }
          
          blockingAssignments[attacker.id].push(blocker.id);
          blockedAttackers.add(attacker.id);
          sortedBlockers.splice(i, 1); // Remove blocker from available list
          
          reasoning.push(`Assigned ${blocker.name} to block ${attacker.name}`);
          
          break;
        }
      }
    }
    
    // If no blocks assigned, we pass
    if (Object.keys(blockingAssignments).length === 0) {
      return {
        type: 'pass',
        confidence: 0.8,
        reasoning: ['No favorable blocks available', 'Taking damage is preferable to losing valuable blockers']
      };
    }
    
    return {
      type: 'block',
      params: {
        player: this.aiPlayerId,
        blockers: blockingAssignments
      },
      confidence: 0.9,
      reasoning
    };
  }

  /**
   * Decide whether to block an attacker with a blocker
   */
  private shouldBlock(attacker: Card, blocker: Card, favorableTrade: boolean): boolean {
    // Always block if it's a favorable trade
    if (favorableTrade) return true;
    
    // Check if we're at critical life cards
    const aiPlayer = this.gameState.players[this.aiPlayerId];
    const criticalLifeCards = aiPlayer.lifeCards.length <= 2;
    
    // Block based on strategy
    const { aggressionLevel, controlTendency, riskTolerance } = this.currentStrategy;
    
    // More aggressive AIs are less likely to block
    if (aggressionLevel > 0.7 && !criticalLifeCards) {
      return false;
    }
    
    // More controlling AIs are more likely to block
    if (controlTendency > 0.7) {
      return true;
    }
    
    // Risk tolerance affects willingness to take damage
    if (riskTolerance < 0.4 || criticalLifeCards) {
      return true;
    }
    
    // Default: block if attacker power is high
    return (attacker.power || 0) >= 3;
  }

  /**
   * Make a decision in response to something on the stack
   */
  private makeStackResponseDecision(): AIDecision {
    // Implementation would handle responses to spells and abilities
    // For now, we'll just pass
    return {
      type: 'pass',
      confidence: 0.7,
      reasoning: ['No response cards available']
    };
  }

  /**
   * Generate possible actions
   */
  private generatePossibleActions(): AIDecision[] {
    const actions: AIDecision[] = [];
    const aiPlayer = this.gameState.players[this.aiPlayerId];
    
    // Check current phase
    switch (this.gameState.phase) {
      case 'start':
      case 'draw':
        // Usually just pass in these phases
        actions.push({
          type: 'nextPhase',
          confidence: 1.0,
          reasoning: ['Automatic phase']
        });
        break;
        
      case 'main':
        // Play cards from hand
        aiPlayer.hand.forEach(card => {
          if (card.cost <= aiPlayer.azothAvailable) {
            switch (card.type) {
              case 'familiar':
                actions.push({
                  type: 'playCard',
                  cardId: card.id,
                  confidence: 0.7,
                  reasoning: [`Can play ${card.name} (${card.cost} cost)`]
                });
                break;
                
              case 'spell':
                // For each spell, consider different targeting options
                const targets = this.getPotentialSpellTargets(card);
                targets.forEach(targetId => {
                  actions.push({
                    type: 'playCard',
                    cardId: card.id,
                    targetId,
                    confidence: 0.7,
                    reasoning: [`Can cast ${card.name} targeting ${targetId || 'nothing'}`]
                  });
                });
                break;
                
              case 'azoth':
                if (aiPlayer.azothUsedThisTurn < 1) { // Assuming 1 Azoth per turn limit
                  actions.push({
                    type: 'playAzoth',
                    cardId: card.id,
                    confidence: 0.8,
                    reasoning: [`Can play ${card.name} as Azoth`]
                  });
                }
                break;
            }
          }
        });
        
        // Attack planning happens in main phase
        if (aiPlayer.field.some(card => !card.tapped && !card.summoningSickness)) {
          actions.push({
            type: 'nextPhase',
            confidence: 0.6,
            reasoning: ['Can move to combat phase to attack']
          });
        } else {
          actions.push({
            type: 'nextPhase',
            confidence: 0.9,
            reasoning: ['No attackers available, should advance phase']
          });
        }
        break;
        
      case 'combat':
        // Declare attackers
        const potentialAttackers = aiPlayer.field.filter(
          card => !card.tapped && !card.summoningSickness && card.type === 'familiar'
        );
        
        if (potentialAttackers.length > 0) {
          // Generate different attack configurations
          const attackConfigurations = this.generateAttackConfigurations(potentialAttackers);
          
          attackConfigurations.forEach(attackers => {
            actions.push({
              type: 'attack',
              params: {
                attackers: attackers.map(a => a.id)
              },
              confidence: 0.7,
              reasoning: [`Can attack with ${attackers.map(a => a.name).join(', ')}`]
            });
          });
        }
        
        // Always include option to skip attack
        actions.push({
          type: 'nextPhase',
          confidence: 0.5,
          reasoning: ['Can skip attack phase']
        });
        break;
        
      case 'post-combat':
      case 'end':
        // Usually just pass in these phases
        actions.push({
          type: 'nextPhase',
          confidence: 1.0,
          reasoning: ['Should advance to next phase/turn']
        });
        break;
    }
    
    // Always include passing as an option
    actions.push({
      type: 'pass',
      confidence: 0.3,
      reasoning: ['Can pass and do nothing']
    });
    
    return actions;
  }

  /**
   * Get potential targets for a spell
   */
  private getPotentialSpellTargets(card: Card): string[] {
    const targets: string[] = [''];  // Empty string means no target
    
    if (!card.text) return targets;
    
    const aiPlayer = this.gameState.players[this.aiPlayerId];
    const opponentPlayer = this.gameState.players[this.opponentId];
    
    // Simple implementation based on card text
    if (card.text.includes('damage') || card.text.includes('destroy')) {
      // Target opponent's creatures
      opponentPlayer.field.forEach(target => {
        if (target.type === 'familiar') {
          targets.push(target.id);
        }
      });
      
      // Target opponent
      targets.push(`player${this.opponentId}`);
    } else if (card.text.includes('boost') || card.text.includes('heal')) {
      // Target own creatures
      aiPlayer.field.forEach(target => {
        if (target.type === 'familiar') {
          targets.push(target.id);
        }
      });
      
      // Target self
      targets.push(`player${this.aiPlayerId}`);
    }
    
    return targets;
  }

  /**
   * Generate different attack configurations
   */
  private generateAttackConfigurations(potentialAttackers: Card[]): Card[][] {
    const configurations: Card[][] = [];
    
    // Always include the option to attack with everything
    if (potentialAttackers.length > 0) {
      configurations.push([...potentialAttackers]);
    }
    
    // Include option to attack with only high power creatures
    const highPowerAttackers = potentialAttackers.filter(card => (card.power || 0) >= 3);
    if (highPowerAttackers.length > 0 && highPowerAttackers.length !== potentialAttackers.length) {
      configurations.push(highPowerAttackers);
    }
    
    // Include option to attack with only evasive creatures
    const evasiveAttackers = potentialAttackers.filter(card => 
      card.keywords?.includes(KEYWORDS.GUST)
    );
    if (evasiveAttackers.length > 0 && evasiveAttackers.length !== potentialAttackers.length) {
      configurations.push(evasiveAttackers);
    }
    
    // Include individual attackers if we have multiple
    if (potentialAttackers.length > 1) {
      potentialAttackers.forEach(attacker => {
        configurations.push([attacker]);
      });
    }
    
    return configurations;
  }

  /**
   * Evaluate actions based on current strategy
   */
  private evaluateActions(actions: AIDecision[]): AIDecision[] {
    return actions.map(action => {
      let score = action.confidence;
      
      // Adjust score based on strategy
      switch (action.type) {
        case 'playCard':
          score = this.evaluatePlayCardAction(action, score);
          break;
        case 'attack':
          score = this.evaluateAttackAction(action, score);
          break;
        case 'nextPhase':
          // Higher score for advancing phases when we have no good plays
          if (actions.filter(a => a.type === 'playCard' || a.type === 'attack').length === 0) {
            score += 0.2;
          }
          break;
      }
      
      return {
        ...action,
        confidence: Math.min(1.0, Math.max(0.1, score))
      };
    });
  }

  /**
   * Evaluate play card action
   */
  private evaluatePlayCardAction(action: AIDecision, baseScore: number): number {
    const { cardId, targetId } = action;
    if (!cardId) return baseScore;
    
    const card = this.findCardById(cardId);
    if (!card) return baseScore;
    
    let score = baseScore;
    
    // Adjust based on strategy
    const { aggressionLevel, controlTendency, comboAffinity, elementPreferences } = this.currentStrategy;
    
    // Adjust based on card type
    if (card.type === 'familiar') {
      // Aggressive AI prefers creatures
      score += aggressionLevel * 0.2;
      
      // Adjust based on creature stats
      const power = card.power || 0;
      const health = card.health || 0;
      
      if (power > health) {
        // Aggressive creature
        score += aggressionLevel * 0.1;
      } else if (health > power) {
        // Defensive creature
        score += controlTendency * 0.1;
      }
      
      // Adjust based on keywords
      if (card.keywords) {
        if (card.keywords.includes(KEYWORDS.GUST)) {
          // Evasive creatures are good for aggressive strategies
          score += aggressionLevel * 0.2;
        }
        if (card.keywords.includes(KEYWORDS.STEADFAST)) {
          // Defensive creatures are good for control strategies
          score += controlTendency * 0.2;
        }
      }
    } else if (card.type === 'spell') {
      // Control AI prefers spells
      score += controlTendency * 0.2;
      
      // Adjust based on spell type
      if (card.text) {
        if (card.text.includes('damage') || card.text.includes('destroy')) {
          // Removal is good for control
          score += controlTendency * 0.2;
          
          // Check if targeting a high-value creature
          if (targetId) {
            const target = this.findCardById(targetId);
            if (target) {
              score += this.calculateCardValue(target) * 0.05;
            }
          }
        } else if (card.text.includes('counter') || card.text.includes('return')) {
          // Countermagic is good for control
          score += controlTendency * 0.3;
        } else if (card.text.includes('draw') || card.text.includes('search')) {
          // Card advantage is good for combo and control
          score += (controlTendency + comboAffinity) * 0.15;
        }
      }
    }
    
    // Adjust based on element preferences
    if (card.elements) {
      card.elements.forEach(element => {
        if (elementPreferences[element]) {
          score += elementPreferences[element] * 0.1;
        }
      });
    }
    
    return score;
  }

  /**
   * Evaluate attack action
   */
  private evaluateAttackAction(action: AIDecision, baseScore: number): number {
    const { params } = action;
    if (!params || !params.attackers || params.attackers.length === 0) return baseScore;
    
    let score = baseScore;
    
    // Adjust based on strategy
    const { aggressionLevel, controlTendency, riskTolerance } = this.currentStrategy;
    
    // Aggressive AI prefers attacking
    score += aggressionLevel * 0.3;
    
    // Control AI prefers keeping blockers
    score -= controlTendency * 0.2;
    
    // Risk tolerance affects willingness to attack
    score += riskTolerance * 0.2;
    
    // Evaluate potential blocks
    const attackers = params.attackers.map(id => this.findCardById(id)).filter(Boolean) as Card[];
    const opponentBlockers = this.gameState.players[this.opponentId].field.filter(
      card => !card.tapped && card.type === 'familiar'
    );
    
    // Calculate potential damage
    let potentialDamage = 0;
    let riskyAttackers = 0;
    
    attackers.forEach(attacker => {
      const power = attacker.power || 0;
      const health = attacker.health || 0;
      
      // Check if attacker has evasion
      const hasEvasion = attacker.keywords?.includes(KEYWORDS.GUST);
      
      if (hasEvasion || opponentBlockers.length === 0) {
        // Unblockable damage
        potentialDamage += power;
      } else {
        // Check if there's a favorable block
        const canBeBlockedFavorably = opponentBlockers.some(blocker => 
          (blocker.power || 0) >= health && (blocker.health || 0) > (attacker.power || 0)
        );
        
        if (canBeBlockedFavorably) {
          riskyAttackers++;
        } else {
          potentialDamage += power;
        }
      }
    });
    
    // Adjust score based on potential damage
    score += potentialDamage * 0.05;
    
    // Penalize risky attacks
    score -= riskyAttackers * (1 - riskTolerance) * 0.1;
    
    // Bonus for lethal attack
    const opponentLifeCards = this.gameState.players[this.opponentId].lifeCards.length;
    if (potentialDamage >= opponentLifeCards) {
      score += 0.5;
    }
    
    return score;
  }

  /**
   * Select the best action from evaluated actions
   */
  private selectBestAction(evaluatedActions: AIDecision[]): AIDecision {
    // Sort by confidence
    const sortedActions = [...evaluatedActions].sort((a, b) => b.confidence - a.confidence);
    
    // Get the best action
    const bestAction = sortedActions[0];
    
    if (!bestAction) {
      // Default to passing if no actions available
      return {
        type: 'pass',
        confidence: 1.0,
        reasoning: ['No actions available']
      };
    }
    
    return bestAction;
  }

  /**
   * Apply error factor based on difficulty
   */
  private applyErrorFactor(decision: AIDecision): AIDecision {
    // Higher difficulty means fewer errors
    const errorChance = 0.3 - (this.difficultyLevel * 0.3); // 0.3 to 0
    
    if (Math.random() < errorChance) {
      // Make a suboptimal decision
      return {
        type: 'pass',
        confidence: 0.3,
        reasoning: ['Made a mistake due to difficulty level']
      };
    }
    
    return decision;
  }

  /**
   * Simulate thinking time
   */
  private simulateThinkingTime(): void {
    // No actual delay in code execution
    // In a real implementation, this would add a delay based on decisionTime
  }

  /**
   * Calculate the value of a card
   */
  private calculateCardValue(card: Card): number {
    if (!card) return 0;
    
    let value = 0;
    
    // Base value from cost
    value += card.cost * 1.5;
    
    // Value from stats
    if (card.type === 'familiar') {
      value += (card.power || 0) + (card.health || 0);
    }
    
    // Value from keywords
    if (card.keywords) {
      for (const keyword of card.keywords) {
        switch (keyword) {
          case KEYWORDS.GUST:
            value += 1.5;
            break;
          case KEYWORDS.STEADFAST:
            value += 1.5;
            break;
          case KEYWORDS.INFERNO:
            value += 2;
            break;
          case KEYWORDS.SUBMERGED:
            value += 1.5;
            break;
          default:
            value += 0.5;
        }
      }
    }
    
    // Value from effects
    if (card.text) {
      if (card.text.includes('draw')) value += 1.5;
      if (card.text.includes('damage')) value += 1;
      if (card.text.includes('counter')) value += 2;
    }
    
    return value;
  }

  /**
   * Find a card by ID in the game state
   */
  private findCardById(cardId: string): Card | null {
    if (!cardId) return null;
    
    // Check if it's a player reference
    if (cardId.startsWith('player')) {
      const playerIndex = parseInt(cardId.replace('player', ''), 10);
      return {
        id: cardId,
        name: `Player ${playerIndex + 1}`,
        type: 'player',
        cost: 0,
        elements: [],
        rarity: ''
      };
    }
    
    // Search all zones for the card
    for (const player of this.gameState.players) {
      // Check all zones
      for (const zone of ['field', 'hand', 'azothRow', 'graveyard', 'removedZone', 'lifeCards', 'deck']) {
        const card = player[zone]?.find((c: Card) => c.id === cardId);
        if (card) return card;
      }
    }
    
    return null;
  }

  /**
   * Record game result
   */
  recordGameResult(result: 'win' | 'loss' | 'draw'): void {
    // Store match history
    this.learningData.matchHistory.push({
      playerActions: this.playerHistory,
      aiDecisions: this.aiHistory,
      gameResult: result
    });
    
    // Update card performance
    this.aiHistory.forEach(decision => {
      if (decision.cardId) {
        if (!this.learningData.cardPerformance[decision.cardId]) {
          this.learningData.cardPerformance[decision.cardId] = {
            playCount: 0,
            winRate: 0,
            effectivenessScore: 0
          };
        }
        
        const performance = this.learningData.cardPerformance[decision.cardId];
        performance.playCount++;
        
        // Update win rate
        const oldWins = performance.winRate * (performance.playCount - 1);
        const newWin = result === 'win' ? 1 : result === 'draw' ? 0.5 : 0;
        performance.winRate = (oldWins + newWin) / performance.playCount;
      }
    });
    
    // Reset for next game
    this.playerHistory = [];
    this.aiHistory = [];
  }

  /**
   * Get current strategy
   */
  getCurrentStrategy(): StrategyProfile {
    return { ...this.currentStrategy };
  }

  /**
   * Get learning data
   */
  getLearningData(): LearningData {
    return { ...this.learningData };
  }

  /**
   * Save learning data to storage
   */
  saveLearningData(): string {
    const data = JSON.stringify(this.learningData);
    
    // In a real implementation, this would save to localStorage or a server
    return data;
  }

  /**
   * Load learning data from storage
   */
  loadLearningData(data: string): boolean {
    try {
      this.learningData = JSON.parse(data);
      return true;
    } catch (error) {
      console.error('Error loading learning data:', error);
      return false;
    }
  }
}

// Create singleton instance
const adaptiveAI = new AdaptiveAI();

export default adaptiveAI;