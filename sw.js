// Service worker: guarda la estructura de la app para que abra sin conexión.
// Los datos siempre se leen en vivo (nube) o del almacenamiento local del aparato.
const CACHE = 'drypical-pedidos-v5';
const SHELL = ['./', './index.html', './config.js', './manifest.webmanifest', './logo.png', './icon-192.png', './icon-512.png', './img/pouch-pina.webp', './img/pouch-mango.webp', './img/pouch-fresa.webp', './img/pouch-naranja.webp', './img/pouch-apple.webp', './img/pouch-banana.webp', './img/pouch-tropical.webp', './img/pouch-garnish.webp'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  if (url.origin === location.origin) {
    e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      const copia = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copia));
      return res;
    }).catch(() => caches.match('./index.html'))));
  }
  // Peticiones a la nube (Supabase/CDN): red directa, sin caché.
});
