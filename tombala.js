// Tombala: 90 top, 3x9 kart (15 sayı), salonda 50 kart; 1. çinko, 2. çinko, tombala ödülleri.
// Ödüller kart fiyatının 5/10/30 katı ve salonda 50 kart var → kart başına beklenen dönüş %90.
(function () {
  const TOPLAM_KART = 50, ODUL = { c1: 5, c2: 10, tombala: 30 };
  const ODUL_AD = { c1: '1. ÇİNKO', c2: '2. ÇİNKO', tombala: 'TOMBALA' };
  const MUZIK = { bpm: 128, lead: 'square', bas: 'triangle', // kahvehane/gazino havası
    melodi: 'A4 C5 E5 - D5 C5 B4 - A4 B4 C5 D5 E5 - - - E5 F5 G5 - F5 E5 D5 - C5 D5 E5 C5 A4 - - -',
    basl: 'A2 E3 A2 E3 A2 E3 A2 E3 E2 B2 E2 B2 A2 E3 A2 E3 C3 G3 C3 G3 G2 D3 G2 D3 A2 E3 E2 B2 A2 - A2 -' };
  const SAYI_AD = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz'];
  const ONLAR = ['', 'on', 'yirmi', 'otuz', 'kırk', 'elli', 'altmış', 'yetmiş', 'seksen', 'doksan'];
  const okunus = n => (ONLAR[Math.floor(n / 10)] + ' ' + SAYI_AD[n % 10]).trim();

  let kok, kartlar = [], rakipler = [], cekilen = [], torba = [], durum = 'hazir', kartSayisi = 1, hiz = 1, odulDurum = {}, zam = null, konus = true;

  const css = `
  .tombala { background: radial-gradient(120% 70% at 50% 0%, #7a1f2b, #3a0a12 55%, #140306); }
  .tombala header h1 { margin: 0; font-size: 18px; font-weight: 900; color: #ffd34d; letter-spacing: 1px; }
  .torba-alan { display: flex; align-items: center; gap: 10px; }
  .top-buyuk { width: 86px; height: 86px; flex: none; border-radius: 50%; display: grid; place-items: center; font-size: 38px; font-weight: 900; color: #222;
    background: radial-gradient(circle at 35% 30%, #fff, #ffe07a 40%, #e0a000 80%); box-shadow: 0 6px 16px #000a, inset -6px -8px 12px #0003; }
  .top-buyuk.yeni { animation: topGel .5s cubic-bezier(.3,1.6,.5,1); }
  @keyframes topGel { from { transform: translateY(-60px) scale(.3) rotate(-180deg); opacity: 0; } }
  .son-toplar { display: flex; gap: 5px; flex-wrap: wrap; }
  .son-toplar span { width: 32px; height: 32px; border-radius: 50%; display: grid; place-items: center; font-weight: 900; font-size: 14px; color: #222; background: radial-gradient(circle at 35% 30%, #fff, #f0d090); }
  .odul-tablo { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
  .odul-tablo div { text-align: center; padding: 6px 4px; border-radius: 12px; background: #0007; border: 1px solid #ffd34d55; font-size: 11px; font-weight: 800; color: #ffd9de; }
  .odul-tablo b { display: block; font-size: 16px; color: #ffd34d; }
  .odul-tablo div.alindi { opacity: .55; } .odul-tablo div.benim { border-color: #7dff9a; box-shadow: 0 0 14px #7dff9a; opacity: 1; }
  .odul-tablo small { display: block; font-size: 10px; color: #fff; }
  .kart { background: #fff8e8; border-radius: 10px; padding: 5px; border: 3px solid #c62828; box-shadow: 0 6px 16px #0008; }
  .kart-ust { display: flex; justify-content: space-between; font-size: 11px; font-weight: 900; color: #c62828; padding: 0 3px 3px; }
  .kart-izgara { display: grid; grid-template-columns: repeat(9, 1fr); gap: 2px; }
  .kart-izgara div { aspect-ratio: 1; border-radius: 4px; display: grid; place-items: center; font-weight: 900; font-size: 14px; color: #222; background: #f0e2c0; position: relative; min-width: 0; }
  .kart-izgara div.bos { background: #c62828; opacity: .9; }
  .kart-izgara div.isa::after { content: ''; position: absolute; inset: 8%; border-radius: 50%; background: #e53935cc; animation: damga .3s ease-out; }
  .kart-izgara div.isa { color: #fff; }
  .kart-izgara div.isa span { position: relative; z-index: 1; }
  @keyframes damga { from { transform: scale(2); opacity: 0; } }
  .kart-izgara div.bekle { box-shadow: 0 0 0 2px #ffd34d, 0 0 10px #ffd34d; animation: nabiz .8s infinite; }
  .tombala-alt { display: grid; grid-template-columns: auto auto 1fr; gap: 8px; align-items: center; margin-top: auto; }
  .kart-sec { display: flex; gap: 4px; }
  .kart-sec button { width: 34px; height: 38px; border-radius: 10px; border: 1px solid #ffffff44; background: #0006; color: #fff; font-weight: 900; cursor: pointer; }
  .kart-sec button.secili { background: #ffd34d; color: #231600; }
  .tombala-bilgi { text-align: center; font-weight: 800; color: #fff; min-height: 22px; font-size: 14px; }
  .tombala-bilgi b { color: #ffd34d; }`;

  function kartUret() { // her satırda 5 sayı, her sütunda en az 1
    let satirlar;
    do {
      satirlar = [0, 1, 2].map(() => [...Array(9).keys()].sort(() => Math.random() - .5).slice(0, 5));
    } while ([...Array(9).keys()].some(c => !satirlar.some(r => r.includes(c))));
    const izgara = [0, 1, 2].map(() => Array(9).fill(0));
    for (let c = 0; c < 9; c++) {
      const r = [0, 1, 2].filter(i => satirlar[i].includes(c));
      const lo = c === 0 ? 1 : c * 10, hi = c === 8 ? 90 : c * 10 + 9;
      const havuz = []; for (let n = lo; n <= hi; n++) havuz.push(n);
      const sec = havuz.sort(() => Math.random() - .5).slice(0, r.length).sort((a, b) => a - b);
      r.forEach((ri, k) => izgara[ri][c] = sec[k]);
    }
    return { izgara, satirSay: [5, 5, 5], isaret: new Set() };
  }
  const tamSatir = k => k.satirSay.filter(x => x === 0).length;
  function isaretle(k, n) {
    for (let r = 0; r < 3; r++) { const c = k.izgara[r].indexOf(n); if (c >= 0) { k.isaret.add(n); k.satirSay[r]--; return true; } }
    return false;
  }

  function yeniOyun() {
    kartlar = Array.from({ length: kartSayisi }, kartUret);
    rakipler = Array.from({ length: TOPLAM_KART - kartSayisi }, () => ({ ...kartUret(), sahip: rasgele(ISIMLER) }));
    torba = [...Array(90).keys()].map(i => i + 1).sort(() => Math.random() - .5);
    cekilen = []; odulDurum = {}; durum = 'hazir';
  }

  function ciz() {
    const fiyat = BAHISLER[D.bahisNo];
    kok.innerHTML = `<div class="kabuk tombala">
      <header>
        <button class="ikon-btn" data-geri aria-label="Salon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg></button>
        <h1>🎱 TOMBALA</h1>
        <button class="ikon-btn" data-nasil aria-label="Nasıl oynanır">?</button>
      </header>
      <div class="akis"><span></span></div>
      <div class="bakiye-kutu"><div><div class="etiket">BAKİYE</div><div class="bakiye-deger">0 ₺</div></div><button class="yukle">+1.000 ₺ YÜKLE</button></div>
      <div class="torba-alan"><div class="top-buyuk" id="topBuyuk">🎱</div><div><div class="etiket">ÇEKİLEN · <span id="cekSay">0</span>/90 · salonda ${TOPLAM_KART} kart</div><div class="son-toplar" id="sonToplar"></div></div></div>
      <div class="odul-tablo" id="odulTablo"></div>
      <div class="tombala-bilgi" id="tBilgi"></div>
      <div id="kartlar" style="display:flex;flex-direction:column;gap:8px"></div>
      <div class="tombala-alt">
        <div class="kart-sec">${[1, 2, 3].map(n => `<button data-kart="${n}" class="${n === kartSayisi ? 'secili' : ''}">${n}</button>`).join('')}</div>
        <div class="bahis-satir" style="justify-content:center"><button class="kucuk" data-eksi>−</button><div id="tFiyat" style="min-width:52px;text-align:center;font-weight:900"></div><button class="kucuk" data-arti>+</button></div>
        <button class="btn-ana" data-basla></button>
      </div>
    </div>`;
    kartlariCiz(); odulCiz(); guncelle(); arayuz();
    bilgi(`Kart sayısını ve fiyatını seç, <b>BAŞLA</b>! (kart başı ${tl(fiyat)})`);
  }
  function kartlariCiz() {
    kok.querySelector('#kartlar').innerHTML = kartlar.map((k, i) => `<div class="kart"><div class="kart-ust"><span>KART ${i + 1}</span><span id="ks${i}"></span></div><div class="kart-izgara">${
      k.izgara.map((satir, r) => satir.map(n => n ? `<div data-n="${n}" data-k="${i}" data-r="${r}" class="${k.isaret.has(n) ? 'isa' : ''}"><span>${n}</span></div>` : '<div class="bos"></div>').join('')).join('')}</div></div>`).join('');
    kartDurum();
  }
  function kartDurum() {
    kartlar.forEach((k, i) => {
      const e = kok.querySelector('#ks' + i); if (!e) return;
      const kalan = Math.min(...k.satirSay);
      e.textContent = k.satirSay.every(x => x === 0) ? 'TOMBALA!' : tamSatir(k) ? `${tamSatir(k)} çinko · tombalaya ${k.satirSay.reduce((a, b) => a + b, 0)}` : `çinkoya ${kalan}`;
      // bir eksik kalan satırın son sayısı parlasın
      kok.querySelectorAll(`[data-k="${i}"]`).forEach(c => c.classList.toggle('bekle', !k.isaret.has(+c.dataset.n) && k.satirSay[+c.dataset.r] === 1));
    });
  }
  function odulCiz() {
    const fiyat = BAHISLER[D.bahisNo];
    kok.querySelector('#odulTablo').innerHTML = Object.keys(ODUL).map(o => {
      const d = odulDurum[o];
      return `<div class="${d ? (d.ben ? 'benim alindi' : 'alindi') : ''}">${ODUL_AD[o]}<b>${tl(ODUL[o] * fiyat)}</b><small>${d ? (d.ben ? '🎉 SENİN!' : d.kim) : 'bekliyor'}</small></div>`;
    }).join('');
  }
  function guncelle() {
    const fiyat = BAHISLER[D.bahisNo];
    kok.querySelector('#tFiyat').textContent = tl(fiyat);
    const b = kok.querySelector('[data-basla]');
    b.innerHTML = durum === 'oyun' ? (hiz === 1 ? 'HIZLANDIR ⏩' : 'YAVAŞLAT ▶') : durum === 'bitti' ? 'YENİ OYUN ▶' : `BAŞLA 🎱<small style="display:block;font-size:12px">${kartSayisi} kart · ${tl(kartSayisi * fiyat)}</small>`;
    kok.querySelectorAll('[data-kart],[data-eksi],[data-arti]').forEach(x => x.disabled = durum === 'oyun');
  }
  const bilgi = h => { const e = kok.querySelector('#tBilgi'); if (e) e.innerHTML = h; };
  function seslen(n) {
    if (!konus || D.sessiz || !('speechSynthesis' in window)) return;
    try { const u = new SpeechSynthesisUtterance(okunus(n)); u.lang = 'tr-TR'; u.rate = 1.05 * hiz; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch {}
  }

  function basla() {
    if (durum === 'oyun') { hiz = hiz === 1 ? 2.2 : 1; guncelle(); return; }
    if (durum === 'bitti') { yeniOyun(); ciz(); return; }
    const t = kartSayisi * BAHISLER[D.bahisNo];
    if (t > D.bakiye) { toast('Bakiye yetersiz — yükle butonuna bas'); titret(60); return; }
    D.bakiye -= t; D.donus++; D.ikramiye += t * .01; kaydet(); arayuz();
    if (!kartlar.length || cekilen.length) yeniOyun();
    durum = 'oyun'; kartlariCiz(); odulCiz(); guncelle();
    bilgi('🎱 Torba karıştırılıyor…'); gurultu(1, { ses: .2, frek: 500 });
    setTimeout(cek, 1300);
  }

  function cek() {
    if (durum !== 'oyun' || !kok.isConnected) return;
    const n = torba.pop(); cekilen.push(n);
    const top = kok.querySelector('#topBuyuk'); top.textContent = n; top.classList.remove('yeni'); void top.offsetWidth; top.classList.add('yeni');
    kok.querySelector('#cekSay').textContent = cekilen.length;
    kok.querySelector('#sonToplar').innerHTML = cekilen.slice(-8).reverse().map(x => `<span>${x}</span>`).join('');
    ton(660, .08, { tip: 'triangle', ses: .1 }); gurultu(.12, { ses: .12, frek: 1400 });
    seslen(n);
    let benimVar = false;
    kartlar.forEach(k => { if (isaretle(k, n)) benimVar = true; });
    rakipler.forEach(k => isaretle(k, n));
    if (benimVar) {
      kok.querySelectorAll(`[data-n="${n}"]`).forEach(c => c.classList.add('isa'));
      SES.pop(); titret(15);
    }
    kartDurum();
    // ödül kontrolü (sırayla: aynı çekilişte birden çok ödül olabilir)
    const sonuc = [];
    for (const [o, gerek] of [['c1', 1], ['c2', 2], ['tombala', 3]]) {
      if (odulDurum[o]) continue;
      const ben = kartlar.filter(k => tamSatir(k) >= gerek).length, onlar = rakipler.filter(k => tamSatir(k) >= gerek);
      if (!ben && !onlar.length) break; // önceki ödül alınmadan sonrakine bakılmaz
      const pay = ODUL[o] * BAHISLER[D.bahisNo] / (ben + onlar.length) * ben;
      odulDurum[o] = { ben: ben > 0, kim: onlar.length ? `${onlar[0].sahip}${onlar.length > 1 ? ` +${onlar.length - 1}` : ''}` : '', pay };
      sonuc.push(o);
    }
    if (sonuc.length) return odulAnons(sonuc);
    const yakin = kartlar.some(k => k.satirSay.some(x => x === 1));
    bilgi(yakin ? `🔥 <b>${odulDurum.c1 ? (odulDurum.c2 ? 'Tombalaya' : '2. çinkoya') : 'Çinkoya'} 1 sayı kaldı!</b>` : benimVar ? `<b>${n}</b> sende var! ✅` : `Çekilen: <b>${n}</b>`);
    zam = setTimeout(cek, (yakin ? 1700 : 1350) / hiz);
  }

  async function odulAnons(liste) {
    for (const o of liste) {
      const d = odulDurum[o];
      odulCiz();
      if (d.ben) {
        D.bakiye += d.pay; D.toplamKazanc += d.pay; D.enBuyuk = Math.max(D.enBuyuk, d.pay); kaydet(); arayuz(); bakiyeYanip();
        akisYaz(`🎱 SEN · ${ODUL_AD[o]} · <b>${tl(d.pay)}</b>`, true);
        bilgi(`🎉 <b>${ODUL_AD[o]}!</b> ${tl(d.pay)} kazandın!${d.kim ? ` (${d.kim} ile paylaşıldı)` : ''}`);
        if (o === 'tombala') { SES.buyuk(); await buyukGoster('TOMBALA!', d.pay, 'Kartın doldu!'); }
        else { SES.kazan(5); SES.sikkeler(12); SES.zil(8); fiskiye(900); fisekGosterisi(3); flas(); buyuYap(); coskulu(2500); await bekle(2200); }
      } else {
        bilgi(`📣 <b>${d.kim}</b> ${ODUL_AD[o]} yaptı! ${o === 'tombala' ? '' : 'Oyun devam ediyor…'}`);
        akisYaz(`🎱 ${d.kim} · ${ODUL_AD[o]} · <b>${tl(ODUL[o] * BAHISLER[D.bahisNo])}</b>`);
        uzakMakine(o === 'tombala'); await bekle(1800);
      }
    }
    if (odulDurum.tombala) {
      durum = 'bitti'; guncelle();
      const toplamPay = Object.values(odulDurum).reduce((a, d) => a + (d.ben ? d.pay : 0), 0);
      const yakin = kartlar.map(k => k.satirSay.reduce((a, b) => a + b, 0)).sort((a, b) => a - b)[0];
      bilgi(toplamPay ? `Oyun bitti — toplam kazancın <b>${tl(toplamPay)}</b> 🎉` : `Oyun bitti. ${yakin <= 2 ? `😱 Tombalaya sadece <b>${yakin}</b> sayın kalmıştı!` : 'Bir sonraki oyun senin!'}`);
      return;
    }
    zam = setTimeout(cek, 1200 / hiz);
  }

  function tiklama(e) {
    const h = e.target.closest('button'); if (!h || !kok.contains(h)) return;
    sesBaslat();
    if (h.dataset.geri !== undefined) { SES.tik(); masaKapat(); }
    else if (h.dataset.nasil !== undefined) { SES.tik(); ogreticiAc('TOMBALA', MASA.tombala.ogretici()); }
    else if (h.dataset.kart) { SES.tik(); kartSayisi = +h.dataset.kart; yeniOyun(); ciz(); }
    else if (h.dataset.eksi !== undefined) { SES.tik(); D.bahisNo = Math.max(0, D.bahisNo - 1); kaydet(); guncelle(); odulCiz(); }
    else if (h.dataset.arti !== undefined) { SES.tik(); D.bahisNo = Math.min(BAHISLER.length - 1, D.bahisNo + 1); kaydet(); guncelle(); odulCiz(); }
    else if (h.dataset.basla !== undefined) basla();
  }

  window.MASA = window.MASA || {};
  window.MASA.tombala = {
    ad: 'Tombala', simge: '🎱', slogan: '90 top, çinko çinko kazan, sayılar sesli okunur', vitrin: '🎱🎟️🔔', rozet: '🎉 SALON DOLU',
    arka: 'radial-gradient(120% 90% at 50% 0%, #a3263a, #4a0c18 60%, #160307)',
    ac(el) {
      kok = el; el.className = 'acik';
      if (!document.getElementById('tombalaCss')) document.head.insertAdjacentHTML('beforeend', `<style id="tombalaCss">${css}</style>`);
      hiz = 1; yeniOyun(); ciz();
      el.addEventListener('click', tiklama);
      Muzik.ozel = MUZIK; Muzik.yeniden();
    },
    kapat() { clearTimeout(zam); durum = 'hazir'; try { speechSynthesis.cancel(); } catch {} kok.removeEventListener('click', tiklama); },
    mesgul: () => false,
    ogretici() {
      const f = BAHISLER[D.bahisNo];
      return [
        { baslik: 'Kartını al!', gorsel: `<div class="kart" style="width:300px"><div class="kart-izgara">${[3, 0, 25, 0, 41, 0, 63, 0, 88, 0, 14, 0, 37, 0, 55, 0, 79, 0, 8, 0, 29, 0, 46, 0, 0, 72, 90].map(n => `<div class="${n ? '' : 'bos'}">${n || ''}</div>`).join('')}</div></div>`,
          metin: `Her kartta 3 satır, <b>15 sayı</b> var. 1, 2 ya da 3 kart alabilirsin. Torbadan 1–90 arası toplar çekilir, sayın gelince <b>kendiliğinden işaretlenir</b>.` },
        { baslik: 'Çinko nedir?', gorsel: `<div style="font-size:64px">✅✅✅✅✅</div>`,
          metin: `Bir satırdaki <b>5 sayının hepsi</b> çıkarsa <b>1. ÇİNKO</b> (${tl(ODUL.c1 * f)}).<br>İki satır dolarsa <b>2. ÇİNKO</b> (${tl(ODUL.c2 * f)}).` },
        { baslik: 'TOMBALA!', gorsel: '<div style="font-size:90px">🎉</div>',
          metin: `Kartındaki <b>15 sayının hepsi</b> çıkınca <b>TOMBALA</b>: ${tl(ODUL.tombala * f)}! Salonda ${TOPLAM_KART} kart var; ödülü <b>ilk tamamlayan</b> alır, aynı anda tamamlayanlar paylaşır.` },
      ];
    },
  };
})();
