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

// Connect to 'hogwarts' database
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'P@ssword123',
      database: 'hogwarts_db'
    },
    console.log(`Connected to the hogwarts_db database.`)
);

// function to initialize app
init = () => {
    inquirer.prompt(
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices:
                ["View all departments",
                "View all roles",
                "View all employees",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Update an employee role",
                "Exit",
                ],
        })
        .then((response) => {
            switch (response.action) {
                case "View all departments":
                    viewDepartments();
                    break;
                case "View all roles":
                    viewRoles();
                    break;
                case "View all employees":
                    viewEmployees();
                    break;
                case "Add a department":
                    addDepartment();
                    break;
                case "Add a role":
                    addRole();
                    break;
                case "Add an employee":
                    addEmployee();
                    break;
                case "Update an employee role":
                    updateEmployee();
                    break;
                case "Exit":
                    db.end();
                    (console.log("Goodbye!"));
                    break;
            
            };
        });
};

// function to view all departments
viewDepartments = () => {
    db.query('SELECT * FROM departments', function (err, results) {
        console.log(results);
        init();
    });
};

// function to view all roles
viewRoles = () => {
    db.query('SELECT * FROM roles', function (err, results) {
        console.log(results);
        init();
    });
};

// function to view all employees
viewEmployees = () => {
    db.query('SELECT * FROM employees', function (err, results) {
        console.log(results);
        init();
    });
};

// function to add a department
// addDepartment = () => {
//     inquirer.prompt(
//         {
//             type: 'input',
//             name: 'name',
//             message: 'What is the name of the department?',
//         })
//         .then((response) => {
//             db.query('INSERT INTO departments (name) VALUES (?)', response.name, function (err, results) {
//                 console.log(results);
//                 init();
//             });
//         });
// };


// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});
 
// Listener to start server after DB connection
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//start app
init();