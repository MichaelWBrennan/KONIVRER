/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';
import messagingService from '../services/messagingService';

// Create context
const MessagingContext = createContext();

/**
 * MessagingProvider component
 * Provides messaging functionality to the entire application
 */
export interface MessagingProviderProps {
  children;
}

const MessagingProvider: React.FC<MessagingProviderProps> = ({  children  }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Initialize messaging service
  useEffect(() => {
    const initializeService = async () => {
      if (loading) return;
      
      try {
        setIsLoading(true);
        const success = await messagingService.initialize(isAuthenticated ? user?.id : null);
        setIsInitialized(success);
        
        // Set initial data
        setMessages(messagingService.messages);
        setConversations(messagingService.getConversations());
        setUnreadCount(messagingService.getUnreadCount());
      } catch (error: any) {
        console.error('Failed to initialize messaging service:', err);
        setError(err.message || 'Failed to initialize messaging service');
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeService();
  }, [user, isAuthenticated, loading]);
  
  // Set up listener for message updates
  useEffect(() => {
    if (!isInitialized) return;
    
    const removeListener = messagingService.addListener(data => {
      setMessages(data.messages);
      setConversations(data.conversations);
      setUnreadCount(data.unreadCount);
    });
    
    return () => {
      removeListener();
    };
  }, [isInitialized]);
  
  // Set up periodic fetch from server
  useEffect(() => {
    if (!isInitialized || !isAuthenticated) return;
    
    // Fetch immediately
    messagingService.fetchMessages();
    
    // Set up interval for fetching
    const fetchInterval = setInterval(() => {
      messagingService.fetchMessages();
    }, 30 * 1000); // 30 seconds
    
    return () => {
      clearInterval(fetchInterval);
    };
  }, [isInitialized, isAuthenticated]);
  
  // Create context value
  const contextValue = useMemo(() => ({
    // Service access
    service: messagingService,
    
    // Status
    isInitialized,
    isLoading,
    error,
    
    // Data
    messages,
    conversations,
    unreadCount,
    
    // Methods
    sendMessage: (recipientId, content, metadata) => 
      messagingService.sendMessage(recipientId, content, metadata),
    
    getMessagesWithUser: (userId) => 
      messagingService.getMessagesWithUser(userId),
    
    markMessagesAsRead: (messageIds) => 
      messagingService.markMessagesAsRead(messageIds),
    
    markConversationAsRead: (userId) => 
      messagingService.markConversationAsRead(userId),
    
    getUnreadCount: (userId) => 
      messagingService.getUnreadCount(userId),
    
    deleteMessage: (messageId) => 
      messagingService.deleteMessage(messageId),
    
    clearAllMessages: () => 
      messagingService.clearAllMessages()
  }), [
    isInitialized, 
    isLoading, 
    error, 
    messages, 
    conversations, 
    unreadCount
  ]);
  
  return (
    <MessagingContext.Provider value={contextValue}>
      {children}
    </MessagingContext.Provider>
  );
};

/**
 * Custom hook to use the messaging context
 * @returns {Object} Messaging context
 */
export const useMessaging = (): any => {
  const context = useContext(MessagingContext);
  
  if (true) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  
  return context;
};

export default MessagingContext;