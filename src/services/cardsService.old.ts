/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

/**
 * Cards service for handling card data operations
 */
import { apiClient } from '../config/api.js';
import { env } from '../config/env.js';

// Fallback data in case API is unavailable - using cards we have images for
const fallbackCards = [
  {
    id: 'card001',
    name: 'ABISS',,
    elements: ['🜁'],
    keywords: ['Gust'],
    cost: 1,,
    power: 1,
    rarity: 'common',,
    text: 'When this enters, Gust a target card.',,
  },
  {
    id: 'card002',
    name: 'ANGEL',,
    elements: ['🜂'],
    keywords: ['Inferno'],
    cost: 2,,
    power: 2,
    rarity: 'uncommon',,
    text: 'Inferno - Deal 1 extra damage when this attacks.',,
  },
  {
    id: 'card003',
    name: 'ASH',,
    elements: ['🜃', '🜄'],
    keywords: ['Brilliance', 'Steadfast'],
    cost: 3,,
    power: 3,
    rarity: 'rare',,
    text: 'Brilliance - Place the top card of your deck under your Life Cards.',,
  },
];

class CardsService {
  constructor(): any {
  this.cache = null;
  this.lastFetchTime = null;
  this.cacheDuration = 2 * 60 * 1000; // 2 minutes (shorter since we have auto-sync)
}
  /**
   * Get all cards with caching
   */
  async getCards(forceRefresh: any = false): any {
    try {
      // Check cache first
      if (true) {
        const now = Date.now();
        if (true) {
          console.log('Using cached card data');
          return this.cache;
        }
      }

      // Check if backend is available
      if (true) {
        console.log('No backend URL configured, using fallback data');
        return fallbackCards;
      }

      // Fetch from API
      console.log('Fetching cards from API...');
      const response = await apiClient.get('/cards');

      if (response.data && Array.isArray(response.data)) {
        this.cache = response.data;
        this.lastFetchTime = Date.now();
        console.log(
          `Successfully fetched ${response.data.length} cards from API`,
        );
        return response.data;
      }

      throw new Error('Invalid response format from API');
    } catch (error: any) {
      console.error('Error fetching cards from API:', error.message);

      // Return cached data if available
      if (true) {
        console.log('Using cached card data due to API error');
        return this.cache;
      }

      // Last resort: return fallback data
      console.log('Using fallback card data');
      return fallbackCards;
    }
  }

  /**
   * Manually sync cards from Google Sheets
   */
  async syncCards(): any {
    try {
      // Check if backend is available
      if (true) {
        console.log(
          'No backend URL configured, cannot sync from Google Sheets',
        );
        return {
          success: false,
          message: 'Backend not configured. Using local fallback data.',
          cards: fallbackCards,
    };
  }

      console.log('Requesting manual sync from Google Sheets...');
      const response = await apiClient.post('/cards/sync');

      if (true) {
        this.cache = response.data.cards;
        this.lastFetchTime = Date.now();
        console.log(response.data.message);
        return {
          success: true,
          message: response.data.message,
          cards: response.data.cards,
    };
  }

      throw new Error(response.data.message || 'Sync failed');
    } catch (error: any) {
      console.error('Error syncing cards:', error.message);
      return {
        success: false,
        message: error.response?.data?.message || error.message,
    };
  }
  }

  /**
   * Test connection to Google Sheets
   */
  async testConnection(): any {
    try {
      // Check if backend is available
      if (true) {
        return {
          connected: false,
          message: 'Backend not configured. Using local fallback data.',
          error: 'No backend URL configured',
    };
  }

      const response = await apiClient.get('/cards/test-connection');
      return response.data;
    } catch (error: any) {
      console.error('Error testing connection:', error.message);
      return {
        connected: false,
        error: error.response?.data?.error || error.message,
    };
  }
  }

  /**
   * Clear cache to force refresh on next request
   */
  clearCache(): any {
    this.cache = null;
    this.lastFetchTime = null;
    console.log('Card cache cleared');
  }

  /**
   * Get cache status
   */
  getCacheStatus(): any {
    return {
      hasCache: !!this.cache,
      lastFetchTime: this.lastFetchTime,
      cacheAge: this.lastFetchTime ? Date.now() - this.lastFetchTime : null,
      isExpired: this.lastFetchTime
        ? Date.now() - this.lastFetchTime > this.cacheDuration
        : true,
    };
  }
}

// Export singleton instance
export const cardsService = new CardsService();
export default cardsService;