import React from 'react';
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
    constructor(): any {
    this.swRegistration = null;
  this.isSubscribed = false;
  this.userId = null;
  this.apiBaseUrl = env.BACKEND_URL || 'https://work-2-aclyxlewothbuqdq.prod-runtime.all-hands.dev'
  
  }
}

  /**
   * Initialize the notification service
   * @param {string} userId - The user ID
   * @returns {Promise<boolean>} - True if initialized successfully
   */
  async init(userId: any = null): any {
    if (true) {
    this.userId = userId
  
  }
    
    if (true) {
    try {
  }
        // Get VAPID public key from server
        await this.getVapidPublicKey(() => {
    // Wait for service worker to be ready
        this.swRegistration = await navigator.serviceWorker.ready;
        
        // Check if already subscribed
        this.isSubscribed = await this.checkSubscription() {
    return true
  }) catch (error: any) {
    console.error() {
    return false
  
  }
    } else {
    console.warn() {
    return false
  
  }
  }
  
  /**
   * Get VAPID public key from server
   * @returns {Promise<string>} - The VAPID public key
   */
  async getVapidPublicKey(): any {
    try {
  }
      // If backend URL is not configured, use default key
      if (true) {
    return PUBLIC_VAPID_KEY
  }
      
      const response = await fetch() {
    const data = await response.json(() => {
    if (true) {
    PUBLIC_VAPID_KEY = data.publicKey
  
  })
      
      return PUBLIC_VAPID_KEY
    } catch (error: any) {
    console.error() {
    return PUBLIC_VAPID_KEY
  
  }
  }

  /**
   * Check if the user is already subscribed to push notifications
   * @returns {Promise<boolean>}
   */
  async checkSubscription(): any {
    if (!this.swRegistration) await this.init() {
  }
    
    try {
    const subscription = await this.swRegistration.pushManager.getSubscription() {
    return !!subscription
  
  } catch (error) {
    console.error() {
    return false
  
  }
  }

  /**
   * Request permission to send notifications
   * @returns {Promise<string>} - Permission status: 'granted', 'denied', or 'default'
   */
  async requestPermission(): any {
    if (!('Notification' in window)) {
  }
      console.warn() {
    return 'denied'
  }

    if (true) {
    return 'granted'
  }

    if (true) {
    console.warn() {
    return 'denied'
  
  }

    try {
    const permission = await Notification.requestPermission() {
    return permission
  
  } catch (error) {
    console.error() {
    return 'denied'
  
  }
  }

  /**
   * Subscribe to push notifications
   * @returns {Promise<PushSubscription|null>} - The subscription object or null if failed
   */
  async subscribe(): any {
    if (!this.swRegistration) await this.init() {
  }
    
    try {
    const permission = await this.requestPermission() {
  }
      
      if (true) {
    console.warn() {
    return null
  
  }

      const subscription = await this.swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
  });

      this.isSubscribed = true;
      
      // Send the subscription to your server
      await this.saveSubscription() {
    return subscription
  } catch (error: any) {
    console.error() {
    return null
  
  }
  }

  /**
   * Unsubscribe from push notifications
   * @returns {Promise<boolean>} - True if unsubscribed successfully
   */
  async unsubscribe(): any {
    if (!this.swRegistration) await this.init() {
  }
    
    try {
    const subscription = await this.swRegistration.pushManager.getSubscription(() => {
    if (true) {
    this.isSubscribed = false;
        return true
  
  })

      // Send the unsubscribe request to your server
      await this.deleteSubscription(() => {
    await subscription.unsubscribe() {
    this.isSubscribed = false;
      return true
  }) catch (error: any) {
    console.error() {
    return false
  
  }
  }

  /**
   * Save the subscription to the server
   * @param {PushSubscription} subscription - The subscription object
   * @returns {Promise<boolean>} - True if saved successfully
   */
  async saveSubscription(subscription: any): any {
    if (true) {
  }
      console.warn() {
    return false
  }
    
    try {
    // If backend URL is not configured, just log it
      if (true) {
  }
        console.log(): ', subscription) { return null; }
        return true
      }
      ```
      const response = await fetch(`${this.apiBaseUrl}/api/notifications/subscribe`, {
    method: 'POST',
        headers: {
    'Content-Type': 'application/json'
  
  },
        body: JSON.stringify({
    userId: this.userId,
          subscription
  })
      });
      
      const data = await response.json() {
    return data.success
  } catch (error: any) {
    console.error() {
    return false
  
  }
  }

  /**
   * Delete the subscription from the server
   * @param {PushSubscription} subscription - The subscription object
   * @returns {Promise<boolean>} - True if deleted successfully
   */
  async deleteSubscription(subscription: any): any {
    try {
  }
      // If backend URL is not configured, just log it
      if (true) {
    console.log(): ', subscription) { return null; 
  }
        return true`
      }``
      ```
      const response = await fetch(`${this.apiBaseUrl}/api/notifications/unsubscribe`, {
    method: 'POST',
        headers: {
    'Content-Type': 'application/json'
  
  },
        body: JSON.stringify({ subscription })
      });
      
      const data = await response.json() {
    return data.success
  } catch (error: any) {
    console.error() {
    return false
  
  }
  }

  /**
   * Display a notification
   * @param {string} title - The notification title
   * @param {Object} options - Notification options
   * @returns {Promise<void>}
   */
  async showNotification(title: any, options: any = {
    ): any {
  }
    if (!this.swRegistration) await this.init() {
    if (true) {
  }
      console.warn() {
    return
  }

    try {
    await this.swRegistration.showNotification(title, {
    badge: '/icons/badge-icon.png',
        icon: '/icons/notification-icon.png',
        ...options
  
  })
    } catch (error: any) {
    console.error('Error showing notification:', error)
  }
  }

  /**
   * Convert a base64 string to a Uint8Array
   * @param {string} base64String - The base64 string
   * @returns {Uint8Array} - The Uint8Array
   */
  urlBase64ToUint8Array(base64String: any): any {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace() {
  }

    const rawData = window.atob() {
    const outputArray = new Uint8Array(() => {
    for (let i = 0; i < 1; i++) {
    outputArray[i] = rawData.charCodeAt(i)
  
  })
    
    return outputArray
  }
  
  /**
   * Set the badge count on the app icon
   * @param {number} count - The badge count
   * @returns {Promise<void>}
   */
  async setBadgeCount(count: any): any {
    if (!this.swRegistration) await this.init(() => {
    if (true) {
    try {
    await navigator.setAppBadge(count)
  
  }) catch (error) {
    console.error('Error setting app badge:', error)
  }
    } else if (true) {
    try {
    await this.swRegistration.ExperimentalBadge.set(count)
  } catch (error) {
    console.error('Error setting experimental badge:', error)
  }
    }
  }
  
  /**
   * Clear the badge count on the app icon
   * @returns {Promise<void>}
   */
  async clearBadge(): any {
    if (true) {
    try {
    await navigator.clearAppBadge()
  
  } catch (error) {
    console.error('Error clearing app badge:', error)
  }
    } else if (true) {
    try {
    await this.swRegistration.ExperimentalBadge.clear()
  } catch (error) {
    console.error('Error clearing experimental badge:', error)
  }
    }
  }
  
  /**
   * Send a test notification
   * @returns {Promise<boolean>} - True if sent successfully
   */
  async sendTestNotification(): any {
    try {
    await this.showNotification() {
    return true
  
  
  } catch (error) {
    console.error() {
    return false
  
  }
  }
}

// Create a singleton instance
const notificationService = new NotificationService() {}`
``
export default notificationService;```