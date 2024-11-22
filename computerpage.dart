import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:intl/intl.dart';
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
        Uri.parse('http://127.0.0.1:4000/PC_List/view_all'),
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
        Uri.parse('http://127.0.0.1:4000/PC_List/view_all'),
      );

      if (response.statusCode == 200) {
        List<dynamic> data = jsonDecode(response.body);

        final SharedPreferences prefs = await SharedPreferences.getInstance();
        final String? currentStudentId = prefs.getString('studentId');

        setState(() {
          computerStatus = data.map((item) {
            String? remainingTime;

            // Only calculate remaining time for occupied PCs
            if (item['pc_status']?.toString().toLowerCase() == 'occupied' &&
                item['end_time'] != null) {
              remainingTime = _calculateRemainingTime(item['end_time']);
            }

            return {
              'pc': item['PC_ID']?.toString() ?? 'Unknown PC',
              'status': item['pc_status']?.toString() ?? 'Unknown',
              'assignedUser': item['Student_ID']?.toString() ?? 'None',
              'color': _getStatusColor(item['pc_status']?.toString()),
              'endTime': item['end_time'],
              'remainingTime': remainingTime,
            };
          }).toList();
          _isLoading = false;
        });

        bool hasActiveSession = data.any((pc) =>
            pc['Student_ID']?.toString() == currentStudentId &&
            (pc['pc_status']?.toString().toLowerCase() == 'pending' ||
                pc['pc_status']?.toString().toLowerCase() == 'occupied'));
        setState(() => _canRequest = !hasActiveSession);
      } else {
        throw Exception('Failed to load data');
      }
    } catch (e) {
      print('Error fetching computer status: $e');
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _startTimer() {
    // Fetch data every 10 seconds and update remaining times every second
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) async {
      if (timer.tick % 10 == 0) {
        // Fetch fresh data from backend every 10 seconds
        await _fetchComputerStatus();
      } else {
        // Update times locally on other seconds
        setState(() {
          for (var pc in computerStatus) {
            if (pc['status']?.toLowerCase() == 'occupied' &&
                pc['endTime'] != null) {
              pc['remainingTime'] = _calculateRemainingTime(pc['endTime']);
            }
          }
        });
      }
    });
  }

  // Frontend Fixes (Flutter)
// In _ComputerPageState class:

  String _calculateRemainingTime(String endTimeStr) {
    try {
      final now = DateTime.now();
      final formatter = DateFormat('HH:mm:ss');
      final endTime = formatter.parse(endTimeStr);

      // Create a DateTime for today with the end time
      final targetEndTime = DateTime(
        now.year,
        now.month,
        now.day,
        endTime.hour,
        endTime.minute,
        endTime.second,
      );

      // If end time is in the past, return zeros
      if (targetEndTime.isBefore(now)) {
        return '00:00';
      }

      final difference = targetEndTime.difference(now);

      // Cap duration at 1 hour (3600 seconds)
      final cappedSeconds = difference.inSeconds.clamp(0, 3600);
      final cappedDuration = Duration(seconds: cappedSeconds);

      final minutes = (cappedDuration.inMinutes % 60);
      final seconds = (cappedDuration.inSeconds % 60);

      // Format without hours since we're capping at 1 hour
      return '${minutes.toString().padLeft(2, '0')}:'
          '${seconds.toString().padLeft(2, '0')}';
    } catch (e) {
      print('Error calculating remaining time: $e');
      return '00:00';
    }
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
        Uri.parse('http://127.0.0.1:4000/api/request-pc'),
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
                          crossAxisCount: 3,
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
            offset: const Offset(0, 3),
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

  void _showComputerDialog(
      BuildContext context,
      String pc,
      String status,
      String assignedUser,
      Color statusColor,
      String? initialRemainingTime) async {
    Duration? remainingDuration;

    if (status.toLowerCase() == 'occupied') {
      try {
        final response = await http
            .get(Uri.parse('http://127.0.0.1:4000/api/pc-time/$pc'));

        if (response.statusCode == 200) {
          final Map<String, dynamic> pcData = jsonDecode(response.body);
          if (pcData['remainingTime'] != null) {
            // Convert milliseconds to duration and cap at 1 hour
            int remainingMillis = pcData['remainingTime'];
            remainingDuration =
                Duration(milliseconds: remainingMillis.clamp(0, 3600000));
          }
        }
      } catch (e) {
        print('Error fetching PC time: $e');
        // If there's an error, try to use the initial remaining time
        if (initialRemainingTime != null) {
          try {
            final timeParts = initialRemainingTime.split(':');
            if (timeParts.length == 3) {
              final hours = int.parse(timeParts[0]);
              final minutes = int.parse(timeParts[1]);
              final seconds = int.parse(timeParts[2]);

              // Calculate total seconds and cap at 3600 (1 hour)
              final totalSeconds =
                  (hours * 3600 + minutes * 60 + seconds).clamp(0, 3600);
              remainingDuration = Duration(seconds: totalSeconds);
            }
          } catch (e) {
            print('Error parsing initial remaining time: $e');
            remainingDuration = null;
          }
        }
      }
    }

    Timer? dialogTimer;

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return StatefulBuilder(
          builder: (BuildContext context, StateSetter setState) {
            if (remainingDuration != null) {
              dialogTimer?.cancel(); // Cancel existing timer if any
              dialogTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
                setState(() {
                  if (remainingDuration!.inSeconds > 0) {
                    remainingDuration =
                        remainingDuration! - const Duration(seconds: 1);
                  } else {
                    timer.cancel();
                  }
                });
              });
            }

            String timerDisplay = remainingDuration != null
                ? _formatDuration(remainingDuration!)
                : '00:00:00';

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
                          'Ends in: $timerDisplay',
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
    // Ensure the duration never exceeds 1 hour
    final cappedSeconds = duration.inSeconds.clamp(0, 3600);
    final cappedDuration = Duration(seconds: cappedSeconds);

    final minutes = cappedDuration.inMinutes % 60;
    final seconds = cappedDuration.inSeconds % 60;

    return '${minutes.toString().padLeft(2, '0')}:'
        '${seconds.toString().padLeft(2, '0')}';
  }
}
