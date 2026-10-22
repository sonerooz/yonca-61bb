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
    <radialGradient id="gTas" cx="40%" cy="35%" r="75%"><stop offset="0" stop-color="#d5d9e0"/><stop offset=".6" stop-color="#8a93a3"/><stop offset="1" stop-color="#4b5261"/></radialGradient>
    <linearGradient id="gYedi" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff8a7a"/><stop offset=".45" stop-color="#ff1a1a"/><stop offset="1" stop-color="#8a0000"/></linearGradient>
    <radialGradient id="gAtes"><stop offset="0" stop-color="#fff3a0" stop-opacity=".95"/><stop offset=".5" stop-color="#ff7a00" stop-opacity=".45"/><stop offset="1" stop-color="#ff2d00" stop-opacity="0"/></radialGradient>
    <linearGradient id="gBar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3a3a"/><stop offset=".5" stop-color="#111"/><stop offset="1" stop-color="#000"/></linearGradient>
    <radialGradient id="gUzum" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#e6b3ff"/><stop offset=".45" stop-color="#8e24aa"/><stop offset="1" stop-color="#3f0b57"/></radialGradient>
    <radialGradient id="gErik" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#b9c4ff"/><stop offset=".45" stop-color="#4b3fd1"/><stop offset="1" stop-color="#1c1366"/></radialGradient>
    <radialGradient id="gLimon" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#fffbd1"/><stop offset=".5" stop-color="#ffe733"/><stop offset="1" stop-color="#c9a400"/></radialGradient>
    <linearGradient id="gAhsap" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c47a3a"/><stop offset=".5" stop-color="#8a4b1c"/><stop offset="1" stop-color="#4f260a"/></linearGradient>
    <linearGradient id="gCelik" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f2f6fa"/><stop offset=".5" stop-color="#9aa6b2"/><stop offset="1" stop-color="#4a5560"/></linearGradient>
    <linearGradient id="gSise" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0b3a1e"/><stop offset=".4" stop-color="#2b8a4e"/><stop offset="1" stop-color="#062513"/></linearGradient>
    <linearGradient id="gDeniz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4fc3ff"/><stop offset="1" stop-color="#0a4f9a"/></linearGradient>
    <radialGradient id="gYun" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#ffffff"/><stop offset=".7" stop-color="#f1ece2"/><stop offset="1" stop-color="#c9bfae"/></radialGradient>
    <linearGradient id="gAhir" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff5a4e"/><stop offset="1" stop-color="#a51b12"/></linearGradient>
    <radialGradient id="gHavuc" cx="40%" cy="30%" r="80%"><stop offset="0" stop-color="#ffc27a"/><stop offset=".5" stop-color="#ff8a1e"/><stop offset="1" stop-color="#c25500"/></radialGradient>
    <radialGradient id="gYesim" cx="40%" cy="35%" r="75%"><stop offset="0" stop-color="#c9ffe6"/><stop offset=".45" stop-color="#25c28a"/><stop offset="1" stop-color="#0b5e40"/></radialGradient>
    <linearGradient id="gTasMaya" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9c9a3"/><stop offset="1" stop-color="#8a7650"/></linearGradient>
    <radialGradient id="gYakut" cx="40%" cy="30%" r="75%"><stop offset="0" stop-color="#ffd0d6"/><stop offset=".45" stop-color="#e0103a"/><stop offset="1" stop-color="#6b0019"/></radialGradient>
    <radialGradient id="gSafir" cx="40%" cy="30%" r="75%"><stop offset="0" stop-color="#d6ecff"/><stop offset=".45" stop-color="#1e7bff"/><stop offset="1" stop-color="#0a2f80"/></radialGradient>`;

  const TEMALAR = {
    // ===================== ŞANSLI YONCA =====================
    yonca: {
      ad: 'Şanslı Yonca', slogan: 'Yonca yağmuru, şans çarpanı, domuz kumbara', simge: '🍀',
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
      ad: 'Şeker Diyarı', slogan: '6×5 · her yerde 8 şeker · patla, düş, bomba!', simge: '🍭',
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
        X: { ad: 'Muz', c: `<path d="M22 30 C20 60 42 84 78 80 C84 79 86 74 80 72 C52 72 34 56 32 30 C32 24 24 22 22 30Z" fill="url(#gLimon)" stroke="#a88400" stroke-width="2.5"/>
          <path d="M22 30 L18 22 L26 20 L30 28Z" fill="#6b4426"/><path d="M30 40 C34 56 48 68 70 74" stroke="#fff9" stroke-width="3" fill="none" stroke-linecap="round"/>` },
        Z: { ad: 'Mavi Sakız', c: `<circle cx="50" cy="52" r="34" fill="url(#gMavi)" stroke="#0a5fb4" stroke-width="2.5"/>
          <ellipse cx="38" cy="38" rx="11" ry="7" fill="#ffffffaa" transform="rotate(-30 38 38)"/>
          ${[[58, 62], [44, 66], [64, 46]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.2" fill="#ffffffaa"/>`).join('')}` },
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
      ad: 'Büyücü Kulesi', slogan: 'Bedava dönüşte makarayı kaplayan sembol', simge: '🔮',
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
    // ===================== ATEŞLİ 7'LER (klasik meyve makinesi) =====================
    ates: {
      ad: "Ateşli 7'ler", slogan: 'Klasik 5 çizgi · kazancını KATLA', simge: '🔥',
      yagmurAd: 'ATEŞ YAĞMURU!', parcacik: 'yildiz',
      etiketRenk: { W: null, S: ['#e08a00', '#fff'] },
      renk: {
        '--arka': 'radial-gradient(120% 80% at 50% 15%, #a3150a 0%, #4a0703 45%, #140100 100%)',
        '--koyu': '#1a0200', '--soluk': '#ffb59e', '--vurgu': '#ff7a00',
        '--cerceve': 'linear-gradient(180deg, #fff6c2, #ffb300 30%, #ff3d00 55%, #ffd34d 75%, #6b1500)',
        '--makara': 'linear-gradient(180deg, #fff1e0 0%, #fffaf3 50%, #fff1e0 100%)',
        '--dugme': 'radial-gradient(circle at 50% 35%, #ffb199, #ff2a00 45%, #8a0f00 80%)', '--dugme-golge': '#5a0a00',
        '--desen': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='70' height='70' viewBox='0 0 70 70'%3E%3Ctext x='10' y='34' font-size='26' font-weight='900' font-family='Arial' fill='%23ffffff'%3E7%3C/text%3E%3Ccircle cx='52' cy='52' r='6' fill='%23ffffff'/%3E%3C/svg%3E")`,
      },
      sembol: {
        W: { ad: 'Parlayan 7', c: `<circle cx="50" cy="48" r="46" fill="url(#gAtes)"/>
          <path d="M30 70 C22 56 30 44 34 36 C36 46 42 46 42 40 C42 30 50 22 56 14 C56 26 66 30 66 42 C70 38 72 34 72 30 C80 42 80 58 70 70 Z" fill="#ff8a00" opacity=".85"/>
          <text x="50" y="76" text-anchor="middle" font-size="76" font-weight="900" font-family="Arial Black, Arial" fill="url(#gYedi)" stroke="#ffd34d" stroke-width="5" paint-order="stroke" stroke-linejoin="round">7</text>
          <path d="M36 20 L44 20" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/>
          <path d="${yildizYol(80, 18, 6, 2, 4)}" fill="#fff"/><path d="${yildizYol(18, 30, 5, 1.8, 4)}" fill="#fff6c2"/>` },
        S: { ad: 'Altın Yıldız', c: `<circle cx="50" cy="44" r="40" fill="url(#gParilti)"/>
          <path d="${yildizYol(50, 44, 36, 15)}" fill="url(#gYildiz)" stroke="#a85a00" stroke-width="2.5" stroke-linejoin="round"/>
          <path d="${yildizYol(50, 44, 22, 9)}" fill="#ffffff44"/>
          <path d="M40 26 L46 22" stroke="#fff" stroke-width="3" stroke-linecap="round"/>` },
        N: { ad: 'Üçlü BAR', c: `${[16, 40, 64].map(y => `<rect x="12" y="${y}" width="76" height="21" rx="5" fill="url(#gBar)" stroke="#ffd34d" stroke-width="2.5"/>
          <text x="50" y="${y + 16.5}" text-anchor="middle" font-size="16" font-weight="900" font-family="Arial Black, Arial" fill="#fff" letter-spacing="2">BAR</text>`).join('')}` },
        A: { ad: 'Karpuz', c: `<path d="M8 38 A42 42 0 0 0 92 38 Z" fill="#2e7d32"/>
          <path d="M13 38 A37 37 0 0 0 87 38 Z" fill="#c5e1a5"/>
          <path d="M17 38 A33 33 0 0 0 83 38 Z" fill="#ff3b4e"/>
          ${[[32, 48], [44, 56], [56, 56], [68, 48], [50, 46], [38, 64], [62, 64]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.2" ry="3.4" fill="#2b1b1b"/>`).join('')}
          <path d="M22 42 Q30 50 40 52" stroke="#fff8" stroke-width="2.5" fill="none" stroke-linecap="round"/>` },
        U: { ad: 'Üzüm', c: `<path d="M52 18 Q54 10 60 8" stroke="#6b4426" stroke-width="3.5" fill="none" stroke-linecap="round"/>
          <path d="M54 16 C64 8 78 12 80 20 C70 22 62 22 54 16Z" fill="#5bb33a" stroke="#2f6d1c" stroke-width="1.5"/>
          ${[[36, 28], [50, 26], [64, 28], [30, 42], [44, 40], [58, 40], [70, 42], [38, 54], [52, 54], [64, 54], [44, 67], [58, 67], [51, 80]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="url(#gUzum)" stroke="#3f0b57" stroke-width="1.2"/>`).join('')}` },
        P: { ad: 'Erik', c: `<path d="M50 22 Q50 12 56 8" stroke="#6b4426" stroke-width="3.5" fill="none" stroke-linecap="round"/>
          <path d="M52 16 C60 6 76 8 78 16 C68 20 60 20 52 16Z" fill="#5bb33a" stroke="#2f6d1c" stroke-width="1.5"/>
          <path d="M50 22 C74 18 86 40 82 58 C78 78 62 88 50 88 C34 88 18 76 18 56 C18 36 30 22 50 22Z" fill="url(#gErik)" stroke="#1c1366" stroke-width="2"/>
          <path d="M50 26 C46 46 48 70 52 86" stroke="#ffffff33" stroke-width="2.5" fill="none"/>
          <ellipse cx="34" cy="42" rx="6" ry="10" fill="#ffffff55" transform="rotate(20 34 42)"/>` },
        C: { ad: 'Limon', c: `<path d="M10 52 C10 30 30 18 50 18 C70 18 90 30 90 52 C90 72 70 84 50 84 C30 84 10 72 10 52Z" fill="url(#gLimon)" stroke="#a88400" stroke-width="2.5" transform="rotate(-20 50 52)"/>
          <path d="M12 46 L4 44 L10 52Z M88 58 L96 60 L90 52Z" fill="#e8c400" transform="rotate(-20 50 52)"/>
          <ellipse cx="38" cy="38" rx="11" ry="5" fill="#ffffffaa" transform="rotate(-30 38 38)"/>` },
        Y: { ad: 'Kiraz', c: `<path d="M34 62 Q40 30 58 14 M66 64 Q64 36 58 14" stroke="#5a7a1c" stroke-width="3.5" fill="none" stroke-linecap="round"/>
          <path d="M58 14 C68 6 82 10 84 18 C74 22 66 22 58 14Z" fill="#5bb33a" stroke="#2f6d1c" stroke-width="1.5"/>
          <circle cx="32" cy="68" r="17" fill="url(#gKirmizi)" stroke="#6b0008" stroke-width="2"/>
          <circle cx="68" cy="70" r="17" fill="url(#gKirmizi)" stroke="#6b0008" stroke-width="2"/>
          <circle cx="26" cy="62" r="4.5" fill="#ffffffaa"/><circle cx="62" cy="64" r="4.5" fill="#ffffffaa"/>` },
      },
      // klasik meyve makinesi havası, Sol majör, hızlı
      muzik: {
        bpm: 164, lead: 'square', bas: 'square',
        melodi: 'G5 - D5 G5 B5 - G5 D5 E5 - C5 E5 G5 - E5 C5 D5 - A4 D5 F#5 - D5 A4 G5 B5 D6 B5 G5 - G5 -',
        basl: 'G2 G3 G2 G3 G2 G3 G2 G3 C3 C4 C3 C4 C3 C4 C3 C4 D3 D4 D3 D4 D3 D4 D3 D4 G2 G3 G2 G3 G2 - G2 -',
      },
    },

    // ===================== KORSAN HAZİNESİ =====================
    korsan: {
      ad: 'Korsan Hazinesi', slogan: 'Bedava dönüşte yapışkan jokerler', simge: '🏴‍☠️',
      yagmurAd: 'HAZİNE YAĞMURU!', parcacik: 'sikke',
      etiketRenk: { W: ['#111', '#ffd34d'], S: ['#8a4b1c', '#ffd34d'] },
      renk: {
        '--arka': 'radial-gradient(120% 80% at 50% 15%, #1d6fa3 0%, #0b3556 45%, #020d1a 100%)',
        '--koyu': '#03111f', '--soluk': '#9ccbe8', '--vurgu': '#4fc3ff',
        '--cerceve': 'linear-gradient(180deg, #e9c48a, #8a4b1c 30%, #ffd34d 55%, #6b3410 80%, #2b1205)',
        '--makara': 'linear-gradient(180deg, #f3e6c8 0%, #fdf7ea 50%, #f3e6c8 100%)',
        '--dugme': 'radial-gradient(circle at 50% 35%, #ffe6a8, #c98a12 45%, #6b3d00 80%)', '--dugme-golge': '#3d2200',
        '--desen': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='90' height='60' viewBox='0 0 90 60'%3E%3Cpath d='M0 30 Q11 20 22 30 T45 30 T68 30 T90 30' fill='none' stroke='%23ffffff' stroke-width='3'/%3E%3C/svg%3E")`,
      },
      sembol: {
        W: { ad: 'Korsan Bayrağı', c: `<rect x="14" y="8" width="5" height="86" rx="2" fill="url(#gAhsap)"/>
          <path d="M19 12 Q40 6 60 12 T90 12 V64 Q70 58 50 64 T19 64Z" fill="#111" stroke="#000" stroke-width="2"/>
          <g transform="translate(54 38)">
            <rect x="-22" y="6" width="44" height="7" rx="3.5" fill="#f2f2f2" transform="rotate(30)"/><rect x="-22" y="6" width="44" height="7" rx="3.5" fill="#f2f2f2" transform="rotate(-30)"/>
            <circle r="13" cy="-4" fill="#f2f2f2"/><rect x="-8" y="4" width="16" height="9" rx="2" fill="#f2f2f2"/>
            <circle cx="-5" cy="-5" r="3.6" fill="#111"/><circle cx="5" cy="-5" r="3.6" fill="#111"/><path d="M0 0 L-2 4 H2Z" fill="#111"/>
            <path d="M-4 9 V13 M0 9 V13 M4 9 V13" stroke="#111" stroke-width="1.5"/>
          </g>` },
        S: { ad: 'Hazine Sandığı', c: `<circle cx="50" cy="40" r="34" fill="url(#gParilti)"/>
          ${[[36, 34], [50, 28], [64, 34], [43, 40], [58, 40]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="8" fill="url(#gAltin)" stroke="#8a5300"/>`).join('')}
          <path d="M16 46 C16 30 84 30 84 46Z" fill="url(#gAhsap)" stroke="#3a1a05" stroke-width="2" opacity=".0"/>
          <rect x="16" y="44" width="68" height="34" rx="3" fill="url(#gAhsap)" stroke="#3a1a05" stroke-width="2"/>
          <rect x="16" y="44" width="68" height="7" fill="url(#gAltinD)"/><rect x="26" y="44" width="6" height="34" fill="url(#gAltinD)"/><rect x="68" y="44" width="6" height="34" fill="url(#gAltinD)"/>
          <rect x="44" y="52" width="12" height="12" rx="2" fill="url(#gAltin)" stroke="#6b4200"/><circle cx="50" cy="57" r="2" fill="#3a1a05"/>` },
        N: { ad: 'Korsan Gemisi', c: `<path d="M48 12 V66 M30 22 V64" stroke="#4f260a" stroke-width="3"/>
          <path d="M50 16 Q72 26 70 50 L50 50Z" fill="#f4ecd8" stroke="#a89878" stroke-width="1.5"/>
          <path d="M32 26 Q48 34 46 56 L32 56Z" fill="#f4ecd8" stroke="#a89878" stroke-width="1.5"/>
          <path d="M48 12 L60 9 L48 6Z" fill="#111"/>
          <path d="M10 62 H90 L80 80 H22Z" fill="url(#gAhsap)" stroke="#3a1a05" stroke-width="2"/>
          ${[30, 42, 54, 66].map(x => `<circle cx="${x}" cy="70" r="2.5" fill="#1a0a00"/>`).join('')}
          <path d="M4 86 Q14 78 24 86 T44 86 T64 86 T84 86 T100 86" stroke="url(#gDeniz)" stroke-width="5" fill="none"/>` },
        A: { ad: 'Dümen', c: `${Array.from({ length: 8 }, (_, i) => `<g transform="rotate(${i * 45} 50 50)"><rect x="47" y="6" width="6" height="22" rx="3" fill="url(#gAhsap)" stroke="#3a1a05" stroke-width="1"/><circle cx="50" cy="8" r="5" fill="url(#gAhsap)" stroke="#3a1a05"/></g>`).join('')}
          <circle cx="50" cy="50" r="27" fill="none" stroke="#3a1a05" stroke-width="10"/>
          <circle cx="50" cy="50" r="27" fill="none" stroke="url(#gAhsap)" stroke-width="7"/>
          ${Array.from({ length: 4 }, (_, i) => `<rect x="47.5" y="24" width="5" height="52" fill="url(#gAhsap)" transform="rotate(${i * 45} 50 50)"/>`).join('')}
          <circle cx="50" cy="50" r="9" fill="url(#gAltin)" stroke="#6b4200" stroke-width="2"/>` },
        U: { ad: 'Papağan', c: `<path d="M44 80 L40 94 M54 80 L56 94" stroke="#555" stroke-width="3" stroke-linecap="round"/>
          <path d="M52 22 C70 22 76 40 72 58 C68 74 58 84 46 84 C36 84 34 72 38 60 C40 50 36 30 52 22Z" fill="#e53935" stroke="#7a0b0b" stroke-width="2"/>
          <path d="M60 46 C72 50 74 66 64 80 C58 72 56 58 60 46Z" fill="#1e88e5" stroke="#0a3d7a" stroke-width="1.5"/>
          <path d="M64 70 C68 74 70 78 66 84 C62 80 62 76 64 70Z" fill="#ffd23f"/>
          <circle cx="50" cy="34" r="6" fill="#fff"/><circle cx="51" cy="34" r="3" fill="#111"/>
          <path d="M38 32 C30 34 28 44 34 48 C36 42 40 38 44 38Z" fill="#ffd23f" stroke="#a87800" stroke-width="1.5"/>` },
        P: { ad: 'Pusula', c: `<circle cx="50" cy="50" r="38" fill="url(#gAltinD)" stroke="#6b4200" stroke-width="2"/>
          <circle cx="50" cy="50" r="30" fill="#f6edd6" stroke="#8a5300" stroke-width="1.5"/>
          ${Array.from({ length: 8 }, (_, i) => `<rect x="49" y="22" width="2" height="${i % 2 ? 4 : 7}" fill="#6b4200" transform="rotate(${i * 45} 50 50)"/>`).join('')}
          <path d="M50 26 L57 50 L50 74 L43 50Z" fill="#fff" stroke="#555" stroke-width="1"/>
          <path d="M50 26 L57 50 L43 50Z" fill="#e53935"/>
          <circle cx="50" cy="50" r="3.5" fill="#6b4200"/>
          <text x="50" y="21" text-anchor="middle" font-size="9" font-weight="900" fill="#6b4200" font-family="Arial">N</text>` },
        C: { ad: 'Rom Şişesi', c: `<rect x="44" y="8" width="12" height="8" rx="2" fill="#8d5a2b"/>
          <path d="M44 16 H56 V30 C56 34 70 36 70 48 V84 C70 88 66 90 62 90 H38 C34 90 30 88 30 84 V48 C30 36 44 34 44 30Z" fill="url(#gSise)" stroke="#031a0c" stroke-width="2"/>
          <rect x="33" y="54" width="34" height="22" rx="2" fill="#f4e4c1" stroke="#a88b5a"/>
          <text x="50" y="70" text-anchor="middle" font-size="12" font-weight="900" fill="#7a0b0b" font-family="Arial">ROM</text>
          <path d="M36 44 V82" stroke="#ffffff55" stroke-width="3" stroke-linecap="round"/>` },
        Y: { ad: 'Çapa', c: `<circle cx="50" cy="16" r="7" fill="none" stroke="url(#gCelik)" stroke-width="5"/>
          <rect x="46" y="22" width="8" height="58" rx="3" fill="url(#gCelik)" stroke="#333" stroke-width="1"/>
          <rect x="30" y="30" width="40" height="7" rx="3" fill="url(#gCelik)" stroke="#333" stroke-width="1"/>
          <path d="M16 56 C18 78 36 88 50 86 C64 88 82 78 84 56" fill="none" stroke="#333" stroke-width="10" stroke-linecap="round"/>
          <path d="M16 56 C18 78 36 88 50 86 C64 88 82 78 84 56" fill="none" stroke="url(#gCelik)" stroke-width="7" stroke-linecap="round"/>
          <path d="M10 60 L16 48 L24 58Z M90 60 L84 48 L76 58Z" fill="url(#gCelik)" stroke="#333" stroke-width="1.5"/>` },
      },
      // denizci türküsü havası (Re dorian), coşkulu
      muzik: {
        bpm: 150, lead: 'square', bas: 'triangle',
        melodi: 'A4 A4 A4 A4 A4 D4 F4 A4 G4 G4 G4 G4 G4 C4 E4 G4 A4 A4 A4 A4 A4 B4 C5 D5 C5 A4 G4 E4 D4 - D4 -',
        basl: 'D3 - A2 - D3 - A2 - C3 - G2 - C3 - G2 - D3 - A2 - D3 - A2 - C3 - A2 - D3 - D3 -',
      },
    },
    // ===================== ŞANSLI KUZU =====================
    kuzu: {
      ad: 'Şanslı Kuzu', slogan: 'Altın sikkeleri kilitle · sikke bonusu', simge: '🐑',
      yagmurAd: 'BEREKET YAĞMURU!', parcacik: 'yonca',
      etiketRenk: { W: ['#2e9d48', '#ffd34d'], S: ['#e08a00', '#fff'] },
      renk: {
        '--arka': 'radial-gradient(120% 80% at 50% 10%, #8fd3ff 0%, #4caf50 38%, #1b5e20 70%, #0a2a0c 100%)',
        '--koyu': '#0b2a0e', '--soluk': '#d6f5c9', '--vurgu': '#b8ff9c',
        '--cerceve': 'linear-gradient(180deg, #fff6d0, #c98a12 30%, #8bc34a 55%, #ffd34d 75%, #5a3a00)',
        '--makara': 'linear-gradient(180deg, #f3fbe8 0%, #fffff6 50%, #f3fbe8 100%)',
        '--dugme': 'radial-gradient(circle at 50% 35%, #dfffb0, #6cc62a 45%, #2f7a10 80%)', '--dugme-golge': '#1d4f08',
        '--desen': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='60' viewBox='0 0 80 60'%3E%3Cg fill='%23ffffff'%3E%3Ccircle cx='14' cy='16' r='7'/%3E%3Ccircle cx='22' cy='12' r='8'/%3E%3Ccircle cx='30' cy='16' r='7'/%3E%3Ccircle cx='60' cy='44' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
      },
      sembol: {
        W: { ad: 'Şanslı Kuzu', c: `<circle cx="50" cy="48" r="46" fill="url(#gParilti)"/>
          <rect x="32" y="66" width="7" height="18" rx="3" fill="#3a2a22"/><rect x="58" y="66" width="7" height="18" rx="3" fill="#3a2a22"/>
          ${[[30, 52, 15], [44, 46, 16], [60, 48, 15], [70, 58, 12], [38, 62, 13], [56, 62, 14], [24, 62, 10]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#gYun)" stroke="#bfb39c" stroke-width="1.2"/>`).join('')}
          <ellipse cx="24" cy="42" rx="12" ry="14" fill="#4a3a32"/>
          <ellipse cx="12" cy="36" rx="7" ry="3.5" fill="#4a3a32" transform="rotate(-25 12 36)"/><ellipse cx="34" cy="31" rx="7" ry="3.5" fill="#4a3a32" transform="rotate(25 34 31)"/>
          <circle cx="20" cy="40" r="2.6" fill="#fff"/><circle cx="29" cy="40" r="2.6" fill="#fff"/><circle cx="20.5" cy="40.5" r="1.3" fill="#111"/><circle cx="29.5" cy="40.5" r="1.3" fill="#111"/>
          <path d="M21 49 Q24.5 52 28 49" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round"/>
          <circle cx="25" cy="58" r="4.5" fill="url(#gAltin)" stroke="#8a5300"/>
          <g transform="translate(14 14) scale(.22)">${yapraklar(4, 'gYaprak', 45)}</g>` },
        S: { ad: 'Altın Yumurta', c: `<circle cx="50" cy="48" r="40" fill="url(#gParilti)"/>
          <path d="M28 64 Q50 92 72 64 Z" fill="#c9a15a"/>
          ${Array.from({ length: 9 }, (_, i) => `<path d="M${26 + i * 6} 64 l4 -8" stroke="#a87a30" stroke-width="2"/>`).join('')}
          <path d="M50 14 C66 14 74 38 74 52 C74 66 64 74 50 74 C36 74 26 66 26 52 C26 38 34 14 50 14Z" fill="url(#gAltin)" stroke="#8a5300" stroke-width="2"/>
          <ellipse cx="41" cy="34" rx="6" ry="10" fill="#fff" opacity=".6" transform="rotate(20 41 34)"/>` },
        N: { ad: 'Kırmızı Ahır', c: `<path d="M12 44 L50 14 L88 44 V86 H12Z" fill="url(#gAhir)" stroke="#5a0d08" stroke-width="2.5" stroke-linejoin="round"/>
          <path d="M8 46 L50 12 L92 46" stroke="#fff" stroke-width="5" fill="none" stroke-linejoin="round"/>
          <rect x="34" y="52" width="32" height="34" fill="#7a1209" stroke="#fff" stroke-width="3"/>
          <path d="M34 52 L66 86 M66 52 L34 86" stroke="#fff" stroke-width="3"/>
          <rect x="42" y="28" width="16" height="12" fill="#fff6c2" stroke="#fff" stroke-width="2"/>` },
        A: { ad: 'Tavuk', c: `<path d="M44 16 q4 -8 8 0 q4 -8 8 0 q2 6 -4 8 h-8 q-6 -2 -4 -8Z" fill="#e53935"/>
          <path d="M76 52 C88 40 90 26 80 30 C84 22 74 22 72 32Z" fill="#f1ece2" stroke="#bfb39c" stroke-width="1.5"/>
          <ellipse cx="52" cy="58" rx="30" ry="26" fill="url(#gYun)" stroke="#bfb39c" stroke-width="2"/>
          <circle cx="50" cy="34" r="15" fill="url(#gYun)" stroke="#bfb39c" stroke-width="2"/>
          <path d="M34 34 L24 37 L34 40Z" fill="#ffb300"/><path d="M38 42 q-2 8 4 8 q4 -4 0 -9Z" fill="#e53935"/>
          <circle cx="44" cy="31" r="2.6" fill="#111"/>
          <path d="M46 58 Q56 70 70 58" stroke="#bfb39c" stroke-width="3" fill="none"/>
          <path d="M44 84 v8 m-4 0 h8 M60 84 v8 m-4 0 h8" stroke="#ffb300" stroke-width="3" stroke-linecap="round"/>` },
        U: { ad: 'Ayçiçeği', c: `<path d="M50 60 V96" stroke="#4c8a2a" stroke-width="5"/><path d="M50 80 C40 70 30 74 28 82 C38 86 46 84 50 80Z" fill="#5bb33a"/>
          ${Array.from({ length: 14 }, (_, i) => `<ellipse cx="50" cy="20" rx="7" ry="14" fill="#ffd23f" stroke="#e0a000" stroke-width="1" transform="rotate(${i * 360 / 14} 50 44)"/>`).join('')}
          <circle cx="50" cy="44" r="15" fill="#6b3d12" stroke="#3a1f06" stroke-width="2"/>
          ${[[45, 40], [53, 38], [50, 46], [44, 49], [56, 47], [49, 52]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.8" fill="#3a1f06"/>`).join('')}` },
        P: { ad: 'Havuç', c: `<path d="M50 24 C40 10 30 12 32 20 C38 22 44 24 50 24Z M50 24 C50 8 58 4 62 10 C58 16 54 20 50 24Z M50 24 C60 12 72 14 70 22 C62 24 56 24 50 24Z" fill="#4caf50" stroke="#2e7d32" stroke-width="1.5"/>
          <path d="M34 28 C40 22 60 22 66 28 C66 50 56 76 50 92 C44 76 34 50 34 28Z" fill="url(#gHavuc)" stroke="#a84800" stroke-width="2"/>
          <path d="M40 40 h6 M54 50 h6 M42 60 h5 M52 70 h4" stroke="#c25500" stroke-width="2" stroke-linecap="round"/>` },
        C: { ad: 'Kırmızı Elma', c: `<path d="M50 26 Q50 14 56 10" stroke="#6b4426" stroke-width="4" fill="none" stroke-linecap="round"/>
          <path d="M54 18 C62 8 76 10 78 16 C68 22 60 22 54 18Z" fill="#5bb33a" stroke="#2f6d1c" stroke-width="1.5"/>
          <path d="M50 28 C40 20 16 22 16 50 C16 74 34 90 50 84 C66 90 84 74 84 50 C84 22 60 20 50 28Z" fill="url(#gKirmizi)" stroke="#6b0008" stroke-width="2"/>
          <ellipse cx="32" cy="44" rx="6" ry="11" fill="#ffffff77" transform="rotate(20 32 44)"/>` },
        Y: { ad: 'Buğday', c: `<path d="M50 96 V30" stroke="#c99a2e" stroke-width="3.5"/>
          ${[0, 1, 2, 3, 4].map(i => `<ellipse cx="42" cy="${34 + i * 11}" rx="6" ry="10" fill="#f2c94c" stroke="#b98b1a" stroke-width="1.2" transform="rotate(-30 42 ${34 + i * 11})"/><ellipse cx="58" cy="${34 + i * 11}" rx="6" ry="10" fill="#f2c94c" stroke="#b98b1a" stroke-width="1.2" transform="rotate(30 58 ${34 + i * 11})"/>`).join('')}
          <ellipse cx="50" cy="20" rx="6" ry="11" fill="#f2c94c" stroke="#b98b1a" stroke-width="1.2"/>` },
      },
      // köy düğünü havası, Fa majör
      muzik: {
        bpm: 144, lead: 'square', bas: 'triangle',
        melodi: 'F5 A5 C6 A5 F5 - G5 A5 A#5 - A5 G5 F5 - - - C5 F5 A5 F5 E5 - D5 E5 F5 - G5 - F5 - - -',
        basl: 'F2 C3 F2 C3 F2 C3 C3 G3 C3 G3 C3 G3 F2 C3 F2 C3 F2 C3 F2 C3 A2 E3 A#2 F3 C3 G3 C3 G3 F2 - F2 -',
      },
    },

    // ===================== MAYA HAZİNELERİ =====================
    maya: {
      ad: 'Maya Hazineleri', slogan: '243 yol · düşen taşlar · ×15 çarpan', simge: '🗿',
      yagmurAd: 'TAPINAK BÜYÜSÜ!', parcacik: 'yildiz',
      etiketRenk: { W: ['#0b5e40', '#ffd34d'], S: ['#8a5300', '#fff'] },
      renk: {
        '--arka': 'radial-gradient(120% 80% at 50% 10%, #3f7a3a 0%, #1d3d1a 45%, #070f05 100%)',
        '--koyu': '#0a1508', '--soluk': '#cfe3b8', '--vurgu': '#25c28a',
        '--cerceve': 'linear-gradient(180deg, #f3e2b0, #8a7650 30%, #ffd34d 50%, #25c28a 70%, #3a2a10)',
        '--makara': 'linear-gradient(180deg, #efe4c8 0%, #faf4e4 50%, #efe4c8 100%)',
        '--dugme': 'radial-gradient(circle at 50% 35%, #c9ffe6, #25a06e 45%, #0b5e40 80%)', '--dugme-golge': '#06331f',
        '--desen': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath d='M5 5h20v20H5zM10 10h10v10H10zM35 35h20v20H35zM40 40h10v10H40z' fill='none' stroke='%23ffffff' stroke-width='2'/%3E%3C/svg%3E")`,
      },
      sembol: {
        W: { ad: 'Altın Maske', c: `<circle cx="50" cy="50" r="46" fill="url(#gParilti)"/>
          <path d="M20 22 H80 L84 50 C84 72 68 90 50 90 C32 90 16 72 16 50Z" fill="url(#gAltin)" stroke="#6b4200" stroke-width="2.5"/>
          <path d="M14 22 H86 L80 12 H20Z" fill="url(#gAltinD)" stroke="#6b4200" stroke-width="2"/>
          ${[24, 36, 48, 60, 72].map(x => `<circle cx="${x + 2}" cy="17" r="2.5" fill="url(#gYesim)"/>`).join('')}
          <path d="M26 42 h16 l-3 8 h-10Z M58 42 h16 l-3 8 h-10Z" fill="#1a1006"/>
          <circle cx="34" cy="46" r="2.2" fill="#25c28a"/><circle cx="66" cy="46" r="2.2" fill="#25c28a"/>
          <path d="M47 50 L44 64 H56 L53 50" fill="none" stroke="#8a5300" stroke-width="2.5"/>
          <path d="M36 72 H64 L60 78 H40Z" fill="#1a1006"/><path d="M40 72 v6 M46 72 v6 M52 72 v6 M58 72 v6" stroke="#e9c46a" stroke-width="1.5"/>
          <path d="M20 54 l-6 6 M80 54 l6 6" stroke="#6b4200" stroke-width="2"/>` },
        S: { ad: 'Kayıp Piramit', c: `<circle cx="50" cy="20" r="14" fill="url(#gAltin)"/>${Array.from({ length: 12 }, (_, i) => `<rect x="49" y="0" width="2" height="6" fill="#ffd34d" transform="rotate(${i * 30} 50 20)"/>`).join('')}
          ${[0, 1, 2, 3, 4].map(i => `<rect x="${14 + i * 7}" y="${72 - i * 10}" width="${72 - i * 14}" height="11" fill="url(#gTasMaya)" stroke="#5a4a2a" stroke-width="1.5"/>`).join('')}
          <rect x="44" y="40" width="12" height="43" fill="#8a7650" stroke="#5a4a2a" stroke-width="1"/>
          ${[46, 52, 58, 64, 70, 76].map(y => `<path d="M44 ${y} h12" stroke="#5a4a2a" stroke-width="1"/>`).join('')}
          <rect x="45" y="28" width="10" height="10" fill="#3a2a10"/>` },
        N: { ad: 'Güneş Taşı', c: `<circle cx="50" cy="50" r="40" fill="url(#gTasMaya)" stroke="#5a4a2a" stroke-width="2.5"/>
          ${Array.from({ length: 20 }, (_, i) => `<rect x="48" y="11" width="4" height="7" fill="#5a4a2a" transform="rotate(${i * 18} 50 50)"/>`).join('')}
          <circle cx="50" cy="50" r="28" fill="none" stroke="#5a4a2a" stroke-width="2"/>
          <path d="${yildizYol(50, 50, 26, 12, 8)}" fill="url(#gAltin)" stroke="#6b4200" stroke-width="1.5"/>
          <circle cx="50" cy="50" r="11" fill="url(#gYesim)" stroke="#0b5e40" stroke-width="1.5"/>
          <circle cx="46" cy="48" r="1.6" fill="#032"/><circle cx="54" cy="48" r="1.6" fill="#032"/><path d="M46 54 h8" stroke="#032" stroke-width="1.6"/>` },
        A: { ad: 'Yeşim Kafatası', c: `<path d="M50 12 C72 12 82 28 80 46 C79 56 72 60 70 66 V78 H30 V66 C28 60 21 56 20 46 C18 28 28 12 50 12Z" fill="url(#gYesim)" stroke="#0b5e40" stroke-width="2.5"/>
          <ellipse cx="37" cy="46" rx="9" ry="10" fill="#063a26"/><ellipse cx="63" cy="46" rx="9" ry="10" fill="#063a26"/>
          <circle cx="37" cy="46" r="3" fill="#ffd34d"/><circle cx="63" cy="46" r="3" fill="#ffd34d"/>
          <path d="M50 54 L45 64 H55Z" fill="#063a26"/>
          <path d="M34 70 V80 M40 70 V80 M46 70 V80 M52 70 V80 M58 70 V80 M64 70 V80" stroke="#063a26" stroke-width="2"/>
          <path d="M36 22 Q44 18 52 20" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>` },
        U: { ad: 'Kutsal Tüy', c: `<path d="M30 88 C34 60 50 30 76 10" stroke="#8a5300" stroke-width="3" fill="none"/>
          <path d="M76 10 C86 34 70 66 34 84 C44 64 52 40 76 10Z" fill="#1fbf74" stroke="#0b5e40" stroke-width="2"/>
          <path d="M70 22 C76 38 64 58 44 74 C52 58 58 42 70 22Z" fill="#1e7bff" opacity=".85"/>
          <path d="M62 40 C64 50 58 60 50 66" stroke="#ff3b4e" stroke-width="4" fill="none" stroke-linecap="round"/>
          ${[[64, 24], [60, 34], [54, 46], [48, 58]].map(([x, y]) => `<path d="M${x} ${y} l-10 4" stroke="#0b5e40" stroke-width="1.5"/>`).join('')}` },
        P: { ad: 'Totem', c: `${[[10, '#c62828'], [38, '#1e7bff'], [66, '#2e9d48']].map(([y, c]) => `<rect x="28" y="${y}" width="44" height="26" rx="3" fill="url(#gTasMaya)" stroke="#5a4a2a" stroke-width="2"/>
          <rect x="34" y="${y + 6}" width="9" height="7" fill="${c}"/><rect x="57" y="${y + 6}" width="9" height="7" fill="${c}"/><rect x="40" y="${y + 17}" width="20" height="4" fill="#3a2a10"/>`).join('')}
          <path d="M18 18 H28 V30 H18Z M72 18 H82 V30 H72Z" fill="url(#gAltinD)" stroke="#6b4200"/>` },
        C: { ad: 'Yakut', c: `<path d="M30 20 H70 L88 42 L50 90 L12 42Z" fill="url(#gYakut)" stroke="#6b0019" stroke-width="2.5" stroke-linejoin="round"/>
          <path d="M12 42 H88 M30 20 L40 42 L50 90 L60 42 L70 20 M40 42 L50 20 L60 42" stroke="#ffffff66" stroke-width="1.5" fill="none"/>
          <path d="M34 26 L40 36" stroke="#fff" stroke-width="3" stroke-linecap="round"/>` },
        Y: { ad: 'Safir', c: `<path d="M50 12 L82 34 L72 82 H28 L18 34Z" fill="url(#gSafir)" stroke="#0a2f80" stroke-width="2.5" stroke-linejoin="round"/>
          <path d="M50 12 L50 82 M18 34 L50 46 L82 34 M28 82 L50 46 L72 82" stroke="#ffffff55" stroke-width="1.5" fill="none"/>
          <path d="M38 24 L32 36" stroke="#fff" stroke-width="3" stroke-linecap="round"/>` },
      },
      // davul ve flüt havası, Re minör
      muzik: {
        bpm: 126, lead: 'triangle', bas: 'square',
        melodi: 'D5 F5 G5 A5 - A5 G5 F5 D5 - C5 D5 F5 - D5 - A4 C5 D5 F5 - E5 D5 C5 D5 - - - A4 - D5 -',
        basl: 'D2 D2 A2 D2 D2 D2 A2 D2 A#1 A#1 F2 A#1 C2 C2 G2 C2 D2 D2 A2 D2 A#1 A#1 F2 A#1 A1 A1 E2 A1 D2 - D2 -',
      },
    },
  };

  // Gemini ile üretilen görseller (sanat/<tema>/): semboller, logo, arka plan
  for (const [id, tm] of Object.entries(TEMALAR)) { tm.id = id; tm.resimli = true; }
  dis.TEMALAR = TEMALAR;
  dis.TEMA_DEGRADE = DEGRADELER;
  dis.TEMA_ETIKET = ETIKET;
  dis.yildizYol = yildizYol;
})(this);
