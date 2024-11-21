const express = require('express');
const mysql = require('mysql');
const moment = require('moment');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

    } else {

        console.log(`Successfully connected to the database: ${connection.config.database}`);

    }

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

                    { username: user.username },
                    secret,
                    { expiresIn: "2h" }

                );

                return res.status(200).json({

                    msg: `Log In Successful`,
                    token: token,
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

    if (action !== 'accept' && action !== 'decline') {
        return res.status(400).json({ error: 'Invalid action' });
    }

    // First, get the student ID for the PC request
    connection.query('SELECT Student_ID FROM pc_list WHERE PC_ID = ?', [pcId], (error, results) => {
        if (error) {
            console.error('Error fetching PC details:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'PC not found' });
        }

        const studentId = results[0].Student_ID;

        // If declining, no need to check other PCs
        if (action === 'decline') {
            updatePCStatus('Available', null, pcId, res);
            return;
        }

        // If accepting, check if student is already using another PC
        const checkOtherPCsQuery = `
      SELECT PC_ID FROM pc_list 
      WHERE Student_ID = ? 
      AND PC_ID != ? 
      AND pc_status = 'Occupied'
    `;

        connection.query(checkOtherPCsQuery, [studentId, pcId], (error, results) => {
            if (error) {
                console.error('Error checking other PCs:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (results.length > 0) {
                return res.status(400).json({
                    error: `Student is already using PC ${results[0].PC_ID}`
                });
            }

            // If all checks pass, update the PC status
            const newStatus = 'Occupied';
            const currentTime = new Date();
            const endTime = new Date(currentTime.getTime() + 60 * 60 * 1000); // 1 hour

            const updateQuery = `
        UPDATE pc_list 
        SET pc_status = ?,
            time_used = CURRENT_TIME(),
            end_time = ?
        WHERE PC_ID = ?
      `;

            connection.query(updateQuery, [newStatus, endTime, pcId], (error) => {
                if (error) {
                    console.error('Error updating request:', error);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                res.json({ message: 'Request accepted successfully' });
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

app.get('/api/check-expired-sessions', (req, res) => {
    const updateQuery = `
    UPDATE pc_list 
    SET pc_status = 'Available', 
        Student_ID = NULL, 
        time_used = NULL, 
        end_time = NULL
    WHERE pc_status = 'Occupied' AND end_time < NOW()
  `;

    connection.query(updateQuery, (error, result) => {
        if (error) {
            console.error('Error checking expired sessions:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.json({ updatedSessions: result.affectedRows });
    });
});

app.post('/api/end-session', (req, res) => {
    const { pcId } = req.body;

    const updateQuery = `
    UPDATE pc_list 
    SET pc_status = 'Available', 
        Student_ID = NULL, 
        time_used = NULL, 
        end_time = NULL 
    WHERE PC_ID = ?`;

    connection.query(updateQuery, [pcId], (error, result) => {
        if (error) {
            console.error('Error ending session:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json({ message: 'Session ended successfully' });
    });
});











const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});