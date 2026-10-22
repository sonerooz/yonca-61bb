"""Karakter pozlarını şeffaf webp yapar; üç poz AYNI çerçeveyle kırpılır (poz değişince karakter yerinde kalsın).
Kullanım: python kes_karakter.py <tema> ..."""
import os, sys
import numpy as np
from PIL import Image
from rembg import remove, new_session
KOK = os.path.dirname(os.path.abspath(__file__))
OT = new_session('isnet-general-use')
POZ = ['bekle', 'aksiyon', 'sevinc']
for t in sys.argv[1:]:
    ims = [remove(Image.open(os.path.join(KOK, 'ham', f'{t}_k_{p}.png')).convert('RGB'), session=OT, post_process_mask=True) for p in POZ]
    kutular = []
    for im in ims:
        a = np.array(im)[..., 3]; ys, xs = np.where(a > 20)
        kutular.append((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
    x0 = min(k[0] for k in kutular); y0 = min(k[1] for k in kutular); x1 = max(k[2] for k in kutular); y1 = max(k[3] for k in kutular)
    os.makedirs(os.path.join(KOK, t), exist_ok=True)
    for p, im in zip(POZ, ims):
        c = im.crop((x0, y0, x1, y1)); c.thumbnail((420, 460), Image.LANCZOS)
        c.save(os.path.join(KOK, t, f'k_{p}.webp'), quality=88)
    print(t, 'karakter tamam', c.size, flush=True)
