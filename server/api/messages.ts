/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

/**
 * Messages API
 * Handles messaging between users and notifications for new messages
 */

import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import webpush from 'web-push';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize router
const router = express.Router();

// Path to messages file
const messagesPath = path.join(__dirname, '../data/messages.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize messages file if it doesn't exist
if (!fs.existsSync(messagesPath)) {
  fs.writeFileSync(messagesPath, JSON.stringify([]));
}

// Helper function to read messages
const getMessages = (getMessages: any) => {
  try {
    const data = fs.readFileSync(messagesPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading messages:', error);
    return [];
  }
};

// Helper function to write messages
const saveMessages = (saveMessages: any) => {
  try {
    fs.writeFileSync(messagesPath, JSON.stringify(messages, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving messages:', error);
    return false;
  }
};

// Helper function to get subscriptions
const getSubscriptions = (getSubscriptions: any) => {
  try {
    const subscriptionsPath = path.join(__dirname, '../data/subscriptions.json');
    if (!fs.existsSync(subscriptionsPath)) {
      return [];
    }
    const data = fs.readFileSync(subscriptionsPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading subscriptions:', error);
    return [];
  }
};

// Get all messages for a user
router.get('/', (req, res) => {
  const userId = req.query.userId;
  
  if (!userId) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing userId' 
    });
  }
  
  try {
    const messages = getMessages();
    
    // Filter messages for the user (sent or received)
    const userMessages = messages.filter(
      msg => msg.senderId === userId || msg.recipientId === userId
    );
    
    res.status(200).json({ 
      success: true, 
      messages: userMessages 
    });
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get messages' 
    });
  }
});

// Get conversation between two users
router.get('/conversation', (req, res) => {
  const { userId1, userId2 } = req.query;
  
  if (!userId1 || !userId2) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing user IDs' 
    });
  }
  
  try {
    const messages = getMessages();
    
    // Filter messages between the two users
    const conversation = messages.filter(
      msg => 
        (msg.senderId === userId1 && msg.recipientId === userId2) ||
        (msg.senderId === userId2 && msg.recipientId === userId1)
    );
    
    res.status(200).json({ 
      success: true, 
      messages: conversation 
    });
  } catch (error) {
    console.error('Error getting conversation:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get conversation' 
    });
  }
});

// Send a message
router.post('/', (req, res) => {
  const { senderId, recipientId, content, metadata } = req.body;
  
  if (!senderId || !recipientId || !content) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing required fields' 
    });
  }
  
  try {
    const messages = getMessages();
    
    // Create new message
    const newMessage = {
      id: uuidv4(),
      senderId,
      recipientId,
      content,
      metadata: metadata || {},
      timestamp: new Date().toISOString(),
      read: false,
      delivered: true
    };
    
    // Add message to list
    messages.push(newMessage);
    
    // Save messages
    saveMessages(messages);
    
    // Send push notification to recipient
    sendMessageNotification(newMessage);
    
    res.status(201).json({ 
      success: true, 
      message: 'Message sent successfully',
      id: newMessage.id,
      timestamp: newMessage.timestamp
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message' 
    });
  }
});

// Mark messages as read
router.post('/read', (req, res) => {
  const { messageIds } = req.body;
  
  if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing or invalid messageIds' 
    });
  }
  
  try {
    const messages = getMessages();
    
    // Update read status for each message
    let updatedCount = 0;
    
    const updatedMessages = messages.map(msg => {
      if (messageIds.includes(msg.id) && !msg.read) {
        updatedCount++;
        return { ...msg, read: true };
      }
      return msg;
    });
    
    // Save messages
    saveMessages(updatedMessages);
    
    res.status(200).json({ 
      success: true, 
      message: `Marked ${updatedCount} messages as read` 
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to mark messages as read' 
    });
  }
});

// Delete a message
router.delete('/:messageId', (req, res) => {
  const { messageId } = req.params;
  const { userId } = req.query;
  
  if (!messageId || !userId) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing messageId or userId' 
    });
  }
  
  try {
    const messages = getMessages();
    
    // Find the message
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    
    if (messageIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Message not found' 
      });
    }
    
    // Check if user is the sender
    if (messages[messageIndex].senderId !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Cannot delete messages sent by other users' 
      });
    }
    
    // Remove the message
    messages.splice(messageIndex, 1);
    
    // Save messages
    saveMessages(messages);
    
    res.status(200).json({ 
      success: true, 
      message: 'Message deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete message' 
    });
  }
});

// Helper function to send push notification for new message
const sendMessageNotification = (sendMessageNotification: any) => {
  try {
    // Get subscriptions for the recipient
    const subscriptions = getSubscriptions().filter(
      sub => sub.userId === message.recipientId
    );
    
    if (subscriptions.length === 0) {
      return;
    }
    
    // Prepare notification payload
    const payload = JSON.stringify({
      title: 'New Message',
      body: `${message.content.substring(0, 50)}${message.content.length > 50 ? '...' : ''}`,
      icon: '/icons/pwa-192x192.png',
      badge: '/icons/pwa-192x192.png',
      tag: `message-${message.senderId}`,
      data: {
        url: `/messages/${message.senderId}`,
        messageId: message.id,
        senderId: message.senderId
      }
    });
    
    // Send notification to all recipient subscriptions
    subscriptions.forEach(sub => {
      webpush.sendNotification(sub.subscription, payload)
        .catch(error => {
          console.error('Error sending message notification:', error);
        });
    });
  } catch (error) {
    console.error('Error sending message notification:', error);
  }
};

export default router;