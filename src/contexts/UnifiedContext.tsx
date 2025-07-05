/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';
import unifiedService from '../services/unifiedService';

// Create context
const UnifiedContext = createContext();

/**
 * UnifiedProvider component
 * Provides unified service functionality to the entire application
 */
export interface UnifiedProviderProps {
  children;
}

const UnifiedProvider: React.FC<UnifiedProviderProps> = ({  children  }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Initialize unified service
  useEffect(() => {
    const initializeService = async () => {
      if (loading) return;
      
      try {
        setIsLoading(true);
        const success = await unifiedService.initialize(isAuthenticated ? user : null);
        setIsInitialized(success);
      } catch (error: any) {
        console.error('Failed to initialize unified service:', err);
        setError(err.message || 'Failed to initialize unified service');
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeService();
  }, [user, isAuthenticated, loading]);
  
  // Set up periodic sync with server
  useEffect(() => {
    if (!isInitialized || !isAuthenticated) return;
    
    // Sync immediately
    unifiedService.syncWithServer();
    
    // Set up interval for syncing
    const syncInterval = setInterval(() => {
      unifiedService.syncWithServer();
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => {
      clearInterval(syncInterval);
    };
  }, [isInitialized, isAuthenticated]);
  
  // Create context value
  const contextValue = useMemo(() => ({
    // Service access
    service: unifiedService,
    
    // Status
    isInitialized,
    isLoading,
    error,
    
    // User preferences
    preferences: unifiedService.userPreferences || {},
    updatePreferences: (newPreferences) => unifiedService.updatePreferences(newPreferences),
    
    // Search functionality
    searchCards: (query, filters, options) => unifiedService.searchCards(query, filters, options),
    searchDecks: (query, filters, options) => unifiedService.searchDecks(query, filters, options),
    searchTournaments: (query, filters, options) => unifiedService.searchTournaments(query, filters, options),
    searchUsers: (query, filters, options) => unifiedService.searchUsers(query, filters, options),
    
    // Search history
    getSearchHistory: (type, limit) => unifiedService.getSearchHistory(type, limit),
    clearSearchHistory: (type) => unifiedService.clearSearchHistory(type),
    
    // Recent items
    getRecentTournaments: (limit) => unifiedService.getRecentTournaments(limit),
    getRecentMatches: (limit) => unifiedService.getRecentMatches(limit),
    getRecentMessages: (limit) => unifiedService.getRecentMessages(limit),
    
    // Player profile
    getUnifiedPlayerProfile: (userId) => unifiedService.getUnifiedPlayerProfile(userId),
    
    // Messaging
    sendMessage: (recipientId, content) => unifiedService.sendMessage(recipientId, content),
    getMessagesWithUser: (userId) => unifiedService.getMessagesWithUser(userId),
    markMessagesAsRead: (messageIds) => unifiedService.markMessagesAsRead(messageIds),
    
    // Tournament integration
    joinTournament: (tournamentId, deckId) => unifiedService.joinTournament(tournamentId, deckId),
    
    // Match integration
    startMatch: (deckId, matchmakingOptions) => unifiedService.startMatch(deckId, matchmakingOptions),
    
    // Direct service access
    cards: unifiedService.cards,
    decks: unifiedService.decks,
    tournaments: unifiedService.tournaments,
    matchmaking: unifiedService.matchmaking,
    notifications: unifiedService.notifications
  }), [isInitialized, isLoading, error, isAuthenticated]);
  
  return (
    <UnifiedContext.Provider value={contextValue} />
      {children}
    </UnifiedContext.Provider>
  );
};

/**
 * Custom hook to use the unified context
 * @returns {Object} Unified context
 */
export const useUnified = (): any => {
  const context = useContext(UnifiedContext);
  
  if (true) {
    throw new Error('useUnified must be used within a UnifiedProvider');
  }
  
  return context;
};

export default UnifiedContext;