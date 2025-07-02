/**
 * KONIVRER Deck Database
 * 
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

/**
 * PWA Utilities for KONIVRER
 * Handles service worker registration, app installation, and offline functionality
 */

class PWAManager {
  constructor() {
    this.serviceWorker = null;
    this.deferredPrompt = null;
    this.isInstalled = false;
    this.isOnline = navigator.onLine;
    this.updateAvailable = false;
    
    this.init();
  }

  async init() {
    // Check if app is installed
    this.checkInstallStatus();
    
    // Register service worker
    await this.registerServiceWorker();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Check for updates
    this.checkForUpdates();
  }

  checkInstallStatus() {
    // Check if running as PWA
    this.isInstalled = window.matchMedia('(display-mode: standalone)').matches || 
                     window.navigator.standalone === true;
    
    console.log('PWA installed:', this.isInstalled);
  }

  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });
        
        this.serviceWorker = registration;
        console.log('Service Worker registered successfully');
        
        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.updateAvailable = true;
              this.notifyUpdateAvailable();
            }
          });
        });
        
        return registration;
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  setupEventListeners() {
    // Install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.notifyInstallAvailable();
    });

    // App installed
    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.deferredPrompt = null;
      this.notifyAppInstalled();
    });

    // Online/offline status
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyOnlineStatus(true);
      this.syncOfflineData();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyOnlineStatus(false);
    });

    // Visibility change (for battery optimization)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.handleAppHidden();
      } else {
        this.handleAppVisible();
      }
    });
  }

  async promptInstall() {
    if (!this.deferredPrompt) {
      return { outcome: 'not-available' };
    }

    try {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      this.deferredPrompt = null;
      
      return { outcome };
    } catch (error) {
      console.error('Install prompt failed:', error);
      return { outcome: 'error', error };
    }
  }

  async checkForUpdates() {
    if (this.serviceWorker) {
      try {
        await this.serviceWorker.update();
      } catch (error) {
        console.error('Update check failed:', error);
      }
    }
  }

  async applyUpdate() {
    if (this.serviceWorker && this.updateAvailable) {
      try {
        // Tell the service worker to skip waiting
        if (this.serviceWorker.waiting) {
          this.serviceWorker.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
        
        // Reload the page to apply update
        window.location.reload();
      } catch (error) {
        console.error('Update application failed:', error);
      }
    }
  }

  // Offline data management
  async storeOfflineData(key, data) {
    try {
      const db = await this.openIndexedDB();
      const transaction = db.transaction(['offlineData'], 'readwrite');
      const store = transaction.objectStore('offlineData');
      
      await store.put({
        id: key,
        data: data,
        timestamp: Date.now()
      });
      
      console.log('Data stored offline:', key);
    } catch (error) {
      console.error('Failed to store offline data:', error);
    }
  }

  async getOfflineData(key) {
    try {
      const db = await this.openIndexedDB();
      const transaction = db.transaction(['offlineData'], 'readonly');
      const store = transaction.objectStore('offlineData');
      
      const result = await store.get(key);
      return result?.data || null;
    } catch (error) {
      console.error('Failed to get offline data:', error);
      return null;
    }
  }

  async syncOfflineData() {
    if (!this.isOnline) return;

    try {
      const db = await this.openIndexedDB();
      const transaction = db.transaction(['pendingSync'], 'readonly');
      const store = transaction.objectStore('pendingSync');
      const pendingItems = await store.getAll();

      for (const item of pendingItems) {
        try {
          await this.syncItem(item);
          await this.removePendingSync(item.id);
        } catch (error) {
          console.error('Failed to sync item:', item.id, error);
        }
      }
    } catch (error) {
      console.error('Offline sync failed:', error);
    }
  }

  async addPendingSync(type, data) {
    try {
      const db = await this.openIndexedDB();
      const transaction = db.transaction(['pendingSync'], 'readwrite');
      const store = transaction.objectStore('pendingSync');
      
      await store.add({
        id: `${type}_${Date.now()}`,
        type,
        data,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Failed to add pending sync:', error);
    }
  }

  async syncItem(item) {
    const { type, data } = item;
    
    switch (type) {
      case 'deck-save':
        return await fetch('/api/decks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      
      case 'match-result':
        return await fetch('/api/matches/result', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      
      case 'tournament-join':
        return await fetch(`/api/tournaments/${data.tournamentId}/join`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      
      default:
        console.warn('Unknown sync type:', type);
    }
  }

  async removePendingSync(id) {
    try {
      const db = await this.openIndexedDB();
      const transaction = db.transaction(['pendingSync'], 'readwrite');
      const store = transaction.objectStore('pendingSync');
      
      await store.delete(id);
    } catch (error) {
      console.error('Failed to remove pending sync:', error);
    }
  }

  // Cache management
  async preloadCards(cards) {
    if (this.serviceWorker) {
      this.serviceWorker.active?.postMessage({
        type: 'CACHE_CARD_IMAGES',
        cards
      });
    }
  }

  async preloadDeck(deck) {
    if (this.serviceWorker) {
      this.serviceWorker.active?.postMessage({
        type: 'PRELOAD_DECK',
        deck
      });
    }
  }

  async clearCache() {
    if (this.serviceWorker) {
      this.serviceWorker.active?.postMessage({
        type: 'CLEAR_CACHE'
      });
    }
  }

  // Battery optimization
  handleAppHidden() {
    // Reduce background activity
    if (this.serviceWorker) {
      this.serviceWorker.active?.postMessage({
        type: 'APP_HIDDEN'
      });
    }
  }

  handleAppVisible() {
    // Resume normal activity
    if (this.serviceWorker) {
      this.serviceWorker.active?.postMessage({
        type: 'APP_VISIBLE'
      });
    }
  }

  // Notification management
  async requestNotificationPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  async showNotification(title, options = {}) {
    if (this.serviceWorker && 'Notification' in window && Notification.permission === 'granted') {
      return this.serviceWorker.showNotification(title, {
        icon: '/icon-192x192.png',
        badge: '/icon-72x72.png',
        vibrate: [200, 100, 200],
        ...options
      });
    }
  }

  // IndexedDB helper
  openIndexedDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('KonivrPWA', 2);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('offlineData')) {
          db.createObjectStore('offlineData', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('pendingSync')) {
          db.createObjectStore('pendingSync', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('sharedDecks')) {
          db.createObjectStore('sharedDecks', { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }

  // Event notification methods (to be overridden by app)
  notifyInstallAvailable() {
    console.log('PWA install available');
    // Override this method to show install prompt UI
  }

  notifyAppInstalled() {
    console.log('PWA installed successfully');
    // Override this method to show success message
  }

  notifyUpdateAvailable() {
    console.log('PWA update available');
    // Override this method to show update prompt UI
  }

  notifyOnlineStatus(isOnline) {
    console.log('Online status changed:', isOnline);
    // Override this method to update UI
  }

  // Utility methods
  getInstallStatus() {
    return {
      isInstalled: this.isInstalled,
      canInstall: !!this.deferredPrompt,
      updateAvailable: this.updateAvailable
    };
  }

  getConnectionStatus() {
    return {
      isOnline: this.isOnline,
      effectiveType: navigator.connection?.effectiveType || 'unknown',
      downlink: navigator.connection?.downlink || 0
    };
  }

  // Share API
  async shareContent(data) {
    if (navigator.share) {
      try {
        await navigator.share(data);
        return { success: true };
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Share failed:', error);
        }
        return { success: false, error };
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(data.url || data.text || '');
        return { success: true, fallback: 'clipboard' };
      } catch (error) {
        return { success: false, error };
      }
    }
  }
}

// Create singleton instance
const pwaManager = new PWAManager();

export default pwaManager;

// Export utility functions
export const {
  promptInstall,
  checkForUpdates,
  applyUpdate,
  storeOfflineData,
  getOfflineData,
  addPendingSync,
  preloadCards,
  preloadDeck,
  clearCache,
  requestNotificationPermission,
  showNotification,
  getInstallStatus,
  getConnectionStatus,
  shareContent
} = pwaManager;