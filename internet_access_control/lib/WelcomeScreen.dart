import 'package:flutter/material.dart';
import 'loginScreen.dart';
import 'regScreen.dart';

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Get screen dimensions
    double screenHeight = MediaQuery.of(context).size.height;
    double screenWidth = MediaQuery.of(context).size.width;

    return Scaffold(
      body: Container(
        height: double.infinity,
        width: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(colors: [
            Color.fromARGB(255, 255, 244, 241),
            Color.fromARGB(255, 255, 244, 241),
          ]),
        ),
        child: Column(
          children: [
            SizedBox(
              height:
                  screenHeight * 0.2, // 20% of the screen height for spacing
            ),
            Center(
              child: Image.asset(
                'assets/images/iac_logo_b.jpg',
                width: screenWidth * 0.5, // 50% of screen width
                height: screenWidth * 0.5, // Maintain aspect ratio
              ),
            ),
            SizedBox(
              height:
                  screenHeight * 0.05, // 5% of the screen height for spacing
            ),
            const Text(
              'Welcome to IAC',
              style: TextStyle(
                fontSize: 38,
                color: Color.fromARGB(255, 128, 0, 0),
              ),
              textAlign: TextAlign.center,
            ),
            SizedBox(
              height: screenHeight * 0.05, // Additional spacing
            ),
            GestureDetector(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const LoginScreen()),
                );
              },
              child: Container(
                height: screenHeight * 0.07, // 7% of the screen height
                width: screenWidth * 0.8, // 80% of the screen width
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(30),
                  border:
                      Border.all(color: const Color.fromARGB(255, 128, 0, 0)),
                ),
                child: const Center(
                  child: Text(
                    'Log in',
                    style: TextStyle(
                      fontSize: 30, // Adjusted for smaller screens
                      fontWeight: FontWeight.bold,
                      color: Color.fromARGB(255, 128, 0, 0),
                    ),
                  ),
                ),
              ),
            ),
            SizedBox(
              height: screenHeight * 0.03, // Adjust spacing
            ),
            GestureDetector(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const RegScreen()),
                );
              },
              child: Container(
                height: screenHeight * 0.07, // 7% of the screen height
                width: screenWidth * 0.8, // 80% of the screen width
                decoration: BoxDecoration(
                  color: const Color.fromARGB(255, 128, 0, 0),
                  borderRadius: BorderRadius.circular(30),
                  border:
                      Border.all(color: const Color.fromARGB(255, 128, 0, 0)),
                ),
                child: const Center(
                  child: Text(
                    'Register',
                    style: TextStyle(
                      fontSize: 30,
                      fontWeight: FontWeight.bold,
                      color: Color.fromARGB(255, 255, 244, 241),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
