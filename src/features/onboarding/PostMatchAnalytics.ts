import { Card, Deck } from '../../ai/DeckOptimizer';
import { GameMove, TrainingSession } from './AITrainingPartner';

export interface MatchAnalytics {
  matchId: string;
  playerId: string;
  opponentId: string;
  deck: Deck;
  opponentDeck?: Deck;
  result: 'win' | 'loss' | 'draw';
  gameLength: number; // in minutes
  turnCount: number;
  moves: AnalyzedMove[];
  heatmap: PlayHeatmap;
  suggestions: AnalyticsSuggestion[];
  performance: PerformanceAnalysis;
  timestamp: Date;
}

export interface AnalyzedMove {
  moveId: string;
  playerId: string;
  turn: number;
  action: 'play-card' | 'attack' | 'end-turn' | 'activate-ability' | 'mulligan';
  cardPlayed?: Card;
  target?: string;
  position?: { x: number; y: number };
  gameState: GameStateSnapshot;
  evaluation: MoveEvaluation;
  alternatives: AlternativeMove[];
  timestamp: number;
}

export interface GameStateSnapshot {
  playerHealth: number;
  opponentHealth: number;
  playerMana: number;
  opponentMana: number;
  playerHandSize: number;
  opponentHandSize: number;
  playerBoardState: BoardCard[];
  opponentBoardState: BoardCard[];
  gamePhase: 'early' | 'mid' | 'late';
}

export interface BoardCard {
  cardId: string;
  attack: number;
  health: number;
  position: { x: number; y: number };
  canAttack: boolean;
  abilities: string[];
}

export interface MoveEvaluation {
  score: number; // 0-100, higher is better
  classification: 'excellent' | 'good' | 'average' | 'poor' | 'blunder';
  reasoning: string[];
  strategicAlignment: number; // How well move aligns with deck strategy
  riskAssessment: 'low' | 'medium' | 'high';
}

export interface AlternativeMove {
  action: string;
  cardId?: string;
  target?: string;
  score: number;
  explanation: string;
}

export interface PlayHeatmap {
  cardPlayFrequency: Map<string, number>;
  attackPatterns: Map<string, number>;
  positionPreferences: Map<string, number>;
  timingAnalysis: {
    earlyGame: MoveTypeFrequency;
    midGame: MoveTypeFrequency;
    lateGame: MoveTypeFrequency;
  };
  mistakeHotspots: HotspotData[];
}

export interface MoveTypeFrequency {
  cardPlays: number;
  attacks: number;
  abilityActivations: number;
  endTurns: number;
}

export interface HotspotData {
  position: { x: number; y: number };
  frequency: number;
  mistakeType: string;
  impact: 'low' | 'medium' | 'high';
}

export interface AnalyticsSuggestion {
  id: string;
  category: 'strategic' | 'tactical' | 'deck-building' | 'timing' | 'positioning';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  specificExamples: string[];
  improvementTips: string[];
  relatedMoves: string[]; // Move IDs that this suggestion relates to
}

export interface PerformanceAnalysis {
  overallRating: number; // 0-100
  categoryRatings: {
    cardPlay: number;
    combat: number;
    timing: number;
    deckUtilization: number;
    adaptability: number;
  };
  improvementAreas: string[];
  strengths: string[];
  comparisonToSimilarPlayers: {
    percentile: number;
    skillGroup: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  };
  trendsOverTime: {
    winRateChange: number;
    skillImprovement: number;
    consistencyImprovement: number;
  };
}

export class PostMatchAnalytics {
  private matchHistory: Map<string, MatchAnalytics> = new Map();
  private playerAnalytics: Map<string, PlayerAnalyticsProfile> = new Map();

  async analyzeMatch(
    matchId: string,
    playerId: string,
    opponentId: string,
    deck: Deck,
    moves: GameMove[],
    result: 'win' | 'loss' | 'draw',
    gameLength: number,
    opponentDeck?: Deck
  ): Promise<MatchAnalytics> {
    const analyzedMoves = await this.analyzeMoves(moves, deck);
    const heatmap = this.generateHeatmap(analyzedMoves);
    const suggestions = this.generateSuggestions(analyzedMoves, deck, result);
    const performance = this.analyzePerformance(analyzedMoves, result, gameLength);

    const analytics: MatchAnalytics = {
      matchId,
      playerId,
      opponentId,
      deck,
      opponentDeck,
      result,
      gameLength,
      turnCount: Math.max(...moves.map(m => this.extractTurnNumber(m)), 0),
      moves: analyzedMoves,
      heatmap,
      suggestions,
      performance,
      timestamp: new Date()
    };

    this.matchHistory.set(matchId, analytics);
    this.updatePlayerAnalytics(playerId, analytics);

    return analytics;
  }

  private async analyzeMoves(moves: GameMove[], deck: Deck): Promise<AnalyzedMove[]> {
    const analyzedMoves: AnalyzedMove[] = [];
    
    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      const gameState = this.reconstructGameState(moves.slice(0, i + 1));
      const evaluation = await this.evaluateMove(move, gameState, deck);
      const alternatives = await this.findAlternativeMoves(move, gameState, deck);

      const analyzedMove: AnalyzedMove = {
        moveId: `move_${i}`,
        playerId: move.playerId,
        turn: this.extractTurnNumber(move),
        action: move.action,
        cardPlayed: this.getCardFromMove(move, deck),
        target: move.targetId,
        gameState,
        evaluation,
        alternatives,
        timestamp: move.timestamp
      };

      analyzedMoves.push(analyzedMove);
    }

    return analyzedMoves;
  }

  private extractTurnNumber(move: GameMove): number {
    // Extract turn number from game state or move sequence
    return Math.floor(move.timestamp / 60000) || 1; // Simplified: 1 turn per minute
  }

  private getCardFromMove(move: GameMove, deck: Deck): Card | undefined {
    if (move.action === 'play-card' && move.cardId) {
      return deck.cards.find(card => card.id === move.cardId);
    }
    return undefined;
  }

  private reconstructGameState(movesUpToNow: GameMove[]): GameStateSnapshot {
    // Reconstruct game state from move history
    // This is simplified - in a real game, you'd replay the moves
    
    const playerMoves = movesUpToNow.filter(m => m.playerId !== 'ai');
    const opponentMoves = movesUpToNow.filter(m => m.playerId === 'ai');
    
    return {
      playerHealth: Math.max(20 - opponentMoves.length, 1),
      opponentHealth: Math.max(20 - playerMoves.length, 1),
      playerMana: Math.min(Math.floor(movesUpToNow.length / 2) + 1, 10),
      opponentMana: Math.min(Math.floor(movesUpToNow.length / 2) + 1, 10),
      playerHandSize: Math.max(7 - playerMoves.length, 0),
      opponentHandSize: Math.max(7 - opponentMoves.length, 0),
      playerBoardState: [],
      opponentBoardState: [],
      gamePhase: movesUpToNow.length < 10 ? 'early' : 
                 movesUpToNow.length < 20 ? 'mid' : 'late'
    };
  }

  private async evaluateMove(
    move: GameMove,
    gameState: GameStateSnapshot,
    deck: Deck
  ): Promise<MoveEvaluation> {
    // Evaluate move quality based on multiple factors
    let score = 50; // Base score
    const reasoning: string[] = [];
    
    // Evaluate based on action type
    switch (move.action) {
      case 'play-card':
        score += this.evaluateCardPlay(move, gameState, deck, reasoning);
        break;
      case 'attack':
        score += this.evaluateAttack(move, gameState, reasoning);
        break;
      case 'end-turn':
        score += this.evaluateEndTurn(move, gameState, reasoning);
        break;
      default:
        score += 0;
    }

    // Evaluate timing
    score += this.evaluateTiming(move, gameState, reasoning);
    
    // Evaluate strategic alignment
    const strategicAlignment = this.calculateStrategicAlignment(move, deck);
    score += strategicAlignment * 20;

    // Determine classification
    const classification = this.classifyMove(score);
    const riskAssessment = this.assessRisk(move, gameState);

    return {
      score: Math.max(0, Math.min(100, score)),
      classification,
      reasoning,
      strategicAlignment,
      riskAssessment
    };
  }

  private evaluateCardPlay(
    move: GameMove,
    gameState: GameStateSnapshot,
    deck: Deck,
    reasoning: string[]
  ): number {
    let score = 0;
    
    if (move.cardId) {
      const card = deck.cards.find(c => c.id === move.cardId);
      if (card) {
        // Evaluate mana efficiency
        if (card.cost <= gameState.playerMana) {
          score += 10;
          reasoning.push('Played card within mana budget');
        } else {
          score -= 20;
          reasoning.push('Attempted to play card without sufficient mana');
        }

        // Evaluate card timing
        if (gameState.gamePhase === 'early' && card.cost <= 3) {
          score += 15;
          reasoning.push('Good early game card timing');
        } else if (gameState.gamePhase === 'late' && card.cost >= 6) {
          score += 15;
          reasoning.push('Appropriate late game power play');
        }

        // Evaluate board state considerations
        if (card.type === 'creature' && gameState.playerBoardState.length < 6) {
          score += 10;
          reasoning.push('Added board presence when space available');
        }
      }
    }

    return score;
  }

  private evaluateAttack(
    move: GameMove,
    gameState: GameStateSnapshot,
    reasoning: string[]
  ): number {
    let score = 0;

    // Basic attack evaluation
    if (gameState.opponentHealth <= 5) {
      score += 20;
      reasoning.push('Attacked when opponent at low health - good pressure');
    }

    if (gameState.playerBoardState.length > gameState.opponentBoardState.length) {
      score += 15;
      reasoning.push('Attacked with board advantage');
    } else {
      score -= 5;
      reasoning.push('Attacked without clear board advantage');
    }

    return score;
  }

  private evaluateEndTurn(
    move: GameMove,
    gameState: GameStateSnapshot,
    reasoning: string[]
  ): number {
    let score = 0;

    // Check if player used all available mana
    if (gameState.playerMana <= 1) {
      score += 10;
      reasoning.push('Efficiently used available mana before ending turn');
    } else {
      score -= gameState.playerMana * 2;
      reasoning.push(`Left ${gameState.playerMana} mana unused`);
    }

    return score;
  }

  private evaluateTiming(
    move: GameMove,
    gameState: GameStateSnapshot,
    reasoning: string[]
  ): number {
    // Evaluate if move was played at optimal timing
    let score = 0;

    // Check decision speed (too fast or too slow can be suboptimal)
    const previousMove = gameState; // Simplified
    const timeSinceLastMove = 5000; // Placeholder

    if (timeSinceLastMove < 2000) {
      score -= 5;
      reasoning.push('Very quick decision - may benefit from more consideration');
    } else if (timeSinceLastMove > 30000) {
      score -= 10;
      reasoning.push('Long decision time - may indicate uncertainty');
    } else {
      score += 5;
      reasoning.push('Good decision timing');
    }

    return score;
  }

  private calculateStrategicAlignment(move: GameMove, deck: Deck): number {
    // Calculate how well the move aligns with deck strategy
    // This is simplified - would analyze deck archetype and move appropriateness
    const avgCost = deck.cards.reduce((sum, card) => sum + card.cost, 0) / deck.cards.length;
    
    if (avgCost <= 3 && move.action === 'play-card') {
      return 0.8; // Good for aggro
    } else if (avgCost >= 5 && move.action === 'end-turn') {
      return 0.7; // Good for control
    }
    
    return 0.5; // Neutral alignment
  }

  private classifyMove(score: number): 'excellent' | 'good' | 'average' | 'poor' | 'blunder' {
    if (score >= 90) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'average';
    if (score >= 30) return 'poor';
    return 'blunder';
  }

  private assessRisk(move: GameMove, gameState: GameStateSnapshot): 'low' | 'medium' | 'high' {
    // Assess risk level of the move
    if (gameState.playerHealth <= 5) return 'high';
    if (gameState.opponentBoardState.length > gameState.playerBoardState.length + 2) return 'high';
    if (gameState.gamePhase === 'late') return 'medium';
    return 'low';
  }

  private async findAlternativeMoves(
    move: GameMove,
    gameState: GameStateSnapshot,
    deck: Deck
  ): Promise<AlternativeMove[]> {
    const alternatives: AlternativeMove[] = [];

    // Generate alternative moves based on game state
    if (move.action === 'play-card') {
      alternatives.push({
        action: 'end-turn',
        score: 60,
        explanation: 'Could have ended turn to save mana for next turn'
      });
    }

    if (move.action === 'end-turn' && gameState.playerMana > 2) {
      alternatives.push({
        action: 'play-card',
        cardId: 'hypothetical-card',
        score: 70,
        explanation: 'Could have played a card with remaining mana'
      });
    }

    return alternatives;
  }

  private generateHeatmap(moves: AnalyzedMove[]): PlayHeatmap {
    const cardPlayFrequency = new Map<string, number>();
    const attackPatterns = new Map<string, number>();
    const positionPreferences = new Map<string, number>();
    const timingAnalysis = {
      earlyGame: { cardPlays: 0, attacks: 0, abilityActivations: 0, endTurns: 0 },
      midGame: { cardPlays: 0, attacks: 0, abilityActivations: 0, endTurns: 0 },
      lateGame: { cardPlays: 0, attacks: 0, abilityActivations: 0, endTurns: 0 }
    };
    const mistakeHotspots: HotspotData[] = [];

    moves.forEach(move => {
      // Track card play frequency
      if (move.action === 'play-card' && move.cardPlayed) {
        const current = cardPlayFrequency.get(move.cardPlayed.id) || 0;
        cardPlayFrequency.set(move.cardPlayed.id, current + 1);
      }

      // Track timing patterns
      const phase = move.gameState.gamePhase;
      switch (move.action) {
        case 'play-card':
          timingAnalysis[phase].cardPlays++;
          break;
        case 'attack':
          timingAnalysis[phase].attacks++;
          break;
        case 'activate-ability':
          timingAnalysis[phase].abilityActivations++;
          break;
        case 'end-turn':
          timingAnalysis[phase].endTurns++;
          break;
      }

      // Track mistakes
      if (move.evaluation.classification === 'poor' || move.evaluation.classification === 'blunder') {
        mistakeHotspots.push({
          position: move.position || { x: 0, y: 0 },
          frequency: 1,
          mistakeType: move.action,
          impact: move.evaluation.classification === 'blunder' ? 'high' : 'medium'
        });
      }
    });

    return {
      cardPlayFrequency,
      attackPatterns,
      positionPreferences,
      timingAnalysis,
      mistakeHotspots
    };
  }

  private generateSuggestions(
    moves: AnalyzedMove[],
    deck: Deck,
    result: 'win' | 'loss' | 'draw'
  ): AnalyticsSuggestion[] {
    const suggestions: AnalyticsSuggestion[] = [];

    // Analyze common mistakes
    const poorMoves = moves.filter(m => 
      m.evaluation.classification === 'poor' || m.evaluation.classification === 'blunder'
    );

    if (poorMoves.length > moves.length * 0.3) {
      suggestions.push({
        id: 'too-many-mistakes',
        category: 'tactical',
        priority: 'high',
        title: 'Reduce Decision-Making Errors',
        description: 'You made several suboptimal moves during this match. Taking more time to consider options could improve your play.',
        specificExamples: poorMoves.slice(0, 3).map(m => 
          `Turn ${m.turn}: ${m.evaluation.reasoning.join(', ')}`
        ),
        improvementTips: [
          'Pause before each move to consider alternatives',
          'Think about what your opponent might do next',
          'Consider the long-term consequences of each play'
        ],
        relatedMoves: poorMoves.map(m => m.moveId)
      });
    }

    // Analyze mana efficiency
    const manaWasteCount = moves.filter(m => 
      m.action === 'end-turn' && m.gameState.playerMana > 2
    ).length;

    if (manaWasteCount > 3) {
      suggestions.push({
        id: 'mana-efficiency',
        category: 'strategic',
        priority: 'medium',
        title: 'Improve Mana Efficiency',
        description: 'You often ended turns with unused mana. Better mana usage could increase your win rate.',
        specificExamples: [`Wasted mana on ${manaWasteCount} turns`],
        improvementTips: [
          'Plan your turns to use all available mana',
          'Include more low-cost cards for mana efficiency',
          'Consider ability activations when mana would be wasted'
        ],
        relatedMoves: moves.filter(m => m.action === 'end-turn').map(m => m.moveId)
      });
    }

    // Deck-specific suggestions
    const avgCost = deck.cards.reduce((sum, card) => sum + card.cost, 0) / deck.cards.length;
    if (avgCost > 4 && result === 'loss') {
      suggestions.push({
        id: 'curve-too-high',
        category: 'deck-building',
        priority: 'medium',
        title: 'Consider Lowering Mana Curve',
        description: 'Your deck has a high average mana cost, which may slow down your early game.',
        specificExamples: [`Average mana cost: ${avgCost.toFixed(1)}`],
        improvementTips: [
          'Add more 1-3 mana cost cards',
          'Remove some high-cost cards',
          'Include more card draw to smooth out curve'
        ],
        relatedMoves: []
      });
    }

    return suggestions;
  }

  private analyzePerformance(
    moves: AnalyzedMove[],
    result: 'win' | 'loss' | 'draw',
    gameLength: number
  ): PerformanceAnalysis {
    const playerMoves = moves.filter(m => m.playerId !== 'ai');
    
    // Calculate overall rating
    const avgMoveScore = playerMoves.reduce((sum, move) => sum + move.evaluation.score, 0) / playerMoves.length;
    const resultBonus = result === 'win' ? 10 : result === 'draw' ? 5 : 0;
    const overallRating = Math.min(100, avgMoveScore + resultBonus);

    // Calculate category ratings
    const cardPlayMoves = playerMoves.filter(m => m.action === 'play-card');
    const attackMoves = playerMoves.filter(m => m.action === 'attack');
    const timingMoves = playerMoves.filter(m => m.action === 'end-turn');

    const categoryRatings = {
      cardPlay: this.calculateCategoryRating(cardPlayMoves),
      combat: this.calculateCategoryRating(attackMoves),
      timing: this.calculateCategoryRating(timingMoves),
      deckUtilization: this.calculateDeckUtilization(playerMoves),
      adaptability: this.calculateAdaptability(playerMoves)
    };

    return {
      overallRating,
      categoryRatings,
      improvementAreas: this.identifyImprovementAreas(categoryRatings),
      strengths: this.identifyStrengths(categoryRatings),
      comparisonToSimilarPlayers: {
        percentile: Math.floor(overallRating * 0.8), // Simplified
        skillGroup: overallRating > 80 ? 'expert' : 
                   overallRating > 65 ? 'advanced' :
                   overallRating > 50 ? 'intermediate' : 'beginner'
      },
      trendsOverTime: {
        winRateChange: 0, // Would need historical data
        skillImprovement: 0,
        consistencyImprovement: 0
      }
    };
  }

  private calculateCategoryRating(moves: AnalyzedMove[]): number {
    if (moves.length === 0) return 50; // Neutral if no moves in category
    return moves.reduce((sum, move) => sum + move.evaluation.score, 0) / moves.length;
  }

  private calculateDeckUtilization(moves: AnalyzedMove[]): number {
    // Calculate how well player utilized their deck's potential
    const cardPlayMoves = moves.filter(m => m.action === 'play-card');
    const uniqueCardsPlayed = new Set(cardPlayMoves.map(m => m.cardPlayed?.id)).size;
    
    // Simplified calculation
    return Math.min(100, uniqueCardsPlayed * 10);
  }

  private calculateAdaptability(moves: AnalyzedMove[]): number {
    // Calculate how well player adapted to changing game states
    let adaptabilityScore = 50;
    
    // Look for strategic shifts based on game state changes
    for (let i = 1; i < moves.length; i++) {
      const prevMove = moves[i - 1];
      const currMove = moves[i];
      
      // Check if player adapted to health changes
      if (prevMove.gameState.playerHealth > currMove.gameState.playerHealth + 5) {
        if (currMove.action === 'play-card' && currMove.cardPlayed?.type === 'spell') {
          adaptabilityScore += 5; // Good adaptation to damage
        }
      }
    }
    
    return Math.min(100, adaptabilityScore);
  }

  private identifyImprovementAreas(ratings: any): string[] {
    const areas: string[] = [];
    
    if (ratings.cardPlay < 60) areas.push('Card play timing and selection');
    if (ratings.combat < 60) areas.push('Combat decision-making');
    if (ratings.timing < 60) areas.push('Turn timing and mana efficiency');
    if (ratings.deckUtilization < 60) areas.push('Deck synergy utilization');
    if (ratings.adaptability < 60) areas.push('Adapting to game state changes');
    
    return areas;
  }

  private identifyStrengths(ratings: any): string[] {
    const strengths: string[] = [];
    
    if (ratings.cardPlay >= 75) strengths.push('Excellent card play');
    if (ratings.combat >= 75) strengths.push('Strong combat decisions');
    if (ratings.timing >= 75) strengths.push('Great timing and efficiency');
    if (ratings.deckUtilization >= 75) strengths.push('Excellent deck utilization');
    if (ratings.adaptability >= 75) strengths.push('Good adaptability');
    
    return strengths;
  }

  private updatePlayerAnalytics(playerId: string, analytics: MatchAnalytics): void {
    // Update player's historical analytics
    // This would maintain running averages and trends
  }

  getMatchAnalytics(matchId: string): MatchAnalytics | undefined {
    return this.matchHistory.get(matchId);
  }

  getPlayerMatchHistory(playerId: string, limit?: number): MatchAnalytics[] {
    const matches = Array.from(this.matchHistory.values())
      .filter(match => match.playerId === playerId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    return limit ? matches.slice(0, limit) : matches;
  }
}

interface PlayerAnalyticsProfile {
  playerId: string;
  totalMatches: number;
  overallRating: number;
  ratingHistory: { date: Date; rating: number }[];
  improvementTrends: Map<string, number>;
}

export const postMatchAnalytics = new PostMatchAnalytics();