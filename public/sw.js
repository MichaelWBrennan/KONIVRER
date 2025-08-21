// Enhanced Service Worker for KONIVRER PWA - Mobile-First
const STATIC_CACHE = 'konivrer-static-v1.1.0';
const DYNAMIC_CACHE = 'konivrer-dynamic-v1.1.0';
const IMAGE_CACHE = 'konivrer-images-v1.1.0';

// Critical assets to cache immediately for mobile-first experience
const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/icons/pwa-192x192.png',
  '/icons/pwa-512x512.png',
];

// Install event - optimized for mobile performance
self.addEventListener('install', event => {
  console.log('Service Worker installing with mobile-first optimizations...');

  event.waitUntil(
    Promise.all([
      // Cache critical static assets
      caches.open(STATIC_CACHE)
        .then(cache => {
          console.log('Caching critical mobile assets');
          return cache.addAll(STATIC_ASSETS.filter(asset => asset !== undefined));
        }),
      // Pre-warm the image cache
      caches.open(IMAGE_CACHE)
        .then(cache => {
          console.log('Pre-warming image cache');
          return cache.add('/icons/pwa-192x192.png');
        })
    ])
    .then(() => {
      console.log('Mobile-first caches initialized');
      return self.skipWaiting();
    })
  );
});

// Activate event - enhanced cleanup for mobile storage management
self.addEventListener('activate', event => {
  console.log('Service Worker activating with mobile storage optimization...');

  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (![STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE].includes(cacheName)) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Claim clients
      self.clients.claim()
    ])
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle different types of requests
  if (request.url.includes('/api/')) {
    // API requests - Network First with Cache Fallback
    event.respondWith(networkFirstStrategy(request));
  } else if (request.destination === 'image') {
    // Images - Cache First with Network Fallback
    event.respondWith(cacheFirstStrategy(request));
  } else if (request.url.includes('/static/')) {
    // Static assets - Cache First
    event.respondWith(cacheFirstStrategy(request));
  } else {
    // HTML pages - Stale While Revalidate
    event.respondWith(staleWhileRevalidateStrategy(request));
  }
});

// Network First Strategy (for API calls)
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline fallback for API requests
    return new Response(
      JSON.stringify({
        error: 'Offline',
        message: 'This feature requires an internet connection',
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}

// Cache First Strategy (for images and static assets)
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('Failed to fetch:', request.url);

    // Return placeholder for failed image requests
    if (request.destination === 'image') {
      return new Response(
        '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f3f4f6"/><text x="100" y="100" text-anchor="middle" fill="#9ca3af">Image Unavailable</text></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } },
      );
    }

    throw error;
  }
}

// Stale While Revalidate Strategy (for HTML pages)
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request)
    .then(networkResponse => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => {
      // If network fails and we have a cached version, use it
      return cachedResponse;
    });

  // Return cached version immediately if available, otherwise wait for network
  return cachedResponse || fetchPromise;
}

// Push notifications
self.addEventListener('push', event => {
  console.log('Push notification received', event);

  let notificationData;
  
  try {
    notificationData = event.data ? event.data.json() : {};
    console.log('Notification data:', notificationData);
  } catch (e) {
    console.error('Error parsing notification data:', e);
    notificationData = {
      title: 'KONIVRER',
      body: event.data ? event.data.text() : 'You have new activity in KONIVRER!'
    };
  }
  
  // Default notification options
  const options = {
    body: notificationData.body || 'You have new activity in KONIVRER!',
    icon: notificationData.icon || '/icons/pwa-192x192.png',
    badge: notificationData.badge || '/icons/pwa-192x192.png',
    vibrate: [200, 100, 200],
    data: {
      url: notificationData.data?.url || '/',
      ...notificationData.data
    },
    tag: notificationData.tag || 'konivrer-notification',
    renotify: notificationData.renotify || false,
    requireInteraction: notificationData.requireInteraction || true,
    actions: [
      {
        action: 'open',
        title: 'Open App',
        icon: '/icons/pwa-192x192.png',
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/pwa-192x192.png',
      },
    ],
  };

  const title = notificationData.title || 'KONIVRER';
  
  // Update badge count
  if ('setAppBadge' in navigator) {
    navigator.setAppBadge(1).catch(error => {
      console.error('Error setting app badge:', error);
    });
  }
  
  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('Notification clicked:', event.action);

  event.notification.close();
  
  const data = event.notification.data || {};
  let url = data.url || '/';

  // Handle specific actions
  if (event.action === 'close') {
    // Clear badge when notification is dismissed
    if ('clearAppBadge' in navigator) {
      navigator.clearAppBadge().catch(error => {
        console.error('Error clearing app badge:', error);
      });
    }
    return; // Just close the notification without opening the app
  }

  // Clear badge when notification is clicked
  if ('clearAppBadge' in navigator) {
    navigator.clearAppBadge().catch(error => {
      console.error('Error clearing app badge:', error);
    });
  }

  // If action is 'open' or no action (clicked on notification body)
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(clientList => {
      // Check if app is already open
      for (const client of clientList) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }

      // Open new window if app is not open
      if (self.clients.openWindow) {
        return self.clients.openWindow(url);
      }
    }),
  );
});

console.log('Service Worker loaded successfully with mobile PWA features');
