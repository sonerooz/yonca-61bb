"""Ham Gemini görsellerini oyuna hazırlar: sembol sayfası → 10 şeffaf webp, logo → şeffaf webp, arka plan → küçültülmüş webp.
Kullanım: python kes.py <tema> ..."""
import os, sys
import numpy as np
from PIL import Image
from rembg import remove, new_session

KOK = os.path.dirname(os.path.abspath(__file__))
SIRA = ['W', 'S', 'N', 'A', 'U', 'P', 'C', 'Y', 'X', 'Z']
OTURUM = new_session('isnet-general-use')


def seffaf(im):
    return remove(im.convert('RGB'), session=OTURUM, post_process_mask=True)


def kirp(im, kenar=.06, boy=None):
    a = np.array(im)[..., 3]
    ys, xs = np.where(a > 16)
    if not len(xs):
        return im
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    im = im.crop((x0, y0, x1, y1))
    if boy:  # kare tuval, ortala
        w, h = im.size; k = int(max(w, h) * (1 + 2 * kenar))
        t = Image.new('RGBA', (k, k)); t.paste(im, ((k - w) // 2, (k - h) // 2)); im = t.resize((boy, boy), Image.LANCZOS)
    return im


for tema in sys.argv[1:]:
    cik = os.path.join(KOK, tema); os.makedirs(cik, exist_ok=True)
    s = os.path.join(KOK, 'ham', f'{tema}_sayfa.png')
    if os.path.exists(s):
        sayfa = seffaf(Image.open(s))
        W, H = sayfa.size
        for i, k in enumerate(SIRA):
            c, r = i % 5, i // 5
            hucre = sayfa.crop((c * W // 5, r * H // 2, (c + 1) * W // 5, (r + 1) * H // 2))
            ad = 'O' if (tema == 'kuzu' and k == 'X') else k
            kirp(hucre, boy=256).save(os.path.join(cik, ad + '.webp'), quality=90)
        print(tema, 'semboller tamam', flush=True)
    l = os.path.join(KOK, 'ham', f'{tema}_logo.png')
    if os.path.exists(l):
        lg = kirp(seffaf(Image.open(l)))
        lg.thumbnail((720, 300), Image.LANCZOS); lg.save(os.path.join(cik, 'logo.webp'), quality=90)
        print(tema, 'logo tamam', lg.size, flush=True)
    a = os.path.join(KOK, 'ham', f'{tema}_arka.png')
    if os.path.exists(a):
        ar = Image.open(a).convert('RGB'); ar.thumbnail((720, 1290), Image.LANCZOS); ar.save(os.path.join(cik, 'arka.webp'), quality=78)
        print(tema, 'arka tamam', flush=True)
