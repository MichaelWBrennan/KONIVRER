/**
 * KONIVRER Deck Database - AI Opponent Service
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

// AI difficulty levels
export enum AI_DIFFICULTY {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert'
}

// AI personality types
export enum AI_PERSONALITY {
  AGGRESSIVE = 'aggressive',
  DEFENSIVE = 'defensive',
  BALANCED = 'balanced',
  CONTROL = 'control',
  COMBO = 'combo'
}

// AI deck archetypes
export enum AI_ARCHETYPES {
  FIRE_AGGRO = 'fire_aggro',
  WATER_CONTROL = 'water_control',
  EARTH_MIDRANGE = 'earth_midrange',
  AIR_TEMPO = 'air_tempo',
  VOID_COMBO = 'void_combo',
  MULTI_COLOR = 'multi_color'
}

// Game state interfaces
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
  [key: string]: any;
}

interface CardEffect {
  type: string;
  trigger?: string;
  target?: string;
  value?: any;
  condition?: string;
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
  stack: any[];
  attackers: Card[];
  blockers: Record<string, Card>;
  winner: number | null;
  gameOver: boolean;
  [key: string]: any;
}

// AI decision interfaces
interface Decision {
  type: string;
  params: any;
  confidence: number;
  reasoning: string[];
}

interface ActionEvaluation {
  action: string;
  params: any;
  score: number;
  reasoning: string[];
}

interface GameAnalysis {
  boardAdvantage: number;
  resourceAdvantage: number;
  handAdvantage: number;
  lifeCardAdvantage: number;
  tempo: number;
  threatLevel: number;
  opportunities: Opportunity[];
  threats: Threat[];
}

interface Opportunity {
  type: string;
  cards: Card[];
  score: number;
  description: string;
}

interface Threat {
  type: string;
  cards: Card[];
  score: number;
  description: string;
}

interface AIConfig {
  difficulty: AI_DIFFICULTY;
  personality: AI_PERSONALITY;
  decisionSpeed: number;
  errorRate: number;
  aggressionLevel: number;
  memoryFactor: number;
  adaptabilityFactor: number;
  riskTolerance: number;
  valueWeights: {
    boardPresence: number;
    cardAdvantage: number;
    lifeCards: number;
    azothEfficiency: number;
    tempo: number;
    [key: string]: number;
  };
}

interface GameMemory {
  playerDeckProfile: {
    cardFrequency: Record<string, number>;
    elementDistribution: Record<string, number>;
    averageCost: number;
    keyCards: string[];
    playPatterns: string[];
    [key: string]: any;
  };
  playHistory: {
    turn: number;
    phase: string;
    action: string;
    cards: string[];
    result: string;
    [key: string]: any;
  }[];
  counterPlays: {
    situation: string;
    response: string;
    success: boolean;
    [key: string]: any;
  }[];
}

/**
 * AI Opponent class that handles AI decision making
 */
class AIOpponent {
  private difficulty: AI_DIFFICULTY;
  private personality: AI_PERSONALITY;
  private decisionSpeed: number;
  private errorRate: number;
  private aggressionLevel: number;
  private memoryFactor: number;
  private adaptabilityFactor: number;
  private riskTolerance: number;
  private valueWeights: Record<string, number>;
  private gameMemory: GameMemory;
  private gameState: GameState | null;
  private aiPlayerId: number;
  private decisionHistory: Decision[];
  private turnStartTime: number;
  private config: AIConfig;

  constructor(difficulty: AI_DIFFICULTY = AI_DIFFICULTY.MEDIUM, personality: AI_PERSONALITY = AI_PERSONALITY.BALANCED) {
    this.difficulty = difficulty;
    this.personality = personality;
    
    // Initialize AI configuration
    this.decisionSpeed = this._getDecisionSpeed();
    this.errorRate = this._getErrorRate();
    this.aggressionLevel = this._getAggressionLevel();
    this.memoryFactor = this._getMemoryFactor();
    this.adaptabilityFactor = this._getAdaptabilityFactor();
    this.riskTolerance = this._getRiskTolerance();
    this.valueWeights = this._getValueWeights();
    
    // Initialize game memory
    this.gameMemory = {
      playerDeckProfile: {
        cardFrequency: {},
        elementDistribution: {},
        averageCost: 0,
        keyCards: [],
        playPatterns: []
      },
      playHistory: [],
      counterPlays: []
    };
    
    // Initialize other properties
    this.gameState = null;
    this.aiPlayerId = 1; // Default AI is player 2
    this.decisionHistory = [];
    this.turnStartTime = 0;
    
    // Store complete config for reference
    this.config = {
      difficulty,
      personality,
      decisionSpeed: this.decisionSpeed,
      errorRate: this.errorRate,
      aggressionLevel: this.aggressionLevel,
      memoryFactor: this.memoryFactor,
      adaptabilityFactor: this.adaptabilityFactor,
      riskTolerance: this.riskTolerance,
      valueWeights: this.valueWeights
    };
  }

  /**
   * Set the current game state
   */
  setGameState(state: GameState, aiPlayerId: number = 1): void {
    this.gameState = { ...state };
    this.aiPlayerId = aiPlayerId;
    
    // Update game memory with new information
    this._updateGameMemory();
  }

  /**
   * Make a decision based on the current game state
   */
  makeDecision(): Decision | null {
    if (!this.gameState) {
      return null;
    }
    
    // Record turn start time
    this.turnStartTime = Date.now();
    
    // Check if it's AI's turn
    if (this.gameState.activePlayer !== this.aiPlayerId) {
      // Only make decisions during opponent's turn if we need to respond
      if (this._needsResponse()) {
        return this._makeResponseDecision();
      }
      return null;
    }
    
    // Analyze the game state
    const analysis = this._analyzeGameState();
    
    // Generate possible actions
    const possibleActions = this._generatePossibleActions();
    
    // Evaluate each action
    const evaluatedActions = this._evaluateActions(possibleActions, analysis);
    
    // Select the best action
    const selectedAction = this._selectBestAction(evaluatedActions);
    
    // Apply error factor based on difficulty
    const finalAction = this._applyErrorFactor(selectedAction);
    
    // Add to decision history
    this.decisionHistory.push(finalAction);
    
    // Simulate thinking time
    this._simulateThinkingTime();
    
    return finalAction;
  }

  /**
   * Check if AI needs to respond during opponent's turn
   */
  private _needsResponse(): boolean {
    if (!this.gameState) return false;
    
    // Check if there's something on the stack that needs a response
    if (this.gameState.stack && this.gameState.stack.length > 0) {
      const topStackItem = this.gameState.stack[this.gameState.stack.length - 1];
      // Check if the top stack item is controlled by the opponent
      if (topStackItem.controller !== this.aiPlayerId) {
        return true;
      }
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
  private _makeResponseDecision(): Decision {
    if (!this.gameState) {
      return {
        type: 'pass',
        params: {},
        confidence: 1.0,
        reasoning: ['No game state available']
      };
    }
    
    // Check if we need to declare blockers
    if (this.gameState.phase === 'combat' && 
        this.gameState.attackers && 
        this.gameState.attackers.length > 0) {
      return this._makeBlockingDecision();
    }
    
    // Check if we need to respond to something on the stack
    if (this.gameState.stack && this.gameState.stack.length > 0) {
      return this._makeStackResponseDecision();
    }
    
    // Default to passing
    return {
      type: 'pass',
      params: {},
      confidence: 1.0,
      reasoning: ['No response needed']
    };
  }

  /**
   * Make a blocking decision
   */
  private _makeBlockingDecision(): Decision {
    if (!this.gameState) {
      return {
        type: 'pass',
        params: {},
        confidence: 1.0,
        reasoning: ['No game state available']
      };
    }
    
    const aiPlayer = this.gameState.players[this.aiPlayerId];
    const attackers = this.gameState.attackers;
    const availableBlockers = aiPlayer.field.filter(card => !card.tapped);
    
    // If no blockers available, we must pass
    if (availableBlockers.length === 0) {
      return {
        type: 'pass',
        params: {},
        confidence: 1.0,
        reasoning: ['No blockers available']
      };
    }
    
    // Analyze attackers and determine optimal blocking strategy
    const blockingAssignments: { blockerId: string; attackerId: string }[] = [];
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
      return this._calculateCardValue(a) - this._calculateCardValue(b);
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
           this._calculateCardValue(attacker) > this._calculateCardValue(blocker));
        
        // Check if we should block based on personality and game state
        const shouldBlock = this._shouldBlock(attacker, blocker, favorableTrade);
        
        if (shouldBlock) {
          blockingAssignments.push({
            blockerId: blocker.id,
            attackerId: attacker.id
          });
          
          blockedAttackers.add(attacker.id);
          sortedBlockers.splice(i, 1); // Remove blocker from available list
          
          reasoning.push(`Assigned ${blocker.name} to block ${attacker.name}`);
          
          break;
        }
      }
    }
    
    // If no blocks assigned, we pass
    if (blockingAssignments.length === 0) {
      return {
        type: 'pass',
        params: {},
        confidence: 0.8,
        reasoning: ['No favorable blocks available', 'Taking damage is preferable to losing valuable blockers']
      };
    }
    
    return {
      type: 'declareBlockers',
      params: {
        player: this.aiPlayerId,
        blocks: blockingAssignments
      },
      confidence: 0.9,
      reasoning
    };
  }

  /**
   * Decide whether to block an attacker with a blocker
   */
  private _shouldBlock(attacker: Card, blocker: Card, favorableTrade: boolean): boolean {
    // Always block if it's a favorable trade
    if (favorableTrade) return true;
    
    // Check if we're at critical life cards
    const aiPlayer = this.gameState!.players[this.aiPlayerId];
    const criticalLifeCards = aiPlayer.lifeCards.length <= 2;
    
    // Block based on personality
    switch (this.personality) {
      case AI_PERSONALITY.AGGRESSIVE:
        // Aggressive AI preserves creatures for attacking
        return criticalLifeCards || (attacker.power || 0) >= 3;
        
      case AI_PERSONALITY.DEFENSIVE:
        // Defensive AI blocks more often
        return true;
        
      case AI_PERSONALITY.CONTROL:
        // Control AI preserves valuable blockers
        return criticalLifeCards || this._calculateCardValue(blocker) < this._calculateCardValue(attacker);
        
      case AI_PERSONALITY.COMBO:
        // Combo AI preserves combo pieces
        return !blocker.keywords?.includes('combo') && !blocker.keywords?.includes('engine');
        
      case AI_PERSONALITY.BALANCED:
      default:
        // Balanced AI makes reasonable trades
        return criticalLifeCards || (attacker.power || 0) >= 2;
    }
  }

  /**
   * Make a decision in response to something on the stack
   */
  private _makeStackResponseDecision(): Decision {
    // Implementation would handle responses to spells and abilities
    // For now, we'll just pass
    return {
      type: 'pass',
      params: {},
      confidence: 0.7,
      reasoning: ['No response cards available']
    };
  }

  /**
   * Analyze the current game state
   */
  private _analyzeGameState(): GameAnalysis {
    if (!this.gameState) {
      return {
        boardAdvantage: 0,
        resourceAdvantage: 0,
        handAdvantage: 0,
        lifeCardAdvantage: 0,
        tempo: 0,
        threatLevel: 0,
        opportunities: [],
        threats: []
      };
    }
    
    const aiPlayer = this.gameState.players[this.aiPlayerId];
    const opponentPlayer = this.gameState.players[1 - this.aiPlayerId];
    
    // Calculate board advantage
    const aiBoardValue = aiPlayer.field.reduce((total, card) => total + this._calculateCardValue(card), 0);
    const opponentBoardValue = opponentPlayer.field.reduce((total, card) => total + this._calculateCardValue(card), 0);
    const boardAdvantage = aiBoardValue - opponentBoardValue;
    
    // Calculate resource advantage
    const aiResources = aiPlayer.azothAvailable;
    const opponentResources = opponentPlayer.azothAvailable;
    const resourceAdvantage = aiResources - opponentResources;
    
    // Calculate hand advantage
    const handAdvantage = aiPlayer.hand.length - opponentPlayer.hand.length;
    
    // Calculate life card advantage
    const lifeCardAdvantage = aiPlayer.lifeCards.length - opponentPlayer.lifeCards.length;
    
    // Calculate tempo (based on initiative and board development)
    const tempo = (this.gameState.activePlayer === this.aiPlayerId ? 1 : -1) * 
                 (aiBoardValue - opponentBoardValue + resourceAdvantage);
    
    // Calculate threat level
    const threatLevel = this._calculateThreatLevel(opponentPlayer);
    
    // Identify opportunities
    const opportunities = this._identifyOpportunities(aiPlayer, opponentPlayer);
    
    // Identify threats
    const threats = this._identifyThreats(aiPlayer, opponentPlayer);
    
    return {
      boardAdvantage,
      resourceAdvantage,
      handAdvantage,
      lifeCardAdvantage,
      tempo,
      threatLevel,
      opportunities,
      threats
    };
  }

  /**
   * Calculate the value of a card
   */
  private _calculateCardValue(card: Card): number {
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
          case 'rush':
            value += 1;
            break;
          case 'guard':
            value += 1.5;
            break;
          case 'lifesteal':
            value += 2;
            break;
          case 'deathtouch':
            value += 2;
            break;
          case 'evasion':
            value += 1.5;
            break;
          default:
            value += 0.5;
        }
      }
    }
    
    // Value from effects
    if (card.effects && card.effects.length > 0) {
      value += card.effects.length * 0.5;
    }
    
    return value;
  }

  /**
   * Calculate the threat level of the opponent
   */
  private _calculateThreatLevel(opponentPlayer: Player): number {
    let threatLevel = 0;
    
    // Threat from board
    opponentPlayer.field.forEach(card => {
      threatLevel += (card.power || 0) * 1.5;
      
      // Additional threat from keywords
      if (card.keywords) {
        if (card.keywords.includes('rush')) threatLevel += 2;
        if (card.keywords.includes('deathtouch')) threatLevel += 3;
        if (card.keywords.includes('evasion')) threatLevel += 2;
      }
    });
    
    // Threat from hand size
    threatLevel += opponentPlayer.hand.length * 0.5;
    
    // Threat from resources
    threatLevel += opponentPlayer.azothAvailable * 0.7;
    
    return threatLevel;
  }

  /**
   * Identify opportunities in the current game state
   */
  private _identifyOpportunities(aiPlayer: Player, opponentPlayer: Player): Opportunity[] {
    const opportunities: Opportunity[] = [];
    
    // Check for lethal attack opportunity
    const totalAttackPower = aiPlayer.field
      .filter(card => !card.tapped && !card.summoningSickness)
      .reduce((total, card) => total + (card.power || 0), 0);
    
    if (totalAttackPower >= opponentPlayer.lifeCards.length) {
      opportunities.push({
        type: 'lethal_attack',
        cards: aiPlayer.field.filter(card => !card.tapped && !card.summoningSickness),
        score: 10,
        description: 'Potential lethal attack available'
      });
    }
    
    // Check for favorable trades
    opponentPlayer.field.forEach(oppCard => {
      aiPlayer.field.forEach(aiCard => {
        if (!aiCard.tapped && 
            (aiCard.power || 0) >= (oppCard.health || 0) && 
            (aiCard.health || 0) > (oppCard.power || 0)) {
          opportunities.push({
            type: 'favorable_trade',
            cards: [aiCard],
            score: this._calculateCardValue(oppCard) - this._calculateCardValue(aiCard) + 2,
            description: `${aiCard.name} can favorably trade with ${oppCard.name}`
          });
        }
      });
    });
    
    // Check for powerful cards we can play
    const playableCards = aiPlayer.hand.filter(card => 
      card.cost <= aiPlayer.azothAvailable
    );
    
    playableCards.forEach(card => {
      opportunities.push({
        type: 'play_card',
        cards: [card],
        score: this._calculateCardValue(card) * 0.8,
        description: `Can play ${card.name} from hand`
      });
    });
    
    return opportunities.sort((a, b) => b.score - a.score);
  }

  /**
   * Identify threats in the current game state
   */
  private _identifyThreats(aiPlayer: Player, opponentPlayer: Player): Threat[] {
    const threats: Threat[] = [];
    
    // Check for opponent's threatening creatures
    opponentPlayer.field.forEach(card => {
      if ((card.power || 0) >= 3) {
        threats.push({
          type: 'high_power_creature',
          cards: [card],
          score: (card.power || 0) * 0.8,
          description: `${card.name} threatens significant damage`
        });
      }
      
      // Check for special keywords
      if (card.keywords) {
        if (card.keywords.includes('deathtouch') || 
            card.keywords.includes('lifesteal') ||
            card.keywords.includes('evasion')) {
          threats.push({
            type: 'keyword_threat',
            cards: [card],
            score: this._calculateCardValue(card) * 0.7,
            description: `${card.name} has threatening keywords`
          });
        }
      }
    });
    
    // Check for low life cards
    if (aiPlayer.lifeCards.length <= 2) {
      threats.push({
        type: 'low_life',
        cards: [],
        score: (3 - aiPlayer.lifeCards.length) * 3,
        description: 'Critically low life cards'
      });
    }
    
    // Check for opponent's large hand
    if (opponentPlayer.hand.length >= 5) {
      threats.push({
        type: 'card_advantage',
        cards: [],
        score: opponentPlayer.hand.length - aiPlayer.hand.length,
        description: 'Opponent has significant card advantage'
      });
    }
    
    return threats.sort((a, b) => b.score - a.score);
  }

  /**
   * Generate possible actions based on the current game state
   */
  private _generatePossibleActions(): ActionEvaluation[] {
    if (!this.gameState) {
      return [];
    }
    
    const actions: ActionEvaluation[] = [];
    const aiPlayer = this.gameState.players[this.aiPlayerId];
    const opponentPlayer = this.gameState.players[1 - this.aiPlayerId];
    
    // Check current phase
    switch (this.gameState.phase) {
      case 'start':
        // Usually just pass in start phase
        actions.push({
          action: 'nextPhase',
          params: {},
          score: 10,
          reasoning: ['Start phase has automatic actions']
        });
        break;
        
      case 'main':
        // Play cards from hand
        aiPlayer.hand.forEach(card => {
          if (card.cost <= aiPlayer.azothAvailable) {
            switch (card.type) {
              case 'familiar':
                actions.push({
                  action: 'summonFamiliar',
                  params: {
                    player: this.aiPlayerId,
                    cardId: card.id,
                    azothIds: this._selectAzothForPayment(card.cost)
                  },
                  score: this._evaluatePlayCard(card),
                  reasoning: [`Can play ${card.name} (${card.cost} cost)`]
                });
                break;
                
              case 'spell':
                // For each spell, consider different targeting options
                const targets = this._getPotentialSpellTargets(card);
                targets.forEach(targetList => {
                  actions.push({
                    action: 'castSpell',
                    params: {
                      player: this.aiPlayerId,
                      cardId: card.id,
                      azothIds: this._selectAzothForPayment(card.cost),
                      targets: targetList
                    },
                    score: this._evaluatePlayCard(card, targetList),
                    reasoning: [`Can cast ${card.name} targeting ${targetList.join(', ') || 'nothing'}`]
                  });
                });
                break;
                
              case 'azoth':
                if (aiPlayer.azothUsedThisTurn < 1) { // Assuming 1 Azoth per turn limit
                  actions.push({
                    action: 'playAzoth',
                    params: {
                      player: this.aiPlayerId,
                      cardId: card.id
                    },
                    score: 8 - aiPlayer.azothRow.length, // Higher priority when we have fewer Azoth
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
            action: 'nextPhase',
            params: {},
            score: 5, // Medium priority to move to combat
            reasoning: ['Can move to combat phase to attack']
          });
        } else {
          actions.push({
            action: 'nextPhase',
            params: {},
            score: 9, // High priority if we can't attack
            reasoning: ['No attackers available, should advance phase']
          });
        }
        break;
        
      case 'combat':
        // Declare attackers
        const potentialAttackers = aiPlayer.field.filter(
          card => !card.tapped && !card.summoningSickness
        );
        
        if (potentialAttackers.length > 0) {
          // Generate different attack configurations
          const attackConfigurations = this._generateAttackConfigurations(potentialAttackers);
          
          attackConfigurations.forEach(attackers => {
            actions.push({
              action: 'declareAttackers',
              params: {
                player: this.aiPlayerId,
                cardIds: attackers.map(a => a.id)
              },
              score: this._evaluateAttack(attackers),
              reasoning: [`Can attack with ${attackers.map(a => a.name).join(', ')}`]
            });
          });
        }
        
        // Always include option to skip attack
        actions.push({
          action: 'nextPhase',
          params: {},
          score: 3, // Low priority to skip attack
          reasoning: ['Can skip attack phase']
        });
        break;
        
      case 'post-combat':
      case 'end':
        // Usually just pass in these phases
        actions.push({
          action: 'nextPhase',
          params: {},
          score: 10,
          reasoning: ['Should advance to next phase/turn']
        });
        break;
    }
    
    // Always include passing as an option
    actions.push({
      action: 'pass',
      params: {},
      score: 1, // Lowest priority
      reasoning: ['Can pass and do nothing']
    });
    
    return actions;
  }

  /**
   * Select Azoth cards for payment
   */
  private _selectAzothForPayment(cost: number): string[] {
    if (!this.gameState) return [];
    
    const aiPlayer = this.gameState.players[this.aiPlayerId];
    const availableAzoth = aiPlayer.azothRow.filter(card => !card.tapped);
    
    if (availableAzoth.length < cost) {
      return []; // Not enough Azoth
    }
    
    // Simple implementation: just take the first N Azoth cards
    return availableAzoth.slice(0, cost).map(card => card.id);
  }

  /**
   * Get potential targets for a spell
   */
  private _getPotentialSpellTargets(card: Card): string[][] {
    if (!this.gameState) return [[]];
    
    const aiPlayer = this.gameState.players[this.aiPlayerId];
    const opponentPlayer = this.gameState.players[1 - this.aiPlayerId];
    const targets: string[][] = [];
    
    // Default empty target (for spells that don't need targets)
    targets.push([]);
    
    // Simple implementation based on card text/effects
    if (card.text?.includes('damage') || card.text?.includes('destroy')) {
      // Target opponent's creatures
      opponentPlayer.field.forEach(target => {
        targets.push([target.id]);
      });
      
      // Target opponent
      targets.push([`player${1 - this.aiPlayerId}`]);
    } else if (card.text?.includes('boost') || card.text?.includes('heal')) {
      // Target own creatures
      aiPlayer.field.forEach(target => {
        targets.push([target.id]);
      });
      
      // Target self
      targets.push([`player${this.aiPlayerId}`]);
    } else if (card.text?.includes('draw') || card.text?.includes('search')) {
      // No targets needed for self-effects
      targets.push([]);
    }
    
    return targets;
  }

  /**
   * Evaluate playing a card
   */
  private _evaluatePlayCard(card: Card, targets: string[] = []): number {
    if (!this.gameState) return 0;
    
    let score = 0;
    
    // Base score from card value
    score += this._calculateCardValue(card);
    
    // Adjust based on game state
    const analysis = this._analyzeGameState();
    
    switch (card.type) {
      case 'familiar':
        // Higher value when behind on board
        if (analysis.boardAdvantage < 0) {
          score += Math.abs(analysis.boardAdvantage) * 0.5;
        }
        
        // Higher value for defensive cards when threatened
        if (analysis.threatLevel > 5 && card.keywords?.includes('guard')) {
          score += 2;
        }
        break;
        
      case 'spell':
        // Evaluate based on targets
        if (targets.length > 0) {
          targets.forEach(targetId => {
            if (targetId.startsWith('player')) {
              // Targeting a player
              const playerIndex = parseInt(targetId.replace('player', ''));
              if (playerIndex !== this.aiPlayerId) {
                // Targeting opponent
                score += 2;
                
                // Higher value when opponent is low on life cards
                const opponentLifeCards = this.gameState!.players[playerIndex].lifeCards.length;
                if (opponentLifeCards <= 2) {
                  score += (3 - opponentLifeCards) * 2;
                }
              }
            } else {
              // Targeting a card
              const targetCard = this._findCardById(targetId);
              if (targetCard) {
                if (card.text?.includes('damage') || card.text?.includes('destroy')) {
                  // Removal spell
                  score += this._calculateCardValue(targetCard) * 0.7;
                } else if (card.text?.includes('boost') || card.text?.includes('heal')) {
                  // Buff spell
                  score += this._calculateCardValue(targetCard) * 0.3;
                }
              }
            }
          });
        } else {
          // Non-targeted spell
          if (card.text?.includes('draw')) {
            // Card draw is more valuable when hand is small
            const aiPlayer = this.gameState.players[this.aiPlayerId];
            score += Math.max(0, 5 - aiPlayer.hand.length);
          }
        }
        break;
        
      case 'azoth':
        // Azoth is more valuable early game
        score += Math.max(0, 10 - this.gameState.turn);
        
        // Azoth is more valuable when we have few
        const aiPlayer = this.gameState.players[this.aiPlayerId];
        score += Math.max(0, 5 - aiPlayer.azothRow.length) * 2;
        break;
    }
    
    // Adjust based on personality
    switch (this.personality) {
      case AI_PERSONALITY.AGGRESSIVE:
        if (card.type === 'familiar' && (card.power || 0) >= 2) {
          score += 2;
        }
        break;
        
      case AI_PERSONALITY.DEFENSIVE:
        if (card.type === 'familiar' && (card.health || 0) >= 3) {
          score += 2;
        }
        break;
        
      case AI_PERSONALITY.CONTROL:
        if (card.type === 'spell' && (card.text?.includes('damage') || card.text?.includes('destroy'))) {
          score += 2;
        }
        break;
        
      case AI_PERSONALITY.COMBO:
        if (card.keywords?.includes('combo') || card.keywords?.includes('engine')) {
          score += 3;
        }
        break;
    }
    
    return score;
  }

  /**
   * Find a card by ID in the game state
   */
  private _findCardById(cardId: string): Card | null {
    if (!this.gameState) return null;
    
    for (const player of this.gameState.players) {
      // Check all zones
      for (const zone of ['field', 'hand', 'azothRow', 'graveyard', 'removedZone', 'lifeCards', 'deck']) {
        const card = player[zone].find((c: Card) => c.id === cardId);
        if (card) return card;
      }
    }
    
    return null;
  }

  /**
   * Generate different attack configurations
   */
  private _generateAttackConfigurations(potentialAttackers: Card[]): Card[][] {
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
      card.keywords?.includes('evasion') || card.keywords?.includes('flying')
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
   * Evaluate an attack configuration
   */
  private _evaluateAttack(attackers: Card[]): number {
    if (!this.gameState) return 0;
    
    let score = 0;
    const opponentPlayer = this.gameState.players[1 - this.aiPlayerId];
    const opponentBlockers = opponentPlayer.field.filter(card => !card.tapped);
    
    // Calculate total attack power
    const totalAttackPower = attackers.reduce((total, card) => total + (card.power || 0), 0);
    
    // Higher score if we can potentially deal lethal damage
    if (totalAttackPower >= opponentPlayer.lifeCards.length) {
      score += 10;
    }
    
    // Evaluate each attacker
    attackers.forEach(attacker => {
      const attackerPower = attacker.power || 0;
      const attackerHealth = attacker.health || 0;
      
      // Base score from attacker's power
      score += attackerPower * 0.5;
      
      // Check if attacker has evasion
      const hasEvasion = attacker.keywords?.includes('evasion') || attacker.keywords?.includes('flying');
      if (hasEvasion) {
        score += 2;
      }
      
      // Check potential blocks
      let worstBlockOutcome = 0; // 0 = unblocked, 1 = trade, 2 = bad trade
      
      for (const blocker of opponentBlockers) {
        const blockerPower = blocker.power || 0;
        const blockerHealth = blocker.health || 0;
        
        // Check if blocker can kill attacker
        if (blockerPower >= attackerHealth) {
          // Check if attacker can kill blocker
          if (attackerPower >= blockerHealth) {
            // Trade
            worstBlockOutcome = Math.max(worstBlockOutcome, 1);
          } else {
            // Bad trade
            worstBlockOutcome = 2;
            break;
          }
        }
      }
      
      // Adjust score based on worst possible block
      switch (worstBlockOutcome) {
        case 0: // Unblocked
          score += 3;
          break;
        case 1: // Trade
          score += 1;
          break;
        case 2: // Bad trade
          score -= 2;
          break;
      }
    });
    
    // Adjust based on personality
    switch (this.personality) {
      case AI_PERSONALITY.AGGRESSIVE:
        score += attackers.length * 0.5;
        break;
        
      case AI_PERSONALITY.DEFENSIVE:
        // Defensive AI is more cautious about attacking
        score -= attackers.length * 0.3;
        break;
        
      case AI_PERSONALITY.CONTROL:
        // Control AI prefers to keep blockers
        score -= attackers.length * 0.2;
        break;
    }
    
    // Adjust based on game state
    const analysis = this._analyzeGameState();
    
    // More aggressive when ahead
    if (analysis.boardAdvantage > 0) {
      score += 2;
    }
    
    // More cautious when behind
    if (analysis.boardAdvantage < -5) {
      score -= 3;
    }
    
    // More aggressive when opponent is low on life cards
    if (opponentPlayer.lifeCards.length <= 2) {
      score += 3;
    }
    
    return score;
  }

  /**
   * Evaluate all possible actions
   */
  private _evaluateActions(actions: ActionEvaluation[], analysis: GameAnalysis): ActionEvaluation[] {
    // Apply personality and game state adjustments to scores
    return actions.map(action => {
      let adjustedScore = action.score;
      
      // Adjust based on game state
      switch (action.action) {
        case 'summonFamiliar':
        case 'castSpell':
          // Playing cards is better when we have card advantage
          if (analysis.handAdvantage > 2) {
            adjustedScore += 1;
          }
          break;
          
        case 'declareAttackers':
          // Attacking is better when ahead on board
          if (analysis.boardAdvantage > 0) {
            adjustedScore += 1;
          }
          
          // Attacking is better when opponent is low on life
          if (this.gameState?.players[1 - this.aiPlayerId].lifeCards.length <= 2) {
            adjustedScore += 2;
          }
          break;
          
        case 'nextPhase':
          // Moving phases is better when we have no good plays
          if (actions.filter(a => a.action !== 'nextPhase' && a.action !== 'pass').length === 0) {
            adjustedScore += 3;
          }
          break;
      }
      
      // Apply personality modifiers
      switch (this.personality) {
        case AI_PERSONALITY.AGGRESSIVE:
          if (action.action === 'declareAttackers') {
            adjustedScore += 2;
          }
          break;
          
        case AI_PERSONALITY.DEFENSIVE:
          if (action.action === 'summonFamiliar' && 
              action.params.cardId && 
              this._findCardById(action.params.cardId)?.keywords?.includes('guard')) {
            adjustedScore += 2;
          }
          break;
          
        case AI_PERSONALITY.CONTROL:
          if (action.action === 'castSpell') {
            adjustedScore += 1;
          }
          break;
          
        case AI_PERSONALITY.COMBO:
          // Combo AI prioritizes card draw and combo pieces
          if (action.action === 'castSpell' && 
              action.params.cardId && 
              this._findCardById(action.params.cardId)?.text?.includes('draw')) {
            adjustedScore += 2;
          }
          break;
      }
      
      return {
        ...action,
        score: adjustedScore
      };
    });
  }

  /**
   * Select the best action from evaluated actions
   */
  private _selectBestAction(evaluatedActions: ActionEvaluation[]): Decision {
    // Sort by score
    const sortedActions = [...evaluatedActions].sort((a, b) => b.score - a.score);
    
    // Get the best action
    const bestAction = sortedActions[0];
    
    if (!bestAction) {
      // Default to passing if no actions available
      return {
        type: 'pass',
        params: {},
        confidence: 1.0,
        reasoning: ['No actions available']
      };
    }
    
    // Calculate confidence based on score difference with second best
    let confidence = 1.0;
    if (sortedActions.length > 1) {
      const scoreDiff = bestAction.score - sortedActions[1].score;
      confidence = Math.min(1.0, 0.5 + scoreDiff * 0.1);
    }
    
    return {
      type: bestAction.action,
      params: bestAction.params,
      confidence,
      reasoning: bestAction.reasoning
    };
  }

  /**
   * Apply error factor based on difficulty
   */
  private _applyErrorFactor(decision: Decision): Decision {
    // No errors at expert difficulty
    if (this.difficulty === AI_DIFFICULTY.EXPERT) {
      return decision;
    }
    
    // Chance to make an error based on difficulty and error rate
    const errorChance = this.errorRate;
    if (Math.random() < errorChance) {
      // Make a suboptimal decision
      return {
        type: 'pass',
        params: {},
        confidence: 0.3,
        reasoning: ['Made a mistake due to difficulty level']
      };
    }
    
    return decision;
  }

  /**
   * Simulate thinking time
   */
  private _simulateThinkingTime(): void {
    // No delay in code execution, this would be handled by the UI
    // In a real implementation, this would add a delay based on decisionSpeed
  }

  /**
   * Update game memory with new information
   */
  private _updateGameMemory(): void {
    if (!this.gameState) return;
    
    const opponentPlayer = this.gameState.players[1 - this.aiPlayerId];
    
    // Update card frequency
    opponentPlayer.field.forEach(card => {
      if (!this.gameMemory.playerDeckProfile.cardFrequency[card.name]) {
        this.gameMemory.playerDeckProfile.cardFrequency[card.name] = 0;
      }
      this.gameMemory.playerDeckProfile.cardFrequency[card.name]++;
      
      // Update element distribution
      card.elements.forEach(element => {
        if (!this.gameMemory.playerDeckProfile.elementDistribution[element]) {
          this.gameMemory.playerDeckProfile.elementDistribution[element] = 0;
        }
        this.gameMemory.playerDeckProfile.elementDistribution[element]++;
      });
    });
    
    // Record play patterns
    if (this.gameState.turnHistory && this.gameState.turnHistory.length > 0) {
      const lastAction = this.gameState.turnHistory[this.gameState.turnHistory.length - 1];
      if (lastAction.player !== this.aiPlayerId) {
        // Record opponent's action
        this.gameMemory.playHistory.push({
          turn: this.gameState.turn,
          phase: this.gameState.phase,
          action: lastAction.type,
          cards: lastAction.data.cardIds || [],
          result: 'unknown'
        });
      }
    }
  }

  /**
   * Get decision speed based on difficulty
   */
  private _getDecisionSpeed(): number {
    switch (this.difficulty) {
      case AI_DIFFICULTY.EASY:
        return 3000; // 3 seconds
      case AI_DIFFICULTY.MEDIUM:
        return 2000; // 2 seconds
      case AI_DIFFICULTY.HARD:
        return 1000; // 1 second
      case AI_DIFFICULTY.EXPERT:
        return 500; // 0.5 seconds
      default:
        return 2000;
    }
  }

  /**
   * Get error rate based on difficulty
   */
  private _getErrorRate(): number {
    switch (this.difficulty) {
      case AI_DIFFICULTY.EASY:
        return 0.3; // 30% chance to make an error
      case AI_DIFFICULTY.MEDIUM:
        return 0.15; // 15% chance
      case AI_DIFFICULTY.HARD:
        return 0.05; // 5% chance
      case AI_DIFFICULTY.EXPERT:
        return 0; // No errors
      default:
        return 0.15;
    }
  }

  /**
   * Get aggression level based on personality
   */
  private _getAggressionLevel(): number {
    switch (this.personality) {
      case AI_PERSONALITY.AGGRESSIVE:
        return 0.8; // Very aggressive
      case AI_PERSONALITY.DEFENSIVE:
        return 0.2; // Not aggressive
      case AI_PERSONALITY.BALANCED:
        return 0.5; // Balanced
      case AI_PERSONALITY.CONTROL:
        return 0.3; // Somewhat defensive
      case AI_PERSONALITY.COMBO:
        return 0.4; // Moderate
      default:
        return 0.5;
    }
  }

  /**
   * Get memory factor based on difficulty
   */
  private _getMemoryFactor(): number {
    switch (this.difficulty) {
      case AI_DIFFICULTY.EASY:
        return 0.2; // Poor memory
      case AI_DIFFICULTY.MEDIUM:
        return 0.5; // Moderate memory
      case AI_DIFFICULTY.HARD:
        return 0.8; // Good memory
      case AI_DIFFICULTY.EXPERT:
        return 1.0; // Perfect memory
      default:
        return 0.5;
    }
  }

  /**
   * Get adaptability factor based on difficulty
   */
  private _getAdaptabilityFactor(): number {
    switch (this.difficulty) {
      case AI_DIFFICULTY.EASY:
        return 0.2; // Barely adapts
      case AI_DIFFICULTY.MEDIUM:
        return 0.5; // Somewhat adapts
      case AI_DIFFICULTY.HARD:
        return 0.8; // Adapts well
      case AI_DIFFICULTY.EXPERT:
        return 1.0; // Adapts perfectly
      default:
        return 0.5;
    }
  }

  /**
   * Get risk tolerance based on personality
   */
  private _getRiskTolerance(): number {
    switch (this.personality) {
      case AI_PERSONALITY.AGGRESSIVE:
        return 0.8; // High risk tolerance
      case AI_PERSONALITY.DEFENSIVE:
        return 0.2; // Low risk tolerance
      case AI_PERSONALITY.BALANCED:
        return 0.5; // Moderate risk tolerance
      case AI_PERSONALITY.CONTROL:
        return 0.3; // Somewhat risk-averse
      case AI_PERSONALITY.COMBO:
        return 0.7; // Willing to take risks for combo
      default:
        return 0.5;
    }
  }

  /**
   * Get value weights based on personality
   */
  private _getValueWeights(): Record<string, number> {
    switch (this.personality) {
      case AI_PERSONALITY.AGGRESSIVE:
        return {
          boardPresence: 0.8,
          cardAdvantage: 0.3,
          lifeCards: 0.2,
          azothEfficiency: 0.5,
          tempo: 0.9
        };
      case AI_PERSONALITY.DEFENSIVE:
        return {
          boardPresence: 0.6,
          cardAdvantage: 0.5,
          lifeCards: 0.9,
          azothEfficiency: 0.7,
          tempo: 0.3
        };
      case AI_PERSONALITY.BALANCED:
        return {
          boardPresence: 0.6,
          cardAdvantage: 0.6,
          lifeCards: 0.6,
          azothEfficiency: 0.6,
          tempo: 0.6
        };
      case AI_PERSONALITY.CONTROL:
        return {
          boardPresence: 0.5,
          cardAdvantage: 0.9,
          lifeCards: 0.7,
          azothEfficiency: 0.8,
          tempo: 0.4
        };
      case AI_PERSONALITY.COMBO:
        return {
          boardPresence: 0.4,
          cardAdvantage: 0.8,
          lifeCards: 0.5,
          azothEfficiency: 0.7,
          tempo: 0.6
        };
      default:
        return {
          boardPresence: 0.6,
          cardAdvantage: 0.6,
          lifeCards: 0.6,
          azothEfficiency: 0.6,
          tempo: 0.6
        };
    }
  }

  /**
   * Get AI configuration
   */
  getConfig(): AIConfig {
    return this.config;
  }

  /**
   * Update AI configuration
   */
  updateConfig(config: Partial<AIConfig>): void {
    if (config.difficulty !== undefined) {
      this.difficulty = config.difficulty;
    }
    
    if (config.personality !== undefined) {
      this.personality = config.personality;
    }
    
    // Recalculate derived properties
    this.decisionSpeed = config.decisionSpeed ?? this._getDecisionSpeed();
    this.errorRate = config.errorRate ?? this._getErrorRate();
    this.aggressionLevel = config.aggressionLevel ?? this._getAggressionLevel();
    this.memoryFactor = config.memoryFactor ?? this._getMemoryFactor();
    this.adaptabilityFactor = config.adaptabilityFactor ?? this._getAdaptabilityFactor();
    this.riskTolerance = config.riskTolerance ?? this._getRiskTolerance();
    this.valueWeights = config.valueWeights ?? this._getValueWeights();
    
    // Update complete config
    this.config = {
      difficulty: this.difficulty,
      personality: this.personality,
      decisionSpeed: this.decisionSpeed,
      errorRate: this.errorRate,
      aggressionLevel: this.aggressionLevel,
      memoryFactor: this.memoryFactor,
      adaptabilityFactor: this.adaptabilityFactor,
      riskTolerance: this.riskTolerance,
      valueWeights: this.valueWeights
    };
  }
}

// Create default AI instances for different difficulties
export const easyAI = new AIOpponent(AI_DIFFICULTY.EASY, AI_PERSONALITY.BALANCED);
export const mediumAI = new AIOpponent(AI_DIFFICULTY.MEDIUM, AI_PERSONALITY.BALANCED);
export const hardAI = new AIOpponent(AI_DIFFICULTY.HARD, AI_PERSONALITY.BALANCED);
export const expertAI = new AIOpponent(AI_DIFFICULTY.EXPERT, AI_PERSONALITY.BALANCED);

// Create personality-specific AIs
export const aggressiveAI = new AIOpponent(AI_DIFFICULTY.HARD, AI_PERSONALITY.AGGRESSIVE);
export const defensiveAI = new AIOpponent(AI_DIFFICULTY.HARD, AI_PERSONALITY.DEFENSIVE);
export const controlAI = new AIOpponent(AI_DIFFICULTY.HARD, AI_PERSONALITY.CONTROL);
export const comboAI = new AIOpponent(AI_DIFFICULTY.HARD, AI_PERSONALITY.COMBO);

export default AIOpponent;