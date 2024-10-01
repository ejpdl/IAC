import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import 'package:internet_access_control/homepage.dart';
import 'package:internet_access_control/regScreen.dart';


class LoginScreen extends StatefulWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  // ignore: library_private_types_in_public_api
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  bool _obscureText = true;
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool _isLoading = false;

  // Funtion to handle login logic
  Future<void> _login() async {

    final String email = _emailController.text;
    final String password = _passwordController.text;

  // Simple Validation
  if(email.isEmpty || password.isEmpty){

    ScaffoldMessenger.of(context).showSnackBar(

      const SnackBar(content: Text('Please fill in all fields')),

    );

    return;

  }

  setState((){

    _isLoading = true;

  });

  try{

    var url = "http://127.0.0.1:3000/userdata/login";

    final response = await http.post(

      Uri.parse(url),
      headers: {

        'Content-Type'  : 'application/json; charset=UTF-8'

      },
      body: jsonEncode({'email': email, 'password': password }),

    );

    if(response.statusCode == 200){

      // Successful Login
      final data = jsonDecode(response.body);

      // Handle Login (if) success == true
      Navigator.pushReplacement(
        
        context,
        MaterialPageRoute(builder: (context) => const Homepage()),

      );

    }else{

      // Show error message
      ScaffoldMessenger.of(context).showSnackBar(

        SnackBar(content: Text('Login Failed: ${response.statusCode}')),

      );

    }

  }catch (e){

    ScaffoldMessenger.of(context).showSnackBar(

      SnackBar(content: Text('Error: $e')),

    );

  }finally{

    setState((){

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
                'Hello \n  Log in!',
                style: TextStyle(
                  fontFamily: 'NotoSerif',
                  fontSize: 40,
                  color: Color.fromARGB(255, 128, 0, 0),
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(top: 200.0),
            child: Container(
              decoration: const BoxDecoration(
                color: Color.fromARGB(255, 128, 0, 0),
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(50),
                  topRight: Radius.circular(50),
                ),
              ),
              height: double.infinity,
              width: double.infinity,
              child: SingleChildScrollView(
                // Added SingleChildScrollView
                padding: const EdgeInsets.symmetric(horizontal: 18.0),
                child: Column(
                  children: [
                    const SizedBox(height: 70), // Added for spacing at the top
                    TextField(
                      controller: _emailController,  // Link controller
                      style: TextStyle(color: Colors.white),
                      decoration: const InputDecoration(
                        suffixIcon: Icon(Icons.check, color: Colors.grey),
                        label: Text(
                          'Email',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 20), // Added spacing between fields
                    // Password TextField
                    TextField(
                      controller: _passwordController,  // Link controller
                      obscureText: _obscureText,
                      style: TextStyle(color: Colors.white),
                      decoration: InputDecoration(
                        suffixIcon: IconButton(
                          icon: Icon(
                            _obscureText ? Icons.visibility_off : Icons.visibility,
                            color: Colors.grey,
                          ),
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
                        ),
                      ),
                    ),
                    const SizedBox(height: 50),
                    // Login button
                    _isLoading
                        ? const CircularProgressIndicator()  // Show loading spinner
                        : InkWell(
                            onTap: _login,  // Call login function on tap
                            child: Container(
                              height: 45,
                              width: 300,
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(30),
                                gradient: const LinearGradient(
                                  colors: [
                                    Color.fromARGB(255, 255, 255, 255),
                                    Color.fromARGB(255, 255, 255, 255),
                                  ],
                                ),
                              ),
                              child: const Center(
                                child: Text(
                                  'Log In',
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 25,
                                    color: Color.fromARGB(255, 128, 0, 0),
                                  ),
                                ),
                              ),
                            ),
                          ),
                    const SizedBox(height: 90), // Reduced bottom padding
                    Align(
                      alignment: Alignment.bottomRight,
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.end,
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          const Text(
                            "Don't have An Account?",
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              color: Color.fromARGB(255, 212, 212, 212),
                            ),
                          ),
                          GestureDetector(
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => const RegScreen(),
                                ),
                              );
                            },
                            child: const Text(
                              "Sign up",
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 17,
                                color: Color.fromARGB(255, 255, 255, 255),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
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