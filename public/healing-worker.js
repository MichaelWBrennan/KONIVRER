/**
 * Advanced Self-Healing Service Worker
 * 
 * Provides background healing capabilities, offline resilience,
 * and predictive resource management
 */

const CACHE_NAME = 'konivrer-healing-v3';
const CRITICAL_RESOURCES = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Advanced caching strategies
const CACHE_STRATEGIES = {
  'network-first': ['api/', 'data/'],
  'cache-first': ['static/', 'assets/'],
  'stale-while-revalidate': ['images/', 'fonts/']
};

// Error tracking and healing
let errorCount = 0;
let healingActive = false;
let networkHealth = 100;
let lastHealingTime = 0;

// Performance metrics
const performanceMetrics = {
  cacheHitRate: 0,
  networkLatency: 0,
  errorRate: 0,
  healingEfficiency: 0
};

/**
 * Install event - preload critical resources
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Healing Worker] Installing and caching critical resources');
        return cache.addAll(CRITICAL_RESOURCES);
      })
      .then(() => {
        // Skip waiting to activate immediately
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[Healing Worker] Installation failed:', error);
        // Attempt healing even during installation
        attemptInstallationHealing();
      })
  );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[Healing Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Take control of all clients immediately
        return self.clients.claim();
      })
      .then(() => {
        console.log('[Healing Worker] Activated with advanced healing capabilities');
        initializeAdvancedHealing();
      })
  );
});

/**
 * Fetch event - intelligent request handling with healing
 */
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }

  event.respondWith(
    handleRequestWithHealing(request)
      .catch((error) => {
        console.error('[Healing Worker] Request failed:', error);
        return attemptRequestHealing(request, error);
      })
  );
});

/**
 * Advanced request handling with multiple strategies
 */
async function handleRequestWithHealing(request) {
  const url = new URL(request.url);
  const strategy = determineStrategy(url.pathname);
  
  const startTime = performance.now();
  
  try {
    let response;
    
    switch (strategy) {
      case 'network-first':
        response = await networkFirstStrategy(request);
        break;
      case 'cache-first':
        response = await cacheFirstStrategy(request);
        break;
      case 'stale-while-revalidate':
        response = await staleWhileRevalidateStrategy(request);
        break;
      default:
        response = await adaptiveStrategy(request);
    }
    
    // Update performance metrics
    const endTime = performance.now();
    updatePerformanceMetrics(endTime - startTime, true);
    
    return response;
    
  } catch (error) {
    const endTime = performance.now();
    updatePerformanceMetrics(endTime - startTime, false);
    
    // Increment error count and attempt healing
    errorCount++;
    
    if (shouldAttemptHealing()) {
      return await attemptRequestHealing(request, error);
    }
    
    throw error;
  }
}

/**
 * Network-first strategy with fallback
 */
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetchWithTimeout(request, 5000);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

/**
 * Cache-first strategy with network fallback
 */
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Update cache in background if stale
    if (isCacheStale(cachedResponse)) {
      updateCacheInBackground(request);
    }
    return cachedResponse;
  }
  
  // Fallback to network
  const networkResponse = await fetchWithTimeout(request, 8000);
  
  if (networkResponse.ok) {
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

/**
 * Stale-while-revalidate strategy
 */
async function staleWhileRevalidateStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  // Always try to update cache in background
  const networkPromise = fetchWithTimeout(request, 10000)
    .then((response) => {
      if (response.ok) {
        const cache = caches.open(CACHE_NAME);
        cache.then(c => c.put(request, response.clone()));
      }
      return response;
    })
    .catch(() => {
      // Silent network failure
    });
  
  // Return cached version immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Wait for network if no cache
  return await networkPromise;
}

/**
 * Adaptive strategy based on network conditions
 */
async function adaptiveStrategy(request) {
  if (networkHealth < 50) {
    // Poor network - prefer cache
    return await cacheFirstStrategy(request);
  } else if (networkHealth > 80) {
    // Good network - prefer fresh data
    return await networkFirstStrategy(request);
  } else {
    // Medium network - balanced approach
    return await staleWhileRevalidateStrategy(request);
  }
}

/**
 * Attempt to heal failed requests
 */
async function attemptRequestHealing(request, error) {
  healingActive = true;
  lastHealingTime = Date.now();
  
  try {
    // Strategy 1: Try with different timeout
    try {
      const response = await fetchWithTimeout(request, 15000);
      if (response.ok) {
        healingActive = false;
        return response;
      }
    } catch (timeoutError) {
      // Continue to next strategy
    }
    
    // Strategy 2: Try cached version even if stale
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      healingActive = false;
      return cachedResponse;
    }
    
    // Strategy 3: Try simplified request
    if (request.url.includes('?')) {
      const simplifiedUrl = request.url.split('?')[0];
      const simplifiedRequest = new Request(simplifiedUrl);
      try {
        const response = await fetchWithTimeout(simplifiedRequest, 10000);
        if (response.ok) {
          healingActive = false;
          return response;
        }
      } catch (simplifiedError) {
        // Continue to next strategy
      }
    }
    
    // Strategy 4: Return fallback response
    healingActive = false;
    return createFallbackResponse(request);
    
  } catch (healingError) {
    healingActive = false;
    console.error('[Healing Worker] All healing strategies failed:', healingError);
    throw error; // Re-throw original error
  }
}

/**
 * Create fallback response for failed requests
 */
function createFallbackResponse(request) {
  const url = new URL(request.url);
  
  // API requests - return empty data structure
  if (url.pathname.includes('/api/')) {
    return new Response(JSON.stringify({ 
      error: 'Service temporarily unavailable',
      data: [],
      cached: false,
      healed: true
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // HTML requests - return minimal HTML
  if (request.headers.get('accept')?.includes('text/html')) {
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head><title>KONIVRER - Loading...</title></head>
        <body>
          <div id="root">
            <div style="text-align: center; padding: 50px;">
              <h2>Loading KONIVRER...</h2>
              <p>Restoring connection...</p>
            </div>
          </div>
          <script>
            // Auto-refresh when online
            window.addEventListener('online', () => location.reload());
          </script>
        </body>
      </html>
    `, {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });
  }
  
  // Default fallback
  return new Response('Service temporarily unavailable', {
    status: 503,
    headers: { 'Content-Type': 'text/plain' }
  });
}

/**
 * Fetch with timeout and retry logic
 */
async function fetchWithTimeout(request, timeout = 8000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(request, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    // Update network health based on response
    if (response.ok) {
      networkHealth = Math.min(100, networkHealth + 1);
    } else {
      networkHealth = Math.max(0, networkHealth - 2);
    }
    
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    networkHealth = Math.max(0, networkHealth - 5);
    throw error;
  }
}

/**
 * Determine caching strategy based on URL
 */
function determineStrategy(pathname) {
  for (const [strategy, patterns] of Object.entries(CACHE_STRATEGIES)) {
    if (patterns.some(pattern => pathname.includes(pattern))) {
      return strategy;
    }
  }
  return 'adaptive';
}

/**
 * Check if healing should be attempted
 */
function shouldAttemptHealing() {
  const timeSinceLastHealing = Date.now() - lastHealingTime;
  return !healingActive && timeSinceLastHealing > 1000; // At least 1 second between healing attempts
}

/**
 * Check if cached response is stale
 */
function isCacheStale(response) {
  const cacheDate = response.headers.get('date');
  if (!cacheDate) return true;
  
  const age = Date.now() - new Date(cacheDate).getTime();
  return age > 300000; // 5 minutes
}

/**
 * Update cache in background
 */
function updateCacheInBackground(request) {
  fetchWithTimeout(request, 5000)
    .then(async (response) => {
      if (response.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response);
      }
    })
    .catch(() => {
      // Silent background update failure
    });
}

/**
 * Update performance metrics
 */
function updatePerformanceMetrics(duration, success) {
  performanceMetrics.networkLatency = 
    (performanceMetrics.networkLatency * 0.9) + (duration * 0.1);
  
  if (success) {
    performanceMetrics.cacheHitRate = 
      (performanceMetrics.cacheHitRate * 0.95) + (1 * 0.05);
  } else {
    performanceMetrics.errorRate = 
      (performanceMetrics.errorRate * 0.9) + (1 * 0.1);
  }
}

/**
 * Initialize advanced healing capabilities
 */
function initializeAdvancedHealing() {
  // Monitor network status
  self.addEventListener('online', () => {
    networkHealth = Math.min(100, networkHealth + 20);
    console.log('[Healing Worker] Network restored, health:', networkHealth);
  });
  
  self.addEventListener('offline', () => {
    networkHealth = 0;
    console.log('[Healing Worker] Network lost, switching to offline mode');
  });
  
  // Periodic health checks
  setInterval(() => {
    performHealthCheck();
  }, 30000); // Every 30 seconds
  
  // Predictive cache warming
  setInterval(() => {
    warmCriticalResources();
  }, 300000); // Every 5 minutes
}

/**
 * Perform periodic health checks
 */
function performHealthCheck() {
  // Check cache health
  caches.open(CACHE_NAME).then(cache => {
    cache.keys().then(keys => {
      if (keys.length < CRITICAL_RESOURCES.length) {
        console.log('[Healing Worker] Cache incomplete, warming up...');
        warmCriticalResources();
      }
    });
  });
  
  // Reset error count periodically
  if (errorCount > 0) {
    errorCount = Math.max(0, errorCount - 1);
  }
}

/**
 * Warm up critical resources
 */
function warmCriticalResources() {
  CRITICAL_RESOURCES.forEach(resource => {
    fetch(resource)
      .then(response => {
        if (response.ok) {
          return caches.open(CACHE_NAME);
        }
      })
      .then(cache => {
        if (cache) {
          cache.put(resource, response.clone());
        }
      })
      .catch(() => {
        // Silent warming failure
      });
  });
}

/**
 * Attempt installation healing
 */
function attemptInstallationHealing() {
  // Simplified installation for critical resources only
  const essentialResources = ['/'];
  
  caches.open(CACHE_NAME)
    .then(cache => cache.addAll(essentialResources))
    .then(() => {
      console.log('[Healing Worker] Emergency installation completed');
    })
    .catch(() => {
      console.log('[Healing Worker] Emergency installation failed, continuing anyway');
    });
}

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'GET_HEALTH':
      event.ports[0].postMessage({
        networkHealth,
        errorCount,
        healingActive,
        performanceMetrics
      });
      break;
      
    case 'FORCE_HEALING':
      performHealthCheck();
      warmCriticalResources();
      event.ports[0].postMessage({ success: true });
      break;
      
    case 'UPDATE_STRATEGY':
      if (data.strategy && data.patterns) {
        CACHE_STRATEGIES[data.strategy] = data.patterns;
      }
      break;
  }
});

console.log('[Healing Worker] Advanced self-healing service worker loaded');