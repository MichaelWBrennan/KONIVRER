import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Deck } from '../decks/entities/deck.entity';
import { PaperEvent } from '../achievements/entities/paper-event.entity';
import { Store } from '../achievements/entities/store.entity';

interface AdvancedAnalytics {
  userInsights: {
    playstyleAnalysis: {
      preferredElements: string[];
      deckArchetypes: string[];
      aggressionLevel: number;
      riskTolerance: number;
      creativityScore: number;
    };
    performanceMetrics: {
      winRateByFormat: Array<{ format: string; winRate: number; gamesPlayed: number }>;
      winRateByElement: Array<{ element: string; winRate: number; gamesPlayed: number }>;
      improvementTrend: Array<{ date: string; rating: number; gamesPlayed: number }>;
      peakPerformance: {
        bestFormat: string;
        bestElement: string;
        bestTimeOfDay: string;
        bestDayOfWeek: string;
      };
    };
    socialMetrics: {
      storeVisits: number;
      favoriteStores: Array<{ storeId: string; storeName: string; visits: number }>;
      communityEngagement: number;
      tournamentParticipation: number;
    };
  };
  metaInsights: {
    formatAnalysis: {
      mostPlayedFormats: Array<{ format: string; popularity: number; winRate: number }>;
      emergingArchetypes: Array<{ archetype: string; growth: number; winRate: number }>;
      decliningArchetypes: Array<{ archetype: string; decline: number; winRate: number }>;
    };
    cardAnalysis: {
      mostPlayedCards: Array<{ cardId: string; cardName: string; playRate: number; winRate: number }>;
      underplayedGems: Array<{ cardId: string; cardName: string; playRate: number; winRate: number }>;
      metaShifts: Array<{ cardId: string; cardName: string; change: number; period: string }>;
    };
    storeAnalysis: {
      mostActiveStores: Array<{ storeId: string; storeName: string; activity: number; averageRating: number }>;
      regionalTrends: Array<{ region: string; popularFormats: string[]; averageSkill: number }>;
    };
  };
  predictiveInsights: {
    deckRecommendations: Array<{
      deckId: string;
      deckName: string;
      confidence: number;
      reasoning: string;
      expectedWinRate: number;
    }>;
    metaPredictions: Array<{
      prediction: string;
      confidence: number;
      timeframe: string;
      reasoning: string;
    }>;
    skillProjections: {
      currentRating: number;
      projectedRating: number;
      timeToNextTier: number;
      recommendedFocus: string[];
    };
  };
}

@Injectable()
export class AdvancedAnalyticsService {
  private readonly logger = new Logger(AdvancedAnalyticsService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Deck)
    private readonly deckRepository: Repository<Deck>,
    @InjectRepository(PaperEvent)
    private readonly paperEventRepository: Repository<PaperEvent>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async getUserAnalytics(userId: string): Promise<AdvancedAnalytics['userInsights']> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    // Get user's paper events
    const paperEvents = await this.paperEventRepository.find({
      where: { userId },
      relations: ['store'],
      order: { eventDate: 'DESC' },
    });

    // Get user's decks
    const decks = await this.deckRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    // Analyze playstyle
    const playstyleAnalysis = this.analyzePlaystyle(paperEvents, decks);
    
    // Analyze performance
    const performanceMetrics = this.analyzePerformance(paperEvents);
    
    // Analyze social metrics
    const socialMetrics = this.analyzeSocialMetrics(paperEvents);

    return {
      playstyleAnalysis,
      performanceMetrics,
      socialMetrics,
    };
  }

  async getMetaAnalytics(): Promise<AdvancedAnalytics['metaInsights']> {
    // Get all paper events for meta analysis
    const allEvents = await this.paperEventRepository.find({
      relations: ['store', 'user'],
      order: { eventDate: 'DESC' },
    });

    // Analyze formats
    const formatAnalysis = this.analyzeFormats(allEvents);
    
    // Analyze cards
    const cardAnalysis = this.analyzeCards(allEvents);
    
    // Analyze stores
    const storeAnalysis = this.analyzeStores(allEvents);

    return {
      formatAnalysis,
      cardAnalysis,
      storeAnalysis,
    };
  }

  async getPredictiveInsights(userId: string): Promise<AdvancedAnalytics['predictiveInsights']> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    // Get user's recent performance
    const recentEvents = await this.paperEventRepository.find({
      where: { userId },
      order: { eventDate: 'DESC' },
      take: 50,
    });

    // Generate deck recommendations
    const deckRecommendations = await this.generateDeckRecommendations(userId, recentEvents);
    
    // Generate meta predictions
    const metaPredictions = await this.generateMetaPredictions();
    
    // Generate skill projections
    const skillProjections = this.generateSkillProjections(user, recentEvents);

    return {
      deckRecommendations,
      metaPredictions,
      skillProjections,
    };
  }

  private analyzePlaystyle(events: PaperEvent[], decks: Deck[]): AdvancedAnalytics['userInsights']['playstyleAnalysis'] {
    // Analyze preferred elements from deck usage
    const elementUsage = new Map<string, number>();
    const archetypeUsage = new Map<string, number>();
    
    decks.forEach(deck => {
      deck.elements.forEach(element => {
        elementUsage.set(element, (elementUsage.get(element) || 0) + 1);
      });
      
      // Determine archetype based on deck composition
      const archetype = this.determineDeckArchetype(deck);
      archetypeUsage.set(archetype, (archetypeUsage.get(archetype) || 0) + 1);
    });

    const preferredElements = Array.from(elementUsage.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([element]) => element);

    const deckArchetypes = Array.from(archetypeUsage.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([archetype]) => archetype);

    // Calculate aggression level based on game results
    const aggressionLevel = this.calculateAggressionLevel(events);
    
    // Calculate risk tolerance based on deck diversity
    const riskTolerance = this.calculateRiskTolerance(decks);
    
    // Calculate creativity score based on unique card choices
    const creativityScore = this.calculateCreativityScore(decks);

    return {
      preferredElements,
      deckArchetypes,
      aggressionLevel,
      riskTolerance,
      creativityScore,
    };
  }

  private analyzePerformance(events: PaperEvent[]): AdvancedAnalytics['userInsights']['performanceMetrics'] {
    const formatStats = new Map<string, { wins: number; total: number }>();
    const elementStats = new Map<string, { wins: number; total: number }>();
    const timeStats = new Map<string, { wins: number; total: number }>();
    const dayStats = new Map<string, { wins: number; total: number }>();

    events.forEach(event => {
      const format = event.tournamentData.format || 'casual';
      const element = this.getPrimaryElementFromDeck(event.deckUsed);
      const hour = new Date(event.eventDate).getHours();
      const day = new Date(event.eventDate).toLocaleDateString('en-US', { weekday: 'long' });

      event.gameResults.forEach(game => {
        if (game.result === 'win') {
          formatStats.set(format, { wins: (formatStats.get(format)?.wins || 0) + 1, total: (formatStats.get(format)?.total || 0) + 1 });
          elementStats.set(element, { wins: (elementStats.get(element)?.wins || 0) + 1, total: (elementStats.get(element)?.total || 0) + 1 });
          timeStats.set(hour.toString(), { wins: (timeStats.get(hour.toString())?.wins || 0) + 1, total: (timeStats.get(hour.toString())?.total || 0) + 1 });
          dayStats.set(day, { wins: (dayStats.get(day)?.wins || 0) + 1, total: (dayStats.get(day)?.total || 0) + 1 });
        } else {
          formatStats.set(format, { wins: formatStats.get(format)?.wins || 0, total: (formatStats.get(format)?.total || 0) + 1 });
          elementStats.set(element, { wins: elementStats.get(element)?.wins || 0, total: (elementStats.get(element)?.total || 0) + 1 });
          timeStats.set(hour.toString(), { wins: timeStats.get(hour.toString())?.wins || 0, total: (timeStats.get(hour.toString())?.total || 0) + 1 });
          dayStats.set(day, { wins: dayStats.get(day)?.wins || 0, total: (dayStats.get(day)?.total || 0) + 1 });
        }
      });
    });

    const winRateByFormat = Array.from(formatStats.entries()).map(([format, stats]) => ({
      format,
      winRate: stats.total > 0 ? (stats.wins / stats.total) * 100 : 0,
      gamesPlayed: stats.total,
    }));

    const winRateByElement = Array.from(elementStats.entries()).map(([element, stats]) => ({
      element,
      winRate: stats.total > 0 ? (stats.wins / stats.total) * 100 : 0,
      gamesPlayed: stats.total,
    }));

    // Find peak performance times
    const bestFormat = winRateByFormat.reduce((best, current) => 
      current.gamesPlayed >= 5 && current.winRate > best.winRate ? current : best, 
      { format: 'Unknown', winRate: 0, gamesPlayed: 0 }
    );

    const bestElement = winRateByElement.reduce((best, current) => 
      current.gamesPlayed >= 5 && current.winRate > best.winRate ? current : best, 
      { element: 'Unknown', winRate: 0, gamesPlayed: 0 }
    );

    const bestTimeOfDay = Array.from(timeStats.entries())
      .filter(([_, stats]) => stats.total >= 3)
      .reduce((best, [hour, stats]) => {
        const winRate = stats.total > 0 ? (stats.wins / stats.total) * 100 : 0;
        return winRate > best.winRate ? { hour, winRate, gamesPlayed: stats.total } : best;
      }, { hour: 'Unknown', winRate: 0, gamesPlayed: 0 });

    const bestDayOfWeek = Array.from(dayStats.entries())
      .filter(([_, stats]) => stats.total >= 3)
      .reduce((best, [day, stats]) => {
        const winRate = stats.total > 0 ? (stats.wins / stats.total) * 100 : 0;
        return winRate > best.winRate ? { day, winRate, gamesPlayed: stats.total } : best;
      }, { day: 'Unknown', winRate: 0, gamesPlayed: 0 });

    return {
      winRateByFormat,
      winRateByElement,
      improvementTrend: [], // Would need historical rating data
      peakPerformance: {
        bestFormat: bestFormat.format,
        bestElement: bestElement.element,
        bestTimeOfDay: bestTimeOfDay.hour,
        bestDayOfWeek: bestDayOfWeek.day,
      },
    };
  }

  private analyzeSocialMetrics(events: PaperEvent[]): AdvancedAnalytics['userInsights']['socialMetrics'] {
    const storeVisits = new Map<string, number>();
    const tournamentCount = events.filter(e => e.eventType === 'tournament').length;

    events.forEach(event => {
      storeVisits.set(event.storeId, (storeVisits.get(event.storeId) || 0) + 1);
    });

    const favoriteStores = Array.from(storeVisits.entries())
      .map(([storeId, visits]) => ({ storeId, storeName: 'Store', visits }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 5);

    return {
      storeVisits: events.length,
      favoriteStores,
      communityEngagement: tournamentCount,
      tournamentParticipation: tournamentCount,
    };
  }

  private analyzeFormats(events: PaperEvent[]): AdvancedAnalytics['metaInsights']['formatAnalysis'] {
    const formatStats = new Map<string, { games: number; wins: number }>();
    
    events.forEach(event => {
      const format = event.tournamentData.format || 'casual';
      const wins = event.gameResults.filter(g => g.result === 'win').length;
      const total = event.gameResults.length;
      
      const current = formatStats.get(format) || { games: 0, wins: 0 };
      formatStats.set(format, { games: current.games + total, wins: current.wins + wins });
    });

    const mostPlayedFormats = Array.from(formatStats.entries())
      .map(([format, stats]) => ({
        format,
        popularity: stats.games,
        winRate: stats.games > 0 ? (stats.wins / stats.games) * 100 : 0,
      }))
      .sort((a, b) => b.popularity - a.popularity);

    return {
      mostPlayedFormats,
      emergingArchetypes: [], // Would need historical data
      decliningArchetypes: [], // Would need historical data
    };
  }

  private analyzeCards(events: PaperEvent[]): AdvancedAnalytics['metaInsights']['cardAnalysis'] {
    const cardStats = new Map<string, { games: number; wins: number; cardName: string }>();
    
    events.forEach(event => {
      const wins = event.gameResults.filter(g => g.result === 'win').length;
      const total = event.gameResults.length;
      
      event.deckUsed.forEach(card => {
        const current = cardStats.get(card.cardId) || { games: 0, wins: 0, cardName: card.cardName };
        cardStats.set(card.cardId, {
          games: current.games + total,
          wins: current.wins + wins,
          cardName: card.cardName,
        });
      });
    });

    const mostPlayedCards = Array.from(cardStats.entries())
      .map(([cardId, stats]) => ({
        cardId,
        cardName: stats.cardName,
        playRate: stats.games,
        winRate: stats.games > 0 ? (stats.wins / stats.games) * 100 : 0,
      }))
      .sort((a, b) => b.playRate - a.playRate)
      .slice(0, 20);

    return {
      mostPlayedCards,
      underplayedGems: [], // Would need more complex analysis
      metaShifts: [], // Would need historical data
    };
  }

  private analyzeStores(events: PaperEvent[]): AdvancedAnalytics['metaInsights']['storeAnalysis'] {
    const storeStats = new Map<string, { events: number; totalGames: number; totalWins: number }>();
    
    events.forEach(event => {
      const current = storeStats.get(event.storeId) || { events: 0, totalGames: 0, totalWins: 0 };
      const wins = event.gameResults.filter(g => g.result === 'win').length;
      const total = event.gameResults.length;
      
      storeStats.set(event.storeId, {
        events: current.events + 1,
        totalGames: current.totalGames + total,
        totalWins: current.totalWins + wins,
      });
    });

    const mostActiveStores = Array.from(storeStats.entries())
      .map(([storeId, stats]) => ({
        storeId,
        storeName: 'Store', // Would need to fetch actual store names
        activity: stats.events,
        averageRating: stats.totalGames > 0 ? (stats.totalWins / stats.totalGames) * 100 : 0,
      }))
      .sort((a, b) => b.activity - a.activity)
      .slice(0, 10);

    return {
      mostActiveStores,
      regionalTrends: [], // Would need store location data
    };
  }

  private async generateDeckRecommendations(userId: string, events: PaperEvent[]): Promise<AdvancedAnalytics['predictiveInsights']['deckRecommendations']> {
    // This would integrate with the AI deckbuilding service
    // For now, return mock data
    return [
      {
        deckId: 'deck1',
        deckName: 'Fire Aggro',
        confidence: 85,
        reasoning: 'Based on your aggressive playstyle and high win rate with Fire element',
        expectedWinRate: 72,
      },
    ];
  }

  private async generateMetaPredictions(): Promise<AdvancedAnalytics['predictiveInsights']['metaPredictions']> {
    // This would use machine learning to predict meta shifts
    return [
      {
        prediction: 'Control decks will see increased play due to aggro dominance',
        confidence: 78,
        timeframe: '2-4 weeks',
        reasoning: 'Historical data shows control decks gain popularity after aggro metas',
      },
    ];
  }

  private generateSkillProjections(user: User, events: PaperEvent[]): AdvancedAnalytics['predictiveInsights']['skillProjections'] {
    const currentRating = user.rating || 1000;
    const recentWinRate = this.calculateRecentWinRate(events);
    
    // Simple projection based on recent performance
    const projectedRating = currentRating + (recentWinRate - 50) * 10;
    const timeToNextTier = Math.max(0, Math.ceil((1200 - currentRating) / 5)); // Assuming 5 rating points per week
    
    return {
      currentRating,
      projectedRating: Math.max(1000, Math.min(2000, projectedRating)),
      timeToNextTier,
      recommendedFocus: ['deck consistency', 'sideboard strategy', 'meta knowledge'],
    };
  }

  // Helper methods
  private determineDeckArchetype(deck: Deck): string {
    // Simple archetype determination based on card types and costs
    const creatureCount = deck.cards.filter(card => card.lesserType === 'Creature').length;
    const spellCount = deck.cards.filter(card => card.lesserType === 'Spell').length;
    const avgCost = deck.cards.reduce((sum, card) => sum + card.azothCost, 0) / deck.cards.length;
    
    if (avgCost < 2) return 'Aggro';
    if (avgCost > 4) return 'Control';
    if (creatureCount > spellCount) return 'Midrange';
    return 'Combo';
  }

  private calculateAggressionLevel(events: PaperEvent[]): number {
    // Calculate based on game length and win rate
    const totalGames = events.reduce((sum, event) => sum + event.gameResults.length, 0);
    const totalWins = events.reduce((sum, event) => 
      sum + event.gameResults.filter(g => g.result === 'win').length, 0);
    const avgGameLength = events.reduce((sum, event) => 
      sum + event.gameResults.reduce((gameSum, game) => gameSum + game.gameLength, 0), 0) / totalGames;
    
    const winRate = totalGames > 0 ? (totalWins / totalGames) * 100 : 50;
    const speedFactor = Math.max(0, 100 - avgGameLength); // Shorter games = more aggressive
    
    return Math.min(100, (winRate + speedFactor) / 2);
  }

  private calculateRiskTolerance(decks: Deck[]): number {
    // Calculate based on deck diversity and card choices
    const uniqueCards = new Set(decks.flatMap(deck => deck.cards.map(card => card.id))).size;
    const totalCards = decks.reduce((sum, deck) => sum + deck.cards.length, 0);
    const diversity = uniqueCards / totalCards;
    
    return Math.min(100, diversity * 100);
  }

  private calculateCreativityScore(decks: Deck[]): number {
    // Calculate based on unique card combinations and rarity choices
    const rareCards = decks.flatMap(deck => deck.cards.filter(card => card.rarity === 'rare' || card.rarity === 'mythic'));
    const totalCards = decks.flatMap(deck => deck.cards);
    const creativity = rareCards.length / totalCards.length;
    
    return Math.min(100, creativity * 100);
  }

  private getPrimaryElementFromDeck(deckUsed: any[]): string {
    const elementCount = new Map<string, number>();
    deckUsed.forEach(card => {
      // This would need to look up the card's elements
      // For now, return a default
    });
    return 'Fire'; // Default
  }

  private calculateRecentWinRate(events: PaperEvent[]): number {
    const recentEvents = events.slice(0, 10); // Last 10 events
    const totalGames = recentEvents.reduce((sum, event) => sum + event.gameResults.length, 0);
    const totalWins = recentEvents.reduce((sum, event) => 
      sum + event.gameResults.filter(g => g.result === 'win').length, 0);
    
    return totalGames > 0 ? (totalWins / totalGames) * 100 : 50;
  }
}