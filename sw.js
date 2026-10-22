// çevrimdışı çalışma: önce önbellek, arkada güncelle
const SURUM = 'yonca-v2';
const DOSYALAR = ['./', 'index.html', 'motor.js', 'manifest.json', 'ikon-180.png', 'ikon-192.png', 'ikon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(SURUM).then(c => c.addAll(DOSYALAR))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== SURUM).map(x => caches.delete(x)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(eski => {
    const ag = fetch(e.request).then(r => { if (r.ok) { const kopya = r.clone(); caches.open(SURUM).then(c => c.put(e.request, kopya)); } return r; }).catch(() => eski);
    return eski || ag;
  }));
});
