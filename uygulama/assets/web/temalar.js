// Oyun temaları: semboller (SVG, viewBox 0 0 100 100), renkler, efekt ve müzik ayarları.
// Matematik her temada aynı (motor.js); W = joker, S = bonus (dağınık), N > A > U > P > C > Y.
(function (dis) {
  // ---------- ortak yardımcılar ----------
  const YAPRAK = 'M50 50C44 42 28 36 30 22 32 12 44 12 50 20 56 12 68 12 70 22 72 36 56 42 50 50Z';
  const yapraklar = (n, dolgu, aci0) => Array.from({ length: n }, (_, i) =>
    `<path d="${YAPRAK}" transform="rotate(${aci0 + i * 360 / n} 50 50)" fill="url(#${dolgu})" stroke="#0a4d1d" stroke-width="2"/>` +
    `<path d="M50 46 L50 24" transform="rotate(${aci0 + i * 360 / n} 50 50)" stroke="#ffffff55" stroke-width="1.6" stroke-linecap="round"/>`).join('');
  const yildizYol = (cx, cy, R, r, n = 5, aci = -90) => {
    let d = '';
    for (let i = 0; i < n * 2; i++) {
      const a = (aci + i * 180 / n) * Math.PI / 180, q = i % 2 ? r : R;
      d += (i ? 'L' : 'M') + (cx + q * Math.cos(a)).toFixed(1) + ' ' + (cy + q * Math.sin(a)).toFixed(1);
    }
    return d + 'Z';
  };
  const serpinti = (liste) => liste.map(([x, y, a, renk]) => `<rect x="${x - 4}" y="${y - 1.5}" width="8" height="3" rx="1.5" fill="${renk}" transform="rotate(${a} ${x} ${y})"/>`).join('');

  // JOKER / BONUS etiketleri (büyük gösterimlerde etiketsiz çizilir)
  const ETIKET = {
    W: (zemin, kenar) => `<rect x="22" y="76" width="56" height="18" rx="9" fill="${zemin}" stroke="${kenar}" stroke-width="2"/>
      <text x="50" y="89.5" text-anchor="middle" font-size="12.5" font-weight="900" fill="#fff" font-family="Arial">JOKER</text>`,
    S: (zemin, kenar) => `<rect x="27" y="76" width="46" height="15" rx="7.5" fill="${zemin}" stroke="${kenar}" stroke-width="2"/>
      <text x="50" y="87.5" text-anchor="middle" font-size="10.5" font-weight="900" fill="#fff" font-family="Arial">BONUS</text>`,
  };

  // tüm temaların degradeleri (sayfaya bir kez eklenir)
  const DEGRADELER = `
    <radialGradient id="gYaprak" cx="45%" cy="35%" r="75%"><stop offset="0" stop-color="#b8ff9c"/><stop offset=".45" stop-color="#3fcf5a"/><stop offset="1" stop-color="#0d7a2c"/></radialGradient>
    <radialGradient id="gYaprak3" cx="45%" cy="35%" r="75%"><stop offset="0" stop-color="#d7f5b0"/><stop offset=".5" stop-color="#7cc46b"/><stop offset="1" stop-color="#3f8a3a"/></radialGradient>
    <radialGradient id="gAltin" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#fffbd6"/><stop offset=".35" stop-color="#ffd84a"/><stop offset=".8" stop-color="#d48d0b"/><stop offset="1" stop-color="#8a5300"/></radialGradient>
    <linearGradient id="gAltinD" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff3a8"/><stop offset=".5" stop-color="#e9a91a"/><stop offset="1" stop-color="#9a6200"/></linearGradient>
    <radialGradient id="gKirmizi" cx="40%" cy="35%" r="75%"><stop offset="0" stop-color="#ff9b8c"/><stop offset=".5" stop-color="#e5262a"/><stop offset="1" stop-color="#8f0b12"/></radialGradient>
    <linearGradient id="gSapka" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0c5a26"/><stop offset=".4" stop-color="#2fb257"/><stop offset="1" stop-color="#094a1f"/></linearGradient>
    <linearGradient id="gKazan" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#111"/><stop offset=".35" stop-color="#4a4a4a"/><stop offset="1" stop-color="#0a0a0a"/></linearGradient>
    <radialGradient id="gParilti"><stop offset="0" stop-color="#fff7b0" stop-opacity=".95"/><stop offset=".6" stop-color="#ffd34d" stop-opacity=".35"/><stop offset="1" stop-color="#ffd34d" stop-opacity="0"/></radialGradient>
    <radialGradient id="gPariltiPembe"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".55" stop-color="#ff7ad9" stop-opacity=".35"/><stop offset="1" stop-color="#ff7ad9" stop-opacity="0"/></radialGradient>
    <radialGradient id="gPariltiMor"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".55" stop-color="#a77bff" stop-opacity=".4"/><stop offset="1" stop-color="#a77bff" stop-opacity="0"/></radialGradient>
    <radialGradient id="gLolipop" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#ffd1f0"/><stop offset=".45" stop-color="#ff3fa4"/><stop offset="1" stop-color="#a0136b"/></radialGradient>
    <linearGradient id="gKekKagit" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffb74d"/><stop offset=".5" stop-color="#ffe0a3"/><stop offset="1" stop-color="#e08a1e"/></linearGradient>
    <radialGradient id="gKrema" cx="40%" cy="30%" r="80%"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#ffb3dd"/><stop offset="1" stop-color="#f06aa8"/></radialGradient>
    <radialGradient id="gYildiz" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#fffbd0"/><stop offset=".45" stop-color="#ffd23f"/><stop offset="1" stop-color="#ff8a00"/></radialGradient>
    <radialGradient id="gMavi" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#d6f4ff"/><stop offset=".5" stop-color="#38b6ff"/><stop offset="1" stop-color="#0a5fb4"/></radialGradient>
    <radialGradient id="gHamur" cx="45%" cy="40%" r="70%"><stop offset="0" stop-color="#ffe2b0"/><stop offset=".6" stop-color="#e4a15a"/><stop offset="1" stop-color="#a8642a"/></radialGradient>
    <radialGradient id="gDonutKrema" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#ffe0f4"/><stop offset=".5" stop-color="#ff86c8"/><stop offset="1" stop-color="#d63b8f"/></radialGradient>
    <radialGradient id="gYesilSeker" cx="40%" cy="35%" r="75%"><stop offset="0" stop-color="#eaffc4"/><stop offset=".45" stop-color="#7be04a"/><stop offset="1" stop-color="#2f8f1c"/></radialGradient>
    <radialGradient id="gMor" cx="40%" cy="30%" r="75%"><stop offset="0" stop-color="#f1d8ff"/><stop offset=".45" stop-color="#b05cff"/><stop offset="1" stop-color="#5a1aa8"/></radialGradient>
    <radialGradient id="gKure" cx="38%" cy="32%" r="70%"><stop offset="0" stop-color="#ffffff"/><stop offset=".3" stop-color="#c9b6ff"/><stop offset=".75" stop-color="#6a3fd6"/><stop offset="1" stop-color="#2a1170"/></radialGradient>
    <linearGradient id="gIksir" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff6b8a"/><stop offset="1" stop-color="#b0002e"/></linearGradient>
    <linearGradient id="gKitap" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8b5cf6"/><stop offset=".55" stop-color="#5b21b6"/><stop offset="1" stop-color="#2e1065"/></linearGradient>
    <linearGradient id="gKristal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f3d9ff"/><stop offset=".45" stop-color="#c06bff"/><stop offset="1" stop-color="#5b1aa8"/></linearGradient>
    <linearGradient id="gKristal2" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9f4ff"/><stop offset=".5" stop-color="#5cc8ff"/><stop offset="1" stop-color="#1b5fb0"/></linearGradient>
    <linearGradient id="gSapkaMavi" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1e2a78"/><stop offset=".45" stop-color="#3f5bd9"/><stop offset="1" stop-color="#141c55"/></linearGradient>
    <radialGradient id="gTas" cx="40%" cy="35%" r="75%"><stop offset="0" stop-color="#d5d9e0"/><stop offset=".6" stop-color="#8a93a3"/><stop offset="1" stop-color="#4b5261"/></radialGradient>`;

  const TEMALAR = {
    // ===================== ŞANSLI YONCA =====================
    yonca: {
      ad: 'Şanslı Yonca', slogan: 'Dört yapraklı şans', simge: '🍀',
      yagmurAd: 'YONCA YAĞMURU!', parcacik: 'yonca',
      etiketRenk: { W: ['#b0110f', '#ffd34d'], S: ['#1d5fd1', '#ffd34d'] },
      renk: {
        '--arka': 'radial-gradient(120% 80% at 50% 20%, #1b6b37 0%, #0c3b1d 45%, #04170b 100%)',
        '--koyu': '#06210f', '--soluk': '#9cc7a5', '--vurgu': '#7dff9a',
        '--cerceve': 'linear-gradient(180deg, #ffe58a, #b97a0c 40%, #ffd34d 60%, #8a5a00)',
        '--makara': 'linear-gradient(180deg, #e9f7df 0%, #fbfff5 50%, #e9f7df 100%)',
        '--dugme': 'radial-gradient(circle at 50% 35%, #8dff9f, #22b04e 45%, #0d6a2c 80%)', '--dugme-golge': '#063d18',
        '--desen': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 100 100'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='${YAPRAK}'/%3E%3Cpath transform='rotate(120 50 50)' d='${YAPRAK}'/%3E%3Cpath transform='rotate(240 50 50)' d='${YAPRAK}'/%3E%3C/g%3E%3C/svg%3E")`,
      },
      sembol: {
        W: { ad: 'Dört Yapraklı Yonca', c: `<circle cx="50" cy="50" r="46" fill="url(#gParilti)"/>
          <path d="M50 52 Q60 70 56 90" stroke="#0a5a22" stroke-width="5" fill="none" stroke-linecap="round"/>
          <g transform="translate(0 -2)">${yapraklar(4, 'gYaprak', 45)}<circle cx="50" cy="50" r="4" fill="#0d6a2a"/></g>` },
        S: { ad: 'Altın Kazanı', c: `<path d="M14 54 A36 36 0 0 1 86 54" stroke="#e53935" stroke-width="5" fill="none"/>
          <path d="M20 54 A30 30 0 0 1 80 54" stroke="#ffb300" stroke-width="5" fill="none"/>
          <path d="M26 54 A24 24 0 0 1 74 54" stroke="#43a047" stroke-width="5" fill="none"/>
          <path d="M32 54 A18 18 0 0 1 68 54" stroke="#1e88e5" stroke-width="5" fill="none"/>
          <circle cx="38" cy="50" r="9" fill="url(#gAltin)" stroke="#8a5300"/><circle cx="62" cy="50" r="9" fill="url(#gAltin)" stroke="#8a5300"/>
          <circle cx="50" cy="44" r="10" fill="url(#gAltin)" stroke="#8a5300"/><circle cx="30" cy="57" r="8" fill="url(#gAltin)" stroke="#8a5300"/><circle cx="70" cy="57" r="8" fill="url(#gAltin)" stroke="#8a5300"/>
          <path d="M20 58 H80 C82 74 72 88 50 88 C28 88 18 74 20 58Z" fill="url(#gKazan)" stroke="#000" stroke-width="2"/>
          <rect x="16" y="54" width="68" height="9" rx="4.5" fill="#2b2b2b" stroke="#000" stroke-width="2"/>
          <path d="M26 68 Q50 74 74 68" stroke="#ffffff22" stroke-width="3" fill="none"/>` },
        N: { ad: 'Uğurlu Nal', c: `<path d="M30 20 V50 A20 20 0 0 0 70 50 V20" fill="none" stroke="#5a3a00" stroke-width="20" stroke-linecap="butt"/>
          <path d="M30 20 V50 A20 20 0 0 0 70 50 V20" fill="none" stroke="url(#gAltinD)" stroke-width="15"/>
          <rect x="20" y="14" width="20" height="9" rx="2" fill="url(#gAltinD)" stroke="#5a3a00" stroke-width="2"/>
          <rect x="60" y="14" width="20" height="9" rx="2" fill="url(#gAltinD)" stroke="#5a3a00" stroke-width="2"/>
          ${[[30, 32], [30, 46], [36, 62], [50, 68], [64, 62], [70, 46], [70, 32]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="#5a3a00"/>`).join('')}
          <path d="M26 24 V48" stroke="#fff9" stroke-width="2.5" stroke-linecap="round"/>` },
        A: { ad: 'Altın Sikke', c: `<circle cx="50" cy="50" r="38" fill="#8a5300"/><circle cx="50" cy="48" r="38" fill="url(#gAltin)"/>
          <circle cx="50" cy="48" r="29" fill="none" stroke="#a86a00" stroke-width="3"/>
          <circle cx="50" cy="48" r="31" fill="none" stroke="#fff6" stroke-width="1.2" stroke-dasharray="3 3"/>
          <text x="50" y="62" text-anchor="middle" font-size="38" font-weight="900" fill="#a86a00" font-family="Arial">₺</text>
          <text x="49" y="60" text-anchor="middle" font-size="38" font-weight="900" fill="#fff4b8" font-family="Arial">₺</text>
          <path d="M28 30 A28 28 0 0 1 46 20" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>` },
        U: { ad: 'Uğur Böceği', c: `<path d="M38 26 Q30 12 22 14 M62 26 Q70 12 78 14" stroke="#111" stroke-width="3" fill="none" stroke-linecap="round"/>
          <circle cx="22" cy="14" r="3" fill="#111"/><circle cx="78" cy="14" r="3" fill="#111"/>
          <ellipse cx="50" cy="32" rx="16" ry="12" fill="#151515"/>
          <circle cx="43" cy="29" r="3.4" fill="#fff"/><circle cx="57" cy="29" r="3.4" fill="#fff"/>
          <ellipse cx="50" cy="58" rx="31" ry="32" fill="url(#gKirmizi)" stroke="#5c0408" stroke-width="2"/>
          <path d="M50 28 V90" stroke="#151515" stroke-width="3"/>
          ${[[36, 46, 6], [64, 46, 6], [32, 66, 5.5], [68, 66, 5.5], [42, 80, 4.5], [58, 80, 4.5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#151515"/>`).join('')}
          <ellipse cx="38" cy="38" rx="7" ry="4" fill="#fff8" transform="rotate(-30 38 38)"/>` },
        P: { ad: 'Yeşil Şapka', c: `<ellipse cx="50" cy="76" rx="40" ry="11" fill="#063a17" stroke="#032a10" stroke-width="2"/>
          <path d="M28 76 L32 22 Q50 16 68 22 L72 76 Z" fill="url(#gSapka)" stroke="#063a17" stroke-width="2"/>
          <ellipse cx="50" cy="22" rx="18" ry="5" fill="#2fb257" stroke="#063a17" stroke-width="2"/>
          <path d="M30 58 L70 58 L71.2 70 L28.8 70 Z" fill="#181818"/>
          <rect x="41" y="56" width="18" height="16" rx="2" fill="none" stroke="url(#gAltinD)" stroke-width="4"/>
          <path d="M36 28 L33 66" stroke="#ffffff44" stroke-width="3" stroke-linecap="round"/>
          <g transform="translate(58 30) scale(.22)">${yapraklar(3, 'gYaprak', 0)}</g>` },
        C: { ad: 'Altın Çan', c: `<path d="M50 10 a6 6 0 1 1 0 .1" fill="none" stroke="#8a5300" stroke-width="4"/>
          <path d="M50 18C34 18 28 34 28 52 28 62 22 68 16 74 L84 74 C78 68 72 62 72 52 72 34 66 18 50 18Z" fill="url(#gAltinD)" stroke="#6b4200" stroke-width="2.5"/>
          <rect x="14" y="72" width="72" height="8" rx="4" fill="url(#gAltin)" stroke="#6b4200" stroke-width="2"/>
          <circle cx="50" cy="86" r="7" fill="url(#gAltin)" stroke="#6b4200" stroke-width="2"/>
          <path d="M38 28 Q33 40 34 58" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>` },
        Y: { ad: 'Üç Yapraklı Yonca', c: `<path d="M50 52 Q58 70 54 90" stroke="#3f7a32" stroke-width="5" fill="none" stroke-linecap="round"/>
          <g transform="translate(0 -2)">${yapraklar(3, 'gYaprak3', 0)}<circle cx="50" cy="50" r="3.5" fill="#3f7a32"/></g>` },
      },
      // İrlanda havası, Re majör, hızlı ve oynak
      muzik: {
        bpm: 138, lead: 'square', bas: 'triangle',
        melodi: 'D5 F#5 A5 F#5 D5 F#5 A5 B5 A5 F#5 D5 E5 F#5 E5 D5 - G5 B5 D6 B5 A5 F#5 D5 F#5 E5 F#5 E5 D5 B4 D5 D5 -',
        basl: 'D3 - A3 - D3 - A3 - D3 - A3 - D3 - A3 - G3 - D3 - D3 - A3 - A2 - E3 - D3 - D3 -',
      },
    },

    // ===================== ŞEKER DİYARI =====================
    seker: {
      ad: 'Şeker Diyarı', slogan: 'Tatlı mı tatlı kazançlar', simge: '🍭',
      yagmurAd: 'ŞEKER YAĞMURU!', parcacik: 'seker',
      etiketRenk: { W: ['#d81b8f', '#fff'], S: ['#7b2ff7', '#fff'] },
      renk: {
        '--arka': 'radial-gradient(120% 80% at 50% 15%, #ff8fd2 0%, #b4359f 42%, #3a0b45 100%)',
        '--koyu': '#2a0833', '--soluk': '#f3b9e6', '--vurgu': '#ff8fe0',
        '--cerceve': 'linear-gradient(180deg, #fff 0%, #ff9ad5 25%, #ffd84a 50%, #ff6fb7 75%, #b8278a 100%)',
        '--makara': 'linear-gradient(180deg, #ffe6f4 0%, #fff8fc 50%, #ffe6f4 100%)',
        '--dugme': 'radial-gradient(circle at 50% 35%, #ffc2ea, #ff3fa4 45%, #a0136b 80%)', '--dugme-golge': '#6b0a47',
        '--desen': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='70' height='70' viewBox='0 0 70 70'%3E%3Cg fill='%23ffffff'%3E%3Ccircle cx='14' cy='14' r='7'/%3E%3Ccircle cx='50' cy='42' r='5'/%3E%3Crect x='32' y='8' width='12' height='5' rx='2.5' transform='rotate(35 38 10)'/%3E%3Crect x='8' y='50' width='12' height='5' rx='2.5' transform='rotate(-30 14 52)'/%3E%3C/g%3E%3C/svg%3E")`,
      },
      sembol: {
        W: { ad: 'Gökkuşağı Lolipop', c: `<circle cx="50" cy="48" r="46" fill="url(#gPariltiPembe)"/>
          <rect x="46.5" y="50" width="7" height="42" rx="3.5" fill="#fff" stroke="#d9c3cf" stroke-width="1.5"/>
          <circle cx="50" cy="38" r="29" fill="url(#gLolipop)" stroke="#a0136b" stroke-width="2"/>
          <path d="M47 38 a3 3 0 0 1 6 0 a6 6 0 0 1 -12 0 a9 9 0 0 1 18 0 a12 12 0 0 1 -24 0 a15 15 0 0 1 30 0 a18 18 0 0 1 -36 0 a21 21 0 0 1 42 0" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".92"/>
          <ellipse cx="39" cy="22" rx="8" ry="4" fill="#ffffffaa" transform="rotate(-30 39 22)"/>` },
        S: { ad: 'Sihirli Kek', c: `<path d="M27 54 L33 86 H67 L73 54 Z" fill="url(#gKekKagit)" stroke="#a0500a" stroke-width="2"/>
          <path d="M35 54 L38 86 M43 54 L44.5 86 M50 54 V86 M57 54 L55.5 86 M65 54 L62 86" stroke="#ffffff88" stroke-width="2"/>
          <path d="M22 57 C13 50 20 37 31 41 C29 27 46 22 50 31 C55 21 73 26 69 39 C81 37 88 51 78 57 Z" fill="url(#gKrema)" stroke="#c2185b" stroke-width="2"/>
          ${serpinti([[34, 46, 30, '#3fc1ff'], [46, 40, -20, '#ffd23f'], [60, 45, 60, '#7be04a'], [41, 52, 80, '#b05cff'], [68, 50, -40, '#ff6b6b'], [55, 34, 10, '#3fc1ff']])}
          <circle cx="54" cy="24" r="8" fill="url(#gKirmizi)" stroke="#8f0b12" stroke-width="1.5"/><path d="M56 17 Q60 7 69 7" stroke="#2e7d32" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <circle cx="51" cy="21" r="2.2" fill="#fff9"/>` },
        N: { ad: 'Kalp Şeker', c: `<path d="M50 86 C20 66 9 47 17 32 C25 17 44 19 50 31 C56 19 75 17 83 32 C91 47 80 66 50 86Z" fill="url(#gKirmizi)" stroke="#8f0b12" stroke-width="2.5"/>
          <path d="M28 34 C30 27 37 25 42 28" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".75"/>
          <path d="M50 76 C34 64 26 52 30 42" stroke="#ffffff33" stroke-width="3" fill="none"/>` },
        A: { ad: 'Yıldız Şeker', c: `<path d="${yildizYol(50, 53, 40, 18)}" fill="url(#gYildiz)" stroke="#c25e00" stroke-width="2.5" stroke-linejoin="round"/>
          <path d="${yildizYol(50, 53, 27, 12)}" fill="#ffffff33"/>
          <circle cx="42" cy="47" r="3" fill="#7a3b00"/><circle cx="58" cy="47" r="3" fill="#7a3b00"/><path d="M43 57 Q50 63 57 57" stroke="#7a3b00" stroke-width="2.5" fill="none" stroke-linecap="round"/>` },
        U: { ad: 'Sarma Şeker', c: `<path d="M30 50 L8 32 L14 50 L8 68 Z" fill="url(#gMavi)" stroke="#0a5fb4" stroke-width="2" stroke-linejoin="round"/>
          <path d="M70 50 L92 32 L86 50 L92 68 Z" fill="url(#gMavi)" stroke="#0a5fb4" stroke-width="2" stroke-linejoin="round"/>
          <ellipse cx="50" cy="50" rx="23" ry="19" fill="url(#gMavi)" stroke="#0a5fb4" stroke-width="2"/>
          <path d="M38 34 Q46 50 38 66 M56 32 Q64 50 56 68" stroke="#fff" stroke-width="4.5" fill="none" stroke-linecap="round" opacity=".85"/>` },
        P: { ad: 'Pembe Donut', c: `<path d="M50 15 a35 35 0 1 0 .1 0 Z M50 40 a10 10 0 1 1 -.1 0 Z" fill="url(#gHamur)" fill-rule="evenodd" stroke="#8a4a18" stroke-width="2"/>
          <path d="M50 19 C62 18 74 24 78 34 C84 40 82 52 80 60 C74 70 64 79 50 80 C38 81 26 74 21 62 C17 54 18 42 22 34 C28 24 38 19 50 19Z M50 38 a12 12 0 1 1 -.1 0 Z" fill="url(#gDonutKrema)" fill-rule="evenodd"/>
          ${serpinti([[34, 30, 20, '#fff'], [62, 28, -30, '#ffd23f'], [72, 48, 70, '#3fc1ff'], [30, 56, -60, '#7be04a'], [46, 70, 15, '#fff'], [64, 66, 45, '#b05cff'], [26, 42, 80, '#ffd23f']])}` },
        C: { ad: 'Elma Jelibon', c: `<path d="M28 62 C15 46 27 24 47 30 C57 33 62 25 73 27 C88 31 88 57 73 67 C59 77 39 76 28 62Z" fill="url(#gYesilSeker)" stroke="#2f7a1c" stroke-width="2.5"/>
          <ellipse cx="40" cy="40" rx="9" ry="4.5" fill="#ffffffaa" transform="rotate(-20 40 40)"/>
          ${[[52, 50], [62, 58], [44, 60], [68, 42], [36, 52]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6" fill="#ffffffcc"/>`).join('')}` },
        Y: { ad: 'Üzüm Damla', c: `<path d="M22 78 C22 42 38 26 50 26 C62 26 78 42 78 78 Q50 86 22 78 Z" fill="url(#gMor)" stroke="#4a1590" stroke-width="2.5"/>
          ${[[38, 44], [52, 38], [62, 50], [44, 58], [58, 66], [34, 66], [50, 50], [68, 66]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="#ffffffcc"/>`).join('')}
          <path d="M34 40 Q38 32 46 30" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>` },
      },
      // zıplayan Do majör, hızlı
      muzik: {
        bpm: 150, lead: 'square', bas: 'square',
        melodi: 'C5 E5 G5 E5 C6 G5 E5 G5 A5 G5 E5 C5 D5 E5 C5 - F5 A5 C6 A5 G5 E5 C5 E5 D5 E5 F5 D5 C5 - C5 -',
        basl: 'C3 G3 C3 G3 C3 G3 C3 G3 A2 E3 A2 E3 G2 D3 G2 D3 F2 C3 F2 C3 C3 G3 C3 G3 G2 D3 G2 D3 C3 - C3 -',
      },
    },

    // ===================== BÜYÜCÜ KULESİ =====================
    buyucu: {
      ad: 'Büyücü Kulesi', slogan: 'Gizemli büyüler, sihirli ödüller', simge: '🔮',
      yagmurAd: 'BÜYÜ FIRTINASI!', parcacik: 'yildiz',
      etiketRenk: { W: ['#5b21b6', '#ffd34d'], S: ['#0e7490', '#ffd34d'] },
      renk: {
        '--arka': 'radial-gradient(120% 80% at 50% 15%, #4b2a9a 0%, #1c1046 45%, #06031a 100%)',
        '--koyu': '#0b0626', '--soluk': '#b9a8f0', '--vurgu': '#b48cff',
        '--cerceve': 'linear-gradient(180deg, #fff6d0, #c9a227 30%, #7c5cff 55%, #ffd34d 75%, #4a2a00)',
        '--makara': 'linear-gradient(180deg, #e6e0ff 0%, #f8f6ff 50%, #e6e0ff 100%)',
        '--dugme': 'radial-gradient(circle at 50% 35%, #d9c4ff, #7c3aed 45%, #3b0d91 80%)', '--dugme-golge': '#24085c',
        '--desen': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='90' height='90' viewBox='0 0 90 90'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='${yildizYol(20, 20, 7, 3)}'/%3E%3Cpath d='${yildizYol(66, 56, 5, 2)}'/%3E%3Ccircle cx='70' cy='14' r='1.5'/%3E%3Ccircle cx='30' cy='70' r='2'/%3E%3Ccircle cx='48' cy='36' r='1.2'/%3E%3C/g%3E%3C/svg%3E")`,
      },
      sembol: {
        W: { ad: 'Sihirli Değnek', c: `<circle cx="62" cy="34" r="40" fill="url(#gPariltiMor)"/>
          <path d="M24 84 L60 42" stroke="#2b170c" stroke-width="10" stroke-linecap="round"/>
          <path d="M24 84 L60 42" stroke="#6b4426" stroke-width="6" stroke-linecap="round"/>
          <path d="M24 84 L31 76" stroke="url(#gAltinD)" stroke-width="10" stroke-linecap="round"/>
          <path d="${yildizYol(64, 34, 20, 9)}" fill="url(#gYildiz)" stroke="#b36b00" stroke-width="2" stroke-linejoin="round"/>
          <path d="${yildizYol(30, 30, 7, 2.5, 4)}" fill="#fff"/><path d="${yildizYol(84, 60, 6, 2, 4)}" fill="#fff"/><path d="${yildizYol(44, 18, 4, 1.5, 4)}" fill="#ffe680"/>` },
        S: { ad: 'Kristal Küre', c: `<path d="M30 76 L38 64 H62 L70 76 Z" fill="url(#gAltinD)" stroke="#6b4200" stroke-width="2"/>
          <circle cx="50" cy="40" r="27" fill="url(#gKure)" stroke="#2a1170" stroke-width="2"/>
          <path d="M34 46 C40 34 52 50 60 38 C64 33 68 36 70 40" stroke="#ffffff88" stroke-width="3" fill="none" stroke-linecap="round"/>
          <path d="M36 52 C44 44 54 58 66 48" stroke="#e0b3ff99" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <ellipse cx="40" cy="27" rx="8" ry="5" fill="#ffffffbb" transform="rotate(-35 40 27)"/>` },
        N: { ad: 'Kırmızı İksir', c: `<rect x="42" y="9" width="16" height="9" rx="2" fill="#8d5a2b" stroke="#4a2c10" stroke-width="1.5"/>
          <rect x="44" y="17" width="12" height="16" fill="#dff1ffcc" stroke="#7fa9c9" stroke-width="2"/>
          <circle cx="50" cy="60" r="27" fill="#e8f5ff66" stroke="#7fa9c9" stroke-width="2.5"/>
          <path d="M23.4 56 A27 27 0 0 0 76.6 56 Z" fill="url(#gIksir)"/>
          <circle cx="44" cy="68" r="3.5" fill="#ffb3c4"/><circle cx="57" cy="62" r="2.5" fill="#ffb3c4"/><circle cx="52" cy="74" r="2" fill="#ffb3c4"/>
          <path d="M33 46 Q36 40 42 38" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".8"/>` },
        A: { ad: 'Büyü Kitabı', c: `<rect x="20" y="20" width="62" height="60" rx="4" fill="url(#gKitap)" stroke="#1e0b4a" stroke-width="2"/>
          <rect x="24" y="76" width="56" height="7" rx="2" fill="#f4e4c1" stroke="#a88b5a" stroke-width="1.5"/>
          <rect x="20" y="20" width="9" height="60" rx="3" fill="#2e1065"/>
          <circle cx="55" cy="49" r="15" fill="none" stroke="url(#gAltinD)" stroke-width="3"/>
          <path d="${yildizYol(55, 49, 11, 4.5)}" fill="url(#gAltinD)"/>
          <path d="M74 22 L80 22 L80 28 M74 78 L80 78 L80 72" stroke="url(#gAltinD)" stroke-width="3" fill="none"/>` },
        U: { ad: 'Mor Kristal', c: `<path d="M50 12 L63 40 L57 86 H43 L37 40 Z" fill="url(#gKristal)" stroke="#4a1590" stroke-width="2" stroke-linejoin="round"/>
          <path d="M28 42 L39 58 L37 86 H27 L20 60 Z" fill="url(#gKristal2)" stroke="#1b4f8f" stroke-width="2" stroke-linejoin="round"/>
          <path d="M72 40 L80 60 L73 86 H63 L61 58 Z" fill="url(#gKristal2)" stroke="#1b4f8f" stroke-width="2" stroke-linejoin="round"/>
          <path d="M50 12 L50 86 M37 40 L50 50 L63 40" stroke="#ffffff77" stroke-width="1.5" fill="none"/>
          <path d="M44 24 L41 38" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".85"/>` },
        P: { ad: 'Büyücü Şapkası', c: `<ellipse cx="50" cy="76" rx="42" ry="10" fill="#141c55" stroke="#0a0f33" stroke-width="2"/>
          <path d="M28 74 C36 54 42 34 46 18 C47 12 52 6 60 8 C55 12 54 18 56 26 C60 42 66 58 72 74 Z" fill="url(#gSapkaMavi)" stroke="#0a0f33" stroke-width="2" stroke-linejoin="round"/>
          <path d="M31 66 H69 L72 74 H28 Z" fill="url(#gAltinD)"/>
          <path d="${yildizYol(50, 46, 6, 2.5)}" fill="#ffe680"/><path d="${yildizYol(60, 30, 4, 1.6)}" fill="#ffe680"/><path d="${yildizYol(40, 58, 3.5, 1.4)}" fill="#fff"/>` },
        C: { ad: 'Altın Hilal', c: `<path d="M60 12 A38 38 0 0 0 60 88 A44 44 0 0 1 60 12Z" fill="url(#gAltin)" stroke="#8a5300" stroke-width="2.5"/>
          <path d="M34 28 Q24 44 30 62" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".7"/>
          <path d="${yildizYol(74, 40, 8, 3)}" fill="#fff6c2"/>` },
        Y: { ad: 'Rün Taşı', c: `<path d="M20 60 C18 34 36 20 52 22 C72 24 84 40 80 62 C76 80 56 86 42 84 C28 82 22 74 20 60Z" fill="url(#gTas)" stroke="#3a3f4a" stroke-width="2.5"/>
          <path d="M45 36 V72 M45 44 L59 36 M45 54 L59 46" stroke="#5ff3ff55" stroke-width="9" stroke-linecap="round" fill="none"/>
          <path d="M45 36 V72 M45 44 L59 36 M45 54 L59 46" stroke="#5ff3ff" stroke-width="4" stroke-linecap="round" fill="none"/>` },
      },
      // gizemli La minör, orta tempo
      muzik: {
        bpm: 116, lead: 'triangle', bas: 'square',
        melodi: 'A4 C5 E5 A5 G5 E5 C5 E5 F4 A4 C5 F5 E5 C5 A4 C5 D5 F5 A5 F5 E5 G#5 B5 G#5 A5 E5 C5 A4 E4 - A4 -',
        basl: 'A2 - - A2 E3 - - - F2 - - F2 C3 - - - D3 - - D3 E3 - - - A2 - E3 - A2 - - -',
      },
    },
  };

  dis.TEMALAR = TEMALAR;
  dis.TEMA_DEGRADE = DEGRADELER;
  dis.TEMA_ETIKET = ETIKET;
  dis.yildizYol = yildizYol;
})(this);
