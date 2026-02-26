const CACHE = 'love-timeline-v2';
const ASSETS = ['/login', '/manifest.webmanifest', '/icon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  // Keep page navigations network-first so auth/session redirects are always fresh.
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match('/login')));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(event.request)
        .then((response) => {
          const requestUrl = new URL(event.request.url);
          const shouldCache =
            requestUrl.origin === self.location.origin &&
            !requestUrl.pathname.startsWith('/api/');
          if (shouldCache && response.ok) {
            const cloned = response.clone();
            caches.open(CACHE).then((cache) => cache.put(event.request, cloned));
          }
          return response;
        })
        .catch(() => caches.match('/login'));
    })
  );
});
