import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from '../cards/entities/card.entity';
import { Deck } from '../decks/entities/deck.entity';
import { PriceHistory } from './entities/price-history.entity';
import { MarketplaceCard } from './entities/marketplace-card.entity';
import { TCGPlayerService } from './services/tcgplayer.service';
import { PriceTrackingService } from './services/price-tracking.service';

interface CardSearchResult {
  id: string;
  name: string;
  imageUrl: string;
  currentPrice: number;
  currency: string;
  marketplace: string;
  availability: string;
  priceRanges: {
    low: number;
    mid: number;
    high: number;
    market: number;
  };
}

interface DeckPricing {
  totalValue: number;
  currency: string;
  cardCount: number;
  averagePrice: number;
  priceBreakdown: Array<{
    cardId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    marketplace: string;
  }>;
  budgetAlternatives: Array<{
    cardId: string;
    name: string;
    originalPrice: number;
    alternativePrice: number;
    savings: number;
    savingsPercent: number;
  }>;
}

interface MarketInsights {
  trendingCards: Array<{
    cardId: string;
    name: string;
    priceChange: number;
    changePercent: number;
    trend: 'rising' | 'falling' | 'stable';
  }>;
  marketOverview: {
    totalCards: number;
    averagePrice: number;
    priceChanges: {
      rising: number;
      falling: number;
      stable: number;
    };
  };
  topGainers: Array<{
    cardId: string;
    name: string;
    changePercent: number;
  }>;
  topLosers: Array<{
    cardId: string;
    name: string;
    changePercent: number;
  }>;
}

@Injectable()
export class MarketplaceService {
  private readonly logger = new Logger(MarketplaceService.name);

  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    @InjectRepository(Deck)
    private readonly deckRepository: Repository<Deck>,
    @InjectRepository(PriceHistory)
    private readonly priceHistoryRepository: Repository<PriceHistory>,
    @InjectRepository(MarketplaceCard)
    private readonly marketplaceCardRepository: Repository<MarketplaceCard>,
    private readonly tcgPlayerService: TCGPlayerService,
    private readonly priceTrackingService: PriceTrackingService,
  ) {}

  async searchCards(query: string, filters?: {
    minPrice?: number;
    maxPrice?: number;
    marketplace?: string;
    rarity?: string;
    type?: string;
    element?: string;
  }): Promise<CardSearchResult[]> {
    try {
      // Search across all marketplaces
      const [tcgResults, scryfallResults] = await Promise.all([
        this.tcgPlayerService.searchCards(query, 20),
        this.scryfallService.searchCards(query, 20),
      ]);

      const results: CardSearchResult[] = [];

      // Process TCGPlayer results
      for (const product of tcgResults) {
        try {
          const pricing = await this.tcgPlayerService.getCardPricing([product.productId]);
          const priceData = pricing[0];

          if (priceData && this.matchesFilters(priceData, filters)) {
            results.push({
              id: product.productId.toString(),
              name: product.name,
              imageUrl: product.imageUrl,
              currentPrice: priceData.market || priceData.mid,
              currency: 'USD',
              marketplace: 'tcgplayer',
              availability: 'in_stock',
              priceRanges: {
                low: priceData.low,
                mid: priceData.mid,
                high: priceData.high,
                market: priceData.market,
              },
            });
          }
        } catch (error) {
          this.logger.warn(`Failed to process TCGPlayer result: ${product.name}`, error);
        }
      }

      // Process Scryfall results
      for (const card of scryfallResults) {
        try {
          const usdPrice = card.prices.usd ? parseFloat(card.prices.usd) : null;
          const eurPrice = card.prices.eur ? parseFloat(card.prices.eur) : null;
          const price = usdPrice || eurPrice;

          if (price && this.matchesFilters({ market: price }, filters)) {
            results.push({
              id: card.id,
              name: card.name,
              imageUrl: card.image_uris?.normal || card.image_uris?.small || '',
              currentPrice: price,
              currency: usdPrice ? 'USD' : 'EUR',
              marketplace: 'scryfall',
              availability: 'in_stock',
              priceRanges: {
                low: price,
                mid: price,
                high: price,
                market: price,
              },
            });
          }
        } catch (error) {
          this.logger.warn(`Failed to process Scryfall result: ${card.name}`, error);
        }
      }

      // Sort by price and apply additional filters
      return results
        .filter(result => this.matchesAdvancedFilters(result, filters))
        .sort((a, b) => a.currentPrice - b.currentPrice);
    } catch (error) {
      this.logger.error('Failed to search cards', error);
      throw error;
    }
  }

  async getCardPrices(cardId: string): Promise<MarketplaceCard[]> {
    return this.priceTrackingService.getCurrentPrices(cardId);
  }

  async getCardPriceHistory(cardId: string, marketplace?: string, days = 30): Promise<PriceHistory[]> {
    return this.priceTrackingService.getCardPriceHistory(cardId, marketplace, days);
  }

  async getDeckPricing(deckId: string): Promise<DeckPricing> {
    try {
      const deck = await this.deckRepository.findOne({
        where: { id: deckId },
        relations: ['cards'],
      });

      if (!deck) {
        throw new Error('Deck not found');
      }

      const priceBreakdown: DeckPricing['priceBreakdown'] = [];
      let totalValue = 0;
      let cardCount = 0;

      // Get prices for each card in the deck
      for (const card of deck.cards) {
        const prices = await this.getCardPrices(card.id);
        const bestPrice = prices.reduce((best, current) => 
          current.currentPrice < best.currentPrice ? current : best
        );

        if (bestPrice) {
          const unitPrice = bestPrice.currentPrice;
          const quantity = 1; // Assuming 1 copy per card for now
          const totalPrice = unitPrice * quantity;

          priceBreakdown.push({
            cardId: card.id,
            name: card.name,
            quantity,
            unitPrice,
            totalPrice,
            marketplace: bestPrice.marketplace,
          });

          totalValue += totalPrice;
          cardCount += quantity;
        }
      }

      const averagePrice = cardCount > 0 ? totalValue / cardCount : 0;

      // Get budget alternatives for expensive cards
      const budgetAlternatives: DeckPricing['budgetAlternatives'] = [];
      for (const item of priceBreakdown) {
        if (item.unitPrice > 10) { // Only suggest alternatives for cards over $10
          try {
            const alternatives = await this.priceTrackingService.getBudgetAlternatives(item.cardId, item.unitPrice * 0.7);
            if (alternatives.length > 0) {
              const alternative = alternatives[0];
              const altPrices = await this.getCardPrices(alternative.id);
              const altPrice = altPrices.reduce((best, current) => 
                current.currentPrice < best.currentPrice ? current : best
              );

              if (altPrice && altPrice.currentPrice < item.unitPrice) {
                budgetAlternatives.push({
                  cardId: alternative.id,
                  name: alternative.name,
                  originalPrice: item.unitPrice,
                  alternativePrice: altPrice.currentPrice,
                  savings: item.unitPrice - altPrice.currentPrice,
                  savingsPercent: ((item.unitPrice - altPrice.currentPrice) / item.unitPrice) * 100,
                });
              }
            }
          } catch (error) {
            this.logger.warn(`Failed to get budget alternatives for ${item.name}`, error);
          }
        }
      }

      return {
        totalValue: Math.round(totalValue * 100) / 100,
        currency: 'USD', // Default currency
        cardCount,
        averagePrice: Math.round(averagePrice * 100) / 100,
        priceBreakdown,
        budgetAlternatives,
      };
    } catch (error) {
      this.logger.error(`Failed to get deck pricing for deck ${deckId}`, error);
      throw error;
    }
  }

  async getMarketInsights(): Promise<MarketInsights> {
    try {
      const marketOverview = await this.priceTrackingService.getMarketOverview();
      
      // Get trending cards (simplified implementation)
      const trendingCards = await this.getTrendingCards();
      
      return {
        trendingCards,
        marketOverview: {
          totalCards: marketOverview.totalCards,
          averagePrice: marketOverview.averagePrice,
          priceChanges: marketOverview.priceChanges,
        },
        topGainers: marketOverview.topGainers,
        topLosers: marketOverview.topLosers,
      };
    } catch (error) {
      this.logger.error('Failed to get market insights', error);
      throw error;
    }
  }

  async syncCardPrices(cardId: string): Promise<void> {
    const card = await this.cardRepository.findOne({ where: { id: cardId } });
    if (!card) {
      throw new Error('Card not found');
    }

    await this.priceTrackingService.updateCardPrices(card);
  }

  async syncAllPrices(): Promise<void> {
    const cards = await this.cardRepository.find({ take: 50 });
    
    for (const card of cards) {
      try {
        await this.priceTrackingService.updateCardPrices(card);
        // Add delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        this.logger.warn(`Failed to sync prices for ${card.name}`, error);
      }
    }
  }

  private matchesFilters(priceData: any, filters?: any): boolean {
    if (!filters) return true;

    if (filters.minPrice && priceData.market < filters.minPrice) return false;
    if (filters.maxPrice && priceData.market > filters.maxPrice) return false;

    return true;
  }

  private matchesAdvancedFilters(result: CardSearchResult, filters?: any): boolean {
    if (!filters) return true;

    if (filters.minPrice && result.currentPrice < filters.minPrice) return false;
    if (filters.maxPrice && result.currentPrice > filters.maxPrice) return false;
    if (filters.marketplace && result.marketplace !== filters.marketplace) return false;

    return true;
  }

  private async getTrendingCards(): Promise<MarketInsights['trendingCards']> {
    // Simplified implementation - would need more sophisticated trending logic
    const cards = await this.cardRepository.find({ take: 10 });
    const trendingCards: MarketInsights['trendingCards'] = [];

    for (const card of cards) {
      try {
        const trends = await this.priceTrackingService.getPriceTrends(card.id, 7);
        const trend = trends[0]; // Get the most recent trend

        if (trend && trend.trend !== 'stable') {
          trendingCards.push({
            cardId: card.id,
            name: card.name,
            priceChange: trend.changeAmount,
            changePercent: trend.changePercent,
            trend: trend.trend,
          });
        }
      } catch (error) {
        this.logger.warn(`Failed to get trends for ${card.name}`, error);
      }
    }

    return trendingCards.sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
  }
}