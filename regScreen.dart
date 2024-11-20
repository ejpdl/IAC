import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:internet_access_control/loginScreen.dart';

class RegScreen extends StatefulWidget {
  const RegScreen({Key? key}) : super(key: key);

  @override
  _RegScreenState createState() => _RegScreenState();
}

class _RegScreenState extends State<RegScreen> {
  bool _obscureText = true;
  bool _obscureTextConfirm = true;
  bool _isLoading = false;

  String? selectedYearLevel;
  String? selectedCourse;

  final TextEditingController _sidController = TextEditingController();
  final TextEditingController _fnameController = TextEditingController();
  final TextEditingController _lnameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController =
      TextEditingController();

  final List<String> yearLevels = [
    '1st Year',
    '2nd Year',
    '3rd Year',
    '4th Year',
  ];

  final List<String> courses = [
    'BS In Computer Science',
    'BS In Engineering',
    'BS In Accountacy',
    'BS In Business Administration',
    'BS In Education',
    'BS In Nursing',
  ];

  // Function to handle registration logic
  Future<void> _register() async {
    final String sid = _sidController.text;
    final String firstname = _fnameController.text;
    final String lastname = _lnameController.text;
    final String yrlvl = selectedYearLevel ?? '';
    final String course = selectedCourse ?? '';
    final String password = _passwordController.text;
    final String confirmPassword = _confirmPasswordController.text;

    // Simple Validation
    if (sid.isEmpty ||
        firstname.isEmpty ||
        lastname.isEmpty ||
        yrlvl.isEmpty ||
        course.isEmpty ||
        password.isEmpty ||
        confirmPassword.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fill in all fields')),
      );
      return;
    }
    if (password != confirmPassword) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Passwords do not match')),
      );
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      var url = "http://127.0.0.1:4000/userdata/register";

      final response = await http.post(
        Uri.parse(url),
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode({
          'sid': sid,
          'firstname': firstname,
          'lastname': lastname,
          'yrlvl': yrlvl,
          'course': course,
          'password': password,
        }),
      );

      if (response.statusCode == 201) {
        // Successful Registration
        final data = jsonDecode(response.body);

        // Handle successful registration
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
              builder: (context) => const LoginScreen()), // Redirect to login
        );

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Successfully Registered!')),
        );
      } else {
        // Show error message if registration fails
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text('Registration Failed: ${response.statusCode}')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: $e')),
      );
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

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
                Color.fromARGB(255, 255, 244, 241),
                Color.fromARGB(255, 255, 244, 241),
              ]),
            ),
            child: const Padding(
              padding: EdgeInsets.only(top: 60.0, left: 22),
              child: Text(
                'Create Your\nAccount',
                style: TextStyle(
                    fontFamily: 'NotoSerif',
                    fontSize: 35,
                    color: Color.fromARGB(255, 128, 0, 0),
                    fontWeight: FontWeight.bold),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(top: 200.0),
            child: Container(
              decoration: const BoxDecoration(
                borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(40),
                    topRight: Radius.circular(40)),
                color: Color.fromARGB(255, 128, 0, 0),
              ),
              height: double.infinity,
              width: double.infinity,
              child: SingleChildScrollView(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 18.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const SizedBox(height: 20),
                      TextField(
                        controller: _sidController,
                        style: const TextStyle(color: Colors.white),
                        decoration: const InputDecoration(
                          suffixIcon: Icon(
                            Icons.check,
                            color: Colors.grey,
                          ),
                          label: Text(
                            'Student ID',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          hintText: 'A**-****',
                        ),
                      ),
                      const SizedBox(height: 20),
                      TextField(
                        controller: _fnameController,
                        style: const TextStyle(color: Colors.white),
                        decoration: const InputDecoration(
                            suffixIcon: Icon(
                              Icons.abc_outlined,
                              color: Color.fromARGB(255, 226, 221, 221),
                            ),
                            label: Text(
                              'First Name',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            )),
                      ),
                      const SizedBox(height: 20),
                      TextField(
                        controller: _lnameController,
                        style: const TextStyle(color: Colors.white),
                        decoration: const InputDecoration(
                            suffixIcon: Icon(
                              Icons.abc_outlined,
                              color: Color.fromARGB(255, 226, 221, 221),
                            ),
                            label: Text(
                              'Last Name',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            )),
                      ),
                      const SizedBox(height: 20),
                      DropdownButtonFormField<String>(
                        value: selectedYearLevel,
                        items: yearLevels.map((String level) {
                          return DropdownMenuItem<String>(
                            value: level,
                            child: Text(
                              level,
                              style: TextStyle(
                                // Menu items will be black
                                color: const Color.fromARGB(255, 0, 0, 0),
                              ),
                            ),
                          );
                        }).toList(),
                        onChanged: (String? newValue) {
                          setState(() {
                            selectedYearLevel = newValue;
                            });
                        },
                        selectedItemBuilder: (BuildContext context) {
                          return yearLevels.map((String value) {
                            return Text(
                              value,
                              style: const TextStyle(
                                color:
                                    Colors.white, // Selected text will be white
                              ),
                            );
                          }).toList();
                        },
                        decoration: const InputDecoration(
                          label: Text(
                            'Year Level',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                        ),
                        dropdownColor: Colors.white,
                        icon: const Icon(
                          Icons.arrow_drop_down,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 20),
                      DropdownButtonFormField<String>(
                        value: selectedCourse,
                        items: courses.map((String course) {
                          return DropdownMenuItem<String>(
                            value: course,
                            child: Text(
                              course,
                              style: const TextStyle(
                                // Menu items will be black
                                color: Color.fromARGB(255, 0, 0, 0),
                              ),
                            ),
                          );
                        }).toList(),
                        onChanged: (String? newValue) {
                          setState(() {
                            selectedCourse = newValue;
                          });
                        },
                        selectedItemBuilder: (BuildContext context) {
                          return courses.map((String value) {
                            return Text(
                              value,
                              style: const TextStyle(
                                color:
                                    Colors.white, // Selected text will be white
                              ),
                            );
                          }).toList();
                        },
                        decoration: const InputDecoration(
                          label: Text(
                            'Course',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              color: Color.fromARGB(255, 255, 255, 255),
                            ),
                          ),
                        ),
                        dropdownColor: Colors.white,
                        icon: const Icon(
                          Icons.arrow_drop_down,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 20),
                      TextField(
                        controller: _passwordController,
                        style: const TextStyle(color: Colors.white),
                        decoration: InputDecoration(
                            suffixIcon: IconButton(
                              icon: Icon(_obscureText
                                  ? Icons.visibility_off
                                  : Icons.visibility),
                              color: Colors.grey,
                              onPressed: () {
                                setState(() {
                                  _obscureText = !_obscureText;
                                });
                              },
                            ),
                            label: const Text(
                              'Password',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            )),
                        obscureText: _obscureText,
                      ),
                      const SizedBox(height: 20),
                      TextField(
                        controller: _confirmPasswordController,
                        style: const TextStyle(color: Colors.white),
                        decoration: InputDecoration(
                            suffixIcon: IconButton(
                              icon: Icon(_obscureTextConfirm
                                  ? Icons.visibility_off
                                  : Icons.visibility),
                              color: Colors.grey,
                              onPressed: () {
                                setState(() {
                                  _obscureTextConfirm = !_obscureTextConfirm;
                                });
                              },
                            ),
                            label: const Text(
                              'Confirm Password',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            )),
                        obscureText: _obscureTextConfirm,
                      ),
                      const SizedBox(height: 80),
                      Container(
                        height: 55,
                        width: 300,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(30),
                          gradient: const LinearGradient(colors: [
                            Color.fromARGB(255, 255, 255, 255),
                            Color.fromARGB(255, 255, 255, 255),
                          ]),
                        ),
                        child: Center(
                          child: TextButton(
                            onPressed: () {
                              _register(); // Call the _register function
                            },
                            child: const Text(
                              'Create Account',
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                                color: Color.fromARGB(255, 128, 0, 0),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
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
