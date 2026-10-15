const CACHE_NAME = 'road2belt-v2';

self.addEventListener('install', (event) => {
  const scope = self.registration.scope;
  const staticAssets = [
    scope,
    `${scope}index.html`,
    `${scope}favicon.svg`,
    `${scope}manifest.json`
  ];
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(staticAssets).catch((err) => {
        console.warn('Cache prefill notice:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);
  // Never intercept cross-origin requests (e.g., api.github.com)
  if (requestUrl.origin !== self.location.origin) return;

  // Network-first for HTML navigation so updates deploy immediately
  if (event.request.mode === 'navigate' || requestUrl.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request).then((res) => res || caches.match(self.registration.scope)))
    );
    return;
  }

  // Cache-first for hashed static assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => {
          return caches.match(self.registration.scope);
        });
    })
  );
});
