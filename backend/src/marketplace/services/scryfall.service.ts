import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Card } from '../../cards/entities/card.entity';
import { PriceHistory } from '../entities/price-history.entity';
import { MarketplaceCard } from '../entities/marketplace-card.entity';

interface ScryfallCard {
  id: string;
  name: string;
  mana_cost?: string;
  cmc: number;
  type_line: string;
  oracle_text?: string;
  power?: string;
  toughness?: string;
  colors: string[];
  color_identity: string[];
  legalities: Record<string, string>;
  prices: {
    usd?: string;
    usd_foil?: string;
    eur?: string;
    eur_foil?: string;
    tix?: string;
  };
  image_uris?: {
    small: string;
    normal: string;
    large: string;
    png: string;
    art_crop: string;
    border_crop: string;
  };
  set: string;
  set_name: string;
  rarity: string;
  collector_number: string;
  digital: boolean;
  foil: boolean;
  nonfoil: boolean;
  finishes: string[];
  frame: string;
  full_art: boolean;
  textless: boolean;
  booster: boolean;
  story_spotlight: boolean;
  edhrec_rank?: number;
  penny_rank?: number;
  preview?: {
    source: string;
    source_uri: string;
    previewed_at: string;
  };
  related_uris: {
    gatherer?: string;
    tcgplayer_infinite_articles?: string;
    tcgplayer_infinite_decks?: string;
    edhrec?: string;
    mtgtop8?: string;
  };
  purchase_uris: {
    tcgplayer?: string;
    cardmarket?: string;
    cardhoarder?: string;
    mtgo_traders?: string;
    coolstuffinc?: string;
  };
}

interface ScryfallSearchResponse {
  object: string;
  total_cards: number;
  has_more: boolean;
  data: ScryfallCard[];
}

@Injectable()
export class ScryfallService {
  private readonly logger = new Logger(ScryfallService.name);
  private readonly baseUrl = 'https://api.scryfall.com';

  constructor(private readonly httpService: HttpService) {}

  async searchCards(query: string, limit = 50): Promise<ScryfallCard[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/cards/search`, {
          params: {
            q: query,
            order: 'name',
            dir: 'asc',
            unique: 'cards',
            include_extras: false,
            include_multilingual: false,
            include_variations: false,
            page: 1,
            format: 'json',
          },
        })
      );

      return response.data.data || [];
    } catch (error) {
      if (error.response?.status === 404) {
        this.logger.warn(`No cards found for query: ${query}`);
        return [];
      }
      this.logger.error('Failed to search Scryfall cards', error);
      throw error;
    }
  }

  async getCardByName(name: string, exact = false): Promise<ScryfallCard | null> {
    try {
      const query = exact ? `!"${name}"` : name;
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/cards/search`, {
          params: {
            q: query,
            unique: 'cards',
          },
        })
      );

      return response.data.data?.[0] || null;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      this.logger.error(`Failed to get Scryfall card: ${name}`, error);
      throw error;
    }
  }

  async getCardById(id: string): Promise<ScryfallCard | null> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/cards/${id}`)
      );

      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      this.logger.error(`Failed to get Scryfall card by ID: ${id}`, error);
      throw error;
    }
  }

  async getRandomCard(): Promise<ScryfallCard> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/cards/random`)
      );

      return response.data;
    } catch (error) {
      this.logger.error('Failed to get random Scryfall card', error);
      throw error;
    }
  }

  async getCardSets(): Promise<any[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/sets`)
      );

      return response.data.data || [];
    } catch (error) {
      this.logger.error('Failed to get Scryfall sets', error);
      throw error;
    }
  }

  async syncCardPrices(card: Card): Promise<MarketplaceCard> {
    try {
      // Search for the card on Scryfall
      const scryfallCard = await this.getCardByName(card.name);

      if (!scryfallCard) {
        throw new Error(`Card not found on Scryfall: ${card.name}`);
      }

      // Extract pricing data
      const prices = scryfallCard.prices;
      const usdPrice = prices.usd ? parseFloat(prices.usd) : null;
      const eurPrice = prices.eur ? parseFloat(prices.eur) : null;

      if (!usdPrice && !eurPrice) {
        throw new Error(`No pricing data available for: ${card.name}`);
      }

      // Create or update marketplace card record
      const marketplaceCard = new MarketplaceCard();
      marketplaceCard.cardId = card.id;
      marketplaceCard.marketplace = 'scryfall';
      marketplaceCard.marketplaceId = scryfallCard.id;
      marketplaceCard.marketplaceUrl = scryfallCard.purchase_uris?.tcgplayer || '';
      marketplaceCard.currentPrice = usdPrice || eurPrice;
      marketplaceCard.currency = usdPrice ? 'USD' : 'EUR';
      marketplaceCard.availability = 'in_stock';
      marketplaceCard.priceRanges = {
        low: usdPrice || eurPrice,
        mid: usdPrice || eurPrice,
        high: usdPrice || eurPrice,
        market: usdPrice || eurPrice,
      };
      marketplaceCard.foilPrices = {
        regular: usdPrice || eurPrice,
        foil: prices.usd_foil ? parseFloat(prices.usd_foil) : null,
        etched: null,
      };
      marketplaceCard.metadata = {
        scryfallId: scryfallCard.id,
        set: scryfallCard.set,
        set_name: scryfallCard.set_name,
        rarity: scryfallCard.rarity,
        collector_number: scryfallCard.collector_number,
        legalities: scryfallCard.legalities,
        edhrec_rank: scryfallCard.edhrec_rank,
        penny_rank: scryfallCard.penny_rank,
      };
      marketplaceCard.lastUpdated = new Date();

      return marketplaceCard;
    } catch (error) {
      this.logger.error(`Failed to sync Scryfall prices for card ${card.name}`, error);
      throw error;
    }
  }

  async createPriceHistory(card: Card, marketplaceCard: MarketplaceCard): Promise<PriceHistory> {
    const priceHistory = new PriceHistory();
    priceHistory.cardId = card.id;
    priceHistory.marketplace = 'scryfall';
    priceHistory.price = marketplaceCard.currentPrice;
    priceHistory.currency = marketplaceCard.currency;
    priceHistory.condition = 'near_mint';
    priceHistory.foil = false;
    priceHistory.language = 'en';
    priceHistory.date = new Date();
    priceHistory.listingUrl = marketplaceCard.marketplaceUrl;
    priceHistory.metadata = {
      scryfallId: marketplaceCard.marketplaceId,
      set: marketplaceCard.metadata?.set,
      rarity: marketplaceCard.metadata?.rarity,
    };

    return priceHistory;
  }

  async getCardImage(card: Card, size: 'small' | 'normal' | 'large' | 'png' | 'art_crop' | 'border_crop' = 'normal'): Promise<string | null> {
    try {
      const scryfallCard = await this.getCardByName(card.name);
      
      if (!scryfallCard?.image_uris) {
        return null;
      }

      return scryfallCard.image_uris[size] || scryfallCard.image_uris.normal;
    } catch (error) {
      this.logger.error(`Failed to get Scryfall image for card ${card.name}`, error);
      return null;
    }
  }
}