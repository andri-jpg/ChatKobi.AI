// ignore_for_file: deprecated_member_use

import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class About extends StatelessWidget {
  const About({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('About'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            const Text(
              'Chatkobi.AI',
              style: TextStyle(
                fontSize: 24.0,
                fontWeight: FontWeight.bold,
                fontFamily: 'oxygen',
              ),
            ),
            const SizedBox(height: 8.0),
            const Text(
              'Tentang projek ChatKobi.AI: Ini adalah aplikasi chatbot offline untuk desktop yang kali ini saya implementasikan menjadi aplikasi mobile dengan Flutter. Aplikasi ini bertujuan untuk memberikan informasi medis umum kepada pengguna, meskipun dengan peringatan bahwa informasi tersebut hanya referensi tambahan dan tidak menggantikan konsultasi medis langsung. Proyek ini bersifat open-source dengan lisensi MIT, yang berarti pengguna dapat mengakses dan mendistribusikan kode sumbernya sesuai dengan ketentuan lisensi. Untuk informasi lebih lanjut dan untuk mengakses kode sumber proyek, Anda dapat mengunjungi repositori GitHub',
              style: TextStyle(fontSize: 16.0,
              fontFamily: 'oxygen'),
            ),
          
            const SizedBox(height: 16.0),
            InkWell(
              child: const Text(
                'Chatkobi.AI',
                style: TextStyle(
                  fontSize: 18.0,
                  fontFamily: 'oxygen',
                  color: Colors.blue,
                ),
              ),
              onTap: () async {
                const url = 'https://github.com/andri-jpg/chatkobi.ai'; 
                if (await canLaunch(url)) {
                  await launch(url);
                  } else {
                    throw 'Tidak dapat membuka tautan $url';
                    }
                    },
            ),
          ],
        ),
      ),
    );
  }
}
