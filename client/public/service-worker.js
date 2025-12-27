// UniFix Service Worker v2.1
// Optimized for Real Backend Connection (Port 5000)

const CACHE_NAME = 'unifix-v2.1';
const OFFLINE_CACHE = 'unifix-offline-v1';

// 1. DEFINE YOUR REAL BACKEND URL
const API_BASE_URL = 'http://localhost:5000';

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/static/js/bundle.js', // Typical React build output
  '/src/styles/globals.css',
];

// 2. UPDATED ROUTES TO MATCH YOUR REAL CONTROLLERS
const API_CACHE_ROUTES = [
  '/api/complaints',
  '/api/auth/me',
  '/api/notifications'
];

const EXTERNAL_RESOURCES = [
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
];

// ==================== INSTALL EVENT ====================
self.addEventListener('install', (event) => {
  console.log('🔄 UniFix Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(cache => {
        return cache.addAll(ASSETS_TO_CACHE);
      }).catch(err => console.log('Cache assets optional in dev mode')),

      caches.open(OFFLINE_CACHE).then(cache => {
        return cache.addAll([
          '/offline.html',
          // Create a tiny offline icon if missing or remove this line
          '/favicon.ico', 
        ]);
      }),
      self.skipWaiting(),
    ])
  );
});

// ==================== ACTIVATE EVENT ====================
self.addEventListener('activate', (event) => {
  console.log('✅ UniFix Service Worker activated!');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== OFFLINE_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ==================== FETCH EVENT (FIXED FOR API PORT 5000) ====================
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;

  // 1. Handle Real Backend API Calls (Port 5000)
  if (url.origin === API_BASE_URL || API_CACHE_ROUTES.some(route => url.pathname.includes(route))) {
     event.respondWith(networkFirstStrategy(event.request));
     return;
  }

  // 2. Handle Local Frontend Assets (Port 3000)
  if (url.origin === location.origin) {
    // HTML pages
    if (event.request.headers.get('accept')?.includes('text/html')) {
      event.respondWith(networkFirstWithOfflineFallback(event.request));
    }
    // Static assets
    else if (ASSETS_TO_CACHE.some(asset => url.pathname.startsWith(asset))) {
      event.respondWith(cacheFirstStrategy(event.request));
    }
    // Everything else (React chunks, etc)
    else {
      event.respondWith(staleWhileRevalidateStrategy(event.request));
    }
  }
  // 3. Handle External Fonts/CDNs
  else if (EXTERNAL_RESOURCES.some(resource => url.href.includes(resource))) {
    event.respondWith(cacheFirstStrategy(event.request));
  }
});

// ==================== STRATEGIES ====================

// Cache First
async function cacheFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;
  
  try {
    const network = await fetch(request);
    if (network.ok) cache.put(request, network.clone());
    return network;
  } catch (err) {
    return new Response('', { status: 404 });
  }
}

// Network First (API)
async function networkFirstStrategy(request) {
  try {
    const network = await fetch(request);
    if (network.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, network.clone());
    }
    return network;
  } catch (error) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;

    // Return JSON error for API calls if offline and no cache
    return new Response(JSON.stringify({ error: 'Offline', message: 'No internet connection' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// HTML Network First + Offline Fallback
async function networkFirstWithOfflineFallback(request) {
  try {
    return await fetch(request);
  } catch (error) {
    const cache = await caches.open(OFFLINE_CACHE);
    const offlinePage = await cache.match('/offline.html');
    if (offlinePage) return offlinePage;
    
    // Simple inline offline page fallback
    return new Response(
      `<html><body><h1 style="text-align:center; margin-top:50px;">You are offline</h1><p style="text-align:center;">Please check your connection.</p></body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  }
}

// Stale While Revalidate
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  const network = fetch(request).then(res => {
    if (res.ok) cache.put(request, res.clone());
    return res;
  }).catch(() => {});
  return cached || network;
}

// ==================== BACKGROUND SYNC ====================
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-complaints') {
    event.waitUntil(syncPendingComplaints());
  }
});

async function syncPendingComplaints() {
  // Placeholder for IndexedDB sync logic
  console.log('Attempting to sync complaints...');
}

console.log('🚀 UniFix Service Worker v2.1 Ready');