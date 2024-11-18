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

});

connection.connect((err) => {

    if(err){

        console.log(`Error connecting to the database: ${err}`);
        return;

    }else{

        console.log(`Successfully connected to the database: ${connection.config.database}`);

    }

});

// FOR AUTHENTICATION AND AUTHORIZATION
const verifyToken = async (req, res, next) => {

    try{

        const token = await req.headers['authorization'];

        if(!token){

            return res.status(403).json({ message: "No token provided" });

        }

        jwt.verify(token, secret, async (err, decoded) => {

            if(err){

                return res.status(401).json({ message: "Invalid token" });

            }

            req.user = await decoded;
            next();

        })

    }catch(error){

        console.log(error);

    }

}

// REGISTER ADMIN
app.post(`/register/admin`, async (req, res) => {

    try{

        const { username, password, first_name, last_name } = req.body;

        if(!username || !password || !first_name || !last_name){

            return res.status(400).json({ message: "All fields are required" });

        }

        const check_existing_username = `SELECT * FROM admin WHERE username = ?`;
        
        connection.query(check_existing_username, [username], (err, result) => {

            if(err){

                return res.status(500).json({ error: err.message });

            }

            if(result.length > 0){

                return res.status(400).json({ message: `Username already exists` });

            }

            bcrypt.hash(password, salt, (err, hashed) => {

                if(err){

                    return res.status(500).json({ message: "Error hashing password" });

                }

                const query = `INSERT INTO admin (username, password, first_name, last_name) VALUES(?, ?, ?, ?)`;

                connection.query(query, [username, hashed, first_name, last_name], (err, result) => {

                    if(err){

                        return res.status(500).json({ error: err.message });

                    }

                    res.status(201).json({

                        message: "Admin registered successfully",
                        
                    });

                });

            });

        });

    }catch(error){

        console.log(error);

    }

});

// LOG IN ADMIN 
app.post(`/login/admin`, async (req, res) => {

    try{

        const { username, password } = req.body;

        if(!username || !password){

            return res.status(400).json({ message: "All fields are required" });

        }

        const query = `SELECT * FROM admin WHERE username = ?`;

        connection.query(query, [username, password], async (err, rows) => {

            if(err){

                return res.status(500).json({ error: err.message });

            }

            if(rows.length === 0){

                return res.status(401).json({ msg: `Username or Password is incorrect` });

            }

            const user = rows[0];

            if(!user.password){

                return res.status(500).json({ message: "Password not found" });

            }

            try{

                const isMatch = await bcrypt.compare(password, user.password);

                if(!isMatch){

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

            }catch(error){

                console.log(error);

            }

        });

    }catch(error){

        console.log(error);

    }

});


// VIEW INFORMATION OF ADMIN
app.get(`/admin/details`, verifyToken, async (req, res) => {

    try{

        const { username } = req.user;

        const query = `SELECT * FROM admin WHERE username = ?`;

        connection.query(query, [username], (err, rows) => {

            if(err){

                return res.status(500).json({ error: err.message });

            }

            if(rows.length > 0){

                res.status(200).json(rows[0]);

            }else{

                return res.status(500).json({ message: `Username ${username} not found` });

            }

        });

    }catch(error){

        console.log(error);

    }

});


// VIEW ALL PC
app.get(`/view_all/pc`, verifyToken, async (req, res) => {

    try{

        const query = `SELECT * FROM pc_list`;

        connection.query(query, (err, rows) => {

            if(err){

                return res.status(400).json({ error: err.message });

            }

            res.status(200).json(rows);

        });

    }catch(error){

        console.log(error);

    }

});











const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});