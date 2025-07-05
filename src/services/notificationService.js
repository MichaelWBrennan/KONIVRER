/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

/**
 * Notification Service
 * 
 * This service handles push notifications for tournaments and messages.
 * It provides methods to request permission, subscribe to push notifications,
 * and handle incoming notifications.
 */

import { apiClient } from '../config/api.js';
import { env } from '../config/env.js';

// Default VAPID key (will be replaced with one from the server)
let PUBLIC_VAPID_KEY = 'BLBz-HVJLnXolAgnZhZUpr4bQXdtl0MRHfz_OXvBKzDjFIHR9VOksKfAcUJVE2YgxW1fsxG4p7_hZVQB8z9jXK8';

class NotificationService {
  constructor() {
    this.swRegistration = null;
    this.isSubscribed = false;
    this.userId = null;
    this.apiBaseUrl = env.BACKEND_URL || 'https://work-2-aclyxlewothbuqdq.prod-runtime.all-hands.dev';
  }

  /**
   * Initialize the notification service
   * @param {string} userId - The user ID
   * @returns {Promise<boolean>} - True if initialized successfully
   */
  async init(userId = null) {
    if (userId) {
      this.userId = userId;
    }
    
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        // Get VAPID public key from server
        await this.getVapidPublicKey();
        
        // Wait for service worker to be ready
        this.swRegistration = await navigator.serviceWorker.ready;
        
        // Check if already subscribed
        this.isSubscribed = await this.checkSubscription();
        
        return true;
      } catch (error) {
        console.error('Error initializing notification service:', error);
        return false;
      }
    } else {
      console.warn('Push notifications are not supported in this browser');
      return false;
    }
  }
  
  /**
   * Get VAPID public key from server
   * @returns {Promise<string>} - The VAPID public key
   */
  async getVapidPublicKey() {
    try {
      // If backend URL is not configured, use default key
      if (!env.BACKEND_URL) {
        return PUBLIC_VAPID_KEY;
      }
      
      const response = await fetch(`${this.apiBaseUrl}/api/notifications/vapid-public-key`);
      const data = await response.json();
      
      if (data.publicKey) {
        PUBLIC_VAPID_KEY = data.publicKey;
      }
      
      return PUBLIC_VAPID_KEY;
    } catch (error) {
      console.error('Error getting VAPID public key:', error);
      return PUBLIC_VAPID_KEY;
    }
  }

  /**
   * Check if the user is already subscribed to push notifications
   * @returns {Promise<boolean>}
   */
  async checkSubscription() {
    if (!this.swRegistration) await this.init();
    
    try {
      const subscription = await this.swRegistration.pushManager.getSubscription();
      return !!subscription;
    } catch (error) {
      console.error('Error checking subscription:', error);
      return false;
    }
  }

  /**
   * Request permission to send notifications
   * @returns {Promise<string>} - Permission status: 'granted', 'denied', or 'default'
   */
  async requestPermission() {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported in this browser');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      console.warn('Notification permission has been denied');
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }

  /**
   * Subscribe to push notifications
   * @returns {Promise<PushSubscription|null>} - The subscription object or null if failed
   */
  async subscribe() {
    if (!this.swRegistration) await this.init();
    
    try {
      const permission = await this.requestPermission();
      
      if (permission !== 'granted') {
        console.warn('Notification permission not granted');
        return null;
      }

      const subscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
      });

      this.isSubscribed = true;
      
      // Send the subscription to your server
      await this.saveSubscription(subscription);
      
      return subscription;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      return null;
    }
  }

  /**
   * Unsubscribe from push notifications
   * @returns {Promise<boolean>} - True if unsubscribed successfully
   */
  async unsubscribe() {
    if (!this.swRegistration) await this.init();
    
    try {
      const subscription = await this.swRegistration.pushManager.getSubscription();
      
      if (!subscription) {
        this.isSubscribed = false;
        return true;
      }

      // Send the unsubscribe request to your server
      await this.deleteSubscription(subscription);
      
      await subscription.unsubscribe();
      this.isSubscribed = false;
      return true;
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      return false;
    }
  }

  /**
   * Save the subscription to the server
   * @param {PushSubscription} subscription - The subscription object
   * @returns {Promise<boolean>} - True if saved successfully
   */
  async saveSubscription(subscription) {
    if (!this.userId) {
      console.warn('Cannot save subscription: No user ID provided');
      return false;
    }
    
    try {
      // If backend URL is not configured, just log it
      if (!env.BACKEND_URL) {
        console.log('Saving subscription (mock):', subscription);
        return true;
      }
      
      const response = await fetch(`${this.apiBaseUrl}/api/notifications/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId,
          subscription
        }),
      });
      
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error saving subscription:', error);
      return false;
    }
  }

  /**
   * Delete the subscription from the server
   * @param {PushSubscription} subscription - The subscription object
   * @returns {Promise<boolean>} - True if deleted successfully
   */
  async deleteSubscription(subscription) {
    try {
      // If backend URL is not configured, just log it
      if (!env.BACKEND_URL) {
        console.log('Deleting subscription (mock):', subscription);
        return true;
      }
      
      const response = await fetch(`${this.apiBaseUrl}/api/notifications/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscription }),
      });
      
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error deleting subscription:', error);
      return false;
    }
  }

  /**
   * Display a notification
   * @param {string} title - The notification title
   * @param {Object} options - Notification options
   * @returns {Promise<void>}
   */
  async showNotification(title, options = {}) {
    if (!this.swRegistration) await this.init();
    
    if (Notification.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    try {
      await this.swRegistration.showNotification(title, {
        badge: '/icons/badge-icon.png',
        icon: '/icons/notification-icon.png',
        ...options
      });
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }

  /**
   * Convert a base64 string to a Uint8Array
   * @param {string} base64String - The base64 string
   * @returns {Uint8Array} - The Uint8Array
   */
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
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
   * Set the badge count on the app icon
   * @param {number} count - The badge count
   * @returns {Promise<void>}
   */
  async setBadgeCount(count) {
    if (!this.swRegistration) await this.init();
    
    if ('setAppBadge' in navigator) {
      try {
        await navigator.setAppBadge(count);
      } catch (error) {
        console.error('Error setting app badge:', error);
      }
    } else if (this.swRegistration && 'ExperimentalBadge' in window) {
      try {
        await this.swRegistration.ExperimentalBadge.set(count);
      } catch (error) {
        console.error('Error setting experimental badge:', error);
      }
    }
  }
  
  /**
   * Clear the badge count on the app icon
   * @returns {Promise<void>}
   */
  async clearBadge() {
    if ('clearAppBadge' in navigator) {
      try {
        await navigator.clearAppBadge();
      } catch (error) {
        console.error('Error clearing app badge:', error);
      }
    } else if (this.swRegistration && 'ExperimentalBadge' in window) {
      try {
        await this.swRegistration.ExperimentalBadge.clear();
      } catch (error) {
        console.error('Error clearing experimental badge:', error);
      }
    }
  }
  
  /**
   * Send a test notification
   * @returns {Promise<boolean>} - True if sent successfully
   */
  async sendTestNotification() {
    try {
      await this.showNotification('Test Notification', {
        body: 'This is a test notification from KONIVRER',
        icon: '/icons/pwa-192x192.png',
        badge: '/icons/pwa-192x192.png',
        tag: 'test',
        data: {
          url: '/'
        }
      });
      
      return true;
    } catch (error) {
      console.error('Error sending test notification:', error);
      return false;
    }
  }
}

// Create a singleton instance
const notificationService = new NotificationService();

export default notificationService;