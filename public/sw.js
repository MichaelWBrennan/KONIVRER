// Ultra-optimized service worker for KONIVRER Deck Database
const CACHE_NAME = 'konivrer-v4';
const STATIC_CACHE_NAME = 'konivrer-static-v4';
const RUNTIME_CACHE_NAME = 'konivrer-runtime-v4';
const API_CACHE_NAME = 'konivrer-api-v4';

// Critical assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/src/data/cards.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
];

// API endpoints to cache with network-first strategy
const API_CACHE_PATTERNS = [
  /^\/api\/cards/,
  /^\/api\/decks/,
  /^\/api\/version/,
  /^\/api\/security/,
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting()),
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && 
              cacheName !== STATIC_CACHE_NAME && 
              cacheName !== RUNTIME_CACHE_NAME && 
              cacheName !== API_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }).then(() => self.clients.claim()),
  );
});

// Fetch event with intelligent caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests (except fonts and analytics)
  if (url.origin !== location.origin && 
      !url.hostname.includes('googleapis.com') && 
      !url.hostname.includes('gstatic.com') &&
      !url.hostname.includes('vercel-insights.com') &&
      !url.hostname.includes('vercel-scripts.com')) {
    return;
  }

  // Handle different types of requests with appropriate strategies
  if (isAPIRequest(url)) {
    event.respondWith(networkFirstStrategy(request, API_CACHE_NAME));
  } else if (isStaticAsset(url)) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE_NAME));
  } else {
    event.respondWith(staleWhileRevalidateStrategy(request, RUNTIME_CACHE_NAME));
  }
});

// Helper functions
function isAPIRequest(url) {
  return API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname));
}

function isStaticAsset(url) {
  return /\.(js|css|png|jpg|jpeg|svg|gif|webp|avif|woff2?|ttf|ico)$/i.test(url.pathname) ||
         url.hostname.includes('googleapis.com') ||
         url.hostname.includes('gstatic.com');
}

// Cache-first strategy (for static assets)
async function cacheFirstStrategy(request, cacheName) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.warn('Cache-first strategy failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

// Network-first strategy (for API requests)
async function networkFirstStrategy(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.warn('Network-first fallback to cache:', error);
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('{"error":"Offline"}', { 
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Stale-while-revalidate strategy (for HTML and other resources)
async function staleWhileRevalidateStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => cachedResponse);

  return cachedResponse || fetchPromise;
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  console.log('Service Worker: Background sync triggered');
  // Implement offline action sync here
}
