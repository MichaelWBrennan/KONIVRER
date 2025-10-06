import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Card } from '../../cards/entities/card.entity';
import { PriceHistory } from '../entities/price-history.entity';
import { MarketplaceCard } from '../entities/marketplace-card.entity';

interface TCGPlayerProduct {
  productId: number;
  name: string;
  cleanName: string;
  imageUrl: string;
  categoryId: number;
  groupId: number;
  url: string;
  modifiedOn: string;
  imageCount: number;
  presaleInfo: any;
  extendedImageCount: number;
  customFields: any[];
}

interface TCGPlayerPricing {
  productId: number;
  low: number;
  mid: number;
  high: number;
  market: number;
  directLow: number;
  subTypeName: string;
}

interface TCGPlayerResponse {
  results: TCGPlayerProduct[];
  totalItems: number;
  success: boolean;
  errors: string[];
}

@Injectable()
export class TCGPlayerService {
  private readonly logger = new Logger(TCGPlayerService.name);
  private readonly baseUrl = 'https://api.tcgplayer.com';
  private accessToken: string;
  private tokenExpiry: Date;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const clientId = this.configService.get('TCGPLAYER_CLIENT_ID');
      const clientSecret = this.configService.get('TCGPLAYER_CLIENT_SECRET');

      if (!clientId || !clientSecret) {
        throw new Error('TCGPlayer credentials not configured');
      }

      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/token`, {
          grant_type: 'client_credentials',
          client_id: clientId,
          client_secret: clientSecret,
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = new Date(Date.now() + (response.data.expires_in * 1000) - 60000); // 1 minute buffer
      
      return this.accessToken;
    } catch (error) {
      this.logger.error('Failed to get TCGPlayer access token', error);
      throw error;
    }
  }

  async searchCards(query: string, limit = 50): Promise<TCGPlayerProduct[]> {
    try {
      const token = await this.getAccessToken();
      
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/catalog/products`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          params: {
            name: query,
            limit,
            getExtendedFields: true,
          },
        })
      );

      return response.data.results || [];
    } catch (error) {
      this.logger.error('Failed to search TCGPlayer cards', error);
      throw error;
    }
  }

  async getCardPricing(productIds: number[]): Promise<TCGPlayerPricing[]> {
    try {
      const token = await this.getAccessToken();
      
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/pricing/product/${productIds.join(',')}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
      );

      return response.data.results || [];
    } catch (error) {
      this.logger.error('Failed to get TCGPlayer pricing', error);
      throw error;
    }
  }

  async getCardDetails(productId: number): Promise<TCGPlayerProduct | null> {
    try {
      const token = await this.getAccessToken();
      
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/catalog/products/${productId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
      );

      return response.data.results?.[0] || null;
    } catch (error) {
      this.logger.error('Failed to get TCGPlayer card details', error);
      throw error;
    }
  }

  async syncCardPrices(card: Card): Promise<MarketplaceCard> {
    try {
      // Search for the card on TCGPlayer
      const products = await this.searchCards(card.name, 5);
      const product = products.find(p => 
        p.cleanName.toLowerCase() === card.name.toLowerCase() ||
        p.name.toLowerCase().includes(card.name.toLowerCase())
      );

      if (!product) {
        throw new Error(`Card not found on TCGPlayer: ${card.name}`);
      }

      // Get pricing data
      const pricing = await this.getCardPricing([product.productId]);
      const priceData = pricing[0];

      if (!priceData) {
        throw new Error(`No pricing data available for: ${card.name}`);
      }

      // Create or update marketplace card record
      const marketplaceCard = new MarketplaceCard();
      marketplaceCard.cardId = card.id;
      marketplaceCard.marketplace = 'tcgplayer';
      marketplaceCard.marketplaceId = product.productId.toString();
      marketplaceCard.marketplaceUrl = product.url;
      marketplaceCard.currentPrice = priceData.market || priceData.mid;
      marketplaceCard.currency = 'USD';
      marketplaceCard.availability = 'in_stock';
      marketplaceCard.priceRanges = {
        low: priceData.low,
        mid: priceData.mid,
        high: priceData.high,
        market: priceData.market,
      };
      marketplaceCard.lastUpdated = new Date();

      return marketplaceCard;
    } catch (error) {
      this.logger.error(`Failed to sync TCGPlayer prices for card ${card.name}`, error);
      throw error;
    }
  }

  async createPriceHistory(card: Card, marketplaceCard: MarketplaceCard): Promise<PriceHistory> {
    const priceHistory = new PriceHistory();
    priceHistory.cardId = card.id;
    priceHistory.marketplace = 'tcgplayer';
    priceHistory.price = marketplaceCard.currentPrice;
    priceHistory.currency = marketplaceCard.currency;
    priceHistory.condition = 'near_mint';
    priceHistory.foil = false;
    priceHistory.language = 'en';
    priceHistory.date = new Date();
    priceHistory.listingUrl = marketplaceCard.marketplaceUrl;
    priceHistory.metadata = {
      productId: marketplaceCard.marketplaceId,
      priceRanges: marketplaceCard.priceRanges,
    };

    return priceHistory;
  }
}