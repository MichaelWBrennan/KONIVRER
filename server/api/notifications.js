/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

/**
 * Notifications API
 * Handles push notification subscriptions and sending notifications
 */

import express from 'express';
import webpush from 'web-push';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize router
const router = express.Router();

// Set VAPID keys for web push
const vapidPublicKey = process.env.VAPID_PUBLIC_KEY || 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || 'UUxI4O8-FbRouAevSmBQ6o18hgE4nSG3qwvJTfKc-ls';

webpush.setVapidDetails(
  'mailto:notifications@konivrer.com',
  vapidPublicKey,
  vapidPrivateKey
);

// Path to subscriptions file
const subscriptionsPath = path.join(__dirname, '../data/subscriptions.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize subscriptions file if it doesn't exist
if (!fs.existsSync(subscriptionsPath)) {
  fs.writeFileSync(subscriptionsPath, JSON.stringify([]));
}

// Helper function to read subscriptions
const getSubscriptions = () => {
  try {
    const data = fs.readFileSync(subscriptionsPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading subscriptions:', error);
    return [];
  }
};

// Helper function to write subscriptions
const saveSubscriptions = (subscriptions) => {
  try {
    fs.writeFileSync(subscriptionsPath, JSON.stringify(subscriptions, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving subscriptions:', error);
    return false;
  }
};

// Get VAPID public key
router.get('/vapid-public-key', (req, res) => {
  res.json({ publicKey: vapidPublicKey });
});

// Subscribe to push notifications
router.post('/subscribe', (req, res) => {
  const subscription = req.body.subscription;
  const userId = req.body.userId;
  
  if (!subscription || !userId) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing subscription or userId' 
    });
  }
  
  try {
    // Get existing subscriptions
    const subscriptions = getSubscriptions();
    
    // Check if subscription already exists
    const existingIndex = subscriptions.findIndex(
      sub => sub.subscription.endpoint === subscription.endpoint
    );
    
    if (existingIndex !== -1) {
      // Update existing subscription
      subscriptions[existingIndex] = {
        userId,
        subscription,
        createdAt: subscriptions[existingIndex].createdAt,
        updatedAt: new Date().toISOString()
      };
    } else {
      // Add new subscription
      subscriptions.push({
        userId,
        subscription,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    // Save subscriptions
    saveSubscriptions(subscriptions);
    
    // Send welcome notification
    const payload = JSON.stringify({
      title: 'Notifications Enabled',
      body: 'You will now receive notifications for tournaments and messages.',
      icon: '/icons/pwa-192x192.png',
      badge: '/icons/pwa-192x192.png',
      tag: 'welcome',
      data: {
        url: '/'
      }
    });
    
    webpush.sendNotification(subscription, payload)
      .catch(error => console.error('Error sending welcome notification:', error));
    
    res.status(201).json({ 
      success: true, 
      message: 'Subscription added successfully' 
    });
  } catch (error) {
    console.error('Error subscribing to notifications:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to subscribe to notifications' 
    });
  }
});

// Unsubscribe from push notifications
router.post('/unsubscribe', (req, res) => {
  const subscription = req.body.subscription;
  
  if (!subscription) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing subscription' 
    });
  }
  
  try {
    // Get existing subscriptions
    const subscriptions = getSubscriptions();
    
    // Filter out the subscription to remove
    const filteredSubscriptions = subscriptions.filter(
      sub => sub.subscription.endpoint !== subscription.endpoint
    );
    
    // Save updated subscriptions
    saveSubscriptions(filteredSubscriptions);
    
    res.status(200).json({ 
      success: true, 
      message: 'Subscription removed successfully' 
    });
  } catch (error) {
    console.error('Error unsubscribing from notifications:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to unsubscribe from notifications' 
    });
  }
});

// Send notification to a specific user
router.post('/send', (req, res) => {
  const { userId, title, body, icon, data } = req.body;
  
  if (!userId || !title || !body) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing required fields' 
    });
  }
  
  try {
    // Get subscriptions for the user
    const subscriptions = getSubscriptions().filter(sub => sub.userId === userId);
    
    if (subscriptions.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'No subscriptions found for user' 
      });
    }
    
    // Prepare notification payload
    const payload = JSON.stringify({
      title,
      body,
      icon: icon || '/icons/pwa-192x192.png',
      badge: '/icons/pwa-192x192.png',
      tag: data?.tag || 'notification',
      data: data || {}
    });
    
    // Send notification to all user subscriptions
    const sendPromises = subscriptions.map(sub => 
      webpush.sendNotification(sub.subscription, payload)
        .catch(error => {
          console.error('Error sending notification:', error);
          
          // If subscription is expired or invalid, remove it
          if (error.statusCode === 404 || error.statusCode === 410) {
            const allSubscriptions = getSubscriptions();
            const filteredSubscriptions = allSubscriptions.filter(
              s => s.subscription.endpoint !== sub.subscription.endpoint
            );
            saveSubscriptions(filteredSubscriptions);
          }
          
          return { error: true, endpoint: sub.subscription.endpoint };
        })
    );
    
    // Wait for all notifications to be sent
    Promise.all(sendPromises)
      .then(results => {
        const successCount = results.filter(r => !r.error).length;
        const failureCount = results.filter(r => r.error).length;
        
        res.status(200).json({ 
          success: true, 
          message: `Notification sent to ${successCount} devices, failed for ${failureCount} devices` 
        });
      })
      .catch(error => {
        console.error('Error sending notifications:', error);
        res.status(500).json({ 
          success: false, 
          message: 'Failed to send notifications' 
        });
      });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send notification' 
    });
  }
});

// Send notification to all users
router.post('/broadcast', (req, res) => {
  const { title, body, icon, data } = req.body;
  
  if (!title || !body) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing required fields' 
    });
  }
  
  try {
    // Get all subscriptions
    const subscriptions = getSubscriptions();
    
    if (subscriptions.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'No subscriptions found' 
      });
    }
    
    // Prepare notification payload
    const payload = JSON.stringify({
      title,
      body,
      icon: icon || '/icons/pwa-192x192.png',
      badge: '/icons/pwa-192x192.png',
      tag: data?.tag || 'broadcast',
      data: data || {}
    });
    
    // Send notification to all subscriptions
    const sendPromises = subscriptions.map(sub => 
      webpush.sendNotification(sub.subscription, payload)
        .catch(error => {
          console.error('Error sending notification:', error);
          
          // If subscription is expired or invalid, remove it
          if (error.statusCode === 404 || error.statusCode === 410) {
            const allSubscriptions = getSubscriptions();
            const filteredSubscriptions = allSubscriptions.filter(
              s => s.subscription.endpoint !== sub.subscription.endpoint
            );
            saveSubscriptions(filteredSubscriptions);
          }
          
          return { error: true, endpoint: sub.subscription.endpoint };
        })
    );
    
    // Wait for all notifications to be sent
    Promise.all(sendPromises)
      .then(results => {
        const successCount = results.filter(r => !r.error).length;
        const failureCount = results.filter(r => r.error).length;
        
        res.status(200).json({ 
          success: true, 
          message: `Broadcast sent to ${successCount} devices, failed for ${failureCount} devices` 
        });
      })
      .catch(error => {
        console.error('Error sending broadcast:', error);
        res.status(500).json({ 
          success: false, 
          message: 'Failed to send broadcast' 
        });
      });
  } catch (error) {
    console.error('Error sending broadcast:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send broadcast' 
    });
  }
});

// Get all subscriptions (admin only)
router.get('/subscriptions', (req, res) => {
  // In a real app, you would check if the user is an admin
  try {
    const subscriptions = getSubscriptions();
    
    // Remove sensitive data
    const sanitizedSubscriptions = subscriptions.map(sub => ({
      userId: sub.userId,
      endpoint: sub.subscription.endpoint,
      createdAt: sub.createdAt,
      updatedAt: sub.updatedAt
    }));
    
    res.status(200).json({ 
      success: true, 
      subscriptions: sanitizedSubscriptions 
    });
  } catch (error) {
    console.error('Error getting subscriptions:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get subscriptions' 
    });
  }
});

export default router;