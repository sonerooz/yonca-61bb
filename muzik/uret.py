"""Oyun müziklerini Gemini Lyria 3 ile üretir: python uret.py [ad ...] (ad verilmezse eksik olanların hepsi)."""
import base64, json, os, sys, requests

K = open(r'C:\HomeAssistant\gemini-key.txt').read().strip()
URL = 'https://generativelanguage.googleapis.com/v1beta/models/lyria-3-clip-preview:generateContent?key=' + K
ORTAK = ', instrumental, no vocals, casino slot machine game background music, seamless loop, catchy, high energy, clean mix'
PARCALAR = {
    'lobi': 'Glamorous Las Vegas casino lounge, swing big band with brass section, upright bass and brushed drums, exciting and luxurious',
    'yonca': 'Upbeat Irish jig, fiddle, tin whistle, bodhran and banjo, cheerful lucky leprechaun mood',
    'seker': 'Sweet bubbly candy pop, glockenspiel, marimba, plucky synths and claps, playful and colorful',
    'buyucu': 'Mystical fantasy wizard tower, celesta, harp arpeggios, choir pads and orchestral strings, magical and adventurous',
    'ates': 'Classic retro fruit machine, funky 70s disco with slap bass, wah guitar, brass stabs and hand claps, hot and groovy',
    'korsan': 'Rowdy pirate sea shanty, accordion, fiddle, stomping drums and tin whistle, swashbuckling adventure',
    'kuzu': 'Happy country farm hoedown, banjo, acoustic guitar, harmonica and fiddle, sunny and bouncy',
    'maya': 'Ancient Mayan jungle temple adventure, tribal percussion, pan flute, marimba and epic strings, mysterious and driving',
    'yaris': 'Thrilling horse race gallop, fast orchestral strings and brass fanfares, galloping timpani rhythm, exciting chase',
    'rulet': 'Smooth elegant Monte Carlo casino jazz, piano, vibraphone, upright bass and soft brushed drums, classy and suspenseful',
    'tombala': 'Lively Turkish gazino and kahvehane party music, clarinet, darbuka, oud and violin, festive and joyful',
}

for ad in (sys.argv[1:] or [a for a in PARCALAR if not os.path.exists(a + '.mp3')]):
    body = {'contents': [{'parts': [{'text': PARCALAR[ad] + ORTAK}]}]}
    for deneme in range(3):
        try:
            d = requests.post(URL, json=body, timeout=180).json()
            ses = next(p['inlineData'] for c in d['candidates'] for p in c['content']['parts'] if 'inlineData' in p)
            open(ad + '.mp3', 'wb').write(base64.b64decode(ses['data']))
            print(ad, 'tamam', os.path.getsize(ad + '.mp3') // 1024, 'KB', flush=True)
            break
        except Exception as e:
            print(ad, 'hata', deneme, str(d)[:300] if 'd' in dir() else e, flush=True)
