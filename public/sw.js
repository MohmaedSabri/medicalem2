const CACHE_NAME = 'medical-eq-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Check if we're in development mode
const isDevelopment = self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.webmanifest',
  '/logo.png',
  '/ceo.jpeg',
  '/hero2.png',
  '/hero3.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        // Opened cache
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((error) => {
        // Cache installation failed
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            // Deleting old cache
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache first, then network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip development server requests
  if (isDevelopment) {
    // In development, just pass through to network
    return;
  }

  // Handle different types of requests
  if (request.destination === 'image') {
    event.respondWith(handleImageRequest(request));
  } else if (request.destination === 'script' || request.destination === 'style') {
    event.respondWith(handleStaticAssetRequest(request));
  } else {
    event.respondWith(handlePageRequest(request));
  }
});

async function handleImageRequest(request) {
  // Skip unsupported request schemes
  if (request.url.startsWith('chrome-extension://') || 
      request.url.startsWith('moz-extension://') ||
      request.url.startsWith('ms-browser-extension://') ||
      !request.url.startsWith('http')) {
    return fetch(request);
  }

  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Return a placeholder image or fallback
    return new Response('', { status: 404 });
  }
}

async function handleStaticAssetRequest(request) {
  // Skip unsupported request schemes
  if (request.url.startsWith('chrome-extension://') || 
      request.url.startsWith('moz-extension://') ||
      request.url.startsWith('ms-browser-extension://') ||
      !request.url.startsWith('http')) {
    return fetch(request);
  }

  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return new Response('', { status: 404 });
  }
}

async function handlePageRequest(request) {
  // Skip unsupported request schemes
  if (request.url.startsWith('chrome-extension://') || 
      request.url.startsWith('moz-extension://') ||
      request.url.startsWith('ms-browser-extension://') ||
      !request.url.startsWith('http')) {
    return fetch(request);
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline.html');
    }
    
    return new Response('', { status: 404 });
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle offline actions when connection is restored
}

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification',
    icon: '/logo.png',
    badge: '/logo.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('Medical Equipment', options)
  );
});
