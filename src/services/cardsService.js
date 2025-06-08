/**
 * Cards service for handling card data operations
 */
import { apiClient } from '../config/api.js';

// Fallback data in case API is unavailable
const fallbackCards = [
  {
    id: "card001",
    name: "Gustling Wisp",
    elements: ["🜁"],
    keywords: ["Gust"],
    cost: 1,
    power: 1,
    rarity: "common",
    text: "When this enters, Gust a target card."
  },
  {
    id: "card002",
    name: "Infernal Sprinter",
    elements: ["🜂"],
    keywords: ["Inferno"],
    cost: 2,
    power: 2,
    rarity: "uncommon",
    text: "Inferno - Deal 1 extra damage when this attacks."
  },
  {
    id: "card003",
    name: "Brilliant Watcher",
    elements: ["🜃", "🜄"],
    keywords: ["Brilliance", "Steadfast"],
    cost: 3,
    power: 3,
    rarity: "rare",
    text: "Brilliance - Place the top card of your deck under your Life Cards."
  }
];

class CardsService {
  constructor() {
    this.cache = null;
    this.lastFetchTime = null;
    this.cacheDuration = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Get all cards with caching
   */
  async getCards(forceRefresh = false) {
    try {
      // Check cache first
      if (!forceRefresh && this.cache && this.lastFetchTime) {
        const now = Date.now();
        if (now - this.lastFetchTime < this.cacheDuration) {
          console.log('Using cached card data');
          return this.cache;
        }
      }

      // Fetch from API
      console.log('Fetching cards from API...');
      const response = await apiClient.get('/cards');
      
      if (response.data && Array.isArray(response.data)) {
        this.cache = response.data;
        this.lastFetchTime = Date.now();
        console.log(`Successfully fetched ${response.data.length} cards from API`);
        return response.data;
      }

      throw new Error('Invalid response format from API');

    } catch (error) {
      console.error('Error fetching cards from API:', error.message);
      
      // Return cached data if available
      if (this.cache) {
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
  async syncCards() {
    try {
      console.log('Requesting manual sync from Google Sheets...');
      const response = await apiClient.post('/cards/sync');
      
      if (response.data.success) {
        this.cache = response.data.cards;
        this.lastFetchTime = Date.now();
        console.log(response.data.message);
        return {
          success: true,
          message: response.data.message,
          cards: response.data.cards
        };
      }

      throw new Error(response.data.message || 'Sync failed');

    } catch (error) {
      console.error('Error syncing cards:', error.message);
      return {
        success: false,
        message: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Test connection to Google Sheets
   */
  async testConnection() {
    try {
      const response = await apiClient.get('/cards/test-connection');
      return response.data;
    } catch (error) {
      console.error('Error testing connection:', error.message);
      return {
        connected: false,
        error: error.response?.data?.error || error.message
      };
    }
  }

  /**
   * Clear cache to force refresh on next request
   */
  clearCache() {
    this.cache = null;
    this.lastFetchTime = null;
    console.log('Card cache cleared');
  }

  /**
   * Get cache status
   */
  getCacheStatus() {
    return {
      hasCache: !!this.cache,
      lastFetchTime: this.lastFetchTime,
      cacheAge: this.lastFetchTime ? Date.now() - this.lastFetchTime : null,
      isExpired: this.lastFetchTime ? (Date.now() - this.lastFetchTime) > this.cacheDuration : true
    };
  }
}

// Export singleton instance
export const cardsService = new CardsService();
export default cardsService;