// Slot motoru: her oyunun kendi kuralları (çizgi / 243 yol / küme-düşme), özellikleri ve ödeme ölçeği.
// Tarayıcı (window.Motor) ve node simülasyonu (module.exports) ortak. Görsel yok; UI "asamalar"ı sırayla oynatır.
(function (dis) {
  const CIZGILER = [
    [1, 1, 1, 1, 1], [0, 0, 0, 0, 0], [2, 2, 2, 2, 2], [0, 1, 2, 1, 0], [2, 1, 0, 1, 2],
    [0, 0, 1, 2, 2], [2, 2, 1, 0, 0], [1, 0, 0, 0, 1], [1, 2, 2, 2, 1], [1, 0, 1, 2, 1],
  ];
  // çizgi ödemeleri (çizgi bahsinin katı) — 3/4/5 eş; S: toplam bahis katı
  const ODE = {
    W: [0, 0, 0, 15, 60, 250], S: [0, 0, 0, 2, 10, 50], N: [0, 0, 0, 10, 35, 120], A: [0, 0, 0, 10, 30, 100],
    U: [0, 0, 0, 6, 18, 60], P: [0, 0, 0, 5, 12, 40], C: [0, 0, 0, 4, 10, 30], Y: [0, 0, 0, 3, 8, 25],
  };
  const AG5 = { W: 2, S: 2, N: 3, A: 4, U: 5, P: 7, C: 9, Y: 11 };
  const KUMBARA_HEDEF = 50, KUMBARA_ODUL = [2, 3, 4, 5, 6, 8, 10];
  const PARA_DEGER = [1, 1, 1, 2, 2, 2, 3, 3, 5, 5, 8, 10, 15, 25]; // kuzu: sikke değerleri (toplam bahis katı)

  // ---------- oyun ayarları ----------
  // olcek: ödeme tablosu çarpanı (simülasyonla ~%96–97 geri ödemeye ayarlanır)
  const AYAR = {
    yonca: { mod: 'cizgi', cizgi: 10, agirlik: AG5, yagmur: .05, carpan: .06, kumbara: true, bedava: { adet: 7, carpan: 2 }, olcek: 1.016 },
    buyucu: { mod: 'cizgi', cizgi: 10, agirlik: AG5, kumbara: true, bedava: { adet: 10, carpan: 1, tur: 'genisleyen', genis: .25 }, olcek: 0.994 },
    ates: { mod: 'cizgi', cizgi: 5, agirlik: { W: 3, S: 3, N: 4, A: 5, U: 6, P: 7, C: 8, Y: 10 }, jokerYok: true, kumar: true, olcek: 3.0 },
    korsan: { mod: 'cizgi', cizgi: 10, agirlik: AG5, yagmur: .06, kumbara: true, bedava: { adet: 6, carpan: 1, tur: 'yapiskan' }, olcek: 0.871 },
    kuzu: { mod: 'cizgi', cizgi: 10, agirlik: { ...AG5, O: 4 }, tutKazan: 5, olcek: 0.848 },
    maya: { mod: 'yollar', agirlik: AG5, dusme: true, zincir: [1, 2, 3, 5], bedava: { adet: 10, carpan: 1, zincir: [3, 6, 9, 15] }, olcek: 0.116 },
    olimpos: { mod: 'kume', sutun: 6, satir: 5, agirlik: { S: 1.3, N: 4, A: 5, U: 6, P: 7, C: 8, Y: 9, X: 8, Z: 9 }, kure: .004, bedava: { adet: 15, esik: 4, bomba: .012, birikim: true }, olcek: 0.451 },
    seker: { mod: 'kume', sutun: 6, satir: 5, agirlik: { S: 1.3, N: 4, A: 5, U: 6, P: 7, C: 8, Y: 9, X: 8, Z: 9 }, bedava: { adet: 10, esik: 4, bomba: .028 }, olcek: 1.137 },
  };
  // küme ödemeleri (toplam bahis katı): 8-9 / 10-11 / 12+
  const KUME_ODE = { N: [10, 25, 50], A: [2.5, 10, 25], U: [2, 5, 15], P: [1.5, 2, 12], C: [1, 1.5, 10], Y: [.8, 1.2, 8], X: [.5, 1, 5], Z: [.4, .9, 4] };
  const BOMBALAR = [2, 2, 2, 3, 3, 4, 5, 5, 6, 8, 10, 12, 15, 20, 25, 50, 100];

  function rngSecici(ag) {
    const k = Object.keys(ag), top = k.reduce((a, x) => a + ag[x], 0);
    return rnd => { let r = rnd() * top; for (const x of k) { r -= ag[x]; if (r <= 0) return x; } return k[k.length - 1]; };
  }
  // sabit tohumlu şerit: özel semboller (S/W/O) birbirine yakın düşmesin
  function seritKur(ag, tohum) {
    let s = tohum;
    const r = () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
    const liste = [];
    for (const k in ag) for (let i = 0; i < Math.round(ag[k]); i++) liste.push(k);
    const ozel = x => x === 'S' || x === 'W';
    for (let d = 0; d < 800; d++) {
      for (let i = liste.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [liste[i], liste[j]] = [liste[j], liste[i]]; }
      if (liste.every((a, i) => !ozel(a) || (!ozel(liste[(i + 1) % liste.length]) && !ozel(liste[(i + 2) % liste.length])))) break;
    }
    return liste;
  }
  const bombaMi = x => typeof x === 'string' && x[0] === 'B';

  function Makine(id) {
    const c = AYAR[id], sutun = c.sutun || 5, satir = c.satir || 3;
    const mk = { id, c, sutun, satir, cizgiler: CIZGILER.slice(0, c.cizgi || 10) };
    mk.seritler = Array.from({ length: sutun }, (_, i) => seritKur(c.agirlik, 7919 * (i + 3) + id.length * 31));
    const sec = rngSecici(c.agirlik);
    const secDolgu = rngSecici(Object.fromEntries(Object.entries(c.agirlik).filter(([k]) => k !== 'S')));
    const bomba = rnd => 'B' + BOMBALAR[Math.floor(rnd() * BOMBALAR.length)];
    mk.rasgele = (rnd = Math.random) => sec(rnd);
    mk.cevir = (rnd = Math.random) => {
      if (c.mod === 'kume') return Array.from({ length: sutun }, () => Array.from({ length: satir }, () => sec(rnd)));
      return mk.seritler.map(s => { const d = Math.floor(rnd() * s.length); return Array.from({ length: satir }, (_, k) => s[(d + k) % s.length]); });
    };
    const ode = (k, n) => ((ODE[k] || [])[n] || 0) * (k === 'S' ? 1 : c.olcek);
    const joker = k => !c.jokerYok && k === 'W';

    // ---- çizgi değerlendirmesi ----
    mk.cizgiHesapla = (iz, bahis, carp = 1) => {
      const cb = bahis / mk.cizgiler.length, r = { kazanc: 0, cizgiler: [], hucreler: [] };
      mk.cizgiler.forEach((cz, no) => {
        const s = cz.map((sat, m) => iz[m][sat]);
        if (s[0] === 'S' || s[0] === 'O') return;
        let w = 0; while (w < 5 && joker(s[w])) w++;
        const jo = joker('W') ? ode('W', w) : 0;
        const h = s.find(x => !joker(x));
        let n = 0, so = 0;
        if (h && h !== 'S' && h !== 'O') { while (n < 5 && (s[n] === h || joker(s[n]))) n++; so = ode(h, n); }
        let en = 0, es = null, ea = 0;
        if (jo >= so && jo > 0) { en = jo; es = 'W'; ea = w; } else if (so > 0) { en = so; es = h; ea = n; }
        if (en > 0) {
          const t = en * cb * carp; r.kazanc += t; r.cizgiler.push({ no, adet: ea, sembol: es, tutar: t });
          for (let m = 0; m < ea; m++) r.hucreler.push([m, cz[m]]);
        }
      });
      return r;
    };
    // ---- 243 yol: soldan ardışık makaralarda sembol (ya da joker) varsa; yollar = adetlerin çarpımı ----
    mk.yolHesapla = (iz, bahis, carp = 1) => {
      const r = { kazanc: 0, yollar: [], hucreler: [] }, birim = bahis / 25;
      for (const k of Object.keys(ODE)) {
        if (k === 'S' || k === 'W') continue;
        let n = 0, yol = 1;
        for (let m = 0; m < sutun; m++) { const say = iz[m].filter(x => x === k || x === 'W').length; if (!say) break; yol *= say; n++; }
        if (n >= 3 && ode(k, n)) {
          const t = ode(k, n) * yol * birim * carp; r.kazanc += t; r.yollar.push({ sembol: k, adet: n, yol, tutar: t });
          for (let m = 0; m < n; m++) iz[m].forEach((x, s) => { if ((x === k || x === 'W') && !r.hucreler.some(h => h[0] === m && h[1] === s)) r.hucreler.push([m, s]); });
        }
      }
      return r;
    };
    // ---- küme: her yerde 8+ aynı sembol ----
    mk.kumeHesapla = (iz, bahis, carp = 1) => {
      const say = {}, r = { kazanc: 0, kumeler: [], hucreler: [] };
      iz.forEach(k => k.forEach(x => say[x] = (say[x] || 0) + 1));
      for (const [k, n] of Object.entries(say)) {
        if (!KUME_ODE[k] || n < 8) continue;
        const t = KUME_ODE[k][n >= 12 ? 2 : n >= 10 ? 1 : 0] * c.olcek * bahis * carp;
        r.kazanc += t; r.kumeler.push({ sembol: k, adet: n, tutar: t });
        iz.forEach((kol, m) => kol.forEach((x, s) => { if (x === k) r.hucreler.push([m, s]); }));
      }
      return r;
    };
    const hesapla = (iz, b, carp) => c.mod === 'kume' ? mk.kumeHesapla(iz, b, carp) : c.mod === 'yollar' ? mk.yolHesapla(iz, b, carp) : mk.cizgiHesapla(iz, b, carp);
    mk.hesapla = hesapla;
    const say = (iz, k) => { const l = []; iz.forEach((kol, m) => kol.forEach((x, s) => { if (x === k) l.push([m, s]); })); return l; };
    // düşme: kazanan hücreler silinir, üsttekiler aşağı kayar, boşluk yeni sembolle dolar
    const dusur = (iz, hucreler, uret) => iz.map((kol, m) => {
      const sil = new Set(hucreler.filter(h => h[0] === m).map(h => h[1]));
      const kalan = kol.filter((_, s) => !sil.has(s));
      return [...Array.from({ length: satir - kalan.length }, uret), ...kalan];
    });

    // ---------- tek dönüş ----------
    // durum (bedava dönüşlerde UI taşır): { bedavada, ozel, yapiskan: ['m,s'] }
    mk.oyna = (bahis, durum = {}, rnd = Math.random) => {
      const B = !!durum.bedavada, bc = B && c.bedava ? c.bedava.carpan || 1 : 1;
      const o = { asamalar: [], kazanc: 0, bedava: 0, ikramiye: false, tutKazan: null, sonuc: null };
      let iz = mk.cevir(rnd);
      if (B && c.bedava?.tur === 'yapiskan') for (const h of durum.yapiskan || []) { const [m, s] = h.split(',').map(Number); iz[m][s] = 'W'; }
      const kureOran = c.mod === 'kume' ? (B ? c.bedava?.bomba : c.kure) || 0 : 0; // çarpan küresi/bomba olasılığı
      const bombaliBedava = kureOran > 0;
      if (bombaliBedava) iz = iz.map(k => k.map(x => x !== 'S' && rnd() < kureOran ? bomba(rnd) : x));
      o.ilk = iz.map(k => k.slice());

      if (c.mod === 'kume' || c.dusme) {
        const zincir = B && c.bedava?.zincir ? c.bedava.zincir : c.zincir || [1];
        const uret = c.mod === 'kume' ? (bombaliBedava ? () => (rnd() < kureOran ? bomba(rnd) : secDolgu(rnd)) : () => secDolgu(rnd)) : () => mk.rasgele(rnd);
        for (let adim = 0; adim < 30; adim++) {
          const carp = zincir[Math.min(adim, zincir.length - 1)] * bc;
          const r = hesapla(iz, bahis, carp);
          if (!r.kazanc) break;
          o.kazanc += r.kazanc;
          const sonra = dusur(iz, r.hucreler, uret);
          o.asamalar.push({ tip: 'patlat', sonuc: r, carp, izgaraSonra: sonra.map(k => k.slice()) });
          iz = sonra;
        }
        if (bombaliBedava && o.kazanc > 0) { // bombalar: o dönüşün toplam kazancını çarpar
          const bombalar = [];
          iz.forEach((kol, m) => kol.forEach((x, s) => { if (bombaMi(x)) bombalar.push([m, s, +x.slice(1)]); }));
          if (bombalar.length) {
            const top = bombalar.reduce((a, b) => a + b[2], 0);
            // olimpos bedava dönüşü: küreler birikir, birikmiş toplam her kazancı çarpar
            const carp = B && c.bedava?.birikim ? (o.yeniBirikim = (durum.birikim || 0) + top) : top;
            o.asamalar.push({ tip: 'bomba', bombalar, carp, onceki: o.kazanc, birikim: !!(B && c.bedava?.birikim) });
            o.kazanc *= carp;
          }
        } else if (B && c.bedava?.birikim && durum.birikim && o.kazanc > 0) { // küre yoksa da birikmiş çarpan uygulanır
          o.asamalar.push({ tip: 'bomba', bombalar: [], carp: durum.birikim, onceki: o.kazanc, birikim: true });
          o.kazanc *= durum.birikim;
        }
      } else {
        let r = hesapla(iz, bahis, bc);
        // yağmur: kazançsız dönüşte birkaç kare jokere döner
        if (c.yagmur && !r.kazanc && say(iz, 'S').length < 3 && rnd() < c.yagmur) {
          const cz = mk.cizgiler[Math.floor(rnd() * mk.cizgiler.length)];
          const hedef = [[0, cz[0]], [1, cz[1]]], ek = Math.floor(rnd() * 2);
          for (let i = 0; i < 20 && hedef.length < 2 + ek; i++) { const m = Math.floor(rnd() * 5), s = Math.floor(rnd() * 3); if (!hedef.some(([a, b]) => a === m && b === s)) hedef.push([m, s]); }
          const deg = hedef.filter(([m, s]) => iz[m][s] !== 'S' && iz[m][s] !== 'O');
          deg.forEach(([m, s]) => iz[m][s] = 'W');
          if (deg.length) o.asamalar.push({ tip: 'yagmur', hucreler: deg });
          r = hesapla(iz, bahis, bc);
        }
        if (r.kazanc) { o.asamalar.push({ tip: 'cizgi', sonuc: r }); o.kazanc += r.kazanc; }
        o.sonuc = r;
        if (r.cizgiler?.some(z => z.sembol === 'W' && z.adet === 5)) o.ikramiye = true;
        // büyücü: bedava dönüşte özel sembol bulunduğu makaraları kaplar, tüm çizgilerde öder
        if (B && c.bedava?.tur === 'genisleyen' && durum.ozel) {
          const mak = []; iz.forEach((kol, m) => { if (kol.includes(durum.ozel)) mak.push(m); });
          const esik = ['N', 'A'].includes(durum.ozel) ? 2 : 3;
          if (mak.length >= esik) {
            const t = (mak.length >= 3 ? ode(durum.ozel, mak.length) : ode(durum.ozel, 3) * .4) * bahis * (c.bedava.genis || 1);
            o.asamalar.push({ tip: 'genislet', sembol: durum.ozel, makaralar: mak, kazanc: t });
            o.kazanc += t;
          }
        }
        if (B && c.bedava?.tur === 'yapiskan') o.yeniYapiskan = say(iz, 'W').map(([m, s]) => m + ',' + s);
      }
      // şans çarpanı
      if (c.carpan && o.kazanc > 0 && rnd() < c.carpan) {
        const x = [2, 2, 2, 3, 3, 5][Math.floor(rnd() * 6)];
        o.asamalar.push({ tip: 'carpan', x, onceki: o.kazanc }); o.kazanc *= x;
      }
      // dağınık (bonus) sembol
      const dag = say(o.ilk, 'S');
      const esikS = c.bedava?.esik || 3;
      if (dag.length >= esikS && c.bedava) {
        const t = (c.mod === 'kume' ? [0, 0, 0, 0, 3, 5, 100][Math.min(dag.length, 6)] : ODE.S[Math.min(dag.length, 5)]) * bahis * bc;
        o.asamalar.push({ tip: 'dagilim', hucreler: dag, kazanc: t }); o.kazanc += t;
        o.bedava = c.bedava.adet;
      } else if (dag.length >= 3 && !c.bedava) { // bedava dönüşü olmayan oyunlarda dağınık sadece öder
        const t = ODE.S[Math.min(dag.length, 5)] * bahis * c.olcek;
        o.asamalar.push({ tip: 'dagilim', hucreler: dag, kazanc: t }); o.kazanc += t;
      }
      // kuzu: 6+ sikke → tut & kazan
      if (c.tutKazan && !B) {
        const p = say(iz, 'O');
        if (p.length >= c.tutKazan) { o.tutKazan = mk.tutKazan(p, bahis, rnd); o.kazanc += o.tutKazan.toplam; }
      }
      o.izgara = iz;
      return o;
    };

    // kuzu: sikkeler kilitlenir, 3 tekrar hakkı; yeni sikke hakkı 3'e döndürür; 15 kare dolarsa BÜYÜK İKRAMİYE
    const paraDeger = rnd => { const r = rnd(); return r < .03 ? { ad: 'MAJOR', x: 50 } : r < .1 ? { ad: 'MINI', x: 15 } : { x: PARA_DEGER[Math.floor(rnd() * PARA_DEGER.length)] }; };
    mk.paraTL = (v, bahis) => v.x * bahis * c.olcek;
    mk.tutKazan = (baslangic, bahis, rnd = Math.random) => {
      const dolu = new Map(baslangic.map(([m, s]) => [m + ',' + s, paraDeger(rnd)]));
      const kareler = [{ yeni: [...dolu.entries()], hak: 3 }];
      let hak = 3;
      while (hak > 0 && dolu.size < sutun * satir) {
        const yeni = [];
        for (let m = 0; m < sutun; m++) for (let s = 0; s < satir; s++) {
          const k = m + ',' + s;
          if (!dolu.has(k) && rnd() < .085) { const v = paraDeger(rnd); dolu.set(k, v); yeni.push([k, v]); }
        }
        hak = yeni.length ? 3 : hak - 1;
        kareler.push({ yeni, hak });
      }
      const tam = dolu.size === sutun * satir;
      const toplam = ([...dolu.values()].reduce((a, v) => a + v.x, 0) + (tam ? 500 : 0)) * bahis * c.olcek;
      return { kareler, toplam, tam };
    };
    return mk;
  }

  const onbellek = {};
  const makine = id => onbellek[id] || (onbellek[id] = Makine(AYAR[id] ? id : 'yonca'));
  const kumbaraOdul = (rnd = Math.random) => KUMBARA_ODUL[Math.floor(rnd() * KUMBARA_ODUL.length)];
  const api = { AYAR, ODE, KUME_ODE, CIZGILER, KUMBARA_HEDEF, KUMBARA_ODUL, makine, kumbaraOdul, bombaMi };
  if (typeof module !== 'undefined') module.exports = api; else dis.Motor = api;
})(this);
