const CACHE = 'love-timeline-v4';
const ASSETS = ['/manifest.webmanifest', '/icon.svg'];

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

  const requestUrl = new URL(event.request.url);
  const sameOrigin = requestUrl.origin === self.location.origin;
  const isApi = requestUrl.pathname.startsWith('/api/');
  const isRscRequest =
    requestUrl.searchParams.has('_rsc') ||
    requestUrl.pathname.startsWith('/_next/data/') ||
    requestUrl.pathname.startsWith('/_next/webpack-hmr');
  const isStaticAsset =
    requestUrl.pathname.startsWith('/_next/static/') ||
    requestUrl.pathname === '/manifest.webmanifest' ||
    requestUrl.pathname === '/icon.svg' ||
    ['style', 'script', 'image', 'font', 'manifest'].includes(event.request.destination);

  // Never cache data/doc requests so relationship state is always fresh on load.
  if (!sameOrigin || isApi || isRscRequest || !isStaticAsset) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(event.request).then((response) => {
        if (response.ok) {
          const cloned = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, cloned));
        }
        return response;
      });
    })
  );
});
