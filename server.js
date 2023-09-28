// require all dependencies
const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');

// set up port
const PORT = process.env.PORT || 3001;

// create instance of express
const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to 'business' database
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'P@ssword123',
      database: 'business_db'
    },
    console.log(`Connected to the business_db database.`)
);

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});
 
// Start server connection
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});