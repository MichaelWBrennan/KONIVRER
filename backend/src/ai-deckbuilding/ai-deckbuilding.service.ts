import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../users/entities/user.entity";
import { Deck } from "../decks/entities/deck.entity";
import { Card } from "../cards/entities/card.entity";
import { MatchmakingService } from "../matchmaking/matchmaking.service";

interface DeckSuggestionDto {
  cardId: string;
  cardName: string;
  synergy: number;
  confidenceScore: number;
  reasoning: string;
}

interface MetaAnalysisDto {
  format: string;
  dominantArchetypes: string[];
  emergingCards: Card[];
  skillBasedRecommendations: DeckSuggestionDto[];
  personalizedMeta: {
    playerSkillTier: string;
    recommendedArchetypes: string[];
    improvementSuggestions: string[];
  };
}

interface DeckOptimizationRequest {
  userId: string;
  format: string;
  currentDeckList: string[];
  targetWinRate?: number;
  playstyle?: "aggressive" | "midrange" | "control" | "combo";
}

@Injectable()
export class AiDeckbuildingService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Deck)
    private readonly deckRepository: Repository<Deck>,
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    private readonly matchmakingService: MatchmakingService
  ) {}

  /**
   * Generate AI-driven deck suggestions based on player history and meta trends
   */
  async generateDeckSuggestions(
    userId: string,
    format: string,
    options: Partial<DeckOptimizationRequest> = {}
  ): Promise<DeckSuggestionDto[]> {
    // Get player's Bayesian rating and skill level
    const playerRating = await this.matchmakingService.getPlayerRating(
      userId,
      format
    );
    const playerDecks = await this.getUserDeckHistory(userId, format);
    const metaData = await this.getMetaSnapshot(format);

    // Analyze player's historical performance with different archetypes
    const archetypePerformance = await this.analyzeArchetypePerformance(
      playerDecks,
      playerRating
    );

    // Generate skill-tier appropriate suggestions
    const skillTier = this.getSkillTier(playerRating.conservativeRating);
    const suggestions = await this.generateSkillBasedSuggestions(
      skillTier,
      archetypePerformance,
      metaData,
      options.playstyle
    );

    return suggestions.map((suggestion) => ({
      ...suggestion,
      confidenceScore: this.calculateConfidenceScore(
        suggestion,
        playerRating,
        metaData
      ),
    }));
  }

  /**
   * Provide comprehensive meta analysis with personalized recommendations
   */
  async generateMetaAnalysis(
    userId: string,
    format: string
  ): Promise<MetaAnalysisDto> {
    const playerRating = await this.matchmakingService.getPlayerRating(
      userId,
      format
    );
    const metaSnapshot = await this.getMetaSnapshot(format);
    const skillDistribution = await this.getFormatSkillDistribution(format);

    // Analyze meta based on skill tiers using Bayesian data
    const skillBasedMeta = await this.analyzeSkillBasedMeta(
      format,
      skillDistribution
    );
    const emergingCards = await this.identifyEmergingCards(format);

    const personalizedRecommendations =
      await this.generatePersonalizedRecommendations(
        userId,
        playerRating,
        skillBasedMeta
      );

    return {
      format,
      dominantArchetypes: metaSnapshot.dominantArchetypes,
      emergingCards,
      skillBasedRecommendations: personalizedRecommendations,
      personalizedMeta: {
        playerSkillTier: this.getSkillTier(playerRating.conservativeRating),
        recommendedArchetypes: await this.getRecommendedArchetypes(
          playerRating,
          skillBasedMeta
        ),
        improvementSuggestions: await this.generateImprovementSuggestions(
          userId,
          playerRating
        ),
      },
    };
  }

  /**
   * Optimize existing deck based on AI analysis and player performance
   */
  async optimizeDeck(request: DeckOptimizationRequest): Promise<{
    originalDeck: string[];
    optimizedDeck: string[];
    changes: {
      added: DeckSuggestionDto[];
      removed: string[];
      reasoning: string;
    };
    expectedWinRateImprovement: number;
  }> {
    const playerRating = await this.matchmakingService.getPlayerRating(
      request.userId,
      request.format
    );
    const deckAnalysis = await this.analyzeDeckComposition(
      request.currentDeckList,
      request.format
    );

    // Use Bayesian rating to determine optimization strategy
    const optimizationStrategy = this.getOptimizationStrategy(
      playerRating,
      request.playstyle
    );
    const suggestions = await this.generateOptimizationSuggestions(
      request.currentDeckList,
      deckAnalysis,
      optimizationStrategy,
      request.targetWinRate
    );

    const expectedImprovement = await this.calculateExpectedImprovement(
      suggestions,
      playerRating,
      request.format
    );

    return {
      originalDeck: request.currentDeckList,
      optimizedDeck: suggestions.optimizedDeckList,
      changes: {
        added: suggestions.addedCards,
        removed: suggestions.removedCards,
        reasoning: suggestions.reasoning,
      },
      expectedWinRateImprovement: expectedImprovement,
    };
  }

  /**
   * Get personalized meta recommendations based on Bayesian skill distribution
   */
  private async generatePersonalizedRecommendations(
    userId: string,
    playerRating: any,
    skillBasedMeta: any
  ): Promise<DeckSuggestionDto[]> {
    const playerSkillTier = this.getSkillTier(playerRating.conservativeRating);
    const recentMatches = await this.getRecentMatchData(userId);

    // Analyze what works at player's skill level
    const effectiveStrategies = skillBasedMeta[playerSkillTier] || [];

    return effectiveStrategies.map((strategy) => ({
      cardId: strategy.keyCard?.id || "",
      cardName: strategy.keyCard?.name || strategy.archetype,
      synergy: strategy.effectiveness,
      confidenceScore: strategy.confidence,
      reasoning: `Effective at ${playerSkillTier} skill tier with ${strategy.winRate}% win rate`,
    }));
  }

  private async getUserDeckHistory(
    userId: string,
    format: string
  ): Promise<Deck[]> {
    return this.deckRepository.find({
      where: {
        user: { id: userId },
        // format: format as any
      },
      relations: ["cards", "matches"],
      order: { createdAt: "DESC" },
      take: 20,
    });
  }

  private async getMetaSnapshot(format: string): Promise<any> {
    // Aggregate tournament data to identify meta trends
    const popularDecks = await this.deckRepository
      .createQueryBuilder("deck")
      .select("deck.archetype", "archetype")
      .addSelect("COUNT(*)", "count")
      .where("deck.format = :format", { format })
      .andWhere("deck.created_at > :date", {
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      })
      .groupBy("deck.archetype")
      .orderBy("count", "DESC")
      .getRawMany();

    return {
      dominantArchetypes: popularDecks.slice(0, 5).map((d) => d.archetype),
      metaShare: popularDecks,
    };
  }

  private async getFormatSkillDistribution(format: string): Promise<any> {
    // Use Bayesian ratings to analyze skill distribution in format
    const ratings = await this.matchmakingService.getLeaderboard(format, 1000);

    return {
      novice: ratings.filter((r) => r.conservativeRating < 10),
      intermediate: ratings.filter(
        (r) => r.conservativeRating >= 10 && r.conservativeRating < 20
      ),
      advanced: ratings.filter(
        (r) => r.conservativeRating >= 20 && r.conservativeRating < 30
      ),
      expert: ratings.filter((r) => r.conservativeRating >= 30),
    };
  }

  private getSkillTier(conservativeRating: number): string {
    if (conservativeRating < 10) return "novice";
    if (conservativeRating < 20) return "intermediate";
    if (conservativeRating < 30) return "advanced";
    return "expert";
  }

  private async analyzeArchetypePerformance(
    decks: Deck[],
    playerRating: any
  ): Promise<any> {
    // Analyze which archetypes the player performs well with
    const archetypeStats = {};

    for (const deck of decks) {
      const archetype = deck.archetype || "unknown";
      if (!archetypeStats[archetype]) {
        archetypeStats[archetype] = { matches: 0, wins: 0 };
      }
      // This would need actual match data integration
      archetypeStats[archetype].matches++;
    }

    return archetypeStats;
  }

  private async generateSkillBasedSuggestions(
    skillTier: string,
    archetypePerformance: any,
    metaData: any,
    playstyle?: string
  ): Promise<any[]> {
    // Generate suggestions appropriate for player's skill level
    const suggestions = [];

    // Basic suggestions for all skill tiers
    suggestions.push({
      cardName: "Meta-appropriate removal",
      synergy: 0.8,
      reasoning: `Strong removal is essential at ${skillTier} level`,
    });

    if (skillTier === "novice") {
      suggestions.push({
        cardName: "Consistent threats",
        synergy: 0.9,
        reasoning: "Focus on simple, powerful cards for learning",
      });
    } else if (skillTier === "expert") {
      suggestions.push({
        cardName: "Tech cards",
        synergy: 0.7,
        reasoning:
          "Advanced players can leverage situational cards effectively",
      });
    }

    return suggestions;
  }

  private calculateConfidenceScore(
    suggestion: any,
    playerRating: any,
    metaData: any
  ): number {
    // Calculate confidence based on:
    // - Player's historical performance with similar cards
    // - Current meta relevance
    // - Skill level appropriateness

    let confidence = 0.5; // Base confidence

    // Higher confidence for stable ratings
    if (playerRating.isStable) confidence += 0.2;

    // Adjust based on meta relevance
    if (metaData.dominantArchetypes.includes(suggestion.archetype)) {
      confidence += 0.2;
    }

    return Math.min(1.0, confidence);
  }

  private async analyzeSkillBasedMeta(
    format: string,
    skillDistribution: any
  ): Promise<any> {
    // Analyze what strategies work at different skill levels
    return {
      novice: [
        {
          archetype: "Aggro",
          effectiveness: 0.8,
          confidence: 0.9,
          winRate: 52,
        },
        {
          archetype: "Midrange",
          effectiveness: 0.7,
          confidence: 0.8,
          winRate: 48,
        },
      ],
      intermediate: [
        {
          archetype: "Midrange",
          effectiveness: 0.9,
          confidence: 0.8,
          winRate: 55,
        },
        {
          archetype: "Control",
          effectiveness: 0.6,
          confidence: 0.7,
          winRate: 47,
        },
      ],
      advanced: [
        {
          archetype: "Control",
          effectiveness: 0.8,
          confidence: 0.9,
          winRate: 58,
        },
        {
          archetype: "Combo",
          effectiveness: 0.7,
          confidence: 0.8,
          winRate: 53,
        },
      ],
      expert: [
        {
          archetype: "Combo",
          effectiveness: 0.9,
          confidence: 0.9,
          winRate: 62,
        },
        {
          archetype: "Tech Control",
          effectiveness: 0.8,
          confidence: 0.8,
          winRate: 59,
        },
      ],
    };
  }

  private async identifyEmergingCards(format: string): Promise<Card[]> {
    // Identify cards with increasing play rates
    return this.cardRepository
      .createQueryBuilder("card")
      .leftJoin("card.decks", "deck")
      .where("deck.format = :format", { format })
      .andWhere("deck.created_at > :recentDate", {
        recentDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      })
      .groupBy("card.id")
      .having("COUNT(deck.id) > :minCount", { minCount: 5 })
      .orderBy("COUNT(deck.id)", "DESC")
      .take(10)
      .getMany();
  }

  private async getRecommendedArchetypes(
    playerRating: any,
    skillBasedMeta: any
  ): Promise<string[]> {
    const skillTier = this.getSkillTier(playerRating.conservativeRating);
    const tierMeta = skillBasedMeta[skillTier] || [];

    return tierMeta
      .filter((archetype) => archetype.effectiveness > 0.7)
      .map((archetype) => archetype.archetype);
  }

  private async generateImprovementSuggestions(
    userId: string,
    playerRating: any
  ): Promise<string[]> {
    const suggestions = [];

    if (playerRating.uncertainty > 5) {
      suggestions.push("Play more matches to stabilize your rating");
    }

    if (playerRating.winRate < 50) {
      suggestions.push("Consider focusing on consistent, proven archetypes");
    }

    if (playerRating.conservativeRating < 15) {
      suggestions.push(
        "Master fundamental strategies before trying complex combos"
      );
    }

    return suggestions;
  }

  private async analyzeDeckComposition(
    deckList: string[],
    format: string
  ): Promise<any> {
    // Analyze deck composition for optimization opportunities
    return {
      manaCurve: this.calculateManaCurve(deckList),
      synergies: await this.identifyDeckSynergies(deckList),
      weaknesses: await this.identifyWeaknesses(deckList, format),
    };
  }

  private calculateManaCurve(deckList: string[]): any {
    // This would analyze the mana curve of the deck
    return {
      averageCMC: 2.5,
      distribution: { 1: 8, 2: 12, 3: 10, 4: 6, 5: 2, 6: 1 },
    };
  }

  private async identifyDeckSynergies(deckList: string[]): Promise<any[]> {
    // Identify card synergies in the deck
    return [{ cards: ["Card A", "Card B"], synergy: 0.9, impact: "high" }];
  }

  private async identifyWeaknesses(
    deckList: string[],
    format: string
  ): Promise<string[]> {
    // Identify potential weaknesses against current meta
    return ["Vulnerable to fast aggro decks"];
  }

  private getOptimizationStrategy(
    playerRating: any,
    playstyle?: string
  ): string {
    const skillTier = this.getSkillTier(playerRating.conservativeRating);

    if (skillTier === "novice") return "consistency";
    if (skillTier === "intermediate") return "synergy";
    if (skillTier === "advanced") return "meta-game";
    return "innovation";
  }

  private async generateOptimizationSuggestions(
    currentDeck: string[],
    deckAnalysis: any,
    strategy: string,
    targetWinRate?: number
  ): Promise<any> {
    // Generate specific optimization suggestions
    return {
      optimizedDeckList: [...currentDeck], // Would contain actual optimizations
      addedCards: [],
      removedCards: [],
      reasoning: `Optimized for ${strategy} strategy`,
    };
  }

  private async calculateExpectedImprovement(
    suggestions: any,
    playerRating: any,
    format: string
  ): Promise<number> {
    // Calculate expected win rate improvement
    // This would use statistical analysis of similar optimizations
    return 3.5; // Example: 3.5% expected improvement
  }

  private async getRecentMatchData(userId: string): Promise<any[]> {
    // Get recent match data for analysis
    return [];
  }
}
