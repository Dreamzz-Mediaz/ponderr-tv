const CACHE_NAME = 'ponderr-v1.1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/assets/ui/style.css',
    '/js/main.js',
    '/assets/logos/ponder-logo.png'
];

self.addEventListener('install', (e) => {
    e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS)));
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        fetch(e.request).catch(() => caches.match(e.request))
    );
});