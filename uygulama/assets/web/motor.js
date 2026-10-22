// Yonca slot motoru: makaralar, ödeme tablosu, kazanç hesabı (tarayıcı + node simülasyonu ortak)
(function (dis) {
  // W: dört yapraklı yonca (joker), S: altın kazanı (dağınık, bedava dönüş)
  const SEMBOLLER = {
    W: { ad: 'Dört Yapraklı Yonca', ode: [0, 0, 0, 25, 120, 600] },
    S: { ad: 'Altın Kazanı', ode: [0, 0, 0, 2, 10, 50] }, // toplam bahis çarpanı
    N: { ad: 'Uğurlu Nal', ode: [0, 0, 0, 15, 60, 250] },
    A: { ad: 'Altın Sikke', ode: [0, 0, 0, 10, 40, 150] },
    U: { ad: 'Uğur Böceği', ode: [0, 0, 0, 8, 25, 100] },
    P: { ad: 'Yeşil Şapka', ode: [0, 0, 0, 6, 18, 75] },
    C: { ad: 'Altın Çan', ode: [0, 0, 0, 5, 12, 50] },
    Y: { ad: 'Üç Yapraklı Yonca', ode: [0, 0, 0, 4, 10, 40] },
  };
  // her makarada sembol adetleri (şerit uzunluğu = toplam)
  const AGIRLIK = [
    { W: 2, S: 2, N: 4, A: 5, U: 6, P: 7, C: 8, Y: 9 },
    { W: 2, S: 2, N: 4, A: 5, U: 6, P: 7, C: 8, Y: 9 },
    { W: 2, S: 2, N: 4, A: 5, U: 6, P: 7, C: 8, Y: 9 },
    { W: 2, S: 2, N: 4, A: 5, U: 6, P: 7, C: 8, Y: 9 },
    { W: 2, S: 2, N: 4, A: 5, U: 6, P: 7, C: 8, Y: 9 },
  ];
  // 10 ödeme çizgisi: her makarada satır (0 üst, 1 orta, 2 alt)
  const CIZGILER = [
    [1, 1, 1, 1, 1], [0, 0, 0, 0, 0], [2, 2, 2, 2, 2], [0, 1, 2, 1, 0], [2, 1, 0, 1, 2],
    [0, 0, 1, 2, 2], [2, 2, 1, 0, 0], [1, 0, 0, 0, 1], [1, 2, 2, 2, 1], [1, 0, 1, 2, 1],
  ];
  const BEDAVA_ADET = 10, BEDAVA_CARPAN = 2;

  // sabit tohumla karıştırılmış şeritler (joker/kazan birbirine 2'den yakın düşmesin)
  function seritKur(ag, tohum) {
    let s = tohum;
    const r = () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
    const liste = [];
    for (const k in ag) for (let i = 0; i < ag[k]; i++) liste.push(k);
    for (let deneme = 0; deneme < 500; deneme++) {
      for (let i = liste.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [liste[i], liste[j]] = [liste[j], liste[i]]; }
      let iyi = true;
      for (let i = 0; i < liste.length; i++) {
        const a = liste[i], b = liste[(i + 1) % liste.length], c = liste[(i + 2) % liste.length];
        if ((a === 'S' || a === 'W') && (b === 'S' || b === 'W' || c === 'S' || c === 'W')) { iyi = false; break; }
      }
      if (iyi) break;
    }
    return liste;
  }
  const SERITLER = AGIRLIK.map((ag, i) => seritKur(ag, 7919 * (i + 3)));

  function cevir(rnd = Math.random) {
    const duraklar = SERITLER.map(s => Math.floor(rnd() * s.length));
    const izgara = duraklar.map((d, m) => [0, 1, 2].map(k => SERITLER[m][(d + k) % SERITLER[m].length]));
    return { duraklar, izgara };
  }

  // izgara[makara][satır]; bahis = toplam bahis; dönüş: { kazanc, cizgiler:[{no, adet, sembol, tutar}], dagınık, bedava }
  function hesapla(izgara, bahis, bedavada = false) {
    const cizgiBahis = bahis / CIZGILER.length;
    const carp = bedavada ? BEDAVA_CARPAN : 1;
    const sonuc = { kazanc: 0, cizgiler: [], dagink: 0, dagKazanc: 0, bedava: 0, hucreler: [] };
    CIZGILER.forEach((c, no) => {
      const s = c.map((satir, m) => izgara[m][satir]);
      if (s[0] === 'S') return;
      // joker koşusu
      let w = 0; while (w < 5 && s[w] === 'W') w++;
      const jokerOde = SEMBOLLER.W.ode[w] || 0;
      // ilk joker-olmayan sembol
      const hedef = s.find(x => x !== 'W');
      let adet = 0, sembolOde = 0;
      if (hedef && hedef !== 'S') {
        while (adet < 5 && (s[adet] === hedef || s[adet] === 'W')) adet++;
        sembolOde = SEMBOLLER[hedef].ode[adet] || 0;
      }
      let en = 0, ens = null, ena = 0;
      if (jokerOde >= sembolOde && jokerOde > 0) { en = jokerOde; ens = 'W'; ena = w; }
      else if (sembolOde > 0) { en = sembolOde; ens = hedef; ena = adet; }
      if (en > 0) {
        const tutar = en * cizgiBahis * carp;
        sonuc.kazanc += tutar;
        sonuc.cizgiler.push({ no, adet: ena, sembol: ens, tutar });
        for (let m = 0; m < ena; m++) sonuc.hucreler.push([m, c[m]]);
      }
    });
    const dag = [];
    izgara.forEach((k, m) => k.forEach((x, r) => { if (x === 'S') dag.push([m, r]); }));
    sonuc.dagink = dag.length;
    if (dag.length >= 3) {
      sonuc.dagKazanc = SEMBOLLER.S.ode[Math.min(dag.length, 5)] * bahis * carp;
      sonuc.kazanc += sonuc.dagKazanc;
      sonuc.bedava = BEDAVA_ADET;
      sonuc.hucreler.push(...dag);
    }
    return sonuc;
  }

  const api = { SEMBOLLER, AGIRLIK, CIZGILER, SERITLER, BEDAVA_ADET, BEDAVA_CARPAN, cevir, hesapla };
  if (typeof module !== 'undefined') module.exports = api; else dis.Motor = api;
})(this);
