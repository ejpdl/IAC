const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const moment = require('moment');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secret = 'your_jwt_secret';

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

// const connection = mysql.createConnection({

//     host: "byg2lehiaall3bovpkv6-mysql.services.clever-cloud.com",
//     user: "uduuh17lwy9qe1fl",
//     password: "UQddsqwfmrsd9vKyIN7u",
//     database: "byg2lehiaall3bovpkv6"

// });

const connection = mysql.createConnection({

    host: "localhost",
    user: "root",
    password: "",
    database: "internet_access_center"
    // database: "iac"

});

connection.connect((err) => {

    if (err) {

        console.log(`Error connecting to the database: ${err}`);
        return;

    }

    console.log(`Successfully connected to Internet Access Center Database`);

});


const verifyToken = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {

        return res.status(403).json({ msg: `Access Denied. No token Provided` });

    }

    jwt.verify(token, secret, (err, decoded) => {

        if (err) {

            return res.status(401).json({ msg: `Invalid Token` });

        }

        req.user = decoded;
        next();

    });

};

// LOG IN
app.post("/userdata/login", (req, res) => {

    const { sid, password } = req.body;

    if (!sid || !password) {

        return res.status(400).json({ msg: "Student ID and Password are required." });

    }

    const query = `SELECT * FROM students WHERE Student_ID = ?`;

    connection.query(query, [sid], async (err, rows) => {

        if (err) {

            return res.status(500).json({ error: "Database error." });

        }

        if (rows.length === 0) {

            return res.status(401).json({ msg: "Student ID or Password is incorrect." });

        }

        const user = rows[0];

        if (!user.password) {

            return res.status(500).json({ error: "Password is missing in the database." });

        }

        try {

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {

                return res.status(401).json({ msg: "Student ID or Password is incorrect." });

            }

            const token = jwt.sign(
                { sid: user.Student_ID },
                secret,
                { expiresIn: '1h' }
            );

            return res.status(200).json({
                msg: "Login Successful",
                token: token,
            });

        } catch (error) {

            console.error("Error during password comparison:", error);
            return res.status(500).json({ msg: "Error during password comparison." });

        }

    });

});



// REGISTER
app.post(`/userdata/register`, (req, res) => {

    const { sid, firstname, lastname, yrlvl, course, password } = req.body;

    bcrypt.hash(password, salt, (err, hashed) => {

        if (err) {

            return res.status(500).json({ error: err.message });

        }

        const query = `INSERT INTO students (Student_ID, first_name, last_name, year_level, course, password) VALUES (?, ?, ?, ?, ?, ?)`;

        connection.query(query, [sid, firstname, lastname, yrlvl, course, hashed], (err, result) => {

            if (err) {

                return res.status(500).json({ error: err.message });

            }

            res.status(201).json({ msg: `User successfully registered` });

        });

        console.log(`Student ID provided: ${sid}`);
        console.log(`First Name provided: ${firstname}`);
        console.log(`Last Name provided: ${lastname}`);
        console.log(`Year Level provided: ${yrlvl}`);
        console.log(`Course provided: ${course}`);
        console.log(`Password provided: ${password}`);
        console.log(`Password after hashed: ${hashed}`);

    });

});

// VIEW ALL STUDENTS
app.get(`/students/view_all`, async (req, res) => {

    try {

        const query = `SELECT * FROM students`;

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

// VIEW ALL STUDENTS WITH SPECIFIC ID
app.get(`/userdata/student/:id`, async (req, res) => {

    try {

        const studentId = req.params.id;
        console.log(`Fetching data for student ID: ${studentId}`);

        const query = `SELECT first_name, last_name FROM students WHERE Student_ID = ?`;

        connection.query(query, [studentId], (err, results) => {

            if (err) {

                return res.status(500).json({ error: err.message });

            }

            if (results.length === 0) {

                console.log(`No student found with ID: ${studentId}`);
                res.status(404).json({ msg: `Student ID ${studentId} not found.` });

            }

            console.log(`Found student data:`, results[0]); // Log successful result
            res.json(results[0]);

        });

    } catch (error) {

        console.log(error);

    }

});


// VIEW ALL PC LISTS
app.get(`/PC_List/view_all`, async (req, res) => {

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


// REQUEST ACCESS (STUDENT USER POV)
app.put(`/request_access`, verifyToken, async (req, res) => {

    try {
        const { pcId } = req.body;
        const studentId = req.user.Student_ID; // Extract Student_ID from the decoded token

        if (!studentId) {
            return res.status(400).json({ msg: 'Student ID is missing from the token' });
        }

        const timeUsed = Date.now();
        const dateUsed = moment().format('YYYY-MM-DD');


        const query = `UPDATE pc_list SET pc_status = 'Pending', Student_ID = ?, time_used = ?, date_used = ? WHERE PC_ID = ?`;

        connection.query(query, [studentId, timeUsed, dateUsed, pcId], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.status(200).json({ msg: `Request successfully sent` });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }

});



// ADD PC LISTS
app.post(`/PC_List/add`, async (req, res) => {

    try {

        const { PC_ID, pc_status, Student_ID, time_used, date_used } = req.body;

        const query = `INSERT INTO pc_list(PC_ID, pc_status, Student_ID, time_used, date_used) VALUES(?, ?, ?, ?, ?)`;

        connection.query(query, [PC_ID, pc_status, Student_ID, time_used, date_used], (err, rows) => {

            if (err) {

                return res.status(500).json({ error: err.message });

            }

            res.status(201).json({ msg: `PC List successfully added.` });

        });


    } catch (error) {

        console.log(error);

    }

});


// VIEW HISTORY
app.get(`/history/view_all`, async (req, res) => {

    try {

        const query = `SELECT * FROM session_history`;

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

// ADD HISTORY
app.post('/history/add', async (req, res) => {

    try {

        const { session_id, Student_ID, PC_ID, start_time, end_time } = req.body;

        const query = `INSERT INTO session_history (session_id, Student_ID, PC_ID, start_time, end_time) VALUES (?, ?, ?, ?, ?)`;

        connection.query(query, [session_id, Student_ID, PC_ID, start_time, end_time], (err, rows) => {

            if (err) {

                return res.status(500).json({ error: err.message });

            }

            res.status(200).json({ msg: `History successfully added.` });

        });

    } catch (error) {

        console.log(error);

    }

});

const PORT = process.env.PORT || 3000;

app.listen(3000, () => {

    console.log(`Server is running at PORT ${PORT}`);

})









// Endpoint to request a PC
app.get('/api/student/:studentId', (req, res) => {
    const studentId = req.params.studentId;

    const query = `
    SELECT Student_ID, first_name, last_name, year_level, course 
    FROM students 
    WHERE Student_ID = ?
  `;

    connection.query(query, [studentId], (error, results) => {
        if (error) {
            console.error('Error fetching student:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json(results[0]);
    });
});

// Endpoint to request a PC
app.post('/api/request-pc', (req, res) => {
    const { studentId, pcId } = req.body;

    // First check if student exists
    connection.query('SELECT * FROM students WHERE Student_ID = ?', [studentId], (error, results) => {
        if (error) {
            console.error('Error checking student:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Check if student already has a pending request or is using a PC
        const checkExistingQuery = `
      SELECT * FROM pc_list 
      WHERE Student_ID = ? 
      AND (pc_status = 'Pending' OR pc_status = 'Occupied')
    `;

        connection.query(checkExistingQuery, [studentId], (error, results) => {
            if (error) {
                console.error('Error checking existing requests:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (results.length > 0) {
                const status = results[0].pc_status;
                if (status === 'Pending') {
                    return res.status(400).json({
                        error: `You already have a pending request for PC ${results[0].PC_ID}`
                    });
                } else {
                    return res.status(400).json({
                        error: `You are currently using PC ${results[0].PC_ID}`
                    });
                }
            }

            // Check if PC is available
            connection.query('SELECT * FROM pc_list WHERE PC_ID = ?', [pcId], (error, results) => {
                if (error) {
                    console.error('Error checking PC:', error);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                if (results.length === 0) {
                    return res.status(404).json({ error: 'PC not found' });
                }

                if (results[0].pc_status !== 'Available') {
                    return res.status(400).json({ error: 'PC is not available' });
                }

                // Update PC status to Pending
                const currentDate = new Date().toISOString().slice(0, 10);
                const updateQuery = `
          UPDATE pc_list 
          SET pc_status = 'Pending', 
              Student_ID = ?, 
              date_used = ?
          WHERE PC_ID = ?
        `;

                connection.query(updateQuery, [studentId, currentDate, pcId], (error) => {
                    if (error) {
                        console.error('Error updating PC status:', error);
                        return res.status(500).json({ error: 'Internal server error' });
                    }

                    res.json({ message: 'PC request submitted successfully' });
                });
            });
        });
    });
});

app.get('/api/pc-time/:pcId', (req, res) => {
    const { pcId } = req.params;

    const query = 'SELECT end_time FROM pc_list WHERE PC_ID = ?';
    connection.query(query, [pcId], (error, results) => {
        if (error) {
            console.error('Error fetching time:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length > 0) {
            const endTime = results[0].end_time;
            if (endTime) {
                const currentTime = new Date();
                const remainingTime = new Date(endTime) - currentTime;
                res.json({ isActive: remainingTime > 0, remainingTime });
            } else {
                res.json({ isActive: false });
            }
        } else {
            res.status(404).json({ error: 'PC not found' });
        }
    });
});

