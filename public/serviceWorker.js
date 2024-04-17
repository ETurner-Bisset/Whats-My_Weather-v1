const staticCacheName = 'static-v16';
const dynamicCacheName = 'dynamic-v1';

const cacheFiles = [
  '/',
  '/forecast',
  '/errorPage',
  '/css/style.css',
  '/js/index.js',
  '/img/site.webmanifest',
  '/img/favicon.ico',
  'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
  'https://kit.fontawesome.com/6e0d4f4b9c.js',
  'https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap',
  'https://images.unsplash.com/photo-1614754844959-5e29c8ac2b26?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
];

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open(staticCacheName).then(async (cache) => {
      console.log('[Service Worker] Precaching App Shell');
      let ok;
      try {
        ok = await cache.addAll(cacheFiles);
      } catch (error) {
        console.error('sw: cache.addAll');
        for (let i of cacheFiles) {
          try {
            ok = await cache.add(i);
          } catch (err) {
            console.warn('sw: cache.add', i);
          }
        }
      }
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating Service Worker ...', event);
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== staticCacheName && key !== dynamicCacheName) {
            console.log('[Service Worker] Removing old cache.', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  console.log('[service worker] fetching something...', event);
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        if (response) {
          return response;
        } else {
          return fetch(event.request).then(function (res) {
            return caches.open(dynamicCacheName).then((cache) => {
              cache.put(event.request, res.clone());
              return res;
            });
          });
        }
      })
      .catch((err) => {
        console.log(err);
        return caches.open(staticCacheName).then((cache) => {
          return cache.match('/errorPage');
        });
      })
  );
});
