import 'package:flutter/material.dart';

class AboutUs extends StatefulWidget {
  const AboutUs({super.key});

  @override
  State<AboutUs> createState() => _AboutUsState();
}

class _AboutUsState extends State<AboutUs> {
  final List<String> names = [
    'Ephraim Justine Paul D. De Lara',
    'Franze William M. Calleja',
    'Ralph Jahred D. Magpantay',
    'Albert Ian D. Abarquez',
    'Mike Lawrence M. Cuevas',
    'John Aldrin C. Ordiales',
    'Myla M. Bacayan',
    'Jon Robin Ace E. Andor',
    'Jervy A. Laroza',
    'Hazel Grace D. Patron',
  ];

  final List<String> roles = [
    'Backend Developer & API Integration Specialist',
    'Project Manager & UI/UX Designer',
    'Backend Developer',
    'Database Manager & API Integration Specialist',
    'Frontend Developer & UI/UX Designer',
    'FrontEnd Developer',
    'Tester/QA Specialist & Documentation Specialist',
    'Database Manager',
    'Documentation Manager',
    'Tester/QA Specialist',
  ];

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
                padding: const EdgeInsets.all(16.0),
                child: SingleChildScrollView(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const SizedBox(height: 100),
                      const Text(
                        'Meet Our Team',
                        style: TextStyle(
                          fontSize: 30,
                          fontWeight: FontWeight.bold,
                          color: Color.fromARGB(255, 128, 0, 0),
                        ),
                      ),
                      const SizedBox(height: 15),
                      for (int i = 0; i < names.length; i++)
                        Padding(
                          padding: const EdgeInsets.only(bottom: 15),
                          child: Column(
                            children: [
                              Text(
                                names[i],
                                style: const TextStyle(
                                  fontSize: 23,
                                  color: Colors.black,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                              const SizedBox(height: 5),
                              Text(
                                roles[i],
                                textAlign: TextAlign.center,
                                style: const TextStyle(
                                  fontSize: 14,
                                  color: Color.fromARGB(255, 128, 0, 0),
                                ),
                              ),
                              
                            ],
                            
                          ),
                         
                        ),

                        const SizedBox(height: 50),
                    ],
                  ),
                ),
              ),
            ),
          ),
          Positioned(
            top: 50,
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
              child: ClipOval(
                child: Image.asset(
                  'assets/images/IAC_LOGO.jpg', 
                  fit: BoxFit.cover,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}