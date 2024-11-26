import 'package:flutter/material.dart';
import 'dart:async';
import 'WelcomeScreen.dart';

class SplashScreen extends StatefulWidget {
  @override
  _SplashScreenState createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _logoAnimation;

  @override
  void initState() {
    super.initState();

    // Initialize AnimationController with 6 seconds duration
    _controller = AnimationController(
      duration: const Duration(seconds: 6),
      vsync: this,
    );

    // Create the bounce effect using TweenSequence
    _logoAnimation = TweenSequence([
      // Start from above the screen (-1.0) and drop to the center (0.0)
      TweenSequenceItem(
        tween: Tween<double>(begin: -1.0, end: 0.0)
            .chain(CurveTween(curve: Curves.easeInOut)),
        weight: 25,
      ),
      // First bounce up and down
      TweenSequenceItem(
        tween: Tween<double>(begin: 0.0, end: 0.4)
            .chain(CurveTween(curve: Curves.easeOut)),
        weight: 15,
      ),
      TweenSequenceItem(
        tween: Tween<double>(begin: 0.4, end: 0.0)
            .chain(CurveTween(curve: Curves.easeInOut)),
        weight: 10,
      ),
      // Second smaller bounce
      TweenSequenceItem(
        tween: Tween<double>(begin: 0.0, end: 0.2)
            .chain(CurveTween(curve: Curves.easeOut)),
        weight: 10,
      ),
      TweenSequenceItem(
        tween: Tween<double>(begin: 0.2, end: 0.0)
            .chain(CurveTween(curve: Curves.easeInOut)),
        weight: 5,
      ),
      // Final small bounce
      TweenSequenceItem(
        tween: Tween<double>(begin: 0.0, end: 0.1)
            .chain(CurveTween(curve: Curves.easeOut)),
        weight: 5,
      ),
      TweenSequenceItem(
        tween: Tween<double>(begin: 0.1, end: 0.0)
            .chain(CurveTween(curve: Curves.easeInOut)),
        weight: 5,
      ),
    ]).animate(_controller)
      ..addStatusListener((status) {
        if (status == AnimationStatus.completed) {
          // Pause at the center for 3 seconds
          Timer(const Duration(seconds: 1), () {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => const WelcomeScreen()),
            );
          });
        }
      });

    // Start the animation
    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    double screenHeight = MediaQuery.of(context).size.height;
    double screenWidth = MediaQuery.of(context).size.width;

    return Scaffold(
      backgroundColor: const Color.fromARGB(255, 255, 244, 241),
      body: AnimatedBuilder(
        animation: _controller,
        builder: (context, child) {
          // Adjust position for falling and bouncing in the center
          double topPosition =
              (screenHeight * 0.3) * (1 + _logoAnimation.value);

          return Stack(
            children: [
              Positioned(
                top: topPosition,
                left: 0,
                right: 0,
                child: Center(
                  child: Image.asset(
                    'assets/images/iac_logo_b.jpg',
                    width: screenWidth * 0.6,
                    height: screenWidth * 0.6,
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
