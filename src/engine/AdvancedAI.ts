/**
 * Advanced AI System for KONIVRER
 * 
 * Features:
 * - Strategic decision making with multiple evaluation criteria
 * - Adaptive learning from player behavior
 * - Human-like thinking patterns with occasional "mistakes"
 * - Multiple personality archetypes
 * - Long-term planning and resource management
 * - Psychological gameplay elements
 */

interface GameState {
  players: {
    ai: {
      field: Card[];
      azoth: Card[];
      hand: Card[];
      [key: string]: any;
    };
    human: {
      field: Card[];
      azoth: Card[];
      hand: Card[];
      [key: string]: any;
    };
  };
  isCriticalMoment?: boolean;
  [key: string]: any;
}

interface Card {
  id: string;
  power?: number;
  elements?: string[];
  type?: string;
  resourceCost?: number;
  [key: string]: any;
}

interface Action {
  type: string;
  card?: Card;
  target?: any;
  resourceCost?: number;
  [key: string]: any;
}

interface ActionEvaluation {
  action: Action;
  scores: {
    immediate: number;
    strategic: number;
    risk: number;
    synergy: number;
    surprise: number;
    efficiency: number;
    [key: string]: number;
  };
  totalScore?: number;
  personalityAdjustedScore?: number;
  confidence: number;
}

interface SituationAnalysis {
  boardControl: BoardControlAnalysis;
  resourceAdvantage: ResourceAnalysis;
  threatLevel: number;
  opportunities: any[];
  gamePhase: string;
  playerPressure: number;
  winConditions: any[];
}

interface BoardControlAnalysis {
  powerAdvantage: number;
  presenceAdvantage: number;
  controlPercentage: number;
  dominantElements: string[];
}

interface ResourceAnalysis {
  azothAdvantage: number;
  handSize: number;
  elementalDiversity: number;
  resourceEfficiency: number;
  futureResourcePotential: number;
}

interface PlayerBehaviorProfile {
  aggression: number;
  resourceConservation: number;
  riskTolerance: number;
  adaptability: number;
  favoriteElements: Record<string, number>;
}

interface GameHistoryEntry {
  gameState: any;
  decision: Action;
  timestamp: number;
}

interface PersonalityWeights {
  aggression: number;
  conservation: number;
  strategic: number;
  adaptive: number;
}

type PersonalityType = 'aggressive' | 'control' | 'combo' | 'adaptive' | 'balanced';

class AdvancedAI {
  private personality: PersonalityType;
  private gameHistory: GameHistoryEntry[];
  private playerBehaviorProfile: PlayerBehaviorProfile;
  private thinkingTime: number;
  private confidence: number;
  private currentStrategy: string | null;
  private longTermGoals: string[];

  constructor(personality: PersonalityType = 'balanced') {
    this.personality = personality;
    this.gameHistory = [];
    this.playerBehaviorProfile = {
      aggression: 0.5,
      resourceConservation: 0.5,
      riskTolerance: 0.5,
      adaptability: 0.5,
      favoriteElements: {}
    };
    this.thinkingTime = 1000; // Base thinking time in ms
    this.confidence = 0.7;
    this.currentStrategy = null;
    this.longTermGoals = [];
  }

  /**
   * Main AI decision-making function
   * Simulates human-like thinking process
   */
  async makeDecision(gameState: GameState, availableActions: Action[]): Promise<Action> {
    // Simulate thinking time (human-like pause)
    await this.simulateThinking(gameState);

    // Analyze current situation
    const situationAnalysis = this.analyzeSituation(gameState);
    
    // Update strategy based on game state
    this.updateStrategy(situationAnalysis);
    
    // Evaluate all possible actions
    const actionEvaluations = this.evaluateActions(gameState, availableActions, situationAnalysis);
    
    // Apply personality and human-like decision making
    const decision = this.makeHumanLikeChoice(actionEvaluations, situationAnalysis);
    
    // Learn from this decision
    this.recordDecision(gameState, decision);
    
    return decision;
  }

  /**
   * Simulate human thinking time with realistic pauses
   */
  async simulateThinking(gameState: GameState): Promise<void> {
    const complexity = this.assessComplexity(gameState);
    const baseTime = this.thinkingTime;
    const variability = 0.3; // 30% random variation
    
    let thinkingDuration = baseTime * complexity * (1 + (Math.random() - 0.5) * variability);
    
    // Add extra time for critical decisions
    if (gameState.isCriticalMoment) {
      thinkingDuration *= 1.5;
    }
    
    await new Promise(resolve => setTimeout(resolve, Math.max(500, thinkingDuration)));
  }

  /**
   * Comprehensive situation analysis
   */
  analyzeSituation(gameState: GameState): SituationAnalysis {
    return {
      boardControl: this.evaluateBoardControl(gameState),
      resourceAdvantage: this.evaluateResources(gameState),
      threatLevel: this.assessThreats(gameState),
      opportunities: this.identifyOpportunities(gameState),
      gamePhase: this.determineGamePhase(gameState),
      playerPressure: this.assessPlayerPressure(gameState),
      winConditions: this.evaluateWinConditions(gameState)
    };
  }

  /**
   * Evaluate board control and field presence
   */
  evaluateBoardControl(gameState: GameState): BoardControlAnalysis {
    const myField = gameState.players.ai.field;
    const opponentField = gameState.players.human.field;
    
    const myPower = myField.reduce((total, card) => total + (card?.power || 0), 0);
    const opponentPower = opponentField.reduce((total, card) => total + (card?.power || 0), 0);
    
    const myPresence = myField.filter(slot => slot !== null).length;
    const opponentPresence = opponentField.filter(slot => slot !== null).length;
    
    return {
      powerAdvantage: myPower - opponentPower,
      presenceAdvantage: myPresence - opponentPresence,
      controlPercentage: myPresence / (myPresence + opponentPresence + 0.1),
      dominantElements: this.analyzeDominantElements(myField)
    };
  }

  /**
   * Evaluate resource situation
   */
  evaluateResources(gameState: GameState): ResourceAnalysis {
    const myAzoth = gameState.players.ai.azoth;
    const opponentAzoth = gameState.players.human.azoth;
    const myHand = gameState.players.ai.hand;
    
    return {
      azothAdvantage: myAzoth.length - opponentAzoth.length,
      handSize: myHand.length,
      elementalDiversity: this.calculateElementalDiversity(myAzoth),
      resourceEfficiency: this.calculateResourceEfficiency(gameState),
      futureResourcePotential: this.assessFutureResources(gameState)
    };
  }

  /**
   * Strategic action evaluation with multiple criteria
   */
  evaluateActions(gameState: GameState, availableActions: Action[], situationAnalysis: SituationAnalysis): ActionEvaluation[] {
    return availableActions.map(action => {
      const evaluation: ActionEvaluation = {
        action,
        scores: {
          immediate: this.evaluateImmediateValue(action, gameState),
          strategic: this.evaluateStrategicValue(action, gameState, situationAnalysis),
          risk: this.evaluateRisk(action, gameState),
          synergy: this.evaluateSynergy(action, gameState),
          surprise: this.evaluateSurpriseValue(action, gameState),
          efficiency: this.evaluateEfficiency(action, gameState)
        },
        confidence: 0.5
      };
      
      // Calculate weighted total score based on personality and situation
      evaluation.totalScore = this.calculateWeightedScore(evaluation.scores, situationAnalysis);
      evaluation.confidence = this.calculateConfidence(evaluation, situationAnalysis);
      
      return evaluation;
    });
  }

  /**
   * Human-like decision making with personality influence
   */
  makeHumanLikeChoice(actionEvaluations: ActionEvaluation[], situationAnalysis: SituationAnalysis): Action {
    // Sort by score but add human-like variability
    const sortedActions = actionEvaluations.sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
    
    // Apply personality-based decision making
    const personalityInfluenced = this.applyPersonalityInfluence(sortedActions, situationAnalysis);
    
    // Add occasional "human mistakes" for realism
    const finalChoice = this.addHumanVariability(personalityInfluenced, situationAnalysis);
    
    return finalChoice.action;
  }

  /**
   * Apply personality traits to decision making
   */
  applyPersonalityInfluence(sortedActions: ActionEvaluation[], situationAnalysis: SituationAnalysis): ActionEvaluation[] {
    const personality = this.getPersonalityWeights();
    
    return sortedActions.map((evaluation) => {
      let personalityScore = 0;
      
      // Aggressive personalities favor high-impact plays
      if (personality.aggression > 0.6 && evaluation.scores.immediate > 0.7) {
        personalityScore += 0.2;
      }
      
      // Conservative personalities favor safe plays
      if (personality.conservation > 0.6 && evaluation.scores.risk < 0.3) {
        personalityScore += 0.15;
      }
      
      // Strategic personalities favor long-term value
      if (personality.strategic > 0.6 && evaluation.scores.strategic > 0.7) {
        personalityScore += 0.25;
      }
      
      // Adaptive personalities respond to player behavior
      if (personality.adaptive > 0.6) {
        personalityScore += this.calculateAdaptiveBonus(evaluation, situationAnalysis);
      }
      
      evaluation.personalityAdjustedScore = (evaluation.totalScore || 0) + personalityScore;
      return evaluation;
    }).sort((a, b) => (b.personalityAdjustedScore || 0) - (a.personalityAdjustedScore || 0));
  }

  /**
   * Add human-like variability and occasional suboptimal choices
   */
  addHumanVariability(sortedActions: ActionEvaluation[], situationAnalysis: SituationAnalysis): ActionEvaluation {
    if (sortedActions.length === 0) {
      throw new Error("No actions available to choose from");
    }
    
    const topChoice = sortedActions[0];
    const secondChoice = sortedActions.length > 1 ? sortedActions[1] : topChoice;
    const thirdChoice = sortedActions.length > 2 ? sortedActions[2] : topChoice;
    
    // Confidence-based decision making
    if (this.confidence < 0.5) {
      // Low confidence - might choose second best option
      if (Math.random() < 0.3) {
        return secondChoice;
      }
    }
    
    // Pressure-based mistakes
    if (situationAnalysis.playerPressure > 0.7) {
      // High pressure - small chance of suboptimal play
      if (Math.random() < 0.15) {
        return thirdChoice;
      }
    }
    
    // Experimentation in low-stakes situations
    if (situationAnalysis.threatLevel < 0.3 && Math.random() < 0.1) {
      // Try something unexpected
      const experimentalChoice = sortedActions[Math.floor(Math.random() * Math.min(3, sortedActions.length))];
      return experimentalChoice;
    }
    
    return topChoice;
  }

  /**
   * Dynamic strategy adaptation
   */
  updateStrategy(situationAnalysis: SituationAnalysis): void {
    const strategies = ['aggressive', 'control', 'combo', 'resource', 'adaptive'];
    
    // Evaluate which strategy fits current situation
    const strategyScores = strategies.map(strategy => ({
      strategy,
      score: this.evaluateStrategyFit(strategy, situationAnalysis)
    }));
    
    const bestStrategy = strategyScores.sort((a, b) => b.score - a.score)[0];
    
    // Gradually shift strategy (human-like adaptation)
    if (this.currentStrategy !== bestStrategy.strategy) {
      if (Math.random() < 0.3) { // 30% chance to adapt per turn
        this.currentStrategy = bestStrategy.strategy;
        this.confidence = 0.6; // Reset confidence when changing strategy
      }
    } else {
      this.confidence = Math.min(0.9, this.confidence + 0.05); // Build confidence
    }
  }

  /**
   * Learn from player behavior and adapt
   */
  recordDecision(gameState: GameState, decision: Action): void {
    this.gameHistory.push({
      gameState: this.simplifyGameState(gameState),
      decision,
      timestamp: Date.now()
    });
    
    // Update player behavior profile
    this.updatePlayerProfile(gameState);
    
    // Limit history size for performance
    if (this.gameHistory.length > 50) {
      this.gameHistory.shift();
    }
  }

  /**
   * Update understanding of player behavior
   */
  updatePlayerProfile(gameState: GameState): void {
    const recentMoves = this.gameHistory.slice(-10);
    
    // Analyze player aggression
    const aggressiveMoves = recentMoves.filter(move => 
      move.decision.type === 'attack' || move.decision.type === 'aggressive_play'
    ).length;
    
    this.playerBehaviorProfile.aggression = (this.playerBehaviorProfile.aggression * 0.8) + (aggressiveMoves / recentMoves.length * 0.2);
    
    // Analyze resource conservation
    const conservativeMoves = recentMoves.filter(move =>
      move.decision.type === 'azoth' || (move.decision.resourceCost !== undefined && move.decision.resourceCost < 2)
    ).length;
    
    this.playerBehaviorProfile.resourceConservation = (this.playerBehaviorProfile.resourceConservation * 0.8) + (conservativeMoves / recentMoves.length * 0.2);
    
    // Track favorite elements
    recentMoves.forEach((move) => {
      if (move.decision.card && move.decision.card.elements) {
        move.decision.card.elements.forEach((element: string) => {
          this.playerBehaviorProfile.favoriteElements[element] = 
            (this.playerBehaviorProfile.favoriteElements[element] || 0) + 1;
        });
      }
    });
  }

  /**
   * Personality archetypes with different play styles
   */
  getPersonalityWeights(): PersonalityWeights {
    const personalities: Record<PersonalityType, PersonalityWeights> = {
      aggressive: { aggression: 0.9, conservation: 0.2, strategic: 0.6, adaptive: 0.5 },
      control: { aggression: 0.3, conservation: 0.8, strategic: 0.9, adaptive: 0.7 },
      combo: { aggression: 0.5, conservation: 0.6, strategic: 0.8, adaptive: 0.6 },
      adaptive: { aggression: 0.5, conservation: 0.5, strategic: 0.7, adaptive: 0.9 },
      balanced: { aggression: 0.5, conservation: 0.5, strategic: 0.6, adaptive: 0.6 }
    };
    
    return personalities[this.personality] || personalities.balanced;
  }

  /**
   * Calculate confidence in decision based on multiple factors
   */
  calculateConfidence(evaluation: ActionEvaluation, situationAnalysis: SituationAnalysis): number {
    let confidence = 0.5;
    
    // High scores increase confidence
    if ((evaluation.totalScore || 0) > 0.8) confidence += 0.3;
    if ((evaluation.totalScore || 0) < 0.3) confidence -= 0.2;
    
    // Clear situations increase confidence
    if (situationAnalysis.threatLevel < 0.3) {
      confidence += 0.2;
    }
    
    // Experience with similar situations
    const similarSituations = this.gameHistory.filter(h => 
      Math.abs(h.gameState.boardControl - situationAnalysis.boardControl.controlPercentage) < 0.2
    ).length;
    
    confidence += Math.min(0.2, similarSituations * 0.02);
    
    return Math.max(0.1, Math.min(1.0, confidence));
  }

  /**
   * Assess game complexity for thinking time calculation
   */
  assessComplexity(gameState: GameState): number {
    let complexity = 1.0;
    
    // More cards in hand = more complex
    complexity += gameState.players.ai.hand.length * 0.1;
    
    // More pieces on board = more complex
    const totalPieces = gameState.players.ai.field.filter(c => c).length + 
                       gameState.players.human.field.filter(c => c).length;
    complexity += totalPieces * 0.05;
    
    // Critical moments are more complex
    if (gameState.isCriticalMoment) complexity += 0.5;
    
    return Math.min(2.0, complexity);
  }

  // Additional helper methods for evaluation
  evaluateImmediateValue(action: Action, gameState: GameState): number {
    // Implementation for immediate value assessment
    return Math.random() * 0.5 + 0.25; // Placeholder
  }

  evaluateStrategicValue(action: Action, gameState: GameState, situationAnalysis: SituationAnalysis): number {
    // Implementation for strategic value assessment
    return Math.random() * 0.5 + 0.25; // Placeholder
  }

  evaluateRisk(action: Action, gameState: GameState): number {
    // Implementation for risk assessment
    return Math.random() * 0.5 + 0.25; // Placeholder
  }

  evaluateSynergy(action: Action, gameState: GameState): number {
    // Implementation for synergy evaluation
    return Math.random() * 0.5 + 0.25; // Placeholder
  }

  evaluateSurpriseValue(action: Action, gameState: GameState): number {
    // Implementation for surprise value
    return Math.random() * 0.3; // Placeholder
  }

  evaluateEfficiency(action: Action, gameState: GameState): number {
    // Implementation for efficiency evaluation
    return Math.random() * 0.5 + 0.25; // Placeholder
  }

  calculateWeightedScore(scores: Record<string, number>, situationAnalysis: SituationAnalysis): number {
    // Implementation for weighted scoring
    return Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.keys(scores).length;
  }

  // Placeholder implementations for required methods
  analyzeDominantElements(cards: Card[]): string[] {
    // Implementation for analyzing dominant elements
    return ['fire', 'water']; // Placeholder
  }

  calculateElementalDiversity(cards: Card[]): number {
    // Implementation for calculating elemental diversity
    return 0.5; // Placeholder
  }

  calculateResourceEfficiency(gameState: GameState): number {
    // Implementation for calculating resource efficiency
    return 0.6; // Placeholder
  }

  assessFutureResources(gameState: GameState): number {
    // Implementation for assessing future resources
    return 0.7; // Placeholder
  }

  assessThreats(gameState: GameState): number {
    // Implementation for assessing threats
    return 0.4; // Placeholder
  }

  identifyOpportunities(gameState: GameState): any[] {
    // Implementation for identifying opportunities
    return []; // Placeholder
  }

  determineGamePhase(gameState: GameState): string {
    // Implementation for determining game phase
    return 'mid'; // Placeholder
  }

  assessPlayerPressure(gameState: GameState): number {
    // Implementation for assessing player pressure
    return 0.5; // Placeholder
  }

  evaluateWinConditions(gameState: GameState): any[] {
    // Implementation for evaluating win conditions
    return []; // Placeholder
  }

  calculateAdaptiveBonus(evaluation: ActionEvaluation, situationAnalysis: SituationAnalysis): number {
    // Implementation for calculating adaptive bonus
    return 0.1; // Placeholder
  }

  evaluateStrategyFit(strategy: string, situationAnalysis: SituationAnalysis): number {
    // Implementation for evaluating strategy fit
    return Math.random(); // Placeholder
  }

  simplifyGameState(gameState: GameState): any {
    // Implementation for simplifying game state
    return {
      boardControl: gameState.players.ai.field.length / 
        (gameState.players.ai.field.length + gameState.players.human.field.length + 0.1)
    }; // Placeholder
  }
}

export default AdvancedAI;