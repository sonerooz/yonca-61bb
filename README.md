# Şanslı Yonca

Sahte parayla yonca temalı slot oyunu. Gerçek para yok, "+1.000 ₺ YÜKLE" butonu bakiyeyi istediğin kadar artırır.

- Web / PWA: https://sonerooz.github.io/yonca-61bb/ (kök klasör: `index.html`, `motor.js`)
- Mobil uygulama: `uygulama/` (Flutter; oyunu WebView içinde `assets/web/` klasöründen açar)

## iOS'a kurulum (MacBook)

Gerekenler: Xcode, Flutter SDK, CocoaPods (`brew install cocoapods`).

```sh
git clone https://github.com/sonerooz/yonca-61bb.git
cd yonca-61bb/uygulama
flutter pub get
open ios/Runner.xcworkspace
```

Xcode'da: **Runner → Signing & Capabilities → Team** kısmında kendi Apple hesabını seç (ücretsiz hesap olur),
Bundle Identifier çakışırsa `com.soner.sansliYonca` sonuna bir şey ekle. iPhone'u kabloyla bağla, üstten cihazı seç, ▶ ile çalıştır.
İlk açılışta iPhone'da **Ayarlar → Genel → VPN ve Cihaz Yönetimi**'nden geliştiriciye güven.
Komut satırından da olur: `flutter run --release` (iPhone bağlıyken).

Not: Ücretsiz Apple hesabıyla kurulan uygulama 7 gün sonra açılmaz; Mac'e bağlayıp tekrar ▶ demek yeter.

## Android

```sh
cd uygulama
flutter build apk --release --target-platform android-arm64 --split-per-abi
```

## Oyunu değiştirince

Kökteki `index.html` / `motor.js` değişirse uygulamaya almak için `sh uygulama/web_esitle.sh`, sonra yeniden derle.
Web sürümü için `sw.js` içindeki `SURUM`'u artır (yoksa telefon eski sürümü önbellekten açar).
