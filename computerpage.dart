import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class ComputerPage extends StatefulWidget {
  @override
  _ComputerPageState createState() => _ComputerPageState();
}

class _ComputerPageState extends State<ComputerPage> {
  List<Map<String, dynamic>> computerStatus = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchComputerStatus();
  }

  Future<void> _fetchComputerStatus() async {
    try {
      final response = await http.get(
        Uri.parse(
            'http://127.0.0.1:3000/PC_List/view_all'), // Adjust the endpoint as necessary
      );

      if (response.statusCode == 200) {
        // If the server returns a 200 OK response, parse the JSON
        List<dynamic> data = jsonDecode(response.body);

        // Update the state with the fetched data
        setState(() {
          computerStatus = data.map((item) {
            return {
              'pc': item['PC_ID'],
              'status': item['pc_status'],
              'assignedUser': item['Student_ID'] ?? 'None', // Handle null case
              'color': item['pc_status'] == 'Available'
                  ? Colors.green
                  : item['pc_status'] == 'Pending'
                      ? Colors.orange
                      : Color.fromARGB(255, 128, 0, 0),
            };
          }).toList();
          _isLoading = false;
        });
      } else {
        // If the server did not return a 200 OK response, throw an exception
        throw Exception('Failed to load data');
      }
    } catch (e) {
      // Handle error case
      print('Error fetching computer status: $e');
      setState(() {
        _isLoading = false; // Stop loading in case of error
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
                Color.fromARGB(255, 128, 0, 0),
                Color.fromARGB(255, 128, 0, 0),
              ]),
            ),
            child: const Padding(
              padding: EdgeInsets.only(top: 60.0, left: 22),
              child: Text(
                'Available PCs',
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
              child: _isLoading
                  ? Center(child: CircularProgressIndicator())
                  : Padding(
                      padding: const EdgeInsets.all(20.0),
                      child: GridView.builder(
                        gridDelegate:
                            const SliverGridDelegateWithFixedCrossAxisCount(
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
                              computerStatus[index]['assignedUser'],
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
  void _showComputerDialog(BuildContext context, String pc, String status,
      String assignedUser, Color statusColor) {
    showDialog(
      context: context,
      barrierDismissible:
          false, // Prevent dismissing by touching outside the dialog
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
                    Navigator.of(context)
                        .pop(); // Close the dialog when X is pressed
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
                  assignedUser == 'None'
                      ? Text(
                          status,
                          style: const TextStyle(fontSize: 18),
                        )
                      : Text(
                          assignedUser,
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
                  foregroundColor: Colors.white,
                  backgroundColor:
                      const Color.fromARGB(255, 128, 0, 0), // text color
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}