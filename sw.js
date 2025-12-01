const CACHE_NAME = 'pwa-cache-v2';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/about.html',
    '/offline.html',
    '/script.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(k => {
                    if (k !== CACHE_NAME) return caches.delete(k);
                })
            )
        )
    );
});

// Respond fetch
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response =>
            response || fetch(event.request).catch(() => caches.match('/offline.html'))
        )
    );
});

// OPTIONAL – Jika notifikasi diklik
self.addEventListener("notificationclick", event => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow("/")
    );
});
