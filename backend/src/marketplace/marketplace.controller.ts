import { Controller, Get, Post, Query, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { MarketplaceService } from './marketplace.service';
import { PriceTrackingService } from './services/price-tracking.service';

interface CardSearchQuery {
  query: string;
  minPrice?: number;
  maxPrice?: number;
  marketplace?: string;
  rarity?: string;
  type?: string;
  element?: string;
}

interface PriceHistoryQuery {
  marketplace?: string;
  days?: number;
}

@ApiTags('Marketplace')
@Controller('marketplace')
export class MarketplaceController {
  constructor(
    private readonly marketplaceService: MarketplaceService,
    private readonly priceTrackingService: PriceTrackingService,
  ) {}

  @Get('search')
  @ApiOperation({ summary: 'Search for cards across marketplaces' })
  @ApiResponse({ status: 200, description: 'Cards found successfully' })
  @ApiQuery({ name: 'query', description: 'Search query', required: true })
  @ApiQuery({ name: 'minPrice', description: 'Minimum price filter', required: false })
  @ApiQuery({ name: 'maxPrice', description: 'Maximum price filter', required: false })
  @ApiQuery({ name: 'marketplace', description: 'Marketplace filter', required: false })
  @ApiQuery({ name: 'rarity', description: 'Rarity filter', required: false })
  @ApiQuery({ name: 'type', description: 'Card type filter', required: false })
  @ApiQuery({ name: 'element', description: 'Element filter', required: false })
  async searchCards(@Query() query: CardSearchQuery) {
    try {
      const results = await this.marketplaceService.searchCards(query.query, {
        minPrice: query.minPrice,
        maxPrice: query.maxPrice,
        marketplace: query.marketplace,
        rarity: query.rarity,
        type: query.type,
        element: query.element,
      });

      return {
        success: true,
        data: results,
        total: results.length,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to search cards',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('cards/:cardId/prices')
  @ApiOperation({ summary: 'Get current prices for a card' })
  @ApiResponse({ status: 200, description: 'Prices retrieved successfully' })
  @ApiParam({ name: 'cardId', description: 'Card ID' })
  async getCardPrices(@Param('cardId') cardId: string) {
    try {
      const prices = await this.marketplaceService.getCardPrices(cardId);

      return {
        success: true,
        data: prices,
        total: prices.length,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to get card prices',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('cards/:cardId/price-history')
  @ApiOperation({ summary: 'Get price history for a card' })
  @ApiResponse({ status: 200, description: 'Price history retrieved successfully' })
  @ApiParam({ name: 'cardId', description: 'Card ID' })
  @ApiQuery({ name: 'marketplace', description: 'Marketplace filter', required: false })
  @ApiQuery({ name: 'days', description: 'Number of days to look back', required: false })
  async getCardPriceHistory(
    @Param('cardId') cardId: string,
    @Query() query: PriceHistoryQuery,
  ) {
    try {
      const history = await this.marketplaceService.getCardPriceHistory(
        cardId,
        query.marketplace,
        query.days || 30,
      );

      return {
        success: true,
        data: history,
        total: history.length,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to get price history',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('decks/:deckId/pricing')
  @ApiOperation({ summary: 'Get deck pricing breakdown' })
  @ApiResponse({ status: 200, description: 'Deck pricing retrieved successfully' })
  @ApiParam({ name: 'deckId', description: 'Deck ID' })
  async getDeckPricing(@Param('deckId') deckId: string) {
    try {
      const pricing = await this.marketplaceService.getDeckPricing(deckId);

      return {
        success: true,
        data: pricing,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to get deck pricing',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('insights')
  @ApiOperation({ summary: 'Get market insights and trends' })
  @ApiResponse({ status: 200, description: 'Market insights retrieved successfully' })
  async getMarketInsights() {
    try {
      const insights = await this.marketplaceService.getMarketInsights();

      return {
        success: true,
        data: insights,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to get market insights',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('cards/:cardId/sync')
  @ApiOperation({ summary: 'Sync prices for a specific card' })
  @ApiResponse({ status: 200, description: 'Card prices synced successfully' })
  @ApiParam({ name: 'cardId', description: 'Card ID' })
  async syncCardPrices(@Param('cardId') cardId: string) {
    try {
      await this.marketplaceService.syncCardPrices(cardId);

      return {
        success: true,
        message: 'Card prices synced successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to sync card prices',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('sync-all')
  @ApiOperation({ summary: 'Sync prices for all cards' })
  @ApiResponse({ status: 200, description: 'All card prices synced successfully' })
  async syncAllPrices() {
    try {
      await this.marketplaceService.syncAllPrices();

      return {
        success: true,
        message: 'All card prices synced successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to sync all prices',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('cards/:cardId/trends')
  @ApiOperation({ summary: 'Get price trends for a card' })
  @ApiResponse({ status: 200, description: 'Price trends retrieved successfully' })
  @ApiParam({ name: 'cardId', description: 'Card ID' })
  @ApiQuery({ name: 'days', description: 'Number of days to analyze', required: false })
  async getCardTrends(
    @Param('cardId') cardId: string,
    @Query('days') days?: number,
  ) {
    try {
      const trends = await this.priceTrackingService.getPriceTrends(cardId, days || 7);

      return {
        success: true,
        data: trends,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to get card trends',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('cards/:cardId/alternatives')
  @ApiOperation({ summary: 'Get budget alternatives for a card' })
  @ApiResponse({ status: 200, description: 'Budget alternatives retrieved successfully' })
  @ApiParam({ name: 'cardId', description: 'Card ID' })
  @ApiQuery({ name: 'maxPrice', description: 'Maximum price for alternatives', required: false })
  async getBudgetAlternatives(
    @Param('cardId') cardId: string,
    @Query('maxPrice') maxPrice?: number,
  ) {
    try {
      const alternatives = await this.priceTrackingService.getBudgetAlternatives(
        cardId,
        maxPrice || 50,
      );

      return {
        success: true,
        data: alternatives,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to get budget alternatives',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('overview')
  @ApiOperation({ summary: 'Get market overview statistics' })
  @ApiResponse({ status: 200, description: 'Market overview retrieved successfully' })
  async getMarketOverview() {
    try {
      const overview = await this.priceTrackingService.getMarketOverview();

      return {
        success: true,
        data: overview,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to get market overview',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}