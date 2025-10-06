import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from '../../cards/entities/card.entity';
import { Deck } from '../../decks/entities/deck.entity';
import { AiOpponent } from '../entities/ai-opponent.entity';

interface DeckSuggestion {
  deckId: string;
  name: string;
  description: string;
  cards: Array<{
    cardId: string;
    cardName: string;
    quantity: number;
    reasoning: string;
  }>;
  strategy: string;
  confidence: number;
  expectedWinRate: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'master';
}

@Injectable()
export class AiDeckbuildingService {
  private readonly logger = new Logger(AiDeckbuildingService.name);

  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    @InjectRepository(Deck)
    private readonly deckRepository: Repository<Deck>,
    @InjectRepository(AiOpponent)
    private readonly aiOpponentRepository: Repository<AiOpponent>,
  ) {}

  async generateDeckForOpponent(aiOpponentId: string): Promise<DeckSuggestion> {
    const aiOpponent = await this.aiOpponentRepository.findOne({
      where: { id: aiOpponentId },
    });

    if (!aiOpponent) {
      throw new Error('AI Opponent not found');
    }

    // Get all available cards
    const allCards = await this.cardRepository.find();

    // Filter cards based on AI opponent preferences
    const preferredCards = this.filterCardsByPreferences(allCards, aiOpponent);

    // Generate deck based on AI personality and preferences
    const deck = await this.buildDeckForPersonality(preferredCards, aiOpponent);

    return {
      deckId: `ai_deck_${aiOpponentId}_${Date.now()}`,
      name: `${aiOpponent.name}'s Deck`,
      description: this.generateDeckDescription(deck, aiOpponent),
      cards: deck.cards,
      strategy: this.generateStrategyDescription(deck, aiOpponent),
      confidence: this.calculateDeckConfidence(deck, aiOpponent),
      expectedWinRate: this.calculateExpectedWinRate(deck, aiOpponent),
      difficulty: aiOpponent.difficulty,
    };
  }

  private filterCardsByPreferences(cards: Card[], aiOpponent: AiOpponent): Card[] {
    return cards.filter(card => {
      // Filter by preferred elements
      if (aiOpponent.preferredElements.length > 0) {
        const hasPreferredElement = card.elements.some(element => 
          aiOpponent.preferredElements.includes(element)
        );
        if (!hasPreferredElement) return false;
      }

      // Filter by deck preferences
      const preferences = aiOpponent.deckPreferences;
      
      // Check card count limits
      if (preferences.minCards && card.azothCost < preferences.minCards) return false;
      if (preferences.maxCards && card.azothCost > preferences.maxCards) return false;
      if (preferences.maxCost && card.azothCost > preferences.maxCost) return false;

      // Check preferred types
      if (preferences.preferredTypes.length > 0) {
        if (!preferences.preferredTypes.includes(card.lesserType)) return false;
      }

      // Check preferred rarities
      if (preferences.preferredRarities.length > 0) {
        if (!preferences.preferredRarities.includes(card.rarity)) return false;
      }

      return true;
    });
  }

  private async buildDeckForPersonality(
    cards: Card[],
    aiOpponent: AiOpponent
  ): Promise<{ cards: Array<{ cardId: string; cardName: string; quantity: number; reasoning: string }> }> {
    const deckCards: Array<{ cardId: string; cardName: string; quantity: number; reasoning: string }> = [];
    const maxCards = aiOpponent.deckPreferences.maxCards || 40;
    const personality = aiOpponent.personality;

    // Sort cards by value based on AI personality
    const sortedCards = this.sortCardsByPersonality(cards, personality);

    let currentCards = 0;
    const cardCounts = new Map<string, number>();

    for (const card of sortedCards) {
      if (currentCards >= maxCards) break;

      // Determine quantity based on card type and personality
      const quantity = this.determineCardQuantity(card, personality, cardCounts);
      
      if (quantity > 0 && currentCards + quantity <= maxCards) {
        deckCards.push({
          cardId: card.id,
          cardName: card.name,
          quantity,
          reasoning: this.generateCardReasoning(card, personality),
        });
        
        cardCounts.set(card.id, quantity);
        currentCards += quantity;
      }
    }

    return { cards: deckCards };
  }

  private sortCardsByPersonality(cards: Card[], personality: AiOpponent['personality']): Card[] {
    return cards.sort((a, b) => {
      const aValue = this.calculateCardValue(a, personality);
      const bValue = this.calculateCardValue(b, personality);
      return bValue - aValue;
    });
  }

  private calculateCardValue(card: Card, personality: AiOpponent['personality']): number {
    let value = 0;

    // Base value from card stats
    value += (card.power || 0) + (card.toughness || 0);
    value += card.azothCost * 0.5; // Cost efficiency

    // Personality modifiers
    if (card.lesserType === 'Creature' && (card.power || 0) > 0) {
      value += personality.aggression * 0.1; // Aggressive AI likes creatures
    }

    if (card.rulesText && card.rulesText.length > 50) {
      value += personality.creativity * 0.05; // Creative AI likes complex cards
    }

    if (card.azothCost <= 2) {
      value += personality.riskTolerance * 0.1; // Risk-tolerant AI likes low-cost cards
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

  private determineCardQuantity(
    card: Card,
    personality: AiOpponent['personality'],
    cardCounts: Map<string, number>
  ): number {
    const currentCount = cardCounts.get(card.id) || 0;
    const maxCopies = this.getMaxCopies(card);

    // Aggressive AI tends to play more copies of good cards
    const aggressionMultiplier = 1 + (personality.aggression / 200);
    const riskMultiplier = 1 + (personality.riskTolerance / 100);

    let quantity = 1;
    
    if (card.lesserType === 'Creature' && (card.power || 0) > 0) {
      quantity = Math.min(maxCopies, Math.floor(2 * aggressionMultiplier));
    } else if (card.lesserType === 'Spell') {
      quantity = Math.min(maxCopies, Math.floor(1.5 * riskMultiplier));
    }

    return Math.min(quantity, maxCopies - currentCount);
  }

  private getMaxCopies(card: Card): number {
    // Basic rarity rules
    if (card.rarity === 'mythic') return 1;
    if (card.rarity === 'rare') return 2;
    if (card.rarity === 'uncommon') return 3;
    return 4; // Common
  }

  private generateCardReasoning(card: Card, personality: AiOpponent['personality']): string {
    const reasons = [];

    if (card.lesserType === 'Creature' && (card.power || 0) > 0) {
      reasons.push('strong creature');
    }

    if (card.azothCost <= 2) {
      reasons.push('low cost');
    }

    if (personality.aggression > 70 && (card.power || 0) > 0) {
      reasons.push('aggressive play');
    }

    if (personality.creativity > 70 && card.rulesText && card.rulesText.length > 50) {
      reasons.push('complex strategy');
    }

    if (personality.riskTolerance > 70 && card.azothCost <= 1) {
      reasons.push('high risk, high reward');
    }

    return reasons.length > 0 ? reasons.join(', ') : 'solid choice';
  }

  private generateDeckDescription(
    deck: { cards: Array<{ cardId: string; cardName: string; quantity: number; reasoning: string }> },
    aiOpponent: AiOpponent
  ): string {
    const personality = aiOpponent.personality;
    const totalCards = deck.cards.reduce((sum, card) => sum + card.quantity, 0);
    const avgCost = this.calculateAverageCost(deck.cards);

    let description = `A ${totalCards}-card deck with an average cost of ${avgCost.toFixed(1)}. `;

    if (personality.aggression > 70) {
      description += 'This aggressive deck focuses on early pressure and quick victories. ';
    } else if (personality.aggression < 30) {
      description += 'This defensive deck aims to control the game and win through attrition. ';
    } else {
      description += 'This balanced deck adapts to different game situations. ';
    }

    if (personality.creativity > 70) {
      description += 'It features unique card combinations and complex strategies. ';
    }

    if (personality.riskTolerance > 70) {
      description += 'The deck takes calculated risks for high rewards. ';
    }

    return description.trim();
  }

  private generateStrategyDescription(
    deck: { cards: Array<{ cardId: string; cardName: string; quantity: number; reasoning: string }> },
    aiOpponent: AiOpponent
  ): string {
    const personality = aiOpponent.personality;
    const creatureCount = deck.cards
      .filter(card => card.cardName.includes('Creature'))
      .reduce((sum, card) => sum + card.quantity, 0);
    const spellCount = deck.cards
      .filter(card => card.cardName.includes('Spell'))
      .reduce((sum, card) => sum + card.quantity, 0);

    let strategy = '';

    if (creatureCount > spellCount) {
      strategy = 'Creature-based strategy focusing on board presence';
    } else if (spellCount > creatureCount) {
      strategy = 'Spell-based strategy focusing on direct effects';
    } else {
      strategy = 'Balanced strategy mixing creatures and spells';
    }

    if (personality.aggression > 70) {
      strategy += ' with aggressive early game pressure';
    } else if (personality.aggression < 30) {
      strategy += ' with defensive late game control';
    }

    return strategy;
  }

  private calculateDeckConfidence(
    deck: { cards: Array<{ cardId: string; cardName: string; quantity: number; reasoning: string }> },
    aiOpponent: AiOpponent
  ): number {
    const personality = aiOpponent.personality;
    let confidence = 50; // Base confidence

    // More cards = higher confidence (up to a point)
    const totalCards = deck.cards.reduce((sum, card) => sum + card.quantity, 0);
    confidence += Math.min(20, totalCards - 30);

    // Personality alignment
    confidence += personality.adaptability * 0.2;
    confidence += personality.creativity * 0.1;

    // Deck consistency
    const uniqueCards = deck.cards.length;
    const consistency = uniqueCards / totalCards;
    confidence += consistency * 20;

    return Math.min(100, Math.max(0, confidence));
  }

  private calculateExpectedWinRate(
    deck: { cards: Array<{ cardId: string; cardName: string; quantity: number; reasoning: string }> },
    aiOpponent: AiOpponent
  ): number {
    const personality = aiOpponent.personality;
    let winRate = 50; // Base win rate

    // Difficulty modifier
    const difficultyModifier = {
      'beginner': 0.8,
      'intermediate': 0.9,
      'advanced': 1.0,
      'expert': 1.1,
      'master': 1.2,
    };
    winRate *= difficultyModifier[aiOpponent.difficulty] || 1.0;

    // Personality modifiers
    winRate += personality.adaptability * 0.1;
    winRate += personality.creativity * 0.05;
    winRate += personality.patience * 0.05;

    // Deck quality (simplified)
    const avgCost = this.calculateAverageCost(deck.cards);
    if (avgCost >= 2 && avgCost <= 4) {
      winRate += 5; // Sweet spot for mana curve
    }

    return Math.min(95, Math.max(5, winRate));
  }

  private calculateAverageCost(cards: Array<{ cardId: string; cardName: string; quantity: number; reasoning: string }>): number {
    // This would need to look up actual card costs
    // For now, return a mock value
    return 2.5;
  }
}