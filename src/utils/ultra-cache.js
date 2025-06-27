
/**
 * Ultra-Advanced Caching System for KONIVRER
 * Implements intelligent caching with automatic optimization
 */

class UltraCacheManager {
  constructor() {
    this.memoryCache = new Map();
    this.diskCache = null;
    this.cacheStats = {
      hits: 0,
      misses: 0,
      evictions: 0
    };
    this.maxMemorySize = 50 * 1024 * 1024; // 50MB
    this.currentMemoryUsage = 0;
    
    this.initializeDiskCache();
  }
  
  async initializeDiskCache() {
    if ('caches' in window) {
      this.diskCache = await caches.open('konivrer-ultra-cache-v1');
    }
  }
  
  // Memory cache operations
  setMemory(key, value, ttl = 300000) { // 5 minutes default TTL
    const size = this.calculateSize(value);
    
    // Evict if necessary
    while (this.currentMemoryUsage + size > this.maxMemorySize && this.memoryCache.size > 0) {
      this.evictLRU();
    }
    
    const entry = {
      value,
      timestamp: Date.now(),
      ttl,
      size,
      accessCount: 0
    };
    
    this.memoryCache.set(key, entry);
    this.currentMemoryUsage += size;
  }
  
  getMemory(key) {
    const entry = this.memoryCache.get(key);
    
    if (!entry) {
      this.cacheStats.misses++;
      return null;
    }
    
    // Check TTL
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.memoryCache.delete(key);
      this.currentMemoryUsage -= entry.size;
      this.cacheStats.misses++;
      return null;
    }
    
    // Update access info
    entry.accessCount++;
    entry.timestamp = Date.now(); // Update for LRU
    
    this.cacheStats.hits++;
    return entry.value;
  }
  
  // Disk cache operations
  async setDisk(key, value) {
    if (!this.diskCache) return;
    
    try {
      const response = new Response(JSON.stringify(value), {
        headers: { 'content-type': 'application/json' }
      });
      await this.diskCache.put(key, response);
    } catch (err) {
      console.warn('Disk cache set failed:', err);
    }
  }
  
  async getDisk(key) {
    if (!this.diskCache) return null;
    
    try {
      const response = await this.diskCache.match(key);
      if (response) {
        return await response.json();
      }
    } catch (err) {
      console.warn('Disk cache get failed:', err);
    }
    
    return null;
  }
  
  // Intelligent caching strategy
  async set(key, value, options = {}) {
    const { ttl = 300000, priority = 'normal', persist = false } = options;
    
    // Always set in memory for fast access
    this.setMemory(key, value, ttl);
    
    // Set in disk cache for large or persistent data
    if (persist || priority === 'high' || this.calculateSize(value) > 1024) {
      await this.setDisk(key, value);
    }
  }
  
  async get(key) {
    // Try memory first
    let value = this.getMemory(key);
    if (value !== null) return value;
    
    // Try disk cache
    value = await this.getDisk(key);
    if (value !== null) {
      // Promote to memory cache
      this.setMemory(key, value);
      return value;
    }
    
    return null;
  }
  
  // Cache management
  evictLRU() {
    let oldestKey = null;
    let oldestTime = Date.now();
    
    for (const [key, entry] of this.memoryCache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      const entry = this.memoryCache.get(oldestKey);
      this.memoryCache.delete(oldestKey);
      this.currentMemoryUsage -= entry.size;
      this.cacheStats.evictions++;
    }
  }
  
  calculateSize(value) {
    return JSON.stringify(value).length * 2; // Rough estimate in bytes
  }
  
  // Cache statistics
  getStats() {
    const hitRate = this.cacheStats.hits / (this.cacheStats.hits + this.cacheStats.misses);
    
    return {
      ...this.cacheStats,
      hitRate: isNaN(hitRate) ? 0 : hitRate,
      memoryUsage: this.currentMemoryUsage,
      memoryEntries: this.memoryCache.size,
      memoryUtilization: this.currentMemoryUsage / this.maxMemorySize
    };
  }
  
  // Cleanup
  clear() {
    this.memoryCache.clear();
    this.currentMemoryUsage = 0;
    
    if (this.diskCache) {
      this.diskCache.keys().then(keys => {
        keys.forEach(key => this.diskCache.delete(key));
      });
    }
  }
  
  // Periodic maintenance
  startMaintenance() {
    setInterval(() => {
      this.cleanupExpired();
      this.optimizeMemoryUsage();
    }, 60000); // Every minute
  }
  
  cleanupExpired() {
    const now = Date.now();
    const toDelete = [];
    
    for (const [key, entry] of this.memoryCache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        toDelete.push(key);
      }
    }
    
    toDelete.forEach(key => {
      const entry = this.memoryCache.get(key);
      this.memoryCache.delete(key);
      this.currentMemoryUsage -= entry.size;
    });
  }
  
  optimizeMemoryUsage() {
    // If memory usage is high, evict low-priority items
    if (this.currentMemoryUsage > this.maxMemorySize * 0.8) {
      const entries = Array.from(this.memoryCache.entries())
        .sort((a, b) => a[1].accessCount - b[1].accessCount)
        .slice(0, Math.floor(this.memoryCache.size * 0.2));
      
      entries.forEach(([key, entry]) => {
        this.memoryCache.delete(key);
        this.currentMemoryUsage -= entry.size;
      });
    }
  }
}

// Create global cache instance
const ultraCache = new UltraCacheManager();

// Start maintenance
if (typeof window !== 'undefined') {
  ultraCache.startMaintenance();
  
  // Expose to window for debugging
  if (import.meta.env.DEV) {
    window.ultraCache = ultraCache;
  }
}

export default ultraCache;
