import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Card } from '../../cards/entities/card.entity';
import { PriceHistory } from '../entities/price-history.entity';
import { MarketplaceCard } from '../entities/marketplace-card.entity';
import { TCGPlayerService } from './tcgplayer.service';
import { ScryfallService } from './scryfall.service';

interface PriceAlert {
  cardId: string;
  targetPrice: number;
  condition: 'above' | 'below';
  marketplace: string;
  userId: string;
}

interface PriceTrend {
  cardId: string;
  marketplace: string;
  trend: 'rising' | 'falling' | 'stable';
  changePercent: number;
  changeAmount: number;
  period: string;
}

@Injectable()
export class PriceTrackingService {
  private readonly logger = new Logger(PriceTrackingService.name);

  constructor(
    @InjectRepository(PriceHistory)
    private readonly priceHistoryRepository: Repository<PriceHistory>,
    @InjectRepository(MarketplaceCard)
    private readonly marketplaceCardRepository: Repository<MarketplaceCard>,
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    private readonly tcgPlayerService: TCGPlayerService,
    private readonly scryfallService: ScryfallService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async updateAllPrices(): Promise<void> {
    this.logger.log('Starting scheduled price update...');

    try {
      // Get all cards that need price updates
      const cards = await this.cardRepository.find({
        where: {
          // Only update cards that have been updated in the last 7 days
          updatedAt: MoreThan(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
        },
        take: 100, // Limit to 100 cards per hour to avoid rate limits
      });

      this.logger.log(`Updating prices for ${cards.length} cards`);

      for (const card of cards) {
        try {
          await this.updateCardPrices(card);
          // Add delay to avoid rate limits
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          this.logger.error(`Failed to update prices for card ${card.name}`, error);
        }
      }

      this.logger.log('Scheduled price update completed');
    } catch (error) {
      this.logger.error('Scheduled price update failed', error);
    }
  }

  async updateCardPrices(card: Card): Promise<void> {
    try {
      // Update TCGPlayer prices
      try {
        const tcgPlayerCard = await this.tcgPlayerService.syncCardPrices(card);
        await this.marketplaceCardRepository.save(tcgPlayerCard);
        
        const tcgPriceHistory = await this.tcgPlayerService.createPriceHistory(card, tcgPlayerCard);
        await this.priceHistoryRepository.save(tcgPriceHistory);
      } catch (error) {
        this.logger.warn(`TCGPlayer price update failed for ${card.name}`, error);
      }

      // Update Scryfall prices
      try {
        const scryfallCard = await this.scryfallService.syncCardPrices(card);
        await this.marketplaceCardRepository.save(scryfallCard);
        
        const scryfallPriceHistory = await this.scryfallService.createPriceHistory(card, scryfallCard);
        await this.priceHistoryRepository.save(scryfallPriceHistory);
      } catch (error) {
        this.logger.warn(`Scryfall price update failed for ${card.name}`, error);
      }

    } catch (error) {
      this.logger.error(`Failed to update prices for card ${card.name}`, error);
      throw error;
    }
  }

  async getCardPriceHistory(cardId: string, marketplace?: string, days = 30): Promise<PriceHistory[]> {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    const where: any = {
      cardId,
      date: MoreThan(startDate),
    };

    if (marketplace) {
      where.marketplace = marketplace;
    }

    return this.priceHistoryRepository.find({
      where,
      order: { date: 'ASC' },
    });
  }

  async getCurrentPrices(cardId: string): Promise<MarketplaceCard[]> {
    return this.marketplaceCardRepository.find({
      where: { cardId },
      order: { lastUpdated: 'DESC' },
    });
  }

  async getPriceTrends(cardId: string, days = 7): Promise<PriceTrend[]> {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    const priceHistories = await this.priceHistoryRepository.find({
      where: {
        cardId,
        date: MoreThan(startDate),
      },
      order: { date: 'ASC' },
    });

    const trends: PriceTrend[] = [];
    const groupedByMarketplace = priceHistories.reduce((acc, history) => {
      if (!acc[history.marketplace]) {
        acc[history.marketplace] = [];
      }
      acc[history.marketplace].push(history);
      return acc;
    }, {} as Record<string, PriceHistory[]>);

    for (const [marketplace, histories] of Object.entries(groupedByMarketplace)) {
      if (histories.length < 2) continue;

      const firstPrice = histories[0].price;
      const lastPrice = histories[histories.length - 1].price;
      const changeAmount = lastPrice - firstPrice;
      const changePercent = (changeAmount / firstPrice) * 100;

      let trend: 'rising' | 'falling' | 'stable' = 'stable';
      if (changePercent > 5) trend = 'rising';
      else if (changePercent < -5) trend = 'falling';

      trends.push({
        cardId,
        marketplace,
        trend,
        changePercent: Math.round(changePercent * 100) / 100,
        changeAmount: Math.round(changeAmount * 100) / 100,
        period: `${days} days`,
      });
    }

    return trends;
  }

  async getBudgetAlternatives(cardId: string, maxPrice: number): Promise<Card[]> {
    const card = await this.cardRepository.findOne({ where: { id: cardId } });
    if (!card) return [];

    // Find cards with similar characteristics but lower price
    const alternatives = await this.cardRepository
      .createQueryBuilder('card')
      .leftJoin('marketplace_cards', 'mp', 'mp.cardId = card.id')
      .where('card.id != :cardId', { cardId })
      .andWhere('card.elements && :elements', { elements: card.elements })
      .andWhere('card.lesserType = :type', { type: card.lesserType })
      .andWhere('mp.currentPrice <= :maxPrice', { maxPrice })
      .andWhere('mp.marketplace = :marketplace', { marketplace: 'tcgplayer' })
      .orderBy('mp.currentPrice', 'ASC')
      .limit(10)
      .getMany();

    return alternatives;
  }

  async createPriceAlert(alert: PriceAlert): Promise<void> {
    // This would integrate with a notification system
    this.logger.log(`Price alert created for card ${alert.cardId}: ${alert.condition} ${alert.targetPrice}`);
  }

  async checkPriceAlerts(): Promise<void> {
    // This would check all active price alerts and send notifications
    this.logger.log('Checking price alerts...');
  }

  async getMarketOverview(): Promise<{
    totalCards: number;
    averagePrice: number;
    priceChanges: {
      rising: number;
      falling: number;
      stable: number;
    };
    topGainers: Array<{ cardId: string; name: string; changePercent: number }>;
    topLosers: Array<{ cardId: string; name: string; changePercent: number }>;
  }> {
    const totalCards = await this.marketplaceCardRepository.count();
    
    const avgPriceResult = await this.marketplaceCardRepository
      .createQueryBuilder('mp')
      .select('AVG(mp.currentPrice)', 'average')
      .getRawOne();
    
    const averagePrice = parseFloat(avgPriceResult.average) || 0;

    // Get price trends for all cards
    const allCards = await this.cardRepository.find({ take: 100 });
    const allTrends = await Promise.all(
      allCards.map(card => this.getPriceTrends(card.id, 7))
    );

    const flatTrends = allTrends.flat();
    const priceChanges = {
      rising: flatTrends.filter(t => t.trend === 'rising').length,
      falling: flatTrends.filter(t => t.trend === 'falling').length,
      stable: flatTrends.filter(t => t.trend === 'stable').length,
    };

    // Get top gainers and losers
    const sortedTrends = flatTrends
      .filter(t => t.trend !== 'stable')
      .sort((a, b) => b.changePercent - a.changePercent);

    const topGainers = sortedTrends
      .slice(0, 5)
      .map(t => ({
        cardId: t.cardId,
        name: 'Card Name', // Would need to join with card data
        changePercent: t.changePercent,
      }));

    const topLosers = sortedTrends
      .slice(-5)
      .reverse()
      .map(t => ({
        cardId: t.cardId,
        name: 'Card Name', // Would need to join with card data
        changePercent: t.changePercent,
      }));

    return {
      totalCards,
      averagePrice: Math.round(averagePrice * 100) / 100,
      priceChanges,
      topGainers,
      topLosers,
    };
  }
}