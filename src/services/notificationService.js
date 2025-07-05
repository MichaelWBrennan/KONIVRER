/**
 * Notification Service
 * 
 * This service handles push notifications for tournaments and messages.
 * It provides methods to request permission, subscribe to push notifications,
 * and handle incoming notifications.
 */

const PUBLIC_VAPID_KEY = 'BLBz-HVJLnXolAgnZhZUpr4bQXdtl0MRHfz_OXvBKzDjFIHR9VOksKfAcUJVE2YgxW1fsxG4p7_hZVQB8z9jXK8';

class NotificationService {
  constructor() {
    this.swRegistration = null;
    this.isSubscribed = false;
  }

  /**
   * Initialize the notification service
   * @returns {Promise<void>}
   */
  async init() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        this.swRegistration = await navigator.serviceWorker.ready;
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
   * @returns {Promise<void>}
   */
  async saveSubscription(subscription) {
    // This would typically send the subscription to your backend
    // For now, we'll just log it
    console.log('Saving subscription:', subscription);
    
    // In a real implementation, you would send this to your server:
    /*
    try {
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription,
          topics: ['tournaments', 'messages']
        }),
      });
    } catch (error) {
      console.error('Error saving subscription:', error);
    }
    */
  }

  /**
   * Delete the subscription from the server
   * @param {PushSubscription} subscription - The subscription object
   * @returns {Promise<void>}
   */
  async deleteSubscription(subscription) {
    // This would typically send the unsubscribe request to your backend
    console.log('Deleting subscription:', subscription);
    
    // In a real implementation, you would send this to your server:
    /*
    try {
      await fetch('/api/notifications/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscription }),
      });
    } catch (error) {
      console.error('Error deleting subscription:', error);
    }
    */
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
}

// Create a singleton instance
const notificationService = new NotificationService();

export default notificationService;