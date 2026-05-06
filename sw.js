const CACHE_NAME = 'dawala-cache-v2';

const urlsToCache = [
  '/login.html',
  '/dashboard.html',
  '/assets/css/style.css',
  '/assets/js/main.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  // 🔥 jangan cache API
  if (
    event.request.method !== 'GET' ||
    event.request.url.includes('/api/')
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;

      return fetch(event.request).then(res => {
        if (
          !res ||
          res.status !== 200 ||
          (res.type !== 'basic' && res.type !== 'cors')
        ) {
          return res;
        }

        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, clone);
        });

        return res;
      });
    })
  );
});

self.addEventListener('activate', event => {
  const whitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(
        names.map(name => {
          if (!whitelist.includes(name)) {
            return caches.delete(name);
          }
        })
      )
    )
  );
});