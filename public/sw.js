// Ultra-optimized service worker for KONIVRER Deck Database
const CACHE_NAME = 'konivrer-v3';
const STATIC_CACHE_NAME = 'konivrer-static-v3';
const RUNTIME_CACHE_NAME = 'konivrer-runtime-v3';

// Critical assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/data/cards.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
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
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
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

  // Skip external requests (except fonts)
  if (url.origin !== location.origin && !url.hostname.includes('googleapis.com')) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Serve from cache if available
        if (cachedResponse) {
          return cachedResponse;
        }

        // Implement stale-while-revalidate for better performance
        const fetchPromise = fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200) {
              return response;
            }

            // Clone the response for caching
            const responseToCache = response.clone();

            // Determine cache strategy based on resource type
            let cacheName = RUNTIME_CACHE_NAME;
            const isStatic = /\.(js|css|png|jpg|jpeg|svg|gif|webp|avif|woff2?|ttf)$/i.test(url.pathname) ||
                           url.hostname.includes('googleapis.com') ||
                           url.hostname.includes('gstatic.com');

            if (isStatic) {
              cacheName = STATIC_CACHE_NAME;
            }

            // Cache the response asynchronously
            caches.open(cacheName)
              .then((cache) => {
                cache.put(request, responseToCache);
              })
              .catch(() => {}); // Ignore cache errors

            return response;
          })
          .catch(() => {
            // Network failed, try cache
            return caches.match(request);
          });

        return fetchPromise;
      }),
  );
});
