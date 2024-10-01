import 'package:flutter/material.dart';
import 'package:fluid_bottom_nav_bar/fluid_bottom_nav_bar.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';

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
  int _currentIndex = 1; // Set default index to 1 (Home page)

  final List<Widget> _pages = [
    ComputerPage(),
    HomePage(), // Home page (default after sign-in)
    HistoryPage(),
  ];

  // This ensures we go directly to the home page after sign-in
  @override
  void initState() {
    super.initState();
    _currentIndex = 1; // Automatically navigate to the Home page
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
          FluidNavBarIcon(icon: Icons.computer_sharp),
          FluidNavBarIcon(icon: Icons.person),
          FluidNavBarIcon(icon: Icons.history),
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
  final String userName = 'Azraelu Morningstar'; // Example username

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  File? _image;

  Future<void> _pickImage() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);
    setState(() {
      if (pickedFile != null) {
        _image = File(pickedFile.path);
      } else {
        _image = null;
      }
    });
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

              child: const Padding(
                padding: EdgeInsets.all(8.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Welcome,',
                      style: TextStyle(
                        fontSize: 22,
                        color: Colors.black54,
                        fontWeight: FontWeight.w300,
                      ),
                    ),
                    SizedBox(height: 5),

                    Text(
                      'Azraelu Morningstar',
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        color: Color.fromARGB(255, 128, 0, 0), // Maroon
                      ),
                    ),
                    SizedBox(height: 15),
                    Divider(thickness: 1, color: Colors.black26),
                    SizedBox(height: 10),
                    Text(
                      'About Internet Access Control',
                      style: TextStyle(
                        fontSize: 18,
                        color: Colors.black87,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    SizedBox(height: 20),
                    Text(
                      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, '
                      'vulputate eu pharetra nec, mattis ac neque.',
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
            child: GestureDetector(
              onTap: _pickImage,
              child: Container(
                height: 250,
                width: 250,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(
                      color: Colors.white, width: 7), // White border
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.3),
                      spreadRadius: 5,
                      blurRadius: 10,
                      offset: const Offset(0, 5), // Shadow effect
                    ),
                  ],
                ),
                child: ClipOval(
                  child: _image != null
                      ? Image.file(_image!, fit: BoxFit.cover)
                      : Image.asset(
                          'assets/profile_picture.png', // Default profile picture
                          fit: BoxFit.cover,
                        ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// Other pages
class ComputerPage extends StatelessWidget {
  // Dummy data for computer statuses
  final List<Map<String, dynamic>> computerStatus = [
    {'pc': 'PC 1', 'status': 'Available', 'color': Colors.green},
    {'pc': 'PC 2', 'status': 'Occupied', 'color': Color.fromARGB(255, 128, 0, 0)},
    {'pc': 'PC 3', 'status': 'Occupied', 'color': Color.fromARGB(255, 128, 0, 0)},
    {'pc': 'PC 4', 'status': 'Available', 'color': Colors.green},
    {'pc': 'PC 5', 'status': 'Available', 'color': Colors.green},
    {'pc': 'PC 6', 'status': 'Occupied', 'color': Color.fromARGB(255, 128, 0, 0)},
    {'pc': 'PC 7', 'status': 'Occupied', 'color': Color.fromARGB(255, 128, 0, 0)},
    {'pc': 'PC 8', 'status': 'Available', 'color': Colors.green},
    {'pc': 'PC 9', 'status': 'Occupied', 'color': Color.fromARGB(255, 128, 0, 0)},
    {'pc': 'PC 10', 'status': 'Available', 'color': Colors.green},
    {'pc': 'PC 11', 'status': 'Occupied', 'color': Color.fromARGB(255, 128, 0, 0)},
    {'pc': 'PC 12', 'status': 'Occupied', 'color': Color.fromARGB(255, 128, 0, 0)},
    {'pc': 'PC 13', 'status': 'Available', 'color': Colors.green},
    {'pc': 'PC 14', 'status': 'Available', 'color': Colors.green},
    {'pc': 'PC 15', 'status': 'Available', 'color': Colors.green},
    {'pc': 'PC 16', 'status': 'Available', 'color': Colors.green},
    {'pc': 'PC 17', 'status': 'Available', 'color': Colors.green},
    {'pc': 'PC 18', 'status': 'Occupied', 'color': const Color.fromARGB(255, 128, 0, 0)},
    {'pc': 'PC 19', 'status': 'Available', 'color': Colors.green},
    {'pc': 'PC 20', 'status': 'Available', 'color': Colors.green},
    {'pc': 'PC 21', 'status': 'Occupied', 'color': const Color.fromARGB(255, 128, 0, 0)},
    {'pc': 'PC 22', 'status': 'Available', 'color': Colors.green},
    {'pc': 'PC 23', 'status': 'Occupied', 'color': const Color.fromARGB(255, 128, 0, 0)},
    {'pc': 'PC 24', 'status': 'Available', 'color': Colors.green},
    {'pc': 'PC 25', 'status': 'Available', 'color': Colors.green},
    {'pc': 'PC 26', 'status': 'Occupied', 'color': const Color.fromARGB(255, 128, 0, 0)},
    {'pc': 'PC 27', 'status': 'Available', 'color': Colors.green},
    {'pc': 'PC 28', 'status': 'Available', 'color': Colors.green},
    {'pc': 'PC 29', 'status': 'Occupied', 'color': const Color.fromARGB(255, 128, 0, 0)},
    {'pc': 'PC 30', 'status': 'Available', 'color': Colors.green},
    // Add more PCs if needed
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          Container(
            height: double.infinity,
            width: double.infinity,
            decoration: const BoxDecoration(
              gradient: LinearGradient(colors: [
                Color.fromARGB(255, 128, 0, 0),
                Color.fromARGB(255, 128, 0, 0),
              ]),
            ),
            child: const Padding(
              padding: EdgeInsets.only(top: 60.0, left: 22),
              child: Text(
                'Available PC',
                style: TextStyle(
                  fontFamily: 'Roboto',
                  fontSize: 40,
                  color: Color.fromARGB(255, 255, 255, 255),
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(top: 150.0),
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
                padding: const EdgeInsets.all(20.0),
                child: GridView.builder(
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 3, // 3 PCs in each row
                    mainAxisSpacing: 20,
                    crossAxisSpacing: 20,
                    childAspectRatio: 1,
                  ),
                  itemCount: computerStatus.length,
                  itemBuilder: (context, index) {
                    return GestureDetector(
                      onTap: () => _showComputerDialog(
                        context,
                        computerStatus[index]['pc'],
                        computerStatus[index]['status'],
                        computerStatus[index]['color'],
                      ),
                      child: _buildComputerStatusCard(
                        computerStatus[index]['pc'],
                        computerStatus[index]['status'],
                        computerStatus[index]['color'],
                      ),
                    );
                  },
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // Widget to build each computer card
  Widget _buildComputerStatusCard(String pc, String status, Color statusColor) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(10),
        boxShadow: [
          BoxShadow(
            color: const Color.fromARGB(255, 84, 81, 81).withOpacity(0.5),
            spreadRadius: 2,
            blurRadius: 4,
            offset: const Offset(0, 3), // changes position of shadow
          ),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(
            Icons.computer,
            size: 50,
            color: Colors.grey,
          ),
          const SizedBox(height: 10),
          Text(
            pc,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 5),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                status,
                style: const TextStyle(fontSize: 14),
              ),
              const SizedBox(width: 5),
              Icon(
                Icons.circle,
                size: 12,
                color: statusColor,
              ),
            ],
          ),
        ],
      ),
    );
  }

  // Function to show a popup dialog when a PC is clicked
  void _showComputerDialog(BuildContext context, String pc, String status, Color statusColor) {
    showDialog(
      context: context,
      barrierDismissible: false, // Prevent dismissing by touching outside the dialog
      builder: (BuildContext context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20.0),
          ),
          contentPadding: const EdgeInsets.all(16.0),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Close (X) button at the top-right corner
              Align(
                alignment: Alignment.topRight,
                child: IconButton(
                  icon: const Icon(
                    Icons.close_rounded,
                    color: Color.fromARGB(255, 128, 0, 0),
                    size: 30,
                  ),
                  onPressed: () {
                    Navigator.of(context).pop(); // Close the dialog when X is pressed
                  },
                ),
              ),
              const Icon(
                Icons.computer,
                size: 100,
                color: Color.fromARGB(255, 84, 81, 81),
              ),
              const SizedBox(height: 10),
              Text(
                pc,
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 10),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    status,
                    style: const TextStyle(fontSize: 18),
                  ),
                  const SizedBox(width: 10),
                  Icon(
                    Icons.circle,
                    size: 18,
                    color: statusColor,
                  ),
                ],
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: () {
                  // Do something, e.g., request session
                  Navigator.of(context).pop(); // Close the dialog
                },
                child: const Text('Request Session'),
                style: ElevatedButton.styleFrom(
                  foregroundColor: Colors.white, backgroundColor: const Color.fromARGB(255, 128, 0, 0), // text color
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

class HistoryPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          Container(
            height: double.infinity,
            width: double.infinity,
            decoration: const BoxDecoration(
              gradient: LinearGradient(colors: [
                Color.fromARGB(255,128, 0, 0),
                Color.fromARGB(255, 128, 0, 0),
              ]),
            ),
            child: const Padding(
              padding: EdgeInsets.only(top: 60.0, left: 22),
              child: Text(
                'History',
                style: TextStyle(
                  fontFamily: 'Roboto',
                  fontSize: 40,
                  color: Color.fromARGB(255, 255, 255, 255),
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(top: 150.0),
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
              child: const Padding(
                 padding: EdgeInsets.all(8.0),
                 child: Column(
                  children: [
                    Text('History'),
                  ],
                 ),
              ),
              
            ),
          ),
        ],
      ),
    );
  }
}
