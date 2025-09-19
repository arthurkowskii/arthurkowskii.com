/**
 * Service Worker for Portfolio PWA
 * Provides offline capabilities and advanced caching
 */

const CACHE_NAME = 'atom-portfolio-v1';
const RUNTIME_CACHE = 'atom-runtime';

// Core assets to cache immediately
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/bio',
  '/admin',
  '/favicon.svg',
  '/images/bio/arthur-portfolio.jpg'
];

// Assets to cache on runtime
const RUNTIME_PATTERNS = [
  /\/_astro\/.+\.(js|css)$/,
  /\/images\/.+\.(webp|jpg|png|svg)$/,
  /\/projects\/.+/
];

// Network-first patterns (always try network first)
const NETWORK_FIRST_PATTERNS = [
  /\/api\//,
  /\/admin/
];

self.addEventListener('install', (event) => {
  console.log('🚀 Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching core assets');
        return cache.addAll(CORE_ASSETS);
      })
      .then(() => {
        console.log('✅ Service Worker installed');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Service Worker install failed:', error);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('🔄 Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker activated');
        return self.clients.claim();
      })
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip Chrome extension requests
  if (url.protocol === 'chrome-extension:') {
    return;
  }
  
  // Handle health check requests
  if (url.pathname === '/api/health') {
    event.respondWith(handleHealthCheck(request));
    return;
  }

  // Skip service worker for video files - let browser handle them directly
  // This prevents issues with range requests and video streaming
  if (url.pathname.match(/\.(mp4|webm|mov|avi|mkv)$/i)) {
    return; // Don't intercept, let browser handle normally
  }

  // Network-first strategy for dynamic content
  if (NETWORK_FIRST_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    event.respondWith(networkFirst(request));
    return;
  }
  
  // Runtime caching for assets
  if (RUNTIME_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    event.respondWith(cacheFirst(request));
    return;
  }
  
  // Stale-while-revalidate for HTML pages
  if (url.pathname.endsWith('.html') || url.pathname.endsWith('/')) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }
  
  // Default: try network first, fall back to cache
  event.respondWith(networkFirst(request));
});

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful, fully-cacheable responses (skip partial/opaque/range)
    if (networkResponse && networkResponse.ok && isCacheableResponse(request, networkResponse)) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('🌐 Network failed, trying cache for:', request.url);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return createOfflineResponse();
    }
    
    throw error;
  }
}

async function cacheFirst(request) {
  // Bypass caching for Range requests (media seeking)
  try {
    const range = request.headers.get && request.headers.get('range');
    if (range) {
      return fetch(request);
    }
  } catch {}

  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    // Update cache in background
    fetch(request)
      .then(response => {
        if (response && response.ok && isCacheableResponse(request, response)) {
          const cache = caches.open(RUNTIME_CACHE);
          cache.then(c => c.put(request, response));
        }
      })
      .catch(() => {
        // Ignore background update failures
      });
    
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse && networkResponse.ok && isCacheableResponse(request, networkResponse)) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('📦 Failed to fetch and cache:', request.url);
    throw error;
  }
}

async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  const networkPromise = fetch(request)
    .then(response => {
      if (response && response.ok && isCacheableResponse(request, response)) {
        const cache = caches.open(CACHE_NAME);
        cache.then(c => c.put(request, response.clone()));
      }
      return response;
    })
    .catch(() => {
      // Network failed, but we might have cache
      return null;
    });
  
  // Return cached version immediately if available
  if (cachedResponse) {
    // Update in background
    networkPromise.catch(() => {
      // Ignore background update failures
    });
    
    return cachedResponse;
  }
  
  // No cache, wait for network
  const networkResponse = await networkPromise;
  if (networkResponse) {
    return networkResponse;
  }
  
  // Both cache and network failed
  return createOfflineResponse();
}

function isCacheableResponse(request, response) {
  try {
    // Skip if request is a Range request
    const isRange = request.headers && request.headers.get && !!request.headers.get('range');
    if (isRange) return false;
  } catch {}

  // Only cache 200 OK, basic type (same-origin) responses
  if (!response || response.status !== 200) return false;
  if (response.type && response.type !== 'basic' && response.type !== 'cors') return false;

  // Skip partial content
  try {
    const contentRange = response.headers && response.headers.get && response.headers.get('Content-Range');
    if (contentRange) return false;
  } catch {}

  return true;
}

async function handleHealthCheck(request) {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    serviceWorker: {
      scope: self.registration.scope,
      state: 'active'
    },
    cache: {
      core: await cacheSize(CACHE_NAME),
      runtime: await cacheSize(RUNTIME_CACHE)
    }
  };
  
  return new Response(JSON.stringify(health, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }
  });
}

async function cacheSize(cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    return keys.length;
  } catch {
    return 0;
  }
}

function createOfflineResponse() {
  return new Response(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Offline - Atom Portfolio</title>
      <style>
        body { 
          font-family: system-ui, sans-serif; 
          text-align: center; 
          padding: 40px 20px; 
          background: #f8f9fa;
        }
        .container { 
          max-width: 500px; 
          margin: 0 auto; 
          background: white; 
          padding: 40px; 
          border-radius: 8px; 
          box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
        }
        h1 { color: #333; }
        p { color: #666; line-height: 1.6; }
        button { 
          background: #00b3b0; 
          color: white; 
          border: none; 
          padding: 12px 24px; 
          border-radius: 4px; 
          cursor: pointer; 
          font-size: 16px;
          margin-top: 20px;
        }
        button:hover { background: #009a97; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🌐 You're Offline</h1>
        <p>
          Your internet connection seems to be down. The portfolio is currently 
          running from cached content where possible.
        </p>
        <p>
          <strong>What you can do:</strong><br>
          • Check your internet connection<br>
          • Visit cached pages in your browser history<br>
          • Try refreshing the page when you're back online
        </p>
        <button onclick="window.location.reload()">🔄 Try Again</button>
      </div>
    </body>
    </html>
  `, {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-cache'
    }
  });
}

// Background sync for performance data
self.addEventListener('sync', (event) => {
  if (event.tag === 'performance-sync') {
    event.waitUntil(syncPerformanceData());
  }
});

async function syncPerformanceData() {
  try {
    // Get stored performance reports
    const reports = await getStoredReports();
    
    if (reports.length > 0) {
      console.log('📊 Syncing performance data:', reports.length, 'reports');
      // In a real implementation, you'd send this to your analytics endpoint
      // For now, just log successful sync
      console.log('✅ Performance data synced');
    }
  } catch (error) {
    console.error('❌ Performance sync failed:', error);
  }
}

async function getStoredReports() {
  // This would integrate with the performance monitoring system
  return [];
}

console.log('🚀 Service Worker loaded');
