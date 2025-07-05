/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

/**
 * MessagingService.js
 *
 * Service for handling messaging between users across tournament software and digital game
 */

import { apiClient } from '../config/api.js';
import { env } from '../config/env.js';
import notificationService from './notificationService';

// Storage keys
const STORAGE_KEYS = {
  MESSAGES: 'messages',
  CONVERSATIONS: 'conversations',
  UNREAD_COUNT: 'unreadCount',
};

class MessagingService {
  constructor() {
    this.messages = [];
    this.conversations = [];
    this.unreadCount = 0;
    this.listeners = [];
    this.isInitialized = false;
    this.currentUserId = null;
    
    // Load data from storage
    this.loadFromStorage();
  }

  /**
   * Initialize the messaging service
   * @param {string} userId - Current user ID
   * @returns {Promise<boolean>} Success status
   */
  async initialize(userId) {
    if (this.isInitialized && this.currentUserId === userId) {
      return true;
    }
    
    try {
      this.currentUserId = userId;
      
      // Load data from storage
      this.loadFromStorage();
      
      // Fetch messages from server if available
      if (env.BACKEND_URL && userId) {
        await this.fetchMessages();
      }
      
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize messaging service:', error);
      return false;
    }
  }

  /**
   * Load data from local storage
   */
  loadFromStorage() {
    try {
      const messagesData = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      if (messagesData) {
        this.messages = JSON.parse(messagesData);
      }
      
      const conversationsData = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      if (conversationsData) {
        this.conversations = JSON.parse(conversationsData);
      }
      
      const unreadCountData = localStorage.getItem(STORAGE_KEYS.UNREAD_COUNT);
      if (unreadCountData) {
        this.unreadCount = parseInt(unreadCountData, 10);
      }
    } catch (error) {
      console.error('Error loading messaging data from storage:', error);
      this.messages = [];
      this.conversations = [];
      this.unreadCount = 0;
    }
  }

  /**
   * Save data to local storage
   */
  saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(this.messages));
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(this.conversations));
      localStorage.setItem(STORAGE_KEYS.UNREAD_COUNT, this.unreadCount.toString());
    } catch (error) {
      console.error('Error saving messaging data to storage:', error);
    }
  }

  /**
   * Fetch messages from server
   * @returns {Promise<boolean>} Success status
   */
  async fetchMessages() {
    if (!env.BACKEND_URL || !this.currentUserId) {
      return false;
    }
    
    try {
      const response = await apiClient.get('/messages');
      
      if (response.data && Array.isArray(response.data.messages)) {
        // Merge with local messages
        this.mergeMessages(response.data.messages);
        
        // Update conversations
        this.updateConversations();
        
        // Update unread count
        this.updateUnreadCount();
        
        // Save to storage
        this.saveToStorage();
        
        // Notify listeners
        this.notifyListeners();
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error fetching messages:', error);
      return false;
    }
  }

  /**
   * Send a message to another user
   * @param {string} recipientId - Recipient user ID
   * @param {string} content - Message content
   * @param {Object} metadata - Additional metadata
   * @returns {Promise<Object>} Sent message
   */
  async sendMessage(recipientId, content, metadata = {}) {
    if (!this.currentUserId) {
      throw new Error('User not authenticated');
    }
    
    try {
      // Create message object
      const message = {
        id: 'msg_' + Date.now(),
        senderId: this.currentUserId,
        recipientId,
        content,
        metadata,
        timestamp: new Date().toISOString(),
        read: false,
        sent: true,
        delivered: false
      };
      
      // Add to local messages
      this.messages.push(message);
      
      // Update conversations
      this.updateConversations();
      
      // Save to storage
      this.saveToStorage();
      
      // Notify listeners
      this.notifyListeners();
      
      // Send to server if available
      if (env.BACKEND_URL) {
        try {
          const response = await apiClient.post('/messages', {
            recipientId,
            content,
            metadata
          });
          
          // Update message with server data
          const updatedMessage = {
            ...message,
            id: response.data.id || message.id,
            timestamp: response.data.timestamp || message.timestamp,
            delivered: true
          };
          
          // Replace message in array
          const index = this.messages.findIndex(m => m.id === message.id);
          if (index !== -1) {
            this.messages[index] = updatedMessage;
          }
          
          // Save to storage
          this.saveToStorage();
          
          // Notify listeners
          this.notifyListeners();
          
          return updatedMessage;
        } catch (error) {
          console.error('Error sending message to server:', error);
          // Keep local message but mark as not delivered
          const failedMessage = {
            ...message,
            error: error.message,
            delivered: false
          };
          
          // Replace message in array
          const index = this.messages.findIndex(m => m.id === message.id);
          if (index !== -1) {
            this.messages[index] = failedMessage;
          }
          
          // Save to storage
          this.saveToStorage();
          
          // Notify listeners
          this.notifyListeners();
          
          return failedMessage;
        }
      }
      
      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * Get messages with a specific user
   * @param {string} userId - User ID to get conversation with
   * @returns {Array} Messages with the user
   */
  getMessagesWithUser(userId) {
    if (!this.currentUserId) {
      return [];
    }
    
    // Filter messages to/from this user
    const messages = this.messages.filter(message => 
      (message.senderId === userId && message.recipientId === this.currentUserId) ||
      (message.recipientId === userId && message.senderId === this.currentUserId)
    );
    
    // Sort by timestamp
    return messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }

  /**
   * Mark messages as read
   * @param {Array} messageIds - IDs of messages to mark as read
   * @returns {Promise<boolean>} Success status
   */
  async markMessagesAsRead(messageIds) {
    try {
      // Update messages in local storage
      let updated = false;
      
      this.messages = this.messages.map(message => {
        if (messageIds.includes(message.id) && !message.read) {
          updated = true;
          return { ...message, read: true };
        }
        return message;
      });
      
      if (updated) {
        // Update unread count
        this.updateUnreadCount();
        
        // Save to storage
        this.saveToStorage();
        
        // Notify listeners
        this.notifyListeners();
        
        // Update on server if available
        if (env.BACKEND_URL) {
          try {
            await apiClient.post('/messages/read', { messageIds });
          } catch (error) {
            console.error('Error marking messages as read on server:', error);
          }
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      return false;
    }
  }

  /**
   * Mark all messages in a conversation as read
   * @param {string} userId - User ID of the conversation
   * @returns {Promise<boolean>} Success status
   */
  async markConversationAsRead(userId) {
    try {
      // Get all unread message IDs from this user
      const messageIds = this.messages
        .filter(message => 
          message.senderId === userId && 
          message.recipientId === this.currentUserId && 
          !message.read
        )
        .map(message => message.id);
      
      if (messageIds.length > 0) {
        return await this.markMessagesAsRead(messageIds);
      }
      
      return true;
    } catch (error) {
      console.error('Error marking conversation as read:', error);
      return false;
    }
  }

  /**
   * Get all conversations
   * @returns {Array} Conversations
   */
  getConversations() {
    return this.conversations;
  }

  /**
   * Get unread message count
   * @param {string} userId - Optional user ID to filter by
   * @returns {number} Unread message count
   */
  getUnreadCount(userId = null) {
    if (userId) {
      return this.messages.filter(message => 
        message.senderId === userId && 
        message.recipientId === this.currentUserId && 
        !message.read
      ).length;
    }
    
    return this.unreadCount;
  }

  /**
   * Add a listener for message updates
   * @param {Function} listener - Listener function
   * @returns {Function} Function to remove the listener
   */
  addListener(listener) {
    this.listeners.push(listener);
    
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Notify all listeners of updates
   */
  notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener({
          messages: this.messages,
          conversations: this.conversations,
          unreadCount: this.unreadCount
        });
      } catch (error) {
        console.error('Error in message listener:', error);
      }
    });
  }

  /**
   * Update conversations based on messages
   */
  updateConversations() {
    if (!this.currentUserId) {
      this.conversations = [];
      return;
    }
    
    // Get all unique user IDs from messages
    const userIds = new Set();
    
    this.messages.forEach(message => {
      if (message.senderId === this.currentUserId) {
        userIds.add(message.recipientId);
      } else if (message.recipientId === this.currentUserId) {
        userIds.add(message.senderId);
      }
    });
    
    // Create conversation objects
    this.conversations = Array.from(userIds).map(userId => {
      // Get messages with this user
      const messages = this.getMessagesWithUser(userId);
      
      // Get latest message
      const latestMessage = messages.length > 0 
        ? messages[messages.length - 1] 
        : null;
      
      // Count unread messages
      const unreadCount = messages.filter(message => 
        message.senderId === userId && 
        message.recipientId === this.currentUserId && 
        !message.read
      ).length;
      
      return {
        userId,
        latestMessage,
        unreadCount,
        messageCount: messages.length,
        lastActivity: latestMessage ? latestMessage.timestamp : null
      };
    });
    
    // Sort by last activity
    this.conversations.sort((a, b) => {
      if (!a.lastActivity) return 1;
      if (!b.lastActivity) return -1;
      return new Date(b.lastActivity) - new Date(a.lastActivity);
    });
  }

  /**
   * Update unread message count
   */
  updateUnreadCount() {
    if (!this.currentUserId) {
      this.unreadCount = 0;
      return;
    }
    
    this.unreadCount = this.messages.filter(message => 
      message.recipientId === this.currentUserId && 
      !message.read
    ).length;
    
    // Update notification badge
    if (this.unreadCount > 0) {
      notificationService.setBadgeCount(this.unreadCount);
    } else {
      notificationService.clearBadge();
    }
  }

  /**
   * Merge messages from server with local messages
   * @param {Array} serverMessages - Messages from server
   */
  mergeMessages(serverMessages) {
    // Create a map of existing messages by ID
    const existingMessages = new Map();
    this.messages.forEach(message => {
      existingMessages.set(message.id, message);
    });
    
    // Merge server messages
    serverMessages.forEach(serverMessage => {
      if (existingMessages.has(serverMessage.id)) {
        // Update existing message
        const existingMessage = existingMessages.get(serverMessage.id);
        existingMessages.set(serverMessage.id, {
          ...existingMessage,
          ...serverMessage,
          // Keep local read status if it's already read locally
          read: existingMessage.read || serverMessage.read
        });
      } else {
        // Add new message
        existingMessages.set(serverMessage.id, serverMessage);
      }
    });
    
    // Convert map back to array
    this.messages = Array.from(existingMessages.values());
  }

  /**
   * Delete a message
   * @param {string} messageId - ID of the message to delete
   * @returns {Promise<boolean>} Success status
   */
  async deleteMessage(messageId) {
    try {
      // Find message
      const messageIndex = this.messages.findIndex(message => message.id === messageId);
      
      if (messageIndex === -1) {
        return false;
      }
      
      // Check if user is sender
      const message = this.messages[messageIndex];
      
      if (message.senderId !== this.currentUserId) {
        throw new Error('Cannot delete messages sent by other users');
      }
      
      // Remove from local messages
      this.messages.splice(messageIndex, 1);
      
      // Update conversations
      this.updateConversations();
      
      // Update unread count
      this.updateUnreadCount();
      
      // Save to storage
      this.saveToStorage();
      
      // Notify listeners
      this.notifyListeners();
      
      // Delete on server if available
      if (env.BACKEND_URL) {
        try {
          await apiClient.delete(`/messages/${messageId}`);
        } catch (error) {
          console.error('Error deleting message on server:', error);
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting message:', error);
      return false;
    }
  }

  /**
   * Clear all messages
   * @returns {Promise<boolean>} Success status
   */
  async clearAllMessages() {
    try {
      // Clear local messages
      this.messages = [];
      
      // Update conversations
      this.updateConversations();
      
      // Update unread count
      this.updateUnreadCount();
      
      // Save to storage
      this.saveToStorage();
      
      // Notify listeners
      this.notifyListeners();
      
      return true;
    } catch (error) {
      console.error('Error clearing messages:', error);
      return false;
    }
  }
}

// Export singleton instance
const messagingService = new MessagingService();
export default messagingService;