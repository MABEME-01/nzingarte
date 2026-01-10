const STATIC_CACHE = 'nzinga-static-v3';
const DYNAMIC_CACHE = 'nzinga-dynamic-v3';
const MEDIA_CACHE = 'nzinga-media-v3';

// Cache expiry: 2 days for media, 1 day for dynamic
const MEDIA_CACHE_EXPIRY_MS = 2 * 24 * 60 * 60 * 1000;
const DYNAMIC_CACHE_EXPIRY_MS = 1 * 24 * 60 * 60 * 1000;

// Assets to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => !key.includes('-v3'))
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip external requests
  if (url.origin !== location.origin) return;

  // Skip Supabase API calls - sempre buscar da rede para dados em tempo real
  if (url.hostname.includes('supabase')) return;

  // Handle different asset types with different strategies
  if (isMediaAsset(url.pathname)) {
    // Network-first with cache fallback for media (fresher content)
    event.respondWith(networkFirstWithExpiry(request, MEDIA_CACHE, MEDIA_CACHE_EXPIRY_MS));
  } else if (isStaticAsset(url.pathname)) {
    // Stale-while-revalidate for static assets (fast + fresh)
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
  } else if (isPageRequest(request)) {
    // Network-first for HTML pages (sempre fresco)
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
  } else if (isApiData(url.pathname)) {
    // Network-only for API data
    event.respondWith(networkOnly(request));
  } else {
    // Network-first for everything else
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
  }
});

// Check if request is for a media asset (images, videos)
function isMediaAsset(pathname) {
  return /\.(png|jpg|jpeg|gif|svg|webp|mp4|webm)$/i.test(pathname);
}

// Check if request is for a static asset (excluding media)
function isStaticAsset(pathname) {
  return /\.(js|css|woff|woff2|ttf|eot)$/i.test(pathname);
}

// Check if request is for a page
function isPageRequest(request) {
  return request.mode === 'navigate' || 
         request.headers.get('accept')?.includes('text/html');
}

// Check if request is for API data
function isApiData(pathname) {
  return pathname.includes('/api/') || pathname.includes('/rest/');
}

// Network-only - for real-time data
async function networkOnly(request) {
  try {
    return await fetch(request);
  } catch (error) {
    return new Response('Offline', { status: 503 });
  }
}

// Network-first with expiry - prioritizes fresh content
async function networkFirstWithExpiry(request, cacheName, expiryMs) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      const headers = new Headers(response.headers);
      headers.set('sw-cache-time', Date.now().toString());
      
      const cachedResponse = new Response(response.clone().body, {
        status: response.status,
        statusText: response.statusText,
        headers: headers
      });
      
      cache.put(request, cachedResponse);
    }
    return response;
  } catch (error) {
    // Fallback to cache if network fails
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    
    if (cached) {
      const cachedTime = cached.headers.get('sw-cache-time');
      if (cachedTime) {
        const age = Date.now() - parseInt(cachedTime);
        if (age < expiryMs) {
          return cached;
        }
      } else {
        return cached;
      }
    }
    
    return new Response('Offline', { status: 503 });
  }
}

// Network-first strategy - best for dynamic content
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    return caches.match('/') || new Response('Offline', { status: 503 });
  }
}

// Stale-while-revalidate strategy - serve cached, update in background
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => cached);

  return cached || fetchPromise;
}
