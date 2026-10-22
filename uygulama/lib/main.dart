import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:webview_flutter/webview_flutter.dart';

// Şans Sarayı: oyun GitHub Pages'ten canlı açılır (güncellemeler kurulumsuz gelir).
// İnternet yoksa uygulamanın içindeki kopya (assets/web) açılır.
// İlk sürümler bakiyeyi yerel kopyanın (file://) deposunda tutuyordu → bir kez canlı siteye taşınır.
const canliAdres = 'https://sonerooz.github.io/yonca-61bb/';
const anahtar = 'sansli_yonca_v1';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);
  SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
    statusBarColor: Color(0xFF0A2E18),
    statusBarIconBrightness: Brightness.light,
    statusBarBrightness: Brightness.dark,
    systemNavigationBarColor: Color(0xFF06210F),
  ));
  runApp(const YoncaUygulama());
}

class YoncaUygulama extends StatelessWidget {
  const YoncaUygulama({super.key});

  @override
  Widget build(BuildContext context) => const MaterialApp(
        title: 'Şans Sarayı',
        debugShowCheckedModeBanner: false,
        home: OyunEkrani(),
      );
}

class OyunEkrani extends StatefulWidget {
  const OyunEkrani({super.key});

  @override
  State<OyunEkrani> createState() => _OyunEkraniState();
}

enum _Asama { eskiOku, canli, yedek }

class _OyunEkraniState extends State<OyunEkrani> {
  late final WebViewController _web;
  late SharedPreferences _ayar;
  _Asama _asama = _Asama.canli;

  @override
  void initState() {
    super.initState();
    _web = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(const Color(0xFF06210F))
      ..setNavigationDelegate(NavigationDelegate(
        onPageFinished: _sayfaBitti,
        onWebResourceError: (h) {
          // canlı site açılamadıysa (internet yok) yerel kopyaya düş
          if (_asama == _Asama.canli && (h.isForMainFrame ?? true)) {
            _asama = _Asama.yedek;
            _web.loadFlutterAsset('assets/web/index.html');
          }
        },
      ));
    _basla();
  }

  Future<void> _basla() async {
    _ayar = await SharedPreferences.getInstance();
    if (!(_ayar.getBool('eski_okundu') ?? false)) {
      _asama = _Asama.eskiOku; // önce yerel kopyayı açıp eski bakiyeyi oku
      await _web.loadFlutterAsset('assets/web/index.html');
    } else {
      await _web.loadRequest(Uri.parse(canliAdres));
    }
  }

  Future<void> _sayfaBitti(String url) async {
    if (_asama == _Asama.eskiOku) {
      try {
        final v = await _web.runJavaScriptReturningResult("localStorage.getItem('$anahtar') || ''");
        var s = v is String ? v : v.toString();
        if (s.startsWith('"')) s = jsonDecode(s) as String; // Android sonucu JSON dizgesi olarak döndürür
        if (s.length > 2) await _ayar.setString('eski_veri', s);
      } catch (_) {}
      await _ayar.setBool('eski_okundu', true);
      _asama = _Asama.canli;
      await _web.loadRequest(Uri.parse(canliAdres));
      return;
    }
    if (_asama == _Asama.canli && url.startsWith(canliAdres)) {
      final eski = _ayar.getString('eski_veri');
      if (eski != null && !(_ayar.getBool('eski_tasindi') ?? false)) {
        // canlı sitede kayıt yoksa eski bakiyeyi yaz ve sayfayı yenile
        final js = eski.replaceAll(r'\', r'\\').replaceAll("'", r"\'");
        await _web.runJavaScript("if (!localStorage.getItem('$anahtar')) { localStorage.setItem('$anahtar', '$js'); location.reload(); }");
        await _ayar.setBool('eski_tasindi', true);
      }
    }
  }

  @override
  Widget build(BuildContext context) => Scaffold(
        backgroundColor: const Color(0xFF06210F),
        body: SafeArea(child: WebViewWidget(controller: _web)),
      );
}
