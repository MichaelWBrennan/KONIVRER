/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

// Modern web platform features and utilities

// Types for notifications
interface NotificationOptions extends NotificationOptions {
  icon?: string;
  badge?: string;
  vibrate?: number[];
  data?: any;
  actions?: NotificationAction[];
  [key: string]: any;
}

interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

// WebSocket types
interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: number;
  [key: string]: any;
}

interface WebSocketConfig {
  reconnectAttempts?: number;
  reconnectInterval?: number;
  heartbeatInterval?: number;
  debug?: boolean;
  [key: string]: any;
}

// IndexedDB types
interface DBConfig {
  name: string;
  version: number;
  stores: {
    [storeName: string]: {
      keyPath: string;
      indexes?: {
        name: string;
        keyPath: string;
        options?: IDBIndexParameters;
      }[];
    };
  };
}

// Cache types
interface CacheConfig {
  name: string;
  version: string;
  maxAge?: number;
  maxItems?: number;
  [key: string]: any;
}

// Service Worker Registration for PWA
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | undefined> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registered with scope:', registration.scope);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
  return undefined;
};

// Push Notifications
export const requestNotificationPermission = async (): Promise<boolean> => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

export const sendPushNotification = (
  title: string, 
  options: NotificationOptions = {}
): Notification | null => {
  if ('Notification' in window && Notification.permission === 'granted') {
    return new Notification(title, {
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      vibrate: [200, 100, 200],
      ...options,
    });
  }
  return null;
};

// WebSocket Connection Manager
export class WebSocketManager {
  private url: string;
  private socket: WebSocket | null;
  private reconnectAttempts: number;
  private maxReconnectAttempts: number;
  private reconnectInterval: number;
  private heartbeatInterval: number;
  private heartbeatTimer: number | null;
  private messageHandlers: Map<string, ((data: any) => void)[]>;
  private connectionHandlers: {
    onOpen: (() => void)[];
    onClose: ((event: CloseEvent) => void)[];
    onError: ((event: Event) => void)[];
  };
  private debug: boolean;
  private isConnecting: boolean;
  private lastMessageTime: number;

  constructor(url: string, config: WebSocketConfig = {}) {
    this.url = url;
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = config.reconnectAttempts || 5;
    this.reconnectInterval = config.reconnectInterval || 3000;
    this.heartbeatInterval = config.heartbeatInterval || 30000;
    this.heartbeatTimer = null;
    this.messageHandlers = new Map();
    this.connectionHandlers = {
      onOpen: [],
      onClose: [],
      onError: []
    };
    this.debug = config.debug || false;
    this.isConnecting = false;
    this.lastMessageTime = Date.now();
  }

  // Connect to WebSocket server
  connect(): Promise<boolean> {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return Promise.resolve(true);
    }

    if (this.isConnecting) {
      return new Promise((resolve) => {
        const checkConnection = () => {
          if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            resolve(true);
          } else if (!this.isConnecting) {
            resolve(false);
          } else {
            setTimeout(checkConnection, 100);
          }
        };
        checkConnection();
      });
    }

    this.isConnecting = true;

    return new Promise((resolve) => {
      try {
        this.socket = new WebSocket(this.url);

        this.socket.onopen = () => {
          this.log('WebSocket connection established');
          this.reconnectAttempts = 0;
          this.isConnecting = false;
          this.startHeartbeat();
          this.connectionHandlers.onOpen.forEach(handler => handler());
          resolve(true);
        };

        this.socket.onclose = (event) => {
          this.log(`WebSocket connection closed: ${event.code} ${event.reason}`);
          this.isConnecting = false;
          this.stopHeartbeat();
          this.connectionHandlers.onClose.forEach(handler => handler(event));
          
          if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            setTimeout(() => this.connect(), this.reconnectInterval);
          }
          
          if (this.socket === null) {
            resolve(false);
          }
        };

        this.socket.onerror = (event) => {
          this.log('WebSocket error:', event);
          this.connectionHandlers.onError.forEach(handler => handler(event));
          
          if (this.socket?.readyState !== WebSocket.OPEN) {
            this.isConnecting = false;
            resolve(false);
          }
        };

        this.socket.onmessage = (event) => {
          this.lastMessageTime = Date.now();
          
          try {
            const message = JSON.parse(event.data) as WebSocketMessage;
            this.log('Received message:', message);
            
            if (message.type && this.messageHandlers.has(message.type)) {
              const handlers = this.messageHandlers.get(message.type);
              if (handlers) {
                handlers.forEach(handler => handler(message.payload));
              }
            }
          } catch (error) {
            this.log('Error parsing message:', error);
          }
        };
      } catch (error) {
        this.log('Error creating WebSocket:', error);
        this.isConnecting = false;
        resolve(false);
      }
    });
  }

  // Disconnect from WebSocket server
  disconnect(): void {
    this.stopHeartbeat();
    
    if (this.socket) {
      this.socket.close(1000, 'Client disconnected');
      this.socket = null;
    }
  }

  // Send message to server
  send(type: string, payload: any): boolean {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      this.log('Cannot send message, socket not open');
      return false;
    }
    
    const message: WebSocketMessage = {
      type,
      payload,
      timestamp: Date.now()
    };
    
    try {
      this.socket.send(JSON.stringify(message));
      return true;
    } catch (error) {
      this.log('Error sending message:', error);
      return false;
    }
  }

  // Add message handler
  on(type: string, handler: (data: any) => void): void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, []);
    }
    
    const handlers = this.messageHandlers.get(type);
    if (handlers) {
      handlers.push(handler);
    }
  }

  // Remove message handler
  off(type: string, handler: (data: any) => void): void {
    if (!this.messageHandlers.has(type)) {
      return;
    }
    
    const handlers = this.messageHandlers.get(type);
    if (handlers) {
      this.messageHandlers.set(
        type,
        handlers.filter(h => h !== handler)
      );
    }
  }

  // Add connection event handler
  onOpen(handler: () => void): void {
    this.connectionHandlers.onOpen.push(handler);
  }

  onClose(handler: (event: CloseEvent) => void): void {
    this.connectionHandlers.onClose.push(handler);
  }

  onError(handler: (event: Event) => void): void {
    this.connectionHandlers.onError.push(handler);
  }

  // Start heartbeat to keep connection alive
  private startHeartbeat(): void {
    this.stopHeartbeat();
    
    this.heartbeatTimer = window.setInterval(() => {
      // Check if we haven't received a message in a while
      const now = Date.now();
      if (now - this.lastMessageTime > this.heartbeatInterval * 2) {
        this.log('No messages received recently, reconnecting...');
        this.reconnect();
        return;
      }
      
      // Send heartbeat
      this.send('heartbeat', { timestamp: now });
    }, this.heartbeatInterval);
  }

  // Stop heartbeat
  private stopHeartbeat(): void {
    if (this.heartbeatTimer !== null) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  // Force reconnection
  reconnect(): void {
    this.disconnect();
    this.connect();
  }

  // Get connection state
  getState(): 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED' | 'NONE' {
    if (!this.socket) return 'NONE';
    
    switch (this.socket.readyState) {
      case WebSocket.CONNECTING:
        return 'CONNECTING';
      case WebSocket.OPEN:
        return 'OPEN';
      case WebSocket.CLOSING:
        return 'CLOSING';
      case WebSocket.CLOSED:
        return 'CLOSED';
      default:
        return 'NONE';
    }
  }

  // Logging
  private log(...args: any[]): void {
    if (this.debug) {
      console.log('[WebSocketManager]', ...args);
    }
  }
}

// IndexedDB Wrapper
export class IndexedDBManager {
  private dbName: string;
  private dbVersion: number;
  private db: IDBDatabase | null;
  private stores: {
    [storeName: string]: {
      keyPath: string;
      indexes?: {
        name: string;
        keyPath: string;
        options?: IDBIndexParameters;
      }[];
    };
  };
  private isReady: boolean;
  private readyPromise: Promise<boolean>;
  private readyResolver: ((value: boolean) => void) | null;

  constructor(config: DBConfig) {
    this.dbName = config.name;
    this.dbVersion = config.version;
    this.stores = config.stores;
    this.db = null;
    this.isReady = false;
    this.readyResolver = null;
    
    this.readyPromise = new Promise((resolve) => {
      this.readyResolver = resolve;
    });
    
    this.init();
  }

  // Initialize database
  private init(): void {
    const request = indexedDB.open(this.dbName, this.dbVersion);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create or update object stores
      Object.keys(this.stores).forEach(storeName => {
        const storeConfig = this.stores[storeName];
        
        // Create store if it doesn't exist
        if (!db.objectStoreNames.contains(storeName)) {
          const store = db.createObjectStore(storeName, { keyPath: storeConfig.keyPath });
          
          // Add indexes
          if (storeConfig.indexes) {
            storeConfig.indexes.forEach(index => {
              store.createIndex(index.name, index.keyPath, index.options);
            });
          }
        }
      });
    };
    
    request.onsuccess = (event) => {
      this.db = (event.target as IDBOpenDBRequest).result;
      this.isReady = true;
      
      if (this.readyResolver) {
        this.readyResolver(true);
        this.readyResolver = null;
      }
    };
    
    request.onerror = (event) => {
      console.error('IndexedDB error:', (event.target as IDBOpenDBRequest).error);
      
      if (this.readyResolver) {
        this.readyResolver(false);
        this.readyResolver = null;
      }
    };
  }

  // Wait for database to be ready
  async waitForReady(): Promise<boolean> {
    return this.readyPromise;
  }

  // Add item to store
  async add<T>(storeName: string, item: T): Promise<IDBValidKey> {
    await this.waitForReady();
    
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(item);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Put item in store (add or update)
  async put<T>(storeName: string, item: T): Promise<IDBValidKey> {
    await this.waitForReady();
    
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(item);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Get item by key
  async get<T>(storeName: string, key: IDBValidKey): Promise<T | undefined> {
    await this.waitForReady();
    
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);
      
      request.onsuccess = () => resolve(request.result as T);
      request.onerror = () => reject(request.error);
    });
  }

  // Get all items from store
  async getAll<T>(storeName: string): Promise<T[]> {
    await this.waitForReady();
    
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result as T[]);
      request.onerror = () => reject(request.error);
    });
  }

  // Delete item by key
  async delete(storeName: string, key: IDBValidKey): Promise<void> {
    await this.waitForReady();
    
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Clear all items from store
  async clear(storeName: string): Promise<void> {
    await this.waitForReady();
    
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Query by index
  async getByIndex<T>(
    storeName: string, 
    indexName: string, 
    value: IDBValidKey
  ): Promise<T[]> {
    await this.waitForReady();
    
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);
      
      request.onsuccess = () => resolve(request.result as T[]);
      request.onerror = () => reject(request.error);
    });
  }

  // Close database
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.isReady = false;
      
      this.readyPromise = new Promise((resolve) => {
        this.readyResolver = resolve;
      });
    }
  }

  // Delete database
  static async deleteDatabase(name: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(name);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

// Cache API Wrapper
export class CacheManager {
  private cacheName: string;
  private version: string;
  private maxAge: number;
  private maxItems: number;

  constructor(config: CacheConfig) {
    this.cacheName = `${config.name}-v${config.version}`;
    this.version = config.version;
    this.maxAge = config.maxAge || 7 * 24 * 60 * 60 * 1000; // 1 week default
    this.maxItems = config.maxItems || 100;
  }

  // Open cache
  private async getCache(): Promise<Cache> {
    return await caches.open(this.cacheName);
  }

  // Add resource to cache
  async add(url: string): Promise<void> {
    const cache = await this.getCache();
    await cache.add(url);
    await this.pruneCache();
  }

  // Add multiple resources to cache
  async addAll(urls: string[]): Promise<void> {
    const cache = await this.getCache();
    await cache.addAll(urls);
    await this.pruneCache();
  }

  // Put response in cache
  async put(request: Request | string, response: Response): Promise<void> {
    const cache = await this.getCache();
    
    // Add timestamp header to track age
    const clonedResponse = response.clone();
    const headers = new Headers(clonedResponse.headers);
    headers.append('x-cache-timestamp', Date.now().toString());
    
    const timestampedResponse = new Response(await clonedResponse.blob(), {
      status: clonedResponse.status,
      statusText: clonedResponse.statusText,
      headers
    });
    
    await cache.put(request, timestampedResponse);
    await this.pruneCache();
  }

  // Get response from cache
  async match(request: Request | string, options?: CacheQueryOptions): Promise<Response | undefined> {
    const cache = await this.getCache();
    const response = await cache.match(request, options);
    
    if (!response) {
      return undefined;
    }
    
    // Check if response is expired
    const timestamp = response.headers.get('x-cache-timestamp');
    if (timestamp) {
      const age = Date.now() - parseInt(timestamp, 10);
      if (age > this.maxAge) {
        await cache.delete(request);
        return undefined;
      }
    }
    
    return response;
  }

  // Delete from cache
  async delete(request: Request | string, options?: CacheQueryOptions): Promise<boolean> {
    const cache = await this.getCache();
    return await cache.delete(request, options);
  }

  // Clear entire cache
  async clear(): Promise<void> {
    await caches.delete(this.cacheName);
  }

  // Prune old entries
  private async pruneCache(): Promise<void> {
    const cache = await this.getCache();
    const requests = await cache.keys();
    
    if (requests.length <= this.maxItems) {
      return;
    }
    
    // Get all cached responses with their timestamps
    const entries = await Promise.all(
      requests.map(async (request) => {
        const response = await cache.match(request);
        let timestamp = 0;
        
        if (response) {
          const timestampHeader = response.headers.get('x-cache-timestamp');
          if (timestampHeader) {
            timestamp = parseInt(timestampHeader, 10);
          }
        }
        
        return { request, timestamp };
      })
    );
    
    // Sort by timestamp (oldest first)
    entries.sort((a, b) => a.timestamp - b.timestamp);
    
    // Delete oldest entries to get back to maxItems
    const entriesToDelete = entries.slice(0, entries.length - this.maxItems);
    
    for (const entry of entriesToDelete) {
      await cache.delete(entry.request);
    }
  }

  // Delete old caches
  static async deleteOldCaches(prefix: string, currentVersion: string): Promise<void> {
    const cacheNames = await caches.keys();
    const oldCaches = cacheNames.filter(name => 
      name.startsWith(prefix) && !name.includes(`-v${currentVersion}`)
    );
    
    await Promise.all(oldCaches.map(name => caches.delete(name)));
  }
}

// Geolocation API wrapper
export class GeolocationService {
  private options: PositionOptions;
  private watchId: number | null;
  private lastPosition: GeolocationPosition | null;

  constructor(options: PositionOptions = {}) {
    this.options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
      ...options
    };
    this.watchId = null;
    this.lastPosition = null;
  }

  // Check if geolocation is available
  isAvailable(): boolean {
    return 'geolocation' in navigator;
  }

  // Get current position
  async getCurrentPosition(): Promise<GeolocationPosition> {
    if (!this.isAvailable()) {
      throw new Error('Geolocation is not available');
    }
    
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.lastPosition = position;
          resolve(position);
        },
        (error) => reject(error),
        this.options
      );
    });
  }

  // Start watching position
  watchPosition(
    onSuccess: (position: GeolocationPosition) => void,
    onError?: (error: GeolocationPositionError) => void
  ): void {
    if (!this.isAvailable()) {
      if (onError) {
        onError({
          code: 2,
          message: 'Geolocation is not available',
          PERMISSION_DENIED: 1,
          POSITION_UNAVAILABLE: 2,
          TIMEOUT: 3
        } as GeolocationPositionError);
      }
      return;
    }
    
    this.stopWatching();
    
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.lastPosition = position;
        onSuccess(position);
      },
      onError,
      this.options
    );
  }

  // Stop watching position
  stopWatching(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  // Get last known position
  getLastPosition(): GeolocationPosition | null {
    return this.lastPosition;
  }

  // Calculate distance between two points (in meters)
  static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;
    
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c;
  }
}

// Share API wrapper
export class ShareService {
  // Check if Share API is available
  isAvailable(): boolean {
    return 'share' in navigator;
  }

  // Share content
  async share(data: ShareData): Promise<boolean> {
    if (!this.isAvailable()) {
      return false;
    }
    
    try {
      await navigator.share(data);
      return true;
    } catch (error) {
      console.error('Error sharing:', error);
      return false;
    }
  }

  // Check if can share specific content
  async canShare(data: ShareData): Promise<boolean> {
    if (!this.isAvailable() || !('canShare' in navigator)) {
      return false;
    }
    
    try {
      return navigator.canShare(data);
    } catch (error) {
      return false;
    }
  }
}

// Clipboard API wrapper
export class ClipboardService {
  // Check if Clipboard API is available
  isAvailable(): boolean {
    return 'clipboard' in navigator;
  }

  // Write text to clipboard
  async writeText(text: string): Promise<boolean> {
    if (!this.isAvailable()) {
      return this.fallbackCopyText(text);
    }
    
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      return this.fallbackCopyText(text);
    }
  }

  // Read text from clipboard
  async readText(): Promise<string> {
    if (!this.isAvailable()) {
      throw new Error('Clipboard API is not available');
    }
    
    try {
      return await navigator.clipboard.readText();
    } catch (error) {
      console.error('Error reading from clipboard:', error);
      throw error;
    }
  }

  // Fallback method for copying text
  private fallbackCopyText(text: string): boolean {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      
      // Make the textarea out of viewport
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      return successful;
    } catch (error) {
      console.error('Fallback clipboard copy failed:', error);
      return false;
    }
  }
}

// Battery API wrapper
export class BatteryService {
  private battery: any | null;
  private listeners: Map<string, Set<Function>>;

  constructor() {
    this.battery = null;
    this.listeners = new Map([
      ['levelchange', new Set()],
      ['chargingchange', new Set()],
      ['chargingtimechange', new Set()],
      ['dischargingtimechange', new Set()]
    ]);
  }

  // Initialize battery API
  async init(): Promise<boolean> {
    if (!('getBattery' in navigator)) {
      return false;
    }
    
    try {
      this.battery = await (navigator as any).getBattery();
      
      // Set up event listeners
      this.battery.addEventListener('levelchange', () => this.emitEvent('levelchange'));
      this.battery.addEventListener('chargingchange', () => this.emitEvent('chargingchange'));
      this.battery.addEventListener('chargingtimechange', () => this.emitEvent('chargingtimechange'));
      this.battery.addEventListener('dischargingtimechange', () => this.emitEvent('dischargingtimechange'));
      
      return true;
    } catch (error) {
      console.error('Battery API error:', error);
      return false;
    }
  }

  // Get battery status
  getBatteryStatus(): {
    level: number;
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
  } | null {
    if (!this.battery) {
      return null;
    }
    
    return {
      level: this.battery.level,
      charging: this.battery.charging,
      chargingTime: this.battery.chargingTime,
      dischargingTime: this.battery.dischargingTime
    };
  }

  // Add event listener
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      return;
    }
    
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.add(callback);
    }
  }

  // Remove event listener
  off(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      return;
    }
    
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  // Emit event to listeners
  private emitEvent(event: string): void {
    if (!this.listeners.has(event)) {
      return;
    }
    
    const listeners = this.listeners.get(event);
    if (listeners) {
      const status = this.getBatteryStatus();
      listeners.forEach(callback => callback(status));
    }
  }
}

// Network Information API wrapper
export class NetworkService {
  private connection: any | null;
  private listeners: Set<Function>;

  constructor() {
    this.connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;
    this.listeners = new Set();
    
    if (this.connection) {
      this.connection.addEventListener('change', () => this.emitEvent());
    }
  }

  // Check if Network Information API is available
  isAvailable(): boolean {
    return this.connection !== null;
  }

  // Get network information
  getNetworkInfo(): {
    type: string;
    effectiveType: string;
    downlink: number;
    rtt: number;
    saveData: boolean;
  } | null {
    if (!this.isAvailable()) {
      return null;
    }
    
    return {
      type: this.connection.type || 'unknown',
      effectiveType: this.connection.effectiveType || 'unknown',
      downlink: this.connection.downlink || 0,
      rtt: this.connection.rtt || 0,
      saveData: this.connection.saveData || false
    };
  }

  // Check if online
  isOnline(): boolean {
    return navigator.onLine;
  }

  // Add change listener
  onChange(callback: Function): void {
    this.listeners.add(callback);
    
    // Also listen for online/offline events
    window.addEventListener('online', () => this.emitEvent());
    window.addEventListener('offline', () => this.emitEvent());
  }

  // Remove change listener
  offChange(callback: Function): void {
    this.listeners.delete(callback);
  }

  // Emit event to listeners
  private emitEvent(): void {
    const info = {
      ...this.getNetworkInfo(),
      online: this.isOnline()
    };
    
    this.listeners.forEach(callback => callback(info));
  }
}

// Vibration API wrapper
export class VibrationService {
  // Check if Vibration API is available
  isAvailable(): boolean {
    return 'vibrate' in navigator;
  }

  // Vibrate with pattern
  vibrate(pattern: number | number[]): boolean {
    if (!this.isAvailable()) {
      return false;
    }
    
    try {
      navigator.vibrate(pattern);
      return true;
    } catch (error) {
      console.error('Vibration error:', error);
      return false;
    }
  }

  // Stop vibration
  stop(): boolean {
    if (!this.isAvailable()) {
      return false;
    }
    
    try {
      navigator.vibrate(0);
      return true;
    } catch (error) {
      console.error('Vibration stop error:', error);
      return false;
    }
  }

  // Predefined patterns
  patterns = {
    success: [100, 50, 100],
    error: [100, 50, 100, 50, 100],
    warning: [300, 100, 300],
    notification: [200, 100, 200],
    longPress: [500]
  };
}

// Device orientation and motion API wrapper
export class DeviceMotionService {
  private orientationListeners: Set<(event: DeviceOrientationEvent) => void>;
  private motionListeners: Set<(event: DeviceMotionEvent) => void>;
  private isOrientationListening: boolean;
  private isMotionListening: boolean;

  constructor() {
    this.orientationListeners = new Set();
    this.motionListeners = new Set();
    this.isOrientationListening = false;
    this.isMotionListening = false;
  }

  // Check if orientation API is available
  isOrientationAvailable(): boolean {
    return 'DeviceOrientationEvent' in window;
  }

  // Check if motion API is available
  isMotionAvailable(): boolean {
    return 'DeviceMotionEvent' in window;
  }

  // Request permission (for iOS 13+)
  async requestPermission(): Promise<boolean> {
    if (this.isOrientationAvailable() && 
        typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        return permission === 'granted';
      } catch (error) {
        console.error('Error requesting device orientation permission:', error);
        return false;
      }
    }
    
    return true; // Permission not needed or already granted
  }

  // Start listening for orientation events
  startOrientationListening(): boolean {
    if (!this.isOrientationAvailable() || this.isOrientationListening) {
      return false;
    }
    
    window.addEventListener('deviceorientation', this.handleOrientation);
    this.isOrientationListening = true;
    return true;
  }

  // Stop listening for orientation events
  stopOrientationListening(): void {
    if (!this.isOrientationListening) {
      return;
    }
    
    window.removeEventListener('deviceorientation', this.handleOrientation);
    this.isOrientationListening = false;
  }

  // Start listening for motion events
  startMotionListening(): boolean {
    if (!this.isMotionAvailable() || this.isMotionListening) {
      return false;
    }
    
    window.addEventListener('devicemotion', this.handleMotion);
    this.isMotionListening = true;
    return true;
  }

  // Stop listening for motion events
  stopMotionListening(): void {
    if (!this.isMotionListening) {
      return;
    }
    
    window.removeEventListener('devicemotion', this.handleMotion);
    this.isMotionListening = false;
  }

  // Add orientation listener
  onOrientation(callback: (event: DeviceOrientationEvent) => void): void {
    this.orientationListeners.add(callback);
    
    if (!this.isOrientationListening) {
      this.startOrientationListening();
    }
  }

  // Remove orientation listener
  offOrientation(callback: (event: DeviceOrientationEvent) => void): void {
    this.orientationListeners.delete(callback);
    
    if (this.orientationListeners.size === 0) {
      this.stopOrientationListening();
    }
  }

  // Add motion listener
  onMotion(callback: (event: DeviceMotionEvent) => void): void {
    this.motionListeners.add(callback);
    
    if (!this.isMotionListening) {
      this.startMotionListening();
    }
  }

  // Remove motion listener
  offMotion(callback: (event: DeviceMotionEvent) => void): void {
    this.motionListeners.delete(callback);
    
    if (this.motionListeners.size === 0) {
      this.stopMotionListening();
    }
  }

  // Handle orientation event
  private handleOrientation = (event: DeviceOrientationEvent): void => {
    this.orientationListeners.forEach(callback => callback(event));
  };

  // Handle motion event
  private handleMotion = (event: DeviceMotionEvent): void => {
    this.motionListeners.forEach(callback => callback(event));
  };
}

// Create singleton instances
export const webSocketManager = new WebSocketManager('wss://api.konivrer.com/ws');
export const cacheManager = new CacheManager({ name: 'konivrer-cache', version: '1.0' });
export const geolocationService = new GeolocationService();
export const shareService = new ShareService();
export const clipboardService = new ClipboardService();
export const batteryService = new BatteryService();
export const networkService = new NetworkService();
export const vibrationService = new VibrationService();
export const deviceMotionService = new DeviceMotionService();

// Initialize services that need it
batteryService.init().catch(() => {});

// Export default object with all services
export default {
  registerServiceWorker,
  requestNotificationPermission,
  sendPushNotification,
  WebSocketManager,
  IndexedDBManager,
  CacheManager,
  GeolocationService,
  ShareService,
  ClipboardService,
  BatteryService,
  NetworkService,
  VibrationService,
  DeviceMotionService,
  webSocketManager,
  cacheManager,
  geolocationService,
  shareService,
  clipboardService,
  batteryService,
  networkService,
  vibrationService,
  deviceMotionService
};