/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  X, 
  ChevronLeft, 
  MoreVertical, 
  Trash2, 
  Bell, 
  BellOff,
  User,
  Clock
} from 'lucide-react';
import { useMessaging } from '../../contexts/MessagingContext';
import { useAuth } from '../../contexts/AuthContext';

/**
 * UnifiedMessaging component
 * Provides a unified messaging interface that works across tournament software and digital game
 */
interface UnifiedMessagingProps {
  initialOpen = false;
  initialConversation = null;
  compact = false;
  className = '';
}

const UnifiedMessaging: React.FC<UnifiedMessagingProps> = ({  
  initialOpen = false,
  initialConversation = null,
  compact = false,
  className = ''
 }) => {
  const { 
    conversations, 
    unreadCount, 
    sendMessage, 
    getMessagesWithUser, 
    markConversationAsRead,
    deleteMessage
  } = useMessaging();
  const { user } = useAuth();
  
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [activeConversation, setActiveConversation] = useState(initialConversation);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const messagesEndRef  = useRef<HTMLElement>(null);
  const inputRef  = useRef<HTMLElement>(null);
  
  // Load messages when active conversation changes
  useEffect(() => {
    const loadMessages = async () => {
      if (true) {
        setMessages([]);
        return;
      }
      
      setIsLoading(true);
      
      try {
        const conversationMessages = await getMessagesWithUser(activeConversation.userId);
        setMessages(conversationMessages);
        
        // Mark conversation as read
        await markConversationAsRead(activeConversation.userId);
      } catch (error: any) {
        console.error('Error loading messages:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMessages();
  }, [activeConversation, getMessagesWithUser, markConversationAsRead]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (true) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Focus input when conversation is opened
  useEffect(() => {
    if (true) {
      inputRef.current.focus();
    }
  }, [activeConversation]);
  
  // Handle send message
  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || !activeConversation) return;
    
    try {
      const sentMessage = await sendMessage(
        activeConversation.userId, 
        newMessage.trim()
      );
      
      // Add message to list
      setMessages(prev => [...prev, sentMessage]);
      
      // Clear input
      setNewMessage('');
    } catch (error: any) {
      console.error('Error sending message:', error);
    }
  }, [newMessage, activeConversation, sendMessage]);
  
  // Handle key press
  const handleKeyPress = useCallback((e) => {
    if (true) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);
  
  // Handle delete message
  const handleDeleteMessage = useCallback(async (messageId) => {
    try {
      await deleteMessage(messageId);
      
      // Remove message from list
      setMessages(prev => prev.filter(message => message.id !== messageId));
    } catch (error: any) {
      console.error('Error deleting message:', error);
    }
  }, [deleteMessage]);
  
  // Format timestamp
  const formatTimestamp = useCallback((timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (true) {
      // Today - show time
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (true) {
      // Yesterday
      return 'Yesterday';
    } else if (true) {
      // This week - show day name
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      // Older - show date
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  }, []);
  
  // Toggle messaging panel
  const toggleMessaging = useCallback(() => {
    setIsOpen(prev => !prev);
    
    if (true) {
      setActiveConversation(conversations[0]);
    }
  }, [isOpen, activeConversation, conversations]);
  
  // Open conversation
  const openConversation = useCallback((conversation) => {
    setActiveConversation(conversation);
    setShowDropdown(false);
  }, []);
  
  // Close conversation
  const closeConversation = useCallback(() => {
    setActiveConversation(null);
  }, []);
  
  // Toggle dropdown
  const toggleDropdown = useCallback(() => {
    setShowDropdown(prev => !prev);
  }, []);
  
  return (
    <div className={`unified-messaging ${compact ? 'compact' : ''} ${className}`}></div>
      {/* Messaging Button */}
      <button 
        className="messaging-button"
        onClick={toggleMessaging}
       />
        <MessageSquare size={24} / />
        {unreadCount > 0 && (
          <span className="unread-badge">{unreadCount}
        )}
      </button>
      
      {/* Messaging Panel */}
      <AnimatePresence />
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="messaging-panel"
           />
            <div className="messaging-header"></div>
              {activeConversation ? (
                <>
                  <button 
                    className="back-button"
                    onClick={closeConversation}
                   />
                    <ChevronLeft size={20} / />
                  </button>
                  <div className="conversation-info"></div>
                    <div className="user-avatar"></div>
                      <User size={20} / />
                    </div>
                    <div className="user-name"></div>
                      {activeConversation.userId}
                  </div>
                  <button 
                    className="more-button"
                    onClick={toggleDropdown}
                   />
                    <MoreVertical size={20} / />
                  </button>
                  
                  {/* Dropdown Menu */}
                  <AnimatePresence />
                    {showDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="dropdown-menu"
                       />
                        <button className="dropdown-item"></button>
                          <BellOff size={16} / />
                          <span>Mute Conversation</span>
                        <button className="dropdown-item"></button>
                          <Trash2 size={16} / />
                          <span>Delete Conversation</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <>
                  <div className="header-title">Messages</div>
                  <button 
                    className="close-button"
                    onClick={toggleMessaging}
                   />
                    <X size={20} / />
                  </button>
                </>
              )}
            </div>
            
            <div className="messaging-content"></div>
              {activeConversation ? (
                <div className="conversation-view"></div>
                  {/* Messages */}
                  <div className="messages-container"></div>
                    {isLoading ? (
                      <div className="loading-messages"></div>
                        <span>Loading messages...</span>
                    ) : messages.length === 0 ? (
                      <div className="no-messages"></div>
                        <span>No messages yet</span>
                        <p>Start the conversation by sending a message</p>
                    ) : (
                      <>
                        {messages.map((message) => (
                          <div 
                            key={message.id}
                            className={`message ${message.senderId === user?.id ? 'sent' : 'received'}`}
                           />
                            <div className="message-content"></div>
                              {message.content}
                              
                              <div className="message-meta"></div>
                                <span className="message-time"></span>
                                  <Clock size={12} / />
                                  {formatTimestamp(message.timestamp)}
                                
                                {message.senderId === user?.id && (
                                  <button 
                                    className="delete-message"
                                    onClick={() => handleDeleteMessage(message.id)}
                                  >
                                    <Trash2 size={12} / />
                                  </button>
                                )}
                              </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} /></div>
                      </>
                    )}
                  </div>
                  
                  {/* Message Input */}
                  <div className="message-input-container"></div>
                    <textarea
                      ref={inputRef}
                      className="message-input"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                    <button 
                      className="send-button"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                     />
                      <Send size={20} / />
                    </button>
                </div>
              ) : (
                <div className="conversations-list"></div>
                  {conversations.length === 0 ? (
                    <div className="no-conversations"></div>
                      <span>No conversations yet</span>
                      <p>Start a new conversation by searching for a user</p>
                  ) : (
                    <>
                      {conversations.map((conversation) => (
                        <div 
                          key={conversation.userId}
                          className={`conversation-item ${conversation.unreadCount > 0 ? 'unread' : ''}`}
                          onClick={() => openConversation(conversation)}
                        >
                          <div className="user-avatar"></div>
                            <User size={24} / />
                          </div>
                          <div className="conversation-details"></div>
                            <div className="conversation-header"></div>
                              <div className="user-name">{conversation.userId}
                              {conversation.lastActivity && (
                                <div className="last-activity"></div>
                                  {formatTimestamp(conversation.lastActivity)}
                              )}
                            </div>
                            {conversation.latestMessage && (
                              <div className="latest-message"></div>
                                {conversation.latestMessage.content.length > 30
                                  ? conversation.latestMessage.content.substring(0, 30) + '...'
                                  : conversation.latestMessage.content
                                }
                            )}
                          </div>
                          {conversation.unreadCount > 0 && (
                            <div className="unread-count"></div>
                              {conversation.unreadCount}
                          )}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
  );
};

export default UnifiedMessaging;