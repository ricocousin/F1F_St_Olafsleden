// St. Olavsleden Day Cards — service worker
// Strategy:
//  - App shell (HTML/JS/CSS/Leaflet): cache-first, so the app loads with no signal.
//  - Map tiles (OpenStreetMap): cache-first, populated automatically as you
//    browse each day while you still have signal (e.g. plan the trip at home,
//    or on the last day's wifi before the next). Once a tile is cached it
//    works offline for good.
//  - Weather (api.met.no): network-first, falling back to the last cached
//    response if offline -- better a stale forecast than none.
//  - Everything else: network-first with cache fallback.

const SHELL_CACHE = 'olavsleden-shell-v1';
const TILE_CACHE = 'olavsleden-tiles-v1';
const WX_CACHE = 'olavsleden-wx-v1';

const SHELL_URLS = [
  './',
  './app.html',
  './index.html',
  './manifest.json',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then(cache => cache.addAll(SHELL_URLS))
      .catch(() => {}) // don't fail install if a shell URL is unreachable
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

  // app shell / everything else: cache-first for speed + offline load
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
