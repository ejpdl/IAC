const express = require('express');
const mysql = require('mysql');
const moment = require('moment');
const cors = require('cors');
const cron = require('cron');
const https = require('https');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('moment-timezone');

const secret = "ADMIN_ADMIN";
const salt = 10;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const logger = (req, res, next) => {

    console.log(`${req.method} ${req.protocol}://${req.get("host")}${req.originalUrl} : ${moment().format()}`);

    next();

}

app.use(logger);

const connection = mysql.createPool({

    host: "srv545.hstgr.io",
    user: "u579076463_iacmonitoring",
    password: "Iacmonitoring@2024",
    // database: "internet_access_center"
    database: "u579076463_iacmonitoring",
    waitForConnections: true,
    connectionLimit: 10,
    multipleStatements: true

});

connection.getConnection((err, conn) => {
    if (err) {
        console.error("Error connecting to the database:", err.message);
    } else {
        console.log("Successfully connected to the database!");
        conn.release(); // Release the connection back to the pool
    }
});

//PINGER TO AVOID SERVER SLEEP
// Cron job to keep the server alive
// const job = new cron.CronJob('*/1 * * * *', function () {
//     console.log('Pinging server to keep it alive');
//     https.get('http://127.0.0.1:4000/ping', (res) => {
//         if (res.statusCode === 200) {
//             console.log('Server pinged successfully');
//         } else {
//             console.error(`Failed to ping server.Status code: ${res.statusCode}`);
//         }
//     }).on('error', (err) => {
//         console.error('Error pinging server:', err.message);
//     });

//     // After 30 seconds, ping the server again
//     setTimeout(() => {
//         console.log('Pinging server after 30 seconds...');
//         https.get('http://127.0.0.1:4000/ping', (res) => {
//             if (res.statusCode === 200) {
//                 console.log('Server pinged successfully');
//             } else {
//                 console.error(`Failed to ping server. Status code: ${res.statusCode}`);
//             }
//         }).on('error', (err) => {
//             console.error('Error pinging server:', err.message);
//         });
//     }, 30000);  // 30000 ms = 30 seconds
// });

app.get("/ping", (req, res) => {
    res.status(200).send("Server is alive");
});

// FOR AUTHENTICATION AND AUTHORIZATION
const verifyToken = async (req, res, next) => {

    try {

        const token = await req.headers['authorization'];

        if (!token) {

            return res.status(403).json({ message: "No token provided" });

        }

        jwt.verify(token, secret, async (err, decoded) => {

            if (err) {

                return res.status(401).json({ message: "Invalid token" });

            }

            req.user = await decoded;
            next();

        })

    } catch (error) {

        console.log(error);

    }

}

// REGISTER ADMIN
app.post(`/register/admin`, async (req, res) => {

    try {

        const { username, password, first_name, last_name } = req.body;

        if (!username || !password || !first_name || !last_name) {

            return res.status(400).json({ message: "All fields are required" });

        }

        const check_existing_username = `SELECT * FROM admin WHERE username = ?`;

        connection.query(check_existing_username, [username], (err, result) => {

            if (err) {

                return res.status(500).json({ error: err.message });

            }

            if (result.length > 0) {

                return res.status(400).json({ message: `Username already exists` });

            }

            bcrypt.hash(password, salt, (err, hashed) => {

                if (err) {

                    return res.status(500).json({ message: "Error hashing password" });

                }

                const query = `INSERT INTO admin (username, password, first_name, last_name) VALUES(?, ?, ?, ?)`;

                connection.query(query, [username, hashed, first_name, last_name], (err, result) => {

                    if (err) {

                        return res.status(500).json({ error: err.message });

                    }

                    res.status(201).json({

                        message: "Admin registered successfully",

                    });

                });

            });

        });

    } catch (error) {

        console.log(error);

    }

});

// LOG IN ADMIN 
app.post(`/login/admin`, async (req, res) => {

    try {

        const { username, password } = req.body;

        if (!username || !password) {

            return res.status(400).json({ message: "All fields are required" });

        }

        const query = `SELECT * FROM admin WHERE username = ?`;

        connection.query(query, [username, password], async (err, rows) => {

            if (err) {

                return res.status(500).json({ error: err.message });

            }

            if (rows.length === 0) {

                return res.status(401).json({ msg: `Username or Password is incorrect` });

            }

            const user = rows[0];

            if (!user.password) {

                return res.status(500).json({ message: "Password not found" });

            }

            try {

                const isMatch = await bcrypt.compare(password, user.password);

                if (!isMatch) {

                    return res.status(401).json({ msg: `Username or Password is incorrect` });

                }

                const token = jwt.sign(

                    {
                        username: user.username,
                        Admin_ID: user.Admin_ID
                    },
                    secret,
                    { expiresIn: "2h" }

                );

                return res.status(200).json({

                    msg: `Log In Successful`,
                    token: token,
                    Admin_ID: user.Admin_ID,
                    redirectUrl: `../dashboard.html`

                });

            } catch (error) {

                console.log(error);

            }

        });

    } catch (error) {

        console.log(error);

    }

});



// VIEW INFORMATION OF ADMIN
app.get(`/admin/details`, verifyToken, async (req, res) => {

    try {

        const { username } = req.user;

        const query = `SELECT * FROM admin WHERE username = ?`;

        connection.query(query, [username], (err, rows) => {

            if (err) {

                return res.status(500).json({ error: err.message });

            }

            if (rows.length > 0) {

                res.status(200).json(rows[0]);

            } else {

                return res.status(500).json({ message: `Username ${username} not found` });

            }

        });

    } catch (error) {

        console.log(error);

    }

});


// VIEW ALL PC
app.get(`/view_all/pc`, verifyToken, async (req, res) => {

    try {

        const query = `SELECT * FROM pc_list`;

        connection.query(query, (err, rows) => {

            if (err) {

                return res.status(400).json({ error: err.message });

            }

            res.status(200).json(rows);

        });

    } catch (error) {

        console.log(error);

    }

});

// ADD NEW PC
app.post(`/add/pc`, verifyToken, async (req, res) => {

    try {
        const { PC_ID } = req.body;
        const query = `INSERT INTO pc_list (pc_id) VALUES (?)`;
        connection.query(query, [PC_ID], (err, rows) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.status(201).json({ message: "PC added successfully" });
        });
    } catch (error) {
        console.log(error);
    }
});


// DELETE PC
app.post('/delete/pc', verifyToken, (req, res) => {
    const { PC_ID } = req.body;
    // Query to delete the computer based on the PC_ID
    const query = 'DELETE FROM pc_list WHERE PC_ID = ?';

    connection.query(query, [PC_ID], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ msg: 'Failed to delete computer' });
        }

        if (result.affectedRows > 0) {
            return res.status(200).json({ msg: `${PC_ID} was deleted successfully!` });
        } else {
            return res.status(404).json({ msg: `PC with ID ${PC_ID} not found.` });
        }
    });
});








// VIEW SESSION HISTORY
app.get(`/admin/session-history`, verifyToken, async (req, res) => {

    try {

        const query = `
        SELECT 
        session_history.PC_ID, 
        session_history.Student_ID, 
        CONCAT(students.first_name, ' ', students.last_name) AS full_name, 
        DATE_FORMAT(session_history.date_used, '%Y-%m-%d') AS date_used, 
        TIME_FORMAT(session_history.time_used, '%H:%i:%s') AS time_used
        FROM 
            session_history
        JOIN 
            students
        ON 
        session_history.student_id = students.student_id;

        `;

        connection.query(query, (err, rows) => {

            if (err) {

                return res.status(500).json({ error: err.message });

            }

            res.status(200).json(rows);

        });

    } catch (error) {

        console.log(error);

    }

});






// Endpoint to get all PCs with their status
app.get('/api/pc-status', (req, res) => {
    const query = `
    SELECT p.*, s.first_name, s.last_name 
    FROM pc_list p 
    LEFT JOIN students s ON p.Student_ID = s.Student_ID
  `;

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching PC status:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.json(results);
    });
});

// Endpoint to handle request response (accept/decline)
app.post('/api/request-response', (req, res) => {
    const { pcId, action } = req.body;

    if (!pcId || typeof pcId !== 'string') {
        return res.status(400).json({ error: 'Invalid or missing PC ID' });
    }

    if (action !== 'accept' && action !== 'decline') {
        return res.status(400).json({ error: 'Invalid action' });
    }

    connection.query('SELECT Student_ID, pc_status FROM pc_list WHERE PC_ID = ?', [pcId], (error, results) => {
        if (error) {
            console.error('Error fetching PC details:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'PC not found' });
        }

        const pc = results[0];

        if (pc.pc_status !== 'Pending') {
            return res.status(400).json({ error: 'PC is not in pending status' });
        }

        if (action === 'decline') {
            return updatePCStatus('Available', null, pcId, res);
        }

        const currentTime = moment().tz('Asia/Manila');
        const timeUsed = currentTime.format('HH:mm:ss');
        // Change to add 1 hour instead of 8
        const endTime = currentTime.add(1, 'hour').format('HH:mm:ss');

        const updateQuery = `
      UPDATE pc_list 
      SET pc_status = 'Occupied', 
          time_used = ?, 
          end_time = ?
      WHERE PC_ID = ?
    `;

        connection.query(updateQuery, [timeUsed, endTime, pcId], (error) => {
            if (error) {
                console.error('Error updating request:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }

            res.json({
                message: 'Request accepted successfully',
                pcId: pcId,
                status: 'Occupied',
                timeUsed: timeUsed,
                endTime: endTime,
                serverTime: currentTime.format()
            });
        });
    });
});


// Helper function to update PC status
function updatePCStatus(status, studentId, pcId, res) {
    const updateQuery = `
    UPDATE pc_list 
    SET pc_status = ?,
        Student_ID = ?,
        time_used = NULL,
        end_time = NULL
    WHERE PC_ID = ?
  `;

    connection.query(updateQuery, [status, studentId, pcId], (error) => {
        if (error) {
            console.error('Error updating PC status:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.json({ message: `Request ${status === 'Available' ? 'declined' : 'processed'} successfully` });
    });
}

app.get('/api/pc-time/:pcId', (req, res) => {
    const pcId = req.params.pcId;

    connection.query('SELECT end_time, time_used, pc_status FROM pc_list WHERE PC_ID = ?', [pcId], (error, results) => {
        if (error) {
            console.error('Error fetching PC time:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'PC not found' });
        }

        const pc = results[0];

        if (pc.pc_status !== 'Occupied') {
            return res.json({
                isActive: false,
                message: 'Session not active',
                remainingTime: 0
            });
        }

        const currentTime = moment().tz('Asia/Manila');
        const endTime = moment.tz(pc.end_time, 'HH:mm:ss', 'Asia/Manila')
            .year(currentTime.year())
            .month(currentTime.month())
            .date(currentTime.date());

        const remainingTime = endTime.diff(currentTime);

        // Ensure the remaining time doesn't exceed 1 hour
        const maxTime = 60 * 60 * 1000; // 1 hour in milliseconds
        const adjustedRemainingTime = Math.min(remainingTime, maxTime);

        if (adjustedRemainingTime <= 0) {
            return res.json({
                isActive: false,
                message: 'Session ended',
                remainingTime: 0
            });
        }

        res.json({
            isActive: true,
            message: 'Session active',
            remainingTime: adjustedRemainingTime,
            endTime: endTime.format('HH:mm:ss'),
            currentTime: currentTime.format('HH:mm:ss')
        });
    });
});


app.get('/api/check-expired-sessions', (req, res) => {
    const now = moment().tz('Asia/Manila');
    const currentTime = now.format('HH:mm:ss');

    // First get the sessions that will be expired
    const selectQuery = `
    SELECT PC_ID, Student_ID, time_used, date_used, end_time 
    FROM pc_list 
    WHERE pc_status = 'Occupied' AND TIME(end_time) < ?
  `;

    connection.query(selectQuery, [currentTime], async (error, sessions) => {
        if (error) {
            console.error('Error checking expired sessions:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        try {
            // Log history for each expired session
            for (const session of sessions) {
                await logSessionHistory(
                    session.PC_ID,
                    session.Student_ID,
                    session.time_used,
                    session.end_time,
                    session.date_used
                );
            }

            // Then update the PC status
            const updateQuery = `
        UPDATE pc_list 
        SET pc_status = 'Available', 
            Student_ID = NULL, 
            time_used = NULL, 
            end_time = NULL
        WHERE pc_status = 'Occupied' AND TIME(end_time) < ?
      `;

            connection.query(updateQuery, [currentTime], (error, result) => {
                if (error) {
                    console.error('Error updating expired sessions:', error);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                res.json({ updatedSessions: result.affectedRows });
            });
        } catch (error) {
            console.error('Error processing expired sessions:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});

// <================================== HISTORY ==================================>
async function logSessionHistory(pcId, studentId, startTime, endTime, date) {
    const query = `
    INSERT INTO session_history (Student_ID, PC_ID, date_used, time_used, end_time) 
    VALUES (?, ?, ?, ?, ?)
  `;

    return new Promise((resolve, reject) => {
        connection.query(query, [studentId, pcId, date, startTime, endTime], (error, results) => {
            if (error) {
                console.error('Error logging session history:', error);
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

app.post('/api/end-session', (req, res) => {
    const { pcId } = req.body;

    // First get the session details
    const selectQuery = `
    SELECT Student_ID, time_used, date_used, end_time 
    FROM pc_list 
    WHERE PC_ID = ?
  `;

    connection.query(selectQuery, [pcId], async (error, results) => {
        if (error) {
            console.error('Error getting session details:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Session not found' });
        }

        const session = results[0];

        try {
            // Log the session history
            await logSessionHistory(
                pcId,
                session.Student_ID,
                session.time_used,
                session.end_time,
                session.date_used
            );

            // Then update the PC status
            const updateQuery = `
        UPDATE pc_list 
        SET pc_status = 'Available', 
            Student_ID = NULL, 
            time_used = NULL, 
            end_time = NULL 
        WHERE PC_ID = ?
      `;

            connection.query(updateQuery, [pcId], (error, result) => {
                if (error) {
                    console.error('Error ending session:', error);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                res.json({ message: 'Session ended successfully' });
            });
        } catch (error) {
            console.error('Error processing session end:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});

























// VIEW SESSION HISTORY
app.get(`/admin/session-history`, verifyToken, async (req, res) => {

    try {

        const query = `
        SELECT 
        session_history.PC_ID, 
        session_history.Student_ID, 
        CONCAT(students.first_name, ' ', students.last_name) AS full_name, 
        session_history.start_time, 
        session_history.end_time
        FROM 
            session_history
        JOIN 
            students
        ON 
        session_history.student_id = students.student_id;

        `;

        connection.query(query, (err, rows) => {

            if (err) {

                return res.status(500).json({ error: err.message });

            }

            res.status(200).json(rows);

        });

    } catch (error) {

        console.log(error);

    }

});


// FETCH THE COURSE AND YEAR LEVEL
app.get(`/admin/year-level-usage`, verifyToken, async (req, res) => {

    try {
        const query = `
        SELECT 
            students.year_level, 
            COUNT(session_history.Student_ID) AS usage_count
        FROM 
            session_history
        JOIN 
            students
        ON 
            session_history.Student_ID = students.Student_ID
        GROUP BY 
            students.year_level;
        `;

        connection.query(query, (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json(rows);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An internal server error occurred." });
    }

});

app.get(`/admin/course-usage`, verifyToken, async (req, res) => {
    try {
        const query = `
        SELECT 
            students.course, 
            COUNT(session_history.Student_ID) AS usage_count
        FROM 
            session_history
        JOIN 
            students
        ON 
            session_history.Student_ID = students.Student_ID
        GROUP BY 
            students.course;
        `;

        connection.query(query, (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json(rows);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An internal server error occurred." });
    }
});


// VIEW ALL STUDENTS
app.get(`/admin/view-all-students`, verifyToken, async (req, res) => {

    try {

        const query = `SELECT 
                            Student_ID,
                            CONCAT(first_name, ' ', last_name) AS full_name,
                            year_level,
                            course
                        FROM students;`;

        connection.query(query, (err, rows) => {

            if (err) {

                return res.status(500).json({ error: err.message });

            }

            res.status(200).json(rows);

        });

    } catch (error) {

        console.log(error);

    }

});

// Backend Express Route
app.get('/api/year-level-usage/:month/:year', (req, res) => {
    const { month, year } = req.params;

    const query = `
      SELECT s.year_level, COUNT(sh.session_id) AS usage_count
      FROM session_history sh
      JOIN students s ON sh.Student_ID = s.Student_ID
      WHERE MONTH(sh.date_used) = ? 
      AND YEAR(sh.date_used) = ?
      GROUP BY s.year_level
      ORDER BY s.year_level ASC
    `;

    connection.query(query, [month, year], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json(results);
        }
    });
});
// Backend - Updated API endpoint
app.get('/api/department-usage', (req, res) => {
    const month = req.query.month;
    const year = req.query.year;  // Add year parameter

    const query = `
    SELECT s.course, COUNT(sh.session_id) AS usage_count
    FROM session_history sh
    JOIN students s ON sh.Student_ID = s.Student_ID
    WHERE MONTH(sh.date_used) = ? 
    AND YEAR(sh.date_used) = ?
    GROUP BY s.course
    ORDER BY usage_count DESC;
    `;

    connection.query(query, [month, year], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error', error: err });
        }

        const departmentUsageData = results.map(result => ({
            department: result.course,
            usageCount: result.usage_count,
        }));

        res.json(departmentUsageData);
    });
});



// VIEW ADMIN
app.get(`/admin/view/:Admin_ID`, verifyToken, async (req, res) => {

    const { Admin_ID } = req.params;

    try {

        const query = `SELECT Admin_ID, username, first_name, last_name FROM admin WHERE Admin_ID = ?`;

        connection.query(query, [Admin_ID], (err, rows) => {

            if (err) {

                return res.status(500).json({ error: err.message });

            }

            if (rows.length === 0) {

                return res.status(404).json({ error: `User not found` });

            }

            res.status(200).json(rows[0]);

        });

    } catch (error) {

        console.log(error);

    }

});


// EDIT ADMIN
app.put(`/admin/update-info`, verifyToken, async (req, res) => {

    const { username, password, first_name, last_name, Admin_ID } = req.body;
    try {
        let query;
        let params;

        if (password) {
            // If password is provided, hash it and update all fields
            const hashedPassword = await bcrypt.hash(password, 10);
            query = `UPDATE admin SET username = ?, password = ?, first_name = ?, last_name = ? WHERE Admin_ID = ?`;
            params = [username, hashedPassword, first_name, last_name, Admin_ID];
        } else {
            // If no password provided, update everything except password
            query = `UPDATE admin SET username = ?, first_name = ?, last_name = ? WHERE Admin_ID = ?`;
            params = [username, first_name, last_name, Admin_ID];
        }

        connection.query(query, params, (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: `No record found` });
            }
            console.log(`Successfully updated`);
            res.status(200).json({ msg: `Successfully Updated!` });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }

});

// VIEW A STUDENT
app.get(`/list/students/:Student_ID`, verifyToken, async (req, res) => {

    const { Student_ID } = req.params;

    try{

        const query = `SELECT * FROM students WHERE Student_ID = ?`;

        connection.query(query, [Student_ID], (err, rows) => {

            if(err){

                res.status(400).json({ error: err.message });

            }

            if(rows.length === 0){

                return res.status(404).json({ error: "User not found" });
                
            }

            res.status(200).json(rows[0]);

        });

    }catch(error){

        console.log(error);

    }

});

// UPDATE A STUDENT
app.put(`/update/student`, verifyToken, async (req, res) => {
    
    const { first_name, last_name, year_level, course, password, Student_ID } = req.body;

    try{

        const query = `UPDATE students SET first_name = ?, last_name = ?, year_level = ?, course = ?, password = ? WHERE Student_ID = ?`;

        connection.query(query, [first_name, last_name, year_level, course, password, Student_ID], (err, results) => {
            
            if(err){

                return res.status(500).json({ error: err.message });

            }

            if (results.affectedRows === 0) {
                
                return res.status(404).json({ error: `No record found to update.` });
            
            }

            console.log(`Successfully updated User with Student ID: ${Student_ID}`);
            res.status(200).json({ msg: `Successfully Updated!` });

        });

    }catch(error){
        
        console.log(error)
    
    }

});


// DELETE A STUDENT
app.delete(`/delete/student/:Student_ID`, verifyToken, async (req, res) => {

    const { Student_ID } = req.params;

    const query = `DELETE FROM students WHERE Student_ID = ?`;

    connection.query(query, [Student_ID], (err, result) => {

        if (err) {

            return res.status(500).json({ error: err.message });

        }

        if (result.affectedRows === 0) {

            return res.status(404).json({ msg: 'Student not found' });

        }

        res.status(200).json({ msg: 'Successfully Deleted!', deletedRows: result.affectedRows });

    });

});
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {

    console.log(`Server is running at PORT ${PORT}`);
    // job.start();

})