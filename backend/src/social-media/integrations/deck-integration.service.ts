import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deck } from '../../decks/entities/deck.entity';
import { Card } from '../../cards/entities/card.entity';
import { SocialMediaRealService } from '../social-media-real.service';

export interface DeckSocialData {
  id: string;
  name: string;
  format: string;
  cardCount: number;
  winRate: number;
  strategy: string;
  topCards: string[];
  imageUrl: string;
  lastUpdated: string;
  author: string;
  tags: string[];
  description: string;
}

@Injectable()
export class DeckIntegrationService {
  private readonly logger = new Logger(DeckIntegrationService.name);

  constructor(
    @InjectRepository(Deck)
    private readonly deckRepository: Repository<Deck>,
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    private readonly socialMediaService: SocialMediaRealService,
  ) {}

  /**
   * Get deck data formatted for social media sharing
   */
  async getDeckSocialData(deckId: string): Promise<DeckSocialData> {
    try {
      const deck = await this.deckRepository.findOne({
        where: { id: deckId },
        relations: ['cards', 'user'],
      });

      if (!deck) {
        throw new Error(`Deck ${deckId} not found`);
      }

      // Calculate win rate from deck statistics
      const winRate = await this.calculateDeckWinRate(deckId);
      
      // Get top cards by usage
      const topCards = await this.getTopCards(deckId);
      
      // Generate deck image
      const imageUrl = await this.generateDeckImage(deck);

      return {
        id: deck.id,
        name: deck.name,
        format: deck.format || 'Standard',
        cardCount: deck.cards?.length || 0,
        winRate,
        strategy: deck.description || 'No strategy provided',
        topCards,
        imageUrl,
        lastUpdated: deck.updatedAt?.toISOString() || new Date().toISOString(),
        author: deck.user?.username || 'Unknown',
        tags: deck.tags || [],
        description: deck.description || '',
      };
    } catch (error) {
      this.logger.error(`Failed to get deck social data for ${deckId}:`, error);
      throw error;
    }
  }

  /**
   * Share deck to social media platforms
   */
  async shareDeck(
    deckId: string,
    userId: string,
    platforms: string[],
    customMessage?: string
  ): Promise<any[]> {
    try {
      const deckData = await this.getDeckSocialData(deckId);
      
      const results = await this.socialMediaService.shareContent({
        userId,
        content: {
          type: 'deck',
          data: deckData,
        },
        platforms: platforms as any[],
        message: customMessage,
      });

      // Log the share event
      await this.logDeckShare(deckId, userId, platforms, results);

      return results;
    } catch (error) {
      this.logger.error(`Failed to share deck ${deckId}:`, error);
      throw error;
    }
  }

  /**
   * Share deck update when deck is modified
   */
  async shareDeckUpdate(
    deckId: string,
    userId: string,
    updateType: 'created' | 'modified' | 'published'
  ): Promise<void> {
    try {
      const deckData = await this.getDeckSocialData(deckId);
      
      let message = '';
      switch (updateType) {
        case 'created':
          message = `Just created a new ${deckData.format} deck: ${deckData.name}!`;
          break;
        case 'modified':
          message = `Updated my ${deckData.format} deck: ${deckData.name}!`;
          break;
        case 'published':
          message = `Published my ${deckData.format} deck: ${deckData.name}!`;
          break;
      }

      await this.socialMediaService.shareContent({
        userId,
        content: {
          type: 'deck',
          data: deckData,
        },
        platforms: ['discord', 'twitter'],
        message,
      });
    } catch (error) {
      this.logger.error(`Failed to share deck update for ${deckId}:`, error);
    }
  }

  /**
   * Get deck performance analytics for social sharing
   */
  async getDeckAnalytics(deckId: string): Promise<{
    totalShares: number;
    platformBreakdown: Record<string, number>;
    engagementRate: number;
    topPerformingPlatform: string;
  }> {
    try {
      // This would query your analytics database
      // For now, return mock data
      return {
        totalShares: Math.floor(Math.random() * 100),
        platformBreakdown: {
          discord: Math.floor(Math.random() * 30),
          twitter: Math.floor(Math.random() * 40),
          reddit: Math.floor(Math.random() * 20),
          instagram: Math.floor(Math.random() * 10),
        },
        engagementRate: Math.random() * 10 + 5, // 5-15%
        topPerformingPlatform: 'twitter',
      };
    } catch (error) {
      this.logger.error(`Failed to get deck analytics for ${deckId}:`, error);
      return {
        totalShares: 0,
        platformBreakdown: {},
        engagementRate: 0,
        topPerformingPlatform: 'none',
      };
    }
  }

  /**
   * Calculate deck win rate from match data
   */
  private async calculateDeckWinRate(deckId: string): Promise<number> {
    try {
      // This would query your match results database
      // For now, return a mock calculation
      const mockWinRate = Math.floor(Math.random() * 40) + 30; // 30-70%
      return mockWinRate;
    } catch (error) {
      this.logger.error(`Failed to calculate win rate for deck ${deckId}:`, error);
      return 0;
    }
  }

  /**
   * Get top cards by usage in the deck
   */
  private async getTopCards(deckId: string): Promise<string[]> {
    try {
      const deck = await this.deckRepository.findOne({
        where: { id: deckId },
        relations: ['cards'],
      });

      if (!deck?.cards) {
        return [];
      }

      // Sort cards by count and return top 5
      const cardCounts = deck.cards.reduce((acc, card) => {
        acc[card.name] = (acc[card.name] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(cardCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name]) => name);
    } catch (error) {
      this.logger.error(`Failed to get top cards for deck ${deckId}:`, error);
      return [];
    }
  }

  /**
   * Generate deck image using external service
   */
  private async generateDeckImage(deck: Deck): Promise<string> {
    try {
      // This would call your image generation service
      // For now, return a placeholder URL
      return `https://konivrer.com/api/decks/${deck.id}/image?t=${Date.now()}`;
    } catch (error) {
      this.logger.error(`Failed to generate deck image for ${deck.id}:`, error);
      return 'https://konivrer.com/assets/deck-placeholder.png';
    }
  }

  /**
   * Log deck share event for analytics
   */
  private async logDeckShare(
    deckId: string,
    userId: string,
    platforms: string[],
    results: any[]
  ): Promise<void> {
    try {
      // This would log to your analytics database
      this.logger.log(`Deck ${deckId} shared by user ${userId} to platforms: ${platforms.join(', ')}`);
      
      // Log successful shares
      const successfulShares = results.filter(r => r.success);
      if (successfulShares.length > 0) {
        this.logger.log(`Successful shares: ${successfulShares.map(r => r.platform).join(', ')}`);
      }
      
      // Log failed shares
      const failedShares = results.filter(r => !r.success);
      if (failedShares.length > 0) {
        this.logger.warn(`Failed shares: ${failedShares.map(r => `${r.platform}: ${r.error}`).join(', ')}`);
      }
    } catch (error) {
      this.logger.error('Failed to log deck share:', error);
    }
  }

  /**
   * Get trending decks for social media
   */
  async getTrendingDecks(limit: number = 10): Promise<DeckSocialData[]> {
    try {
      // This would query your analytics database for trending decks
      // For now, return mock data
      const trendingDecks: DeckSocialData[] = [];
      
      for (let i = 0; i < limit; i++) {
        trendingDecks.push({
          id: `trending-deck-${i}`,
          name: `Trending Deck ${i + 1}`,
          format: 'Standard',
          cardCount: 40,
          winRate: Math.floor(Math.random() * 40) + 30,
          strategy: 'Aggro Control',
          topCards: ['Card A', 'Card B', 'Card C'],
          imageUrl: `https://konivrer.com/assets/trending-deck-${i}.png`,
          lastUpdated: new Date().toISOString(),
          author: `Player${i + 1}`,
          tags: ['trending', 'popular'],
          description: 'A popular deck in the current meta',
        });
      }
      
      return trendingDecks;
    } catch (error) {
      this.logger.error('Failed to get trending decks:', error);
      return [];
    }
  }

  /**
   * Get deck recommendations for social sharing
   */
  async getDeckRecommendations(userId: string): Promise<DeckSocialData[]> {
    try {
      // This would analyze user's preferences and suggest decks
      // For now, return mock recommendations
      return [
        {
          id: 'rec-1',
          name: 'Recommended Deck 1',
          format: 'Standard',
          cardCount: 40,
          winRate: 65,
          strategy: 'Control',
          topCards: ['Card X', 'Card Y', 'Card Z'],
          imageUrl: 'https://konivrer.com/assets/rec-deck-1.png',
          lastUpdated: new Date().toISOString(),
          author: 'MetaPlayer',
          tags: ['recommended', 'control'],
          description: 'A strong control deck for the current meta',
        },
      ];
    } catch (error) {
      this.logger.error('Failed to get deck recommendations:', error);
      return [];
    }
  }
}