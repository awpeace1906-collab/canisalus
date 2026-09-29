// Offline-first service worker. build.js injects the exact precache list (shell + content) and a
// version derived from it, so a changed file always invalidates the cache.
const VERSION = '__VERSION__';
const SHELL_CACHE = `canisalus-shell-${VERSION}`;
const PRECACHE = /*__SHELL__*/[];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);
    await cache.addAll(PRECACHE);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== SHELL_CACHE && !k.startsWith('canisalus-content')).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const { request } = e;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== location.origin) return;

  // Content: cache-first, refresh in the background (stale-while-revalidate).
  if (url.pathname.includes('/content/')) {
    e.respondWith(caches.open(SHELL_CACHE).then(async cache => {
      const cached = await cache.match(request);
      const network = fetch(request).then(res => { if (res.ok) cache.put(request, res.clone()); return res; }).catch(() => cached);
      return cached || network;
    }));
    return;
  }
  // App shell: cache-first, fall back to network.
  e.respondWith(caches.match(request).then(c => c || fetch(request)));
});
