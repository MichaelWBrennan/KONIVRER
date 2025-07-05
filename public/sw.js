// Service Worker for KONIVRER PWA
const CACHE_NAME = 'konivrer-v1.0.0';
const STATIC_CACHE = 'konivrer-static-v1.0.0';
const DYNAMIC_CACHE = 'konivrer-dynamic-v1.0.0';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icons/pwa-192x192.png',
  '/icons/pwa-512x512.png',
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /\/api\/cards/,
  /\/api\/decks/,
  /\/api\/tournaments/,
  /\/api\/user/,
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker installing...');

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then(cache => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      }),
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');

  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => {
        return self.clients.claim();
      }),
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

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

// Background Sync for offline actions
self.addEventListener('sync', event => {
  console.log('Background sync triggered:', event.tag);

  if (event.tag === 'deck-save') {
    event.waitUntil(syncDeckSaves());
  } else if (event.tag === 'tournament-registration') {
    event.waitUntil(syncTournamentRegistrations());
  }
});

// Sync deck saves when back online
async function syncDeckSaves() {
  try {
    const db = await openIndexedDB();
    const pendingSaves = await getPendingDeckSaves(db);

    for (const save of pendingSaves) {
      try {
        const response = await fetch('/api/decks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(save.data),
        });

        if (response.ok) {
          await removePendingDeckSave(db, save.id);
          console.log('Synced deck save:', save.id);
        }
      } catch (error) {
        console.error('Failed to sync deck save:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Push notifications
self.addEventListener('push', event => {
  console.log('Push notification received');

  let notificationData;
  
  try {
    notificationData = event.data ? event.data.json() : {};
  } catch (e) {
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

  // Add specific actions based on notification type or tag
  if (notificationData.tag === 'tournament' || notificationData.data?.type === 'tournament') {
    options.actions = [
      {
        action: 'view-tournament',
        title: 'View Tournament',
        icon: '/icons/pwa-192x192.png',
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/pwa-192x192.png',
      },
    ];
  } else if (notificationData.tag?.startsWith('message-') || notificationData.data?.type === 'message') {
    options.actions = [
      {
        action: 'view-message',
        title: 'Read Message',
        icon: '/icons/pwa-192x192.png',
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/pwa-192x192.png',
      },
    ];
  } else if (notificationData.tag === 'match' || notificationData.data?.type === 'match') {
    options.actions = [
      {
        action: 'join-match',
        title: 'Join Match',
        icon: '/icons/pwa-192x192.png',
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/pwa-192x192.png',
      },
    ];
  }

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
  if (event.action === 'view-tournament') {
    url = data.tournamentId ? `/tournaments/${data.tournamentId}/live` : '/tournaments';
  } else if (event.action === 'view-message') {
    url = data.senderId ? `/messages/${data.senderId}` : '/messages';
  } else if (event.action === 'join-match') {
    url = data.matchId ? `/game/pvp/${data.matchId}` : '/matchmaking';
  } else if (event.action === 'close') {
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
    clients.matchAll({ type: 'window' }).then(clientList => {
      // Check if app is already open
      for (const client of clientList) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }

      // Open new window if app is not open
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    }),
  );
});

// IndexedDB helpers for offline storage
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('KonivrDB', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = event => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains('pendingDeckSaves')) {
        db.createObjectStore('pendingDeckSaves', {
          keyPath: 'id',
          autoIncrement: true,
        });
      }

      if (!db.objectStoreNames.contains('pendingRegistrations')) {
        db.createObjectStore('pendingRegistrations', {
          keyPath: 'id',
          autoIncrement: true,
        });
      }
    };
  });
}

function getPendingDeckSaves(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pendingDeckSaves'], 'readonly');
    const store = transaction.objectStore('pendingDeckSaves');
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

function removePendingDeckSave(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pendingDeckSaves'], 'readwrite');
    const store = transaction.objectStore('pendingDeckSaves');
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

// Periodic background sync for data updates
self.addEventListener('periodicsync', event => {
  console.log('Periodic sync triggered:', event.tag);

  if (event.tag === 'update-meta-data') {
    event.waitUntil(updateMetaData());
  }
});

async function updateMetaData() {
  try {
    const response = await fetch('/api/meta/current');
    if (response.ok) {
      const data = await response.json();
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put('/api/meta/current', new Response(JSON.stringify(data)));
      console.log('Meta data updated in background');
    }
  } catch (error) {
    console.error('Failed to update meta data:', error);
  }
}

// Handle app updates and mobile-specific features
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data && event.data.type === 'CACHE_CARD_IMAGES') {
    event.waitUntil(cacheCardImages(event.data.cards));
  } else if (event.data && event.data.type === 'PRELOAD_DECK') {
    event.waitUntil(preloadDeckAssets(event.data.deck));
  }
});

// Mobile-specific: Cache card images for offline play
async function cacheCardImages(cards) {
  try {
    const cache = await caches.open('konivrer-card-images');
    const imagePromises = cards.map(async card => {
      if (card.imageUrl) {
        try {
          const response = await fetch(card.imageUrl);
          if (response.ok) {
            await cache.put(card.imageUrl, response);
          }
        } catch (error) {
          console.warn('Failed to cache card image:', card.imageUrl);
        }
      }
    });

    await Promise.all(imagePromises);
    console.log(`Cached ${cards.length} card images for offline use`);
  } catch (error) {
    console.error('Failed to cache card images:', error);
  }
}

// Preload deck assets for faster gameplay
async function preloadDeckAssets(deck) {
  try {
    const cache = await caches.open('konivrer-deck-assets');
    const assetPromises = [];

    // Cache deck-specific sounds
    if (deck.sounds) {
      deck.sounds.forEach(sound => {
        assetPromises.push(
          fetch(sound.url)
            .then(response => {
              if (response.ok) {
                cache.put(sound.url, response);
              }
            })
            .catch(() => {}),
        );
      });
    }

    // Cache deck-specific animations
    if (deck.animations) {
      deck.animations.forEach(animation => {
        assetPromises.push(
          fetch(animation.url)
            .then(response => {
              if (response.ok) {
                cache.put(animation.url, response);
              }
            })
            .catch(() => {}),
        );
      });
    }

    await Promise.all(assetPromises);
    console.log('Preloaded deck assets for optimal performance');
  } catch (error) {
    console.error('Failed to preload deck assets:', error);
  }
}

// Mobile battery optimization
self.addEventListener('freeze', () => {
  console.log('App frozen - reducing background activity');
});

self.addEventListener('resume', () => {
  console.log('App resumed - restoring normal activity');
});

// Handle share target (for sharing decks)
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (url.pathname === '/share' && event.request.method === 'POST') {
    event.respondWith(handleShareTarget(event.request));
  }
});

async function handleShareTarget(request) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') || '';
    const text = formData.get('text') || '';
    const url = formData.get('url') || '';
    const files = formData.getAll('deck');

    // Process shared deck files
    if (files.length > 0) {
      const deckData = await files[0].text();

      // Store shared deck for processing when app opens
      const db = await openIndexedDB();
      const transaction = db.transaction(['sharedDecks'], 'readwrite');
      const store = transaction.objectStore('sharedDecks');

      await store.add({
        title,
        text,
        url,
        deckData,
        timestamp: Date.now(),
      });
    }

    // Redirect to deck import page
    return Response.redirect('/deck-import?shared=true', 303);
  } catch (error) {
    console.error('Failed to handle share target:', error);
    return Response.redirect('/', 303);
  }
}

console.log('Service Worker loaded successfully with mobile PWA features');
