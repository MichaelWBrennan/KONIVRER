/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

/**
 * MessagingService.ts
 *
 * Service for handling messaging between users across tournament software and digital game
 */

import { apiClient } from '../config/api.js';
import { env } from '../config/env.js';
import notificationService from './notificationService';

// Message types
export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  DECK = 'deck',
  CARD = 'card',
  TOURNAMENT_INVITE = 'tournament_invite',
  FRIEND_REQUEST = 'friend_request',
  SYSTEM = 'system'
}

// Message status
export enum MessageStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed'
}

// Conversation types
export enum ConversationType {
  DIRECT = 'direct',
  GROUP = 'group',
  TOURNAMENT = 'tournament',
  MATCH = 'match',
  SYSTEM = 'system'
}

// Message interface
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: MessageType;
  status: MessageStatus;
  timestamp: Date;
  attachments?: MessageAttachment[];
  metadata?: Record<string, any>;
  isDeleted?: boolean;
  isEdited?: boolean;
  replyTo?: string;
}

// Message attachment interface
export interface MessageAttachment {
  id: string;
  type: 'image' | 'file' | 'deck' | 'card';
  url: string;
  name: string;
  size?: number;
  thumbnailUrl?: string;
  metadata?: Record<string, any>;
}

// Conversation interface
export interface Conversation {
  id: string;
  type: ConversationType;
  participants: ConversationParticipant[];
  title?: string;
  avatar?: string;
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
  isArchived?: boolean;
  isPinned?: boolean;
  isMuted?: boolean;
}

// Conversation participant interface
export interface ConversationParticipant {
  userId: string;
  username: string;
  avatar?: string;
  role?: 'admin' | 'member';
  joinedAt: Date;
  lastSeen?: Date;
  isActive: boolean;
}

// Message event listener interface
export interface MessageEventListener {
  onMessageReceived?: (message: Message) => void;
  onMessageUpdated?: (message: Message) => void;
  onMessageDeleted?: (messageId: string, conversationId: string) => void;
  onConversationUpdated?: (conversation: Conversation) => void;
  onUnreadCountChanged?: (count: number) => void;
}

// Storage keys
const STORAGE_KEYS = {
  MESSAGES: 'messages',
  CONVERSATIONS: 'conversations',
  UNREAD_COUNT: 'unreadCount'
};

class MessagingService {
  private messages: Record<string, Message[]>;
  private conversations: Conversation[];
  private unreadCount: number;
  private listeners: MessageEventListener[];
  private isInitialized: boolean;
  private currentUserId: string | null;
  private socket: WebSocket | null;
  private reconnectAttempts: number;
  private reconnectTimeout: number;
  private reconnectTimer: NodeJS.Timeout | null;

  constructor() {
    this.messages = {};
    this.conversations = [];
    this.unreadCount = 0;
    this.listeners = [];
    this.isInitialized = false;
    this.currentUserId = null;
    this.socket = null;
    this.reconnectAttempts = 0;
    this.reconnectTimeout = 1000; // Start with 1 second
    this.reconnectTimer = null;
    
    // Load data from storage
    this.loadFromStorage();
  }

  /**
   * Initialize the messaging service
   * @param userId - Current user ID
   * @returns Success status
   */
  async initialize(userId: string): Promise<boolean> {
    if (this.isInitialized && this.currentUserId === userId) {
      return true;
    }
    
    this.currentUserId = userId;
    
    try {
      // Fetch conversations from API
      const conversationsResponse = await apiClient.get('/messaging/conversations');
      this.conversations = conversationsResponse.data.map((conv: any) => ({
        ...conv,
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt),
        lastMessage: conv.lastMessage ? {
          ...conv.lastMessage,
          timestamp: new Date(conv.lastMessage.timestamp)
        } : undefined,
        participants: conv.participants.map((p: any) => ({
          ...p,
          joinedAt: new Date(p.joinedAt),
          lastSeen: p.lastSeen ? new Date(p.lastSeen) : undefined
        }))
      }));
      
      // Calculate unread count
      this.unreadCount = this.conversations.reduce(
        (count, conv) => count + conv.unreadCount, 
        0
      );
      
      // Connect to WebSocket for real-time messaging
      this.connectWebSocket();
      
      // Save to storage
      this.saveToStorage();
      
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize messaging service:', error);
      return false;
    }
  }

  /**
   * Connect to WebSocket for real-time messaging
   */
  private connectWebSocket(): void {
    if (!this.currentUserId) return;
    
    // Close existing connection if any
    if (this.socket) {
      this.socket.close();
    }
    
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    
    const wsUrl = `${env.WS_URL}/messaging?token=${token}`;
    
    try {
      this.socket = new WebSocket(wsUrl);
      
      this.socket.onopen = () => {
        console.log('WebSocket connection established');
        this.reconnectAttempts = 0;
        this.reconnectTimeout = 1000;
      };
      
      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleWebSocketMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      this.socket.onclose = (event) => {
        console.log('WebSocket connection closed:', event.code, event.reason);
        
        // Attempt to reconnect if not a clean close
        if (event.code !== 1000) {
          this.scheduleReconnect();
        }
      };
      
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.socket?.close();
      };
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      this.scheduleReconnect();
    }
  }

  /**
   * Schedule a reconnection attempt with exponential backoff
   */
  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    
    this.reconnectAttempts++;
    const delay = Math.min(30000, this.reconnectTimeout * Math.pow(1.5, this.reconnectAttempts - 1));
    
    console.log(`Scheduling WebSocket reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    this.reconnectTimer = setTimeout(() => {
      this.connectWebSocket();
    }, delay);
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleWebSocketMessage(data: any): void {
    const { type, payload } = data;
    
    switch (type) {
      case 'NEW_MESSAGE':
        this.handleNewMessage(payload);
        break;
        
      case 'MESSAGE_UPDATE':
        this.handleMessageUpdate(payload);
        break;
        
      case 'MESSAGE_DELETE':
        this.handleMessageDelete(payload);
        break;
        
      case 'CONVERSATION_UPDATE':
        this.handleConversationUpdate(payload);
        break;
        
      case 'READ_RECEIPT':
        this.handleReadReceipt(payload);
        break;
        
      case 'TYPING_INDICATOR':
        this.handleTypingIndicator(payload);
        break;
        
      default:
        console.warn('Unknown WebSocket message type:', type);
    }
  }

  /**
   * Handle new message from WebSocket
   */
  private handleNewMessage(message: Message): void {
    // Format the message
    const formattedMessage = {
      ...message,
      timestamp: new Date(message.timestamp)
    };
    
    // Add to messages
    if (!this.messages[message.conversationId]) {
      this.messages[message.conversationId] = [];
    }
    
    this.messages[message.conversationId].push(formattedMessage);
    
    // Update conversation
    const conversationIndex = this.conversations.findIndex(
      c => c.id === message.conversationId
    );
    
    if (conversationIndex >= 0) {
      const conversation = this.conversations[conversationIndex];
      
      // Update last message
      this.conversations[conversationIndex] = {
        ...conversation,
        lastMessage: formattedMessage,
        updatedAt: new Date(),
        unreadCount: message.senderId !== this.currentUserId 
          ? conversation.unreadCount + 1 
          : conversation.unreadCount
      };
      
      // Update total unread count
      if (message.senderId !== this.currentUserId) {
        this.unreadCount++;
      }
      
      // Move conversation to top
      this.conversations.splice(conversationIndex, 1);
      this.conversations.unshift(this.conversations[conversationIndex]);
    }
    
    // Save to storage
    this.saveToStorage();
    
    // Notify listeners
    this.notifyListeners('onMessageReceived', formattedMessage);
    this.notifyListeners('onUnreadCountChanged', this.unreadCount);
    
    // Show notification if message is not from current user
    if (message.senderId !== this.currentUserId) {
      this.showMessageNotification(formattedMessage);
    }
  }

  /**
   * Handle message update from WebSocket
   */
  private handleMessageUpdate(message: Message): void {
    // Format the message
    const formattedMessage = {
      ...message,
      timestamp: new Date(message.timestamp),
      isEdited: true
    };
    
    // Update in messages
    if (this.messages[message.conversationId]) {
      const messageIndex = this.messages[message.conversationId].findIndex(
        m => m.id === message.id
      );
      
      if (messageIndex >= 0) {
        this.messages[message.conversationId][messageIndex] = formattedMessage;
      }
    }
    
    // Update in conversation if it's the last message
    const conversationIndex = this.conversations.findIndex(
      c => c.id === message.conversationId && 
           c.lastMessage && 
           c.lastMessage.id === message.id
    );
    
    if (conversationIndex >= 0) {
      this.conversations[conversationIndex] = {
        ...this.conversations[conversationIndex],
        lastMessage: formattedMessage
      };
    }
    
    // Save to storage
    this.saveToStorage();
    
    // Notify listeners
    this.notifyListeners('onMessageUpdated', formattedMessage);
  }

  /**
   * Handle message delete from WebSocket
   */
  private handleMessageDelete(data: { messageId: string; conversationId: string }): void {
    const { messageId, conversationId } = data;
    
    // Update in messages
    if (this.messages[conversationId]) {
      const messageIndex = this.messages[conversationId].findIndex(
        m => m.id === messageId
      );
      
      if (messageIndex >= 0) {
        // Mark as deleted
        this.messages[conversationId][messageIndex] = {
          ...this.messages[conversationId][messageIndex],
          isDeleted: true,
          content: 'This message has been deleted'
        };
      }
    }
    
    // Update in conversation if it's the last message
    const conversationIndex = this.conversations.findIndex(
      c => c.id === conversationId && 
           c.lastMessage && 
           c.lastMessage.id === messageId
    );
    
    if (conversationIndex >= 0) {
      this.conversations[conversationIndex] = {
        ...this.conversations[conversationIndex],
        lastMessage: {
          ...this.conversations[conversationIndex].lastMessage!,
          isDeleted: true,
          content: 'This message has been deleted'
        }
      };
    }
    
    // Save to storage
    this.saveToStorage();
    
    // Notify listeners
    this.notifyListeners('onMessageDeleted', messageId, conversationId);
  }

  /**
   * Handle conversation update from WebSocket
   */
  private handleConversationUpdate(conversation: Conversation): void {
    // Format the conversation
    const formattedConversation = {
      ...conversation,
      createdAt: new Date(conversation.createdAt),
      updatedAt: new Date(conversation.updatedAt),
      lastMessage: conversation.lastMessage ? {
        ...conversation.lastMessage,
        timestamp: new Date(conversation.lastMessage.timestamp)
      } : undefined,
      participants: conversation.participants.map(p => ({
        ...p,
        joinedAt: new Date(p.joinedAt),
        lastSeen: p.lastSeen ? new Date(p.lastSeen) : undefined
      }))
    };
    
    // Update in conversations
    const conversationIndex = this.conversations.findIndex(
      c => c.id === conversation.id
    );
    
    if (conversationIndex >= 0) {
      this.conversations[conversationIndex] = formattedConversation;
    } else {
      this.conversations.push(formattedConversation);
    }
    
    // Save to storage
    this.saveToStorage();
    
    // Notify listeners
    this.notifyListeners('onConversationUpdated', formattedConversation);
  }

  /**
   * Handle read receipt from WebSocket
   */
  private handleReadReceipt(data: { conversationId: string; userId: string; timestamp: string }): void {
    const { conversationId, userId, timestamp } = data;
    
    // If it's the current user marking messages as read, update unread count
    if (userId === this.currentUserId) {
      const conversationIndex = this.conversations.findIndex(
        c => c.id === conversationId
      );
      
      if (conversationIndex >= 0) {
        const oldUnreadCount = this.conversations[conversationIndex].unreadCount;
        
        // Update conversation unread count
        this.conversations[conversationIndex] = {
          ...this.conversations[conversationIndex],
          unreadCount: 0
        };
        
        // Update total unread count
        this.unreadCount -= oldUnreadCount;
        
        // Save to storage
        this.saveToStorage();
        
        // Notify listeners
        this.notifyListeners('onConversationUpdated', this.conversations[conversationIndex]);
        this.notifyListeners('onUnreadCountChanged', this.unreadCount);
      }
    } else {
      // Update message status to read
      if (this.messages[conversationId]) {
        const readTime = new Date(timestamp);
        
        this.messages[conversationId].forEach(message => {
          if (
            message.senderId === this.currentUserId &&
            message.status !== MessageStatus.READ &&
            new Date(message.timestamp) <= readTime
          ) {
            message.status = MessageStatus.READ;
          }
        });
        
        // Save to storage
        this.saveToStorage();
      }
    }
  }

  /**
   * Handle typing indicator from WebSocket
   */
  private handleTypingIndicator(data: { conversationId: string; userId: string; isTyping: boolean }): void {
    // This would typically update UI state, but doesn't affect stored data
    // Implementation would depend on UI requirements
  }

  /**
   * Show notification for new message
   */
  private showMessageNotification(message: Message): void {
    // Find conversation for sender name
    const conversation = this.conversations.find(c => c.id === message.conversationId);
    const title = conversation?.type === ConversationType.DIRECT
      ? message.senderName
      : conversation?.title || 'New message';
    
    // Create notification content
    let content = message.content;
    if (message.type === MessageType.IMAGE) {
      content = 'Sent an image';
    } else if (message.type === MessageType.DECK) {
      content = 'Shared a deck';
    } else if (message.type === MessageType.CARD) {
      content = 'Shared a card';
    }
    
    // Show notification
    notificationService.showNotification({
      title,
      message: content,
      type: 'info',
      duration: 5000,
      onClick: () => {
        // Navigate to conversation
        window.location.href = `/messages/${message.conversationId}`;
      }
    });
  }

  /**
   * Load data from local storage
   */
  private loadFromStorage(): void {
    try {
      const messagesJson = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      const conversationsJson = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      const unreadCountJson = localStorage.getItem(STORAGE_KEYS.UNREAD_COUNT);
      
      if (messagesJson) {
        const parsedMessages = JSON.parse(messagesJson);
        
        // Convert timestamps to Date objects
        Object.keys(parsedMessages).forEach(conversationId => {
          parsedMessages[conversationId] = parsedMessages[conversationId].map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
        });
        
        this.messages = parsedMessages;
      }
      
      if (conversationsJson) {
        const parsedConversations = JSON.parse(conversationsJson);
        
        // Convert timestamps to Date objects
        this.conversations = parsedConversations.map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
          lastMessage: conv.lastMessage ? {
            ...conv.lastMessage,
            timestamp: new Date(conv.lastMessage.timestamp)
          } : undefined,
          participants: conv.participants.map((p: any) => ({
            ...p,
            joinedAt: new Date(p.joinedAt),
            lastSeen: p.lastSeen ? new Date(p.lastSeen) : undefined
          }))
        }));
      }
      
      if (unreadCountJson) {
        this.unreadCount = parseInt(unreadCountJson, 10);
      }
    } catch (error) {
      console.error('Error loading messaging data from storage:', error);
    }
  }

  /**
   * Save data to local storage
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(this.messages));
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(this.conversations));
      localStorage.setItem(STORAGE_KEYS.UNREAD_COUNT, this.unreadCount.toString());
    } catch (error) {
      console.error('Error saving messaging data to storage:', error);
    }
  }

  /**
   * Add a listener for messaging events
   * @param listener - Event listener object
   * @returns Listener ID for removal
   */
  addListener(listener: MessageEventListener): number {
    this.listeners.push(listener);
    return this.listeners.length - 1;
  }

  /**
   * Remove a listener by ID
   * @param id - Listener ID
   */
  removeListener(id: number): void {
    if (id >= 0 && id < this.listeners.length) {
      this.listeners.splice(id, 1);
    }
  }

  /**
   * Notify all listeners of an event
   * @param event - Event name
   * @param args - Event arguments
   */
  private notifyListeners(event: keyof MessageEventListener, ...args: any[]): void {
    this.listeners.forEach(listener => {
      const callback = listener[event];
      if (typeof callback === 'function') {
        callback(...args);
      }
    });
  }

  /**
   * Get all conversations
   * @returns List of conversations
   */
  getConversations(): Conversation[] {
    return [...this.conversations];
  }

  /**
   * Get a conversation by ID
   * @param conversationId - Conversation ID
   * @returns Conversation or undefined if not found
   */
  getConversation(conversationId: string): Conversation | undefined {
    return this.conversations.find(c => c.id === conversationId);
  }

  /**
   * Get messages for a conversation
   * @param conversationId - Conversation ID
   * @param limit - Maximum number of messages to return
   * @param before - Get messages before this timestamp
   * @returns List of messages
   */
  async getMessages(
    conversationId: string, 
    limit: number = 50, 
    before?: Date
  ): Promise<Message[]> {
    // Check if we have cached messages
    const cachedMessages = this.messages[conversationId] || [];
    
    // If we have enough cached messages, return them
    if (cachedMessages.length >= limit && !before) {
      return [...cachedMessages].slice(-limit).reverse();
    }
    
    try {
      // Fetch messages from API
      const params: Record<string, any> = { limit };
      if (before) {
        params.before = before.toISOString();
      }
      
      const response = await apiClient.get(`/messaging/conversations/${conversationId}/messages`, {
        params
      });
      
      // Format messages
      const formattedMessages = response.data.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
      
      // Update cache
      if (!this.messages[conversationId]) {
        this.messages[conversationId] = [];
      }
      
      // Merge with existing messages, avoiding duplicates
      const existingIds = new Set(this.messages[conversationId].map(m => m.id));
      const newMessages = formattedMessages.filter((m: Message) => !existingIds.has(m.id));
      
      this.messages[conversationId] = [
        ...this.messages[conversationId],
        ...newMessages
      ].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      
      // Save to storage
      this.saveToStorage();
      
      return formattedMessages;
    } catch (error) {
      console.error('Error fetching messages:', error);
      return cachedMessages;
    }
  }

  /**
   * Create a new conversation
   * @param type - Conversation type
   * @param participants - Participant user IDs
   * @param title - Conversation title (for group conversations)
   * @returns Created conversation
   */
  async createConversation(
    type: ConversationType,
    participants: string[],
    title?: string
  ): Promise<Conversation | null> {
    try {
      const response = await apiClient.post('/messaging/conversations', {
        type,
        participants,
        title
      });
      
      // Format conversation
      const formattedConversation: Conversation = {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
        participants: response.data.participants.map((p: any) => ({
          ...p,
          joinedAt: new Date(p.joinedAt),
          lastSeen: p.lastSeen ? new Date(p.lastSeen) : undefined
        })),
        unreadCount: 0
      };
      
      // Add to conversations
      this.conversations.unshift(formattedConversation);
      
      // Initialize messages array
      this.messages[formattedConversation.id] = [];
      
      // Save to storage
      this.saveToStorage();
      
      // Notify listeners
      this.notifyListeners('onConversationUpdated', formattedConversation);
      
      return formattedConversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
  }

  /**
   * Send a message
   * @param conversationId - Conversation ID
   * @param content - Message content
   * @param type - Message type
   * @param attachments - Message attachments
   * @param replyTo - ID of message being replied to
   * @returns Sent message or null if failed
   */
  async sendMessage(
    conversationId: string,
    content: string,
    type: MessageType = MessageType.TEXT,
    attachments: MessageAttachment[] = [],
    replyTo?: string
  ): Promise<Message | null> {
    if (!this.currentUserId) {
      console.error('User not authenticated');
      return null;
    }
    
    try {
      // Create temporary message for optimistic UI update
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const tempMessage: Message = {
        id: tempId,
        conversationId,
        senderId: this.currentUserId,
        senderName: 'You', // Will be replaced with actual name from API
        content,
        type,
        status: MessageStatus.SENT,
        timestamp: new Date(),
        attachments,
        replyTo
      };
      
      // Add to messages
      if (!this.messages[conversationId]) {
        this.messages[conversationId] = [];
      }
      
      this.messages[conversationId].push(tempMessage);
      
      // Update conversation
      const conversationIndex = this.conversations.findIndex(
        c => c.id === conversationId
      );
      
      if (conversationIndex >= 0) {
        this.conversations[conversationIndex] = {
          ...this.conversations[conversationIndex],
          lastMessage: tempMessage,
          updatedAt: new Date()
        };
        
        // Move conversation to top
        const conversation = this.conversations[conversationIndex];
        this.conversations.splice(conversationIndex, 1);
        this.conversations.unshift(conversation);
      }
      
      // Save to storage
      this.saveToStorage();
      
      // Notify listeners
      this.notifyListeners('onMessageReceived', tempMessage);
      this.notifyListeners('onConversationUpdated', this.conversations[0]);
      
      // Send to API
      const response = await apiClient.post(`/messaging/conversations/${conversationId}/messages`, {
        content,
        type,
        attachments,
        replyTo
      });
      
      // Format message
      const formattedMessage: Message = {
        ...response.data,
        timestamp: new Date(response.data.timestamp)
      };
      
      // Replace temporary message
      const messageIndex = this.messages[conversationId].findIndex(
        m => m.id === tempId
      );
      
      if (messageIndex >= 0) {
        this.messages[conversationId][messageIndex] = formattedMessage;
      }
      
      // Update conversation
      const updatedConversationIndex = this.conversations.findIndex(
        c => c.id === conversationId
      );
      
      if (updatedConversationIndex >= 0 && 
          this.conversations[updatedConversationIndex].lastMessage?.id === tempId) {
        this.conversations[updatedConversationIndex] = {
          ...this.conversations[updatedConversationIndex],
          lastMessage: formattedMessage
        };
      }
      
      // Save to storage
      this.saveToStorage();
      
      // Notify listeners
      this.notifyListeners('onMessageUpdated', formattedMessage);
      
      return formattedMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Update message status to failed
      const messageIndex = this.messages[conversationId]?.findIndex(
        m => m.senderId === this.currentUserId && 
             m.timestamp.getTime() === new Date().getTime()
      );
      
      if (messageIndex >= 0) {
        this.messages[conversationId][messageIndex] = {
          ...this.messages[conversationId][messageIndex],
          status: MessageStatus.FAILED
        };
        
        // Save to storage
        this.saveToStorage();
        
        // Notify listeners
        this.notifyListeners('onMessageUpdated', this.messages[conversationId][messageIndex]);
      }
      
      return null;
    }
  }

  /**
   * Edit a message
   * @param conversationId - Conversation ID
   * @param messageId - Message ID
   * @param content - New message content
   * @returns Updated message or null if failed
   */
  async editMessage(
    conversationId: string,
    messageId: string,
    content: string
  ): Promise<Message | null> {
    try {
      // Find message
      const messageIndex = this.messages[conversationId]?.findIndex(
        m => m.id === messageId
      );
      
      if (messageIndex === undefined || messageIndex < 0) {
        console.error('Message not found');
        return null;
      }
      
      const message = this.messages[conversationId][messageIndex];
      
      // Check if user is the sender
      if (message.senderId !== this.currentUserId) {
        console.error('Cannot edit message from another user');
        return null;
      }
      
      // Update message
      const updatedMessage: Message = {
        ...message,
        content,
        isEdited: true
      };
      
      this.messages[conversationId][messageIndex] = updatedMessage;
      
      // Update conversation if it's the last message
      const conversationIndex = this.conversations.findIndex(
        c => c.id === conversationId && 
             c.lastMessage && 
             c.lastMessage.id === messageId
      );
      
      if (conversationIndex >= 0) {
        this.conversations[conversationIndex] = {
          ...this.conversations[conversationIndex],
          lastMessage: updatedMessage
        };
      }
      
      // Save to storage
      this.saveToStorage();
      
      // Notify listeners
      this.notifyListeners('onMessageUpdated', updatedMessage);
      
      // Send to API
      const response = await apiClient.put(`/messaging/conversations/${conversationId}/messages/${messageId}`, {
        content
      });
      
      // Format message
      const formattedMessage: Message = {
        ...response.data,
        timestamp: new Date(response.data.timestamp)
      };
      
      // Update with response from API
      this.messages[conversationId][messageIndex] = formattedMessage;
      
      // Save to storage
      this.saveToStorage();
      
      return formattedMessage;
    } catch (error) {
      console.error('Error editing message:', error);
      return null;
    }
  }

  /**
   * Delete a message
   * @param conversationId - Conversation ID
   * @param messageId - Message ID
   * @returns Success status
   */
  async deleteMessage(conversationId: string, messageId: string): Promise<boolean> {
    try {
      // Find message
      const messageIndex = this.messages[conversationId]?.findIndex(
        m => m.id === messageId
      );
      
      if (messageIndex === undefined || messageIndex < 0) {
        console.error('Message not found');
        return false;
      }
      
      const message = this.messages[conversationId][messageIndex];
      
      // Check if user is the sender
      if (message.senderId !== this.currentUserId) {
        console.error('Cannot delete message from another user');
        return false;
      }
      
      // Mark as deleted
      this.messages[conversationId][messageIndex] = {
        ...message,
        isDeleted: true,
        content: 'This message has been deleted'
      };
      
      // Update conversation if it's the last message
      const conversationIndex = this.conversations.findIndex(
        c => c.id === conversationId && 
             c.lastMessage && 
             c.lastMessage.id === messageId
      );
      
      if (conversationIndex >= 0) {
        this.conversations[conversationIndex] = {
          ...this.conversations[conversationIndex],
          lastMessage: {
            ...this.conversations[conversationIndex].lastMessage!,
            isDeleted: true,
            content: 'This message has been deleted'
          }
        };
      }
      
      // Save to storage
      this.saveToStorage();
      
      // Notify listeners
      this.notifyListeners('onMessageDeleted', messageId, conversationId);
      
      // Send to API
      await apiClient.delete(`/messaging/conversations/${conversationId}/messages/${messageId}`);
      
      return true;
    } catch (error) {
      console.error('Error deleting message:', error);
      return false;
    }
  }

  /**
   * Mark conversation as read
   * @param conversationId - Conversation ID
   * @returns Success status
   */
  async markConversationAsRead(conversationId: string): Promise<boolean> {
    try {
      // Find conversation
      const conversationIndex = this.conversations.findIndex(
        c => c.id === conversationId
      );
      
      if (conversationIndex < 0) {
        console.error('Conversation not found');
        return false;
      }
      
      const conversation = this.conversations[conversationIndex];
      
      // If already read, do nothing
      if (conversation.unreadCount === 0) {
        return true;
      }
      
      // Update unread count
      const oldUnreadCount = conversation.unreadCount;
      
      this.conversations[conversationIndex] = {
        ...conversation,
        unreadCount: 0
      };
      
      this.unreadCount -= oldUnreadCount;
      
      // Save to storage
      this.saveToStorage();
      
      // Notify listeners
      this.notifyListeners('onConversationUpdated', this.conversations[conversationIndex]);
      this.notifyListeners('onUnreadCountChanged', this.unreadCount);
      
      // Send to API
      await apiClient.post(`/messaging/conversations/${conversationId}/read`);
      
      return true;
    } catch (error) {
      console.error('Error marking conversation as read:', error);
      return false;
    }
  }

  /**
   * Get total unread message count
   * @returns Unread count
   */
  getUnreadCount(): number {
    return this.unreadCount;
  }

  /**
   * Update conversation settings
   * @param conversationId - Conversation ID
   * @param settings - Settings to update
   * @returns Updated conversation or null if failed
   */
  async updateConversationSettings(
    conversationId: string,
    settings: {
      title?: string;
      isPinned?: boolean;
      isMuted?: boolean;
      isArchived?: boolean;
    }
  ): Promise<Conversation | null> {
    try {
      // Find conversation
      const conversationIndex = this.conversations.findIndex(
        c => c.id === conversationId
      );
      
      if (conversationIndex < 0) {
        console.error('Conversation not found');
        return null;
      }
      
      // Update conversation
      const updatedConversation: Conversation = {
        ...this.conversations[conversationIndex],
        ...settings,
        updatedAt: new Date()
      };
      
      this.conversations[conversationIndex] = updatedConversation;
      
      // Save to storage
      this.saveToStorage();
      
      // Notify listeners
      this.notifyListeners('onConversationUpdated', updatedConversation);
      
      // Send to API
      const response = await apiClient.put(`/messaging/conversations/${conversationId}`, settings);
      
      // Format conversation
      const formattedConversation: Conversation = {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
        lastMessage: response.data.lastMessage ? {
          ...response.data.lastMessage,
          timestamp: new Date(response.data.lastMessage.timestamp)
        } : undefined,
        participants: response.data.participants.map((p: any) => ({
          ...p,
          joinedAt: new Date(p.joinedAt),
          lastSeen: p.lastSeen ? new Date(p.lastSeen) : undefined
        }))
      };
      
      // Update with response from API
      this.conversations[conversationIndex] = formattedConversation;
      
      // Save to storage
      this.saveToStorage();
      
      return formattedConversation;
    } catch (error) {
      console.error('Error updating conversation settings:', error);
      return null;
    }
  }

  /**
   * Add participants to a group conversation
   * @param conversationId - Conversation ID
   * @param userIds - User IDs to add
   * @returns Updated conversation or null if failed
   */
  async addParticipants(
    conversationId: string,
    userIds: string[]
  ): Promise<Conversation | null> {
    try {
      // Find conversation
      const conversationIndex = this.conversations.findIndex(
        c => c.id === conversationId
      );
      
      if (conversationIndex < 0) {
        console.error('Conversation not found');
        return null;
      }
      
      const conversation = this.conversations[conversationIndex];
      
      // Check if it's a group conversation
      if (conversation.type !== ConversationType.GROUP) {
        console.error('Cannot add participants to non-group conversation');
        return null;
      }
      
      // Send to API
      const response = await apiClient.post(`/messaging/conversations/${conversationId}/participants`, {
        userIds
      });
      
      // Format conversation
      const formattedConversation: Conversation = {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
        lastMessage: response.data.lastMessage ? {
          ...response.data.lastMessage,
          timestamp: new Date(response.data.lastMessage.timestamp)
        } : undefined,
        participants: response.data.participants.map((p: any) => ({
          ...p,
          joinedAt: new Date(p.joinedAt),
          lastSeen: p.lastSeen ? new Date(p.lastSeen) : undefined
        }))
      };
      
      // Update conversation
      this.conversations[conversationIndex] = formattedConversation;
      
      // Save to storage
      this.saveToStorage();
      
      // Notify listeners
      this.notifyListeners('onConversationUpdated', formattedConversation);
      
      return formattedConversation;
    } catch (error) {
      console.error('Error adding participants:', error);
      return null;
    }
  }

  /**
   * Remove a participant from a group conversation
   * @param conversationId - Conversation ID
   * @param userId - User ID to remove
   * @returns Updated conversation or null if failed
   */
  async removeParticipant(
    conversationId: string,
    userId: string
  ): Promise<Conversation | null> {
    try {
      // Find conversation
      const conversationIndex = this.conversations.findIndex(
        c => c.id === conversationId
      );
      
      if (conversationIndex < 0) {
        console.error('Conversation not found');
        return null;
      }
      
      const conversation = this.conversations[conversationIndex];
      
      // Check if it's a group conversation
      if (conversation.type !== ConversationType.GROUP) {
        console.error('Cannot remove participants from non-group conversation');
        return null;
      }
      
      // Send to API
      const response = await apiClient.delete(`/messaging/conversations/${conversationId}/participants/${userId}`);
      
      // Format conversation
      const formattedConversation: Conversation = {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
        lastMessage: response.data.lastMessage ? {
          ...response.data.lastMessage,
          timestamp: new Date(response.data.lastMessage.timestamp)
        } : undefined,
        participants: response.data.participants.map((p: any) => ({
          ...p,
          joinedAt: new Date(p.joinedAt),
          lastSeen: p.lastSeen ? new Date(p.lastSeen) : undefined
        }))
      };
      
      // Update conversation
      this.conversations[conversationIndex] = formattedConversation;
      
      // Save to storage
      this.saveToStorage();
      
      // Notify listeners
      this.notifyListeners('onConversationUpdated', formattedConversation);
      
      return formattedConversation;
    } catch (error) {
      console.error('Error removing participant:', error);
      return null;
    }
  }

  /**
   * Leave a group conversation
   * @param conversationId - Conversation ID
   * @returns Success status
   */
  async leaveConversation(conversationId: string): Promise<boolean> {
    if (!this.currentUserId) {
      console.error('User not authenticated');
      return false;
    }
    
    try {
      // Find conversation
      const conversationIndex = this.conversations.findIndex(
        c => c.id === conversationId
      );
      
      if (conversationIndex < 0) {
        console.error('Conversation not found');
        return false;
      }
      
      const conversation = this.conversations[conversationIndex];
      
      // Check if it's a group conversation
      if (conversation.type !== ConversationType.GROUP) {
        console.error('Cannot leave non-group conversation');
        return false;
      }
      
      // Send to API
      await apiClient.delete(`/messaging/conversations/${conversationId}/participants/${this.currentUserId}`);
      
      // Remove conversation
      this.conversations.splice(conversationIndex, 1);
      
      // Update unread count
      this.unreadCount -= conversation.unreadCount;
      
      // Remove messages
      delete this.messages[conversationId];
      
      // Save to storage
      this.saveToStorage();
      
      // Notify listeners
      this.notifyListeners('onUnreadCountChanged', this.unreadCount);
      
      return true;
    } catch (error) {
      console.error('Error leaving conversation:', error);
      return false;
    }
  }

  /**
   * Send typing indicator
   * @param conversationId - Conversation ID
   * @param isTyping - Whether user is typing
   */
  sendTypingIndicator(conversationId: string, isTyping: boolean): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return;
    }
    
    try {
      this.socket.send(JSON.stringify({
        type: 'TYPING_INDICATOR',
        payload: {
          conversationId,
          isTyping
        }
      }));
    } catch (error) {
      console.error('Error sending typing indicator:', error);
    }
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    this.listeners = [];
    this.isInitialized = false;
  }
}

// Create singleton instance
const messagingService = new MessagingService();

export default messagingService;