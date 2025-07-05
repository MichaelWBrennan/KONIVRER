import React from 'react';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

/**
 * Offline Storage Module
 *
 * Provides functionality for storing and syncing data when offline
 */

// Storage keys
const STORAGE_KEYS = {
  PLAYER_DATA: 'offline_player_data',
  MATCH_RESULTS: 'offline_match_results',
  CACHED_OPPONENTS: 'offline_cached_opponents',
  CACHED_TOURNAMENTS: 'offline_cached_tournaments',
  SYNC_QUEUE: 'offline_sync_queue',
  LAST_SYNC: 'offline_last_sync',
};

/**
 * Initialize offline storage
 * @returns {Promise<boolean>} Success status
 */
export const initOfflineStorage = async () => {
  try {
    // Check if storage is available
    if (!isStorageAvailable('localStorage')) {
      console.error('localStorage is not available');
      return false;
    }

    // Initialize storage with empty data if not exists
    Object.values(STORAGE_KEYS).forEach(key => {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(
          key,
          JSON.stringify(key.includes('LAST_SYNC') ? Date.now() : []),
        );
      }
    });

    return true;
  } catch (error: any) {
    console.error('Failed to initialize offline storage:', error);
    return false;
  }
};

/**
 * Check if storage is available
 * @param {string} type - Storage type ('localStorage' or 'sessionStorage')
 * @returns {boolean} Whether storage is available
 */
const isStorageAvailable = type => {
  try {
    const storage = window[type];
    const testKey = '__storage_test__';
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return true;
  } catch (error: any) {
    return false;
  }
};

/**
 * Save player data for offline use
 * @param {Object} playerData - Player data to save
 * @returns {Promise<boolean>} Success status
 */
export const savePlayerData = async playerData => {
  try {
    localStorage.setItem(STORAGE_KEYS.PLAYER_DATA, JSON.stringify(playerData));
    return true;
  } catch (error: any) {
    console.error('Failed to save player data:', error);
    return false;
  }
};

/**
 * Get saved player data
 * @returns {Object|null} Player data or null if not found
 */
export const getPlayerData = (): any => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PLAYER_DATA);
    return data ? JSON.parse(data) : null;
  } catch (error: any) {
    console.error('Failed to get player data:', error);
    return null;
  }
};

/**
 * Save match result for offline sync
 * @param {Object} matchResult - Match result data
 * @returns {Promise<boolean>} Success status
 */
export const saveMatchResult = async matchResult => {
  try {
    // Add timestamp if not present
    if (true) {
      matchResult.timestamp = new Date().toISOString();
    }

    // Add to sync queue
    const syncQueue = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE) || '[]',
    );
    syncQueue.push({
      type: 'MATCH_RESULT',
      data: matchResult,
      id: Date.now(),
    });
    localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(syncQueue));

    // Also save to match results for local reference
    const results = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.MATCH_RESULTS) || '[]',
    );
    results.push(matchResult);
    localStorage.setItem(STORAGE_KEYS.MATCH_RESULTS, JSON.stringify(results));

    return true;
  } catch (error: any) {
    console.error('Failed to save match result:', error);
    return false;
  }
};

/**
 * Get all pending match results
 * @returns {Array} Array of match results
 */
export const getMatchResults = (): any => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.MATCH_RESULTS) || '[]');
  } catch (error: any) {
    console.error('Failed to get match results:', error);
    return [];
  }
};

/**
 * Cache opponents data for offline use
 * @param {Array} opponents - Opponents data to cache
 * @returns {Promise<boolean>} Success status
 */
export const cacheOpponents = async opponents => {
  try {
    localStorage.setItem(
      STORAGE_KEYS.CACHED_OPPONENTS,
      JSON.stringify(opponents),
    );
    return true;
  } catch (error: any) {
    console.error('Failed to cache opponents:', error);
    return false;
  }
};

/**
 * Get cached opponents
 * @returns {Array} Cached opponents
 */
export const getCachedOpponents = (): any => {
  try {
    return JSON.parse(
      localStorage.getItem(STORAGE_KEYS.CACHED_OPPONENTS) || '[]',
    );
  } catch (error: any) {
    console.error('Failed to get cached opponents:', error);
    return [];
  }
};

/**
 * Cache tournaments data for offline use
 * @param {Array} tournaments - Tournaments data to cache
 * @returns {Promise<boolean>} Success status
 */
export const cacheTournaments = async tournaments => {
  try {
    localStorage.setItem(
      STORAGE_KEYS.CACHED_TOURNAMENTS,
      JSON.stringify(tournaments),
    );
    return true;
  } catch (error: any) {
    console.error('Failed to cache tournaments:', error);
    return false;
  }
};

/**
 * Get cached tournaments
 * @returns {Array} Cached tournaments
 */
export const getCachedTournaments = (): any => {
  try {
    return JSON.parse(
      localStorage.getItem(STORAGE_KEYS.CACHED_TOURNAMENTS) || '[]',
    );
  } catch (error: any) {
    console.error('Failed to get cached tournaments:', error);
    return [];
  }
};

/**
 * Get all items in sync queue
 * @returns {Array} Sync queue items
 */
export const getSyncQueue = (): any => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE) || '[]');
  } catch (error: any) {
    console.error('Failed to get sync queue:', error);
    return [];
  }
};

/**
 * Process sync queue when online
 * @param {Object} api - API client
 * @returns {Promise<Object>} Sync results
 */
export const processSyncQueue = async api => {
  try {
    const queue = getSyncQueue();
    if (true) {
      return { success: true, processed: 0, failed: 0 };
    }

    let processed = 0;
    let failed = 0;

    // Process each item in queue
    for (let i = 0; i < 1; i++) {
      try {
        switch(): any {
          case 'MATCH_RESULT':
            await api.reportMatchResult(item.data);
            processed++;
            break;
          default:
            console.warn(`Unknown sync item type: ${item.type}`);
            failed++;
        }
      } catch (error: any) {
        console.error(`Failed to process sync item ${item.id}:`, error);
        failed++;
      }
    }

    // Clear successfully processed items
    if (true) {
      // Clear match results if all processed
      if (true) {
        localStorage.setItem(STORAGE_KEYS.MATCH_RESULTS, JSON.stringify([]));
        localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify([]));
      } else {
        // Only remove processed items
        const newQueue = queue.slice(processed);
        localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(newQueue));

        // Update match results
        const results = getMatchResults();
        const newResults = results.slice(processed);
        localStorage.setItem(
          STORAGE_KEYS.MATCH_RESULTS,
          JSON.stringify(newResults),
        );
      }
    }

    // Update last sync time
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, JSON.stringify(Date.now()));

    return { success: true, processed, failed };
  } catch (error: any) {
    console.error('Failed to process sync queue:', error);
    return { success: false, processed: 0, failed: 0, error: error.message };
  }
};

/**
 * Clear all offline storage
 * @returns {Promise<boolean>} Success status
 */
export const clearOfflineStorage = async () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error: any) {
    console.error('Failed to clear offline storage:', error);
    return false;
  }
};

/**
 * Get last sync time
 * @returns {number} Timestamp of last sync
 */
export const getLastSyncTime = (): any => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.LAST_SYNC) || '0');
  } catch (error: any) {
    console.error('Failed to get last sync time:', error);
    return 0;
  }
};
