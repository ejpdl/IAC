import 'package:flutter/material.dart';
import 'package:fluid_bottom_nav_bar/fluid_bottom_nav_bar.dart';
import 'package:image_picker/image_picker.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'computerpage.dart';
import 'historypage.dart';
import 'ManageProfilePage.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Internet Access Control',
      theme: ThemeData(
        primaryColor: Color.fromARGB(255, 128, 0, 0), // Maroon color
        scaffoldBackgroundColor:
            Color.fromARGB(255, 255, 244, 241), // Bridal white
      ),
      home: Homepage(), // This will be the first page after sign-in
    );
  }
}

class Homepage extends StatefulWidget {
  const Homepage({Key? key}) : super(key: key);

  @override
  _HomepageState createState() => _HomepageState();
}

class _HomepageState extends State<Homepage> {
  int _currentIndex = 0; // Set default index to 1 (Home page)

  final List<Widget> _pages = [
    HomePage(), // Home page (default after sign-in)
    ComputerPage(),
    HistoryPage(),
    ManageProfilePage(),
  ];

  // This ensures we go directly to the home page after sign-in
  @override
  void initState() {
    super.initState();
    _currentIndex = 0; // Automatically navigate to the Home page
  }

  void _handleNavigationChange(int newIndex) {
    setState(() {
      _currentIndex = newIndex;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBody: true,
      body: _pages[_currentIndex],
      bottomNavigationBar: FluidNavBar(
        icons: [
          FluidNavBarIcon(icon: Icons.person),
          FluidNavBarIcon(icon: Icons.computer_sharp),
          FluidNavBarIcon(icon: Icons.history),
          FluidNavBarIcon(icon: Icons.settings),
        ],
        onChange: _handleNavigationChange,
        style: const FluidNavBarStyle(
          barBackgroundColor: Color.fromARGB(255, 128, 0, 0),
          iconBackgroundColor: Color.fromARGB(255, 128, 0, 0),
          iconSelectedForegroundColor: Color.fromARGB(255, 255, 255, 255),
          iconUnselectedForegroundColor: Color.fromARGB(255, 255, 255, 255),
        ),
      ),
    );
  }
}

// HomePage with exact layout from the provided image
class HomePage extends StatefulWidget {
  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  String firstName = '';
  String lastName = '';
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchStudentData();
  }

  Future<void> _fetchStudentData() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final studentId = prefs.getString('studentId');

      if (studentId == null) {
        setState(() {
          isLoading = false;
          firstName = 'User';
          lastName = '';
        });
        return;
      }

      final response = await http.get(
        Uri.parse('https://flutterapi-q64f.onrender.com/userdata/student/$studentId'),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          firstName = data['first_name'] ?? '';
          lastName = data['last_name'] ?? '';
          isLoading = false;
        });
      } else {
        setState(() {
          isLoading = false;
          firstName = 'User';
          lastName = '';
        });
      }
    } catch (e) {
      setState(() {
        isLoading = false;
        firstName = 'User';
        lastName = '';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          Container(
            height: 250,
            width: double.infinity,
            decoration: const BoxDecoration(
              gradient: LinearGradient(colors: [
                Color.fromARGB(255, 128, 0, 0),
                Color.fromARGB(255, 128, 0, 0),
              ]),
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(top: 200.0),
            child: Container(
              decoration: const BoxDecoration(
                color: Color.fromARGB(255, 255, 244, 241),
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(50),
                  topRight: Radius.circular(50),
                ),
              ),
              height: double.infinity,
              width: double.infinity,
              child: Padding(
                padding: const EdgeInsets.all(8.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text(
                      'Welcome,',
                      style: TextStyle(
                        fontSize: 22,
                        color: Colors.black54,
                        fontWeight: FontWeight.w300,
                      ),
                    ),
                    const SizedBox(height: 5),
                    isLoading
                        ? const CircularProgressIndicator(
                            valueColor: AlwaysStoppedAnimation<Color>(
                              Color.fromARGB(255, 128, 0, 0),
                            ),
                          )
                        : Text(
                            '$firstName $lastName',
                            style: const TextStyle(
                              fontSize: 28,
                              fontWeight: FontWeight.bold,
                              color: Color.fromARGB(255, 128, 0, 0),
                            ),
                          ),
                    const SizedBox(height: 15),
                    const Divider(thickness: 1, color: Colors.black26),
                    const SizedBox(height: 10),
                    const Text(
                      'About Internet Access Control',
                      style: TextStyle(
                        fontSize: 18,
                        color: Colors.black87,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 20),
                    const Text(
                      'The Internet Access Control (IAC) Center is a dedicated'
                      'facility within the university designed to provide students '
                      'with reliable access to computers and internet resources.'
                      'It serves as a central hub for academic and research activities,'
                      'offering a well-equipped environment to support learning,'
                      'digital literacy, and technical skill development.',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors.black87,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          Positioned(
            top: 75,
            left: (MediaQuery.of(context).size.width - 250) / 2,
            child: Container(
              height: 250,
              width: 250,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.grey.shade300,
                border: Border.all(color: Colors.white, width: 7),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.3),
                    spreadRadius: 5,
                    blurRadius: 10,
                    offset: const Offset(0, 5),
                  ),
                ],
              ),
              child: const Icon(
                Icons.person,
                size: 200,
                color: Color.fromARGB(255, 128, 0, 0),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
