// çevrimdışı çalışma. Sayfa ve kod: önce internet (güncellemeler hemen gelsin), yoksa önbellek.
// Resim/müzik: önce önbellek (büyük dosyalar, nadiren değişir).
const SURUM = 'yonca-v9';
const DOSYALAR = ['./', 'index.html', 'motor.js', 'temalar.js', 'yaris.js', 'rulet.js', 'tombala.js', 'manifest.json', 'ikon-180.png', 'ikon-192.png', 'ikon-512.png',
  ...['lobi', 'yonca', 'seker', 'buyucu', 'ates', 'korsan', 'kuzu', 'maya', 'olimpos', 'yaris', 'rulet', 'tombala'].map(m => `muzik/${m}.mp3`),
  ...['yonca', 'seker', 'buyucu', 'ates', 'korsan', 'kuzu', 'maya', 'olimpos'].flatMap(t => ['W', 'S', 'N', 'A', 'U', 'P', 'C', 'Y', t === 'kuzu' ? 'O' : 'X', 'Z', 'logo', 'arka', 'k_bekle', 'k_aksiyon', 'k_sevinc'].map(k => `sanat/${t}/${k}.webp`))];
// cache: 'reload' → GitHub Pages'in 10 dk'lık HTTP önbelleğini atla, taze dosyayı al
self.addEventListener('install', e => {
  e.waitUntil(caches.open(SURUM).then(c => Promise.all(DOSYALAR.map(d => c.add(new Request(d, { cache: 'reload' })).catch(() => {})))));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== SURUM).map(x => caches.delete(x)))));
  self.clients.claim();
});
const kod = u => u.mode === 'navigate' || /\.(html|js|json)$/.test(new URL(u.url).pathname) || new URL(u.url).pathname.endsWith('/');
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (kod(e.request)) {
    e.respondWith(fetch(e.request, { cache: 'no-cache' }).then(r => {
      if (r.ok) { const kopya = r.clone(); caches.open(SURUM).then(c => c.put(e.request, kopya)); }
      return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: true })));
    return;
  }
  e.respondWith(caches.match(e.request).then(eski => eski || fetch(e.request).then(r => {
    if (r.ok) { const kopya = r.clone(); caches.open(SURUM).then(c => c.put(e.request, kopya)); }
    return r;
  })));
});
