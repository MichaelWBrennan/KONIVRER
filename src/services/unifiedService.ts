/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

/**
 * UnifiedService.ts
 *
 * Central service that integrates all core functionality between the tournament software
 * and digital game, providing a seamless experience across all features.
 */

import { apiClient } from '../config/api';
import { env } from '../config/env';
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
  UNIFIED_CACHE: 'unifiedCache'
};

// Types for unified service
interface UserProfile {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatar: string;
  rank: string;
  rankTier: number;
  experience: number;
  level: number;
  registrationDate: string;
  lastLoginDate: string;
  isVerified: boolean;
  isBanned: boolean;
  roles: string[];
  preferences: UserPreferences;
  stats: UserStats;
  inventory: UserInventory;
  socialConnections: SocialConnection[];
  [key: string]: any;
}

interface UserPreferences {
  theme: string;
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
    matchReminders: boolean;
    tournamentReminders: boolean;
    friendRequests: boolean;
    systemAnnouncements: boolean;
  };
  privacy: {
    showOnlineStatus: boolean;
    showMatchHistory: boolean;
    showDecks: boolean;
    allowFriendRequests: boolean;
    allowDirectMessages: boolean;
  };
  gameplay: {
    autoPassPriority: boolean;
    enableSoundEffects: boolean;
    enableMusic: boolean;
    enableVoiceLines: boolean;
    enableAnimations: boolean;
    cardQuality: 'low' | 'medium' | 'high';
    showHints: boolean;
    showTimers: boolean;
    confirmActions: boolean;
  };
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
    colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  };
  [key: string]: any;
}

interface UserStats {
  totalMatches: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  tournamentWins: number;
  tournamentTop8s: number;
  highestRank: string;
  currentWinStreak: number;
  longestWinStreak: number;
  favoriteDecks: string[];
  mostPlayedCards: { cardId: string; count: number }[];
  [key: string]: any;
}

interface UserInventory {
  cards: { cardId: string; count: number; foilCount: number }[];
  decks: string[];
  currency: {
    gems: number;
    gold: number;
    dust: number;
  };
  cosmetics: {
    avatars: string[];
    cardBacks: string[];
    playmats: string[];
    emotes: string[];
    sleeves: string[];
  };
  [key: string]: any;
}

interface SocialConnection {
  platform: string;
  username: string;
  connected: boolean;
  lastSynced: string;
  [key: string]: any;
}

interface ActiveSession {
  token: string;
  refreshToken: string;
  expiresAt: number;
  userId: string;
  deviceId: string;
  ipAddress: string;
  userAgent: string;
  lastActivity: number;
  [key: string]: any;
}

interface SearchHistoryItem {
  query: string;
  timestamp: number;
  filters?: Record<string, any>;
  results?: number;
}

interface SearchHistory {
  cards: SearchHistoryItem[];
  decks: SearchHistoryItem[];
  tournaments: SearchHistoryItem[];
  players: SearchHistoryItem[];
}

interface RecentItem {
  id: string;
  name: string;
  timestamp: number;
  type: string;
  metadata?: Record<string, any>;
}

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface UnifiedCache {
  cards: Record<string, CacheItem<any>>;
  decks: Record<string, CacheItem<any>>;
  tournaments: Record<string, CacheItem<any>>;
  players: Record<string, CacheItem<any>>;
  matches: Record<string, CacheItem<any>>;
  [key: string]: Record<string, CacheItem<any>>;
}

interface SyncStatus {
  lastSyncTime: number | null;
  inProgress: boolean;
  error: string | null;
  pendingChanges: Record<string, any>[];
}

interface NotificationSettings {
  enabled: boolean;
  types: {
    [key: string]: boolean;
  };
  channels: {
    inApp: boolean;
    email: boolean;
    push: boolean;
  };
  doNotDisturb: {
    enabled: boolean;
    startTime: string;
    endTime: string;
    exceptions: string[];
  };
}

class UnifiedService {
  private cache: UnifiedCache;
  private lastSyncTime: number | null;
  private syncInterval: number;
  private isInitialized: boolean;
  private userProfile: UserProfile | null;
  private activeSession: ActiveSession | null;
  private searchHistory: SearchHistory;
  private recentTournaments: RecentItem[];
  private recentMatches: RecentItem[];
  private recentMessages: RecentItem[];
  private syncStatus: SyncStatus;
  private notificationSettings: NotificationSettings;
  private eventListeners: Record<string, Function[]>;
  private pendingRequests: Map<string, Promise<any>>;
  private offlineQueue: Record<string, any>[];
  private serviceWorkerRegistration: ServiceWorkerRegistration | null;

  constructor() {
    this.cache = {
      cards: {},
      decks: {},
      tournaments: {},
      players: {},
      matches: {}
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
      players: []
    };
    this.recentTournaments = [];
    this.recentMatches = [];
    this.recentMessages = [];
    this.syncStatus = {
      lastSyncTime: null,
      inProgress: false,
      error: null,
      pendingChanges: []
    };
    this.notificationSettings = {
      enabled: true,
      types: {
        system: true,
        match: true,
        tournament: true,
        friend: true,
        message: true
      },
      channels: {
        inApp: true,
        email: true,
        push: true
      },
      doNotDisturb: {
        enabled: false,
        startTime: '22:00',
        endTime: '08:00',
        exceptions: ['tournament']
      }
    };
    this.eventListeners = {};
    this.pendingRequests = new Map();
    this.offlineQueue = [];
    this.serviceWorkerRegistration = null;
  }

  /**
   * Initialize the unified service
   */
  async initialize(): Promise<boolean> {
    try {
      // Load cached data from local storage
      this.loadFromLocalStorage();

      // Check for active session
      const session = this.getActiveSession();
      if (session) {
        this.activeSession = session;
        await this.refreshUserProfile();
      }

      // Register service worker for offline support
      if ('serviceWorker' in navigator) {
        try {
          this.serviceWorkerRegistration = await navigator.serviceWorker.register('/service-worker.js');
          console.log('Service worker registered successfully');
        } catch (error) {
          console.error('Service worker registration failed:', error);
        }
      }

      // Set up sync interval
      setInterval(() => this.syncWithServer(), this.syncInterval);

      // Process offline queue if needed
      if (navigator.onLine && this.offlineQueue.length > 0) {
        await this.processOfflineQueue();
      }

      // Set up online/offline event listeners
      window.addEventListener('online', this.handleOnline.bind(this));
      window.addEventListener('offline', this.handleOffline.bind(this));

      this.isInitialized = true;
      this.emitEvent('initialized', { success: true });
      return true;
    } catch (error) {
      console.error('Failed to initialize unified service:', error);
      this.emitEvent('initialized', { success: false, error });
      return false;
    }
  }

  /**
   * Load data from local storage
   */
  private loadFromLocalStorage(): void {
    try {
      // Load user preferences
      const userPreferencesStr = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      if (userPreferencesStr) {
        const userProfile = JSON.parse(userPreferencesStr);
        this.userProfile = userProfile;
      }

      // Load search history
      const searchHistoryStr = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
      if (searchHistoryStr) {
        this.searchHistory = JSON.parse(searchHistoryStr);
      }

      // Load recent tournaments
      const recentTournamentsStr = localStorage.getItem(STORAGE_KEYS.RECENT_TOURNAMENTS);
      if (recentTournamentsStr) {
        this.recentTournaments = JSON.parse(recentTournamentsStr);
      }

      // Load recent matches
      const recentMatchesStr = localStorage.getItem(STORAGE_KEYS.RECENT_MATCHES);
      if (recentMatchesStr) {
        this.recentMatches = JSON.parse(recentMatchesStr);
      }

      // Load recent messages
      const recentMessagesStr = localStorage.getItem(STORAGE_KEYS.RECENT_MESSAGES);
      if (recentMessagesStr) {
        this.recentMessages = JSON.parse(recentMessagesStr);
      }

      // Load unified cache
      const unifiedCacheStr = localStorage.getItem(STORAGE_KEYS.UNIFIED_CACHE);
      if (unifiedCacheStr) {
        this.cache = JSON.parse(unifiedCacheStr);
      }
    } catch (error) {
      console.error('Error loading data from local storage:', error);
    }
  }

  /**
   * Save data to local storage
   */
  private saveToLocalStorage(): void {
    try {
      // Save user preferences
      if (this.userProfile) {
        localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(this.userProfile));
      }

      // Save search history
      localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(this.searchHistory));

      // Save recent tournaments
      localStorage.setItem(STORAGE_KEYS.RECENT_TOURNAMENTS, JSON.stringify(this.recentTournaments));

      // Save recent matches
      localStorage.setItem(STORAGE_KEYS.RECENT_MATCHES, JSON.stringify(this.recentMatches));

      // Save recent messages
      localStorage.setItem(STORAGE_KEYS.RECENT_MESSAGES, JSON.stringify(this.recentMessages));

      // Save unified cache
      localStorage.setItem(STORAGE_KEYS.UNIFIED_CACHE, JSON.stringify(this.cache));
    } catch (error) {
      console.error('Error saving data to local storage:', error);
    }
  }

  /**
   * Get active session from storage or cookie
   */
  private getActiveSession(): ActiveSession | null {
    try {
      // Check localStorage first
      const sessionStr = localStorage.getItem('activeSession');
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        // Check if session is still valid
        if (session.expiresAt > Date.now()) {
          return session;
        }
      }

      // Check cookies as fallback
      const cookies = document.cookie.split(';');
      const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('authToken='));
      if (tokenCookie) {
        const token = tokenCookie.split('=')[1];
        // Create a basic session object
        return {
          token,
          refreshToken: '',
          expiresAt: Date.now() + 24 * 60 * 60 * 1000, // Assume 24 hours
          userId: '',
          deviceId: '',
          ipAddress: '',
          userAgent: navigator.userAgent,
          lastActivity: Date.now()
        };
      }

      return null;
    } catch (error) {
      console.error('Error getting active session:', error);
      return null;
    }
  }

  /**
   * Refresh user profile from server
   */
  async refreshUserProfile(): Promise<UserProfile | null> {
    if (!this.activeSession) {
      return null;
    }

    try {
      const response = await apiClient.get('/user/profile', {
        headers: {
          Authorization: `Bearer ${this.activeSession.token}`
        }
      });

      if (response.status === 200) {
        this.userProfile = response.data;
        this.saveToLocalStorage();
        this.emitEvent('userProfileUpdated', this.userProfile);
        return this.userProfile;
      }

      return null;
    } catch (error) {
      console.error('Error refreshing user profile:', error);
      return null;
    }
  }

  /**
   * Sync with server
   */
  async syncWithServer(): Promise<boolean> {
    if (!navigator.onLine || !this.activeSession) {
      return false;
    }

    if (this.syncStatus.inProgress) {
      return false;
    }

    try {
      this.syncStatus.inProgress = true;
      this.emitEvent('syncStarted', { timestamp: Date.now() });

      // Prepare sync data
      const syncData = {
        lastSyncTime: this.lastSyncTime,
        deviceId: this.activeSession.deviceId,
        pendingChanges: this.syncStatus.pendingChanges
      };

      // Send sync request
      const response = await apiClient.post('/sync', syncData, {
        headers: {
          Authorization: `Bearer ${this.activeSession.token}`
        }
      });

      if (response.status === 200) {
        // Process server updates
        const { updates, timestamp } = response.data;

        // Update cache with server data
        if (updates.cards) {
          this.updateCache('cards', updates.cards);
        }

        if (updates.decks) {
          this.updateCache('decks', updates.decks);
        }

        if (updates.tournaments) {
          this.updateCache('tournaments', updates.tournaments);
        }

        if (updates.players) {
          this.updateCache('players', updates.players);
        }

        if (updates.matches) {
          this.updateCache('matches', updates.matches);
        }

        // Update user profile if included
        if (updates.userProfile) {
          this.userProfile = updates.userProfile;
        }

        // Clear pending changes that were successfully synced
        this.syncStatus.pendingChanges = [];
        this.lastSyncTime = timestamp;
        this.syncStatus.inProgress = false;
        this.syncStatus.error = null;

        // Save updated data
        this.saveToLocalStorage();

        this.emitEvent('syncCompleted', { 
          success: true, 
          timestamp, 
          updates: Object.keys(updates) 
        });

        return true;
      }

      throw new Error(`Sync failed with status: ${response.status}`);
    } catch (error) {
      console.error('Error syncing with server:', error);
      this.syncStatus.inProgress = false;
      this.syncStatus.error = error instanceof Error ? error.message : 'Unknown error';
      this.emitEvent('syncFailed', { error: this.syncStatus.error });
      return false;
    }
  }

  /**
   * Update cache with new data
   */
  private updateCache(cacheType: string, items: Record<string, any>): void {
    if (!this.cache[cacheType]) {
      this.cache[cacheType] = {};
    }

    // Update or add each item
    Object.entries(items).forEach(([id, data]) => {
      this.cache[cacheType][id] = {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours cache
      };
    });
  }

  /**
   * Process offline queue
   */
  private async processOfflineQueue(): Promise<void> {
    if (!navigator.onLine || this.offlineQueue.length === 0) {
      return;
    }

    const queue = [...this.offlineQueue];
    this.offlineQueue = [];

    for (const item of queue) {
      try {
        // Add to pending changes for next sync
        this.syncStatus.pendingChanges.push(item);
      } catch (error) {
        console.error('Error processing offline queue item:', error);
        // Put failed items back in the queue
        this.offlineQueue.push(item);
      }
    }

    // Try to sync immediately if we processed offline items
    if (queue.length > 0) {
      this.syncWithServer();
    }
  }

  /**
   * Handle online event
   */
  private handleOnline(): void {
    this.emitEvent('online', { timestamp: Date.now() });
    this.processOfflineQueue();
    this.syncWithServer();
  }

  /**
   * Handle offline event
   */
  private handleOffline(): void {
    this.emitEvent('offline', { timestamp: Date.now() });
  }

  /**
   * Add event listener
   */
  on(event: string, callback: Function): void {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  /**
   * Remove event listener
   */
  off(event: string, callback: Function): void {
    if (!this.eventListeners[event]) {
      return;
    }
    this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback);
  }

  /**
   * Emit event
   */
  private emitEvent(event: string, data: any): void {
    if (!this.eventListeners[event]) {
      return;
    }
    this.eventListeners[event].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in ${event} event listener:`, error);
      }
    });
  }

  /**
   * Get user profile
   */
  getUserProfile(): UserProfile | null {
    return this.userProfile;
  }

  /**
   * Update user preferences
   */
  async updateUserPreferences(preferences: Partial<UserPreferences>): Promise<boolean> {
    if (!this.userProfile || !this.activeSession) {
      return false;
    }

    try {
      // Update locally first for immediate feedback
      this.userProfile.preferences = {
        ...this.userProfile.preferences,
        ...preferences
      };

      // Save to local storage
      this.saveToLocalStorage();

      // Add to pending changes for sync
      this.syncStatus.pendingChanges.push({
        type: 'updatePreferences',
        data: preferences,
        timestamp: Date.now()
      });

      // Try to sync immediately if online
      if (navigator.onLine) {
        const response = await apiClient.patch('/user/preferences', preferences, {
          headers: {
            Authorization: `Bearer ${this.activeSession.token}`
          }
        });

        if (response.status === 200) {
          this.emitEvent('preferencesUpdated', this.userProfile.preferences);
          return true;
        }
      } else {
        // Add to offline queue
        this.offlineQueue.push({
          type: 'updatePreferences',
          data: preferences,
          timestamp: Date.now()
        });
        this.emitEvent('preferencesUpdated', this.userProfile.preferences);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error updating user preferences:', error);
      return false;
    }
  }

  /**
   * Add to search history
   */
  addToSearchHistory(type: keyof SearchHistory, query: string, filters?: Record<string, any>, results?: number): void {
    if (!this.searchHistory[type]) {
      this.searchHistory[type] = [];
    }

    // Check if query already exists
    const existingIndex = this.searchHistory[type].findIndex(item => item.query === query);
    if (existingIndex !== -1) {
      // Update existing entry
      this.searchHistory[type][existingIndex] = {
        query,
        timestamp: Date.now(),
        filters,
        results
      };
    } else {
      // Add new entry
      this.searchHistory[type].unshift({
        query,
        timestamp: Date.now(),
        filters,
        results
      });

      // Limit history size
      if (this.searchHistory[type].length > 20) {
        this.searchHistory[type] = this.searchHistory[type].slice(0, 20);
      }
    }

    // Save to local storage
    this.saveToLocalStorage();
  }

  /**
   * Get search history
   */
  getSearchHistory(type: keyof SearchHistory): SearchHistoryItem[] {
    return this.searchHistory[type] || [];
  }

  /**
   * Clear search history
   */
  clearSearchHistory(type?: keyof SearchHistory): void {
    if (type) {
      this.searchHistory[type] = [];
    } else {
      this.searchHistory = {
        cards: [],
        decks: [],
        tournaments: [],
        players: []
      };
    }

    // Save to local storage
    this.saveToLocalStorage();
  }

  /**
   * Add recent tournament
   */
  addRecentTournament(tournament: { id: string; name: string; metadata?: Record<string, any> }): void {
    // Check if tournament already exists
    const existingIndex = this.recentTournaments.findIndex(item => item.id === tournament.id);
    if (existingIndex !== -1) {
      // Remove existing entry
      this.recentTournaments.splice(existingIndex, 1);
    }

    // Add new entry
    this.recentTournaments.unshift({
      id: tournament.id,
      name: tournament.name,
      timestamp: Date.now(),
      type: 'tournament',
      metadata: tournament.metadata
    });

    // Limit size
    if (this.recentTournaments.length > 10) {
      this.recentTournaments = this.recentTournaments.slice(0, 10);
    }

    // Save to local storage
    this.saveToLocalStorage();
  }

  /**
   * Get recent tournaments
   */
  getRecentTournaments(): RecentItem[] {
    return this.recentTournaments;
  }

  /**
   * Add recent match
   */
  addRecentMatch(match: { id: string; name: string; metadata?: Record<string, any> }): void {
    // Check if match already exists
    const existingIndex = this.recentMatches.findIndex(item => item.id === match.id);
    if (existingIndex !== -1) {
      // Remove existing entry
      this.recentMatches.splice(existingIndex, 1);
    }

    // Add new entry
    this.recentMatches.unshift({
      id: match.id,
      name: match.name,
      timestamp: Date.now(),
      type: 'match',
      metadata: match.metadata
    });

    // Limit size
    if (this.recentMatches.length > 10) {
      this.recentMatches = this.recentMatches.slice(0, 10);
    }

    // Save to local storage
    this.saveToLocalStorage();
  }

  /**
   * Get recent matches
   */
  getRecentMatches(): RecentItem[] {
    return this.recentMatches;
  }

  /**
   * Get cached item
   */
  getCachedItem<T>(cacheType: string, id: string): T | null {
    if (!this.cache[cacheType] || !this.cache[cacheType][id]) {
      return null;
    }

    const cachedItem = this.cache[cacheType][id];

    // Check if expired
    if (cachedItem.expiresAt < Date.now()) {
      delete this.cache[cacheType][id];
      return null;
    }

    return cachedItem.data;
  }

  /**
   * Set cached item
   */
  setCachedItem<T>(cacheType: string, id: string, data: T, ttl: number = 24 * 60 * 60 * 1000): void {
    if (!this.cache[cacheType]) {
      this.cache[cacheType] = {};
    }

    this.cache[cacheType][id] = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl
    };

    // Save to local storage
    this.saveToLocalStorage();
  }

  /**
   * Clear cache
   */
  clearCache(cacheType?: string): void {
    if (cacheType) {
      if (this.cache[cacheType]) {
        this.cache[cacheType] = {};
      }
    } else {
      this.cache = {
        cards: {},
        decks: {},
        tournaments: {},
        players: {},
        matches: {}
      };
    }

    // Save to local storage
    this.saveToLocalStorage();
  }

  /**
   * Login user
   */
  async login(username: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await apiClient.post('/auth/login', {
        username,
        password
      });

      if (response.status === 200) {
        const { token, refreshToken, expiresAt, user } = response.data;

        // Set active session
        this.activeSession = {
          token,
          refreshToken,
          expiresAt,
          userId: user.id,
          deviceId: this.generateDeviceId(),
          ipAddress: '',
          userAgent: navigator.userAgent,
          lastActivity: Date.now()
        };

        // Set user profile
        this.userProfile = user;

        // Save to local storage
        localStorage.setItem('activeSession', JSON.stringify(this.activeSession));
        this.saveToLocalStorage();

        // Emit event
        this.emitEvent('login', { success: true, user });

        // Sync with server
        this.syncWithServer();

        return { success: true };
      }

      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<boolean> {
    try {
      if (this.activeSession) {
        // Try to notify server about logout
        if (navigator.onLine) {
          try {
            await apiClient.post('/auth/logout', {
              token: this.activeSession.token
            });
          } catch (error) {
            console.error('Error logging out on server:', error);
          }
        }

        // Clear session and user data
        this.activeSession = null;
        this.userProfile = null;

        // Clear from local storage
        localStorage.removeItem('activeSession');
        this.saveToLocalStorage();

        // Emit event
        this.emitEvent('logout', { success: true });

        return true;
      }

      return false;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  }

  /**
   * Generate device ID
   */
  private generateDeviceId(): string {
    // Check if we already have a device ID
    const existingId = localStorage.getItem('deviceId');
    if (existingId) {
      return existingId;
    }

    // Generate a new device ID
    const newId = 'device_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('deviceId', newId);
    return newId;
  }

  /**
   * Get notification settings
   */
  getNotificationSettings(): NotificationSettings {
    return this.notificationSettings;
  }

  /**
   * Update notification settings
   */
  updateNotificationSettings(settings: Partial<NotificationSettings>): void {
    this.notificationSettings = {
      ...this.notificationSettings,
      ...settings
    };

    // Add to pending changes for sync
    this.syncStatus.pendingChanges.push({
      type: 'updateNotificationSettings',
      data: settings,
      timestamp: Date.now()
    });

    // Save to local storage
    this.saveToLocalStorage();

    // Emit event
    this.emitEvent('notificationSettingsUpdated', this.notificationSettings);

    // Sync if online
    if (navigator.onLine) {
      this.syncWithServer();
    }
  }

  /**
   * Register for push notifications
   */
  async registerForPushNotifications(): Promise<boolean> {
    if (!this.serviceWorkerRegistration || !('PushManager' in window)) {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        return false;
      }

      // Get push subscription
      const subscription = await this.serviceWorkerRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(env.VAPID_PUBLIC_KEY)
      });

      // Send subscription to server
      if (this.activeSession) {
        await apiClient.post('/notifications/register', {
          subscription: subscription.toJSON(),
          userId: this.activeSession.userId
        }, {
          headers: {
            Authorization: `Bearer ${this.activeSession.token}`
          }
        });
      }

      return true;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      return false;
    }
  }

  /**
   * Convert URL base64 to Uint8Array
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  /**
   * Get cards service
   */
  getCardsService() {
    return cardsService;
  }

  /**
   * Get deck service
   */
  getDeckService() {
    return DeckService;
  }

  /**
   * Get tournament service
   */
  getTournamentService() {
    return tournamentService;
  }

  /**
   * Get tournament matchmaking service
   */
  getTournamentMatchmakingService() {
    return tournamentMatchmakingService;
  }

  /**
   * Get notification service
   */
  getNotificationService() {
    return notificationService;
  }
}

// Create singleton instance
const unifiedService = new UnifiedService();

export default unifiedService;