// St. Olavsleden Day Cards — service worker
// Strategy:
//  - HTML documents (app.html, index.html, /): NETWORK-FIRST. This is the
//    critical fix -- HTML must never be cache-first, or pushed updates
//    silently stop showing up on devices that already loaded the app once.
//    Falls back to cache only when offline.
//  - Static assets (Leaflet JS/CSS, manifest): cache-first, these rarely
//    change and cache-first makes the app load instantly.
//  - Map tiles (OpenStreetMap): cache-first, populated automatically as you
//    browse each day while you still have signal. Once a tile is cached it
//    works offline for good.
//  - Weather (api.met.no): network-first, falling back to the last cached
//    response if offline -- better a stale forecast than none.

const SHELL_CACHE = 'olavsleden-shell-v2';   // bumped: v1 had the HTML caching bug
const TILE_CACHE = 'olavsleden-tiles-v1';
const WX_CACHE = 'olavsleden-wx-v1';

const STATIC_URLS = [
  './manifest.json',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then(cache => cache.addAll(STATIC_URLS))
      .catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(
        names
          .filter(n => ![SHELL_CACHE, TILE_CACHE, WX_CACHE].includes(n))
          .map(n => caches.delete(n))
      )
    )
  );
  self.clients.claim();
});

function isTileRequest(url) {
  return /tile\.openstreetmap\.org/.test(url);
}
function isWeatherRequest(url) {
  return /api\.met\.no/.test(url);
}

self.addEventListener('fetch', event => {
  const url = event.request.url;

  // HTML navigations (loading app.html, index.html, or the site root):
  // always try the network first so new pushes show up immediately.
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then(resp => {
          caches.open(SHELL_CACHE).then(cache => cache.put(event.request, resp.clone()));
          return resp;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  if (isTileRequest(url)) {
    event.respondWith(
      caches.open(TILE_CACHE).then(cache =>
        cache.match(event.request).then(cached => {
          const fetchPromise = fetch(event.request)
            .then(resp => { cache.put(event.request, resp.clone()); return resp; })
            .catch(() => cached);
          return cached || fetchPromise;
        })
      )
    );
    return;
  }

  if (isWeatherRequest(url)) {
    event.respondWith(
      fetch(event.request)
        .then(resp => {
          caches.open(WX_CACHE).then(cache => cache.put(event.request, resp.clone()));
          return resp;
        })
        .catch(() => caches.open(WX_CACHE).then(cache => cache.match(event.request)))
    );
    return;
  }

  // static assets (Leaflet, manifest): cache-first for speed
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request)
        .then(resp => {
          if (event.request.method === 'GET' && resp.ok) {
            caches.open(SHELL_CACHE).then(cache => cache.put(event.request, resp.clone()));
          }
          return resp;
        })
        .catch(() => cached);
    })
  );
});
