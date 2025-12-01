const CACHE_NAME = "pwa-cache-v1";

const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/about.html',
  '/offline.html',
  '/manifest.json',

  // ICONS WAJIB DICACHE
  '/images/icon-192x192.png',
  '/images/icon-512x512.png',
];


// ============================
// Install Service Worker
// ============================
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );

  self.skipWaiting(); // Optional: langsung aktif
});

// ============================
// Activate Service Worker
// ============================
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );

  self.clients.claim(); // Optional: langsung mengambil kontrol
});

// ============================
// Fetch Handler
// ============================
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Jika ada di cache → gunakan
      if (response) return response;

      // Jika tidak ada di cache → ambil online
      return fetch(event.request).catch(() => {
        return caches.match("/offline.html");
      });
    })
  );
});
