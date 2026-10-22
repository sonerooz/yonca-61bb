import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:webview_flutter/webview_flutter.dart';

// Şanslı Yonca: oyunun kendisi assets/web içindeki web sürümü (kök klasördeki index.html + motor.js ile aynı)
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
        title: 'Şanslı Yonca',
        debugShowCheckedModeBanner: false,
        home: OyunEkrani(),
      );
}

class OyunEkrani extends StatefulWidget {
  const OyunEkrani({super.key});

  @override
  State<OyunEkrani> createState() => _OyunEkraniState();
}

class _OyunEkraniState extends State<OyunEkrani> {
  late final WebViewController _web = WebViewController()
    ..setJavaScriptMode(JavaScriptMode.unrestricted)
    ..setBackgroundColor(const Color(0xFF06210F))
    ..loadFlutterAsset('assets/web/index.html');

  @override
  Widget build(BuildContext context) => Scaffold(
        backgroundColor: const Color(0xFF06210F),
        body: SafeArea(child: WebViewWidget(controller: _web)),
      );
}
