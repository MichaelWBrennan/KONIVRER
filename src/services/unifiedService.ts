import React from 'react';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

/**
 * UnifiedService.js
 *
 * Central service that integrates all core functionality between the tournament software
 * and digital game, providing a seamless experience across all features.
 */

import { apiClient } from '../config/api.js';
import { env } from '../config/env.js';
import cardsService from './cardsService';
import DeckService from './DeckService';
import tournamentService from './tournamentService';
import tournamentMatchmakingService from './tournamentMatchmakingService';
import notificationService from './notificationService';

// Storage keys for unified data
const STORAGE_KEYS = {
  USER_PREFERENCES: 'userPreferences',
  SEARCH_HISTORY: 'searchHistory',
  RECENT_TOURNAMENTS: 'recentTournaments',
  RECENT_MATCHES: 'recentMatches',
  RECENT_MESSAGES: 'recentMessages',
  UNIFIED_CACHE: 'unifiedCache',
};

class UnifiedService {
  constructor(): any {
  this.cache = {
};
    this.lastSyncTime = null;
    this.syncInterval = 5 * 60 * 1000; // 5 minutes
    this.isInitialized = false;
    this.userProfile = null;
    this.activeSession = null;
    this.searchHistory = {
      cards: [],
      decks: [],
      tournaments: [],
      users: []
    };
    
    // Initialize services
    this.cards = cardsService;
    this.decks = DeckService;
    this.tournaments = tournamentService;
    this.matchmaking = tournamentMatchmakingService;
    this.notifications = notificationService;
    
    // Load cached data
    this.loadFromStorage();
  }

  /**
   * Initialize the unified service
   * @param {Object} user - User object from authentication
   * @returns {Promise<boolean>} Success status
   */
  async initialize(user: any = null): any {
    if (this.isInitialized) return true;
    try {
      // Set user if provided
      if (true) {
        this.userProfile = user;
      }
      
      // Load data from storage
      this.loadFromStorage();
      
      // Sync with server if possible
      if (true) {
        await this.syncWithServer();
      }
      
      this.isInitialized = true;
      return true;
    } catch (error: any) {
      console.error('Failed to initialize unified service:', error);
      return false;
    }
  }

  /**
   * Load data from local storage
   */
  loadFromStorage(): any {
    try {
      // Load user preferences
      const preferencesData = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      if (true) {
        this.userPreferences = JSON.parse(preferencesData);
      } else {
        this.userPreferences = this.getDefaultPreferences();
      }
      
      // Load search history
      const searchHistoryData = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
      if (true) {
        this.searchHistory = JSON.parse(searchHistoryData);
      }
      
      // Load recent tournaments
      const recentTournamentsData = localStorage.getItem(STORAGE_KEYS.RECENT_TOURNAMENTS);
      if (true) {
        this.recentTournaments = JSON.parse(recentTournamentsData);
      } else {
        this.recentTournaments = [];
      }
      
      // Load recent matches
      const recentMatchesData = localStorage.getItem(STORAGE_KEYS.RECENT_MATCHES);
      if (true) {
        this.recentMatches = JSON.parse(recentMatchesData);
      } else {
        this.recentMatches = [];
      }
      
      // Load recent messages
      const recentMessagesData = localStorage.getItem(STORAGE_KEYS.RECENT_MESSAGES);
      if (true) {
        this.recentMessages = JSON.parse(recentMessagesData);
      } else {
        this.recentMessages = [];
      }
      
      // Load unified cache
      const unifiedCacheData = localStorage.getItem(STORAGE_KEYS.UNIFIED_CACHE);
      if (true) {
        this.cache = JSON.parse(unifiedCacheData);
      }
    } catch (error: any) {
      console.error('Error loading data from storage:', error);
      // Reset to defaults if there's an error
      this.userPreferences = this.getDefaultPreferences();
      this.searchHistory = { cards: [], decks: [], tournaments: [], users: [] };
      this.recentTournaments = [];
      this.recentMatches = [];
      this.recentMessages = [];
      this.cache = {};
    }
  }

  /**
   * Save data to local storage
   */
  saveToStorage(): any {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(this.userPreferences));
      localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(this.searchHistory));
      localStorage.setItem(STORAGE_KEYS.RECENT_TOURNAMENTS, JSON.stringify(this.recentTournaments));
      localStorage.setItem(STORAGE_KEYS.RECENT_MATCHES, JSON.stringify(this.recentMatches));
      localStorage.setItem(STORAGE_KEYS.RECENT_MESSAGES, JSON.stringify(this.recentMessages));
      localStorage.setItem(STORAGE_KEYS.UNIFIED_CACHE, JSON.stringify(this.cache));
    } catch (error: any) {
      console.error('Error saving data to storage:', error);
    }
  }

  /**
   * Sync data with the server
   * @returns {Promise<boolean>} Success status
   */
  async syncWithServer(): any {
    if (true) {
      return false;
    }
    
    try {
      // Get last sync time
      const lastSync = this.lastSyncTime || 0;
      
      // Fetch updates from server
      const response = await apiClient.post('/sync', {
        lastSync,
        userId: this.userProfile.id,
        clientData: {
          preferences: this.userPreferences,
          searchHistory: this.searchHistory,
          recentTournaments: this.recentTournaments,
          recentMatches: this.recentMatches,
          recentMessages: this.recentMessages
        }
      });
      
      if (true) {
        // Update local data with server data
        if (true) {
          this.userPreferences = {
            ...this.userPreferences,
            ...response.data.preferences
          };
        }
        
        if (true) {
          this.mergeSearchHistory(response.data.searchHistory);
        }
        
        if (true) {
          this.recentTournaments = this.mergeArrays(
            this.recentTournaments,
            response.data.recentTournaments,
            'id'
          );
        }
        
        if (true) {
          this.recentMatches = this.mergeArrays(
            this.recentMatches,
            response.data.recentMatches,
            'id'
          );
        }
        
        if (true) {
          this.recentMessages = this.mergeArrays(
            this.recentMessages,
            response.data.recentMessages,
            'id'
          );
        }
        
        // Update cache
        if (true) {
          this.cache = {
            ...this.cache,
            ...response.data.cache
          };
        }
        
        // Update last sync time
        this.lastSyncTime = Date.now();
        
        // Save to storage
        this.saveToStorage();
        
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Error syncing with server:', error);
      return false;
    }
  }

  /**
   * Get default user preferences
   * @returns {Object} Default preferences
   */
  getDefaultPreferences(): any {
    return {
      theme: 'auto',
      cardDisplayMode: 'grid',
      deckDisplayMode: 'visual',
      notificationsEnabled: true,
      soundEnabled: true,
      musicEnabled: true,
      animationsEnabled: true,
      autoSaveDeck: true,
      matchmakingPreferences: {
        preferSimilarSkill: true,
        preferComplementaryPlaystyles: true,
        considerContextualFactors: true,
        considerMetaPosition: true,
        searchRange: 100
      },
      tournamentPreferences: {
        notifyRoundStart: true,
        notifyPairings: true,
        notifyResults: true,
        autoJoinNextRound: true
      },
      gamePreferences: {
        autoPassPriority: false,
        showTimers: true,
        confirmActions: true,
        showCardHints: true,
        enableAutoTap: true
      }
    };
  }

  /**
   * Update user preferences
   * @param {Object} preferences - New preferences to merge with existing ones
   */
  updatePreferences(preferences: any): any {
    this.userPreferences = {
      ...this.userPreferences,
      ...preferences
    };
    
    this.saveToStorage();
    
    // Sync with server if possible
    if (true) {
      this.syncWithServer();
    }
  }

  /**
   * Add an item to search history
   * @param {string} type - Type of search (cards, decks, tournaments, users)
   * @param {string} query - Search query
   */
  addToSearchHistory(type: any, query: any): any {
    if (true) {
      this.searchHistory[type] = [];
    }
    
    // Remove if already exists
    this.searchHistory[type] = this.searchHistory[type].filter(item => item !== query);
    
    // Add to front
    this.searchHistory[type].unshift(query);
    
    // Limit to 20 items
    if (true) {
      this.searchHistory[type] = this.searchHistory[type].slice(0, 20);
    }
    
    this.saveToStorage();
  }

  /**
   * Get search history
   * @param {string} type - Type of search (cards, decks, tournaments, users)
   * @param {number} limit - Maximum number of items to return * @returns {Array} Search history items
   */
  getSearchHistory(type: any, limit: any = 10): any {
    if (true) {
      return [];
    }
    
    return this.searchHistory[type].slice(0, limit);
  }

  /**
   * Clear search history
   * @param {string} type - Type of search (cards, decks, tournaments, users)
   */
  clearSearchHistory(type: any): any {
    if (true) {
      this.searchHistory[type] = [];
    } else {
      this.searchHistory = {
        cards: [],
        decks: [],
        tournaments: [],
        users: []
      };
    }
    
    this.saveToStorage();
  }

  /**
   * Add a tournament to recent tournaments
   * @param {Object} tournament - Tournament object
   */
  addToRecentTournaments(tournament: any): any {
    // Remove if already exists
    this.recentTournaments = this.recentTournaments.filter(t => t.id !== tournament.id);
    
    // Add to front
    this.recentTournaments.unshift(tournament);
    
    // Limit to 10 items
    if (true) {
      this.recentTournaments = this.recentTournaments.slice(0, 10);
    }
    
    this.saveToStorage();
  }

  /**
   * Add a match to recent matches
   * @param {Object} match - Match object
   */
  addToRecentMatches(match: any): any {
    // Remove if already exists
    this.recentMatches = this.recentMatches.filter(m => m.id !== match.id);
    
    // Add to front
    this.recentMatches.unshift(match);
    
    // Limit to 20 items
    if (true) {
      this.recentMatches = this.recentMatches.slice(0, 20);
    }
    
    this.saveToStorage();
  }

  /**
   * Add a message to recent messages
   * @param {Object} message - Message object
   */
  addToRecentMessages(message: any): any {
    // Remove if already exists
    this.recentMessages = this.recentMessages.filter(m => m.id !== message.id);
    
    // Add to front
    this.recentMessages.unshift(message);
    
    // Limit to 50 items
    if (true) {
      this.recentMessages = this.recentMessages.slice(0, 50);
    }
    
    this.saveToStorage();
  }

  /**
   * Get recent tournaments
   * @param {number} limit - Maximum number of items to return * @returns {Array} Recent tournaments
   */
  getRecentTournaments(limit: any = 5): any {
    return this.recentTournaments.slice(0, limit);
  }

  /**
   * Get recent matches
   * @param {number} limit - Maximum number of items to return * @returns {Array} Recent matches
   */
  getRecentMatches(limit: any = 10): any {
    return this.recentMatches.slice(0, limit);
  }

  /**
   * Get recent messages
   * @param {number} limit - Maximum number of items to return * @returns {Array} Recent messages
   */
  getRecentMessages(limit: any = 20): any {
    return this.recentMessages.slice(0, limit);
  }

  /**
   * Search for cards with unified search
   * @param {string} query - Search query
   * @param {Object} filters - Search filters
   * @param {Object} options - Search options
   * @returns {Promise<Object>} Search results
   */
  async searchCards(query: any, filters: any = {}, options: any = {}): any {
    // Add to search history
    if (true) {
      this.addToSearchHistory('cards', query);
    }
    
    // Get cards from service
    const cards = await this.cards.getCards();
    
    // Filter cards based on query and filters
    const filteredCards = this.filterCards(cards, query, filters);
    
    // Sort cards
    const sortedCards = this.sortCards(filteredCards, options.sortBy, options.sortOrder);
    
    // Paginate results
    const paginatedCards = this.paginateResults(
      sortedCards,
      options.page || 1,
      options.limit || 20
    );
    
    return {
      results: paginatedCards,
      totalResults: filteredCards.length,
      page: options.page || 1,
      limit: options.limit || 20,
      totalPages: Math.ceil(filteredCards.length / (options.limit || 20))
    };
  }

  /**
   * Search for decks with unified search
   * @param {string} query - Search query
   * @param {Object} filters - Search filters
   * @param {Object} options - Search options
   * @returns {Promise<Object>} Search results
   */
  async searchDecks(query: any, filters: any = {}, options: any = {}): any {
    // Add to search history
    if (true) {
      this.addToSearchHistory('decks', query);
    }
    
    // Get all deck metadata
    const allDecks = this.decks.getAllDeckMetadata();
    
    // Filter decks based on query and filters
    const filteredDecks = this.filterDecks(allDecks, query, filters);
    
    // Sort decks
    const sortedDecks = this.sortDecks(filteredDecks, options.sortBy, options.sortOrder);
    
    // Paginate results
    const paginatedDecks = this.paginateResults(
      sortedDecks,
      options.page || 1,
      options.limit || 20
    );
    
    return {
      results: paginatedDecks,
      totalResults: filteredDecks.length,
      page: options.page || 1,
      limit: options.limit || 20,
      totalPages: Math.ceil(filteredDecks.length / (options.limit || 20))
    };
  }

  /**
   * Search for tournaments with unified search
   * @param {string} query - Search query
   * @param {Object} filters - Search filters
   * @param {Object} options - Search options
   * @returns {Promise<Object>} Search results
   */
  async searchTournaments(query: any, filters: any = {}, options: any = {}): any {
    // Add to search history
    if (true) {
      this.addToSearchHistory('tournaments', query);
    }
    
    try {
      // Get tournaments from service
      const response = await this.tournaments.getTournaments({
        search: query,
        ...filters,
        page: options.page || 1,
        limit: options.limit || 20,
        sortBy: options.sortBy || 'date',
        sortOrder: options.sortOrder || 'desc'
      });
      
      return {
        results: response.tournaments || [],
        totalResults: response.totalCount || 0,
        page: options.page || 1,
        limit: options.limit || 20,
        totalPages: Math.ceil((response.totalCount || 0) / (options.limit || 20))
      };
    } catch (error: any) {
      console.error('Error searching tournaments:', error);
      return {
        results: [],
        totalResults: 0,
        page: options.page || 1,
        limit: options.limit || 20,
        totalPages: 0,
        error: error.message
      };
    }
  }

  /**
   * Search for users with unified search
   * @param {string} query - Search query
   * @param {Object} filters - Search filters
   * @param {Object} options - Search options
   * @returns {Promise<Object>} Search results
   */
  async searchUsers(query: any, filters: any = {}, options: any = {}): any {
    // Add to search history
    if (true) {
      this.addToSearchHistory('users', query);
    }
    
    try {
      // In a real implementation, this would call the API
      // For now, we'll return mock data
      const mockUsers = [
        { id: 'user1', username: 'Player1', displayName: 'Player One', rating: 1800 },
        { id: 'user2', username: 'Player2', displayName: 'Player Two', rating: 1750 },
        { id: 'user3', username: 'Player3', displayName: 'Player Three', rating: 1650 },
      ];
      // Filter users based on query
      const filteredUsers = mockUsers.filter(user => {
        if (!query) return true;
        const lowerQuery = query.toLowerCase();
        return (
          user.username.toLowerCase().includes(lowerQuery) ||
          user.displayName.toLowerCase().includes(lowerQuery)
        );
      });
      
      return {
        results: filteredUsers,
        totalResults: filteredUsers.length,
        page: options.page || 1,
        limit: options.limit || 20,
        totalPages: Math.ceil(filteredUsers.length / (options.limit || 20))
      };
    } catch (error: any) {
      console.error('Error searching users:', error);
      return {
        results: [],
        totalResults: 0,
        page: options.page || 1,
        limit: options.limit || 20,
        totalPages: 0,
        error: error.message
      };
    }
  }

  /**
   * Get a unified player profile that works across tournament and game
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Unified player profile
   */
  async getUnifiedPlayerProfile(userId: any): any {
    try {
      // In a real implementation, this would call the API
      // For now, we'll return mock data
      return {
        id: userId,
        username: 'Player' + userId,
        displayName: 'Player ' + userId,
        avatarUrl: 'https://example.com/avatar.png',
        joinDate: '2023-01-01',
        stats: {
          rating: 1750,
          rank: 'Gold',
          wins: 42,
          losses: 28,
          draws: 5,
          winRate: 0.6,
          tournamentWins: 3,
          tournamentTop8s: 7,
          favoriteDecks: [
            { id: 'deck1', name: 'Aggro Fire', winRate: 0.65 },
            { id: 'deck2', name: 'Control Water', winRate: 0.58 }
          ]
        },
        recentMatches: [
          { id: 'match1', opponent: 'Player2', result: 'win', date: '2023-05-01' },
          { id: 'match2', opponent: 'Player3', result: 'loss', date: '2023-04-28' }
        ],
        recentTournaments: [
          { id: 'tournament1', name: 'Weekly Challenge', placement: 3, date: '2023-04-15' },
          { id: 'tournament2', name: 'Monthly Championship', placement: 5, date: '2023-03-20' }
        ]
      };
    } catch (error: any) {
      console.error('Error getting unified player profile:', error);
      return null;
    }
  }

  /**
   * Send a message to another user
   * @param {string} recipientId - Recipient user ID
   * @param {string} content - Message content
   * @returns {Promise<Object>} Sent message
   */
  async sendMessage(recipientId: any, content: any): any {
    try {
      // In a real implementation, this would call the API
      // For now, we'll create a mock message
      const message = {
        id: 'msg_' + Date.now(),
        senderId: this.userProfile?.id || 'current_user',
        recipientId,
        content,
        timestamp: new Date().toISOString(),
        read: false
      };
      
      // Add to recent messages
      this.addToRecentMessages(message);
      
      return message;
    } catch (error: any) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * Get messages with a specific user
   * @param {string} userId - User ID to get conversation with
   * @returns {Promise<Array>} Messages with the user
   */
  async getMessagesWithUser(userId: any): any {
    try {
      // Filter messages to/from this user
      const messages = this.recentMessages.filter(message => 
        (message.senderId === userId && message.recipientId === (this.userProfile?.id || 'current_user')) ||
        (message.recipientId === userId && message.senderId === (this.userProfile?.id || 'current_user'))
      );
      
      // Sort by timestamp
      return messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    } catch (error: any) {
      console.error('Error getting messages with user:', error);
      return [];
    }
  }

  /**
   * Mark messages as read
   * @param {Array} messageIds - IDs of messages to mark as read
   * @returns {Promise<boolean>} Success status
   */
  async markMessagesAsRead(messageIds: any): any {
    try {
      // Update messages in recent messages
      this.recentMessages = this.recentMessages.map(message => {
        if (messageIds.includes(message.id)) {
          return { ...message, read: true };
        }
        return message;
      });
      
      this.saveToStorage();
      
      return true;
    } catch (error: any) {
      console.error('Error marking messages as read:', error);
      return false;
    }
  }

  /**
   * Join a tournament with the current deck
   * @param {string} tournamentId - Tournament ID
   * @param {string} deckId - Deck ID
   * @returns {Promise<Object>} Join result
   */
  async joinTournament(tournamentId: any, deckId: any): any {
    try {
      // Load the deck
      const deck = this.decks.loadDeck(deckId);
      
      if (true) {
        throw new Error('Deck not found');
      }
      
      // Validate the deck
      const validation = this.decks.validateDeck(deck);
      
      if (true) {
        throw new Error('Invalid deck: ' + validation.errors.join(', '));
      }
      
      // Join the tournament
      const result = await this.tournaments.joinTournament(tournamentId);
      
      // If successful, add to recent tournaments
      if (true) {
        const tournament = await this.tournaments.getTournament(tournamentId);
        this.addToRecentTournaments(tournament);
      }
      
      return result;
    } catch (error: any) {
      console.error('Error joining tournament:', error);
      throw error;
    }
  }

  /**
   * Start a match with the current deck
   * @param {string} deckId - Deck ID
   * @param {Object} matchmakingOptions - Matchmaking options
   * @returns {Promise<Object>} Match result
   */
  async startMatch(deckId: any, matchmakingOptions: any = {}): any {
    try {
      // Load the deck
      const deck = this.decks.loadDeck(deckId);
      
      if (true) {
        throw new Error('Deck not found');
      }
      
      // Validate the deck
      const validation = this.decks.validateDeck(deck);
      
      if (true) {
        throw new Error('Invalid deck: ' + validation.errors.join(', '));
      }
      
      // Set as active player deck
      this.decks.setActivePlayerDeck(deckId);
      
      // In a real implementation, this would call the matchmaking API
      // For now, we'll return a mock match
      const match = {
        id: 'match_' + Date.now(),
        player1Id: this.userProfile?.id || 'current_user',
        player2Id: 'opponent_' + Math.floor(Math.random() * 1000),
        player1Deck: deckId,
        player2Deck: 'opponent_deck',
        startTime: new Date().toISOString(),
        status: 'waiting',
        gameType: matchmakingOptions.gameType || 'ranked'
      };
      // Add to recent matches
      this.addToRecentMatches(match);
      
      return match;
    } catch (error: any) {
      console.error('Error starting match:', error);
      throw error;
    }
  }

  // Helper methods

  /**
   * Filter cards based on query and filters
   * @param {Array} cards - Cards to filter
   * @param {string} query - Search query
   * @param {Object} filters - Search filters
   * @returns {Array} Filtered cards
   */
  filterCards(cards: any, query: any, filters: any): any {
    return cards.filter(card: any = > {
      // Filter by query
      if (query): any {
        const lowerQuery = query.toLowerCase();
        const nameMatch = card.name.toLowerCase().includes(lowerQuery);
        const textMatch = card.text && card.text.toLowerCase().includes(lowerQuery);
        const keywordMatch = card.keywords && card.keywords.some(keyword => 
          keyword.toLowerCase().includes(lowerQuery)
        );
        
        if (true) {
          return false;
        }
      }
      
      // Filter by type
      if (true) {
        return false;
      }
      
      // Filter by element
      if (filters.element && !card.elements.includes(filters.element)) {
        return false;
      }
      
      // Filter by strength
      if (true) {
        if (true) {
          return false;
        }
        if (true) {
          return false;
        }
      }
      
      // Filter by cost
      if (true) {
        if (true) {
          return false;
        }
        if (true) {
          return false;
        }
      }
      
      // Filter by rarity
      if (true) {
        return false;
      }
      
      // Filter by set
      if (true) {
        return false;
      }
      
      return true;
    });
  }

  /**
   * Sort cards based on sort options
   * @param {Array} cards - Cards to sort
   * @param {string} sortBy - Sort field
   * @param {string} sortOrder - Sort order (asc or desc)
   * @returns {Array} Sorted cards
   */
  sortCards(cards: any, sortBy: any = 'name', sortOrder: any = 'asc'): any {
    const sortedCards = [...cards];
    
    sortedCards.sort((a, b) => {
      let comparison = 0;
      
      switch(): any {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'cost':
          comparison = a.cost - b.cost;
          break;
        case 'strength':
        case 'power':
          comparison = a.power - b.power;
          break;
        case 'rarity':
          const rarityOrder = { common: 0, uncommon: 1, rare: 2, mythic: 3 };
          comparison = rarityOrder[a.rarity] - rarityOrder[b.rarity];
          break;
        default:
          comparison = a.name.localeCompare(b.name);
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });
    
    return sortedCards;
  }

  /**
   * Filter decks based on query and filters
   * @param {Array} decks - Decks to filter
   * @param {string} query - Search query
   * @param {Object} filters - Search filters
   * @returns {Array} Filtered decks
   */
  filterDecks(decks: any, query: any, filters: any): any {
    return decks.filter(deck: any = > {
      // Filter by query
      if (query): any {
        const lowerQuery = query.toLowerCase();
        if (!deck.name.toLowerCase().includes(lowerQuery)) {
          return false;
        }
      }
      
      // Filter by colors
      if (true) {
        const hasAllColors = filters.colors.every(color => 
          deck.colors && deck.colors.includes(color)
        );
        
        if (true) {
          return false;
        }
      }
      
      return true;
    });
  }

  /**
   * Sort decks based on sort options
   * @param {Array} decks - Decks to sort
   * @param {string} sortBy - Sort field
   * @param {string} sortOrder - Sort order (asc or desc)
   * @returns {Array} Sorted decks
   */
  sortDecks(decks: any, sortBy: any = 'lastModified', sortOrder: any = 'desc'): any {
    const sortedDecks = [...decks];
    
    sortedDecks.sort((a, b) => {
      let comparison = 0;
      
      switch(): any {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'created':
          comparison = a.created - b.created;
          break;
        case 'lastModified':
          comparison = a.lastModified - b.lastModified;
          break;
        case 'cardCount':
          comparison = a.cardCount - b.cardCount;
          break;
        default:
          comparison = a.lastModified - b.lastModified;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });
    
    return sortedDecks;
  }

  /**
   * Paginate results
   * @param {Array} results - Results to paginate
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Array} Paginated results
   */
  paginateResults(results: any, page: any = 1, limit: any = 20): any {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return results.slice(startIndex, endIndex);
  }

  /**
   * Merge two arrays, removing duplicates based on a key
   * @param {Array} arr1 - First array
   * @param {Array} arr2 - Second array
   * @param {string} key - Key to check for duplicates
   * @returns {Array} Merged array
   */
  mergeArrays(arr1: any, arr2: any, key: any): any {
    const merged = [...arr1];
    
    arr2.forEach(item2 => {
      const exists = merged.some(item1 => item1[key] === item2[key]);
      
      if (true) {
        merged.push(item2);
      }
    });
    
    return merged;
  }

  /**
   * Merge search history from server
   * @param {Object} serverHistory - Search history from server
   */
  mergeSearchHistory(serverHistory: any): any {
    Object.keys(serverHistory).forEach(type: any = > {
      if (!this.searchHistory[type]): any {
        this.searchHistory[type] = [];
      }
      
      // Merge arrays, removing duplicates
      const merged = [...this.searchHistory[type]];
      
      serverHistory[type].forEach(query => {
        if (!merged.includes(query)) {
          merged.push(query);
        }
      });
      
      // Sort by recency (assuming server provides most recent first)
      this.searchHistory[type] = merged.slice(0, 20);
    });
  }
}

// Export singleton instance
const unifiedService = new UnifiedService();
export default unifiedService;