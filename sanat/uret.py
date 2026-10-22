"""Tema görsellerini Gemini ile üretir: sembol sayfası (5x2), logo, arka plan.
Kullanım: python uret.py <tema> [sayfa|logo|arka ...]   (ham çıktılar sanat/ham/ altına)"""
import base64, os, sys, requests

K = open(r'C:\HomeAssistant\gemini-key.txt').read().strip()
KOK = os.path.dirname(os.path.abspath(__file__))
HAM = os.path.join(KOK, 'ham'); os.makedirs(HAM, exist_ok=True)
STIL = ('Premium online casino slot machine symbol icons, glossy 3D render, vibrant saturated colors, rich gold accents, rim light, '
        'soft studio lighting, crisp high detail, in the style of top modern video slots. ')
IZGARA = ('Arrange exactly 10 separate icons in a strict grid of 5 columns and 2 rows, each icon centered in its own cell with generous empty margin, '
          'all icons the same size, nothing touching or overlapping. Plain flat light gray (#e8e8e8) background. No text, no letters, no numbers, '
          'no labels, no grid lines, no frames around cells. Order left-to-right, top row then bottom row: ')
TEMALAR = {
    'olimpos': ('ancient Greek gods Mount Olympus theme like a famous Zeus slot',
                ['a glowing blue-white lightning orb (spare)', 'a golden portrait medallion of old bearded Zeus with laurel crown', 'a golden royal crown with gems',
                 'an ornate golden hourglass', 'a golden ring with a big red gem', 'a golden chalice goblet', 'a faceted red gem', 'a faceted purple gem',
                 'a faceted yellow gem', 'a faceted green gem'],
                'majestic marble Greek temple gates on top of Mount Olympus above golden clouds, columns, divine light, stormy blue sky with lightning',
                'OLİMPOS DEDE'),
    'yonca': ('Irish lucky leprechaun theme',
              ['a glowing magical four-leaf clover with golden sparkles', 'a black cauldron pot overflowing with gold coins under a small rainbow',
               'a shiny golden horseshoe', 'a big gold coin with a clover emblem', 'a cute red ladybug', 'a green leprechaun top hat with gold buckle',
               'a golden bell with a green ribbon', 'a simple three-leaf green clover', 'a pint of foamy beer (spare)', 'a small treasure gem (spare)'],
              'Irish green hills at sunset with a big rainbow, golden light rays, magical sparkles, misty fairy forest edges',
              'ŞANSLI YONCA'),
    'seker': ('sweet candy land theme like a famous candy slot',
              ['a big rainbow swirl lollipop', 'a pink frosted cupcake with a cherry on top', 'a glossy red heart-shaped candy', 'a glossy yellow star candy',
               'a blue wrapped bonbon candy', 'a pink glazed donut with sprinkles', 'a green apple jelly bean', 'a purple grape gumdrop with sugar',
               'a ripe yellow banana', 'a glossy blue gumball'],
              'pastel candy land with cotton candy clouds, chocolate rivers, lollipop trees and pink sky',
              'ŞEKER DİYARI'),
    'buyucu': ('mystical wizard tower fantasy theme',
               ['a magic wand with a glowing golden star tip', 'a glowing purple crystal ball on a golden stand', 'a red magic potion flask with bubbles',
                'an ancient purple spell book with a golden star emblem', 'a cluster of glowing purple amethyst crystals', 'a blue wizard hat with golden stars',
                'a golden crescent moon', 'a grey rune stone with a glowing cyan rune', 'a spare owl (spare)', 'a spare scroll (spare)'],
               'interior of a magical wizard tower at night, starry sky through arched window, floating candles, purple magic glow',
               'BÜYÜCÜ KULESİ'),
    'ates': ('classic hot fruit machine theme with fire',
             ['a big glossy red number seven made of metal with flames behind it', 'a shiny golden five-pointed star', 'three stacked black BAR plates with gold edges (no letters)',
              'a juicy watermelon slice', 'a bunch of purple grapes', 'a glossy dark blue plum with a leaf', 'a bright yellow lemon',
              'a pair of red cherries with a leaf', 'a spare orange fruit (spare)', 'a spare bell (spare)'],
             'dark red background with roaring flames and glowing embers, classic casino neon glow',
             "ATEŞLİ 7'LER"),
    'korsan': ('pirate treasure adventure theme',
               ['a black pirate flag with white skull and crossbones on a wooden pole', 'an open wooden treasure chest overflowing with gold coins and jewels',
                'a pirate sailing ship with white sails', "a wooden ship's steering wheel with gold hub", 'a colorful red and blue parrot',
                'an antique brass compass', 'a green glass rum bottle with cork', 'an iron ship anchor', 'a spare cannon (spare)', 'a spare map (spare)'],
               'stormy ocean at dusk with a pirate ship, lightning, waves and a tropical treasure island',
               'KORSAN HAZİNESİ'),
    'kuzu': ('happy farm lucky lamb theme',
             ['a cute fluffy white lamb with a golden bell and a four-leaf clover', 'a shiny golden egg in a straw nest', 'a red barn with white trim',
              'a cute white hen', 'a bright sunflower', 'an orange carrot with green leaves', 'a shiny red apple', 'a golden wheat sheaf',
              'a big gold coin with a lamb emblem', 'a spare milk can (spare)'],
             'sunny green farm meadow with rolling hills, fences, a windmill and blue sky with fluffy clouds',
             'ŞANSLI KUZU'),
    'maya': ('ancient Mayan jungle temple treasure theme',
             ['an ornate golden Mayan mask with jade inlays', 'a stepped Mayan stone pyramid with a golden sun above', 'a carved Mayan sun stone calendar disc',
              'a jade green carved skull', 'a sacred quetzal feather in green, blue and red', 'a carved stone totem with colored eyes',
              'a faceted red ruby gem', 'a faceted blue sapphire gem', 'a spare jaguar head (spare)', 'a spare golden idol (spare)'],
             'lush jungle with ancient Mayan temple ruins, vines, waterfalls and golden god rays',
             'MAYA HAZİNELERİ'),
}


def gemini(metin, oran, boy, dosya):
    body = {'contents': [{'parts': [{'text': metin}]}], 'generationConfig': {'responseModalities': ['IMAGE'], 'imageConfig': {'aspectRatio': oran, 'imageSize': boy}}}
    for d in range(3):
        try:
            o = requests.post(f'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image:generateContent?key={K}', json=body, timeout=400).json()
            for p in o['candidates'][0]['content']['parts']:
                if 'inlineData' in p:
                    open(dosya, 'wb').write(base64.b64decode(p['inlineData']['data'])); print('ok', os.path.basename(dosya), flush=True); return True
            print('görsel yok', str(o)[:200])
        except Exception as e:
            print('hata', d, str(e)[:200], flush=True)
    return False


tema = sys.argv[1]
isler = sys.argv[2:] or ['sayfa', 'logo', 'arka']
konu, semboller, sahne, ad = TEMALAR[tema]
if 'sayfa' in isler:
    gemini(STIL + f'Theme: {konu}. ' + IZGARA + '; '.join(f'{i + 1}) {x}' for i, x in enumerate(semboller)) + '.', '21:9', '2K', os.path.join(HAM, f'{tema}_sayfa.png'))
if 'logo' in isler:
    gemini(f'A premium slot game logo for a {konu}. The logo text reads exactly "{ad}" (Turkish letters, spelled exactly like this) in huge bold 3D glossy golden letters '
           'with a thick dark outline, decorated with small themed ornaments around the text. Centered, wide horizontal logo, '
           'plain flat light gray (#e8e8e8) background, nothing else.', '16:9', '1K', os.path.join(HAM, f'{tema}_logo.png'))
if 'arka' in isler:
    gemini(f'Vertical mobile slot game background illustration: {sahne}. Rich colors, cinematic lighting, painterly 3D game art, '
           'the center of the image calm and slightly darker so slot reels can be placed on top. No text, no UI, no logo, no frame.', '9:16', '2K', os.path.join(HAM, f'{tema}_arka.png'))
