const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/router.js',
    '/js/modal.js',
    '/pages/home.html',
    '/pages/profile.html',
    '/pages/settings.html',
    '/pages/about.html'
];

// 安裝 Service Worker 並快取資源
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching App Shell');
                return cache.addAll(urlsToCache);
            })
    );
    self.skipWaiting(); // 強制啟用
});

// 啟動後清理舊版快取
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activated');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('[Service Worker] Clearing Old Cache');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim(); // 立刻接管控制權
});

// 攔截網路請求
self.addEventListener('fetch', (event) => {
    console.log('[Service Worker] Fetching:', event.request.url);
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            }).catch(() => {
                // 當離線且未快取的頁面
                if (event.request.url.endsWith('.html')) {
                    return caches.match('/pages/offline.html');
                }
            })
    );
});
