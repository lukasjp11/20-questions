// Bump CACHE_VERSION on each release so clients drop stale assets.
const CACHE_VERSION = 'v2';
const CACHE_NAME = `20-questions-${CACHE_VERSION}`;

// Only stable, known-good assets are precached. Hashed build bundles
// (main.[hash].js/css) are cached at runtime by the fetch handler instead,
// so we never list a URL that might 404 and fail the whole install.
// Relative URLs resolve against this script's scope (/20-questions/).
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS.map(url => new Request(url, { cache: 'reload' }))))
      .catch(() => { /* precache is best-effort; never block activation */ })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => Promise.all(
        cacheNames.map(name => (name === CACHE_NAME ? undefined : caches.delete(name)))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;

  // Only handle same-origin GETs; let the cross-origin API and POSTs pass through.
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Network-first for navigations so a new deploy is picked up immediately.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then(cached => cached || caches.match('./index.html')))
    );
    return;
  }

  // Stale-while-revalidate for other same-origin assets (hashed JS/CSS, icons).
  event.respondWith(
    caches.match(request).then(cached => {
      const network = fetch(request)
        .then(response => {
          if (response && response.status === 200 && response.type === 'basic') {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
