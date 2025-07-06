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

// Types for PWA Manager
interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface ServiceWorkerUpdateEvent {
  type: 'UPDATE_AVAILABLE' | 'UPDATE_READY' | 'OFFLINE' | 'ONLINE' | 'ERROR';
  message: string;
  serviceWorker?: ServiceWorkerRegistration;
  error?: Error;
}

interface CacheConfig {
  name: string;
  version: string;
  urls: string[];
  maxAge?: number;
}

type UpdateCallback = (event: ServiceWorkerUpdateEvent) => void;

class PWAManager {
  private serviceWorker: ServiceWorkerRegistration | null;
  private deferredPrompt: InstallPromptEvent | null;
  private isInstalled: boolean;
  private isOnline: boolean;
  private updateAvailable: boolean;
  private updateCallbacks: UpdateCallback[];
  private offlineData: Map<string, any>;
  private cacheConfig: CacheConfig;

  constructor() {
    this.serviceWorker = null;
    this.deferredPrompt = null;
    this.isInstalled = false;
    this.isOnline = navigator.onLine;
    this.updateAvailable = false;
    this.updateCallbacks = [];
    this.offlineData = new Map();
    this.cacheConfig = {
      name: 'konivrer-cache',
      version: '1.0.0',
      urls: [
        '/',
        '/index.html',
        '/static/js/main.js',
        '/static/css/main.css',
        '/manifest.json',
        '/favicon.ico',
        '/logo192.png',
        '/logo512.png'
      ]
    };
    
    this.init();
  }

  /**
   * Initialize the PWA Manager
   */
  private async init(): Promise<void> {
    // Check if app is installed
    this.checkInstallStatus();

    // Register service worker
    try {
      await this.registerServiceWorker();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Check for updates
      this.checkForUpdates();
    } catch (error) {
      console.error('Failed to initialize PWA Manager:', error);
      this.notifyUpdateCallbacks({
        type: 'ERROR',
        message: 'Failed to initialize PWA',
        error: error instanceof Error ? error : new Error(String(error))
      });
    }
  }

  /**
   * Check if the app is installed as a PWA
   */
  private checkInstallStatus(): void {
    // Check if running as PWA
    this.isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    console.log('PWA installed:', this.isInstalled);
  }

  /**
   * Register the service worker
   */
  private async registerServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        this.serviceWorker = registration;
        
        console.log('Service Worker registered with scope:', registration.scope);
        
        // Check if there's an update available
        if (registration.waiting) {
          this.updateAvailable = true;
          this.notifyUpdateCallbacks({
            type: 'UPDATE_READY',
            message: 'A new version is available and ready to use',
            serviceWorker: registration
          });
        }
        
        // Listen for new updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                this.updateAvailable = true;
                this.notifyUpdateCallbacks({
                  type: 'UPDATE_AVAILABLE',
                  message: 'A new version is available',
                  serviceWorker: registration
                });
              }
            });
          }
        });
      } catch (error) {
        console.error('Service Worker registration failed:', error);
        throw error;
      }
    } else {
      console.warn('Service Workers are not supported in this browser');
    }
  }

  /**
   * Set up event listeners for online/offline status and install prompt
   */
  private setupEventListeners(): void {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyUpdateCallbacks({
        type: 'ONLINE',
        message: 'Your device is back online'
      });
      this.syncOfflineData();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyUpdateCallbacks({
        type: 'OFFLINE',
        message: 'Your device is offline. Some features may be limited.'
      });
    });
    
    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (event) => {
      // Prevent the default browser install prompt
      event.preventDefault();
      
      // Save the event for later use
      this.deferredPrompt = event as InstallPromptEvent;
      
      console.log('Install prompt captured and deferred');
    });
    
    // Listen for appinstalled event
    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.deferredPrompt = null;
      
      console.log('PWA was installed');
    });
  }

  /**
   * Check for service worker updates
   */
  private async checkForUpdates(): Promise<void> {
    if (!this.serviceWorker) {
      return;
    }
    
    try {
      await this.serviceWorker.update();
    } catch (error) {
      console.error('Failed to check for updates:', error);
    }
  }

  /**
   * Notify all registered callbacks about updates
   */
  private notifyUpdateCallbacks(event: ServiceWorkerUpdateEvent): void {
    this.updateCallbacks.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in update callback:', error);
      }
    });
  }

  /**
   * Sync offline data with the server when back online
   */
  private async syncOfflineData(): Promise<void> {
    if (!this.isOnline || this.offlineData.size === 0) {
      return;
    }
    
    console.log(`Syncing ${this.offlineData.size} offline items`);
    
    for (const [key, data] of this.offlineData.entries()) {
      try {
        // Attempt to sync the data
        await this.syncItem(key, data);
        
        // If successful, remove from offline data
        this.offlineData.delete(key);
      } catch (error) {
        console.error(`Failed to sync item ${key}:`, error);
      }
    }
  }

  /**
   * Sync a single offline item with the server
   */
  private async syncItem(key: string, data: any): Promise<void> {
    // Parse the key to get endpoint and method
    const [method, endpoint] = key.split('|');
    
    if (!method || !endpoint) {
      throw new Error(`Invalid offline data key: ${key}`);
    }
    
    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: method !== 'GET' ? JSON.stringify(data) : undefined
    });
    
    if (!response.ok) {
      throw new Error(`Failed to sync: ${response.status} ${response.statusText}`);
    }
  }

  /**
   * Register a callback for update notifications
   */
  public onUpdate(callback: UpdateCallback): () => void {
    this.updateCallbacks.push(callback);
    
    // Return a function to unregister the callback
    return () => {
      this.updateCallbacks = this.updateCallbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Show the install prompt if available
   */
  public async showInstallPrompt(): Promise<boolean> {
    if (!this.deferredPrompt) {
      console.log('Install prompt not available');
      return false;
    }
    
    // Show the prompt
    this.deferredPrompt.prompt();
    
    // Wait for the user's choice
    const choiceResult = await this.deferredPrompt.userChoice;
    
    // Reset the deferred prompt
    this.deferredPrompt = null;
    
    // Return true if the app was installed
    return choiceResult.outcome === 'accepted';
  }

  /**
   * Check if the app can be installed
   */
  public canInstall(): boolean {
    return !!this.deferredPrompt;
  }

  /**
   * Check if the app is already installed
   */
  public isAppInstalled(): boolean {
    return this.isInstalled;
  }

  /**
   * Check if there's an update available
   */
  public hasUpdate(): boolean {
    return this.updateAvailable;
  }

  /**
   * Apply an available update
   */
  public async applyUpdate(): Promise<boolean> {
    if (!this.updateAvailable || !this.serviceWorker || !this.serviceWorker.waiting) {
      return false;
    }
    
    // Send a message to the waiting service worker
    this.serviceWorker.waiting.postMessage({ type: 'SKIP_WAITING' });
    
    return new Promise((resolve) => {
      // When the controlling service worker changes, reload the page
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('New service worker activated, reloading page');
        window.location.reload();
        resolve(true);
      });
    });
  }

  /**
   * Check if the device is online
   */
  public isDeviceOnline(): boolean {
    return this.isOnline;
  }

  /**
   * Store data for offline use
   */
  public storeOfflineData(method: string, endpoint: string, data: any): void {
    const key = `${method}|${endpoint}`;
    this.offlineData.set(key, data);
    
    // Store in localStorage for persistence
    try {
      const offlineStorage = JSON.parse(localStorage.getItem('konivrer-offline-data') || '{}');
      offlineStorage[key] = data;
      localStorage.setItem('konivrer-offline-data', JSON.stringify(offlineStorage));
    } catch (error) {
      console.error('Failed to store offline data in localStorage:', error);
    }
  }

  /**
   * Load offline data from localStorage
   */
  public loadOfflineData(): void {
    try {
      const offlineStorage = JSON.parse(localStorage.getItem('konivrer-offline-data') || '{}');
      
      for (const [key, data] of Object.entries(offlineStorage)) {
        this.offlineData.set(key, data);
      }
      
      console.log(`Loaded ${this.offlineData.size} offline items from storage`);
    } catch (error) {
      console.error('Failed to load offline data from localStorage:', error);
    }
  }

  /**
   * Clear offline data
   */
  public clearOfflineData(): void {
    this.offlineData.clear();
    localStorage.removeItem('konivrer-offline-data');
  }

  /**
   * Get the number of pending offline items
   */
  public getPendingOfflineCount(): number {
    return this.offlineData.size;
  }

  /**
   * Configure the cache
   */
  public configureCaching(config: Partial<CacheConfig>): void {
    this.cacheConfig = {
      ...this.cacheConfig,
      ...config
    };
    
    // Update the cache if service worker is available
    if (this.serviceWorker) {
      this.serviceWorker.active?.postMessage({
        type: 'UPDATE_CACHE_CONFIG',
        config: this.cacheConfig
      });
    }
  }

  /**
   * Prefetch and cache resources
   */
  public async prefetchResources(urls: string[]): Promise<void> {
    if (!this.serviceWorker || !this.isOnline) {
      return;
    }
    
    try {
      // Send message to service worker to prefetch resources
      this.serviceWorker.active?.postMessage({
        type: 'PREFETCH_RESOURCES',
        urls
      });
    } catch (error) {
      console.error('Failed to prefetch resources:', error);
    }
  }

  /**
   * Clear the cache
   */
  public async clearCache(): Promise<boolean> {
    if (!this.serviceWorker) {
      return false;
    }
    
    try {
      // Send message to service worker to clear cache
      this.serviceWorker.active?.postMessage({
        type: 'CLEAR_CACHE'
      });
      
      return true;
    } catch (error) {
      console.error('Failed to clear cache:', error);
      return false;
    }
  }

  /**
   * Perform a fetch request with offline support
   */
  public async fetchWithOfflineSupport(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const method = options.method || 'GET';
    
    try {
      // Try to fetch from network
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      // If offline, store the request for later
      if (!this.isOnline) {
        console.log(`Device is offline, storing ${method} request to ${url} for later`);
        
        if (method !== 'GET' && options.body) {
          let data;
          try {
            data = JSON.parse(options.body.toString());
          } catch {
            data = options.body;
          }
          
          this.storeOfflineData(method, url, data);
        }
        
        // Return a mock response
        return new Response(JSON.stringify({ 
          success: false, 
          offline: true, 
          message: 'This request was made while offline and will be processed when you reconnect.' 
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // If online but request failed for other reasons, rethrow
      throw error;
    }
  }

  /**
   * Unregister service workers
   */
  public async unregisterServiceWorkers(): Promise<boolean> {
    if (!('serviceWorker' in navigator)) {
      return false;
    }
    
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      
      for (const registration of registrations) {
        await registration.unregister();
      }
      
      this.serviceWorker = null;
      return true;
    } catch (error) {
      console.error('Failed to unregister service workers:', error);
      return false;
    }
  }
}

// Create singleton instance
const pwaManager = new PWAManager();

// Export functions for easier usage
export const showInstallPrompt = (): Promise<boolean> => pwaManager.showInstallPrompt();
export const canInstall = (): boolean => pwaManager.canInstall();
export const isAppInstalled = (): boolean => pwaManager.isAppInstalled();
export const hasUpdate = (): boolean => pwaManager.hasUpdate();
export const applyUpdate = (): Promise<boolean> => pwaManager.applyUpdate();
export const isOnline = (): boolean => pwaManager.isDeviceOnline();
export const onUpdateAvailable = (callback: UpdateCallback): (() => void) => pwaManager.onUpdate(callback);
export const fetchWithOfflineSupport = (url: string, options?: RequestInit): Promise<Response> => 
  pwaManager.fetchWithOfflineSupport(url, options);
export const getPendingOfflineCount = (): number => pwaManager.getPendingOfflineCount();
export const clearOfflineData = (): void => pwaManager.clearOfflineData();
export const prefetchResources = (urls: string[]): Promise<void> => pwaManager.prefetchResources(urls);
export const clearCache = (): Promise<boolean> => pwaManager.clearCache();
export const unregisterServiceWorkers = (): Promise<boolean> => pwaManager.unregisterServiceWorkers();

export default pwaManager;