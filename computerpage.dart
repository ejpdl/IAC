import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:async';

class ComputerPage extends StatefulWidget {
  @override
  _ComputerPageState createState() => _ComputerPageState();
}

class _ComputerPageState extends State<ComputerPage> {
  List<Map<String, dynamic>> computerStatus = [];
  bool _isLoading = true;
  bool _isRequesting = false;
  bool _canRequest = true; // New variable to track if user can make requests
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _fetchComputerStatus();
    _checkUserStatus(); // New method to check user's current status
    _startTimer();
  }

  // New method to check if user has any pending or occupied sessions
  Future<void> _checkUserStatus() async {
    try {
      final SharedPreferences prefs = await SharedPreferences.getInstance();
      final String? studentId = prefs.getString('studentId');

      if (studentId == null) {
        setState(() => _canRequest = false);
        return;
      }

      final response = await http.get(
        Uri.parse('http://127.0.0.1:3000/PC_List/view_all'),
      );

      if (response.statusCode == 200) {
        List<dynamic> data = jsonDecode(response.body);

        // Check if student has any pending or occupied sessions
        bool hasActiveSession = data.any((pc) =>
            pc['Student_ID']?.toString() == studentId &&
            (pc['pc_status']?.toString().toLowerCase() == 'pending' ||
                pc['pc_status']?.toString().toLowerCase() == 'occupied'));

        setState(() => _canRequest = !hasActiveSession);
      }
    } catch (e) {
      print('Error checking user status: $e');
    }
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

        final SharedPreferences prefs = await SharedPreferences.getInstance();
        final String? currentStudentId = prefs.getString('studentId');

        // Update the state with the fetched data
        setState(() {
          computerStatus = data.map((item) {
            final String? endTime = item['end_time'];
            return {
              'pc': item['PC_ID']?.toString() ?? 'Unknown PC',
              'status': item['pc_status']?.toString() ?? 'Unknown',
              'assignedUser': item['Student_ID']?.toString() ?? 'None',
              'color': _getStatusColor(item['pc_status']?.toString()),
              'endTime': endTime,
              'remainingTime':
                  endTime != null ? _calculateRemainingTime(endTime) : null,
            };
          }).toList();
          _isLoading = false;
        });

        // Update _canRequest based on the fetched data
        bool hasActiveSession = data.any((pc) =>
            pc['Student_ID']?.toString() == currentStudentId &&
            (pc['pc_status']?.toString().toLowerCase() == 'pending' ||
                pc['pc_status']?.toString().toLowerCase() == 'occupied'));
        setState(() => _canRequest = !hasActiveSession);
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

  void _startTimer() {
    // Fetch data every 10 seconds and update remaining times every second
    _timer = Timer.periodic(Duration(seconds: 1), (timer) async {
      if (timer.tick % 10 == 0) {
        // Fetch data from backend every 10 seconds
        await _fetchComputerStatus();
      }

      // Update remaining times locally every second
      setState(() {
        for (var pc in computerStatus) {
          if (pc['status']?.toLowerCase() == 'occupied' &&
              pc['endTime'] != null) {
            pc['remainingTime'] = _calculateRemainingTime(pc['endTime']);
          }
        }
      });
    });
  }

  String _calculateRemainingTime(String endTime) {
    final DateTime endDateTime = DateTime.parse(endTime);
    final Duration remaining = endDateTime.difference(DateTime.now());

    if (remaining.isNegative) {
      return '00:00:00'; // Timer has expired
    }

    final int hours = remaining.inHours;
    final int minutes = remaining.inMinutes % 60;
    final int seconds = remaining.inSeconds % 60;

    return '${hours.toString().padLeft(2, '0')}:'
        '${minutes.toString().padLeft(2, '0')}:'
        '${seconds.toString().padLeft(2, '0')}';
  }

  Color _getStatusColor(String? status) {
    switch (status?.toLowerCase()) {
      case 'available':
        return Colors.green;
      case 'occupied':
        return Color.fromARGB(255, 128, 0, 0);
      case 'pending':
        return Colors.orange;
      default:
        return Colors.grey;
    }
  }

  Future<void> _requestPC(String pcId) async {
    setState(() {
      _isRequesting = true;
    });

    try {
      final SharedPreferences prefs = await SharedPreferences.getInstance();
      final String? studentId = prefs.getString('studentId');

      if (studentId == null) {
        throw Exception('User not logged in');
      }

      final response = await http.post(
        Uri.parse('http://127.0.0.1:3000/api/request-pc'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'studentId': studentId,
          'pcId': pcId,
        }),
      );

      if (response.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('PC request submitted successfully'),
            backgroundColor: Colors.green,
          ),
        );
        await _fetchComputerStatus();
      } else {
        final errorData = jsonDecode(response.body);
        throw Exception(errorData['error'] ?? 'Failed to request PC');
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(e.toString()),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      setState(() {
        _isRequesting = false;
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
                              computerStatus[index]['remainingTime'],
                            ),
                            child: _buildComputerStatusCard(
                              computerStatus[index]['pc'],
                              computerStatus[index]['status'],
                              computerStatus[index]['color'],
                              computerStatus[index]['remainingTime'],
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
  Widget _buildComputerStatusCard(
      String pc, String status, Color statusColor, String? remainingTime) {
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
  void _showComputerDialog(
      BuildContext context,
      String pc,
      String status,
      String assignedUser,
      Color statusColor,
      String? initialRemainingTime) async {
    Duration? remainingDuration;

    if (initialRemainingTime == null) {
      final response =
          await http.get(Uri.parse('http://127.0.0.1:3000/api/pc-time/$pc'));
      if (response.statusCode == 200) {
        final Map<String, dynamic> pcData = jsonDecode(response.body);
        if (pcData['remainingTime'] != null) {
          remainingDuration = Duration(milliseconds: pcData['remainingTime']);
        }
      }
    } else {
      final timeParts = initialRemainingTime.split(':');
      remainingDuration = Duration(
        hours: int.parse(timeParts[0]),
        minutes: int.parse(timeParts[1]),
        seconds: int.parse(timeParts[2]),
      );
    }

    Timer? dialogTimer;

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return StatefulBuilder(
          builder: (BuildContext context, StateSetter setState) {
            if (remainingDuration != null) {
              dialogTimer ??=
                  Timer.periodic(const Duration(seconds: 1), (timer) {
                setState(() {
                  if (remainingDuration!.inSeconds > 0) {
                    remainingDuration =
                        remainingDuration! - const Duration(seconds: 1);
                  }
                });
              });
            }

            return AlertDialog(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20.0),
              ),
              contentPadding: const EdgeInsets.all(16.0),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Align(
                    alignment: Alignment.topRight,
                    child: IconButton(
                      icon: const Icon(
                        Icons.close_rounded,
                        color: Color.fromARGB(255, 128, 0, 0),
                        size: 30,
                      ),
                      onPressed: () {
                        dialogTimer?.cancel();
                        Navigator.of(context).pop();
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
                              'Student ID: $assignedUser',
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
                  if (status.toLowerCase() == 'occupied' &&
                      remainingDuration != null)
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'Ends in: ${_formatDuration(remainingDuration!)}',
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
                  if (status.toLowerCase() ==
                      'available') // Only show button if PC is available
                    ElevatedButton(
                      onPressed: (!_canRequest || _isRequesting)
                          ? null
                          : () async {
                              await _requestPC(pc);
                              Navigator.of(context).pop();
                            },
                      style: ElevatedButton.styleFrom(
                        foregroundColor: Colors.white,
                        backgroundColor: const Color.fromARGB(255, 128, 0, 0),
                        // Add disabled style
                        disabledBackgroundColor: Colors.grey,
                        disabledForegroundColor: Colors.white70,
                      ),
                      child: _isRequesting
                          ? const SizedBox(
                              height: 20,
                              width: 20,
                              child: CircularProgressIndicator(
                                  color: Colors.white))
                          : Text(!_canRequest
                              ? 'Cannot Request'
                              : 'Request Session'),
                    ),
                ],
              ),
            );
          },
        );
      },
    ).then((_) {
      dialogTimer?.cancel();
    });
  }

// Helper function to format the remaining duration as a string
  String _formatDuration(Duration duration) {
    final int hours = duration.inHours;
    final int minutes = duration.inMinutes % 60;
    final int seconds = duration.inSeconds % 60;

    return '${hours.toString().padLeft(2, '0')}:'
        '${minutes.toString().padLeft(2, '0')}:'
        '${seconds.toString().padLeft(2, '0')}';
  }
}
