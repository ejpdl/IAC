import 'package:flutter/material.dart';
import 'loginScreen.dart';
import 'regScreen.dart';

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Container(
      height: double.infinity,
      width: double.infinity,
      decoration: const BoxDecoration(
          gradient: LinearGradient(colors: [
        Color.fromARGB(255, 255, 244, 241),
        Color.fromARGB(255, 255, 244, 241),
      ])),
      child: Column(
        children: [
          const Padding(
            padding: EdgeInsets.only(top: 200.0),
            child: Center(
              child: Image(
                image: AssetImage(''),
              ),
            ),
          ),
          const SizedBox(
            height: 100,
          ),
          const Text(
            'Welcome to IAC',
            style: TextStyle(
                fontSize: 40,
                fontFamily: 'NotoSerif',
                color: Color.fromARGB(255, 128, 0, 0)),
          ),
          const SizedBox(
            height: 40,
          ),
          GestureDetector(
            onTap: () {
              Navigator.push(context,
                  MaterialPageRoute(builder: (context) => const LoginScreen()));
            },
            child: Container(
              height: 50,
              width: 300,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(30),
                border: Border.all(color: Color.fromARGB(255, 128, 0, 0)),
              ),
              child: const Center(
                  child: Text(
                'Log in',
                style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: Color.fromARGB(255, 128, 0, 0)),
              )),
            ),
          ),
          const SizedBox(
            height: 30,
          ),
          GestureDetector(
            onTap: () {
              Navigator.push(context,
                  MaterialPageRoute(builder: (context) => const RegScreen()));
            },
            child: Container(
              height: 53,
              width: 300,
              decoration: BoxDecoration(
                color: const Color.fromARGB(255, 128, 0, 0),
                borderRadius: BorderRadius.circular(30),
                border: Border.all(color: const Color.fromARGB(255, 128, 0, 0)),
              ),
              child: const Center(
                  child: Text(
                'Register',
                style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: Color.fromARGB(255, 255, 244, 241)),
              )),
            ),
          ),
        ],
      ),
    ));
  }
}
