const CACHE_NAME = "pwa-cache-v2";

const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/app.js",
  "/about.html",
  "/offline.html",
  "/manifest.json",

  // ICONS WAJIB untuk notifikasi
  "/images/icon-192x192.png",
  "/images/icon-512x512.png",
];

// ============================
// Install
// ============================
self.addEventListener("install", (event) => {
  console.log("[SW] Installing...");

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Caching assets...");
      return cache.addAll(urlsToCache);
    })
  );

  self.skipWaiting();
});

// ============================
// Activate
// ============================
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating...");

  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[SW] Deleting old cache:", cache);
            return caches.delete(cache);
          }
        })
      )
    )
  );

  self.clients.claim();
});

// ============================
// Fetch Handler
// ============================
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // gunakan cache
      }

      return fetch(event.request).catch(() => {
        // Jika offline dan request HTML → tampilkan offline.html
        if (event.request.mode === "navigate") {
          return caches.match("/offline.html");
        }
      });
    })
  );
});

// ============================
// Notification Click Handler
// ============================
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Jika ada tab PWA terbuka → fokuskan
      for (const client of clientList) {
        if (client.url === "/" && "focus" in client) {
          return client.focus();
        }
      }
      // Jika belum ada tab → buka baru
      if (clients.openWindow) {
        return clients.openWindow("/");
      }
    })
  );
});
