const STATIC_CACHE = 'nzinga-static-v2';
const DYNAMIC_CACHE = 'nzinga-dynamic-v2';
const MEDIA_CACHE = 'nzinga-media-v2';

// Cache expiry: 10 days in milliseconds
const CACHE_EXPIRY_MS = 10 * 24 * 60 * 60 * 1000;

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
          .filter((key) => !key.includes('-v2'))
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

  // Skip Supabase API calls
  if (url.hostname.includes('supabase')) return;

  // Handle different asset types with different strategies
  if (isMediaAsset(url.pathname)) {
    // Cache-first with 10-day expiry for media (images, videos)
    event.respondWith(cacheFirstWithExpiry(request, MEDIA_CACHE));
  } else if (isStaticAsset(url.pathname)) {
    // Cache-first for other static assets (js, css, fonts)
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  } else if (isPageRequest(request)) {
    // Network-first for HTML pages (fresher content)
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
  } else {
    // Stale-while-revalidate for everything else
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
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

// Cache-first with 10-day expiry - for media assets
async function cacheFirstWithExpiry(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  if (cached) {
    // Check cache timestamp
    const cachedTime = cached.headers.get('sw-cache-time');
    if (cachedTime) {
      const age = Date.now() - parseInt(cachedTime);
      if (age < CACHE_EXPIRY_MS) {
        return cached; // Cache still valid
      }
      // Cache expired, delete and fetch fresh
      await cache.delete(request);
    } else {
      // No timestamp, return cached (legacy)
      return cached;
    }
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      // Clone response and add cache timestamp
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
    // If network fails, try to return stale cache
    const stale = await cache.match(request);
    if (stale) return stale;
    return new Response('Offline', { status: 503 });
  }
}

// Cache-first strategy - best for static assets
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
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
  const cached = await caches.match(request);
  
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      caches.open(cacheName).then((cache) => {
        cache.put(request, response.clone());
      });
    }
    return response;
  }).catch(() => cached);

  return cached || fetchPromise;
}
