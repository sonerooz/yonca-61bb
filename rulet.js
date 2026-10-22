// Avrupa Ruleti: tek sıfır (kasa payı %2,7), çark + top animasyonu, sayı/renk/tek-çift/düzine bahisleri
(function () {
  const CARK = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
  const KIRMIZI = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);
  const FISLER = [5, 10, 25, 50, 100];
  const renk = n => n === 0 ? 'yesil' : KIRMIZI.has(n) ? 'kirmizi' : 'siyah';
  // bahis anahtarı → { kazanır mı, toplam dönüş katı }
  const DIS = {
    kirmizi: { ad: 'KIRMIZI', k: n => KIRMIZI.has(n), x: 2 }, siyah: { ad: 'SİYAH', k: n => n > 0 && !KIRMIZI.has(n), x: 2 },
    tek: { ad: 'TEK', k: n => n % 2 === 1, x: 2 }, cift: { ad: 'ÇİFT', k: n => n > 0 && n % 2 === 0, x: 2 },
    dusuk: { ad: '1-18', k: n => n >= 1 && n <= 18, x: 2 }, yuksek: { ad: '19-36', k: n => n >= 19, x: 2 },
    d1: { ad: '1. 12', k: n => n >= 1 && n <= 12, x: 3 }, d2: { ad: '2. 12', k: n => n >= 13 && n <= 24, x: 3 }, d3: { ad: '3. 12', k: n => n >= 25, x: 3 },
  };
  const kazanirMi = (a, n) => a[0] === 'n' ? +a.slice(1) === n : DIS[a].k(n);
  const kat = a => a[0] === 'n' ? 36 : DIS[a].x;
  const MUZIK = { bpm: 112, lead: 'triangle', bas: 'triangle', // salon cazı havası
    melodi: 'E5 - G5 B5 - A5 G5 - E5 - D5 E5 - - - - F5 - A5 C6 - B5 A5 - F5 - E5 F5 - - - -',
    basl: 'C3 G3 E3 G3 C3 G3 E3 G3 A2 E3 C3 E3 A2 E3 C3 E3 D3 A3 F3 A3 D3 A3 F3 A3 G2 D3 B2 D3 G2 D3 B2 D3' };

  let kok, bahis = {}, sonBahis = null, fis = 10, durum = 'bahis', gecmis = [], carkAci = 0, animZ = null;

  const css = `
  .rulet { background: radial-gradient(120% 70% at 50% 0%, #0f6b3a, #063a1f 55%, #021a0d); }
  .rulet header h1 { margin: 0; font-size: 18px; font-weight: 900; color: #ffd34d; letter-spacing: 1px; }
  .cark-kutu { position: relative; width: min(74vw, 300px); aspect-ratio: 1; margin: 0 auto; }
  .cark-kutu svg { position: absolute; inset: 0; width: 100%; height: 100%; }
  #carkSonuc { position: absolute; inset: 37%; border-radius: 50%; display: grid; place-items: center; font-size: 30px; font-weight: 900; color: #fff;
    background: radial-gradient(circle, #6b4a1c, #3a2408); box-shadow: inset 0 0 0 3px #ffd34d; z-index: 2; transition: background .3s; }
  #carkSonuc.kirmizi { background: radial-gradient(circle, #ff5252, #a30000); } #carkSonuc.siyah { background: radial-gradient(circle, #555, #111); } #carkSonuc.yesil { background: radial-gradient(circle, #2ecc71, #0b6b31); }
  #carkSonuc.patla { animation: zipla .4s 4 alternate; }
  .gecmis { display: flex; gap: 4px; justify-content: center; min-height: 26px; }
  .gecmis span { width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center; font-size: 12px; font-weight: 900; color: #fff; }
  .gecmis span:first-child { box-shadow: 0 0 0 2px #ffd34d; }
  .kirmizi-z { background: #d32f2f; } .siyah-z { background: #1b1b1b; border: 1px solid #555; } .yesil-z { background: #1e9e50; }
  .masa { display: grid; grid-template-columns: 30px repeat(12, 1fr); gap: 2px; padding: 4px; border-radius: 12px; background: #0b4d27; border: 2px solid #ffd34d88; }
  .masa button, .dis-bahis button { position: relative; border: 1px solid #ffffff55; border-radius: 4px; color: #fff; font-weight: 900; font-size: 12px; padding: 0; height: 34px; cursor: pointer; }
  .masa .sifir { grid-row: 1 / span 3; height: auto; }
  .masa button.kaz, .dis-bahis button.kaz { box-shadow: 0 0 0 2px #ffd34d, 0 0 14px #ffd34d; z-index: 1; animation: nabiz .5s 6; }
  .fis-rozet { position: absolute; right: -3px; top: -5px; min-width: 20px; height: 20px; padding: 0 3px; border-radius: 10px; background: radial-gradient(circle, #fff 30%, #ffd34d 32%, #c98a12);
    color: #231600; font-size: 9px; line-height: 20px; font-weight: 900; box-shadow: 0 2px 4px #000a; z-index: 2; pointer-events: none; }
  .dis-bahis { display: grid; grid-template-columns: repeat(6, 1fr); gap: 3px; }
  .dis-bahis button { background: #0b4d27; height: 36px; font-size: 12px; }
  .dis-bahis .d { grid-column: span 2; }
  .fisler { display: flex; gap: 6px; justify-content: center; }
  .fisler button { width: 44px; height: 44px; border-radius: 50%; border: 3px dashed #fff; font-weight: 900; font-size: 13px; color: #fff; cursor: pointer; box-shadow: 0 3px 0 #0008; }
  .fisler button.secili { transform: translateY(-5px); box-shadow: 0 0 0 3px #ffd34d, 0 0 14px #ffd34d; }
  .rulet-alt { display: grid; grid-template-columns: 1fr 1.6fr; gap: 8px; margin-top: auto; }
  .rulet-bilgi { text-align: center; font-weight: 800; font-size: 14px; color: #fff; min-height: 22px; }
  .rulet-bilgi b { color: #ffd34d; }`;
  const FIS_RENK = ['#7b1fa2', '#1565c0', '#2e7d32', '#e65100', '#212121'];

  function carkSvg() {
    const n = CARK.length, R = 100, r1 = 66, adim = 360 / n;
    const yol = (a0, a1, ri, ro) => {
      const p = (a, rr) => [100 + rr * Math.sin(a * Math.PI / 180), 100 - rr * Math.cos(a * Math.PI / 180)];
      const [x1, y1] = p(a0, ro), [x2, y2] = p(a1, ro), [x3, y3] = p(a1, ri), [x4, y4] = p(a0, ri);
      return `M${x1} ${y1} A${ro} ${ro} 0 0 1 ${x2} ${y2} L${x3} ${y3} A${ri} ${ri} 0 0 0 ${x4} ${y4}Z`;
    };
    const dilim = CARK.map((sayi, i) => {
      const a0 = i * adim - adim / 2, a1 = a0 + adim, rk = renk(sayi);
      const f = rk === 'yesil' ? '#1e9e50' : rk === 'kirmizi' ? '#c62828' : '#151515';
      return `<path d="${yol(a0, a1, r1, 92)}" fill="${f}" stroke="#d4af37" stroke-width=".6"/>
        <text x="100" y="17.5" text-anchor="middle" font-size="8.5" font-weight="900" fill="#fff" font-family="Arial" transform="rotate(${i * adim} 100 100)">${sayi}</text>`;
    }).join('');
    return `<svg viewBox="0 0 200 200">
      <defs><radialGradient id="rAhsap" cx="50%" cy="50%" r="50%"><stop offset=".8" stop-color="#5a3510"/><stop offset=".93" stop-color="#8a5a24"/><stop offset="1" stop-color="#3a2008"/></radialGradient>
      <radialGradient id="rIc" cx="45%" cy="40%" r="60%"><stop offset="0" stop-color="#e2b04a"/><stop offset="1" stop-color="#7a4f10"/></radialGradient></defs>
      <circle cx="100" cy="100" r="100" fill="url(#rAhsap)"/>
      <g id="carkDon">${dilim}<circle cx="100" cy="100" r="66" fill="url(#rIc)" stroke="#d4af37" stroke-width="1.5"/>
        ${Array.from({ length: 8 }, (_, i) => `<rect x="98" y="38" width="4" height="62" rx="2" fill="#d4af37" transform="rotate(${i * 45} 100 100)"/>`).join('')}</g>
      <circle id="top" cx="100" cy="4" r="4.2" fill="#fff" stroke="#999" stroke-width=".6"/>
    </svg>`;
  }

  function ciz() {
    kok.innerHTML = `<div class="kabuk rulet">
      <header>
        <button class="ikon-btn" data-geri aria-label="Salon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg></button>
        <h1>🔴 AVRUPA RULETİ</h1>
        <button class="ikon-btn" data-nasil aria-label="Nasıl oynanır">?</button>
      </header>
      <div class="akis"><span></span></div>
      <div class="bakiye-kutu"><div><div class="etiket">BAKİYE</div><div class="bakiye-deger">0 ₺</div></div><button class="yukle">+1.000 ₺ YÜKLE</button></div>
      <div class="cark-kutu">${carkSvg()}<div id="carkSonuc">?</div></div>
      <div class="gecmis" id="gecmis"></div>
      <div class="rulet-bilgi" id="rBilgi">Fişini seç, masaya koy, ÇEVİR!</div>
      <div class="masa" id="masa">
        <button class="sifir yesil-z" data-b="n0">0</button>
        ${[3, 2, 1].map(sat => Array.from({ length: 12 }, (_, s) => { const n = s * 3 + sat; return `<button class="${renk(n)}-z" data-b="n${n}">${n}</button>`; }).join('')).join('')}
      </div>
      <div class="dis-bahis">
        <button class="d" data-b="d1">1. 12</button><button class="d" data-b="d2">2. 12</button><button class="d" data-b="d3">3. 12</button>
        <button data-b="dusuk">1-18</button><button data-b="cift">ÇİFT</button><button class="kirmizi-z" data-b="kirmizi">♦</button>
        <button class="siyah-z" data-b="siyah">♦</button><button data-b="tek">TEK</button><button data-b="yuksek">19-36</button>
      </div>
      <div class="fisler">${FISLER.map((f, i) => `<button data-fis="${f}" style="background:${FIS_RENK[i]}" class="${f === fis ? 'secili' : ''}">${f}</button>`).join('')}</div>
      <div class="rulet-alt"><button class="btn-ikincil" data-temizle>TEMİZLE</button><button class="btn-ana" data-cevir>ÇEVİR 🔴</button></div>
    </div>`;
    const top = kok.querySelector('#top'); top.style.transformOrigin = '100px 100px';
    kok.querySelector('#carkDon').style.transformOrigin = '100px 100px';
    kok.querySelector('#carkDon').style.transform = `rotate(${carkAci}deg)`;
    rozetler(); gecmisCiz(); guncelle(); arayuz();
  }
  const toplam = () => Object.values(bahis).reduce((a, b) => a + b, 0);
  function rozetler() {
    kok.querySelectorAll('[data-b]').forEach(b => {
      b.querySelector('.fis-rozet')?.remove();
      const v = bahis[b.dataset.b];
      if (v) b.insertAdjacentHTML('beforeend', `<span class="fis-rozet">${v >= 1000 ? Math.round(v / 100) / 10 + 'B' : v}</span>`);
    });
  }
  function gecmisCiz() { kok.querySelector('#gecmis').innerHTML = gecmis.slice(0, 12).map(n => `<span class="${renk(n)}-z">${n}</span>`).join(''); }
  function guncelle() {
    const b = kok.querySelector('[data-cevir]'), t = toplam();
    b.disabled = durum === 'donuyor' || !t;
    b.textContent = t ? `ÇEVİR 🔴 (${tl(t)})` : 'ÇEVİR 🔴';
    kok.querySelector('[data-temizle]').textContent = !t && sonBahis ? 'TEKRARLA' : 'TEMİZLE';
  }
  const bilgi = h => { const e = kok.querySelector('#rBilgi'); if (e) e.innerHTML = h; };
  function koy(a) {
    if (durum !== 'bahis') return;
    if (toplam() + fis > D.bakiye) { toast('Bakiye yetersiz — yükle butonuna bas'); titret(60); return; }
    kok.querySelectorAll('.kaz').forEach(e => e.classList.remove('kaz'));
    bahis[a] = (bahis[a] || 0) + fis; SES.sikke(); titret(8);
    rozetler(); guncelle();
    const ad = a[0] === 'n' ? `${a.slice(1)} numara` : DIS[a].ad === '♦' ? a : DIS[a].ad;
    bilgi(`<b>${ad}</b>: ${tl(bahis[a])} · kazanırsa <b>${tl(bahis[a] * kat(a))}</b> (${kat(a)} kat)`);
  }

  async function cevir() {
    const t = toplam();
    if (!t || durum !== 'bahis') return;
    if (t > D.bakiye) { toast('Bakiye yetersiz'); return; }
    D.bakiye -= t; D.donus++; D.ikramiye += t * .01; kaydet(); arayuz();
    sonBahis = { ...bahis }; durum = 'donuyor'; guncelle();
    kok.querySelectorAll('.kaz').forEach(e => e.classList.remove('kaz'));
    const sonucEl = kok.querySelector('#carkSonuc'); sonucEl.className = ''; sonucEl.textContent = '…';
    bilgi(rasgele(['Bahisler kapandı! 🎩', 'Rien ne va plus!', 'Top dönüyor…']));
    const sayi = CARK[Math.floor(Math.random() * CARK.length)]; // her cep eşit olasılıklı
    const idx = CARK.indexOf(sayi), adim = 360 / CARK.length;
    const carkBas = carkAci, carkSon = carkBas + 360 * 3 + Math.random() * 360;
    const topSon = carkSon + idx * adim - 360 * 6; // top ters yönde döner, sonunda cebin üstünde durur
    const topBas = topSon + 360 * 7 + Math.random() * 90;
    const sure = 6200, t0 = performance.now();
    const carkEl = kok.querySelector('#carkDon'), topEl = kok.querySelector('#top');
    let sonTik = 0;
    await new Promise(res => {
      const kare = now => {
        const u = Math.min(1, (now - t0) / sure), e = 1 - Math.pow(1 - u, 3), eTop = 1 - Math.pow(1 - u, 2.2);
        carkAci = carkBas + (carkSon - carkBas) * e;
        const topAci = topBas + (topSon - topBas) * eTop;
        const ic = u < .7 ? 0 : Math.min(1, (u - .7) / .22); // top içeri düşer, sekerek
        const r = 96 - ic * 17 + (ic > 0 && ic < 1 ? Math.abs(Math.sin(ic * 9)) * 4 * (1 - ic) : 0);
        carkEl.style.transform = `rotate(${carkAci}deg)`;
        topEl.setAttribute('cy', 100 - r); topEl.style.transform = `rotate(${topAci}deg)`;
        if (now - sonTik > 40 + u * 220) { sonTik = now; ton(2200 + Math.random() * 600, .025, { tip: 'square', ses: .04 + (ic > 0 ? .04 : 0) }); }
        if (u < 1) animZ = requestAnimationFrame(kare); else res();
      };
      animZ = requestAnimationFrame(kare);
    });
    carkAci %= 360;
    // sonuç
    gecmis.unshift(sayi); gecmisCiz();
    sonucEl.textContent = sayi; sonucEl.className = renk(sayi) + ' patla';
    ton(880, .15, { tip: 'triangle', ses: .15 }); ton(1320, .3, { tip: 'triangle', ses: .12, gec: .12 });
    let kaz = 0;
    for (const [a, v] of Object.entries(bahis)) if (kazanirMi(a, sayi)) { kaz += v * kat(a); kok.querySelector(`[data-b="${a}"]`)?.classList.add('kaz'); }
    kok.querySelector(`[data-b="n${sayi}"]`)?.classList.add('kaz');
    const ad = `${sayi} ${sayi === 0 ? 'YEŞİL' : KIRMIZI.has(sayi) ? 'KIRMIZI' : 'SİYAH'}${sayi ? (sayi % 2 ? ' · TEK' : ' · ÇİFT') : ''}`;
    if (kaz > 0) {
      D.bakiye += kaz; D.toplamKazanc += kaz; D.enBuyuk = Math.max(D.enBuyuk, kaz); kaydet(); arayuz(); bakiyeYanip();
      const k = kaz / t;
      bilgi(`🎉 <b>${ad}</b> — kazanç <b>${tl(kaz)}</b>`);
      akisYaz(`🔴 SEN · ${sayi} · <b>${tl(kaz)}</b> kazandın!`, k >= 10);
      if (k >= 10) { SES.buyuk(); await buyukGoster(k >= 30 ? 'TAM İSABET!' : 'BÜYÜK KAZANÇ!', kaz, `${sayi} numara`); }
      else { SES.kazan(5); SES.sikkeler(8); fiskiye(700); flas(); coskulu(2000); if (k >= 3) fisekGosterisi(2); }
    } else {
      const yakin = Object.keys(bahis).some(a => a[0] === 'n' && Math.abs(CARK.indexOf(+a.slice(1)) - idx) === 1);
      bilgi(`<b>${ad}</b> — ${yakin ? '😱 Top senin sayının hemen yanına düştü!' : rasgele(['Bu sefer olmadı.', 'Bir dahakine!', 'Masa ısınıyor 🔥'])}`);
      SES.kazan(2);
    }
    bahis = {}; durum = 'bahis'; rozetler(); guncelle();
  }

  function tiklama(e) {
    const h = e.target.closest('button'); if (!h || !kok.contains(h)) return;
    sesBaslat();
    if (h.dataset.geri !== undefined) { SES.tik(); masaKapat(); }
    else if (h.dataset.nasil !== undefined) { SES.tik(); ogreticiAc('AVRUPA RULETİ', MASA.rulet.ogretici()); }
    else if (h.dataset.b) koy(h.dataset.b);
    else if (h.dataset.fis) { SES.tik(); fis = +h.dataset.fis; kok.querySelectorAll('[data-fis]').forEach(b => b.classList.toggle('secili', +b.dataset.fis === fis)); }
    else if (h.dataset.temizle !== undefined) {
      SES.tik(); if (durum !== 'bahis') return;
      if (!toplam() && sonBahis) {
        const t = Object.values(sonBahis).reduce((a, b) => a + b, 0);
        if (t > D.bakiye) { toast('Bakiye yetersiz'); return; }
        bahis = { ...sonBahis }; bilgi('Son bahislerin tekrar kondu.');
      } else { bahis = {}; bilgi('Masa temizlendi.'); }
      rozetler(); guncelle();
    }
    else if (h.dataset.cevir !== undefined) cevir();
  }

  window.MASA = window.MASA || {};
  window.MASA.rulet = {
    ad: 'Avrupa Ruleti', simge: '🔴', slogan: 'Kırmızı mı siyah mı? Tek sıfırlı klasik', get vitrin() { return `<div style="width:90px;height:90px;position:relative">${carkSvg()}</div><span>🔴</span><span>⚫</span>`; }, rozet: 'VIP',
    arka: 'radial-gradient(120% 90% at 50% 0%, #138a4a, #064020 60%, #021a0d)',
    ac(el) {
      kok = el; el.className = 'acik';
      if (!document.getElementById('ruletCss')) document.head.insertAdjacentHTML('beforeend', `<style id="ruletCss">${css}</style>`);
      bahis = {}; durum = 'bahis'; ciz();
      el.addEventListener('click', tiklama);
      Muzik.ozel = MUZIK; Muzik.yeniden();
    },
    kapat() { cancelAnimationFrame(animZ); kok.removeEventListener('click', tiklama); },
    mesgul: () => durum === 'donuyor',
    ogretici() {
      return [
        { baslik: 'Topun düşeceği yeri tahmin et!', gorsel: '<div style="width:150px;height:150px;position:relative">${carkSvg()}</div>',
          metin: `Çark 0–36 arası 37 cepten oluşur. Önce aşağıdan <b>fişini seç</b>, sonra masada istediğin yere dokun. Sonra <b>ÇEVİR</b>!` },
        { baslik: 'Tek sayı = 36 kat!', gorsel: `<div class="gecmis"><span class="kirmizi-z" style="width:60px;height:60px;font-size:28px">17</span></div>`,
          metin: `Bir sayıya 10 ₺ koydun ve top o sayıya düştü: <b>360 ₺</b>! En zor ama en çok ödeyen bahis.` },
        { baslik: 'Kolay bahisler = 2 kat', gorsel: `<div class="gecmis"><span class="kirmizi-z" style="width:56px;height:56px">♦</span><span class="siyah-z" style="width:56px;height:56px">♦</span></div>`,
          metin: `<b>Kırmızı/Siyah</b>, <b>Tek/Çift</b>, <b>1-18/19-36</b>: neredeyse yarı yarıya, paranı <b>2'ye</b> katlar.<br><b>Düzineler</b> (1. 12, 2. 12, 3. 12): <b>3 kat</b> öder.` },
        { baslik: 'Dikkat: 0 (yeşil)!', gorsel: `<div class="gecmis"><span class="yesil-z" style="width:60px;height:60px;font-size:28px">0</span></div>`,
          metin: `Top 0'a düşerse renk, tek-çift ve düzine bahisleri kaybeder. İstersen 0'a da oynayabilirsin (36 kat). Birden çok yere fiş koyabilirsin. <b>TEKRARLA</b> son bahsini yeniden koyar.` },
      ];
    },
  };
})();
