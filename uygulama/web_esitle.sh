#!/bin/sh
# kök klasördeki web oyununu Flutter asset'lerine kopyalar (oyunu değiştirdikten sonra derlemeden önce çalıştır)
cd "$(dirname "$0")"
mkdir -p assets/web
cp ../index.html ../motor.js ../temalar.js ../yaris.js ../rulet.js ../tombala.js ../manifest.json ../ikon-192.png assets/web/
mkdir -p assets/web/muzik && cp ../muzik/*.mp3 assets/web/muzik/
for t in yonca seker buyucu ates korsan kuzu maya olimpos; do mkdir -p assets/web/sanat/$t && cp ../sanat/$t/*.webp assets/web/sanat/$t/; done
echo "assets/web güncellendi"
