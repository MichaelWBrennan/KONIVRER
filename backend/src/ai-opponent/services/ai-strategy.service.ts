import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiOpponent } from '../entities/ai-opponent.entity';
import { Card } from '../../cards/entities/card.entity';

interface GameContext {
  currentPhase: string;
  turn: number;
  playerLife: number;
  aiLife: number;
  playerHand: string[];
  aiHand: string[];
  playerField: string[];
  aiField: string[];
  playerGraveyard: string[];
  aiGraveyard: string[];
  availableMana: number;
  playerThreats: string[];
  aiThreats: string[];
}

interface StrategyDecision {
  action: 'play_card' | 'attack' | 'defend' | 'pass' | 'special';
  target?: string;
  cardId?: string;
  reasoning: string;
  confidence: number;
  priority: number;
}

interface CardEvaluation {
  cardId: string;
  value: number;
  urgency: number;
  synergy: number;
  risk: number;
  reasoning: string;
}

@Injectable()
export class AiStrategyService {
  private readonly logger = new Logger(AiStrategyService.name);

  constructor(
    @InjectRepository(AiOpponent)
    private readonly aiOpponentRepository: Repository<AiOpponent>,
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
  ) {}

  async analyzeGameState(aiOpponentId: string, context: GameContext): Promise<StrategyDecision[]> {
    const aiOpponent = await this.aiOpponentRepository.findOne({
      where: { id: aiOpponentId },
    });

    if (!aiOpponent) {
      throw new Error('AI Opponent not found');
    }

    const decisions: StrategyDecision[] = [];

    // Analyze current situation
    const situation = this.analyzeSituation(context);
    
    // Get available cards
    const availableCards = await this.getAvailableCards(context.aiHand);
    
    // Evaluate each card
    const cardEvaluations = await this.evaluateCards(availableCards, context, aiOpponent);
    
    // Generate decisions based on AI personality and situation
    decisions.push(...this.generateDecisions(cardEvaluations, context, aiOpponent, situation));

    // Sort by priority and confidence
    return decisions.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      return b.confidence - a.confidence;
    });
  }

  private analyzeSituation(context: GameContext): {
    phase: 'early' | 'mid' | 'late';
    threatLevel: 'low' | 'medium' | 'high' | 'critical';
    boardControl: 'losing' | 'even' | 'winning';
    cardAdvantage: 'losing' | 'even' | 'winning';
    lifeAdvantage: 'losing' | 'even' | 'winning';
  } {
    const phase = context.turn <= 3 ? 'early' : context.turn <= 7 ? 'mid' : 'late';
    
    const lifeDifference = context.aiLife - context.playerLife;
    const lifeAdvantage = lifeDifference > 5 ? 'winning' : lifeDifference < -5 ? 'losing' : 'even';
    
    const cardAdvantage = context.aiHand.length - context.playerHand.length;
    const cardAdvantageStatus = cardAdvantage > 2 ? 'winning' : cardAdvantage < -2 ? 'losing' : 'even';
    
    const boardControl = context.aiField.length - context.playerField.length;
    const boardControlStatus = boardControl > 1 ? 'winning' : boardControl < -1 ? 'losing' : 'even';
    
    const threatLevel = context.playerThreats.length > 3 ? 'critical' :
                       context.playerThreats.length > 1 ? 'high' :
                       context.playerThreats.length > 0 ? 'medium' : 'low';

    return {
      phase,
      threatLevel,
      boardControl: boardControlStatus,
      cardAdvantage: cardAdvantageStatus,
      lifeAdvantage: lifeAdvantageStatus,
    };
  }

  private async getAvailableCards(cardIds: string[]): Promise<Card[]> {
    return this.cardRepository.findByIds(cardIds);
  }

  private async evaluateCards(
    cards: Card[],
    context: GameContext,
    aiOpponent: AiOpponent
  ): Promise<CardEvaluation[]> {
    const evaluations: CardEvaluation[] = [];

    for (const card of cards) {
      const evaluation = await this.evaluateCard(card, context, aiOpponent);
      evaluations.push(evaluation);
    }

    return evaluations;
  }

  private async evaluateCard(
    card: Card,
    context: GameContext,
    aiOpponent: AiOpponent
  ): Promise<CardEvaluation> {
    let value = 0;
    let urgency = 0;
    let synergy = 0;
    let risk = 0;
    let reasoning = '';

    // Base value from card cost and stats
    value += this.calculateBaseValue(card);
    
    // Urgency based on current situation
    urgency += this.calculateUrgency(card, context);
    
    // Synergy with current board and hand
    synergy += this.calculateSynergy(card, context);
    
    // Risk assessment
    risk += this.calculateRisk(card, context, aiOpponent);
    
    // Apply AI personality modifiers
    const personalityModifiers = this.applyPersonalityModifiers(card, aiOpponent.personality);
    value += personalityModifiers.value;
    urgency += personalityModifiers.urgency;
    synergy += personalityModifiers.synergy;
    risk += personalityModifiers.risk;

    // Generate reasoning
    reasoning = this.generateReasoning(card, value, urgency, synergy, risk, context);

    return {
      cardId: card.id,
      value,
      urgency,
      synergy,
      risk,
      reasoning,
    };
  }

  private calculateBaseValue(card: Card): number {
    let value = 0;
    
    // Cost efficiency
    if (card.azothCost > 0) {
      const powerValue = (card.power || 0) + (card.toughness || 0);
      value += powerValue / card.azothCost;
    }
    
    // Rarity bonus
    const rarityBonus = {
      'common': 1,
      'uncommon': 1.2,
      'rare': 1.5,
      'mythic': 2,
    };
    value *= rarityBonus[card.rarity] || 1;
    
    return value;
  }

  private calculateUrgency(card: Card, context: GameContext): number {
    let urgency = 0;
    
    // Life total urgency
    if (context.aiLife < 10) {
      urgency += 2; // High urgency when low on life
    }
    
    // Threat response urgency
    if (context.playerThreats.length > 0) {
      urgency += 1;
    }
    
    // Phase-based urgency
    if (context.currentPhase === 'combat' && card.lesserType === 'Creature') {
      urgency += 1.5;
    }
    
    return urgency;
  }

  private calculateSynergy(card: Card, context: GameContext): number {
    let synergy = 0;
    
    // Element synergy
    for (const element of card.elements) {
      const elementCount = context.aiField.filter(id => {
        // This would need to check actual card data
        return true; // Simplified for now
      }).length;
      synergy += elementCount * 0.2;
    }
    
    // Type synergy
    const typeCount = context.aiField.length; // Simplified
    if (card.lesserType === 'Creature') {
      synergy += typeCount * 0.1;
    }
    
    return synergy;
  }

  private calculateRisk(card: Card, context: GameContext, aiOpponent: AiOpponent): number {
    let risk = 0;
    
    // High cost risk
    if (card.azothCost > context.availableMana) {
      risk += 2;
    }
    
    // Low life risk
    if (context.aiLife < 5 && card.azothCost > 0) {
      risk += 1;
    }
    
    // Apply AI risk tolerance
    risk *= (100 - aiOpponent.personality.riskTolerance) / 100;
    
    return risk;
  }

  private applyPersonalityModifiers(
    card: Card,
    personality: AiOpponent['personality']
  ): { value: number; urgency: number; synergy: number; risk: number } {
    const modifiers = { value: 0, urgency: 0, synergy: 0, risk: 0 };
    
    // Aggression modifier
    if (card.lesserType === 'Creature' && (card.power || 0) > 0) {
      modifiers.value += personality.aggression / 100;
      modifiers.urgency += personality.aggression / 200;
    }
    
    // Risk tolerance modifier
    modifiers.risk -= personality.riskTolerance / 100;
    
    // Creativity modifier
    if (card.rulesText && card.rulesText.length > 50) {
      modifiers.value += personality.creativity / 200;
    }
    
    return modifiers;
  }

  private generateReasoning(
    card: Card,
    value: number,
    urgency: number,
    synergy: number,
    risk: number,
    context: GameContext
  ): string {
    const reasons = [];
    
    if (value > 2) reasons.push('high value');
    if (urgency > 1.5) reasons.push('urgent need');
    if (synergy > 1) reasons.push('good synergy');
    if (risk < 0.5) reasons.push('low risk');
    
    if (context.aiLife < 10) reasons.push('defensive play needed');
    if (context.playerThreats.length > 0) reasons.push('threat response');
    
    return reasons.length > 0 ? reasons.join(', ') : 'standard play';
  }

  private generateDecisions(
    cardEvaluations: CardEvaluation[],
    context: GameContext,
    aiOpponent: AiOpponent,
    situation: any
  ): StrategyDecision[] {
    const decisions: StrategyDecision[] = [];
    
    // Sort cards by overall value
    const sortedCards = cardEvaluations.sort((a, b) => {
      const aScore = a.value + a.urgency + a.synergy - a.risk;
      const bScore = b.value + b.urgency + b.synergy - b.risk;
      return bScore - aScore;
    });
    
    // Generate play decisions
    for (let i = 0; i < Math.min(3, sortedCards.length); i++) {
      const card = sortedCards[i];
      
      if (card.value > 1 && card.risk < 1) {
        decisions.push({
          action: 'play_card',
          cardId: card.cardId,
          reasoning: card.reasoning,
          confidence: Math.min(100, (card.value + card.urgency) * 20),
          priority: 10 - i,
        });
      }
    }
    
    // Generate attack decisions
    if (context.currentPhase === 'combat' && context.aiField.length > 0) {
      const attackDecision = this.generateAttackDecision(context, aiOpponent);
      if (attackDecision) {
        decisions.push(attackDecision);
      }
    }
    
    // Generate defensive decisions
    if (situation.threatLevel === 'high' || situation.threatLevel === 'critical') {
      const defenseDecision = this.generateDefenseDecision(context, aiOpponent);
      if (defenseDecision) {
        decisions.push(defenseDecision);
      }
    }
    
    return decisions;
  }

  private generateAttackDecision(
    context: GameContext,
    aiOpponent: AiOpponent
  ): StrategyDecision | null {
    if (context.aiField.length === 0) return null;
    
    const aggression = aiOpponent.personality.aggression;
    const shouldAttack = aggression > 50 || context.playerLife < 10;
    
    if (shouldAttack) {
      return {
        action: 'attack',
        reasoning: `Aggressive play (${aggression}% aggression)`,
        confidence: aggression,
        priority: 8,
      };
    }
    
    return null;
  }

  private generateDefenseDecision(
    context: GameContext,
    aiOpponent: AiOpponent
  ): StrategyDecision | null {
    if (context.playerThreats.length === 0) return null;
    
    return {
      action: 'defend',
      reasoning: 'Defensive response to threats',
      confidence: 80,
      priority: 9,
    };
  }

  async getOptimalStrategy(aiOpponentId: string, context: GameContext): Promise<{
    strategy: string;
    confidence: number;
    reasoning: string;
    nextMoves: StrategyDecision[];
  }> {
    const decisions = await this.analyzeGameState(aiOpponentId, context);
    const topDecision = decisions[0];
    
    if (!topDecision) {
      return {
        strategy: 'pass',
        confidence: 50,
        reasoning: 'No clear optimal play',
        nextMoves: [],
      };
    }
    
    return {
      strategy: topDecision.action,
      confidence: topDecision.confidence,
      reasoning: topDecision.reasoning,
      nextMoves: decisions.slice(0, 3),
    };
  }
}