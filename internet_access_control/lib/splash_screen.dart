import 'package:flutter/material.dart';
import 'dart:async';
import 'WelcomeScreen.dart';

class SplashScreen extends StatefulWidget {
  @override
  _SplashScreenState createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with TickerProviderStateMixin {
  late AnimationController _fadeController;
  late Animation<double> _fadeAnimation;
  bool _isLogoCentered = false;
  bool _isTextCentered = false;
  double _opacity = 1.0; // For fading out the entire splash screen

  @override
  void initState() {
    super.initState();

    _fadeController = AnimationController(
      vsync: this,
      duration: Duration(seconds: 1),
    );
    _fadeAnimation = CurvedAnimation(
      parent: _fadeController,
      curve: Curves.easeIn,
    );

    // Step 1: Move elements to the center
    Timer(Duration(seconds: 1), () {
      setState(() {
        _isLogoCentered = true;
        _isTextCentered = true;
      });
      _fadeController.forward();
    });

    // Step 2: Wait 2 seconds after centering, then fade out
    Timer(Duration(seconds: 5), () {
      // 1 second for centering + 3 seconds of stay
      setState(() {
        _opacity = 0.0; // Start fading out
      });
      // Step 3: Navigate to WelcomeScreen after fade-out
      Timer(Duration(seconds: 1), () {
        // Wait for fade-out to complete
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => WelcomeScreen()),
        );
      });
    });
  }

  @override
  void dispose() {
    _fadeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color.fromARGB(255, 255, 244, 241),
      body: AnimatedOpacity(
        duration: Duration(seconds: 1), // Duration of the fade-out
        opacity: _opacity,
        child: Stack(
          children: [
            AnimatedPositioned(
              duration: const Duration(seconds: 3), // Duration for centering
              curve: Curves.easeOut,
              top: _isLogoCentered
                  ? MediaQuery.of(context).size.height * 0.26
                  : 0,
              left: 0,
              right: 0,
              child: Center(
                child: Image.asset(
                  'assets/images/top_logo.jpg',
                  width: 300,
                  height: 300,
                ),
              ),
            ),
            AnimatedPositioned(
              duration: const Duration(seconds: 3), // Duration for centering
              curve: Curves.easeOut,
              bottom: _isTextCentered
                  ? MediaQuery.of(context).size.height * 0.26
                  : 0,
              left: 0,
              right: 0,
              child: Center(
                child: FadeTransition(
                  opacity: _fadeAnimation,
                  child: Image.asset(
                    'assets/images/bottom_logo.jpg',
                    width: 300,
                    height: 300,
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
