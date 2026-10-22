"""Tema karakterlerini Gemini ile üretir: bekle (ana), aksiyon ve sevinç pozları (aynı karakter, referanslı düzenleme).
Kullanım: python karakter.py <tema> [bekle|aksiyon|sevinc ...]   → sanat/ham/<tema>_k_<poz>.png"""
import base64, os, sys, requests

K = open(r'C:\HomeAssistant\gemini-key.txt').read().strip()
HAM = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ham')
ARKA = ' Full body, standing, facing the viewer at a slight 3/4 angle, centered with margin. Plain flat light gray (#e8e8e8) background, no floor shadow, no text.'
STIL = 'Premium 3D slot game mascot character, glossy stylized render like top video slots (Pragmatic Play quality), vibrant colors, rim light, expressive. '
KARAKTER = {
    'olimpos': ('Zeus, the mighty old Greek god with a long flowing white beard and white hair, muscular, golden laurel crown, white and gold toga, glowing blue eyes',
                'raising his right arm high and hurling a crackling blue-white lightning bolt, electricity sparking around his hand, powerful expression',
                'laughing triumphantly with both arms spread wide, golden light and sparkles around him'),
    'yonca': ('a cheerful Irish leprechaun with a ginger beard, green top hat with gold buckle, green coat, holding a small pot of gold',
              'tossing a glowing four-leaf clover forward with one hand, winking',
              'jumping with joy, kicking heels together, gold coins flying'),
    'korsan': ('a charismatic pirate captain with a black tricorn hat with skull, red coat, eye patch, curly black beard, a red and blue parrot on his shoulder',
               'pointing his sword forward and shouting "fire!", a small cannon flash and smoke behind him',
               'laughing and holding up a handful of gold coins and jewels, parrot flapping wings'),
    'seker': ('a cute candy fairy girl with pink cotton-candy hair, a lollipop wand, sparkly pastel dress and translucent wings',
              'waving her lollipop wand forward, a burst of colorful candy sparkles shooting from it',
              'jumping happily with arms up, confetti and candies around her'),
    'buyucu': ('a wise old wizard with a very long white beard, tall blue starry hat, blue robe with gold trim, holding a wooden staff with a glowing crystal',
               'pointing his staff forward casting a bright purple magic beam, runes swirling',
               'raising his staff high triumphantly, purple magic sparkles bursting around him'),
    'maya': ('a Mayan shaman warrior with a tall green quetzal feather headdress, golden jewelry, jade necklace, painted face, holding a ritual drum',
             'beating the drum energetically, golden dust bursting',
             'raising both arms to the sky triumphantly, golden sun rays behind him'),
    'kuzu': ('a jolly old Turkish farmer grandpa with a white mustache, flat cap, plaid shirt and overalls, holding a cute fluffy white lamb',
             'throwing a handful of gold coins forward with one hand, lamb looking excited',
             'dancing happily with the lamb jumping beside him'),
    'ates': ('a fiery genie made of flames with a golden turban, muscular, crossed arms, glowing orange eyes, flame tail instead of legs',
             'throwing a blazing fireball forward with one hand',
             'laughing with fire exploding around him, arms raised'),
}


def gemini(parts, dosya):
    body = {'contents': [{'parts': parts}], 'generationConfig': {'responseModalities': ['IMAGE'], 'imageConfig': {'aspectRatio': '3:4', 'imageSize': '1K'}}}
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
isler = sys.argv[2:] or ['bekle', 'aksiyon', 'sevinc']
tanim, aksiyon, sevinc = KARAKTER[tema]
ana = os.path.join(HAM, f'{tema}_k_bekle.png')
if 'bekle' in isler:
    gemini([{'text': STIL + f'Character: {tanim}. Idle pose, confident and friendly, slight smile.' + ARKA}], ana)
ref = {'inline_data': {'mime_type': 'image/png', 'data': base64.b64encode(open(ana, 'rb').read()).decode()}}
for poz, metin in (('aksiyon', aksiyon), ('sevinc', sevinc)):
    if poz in isler:
        gemini([{'text': f'Same exact character as in the image (identical face, outfit, colors, proportions and render style). New pose: {metin}.' + ARKA}, ref],
               os.path.join(HAM, f'{tema}_k_{poz}.png'))
