// At Yarışı: 6 kulvar, oranlı bahis, canlı anlatımlı yarış (index.html'deki ortak fonksiyonları kullanır)
(function () {
  const KASA = 0.92; // oranlar %8 kasa payıyla
  const RENKLER = [['#e53935', '#fff'], ['#f5f5f5', '#111'], ['#1e63d6', '#fff'], ['#ffd23f', '#111'], ['#2e9d48', '#fff'], ['#111', '#ffd23f']];
  const ADLAR = ['Rüzgar', 'Kara Şimşek', 'Gülbatur', 'Yıldırım', 'Bozkurt', 'Sultan', 'Asil Prens', 'Fırtına', 'Deli Tay', 'Altın Nal', 'Poyraz',
    'Efe', 'Kısmet', 'Tozkoparan', 'Boran', 'Akıncı', 'Cesur', 'Şahbatur', 'Karayel', 'Gökbörü', 'Demir Bilek', 'Çılgın Kız', 'Kumral', 'Hayalet'];
  const JOKEYLER = ['H. Karataş', 'A. Çelik', 'G. Kocakaya', 'S. Arslan', 'M. Kaya', 'E. Yıldız', 'B. Akın', 'Ö. Şahin', 'K. Demir', 'T. Doğan'];
  const MUZIK = { bpm: 152, lead: 'square', bas: 'triangle', // Wilhelm Tell finali havası
    melodi: 'E5 E5 E5 - E5 E5 E5 - E5 E5 A5 - B5 - C6 - E5 E5 E5 - E5 E5 E5 - E5 E5 C6 - B5 - A5 -',
    basl: 'A2 E3 A2 E3 A2 E3 A2 E3 A2 E3 A2 E3 E2 B2 E2 B2 A2 E3 A2 E3 A2 E3 A2 E3 E2 B2 E2 B2 A2 - A2 -' };

  let kok, atlar = [], bahis = {}, sonBahis = null, kosuNo = 1 + Math.floor(Math.random() * 20), durum = 'bahis', animZ = null;

  const css = `
  .yaris { background: radial-gradient(120% 70% at 50% 0%, #2f6b2a, #13310f 55%, #061204); }
  .yaris header h1 { margin: 0; font-size: 18px; font-weight: 900; color: #ffd34d; letter-spacing: 1px; white-space: nowrap; }
  .pist { position: relative; border-radius: 16px; overflow: hidden; border: 3px solid #ffd34d; box-shadow: 0 8px 24px #000a; background: #1b5e20; }
  .tribun { height: 34px; background: repeating-linear-gradient(90deg, #5d1a1a 0 6px, #7a2a2a 6px 12px); position: relative; overflow: hidden; }
  .tribun i { position: absolute; width: 6px; height: 6px; border-radius: 50%; top: 6px; animation: seyirci .5s infinite alternate; }
  @keyframes seyirci { to { transform: translateY(-4px); } }
  .yaris.kosuyor .tribun i { animation-duration: .18s; }
  .kulvar { position: relative; height: 40px; border-top: 2px solid #ffffff55; background: linear-gradient(180deg, #8d6e3f, #a47f4a 50%, #8d6e3f); }
  .kulvar:nth-child(even) { background: linear-gradient(180deg, #96764a, #ad8a55 50%, #96764a); }
  .kulvar .no { position: absolute; left: 3px; top: 50%; transform: translateY(-50%); width: 20px; height: 20px; border-radius: 5px; font-size: 12px; font-weight: 900; display: grid; place-items: center; z-index: 1; }
  .kulvar .at { position: absolute; top: 1px; left: 24px; font-size: 32px; line-height: 38px; will-change: transform; }
  .kulvar .at span { display: inline-block; transform: scaleX(-1); }
  .yaris.kosuyor .kulvar .at span { animation: galop .22s infinite alternate; }
  @keyframes galop { to { transform: scaleX(-1) translateY(-3px) rotate(-4deg); } }
  .kulvar .at b { position: absolute; left: 10px; top: 4px; width: 9px; height: 9px; border-radius: 50%; border: 1px solid #0006; }
  .kulvar.bahisli { box-shadow: inset 0 0 0 2px #ffd34d; }
  .bitis { position: absolute; top: 34px; bottom: 0; right: 30px; width: 8px; background: repeating-conic-gradient(#fff 0 25%, #111 0 50%) 0 0 / 8px 8px; z-index: 2; }
  .spiker { min-height: 46px; display: grid; place-items: center; text-align: center; padding: 6px 10px; border-radius: 14px; background: #000a; border: 1px solid #ffd34d44;
    font-weight: 800; font-size: 15px; color: #fff; }
  .spiker b { color: #ffd34d; }
  .at-liste { display: flex; flex-direction: column; gap: 5px; }
  .at-satir { display: grid; grid-template-columns: 28px 1fr auto auto; align-items: center; gap: 8px; padding: 7px 10px; border-radius: 12px; border: 1px solid #ffffff1f;
    background: #0006; color: #fff; text-align: left; cursor: pointer; font: inherit; }
  .at-satir:active { transform: scale(.98); }
  .at-satir .no { width: 26px; height: 26px; border-radius: 6px; font-weight: 900; display: grid; place-items: center; }
  .at-satir .ad { font-weight: 900; font-size: 15px; }
  .at-satir .ad small { display: block; font-weight: 600; font-size: 11px; color: #c8e6c9; }
  .at-satir .ad small i { font-style: normal; color: #ffd34d; }
  .at-satir .oran { font-size: 20px; font-weight: 900; color: #ffd34d; min-width: 52px; text-align: right; font-variant-numeric: tabular-nums; }
  .at-satir .oran small { display: block; font-size: 10px; color: #c8e6c9; font-weight: 700; }
  .at-satir .bh { min-width: 56px; text-align: right; font-weight: 900; color: #7dff9a; font-size: 14px; }
  .at-satir.secili { border-color: #ffd34d; box-shadow: 0 0 12px #ffd34d66; background: #3a2f0066; }
  .at-satir.kazandi { border-color: #7dff9a; box-shadow: 0 0 16px #7dff9a; animation: nabiz .6s 6; }
  .yaris-alt { display: grid; grid-template-columns: auto auto 1fr; gap: 8px; align-items: center; margin-top: auto; }
  .yaris-alt .bahis-satir { background: #0006; padding: 6px; border-radius: 14px; }
  .yaris-alt .bahis-satir div { min-width: 54px; text-align: center; font-weight: 900; }
  .sonuc-liste { display: flex; gap: 6px; justify-content: center; flex-wrap: wrap; }
  .sonuc-liste span { padding: 4px 9px; border-radius: 8px; font-weight: 900; font-size: 13px; }`;

  const yildizlar = n => '★'.repeat(n) + `<span style="color:#ffffff40">${'★'.repeat(5 - n)}</span>`;
  function kosuHazirla() {
    const adlar = [...ADLAR].sort(() => Math.random() - .5).slice(0, 6);
    const w = adlar.map(() => Math.exp((Math.random() * 2 - 1) * 1.05));
    const top = w.reduce((a, b) => a + b, 0);
    atlar = adlar.map((ad, i) => {
      const p = w[i] / top;
      const oran = Math.max(1.3, Math.floor(KASA / p * 10) / 10);
      return { ad, p, oran, jokey: rasgele(JOKEYLER), form: Math.max(1, Math.min(5, Math.round(p * 14 + Math.random() * 1.5))),
        halk: 0, stil: .75 + Math.random() * .6, dalga: [Math.random() * 6, 1 + Math.random() * 2] };
    });
    const hw = atlar.map(a => a.p * (0.6 + Math.random() * .8)); const ht = hw.reduce((a, b) => a + b, 0);
    atlar.forEach((a, i) => a.halk = Math.round(hw[i] / ht * 100));
    bahis = {}; durum = 'bahis'; kosuNo++;
  }

  function ciz() {
    kok.innerHTML = `<div class="kabuk yaris">
      <header>
        <button class="ikon-btn" data-geri aria-label="Salon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg></button>
        <h1>🏇 AT YARIŞI · ${kosuNo}. KOŞU</h1>
        <button class="ikon-btn" data-nasil aria-label="Nasıl oynanır">?</button>
      </header>
      <div class="akis"><span></span></div>
      <div class="bakiye-kutu"><div><div class="etiket">BAKİYE</div><div class="bakiye-deger">0 ₺</div></div><button class="yukle">+1.000 ₺ YÜKLE</button></div>
      <div class="pist" id="pist">
        <div class="tribun">${Array.from({ length: 70 }, (_, i) => `<i style="left:${i * 6 + Math.random() * 3}px;top:${4 + (i % 3) * 9}px;background:${rasgele(['#ffd34d', '#fff', '#ff8a80', '#80d8ff', '#b9f6ca', '#ffab40'])};animation-delay:${Math.random()}s"></i>`).join('')}</div>
        ${atlar.map((a, i) => `<div class="kulvar" data-i="${i}"><span class="no" style="background:${RENKLER[i][0]};color:${RENKLER[i][1]}">${i + 1}</span>
          <div class="at" id="at${i}"><span>🏇</span><b style="background:${RENKLER[i][0]}"></b></div></div>`).join('')}
        <div class="bitis"></div>
      </div>
      <div class="spiker" id="spiker">Bahisler açık! Atına dokun, bahsini koy.</div>
      <div class="at-liste" id="atListe"></div>
      <div class="yaris-alt">
        <div class="bahis-satir"><button class="kucuk" data-eksi>−</button><div id="yBahis"></div><button class="kucuk" data-arti>+</button></div>
        <button class="btn-ikincil" data-temizle>TEMİZLE</button>
        <button class="btn-ana" data-basla>BAŞLAT 🏁</button>
      </div>
    </div>`;
    liste(); guncelle(); arayuz(); akisYaz(`🏇 ${kosuNo}. koşu için bahisler açık!`);
  }
  function liste() {
    kok.querySelector('#atListe').innerHTML = atlar.map((a, i) => `<button class="at-satir ${bahis[i] ? 'secili' : ''}" data-at="${i}">
      <span class="no" style="background:${RENKLER[i][0]};color:${RENKLER[i][1]}">${i + 1}</span>
      <span class="ad">${a.ad}<small><i>${yildizlar(a.form)}</i> · ${a.jokey} · halkın %${a.halk}'i</small></span>
      <span class="oran">${a.oran.toLocaleString('tr-TR', { minimumFractionDigits: 1 })}<small>ORAN</small></span>
      <span class="bh">${bahis[i] ? tl(bahis[i]) : ''}</span></button>`).join('');
    kok.querySelectorAll('.kulvar').forEach(k => k.classList.toggle('bahisli', !!bahis[k.dataset.i]));
  }
  const toplam = () => Object.values(bahis).reduce((a, b) => a + b, 0);
  function guncelle() {
    kok.querySelector('#yBahis').textContent = tl(BAHISLER[D.bahisNo]);
    const t = toplam();
    const b = kok.querySelector('[data-basla]');
    b.disabled = durum === 'kosu' || (durum === 'bahis' && !t);
    b.innerHTML = durum === 'bitti' ? 'YENİ KOŞU ▶' : t ? `BAŞLAT 🏁<small style="display:block;font-size:12px">${tl(t)}</small>` : 'BAŞLAT 🏁';
    kok.querySelector('[data-temizle]').textContent = durum === 'bitti' && sonBahis ? 'AYNI BAHİS' : 'TEMİZLE';
  }
  const spiker = h => { const e = kok.querySelector('#spiker'); if (e) e.innerHTML = h; };

  function atSec(i) {
    if (durum !== 'bahis') return;
    const b = BAHISLER[D.bahisNo];
    if (toplam() + b > D.bakiye) { toast('Bakiye yetersiz — yükle butonuna bas'); titret(60); return; }
    bahis[i] = (bahis[i] || 0) + b; SES.sikke(); titret(10);
    liste(); guncelle();
    const a = atlar[i];
    spiker(`<b>${i + 1} · ${a.ad}</b>: ${tl(bahis[i])} × ${a.oran.toLocaleString('tr-TR')} = kazanırsa <b>${tl(Math.round(bahis[i] * a.oran * 100) / 100)}</b>`);
  }

  // Plackett-Luce: kazanma olasılıklarıyla tam sıralama
  function siralama() {
    const kalan = atlar.map((_, i) => i), sira = [];
    while (kalan.length) {
      const top = kalan.reduce((s, i) => s + atlar[i].p, 0); let r = Math.random() * top, sec = kalan[kalan.length - 1];
      for (const i of kalan) { r -= atlar[i].p; if (r <= 0) { sec = i; break; } }
      sira.push(sec); kalan.splice(kalan.indexOf(sec), 1);
    }
    return sira;
  }

  async function basla() {
    if (durum === 'bitti') { kosuHazirla(); ciz(); return; }
    const t = toplam();
    if (!t || durum !== 'bahis') return;
    if (t > D.bakiye) { toast('Bakiye yetersiz'); return; }
    D.bakiye -= t; D.donus++; D.ikramiye += t * .01; kaydet(); arayuz();
    sonBahis = { ...bahis };
    durum = 'kosu'; guncelle();
    kok.querySelectorAll('.at-satir').forEach(b => b.disabled = true);
    // start: boru sesi + çan
    spiker('🎺 Atlar start makinesinde…');
    ['G4', 'C5', 'E5', 'G5', '-', 'E5', 'G5'].forEach((n, i) => n !== '-' && ton(NOTA(n), .22, { tip: 'square', ses: .09, gec: i * .16 }));
    await bekle(1500);
    for (let i = 0; i < 6; i++) ton(i % 2 ? 1568 : 1319, .08, { tip: 'square', ses: .1, gec: i * .06 });
    gurultu(.4, { ses: .3, frek: 400 });
    spiker('🏁 <b>VE START VERİLDİ!</b>');
    kok.querySelector('.yaris').classList.add('kosuyor');
    Muzik.hiz = 1.25;

    const sira = siralama();
    const sure = sira.map(() => 0);
    sira.forEach((at, rank) => sure[at] = 10 + rank * .45 + Math.random() * .25);
    const pist = kok.querySelector('#pist');
    const genislik = () => pist.clientWidth - 24 - 30 - 18; // başlangıç ofseti, bitiş, at genişliği payı
    const t0 = performance.now();
    let lider = -1, sonAnons = 0, sonGalop = 0, bitenler = [], son200 = false;
    await new Promise(res => {
      const kare = now => {
        const t = (now - t0) / 1000, g = genislik();
        const xs = atlar.map((a, i) => {
          const u = Math.min(1, t / sure[i]);
          const x = Math.pow(u, a.stil) + .05 * Math.sin(2 * Math.PI * a.dalga[1] * u + a.dalga[0]) * u * (1 - u) * 4;
          return u >= 1 ? 1 + Math.min(.12, (t - sure[i]) * .08) : Math.max(0, Math.min(.999, x));
        });
        xs.forEach((x, i) => { const e = kok.querySelector('#at' + i); if (e) e.style.transform = `translateX(${x * g}px)`; });
        // anlatım
        const onde = xs.indexOf(Math.max(...xs));
        if (t - sonAnons > 1.1 && onde !== lider && t < sure[sira[0]]) {
          lider = onde; sonAnons = t;
          const cumle = t < 2 ? 'iyi çıktı, başa geçti' : t < 6 ? rasgele(['öne geçti!', 'liderliği aldı!', 'atak yapıyor!']) : rasgele(['son düzlükte öne fırladı!', 'müthiş geliyor!', 'burun farkıyla önde!']);
          spiker(`${bahis[onde] ? '🔥 ' : ''}<b>${onde + 1} · ${atlar[onde].ad}</b> ${cumle}`);
          if (bahis[onde]) titret(20);
        }
        if (t > 7.5 && !son200) { son200 = true; spiker(`📣 <b>SON 200 METRE!</b> ${lider + 1} · ${atlar[lider].ad} önde!`); }
        // dörtnala ve kalabalık
        if (now - sonGalop > 110) { sonGalop = now; gurultu(.05, { ses: .12, frek: 180 + Math.random() * 60, tip: 'lowpass' }); if (Math.random() < .4) gurultu(.25, { ses: .02 + Math.min(.08, t * .008), frek: 700 }); }
        sira.forEach(i => { if (t >= sure[i] && !bitenler.includes(i)) { bitenler.push(i); if (bitenler.length === 1) { SES.zil(8); gurultu(1.2, { ses: .15, frek: 800 }); } } });
        if (bitenler.length < 6 || t < sure[sira[5]] + .6) animZ = requestAnimationFrame(kare); else res();
      };
      animZ = requestAnimationFrame(kare);
    });
    kok.querySelector('.yaris')?.classList.remove('kosuyor');
    Muzik.hiz = 1;
    // sonuç
    const kazanan = sira[0], kaz = bahis[kazanan] ? Math.round(bahis[kazanan] * atlar[kazanan].oran * 100) / 100 : 0;
    durum = 'bitti';
    kok.querySelector(`[data-at="${kazanan}"]`)?.classList.add('kazandi');
    spiker(`🏆 Kazanan <b>${kazanan + 1} · ${atlar[kazanan].ad}</b> (oran ${atlar[kazanan].oran.toLocaleString('tr-TR')})<div class="sonuc-liste">${sira.slice(0, 3).map((i, r) =>
      `<span style="background:${RENKLER[i][0]};color:${RENKLER[i][1]}">${['🥇', '🥈', '🥉'][r]} ${i + 1}</span>`).join('')}</div>`);
    if (kaz > 0) {
      D.bakiye += kaz; D.toplamKazanc += kaz; D.enBuyuk = Math.max(D.enBuyuk, kaz); kaydet(); arayuz(); bakiyeYanip();
      const kat = kaz / t;
      akisYaz(`🏇 SEN · ${atlar[kazanan].ad} · <b>${tl(kaz)}</b> kazandın!`, kat >= 5);
      if (kat >= 4) { SES.buyuk(); await buyukGoster(kat >= 10 ? 'SÜRPRİZ AT!' : 'KAZANDIN!', kaz, `${atlar[kazanan].ad} · oran ${atlar[kazanan].oran.toLocaleString('tr-TR')}`); }
      else { SES.kazan(5); SES.sikkeler(10); fiskiye(900); fisekGosterisi(2); flas(); coskulu(2500); }
    } else {
      SES.kazan(2);
      const benim = Object.keys(bahis).map(Number);
      const ikinci = benim.includes(sira[1]);
      spiker(`${ikinci ? '😱 <b>Burun farkıyla kaçtı!</b> Atın 2. geldi.' : 'Bu sefer olmadı… bir sonraki koşu senin!'}<div class="sonuc-liste">${sira.slice(0, 3).map((i, r) =>
        `<span style="background:${RENKLER[i][0]};color:${RENKLER[i][1]}">${['🥇', '🥈', '🥉'][r]} ${i + 1}</span>`).join('')}</div>`);
    }
    guncelle();
  }

  function tiklama(e) {
    const h = e.target.closest('button'); if (!h || !kok.contains(h)) return;
    sesBaslat();
    if (h.dataset.geri !== undefined) { SES.tik(); masaKapat(); }
    else if (h.dataset.nasil !== undefined) { SES.tik(); ogreticiAc('AT YARIŞI', MASA.yaris.ogretici()); }
    else if (h.dataset.at !== undefined) atSec(+h.dataset.at);
    else if (h.dataset.eksi !== undefined) { SES.tik(); D.bahisNo = Math.max(0, D.bahisNo - 1); kaydet(); guncelle(); }
    else if (h.dataset.arti !== undefined) { SES.tik(); D.bahisNo = Math.min(BAHISLER.length - 1, D.bahisNo + 1); kaydet(); guncelle(); }
    else if (h.dataset.temizle !== undefined) {
      SES.tik();
      if (durum === 'bitti' && sonBahis) { const t = Object.values(sonBahis).reduce((a, b) => a + b, 0); kosuHazirla(); ciz();
        if (t <= D.bakiye) { bahis = {}; Object.entries(sonBahis).forEach(([i, v]) => bahis[i] = v); liste(); guncelle(); spiker('Aynı bahisler yeni atlara konuldu. BAŞLAT!'); } }
      else if (durum === 'bahis') { bahis = {}; liste(); guncelle(); spiker('Bahisler temizlendi.'); }
    }
    else if (h.dataset.basla !== undefined) basla();
  }

  window.MASA = window.MASA || {};
  window.MASA.yaris = {
    ad: 'At Yarışı', simge: '🏇', slogan: '6 at, canlı yarış, oranlı bahis', vitrin: '🏇🏆💰', rozet: '🔥 CANLI',
    arka: 'radial-gradient(120% 90% at 50% 0%, #3f8a37, #173d12 60%, #071505)',
    ac(el) {
      kok = el; el.className = 'acik';
      if (!document.getElementById('yarisCss')) document.head.insertAdjacentHTML('beforeend', `<style id="yarisCss">${css}</style>`);
      kosuHazirla(); ciz();
      el.addEventListener('click', tiklama);
      Muzik.ozel = MUZIK; Muzik.yeniden();
    },
    kapat() { cancelAnimationFrame(animZ); kok.removeEventListener('click', tiklama); Muzik.hiz = 1; },
    mesgul: () => durum === 'kosu',
    ogretici() {
      const ornek = atlar[0] || { ad: 'Rüzgar', oran: 4.5 };
      return [
        { baslik: 'Atını seç!', gorsel: '<div style="font-size:90px;transform:scaleX(-1)">🏇</div>',
          metin: `6 at yarışır. Listeden bir <b>ata dokun</b>, o ata bahsin konur. Birden fazla ata da oynayabilirsin.` },
        { baslik: 'Oran ne demek?', gorsel: `<div style="font-size:54px;font-weight:900;color:#ffd34d">10 ₺ × 4,5 = 45 ₺</div>`,
          metin: `Atın kazanırsa <b>bahis × oran</b> kadar alırsın.<br><b>Düşük oran</b> (1,5–3) = favori, sık kazanır, az öder.<br><b>Yüksek oran</b> (10+) = sürpriz at, nadiren kazanır, çok öder!` },
        { baslik: 'İpuçları', gorsel: '<div style="font-size:60px">★★★★☆</div>',
          metin: `<b>Yıldızlar</b> atın formunu, <b>halkın %'si</b> diğer oyuncuların hangi ata oynadığını gösterir. <b>BAŞLAT</b>'a bas, yarışı izle. Kazanan ilk gelen attır!` },
      ];
    },
  };
})();
