import 'package:flutter/material.dart';
import 'about.dart';
import 'chat.dart';
import 'daftar.dart';

class Dashboard extends StatelessWidget {
  const Dashboard({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          image: DecorationImage(
            image: AssetImage('images/arona.jpg'),
            fit: BoxFit.cover,
          ),
        ),
        child: ListView(
          children: <Widget>[
            const SizedBox(height: 40.0),
            Container(
              alignment: Alignment.centerLeft,
              padding: const EdgeInsets.all(30),
              child: const Text(
                'Chatkobi.AI\nMobile',
                style: TextStyle(
                  fontSize: 40,
                  color: Colors.white,
                  fontFamily: 'oxygen',
                ),
              ),
            ),
            const SizedBox(height: 100.0),
            Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: <Widget>[
                      _buildTileButton('Chatbot', context, () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => const ChatScreen()),
                        );
                      }, Icons.chat),
                      _buildTileButton('About', context, () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => const About()),
                        );
                      }, Icons.info),
                    ],
                  ),
                  const SizedBox(height: 10.0),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: <Widget>[
                      _buildTileButton('Daftar obat', context, () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => const DrugList()),
                        );
                      }, Icons.medication_outlined),
                      _buildTileButton('Config', context, () {
                        // Tambahkan aksi untuk Premium
                      }, Icons.settings),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTileButton(String label, BuildContext context, VoidCallback onPressed, IconData icon) {
    return SizedBox(
      width: 180,
      height: 150,
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(40.0),
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Icon(icon, size: 40.0),
            const SizedBox(height: 8.0),
            Text(label),
          ],
        ),
      ),
    );
  }
}
