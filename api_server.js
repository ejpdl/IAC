const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const moment = require('moment');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const logger = (req, res, next) => {
    
    console.log(`${req.method} ${req.protocol}://${req.get("host")}${req.originalUrl} : ${moment().format()}`);
    next();
    
}

app.use(logger);

const connection = mysql.createConnection({

    host: "byg2lehiaall3bovpkv6-mysql.services.clever-cloud.com",
    user: "uduuh17lwy9qe1fl",
    password: "UQddsqwfmrsd9vKyIN7u",
    database: "byg2lehiaall3bovpkv6"

});

connection.connect((err) => {

    if(err){

        console.log(`Error connecting to the database: ${err}`);
        return;

    }

    console.log(`Successfully connected to the MySQL Database`);

});


// <================================== GET ALL ==================================>
app.get(`/admin_credentials/view_all/`, (req, res) => {

    const query = `SELECT * FROM admin_credentials`;
    connection.query(query, (err, rows) => {

        if(err){

            return res.status(400).json({ error: err.message });

        }

        res.status(200).json(rows);
        
    });

});

app.get(`/admin_details/view_all/`, (req, res) => {

    const query = `SELECT * FROM admin_details`;
    connection.query(query, (err, rows) => {

        if(err){

            return res.status(400).json({ error: err.message });

        }

        res.status(200).json(rows);

    });

});

app.get(`/college_credentials/view_all/`, (req, res) => {

    const query = `SELECT * FROM college_credentials`;
    connection.query(query, (err, rows) => {

        if(err){

            return res.status(400).json({ error: err.message });

        }

        res.status(200).json(rows);
    });

});

app.get(`/college_details/view_all`, (req, res) => {

    const query = `SELECT * FROM college_details`;
    connection.query(query, (err, rows) => {

        if(err){

            return res.status(400).json({ error: err.message });

        }

        res.status(200).json(rows);

    });

});

app.get(`/PC_List/view_all`, (req, res) => {

    const query = `SELECT * FROM PC_List`;
    connection.query(query, (err, rows) => {

        if(err){

            return res.status(400).json({ error: err.message });

        }

        res.status(200).json(rows);

    });

});

app.get(`/shs_credentials/view_all`, (req, res) => {

    const query = `SELECT * FROM shs_credentials`;
    connection.query(query, (err, rows) => {

        if(err){

            return res.status(400).json({ error: err.message });

        }

        res.status(200).json(rows);

    });

});

app.get(`/shs_details/view_all`, (req, res) => {

    const query = `SELECT * FROM shs_details`;
    connection.query(query, (err, rows) => {

        if(err){

            return res.status(400).json({ error: err.message });

        }

        res.status(200).json(rows);

    });

});


// <================================== GET BY  ID ==================================>
app.get(`/admin_credentials/view/:Employee_ID`, (req, res) => {

    const { Employee_ID } = req.params;
    const query = `SELECT * FROM admin_credentials WHERE Employee_ID = ?`;

    connection.query(query, [Employee_ID], (err, rows) => {

        if(err){

            return res.status(400).json({ error: err.message });

        }

        if(rows.length > 0){

            res.status(200).json(rows[0]);

        }else{

            res.status(404).json({ msg: `${Employee_ID} not found!`})

        }   

    });

});

app.get(`/admin_details/view/:Employee_ID`, (req, res) => {

    const { Employee_ID } = req.params;
    const query = `SELECT * FROM admin_details WHERE Employee_ID = ?`;

    connection.query(query, [Employee_ID], (err, rows) => {

        if(err){

            return res.status(400).json({ error: err.message });

        }

        if(rows.length > 0){

            res.status(200).json(rows[0]);

        }else{

            res.status(404).json({ msg: `${Employee_ID} not found!` });

        }

    });

});

app.get(`/college_credentials/view/:Student_ID`, (req, res) => {

    const { Student_ID } = req.params;
    const query = `SELECT * FROM college_credentials WHERE Student_ID = ?`;

    connection.query(query, [Student_ID], (err, rows) => {

        if(err){

            return res.status(400).json({ error: err.message });

        }

        if(rows.length > 0){

            res.status(200).json(rows[0]);

        }else{

            res.status(404).json({ msg: `${Student_ID} not found!` });

        }

    });

});

app.get(`/college_details/view/:Student_ID`, (req, res) => {

    const { Student_ID } = req.params;
    const query = `SELECT * FROM college_details WHERE Student_ID = ?`;

    connection.query(query, [Student_ID], (err, rows) => {

        if(err){

            return res.status(400).json({ error: err.message });

        }

        if(rows.length > 0){

            res.status(200).json(rows[0]);

        }else{

            res.status(404).json({ msg: `${Student_ID} not found!` });

        }

    });

});

app.get(`/PC_List/view/:PC_ID`, (req, res) => {

    const { PC_ID } = req.params;
    const query = `SELECT * FROM PC_List WHERE PC_ID = ?`;

    connection.query(query, [PC_ID], (err, rows) => {

        if(err){

            return res.status(400).json({ error: err.message });

        }

        if(rows.length > 0){

            res.status(200).json(rows[0]);

        }else{

            res.status(404).json({ msg: `${PC_ID} is not found!` });

        }

    });

});

app.get(`/shs_credentials/view/:Student_ID`, (req, res) => {

    const { Student_ID } = req.params;
    const query = `SELECT * FROM shs_credentials WHERE Student_ID = ?`;

    connection.query(query, [Student_ID], (err, rows) => {

        if(err){

            return res.status(400).json({ error: err.message });

        }

        if(rows.length > 0){

            res.status(200).json(rows[0]);

        }else{

            res.status(404).json({ msg: `${Student_ID} is not found!` });
        }

    });

});

app.get(`/shs_details/view/:Student_ID`, (req, res) => {

    const { Student_ID } = req.params;
    const query = `SELECT * FROM shs_details WHERE Student_ID = ?`;

    connection.query(query, [Student_ID], (err, rows) => {

        if(err){

            return res.status(400).json({ error: err.message });

        }

        if(rows.length > 0){

            res.status(200).json(rows[0]);

        }else{

            res.status(404).json({ msg: `${Student_ID} is not found!` });

        }

    });

});


// <================================== INSERT ==================================>
app.post(`/admin_credentials/add`, (req, res) => {

    const { Employee_ID, Username, Password } = req.body;
    const query = `INSERT INTO admin_credentials (Employee_ID, Username, Password) VALUES (?, ?, ?)`;

    connection.query(query, [Employee_ID, Username, Password], (err, rows) => {

        if(err){

            return res.status(400).json({ error: err.message});

        }

        res.status(200).json({ msg: `Successfully added!`});

    });

});

app.post(`/admin_details/add`, (req, res) => {

    const { Employee_ID, First_name, Last_name } = req.body;
    const query = `INSERT INTO admin_details (Employee_ID, First_name, Last_name) VALUES (?, ?, ?)`;

    connection.query(query, [Employee_ID, First_name, Last_name], (err, rows) => {

        if(err){

            return res.status(400).json({ error: err.message });

        }

        res.status(200).json({ msg: `Successfully added!`});

    });

});

app.post(`/college_credentials/add`, (req, res) => {

    const { Student_ID, Password } = req.body;
    const query = `INSERT INTO college_credentials (Student_ID, Password) VALUES (?, ?)`;

    connection.query(query, [Student_ID, Password], (err, rows) => {

        if(err){

            return res.status(400).json({ error: err.message });

        }

        res.status(200).json({ msg: `Successfully added!`});

    });

});

app.post(`/college_details/add`, (req, res) => {

    const { Student_ID, First_name, Last_name, Year_Level, Course } = req.body;
    const query = `INSERT INTO college_details (Student_ID, First_name, Last_name, Year_Level, Course) VALUES (?, ?, ?, ?, ?)`;

    connection.query(query, [Student_ID, First_name, Last_name, Year_Level, Course], (err, rows) => {

        if(err){

            return res.status(400).json({ error: err.message });

        }

        res.status(200).json({ msg: `Successfully added!`});

    });

});

app.post(`/PC_List/add`, (req, res) => {

    const { PC_ID, Status } = req.body;
    const query = `INSERT INTO PC_List (PC_ID, Status) VALUES (?, ?)`;

    connection.query(query, [PC_ID, Status], (err, rows) => {

        if(err){

            return res.status(400).json({ error: err.message });

        }

        res.status(200).json({ msg: `Successfully added!`});

    });

});

app.post(`/shs_credentials/add`, (req, res) => {

    const { Student_ID, Password } = req.body;
    const query = `INSERT INTO shs_credentials (Student_ID, Password) VALUES (?, ?)`;

    connection.query(query, [Student_ID, Password], (err, rows) => {

        if(err){

            return res.status(400).json({ error: err.message });

        }

        res.status(200).json({ msg: `Successfully added!`});

    });

});

app.post(`/shs_details/add`, (req, res) => {

    const { Student_ID, First_name, Last_name, Year_Level, Strand } = req.body;
    const query = `INSERT INTO shs_details (Student_ID, First_name, Last_name, Year_Level, Strand) VALUES (?, ?, ?, ?, ?)`;

    connection.query(query, [ Student_ID, First_name, Last_name, Year_Level, Strand], (err, rows) => {

        if(err){

            return res.status(400).json({ error: err.message });

        }

        res.status(200).json({ msg: `Successfully added!`});

    });

});


// <================================== UPDATE ==================================>
app.put(`/admin_credentials/update`, (req, res) => {

    const { Username, Password, Employee_ID } = req.body;
    const query = `UPDATE admin_credentials SET Username = ?, Password = ? WHERE Employee_ID = ?`;

    connection.query(query, [Username, Password, Employee_ID], (err, rows) => {

        if(err){

            return res.status(400).json({ error: err.message });

        }else{

            res.status(200).json({ msg: `Successfully updated` });

        }

    });

});

app.put(`/admin_details/update`, (req, res) => {

    const { First_name, Last_name, Employee_ID } = req.body;
    const query = `UPDATE admin_details SET First_name = ?, Last_name = ? WHERE Employee_ID = ?`;
    
    connection.query(query, [First_name, Last_name, Employee_ID], (err, rows) => {

        if(err){

            return res.status(400).json({ error: err.message });

        }else{
            
            res.status(200).json({ msg: `Successfully Updated!` });
        }

    });

});

app.put(`/college_credentials/update`, (req, res) => {

    const { Password, Student_ID } = req.body;
    const query = `UPDATE college_credentials SET Password = ? WHERE Student_ID = ?`;

    connection.query(query, [Password, Student_ID], (err, rows) => {

        if(err){

            return res.status(400).json({ error: err.message });

        }else{

            res.status(200).json({ msg: `Successfully Updated!` });

        }

    });

});

app.put(`/college_details/update`, (req, res) => {

    const { First_name, Last_name, Year_Level, Course, Student_ID } = req.body;
    const query = `UPDATE college_details SET First_name = ?, Last_name = ?, Year_Level = ?, Course = ? WHERE Student_ID = ?`;

    connection.query(query, [First_name, Last_name, Year_Level, Course, Student_ID], (err, rows) => {

        if(err){

            return res.status(400).json({ error: err.message });

        }else{

            res.status(200).json({ msg: `Successfully Updated!` });

        }

    });

});

app.put(`/PC_List/update`, (req, res) => {

    const { Status, PC_ID } = req.body;
    const query = `UPDATE PC_List SET Status = ? WHERE PC_ID = ?`;

    connection.query(query, [Status, PC_ID], (err, rows) => {

        if(err){

            return res.status(400).json({ error: err.message });

        }else{

            res.status(200).json({ msg: `Successfully Updated!` });

        }

    });

});

app.put(`/shs_credentials/update`, (req, res) => {

    const { Password, Student_ID } = req.body;
    const query = `UPDATE shs_credentials SET Password = ? WHERE Student_ID = ?`;

    connection.query(query, [Password, Student_ID], (err, rows) => {

        if(err){

            return res.status(400).json({ error: err.message });

        }else{

            res.status(200).json({ msg: `Successfully Updated!` });

        }

    });

});

app.put(`/shs_details/update`, (req, res) => {

    const { First_name, Last_name, Year_Level, Strand, Student_ID } = req.body;
    const query = `UPDATE shs_details SET First_name = ?, Last_name = ?, Year_Level = ?, Strand = ? WHERE Student_ID = ?`;

    connection.query(query, [First_name, Last_name, Year_Level, Strand, Student_ID], (err, rows) => {

        if(err){

            return res.status(400).json({ error: err.message });

        }else{

            res.status(200).json({ msg: `Successfully Updated!` });

        }

    });

});


// <================================== DELETE ==================================>
app.delete(`/admin_credentials/delete`, (req, res) => {

    const { Employee_ID } = req.body;
    const query = `DELETE FROM admin_credentials WHERE Employee_ID = ?`;

    connection.query(query, [Employee_ID], (err, rows) => {

        if(err){

            return res.status(400).json({ error: err.message });

        }

        res.status(200).json({ msg: `Successfully Deleted` });

    });

});

app.delete(`/admin_details/delete`, (req, res) => {

    const { Employee_ID } = req.body;
    const query = `DELETE FROM admin_details WHERE Employee_ID = ?`;

    connection.query(query, [Employee_ID], (err, rows) => {

        if(err){

            return res.status(400).json({ error: err.message });

        }

        res.status(200).json({ msg: `Successfully Deleted!` });

    });

});

app.delete(`/college_credentials/delete`, (req, res) => {

    const { Student_ID } = req.body;
    const query = `DELETE FROM college_credentials WHERE Student_ID = ?`;

    connection.query(query, [Student_ID], (err, rows) => {

        if(err){

            return res.status(400).json({ error: err.message });

        }

        res.status(200).json({ msg: `Successfully Deleted!` });

    });

});

app.delete(`/college_details/delete`, (req, res) => {

    const { Student_ID } = req.body;
    const query = `DELETE FROM college_details WHERE Student_ID = ?`;

    connection.query(query, [Student_ID], (err, rows) => {

        if(err){

            return res.status(400).json({ error: err.message });

        }

        res.status(200).json({ msg: `Successfully Deleted!` });

    });

});

app.delete(`/PC_List/delete`, (req, res) => {

    const { PC_ID } = req.body;
    const query = `DELETE FROM PC_List WHERE PC_ID = ?`;

    connection.query(query, [PC_ID], (err, rows) => {

        if(err){

            return res.status(400).json({ error: err.message });

        }

        res.status(200).json({ msg: `Successfully Deleted!` });

    });

});

app.delete(`/shs_credentials/delete`, (req, res) => {

    const { Student_ID } = req.body;
    const query = `DELETE FROM shs_credentials WHERE Student_ID = ?`;

    connection.query(query, [Student_ID], (err, rows) => {

        if(err){

            return res.status(400).json({ error: err.message });

        }

        res.status(200).json({ msg: `Successfully Deleted!` });

    });

});

app.delete(`/shs_details/delete`, (req, res) => {

    const { Student_ID } = req.body;
    const query = `DELETE FROM shs_details WHERE Student_ID = ?`;

    connection.query(query, [Student_ID], (err, rows) => {

        if(err){

            return res.status(400).json({ error: err.message });

        }

        res.status(200).json({ msg: `Successfully Deleted!` });

    });

});

const PORT = process.env.PORT || 3000;

app.listen(3000, () => {

    console.log(`Server is running at PORT ${PORT}`);

})
