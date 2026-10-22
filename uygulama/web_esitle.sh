#!/bin/sh
# kök klasördeki web oyununu Flutter asset'lerine kopyalar (oyunu değiştirdikten sonra derlemeden önce çalıştır)
cd "$(dirname "$0")"
mkdir -p assets/web
cp ../index.html ../motor.js ../temalar.js ../manifest.json ../ikon-192.png assets/web/
echo "assets/web güncellendi"
