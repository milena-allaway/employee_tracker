// require all dependencies
const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
//https://www.npmjs.com/package/console.table?activeTab=dependents
const cTable = require('console.table');
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
                    process.exit();

            
            };
        });
};

// function to view all departments
viewDepartments = () => {
    db.query('SELECT * FROM departments', function (err, results) {
        console.table('Departments: ', results);
        init();
    });
};

// function to view all roles
viewRoles = () => {
    db.query(`SELECT roles.id, roles.title AS job_title, departments.name AS department_name,
     roles.salary FROM roles JOIN departments ON roles.department_id = departments.id`, function (err, results) {
        console.table('Roles: ', results);
        init();
    });
};

// function to view all employees
// concatinate first and last name https://stackoverflow.com/questions/3757723/how-to-combine-multiple-columns-as-one-and-format-with-custom-strings
viewEmployees = () => {
    db.query(`SELECT employees.id, employees.first_name, employees.last_name, roles.title AS job_title, 
    departments.name AS department_name, roles.salary, CONCAT(managers.first_name, ' , ', managers.last_name) AS manager_name 
    FROM employees 
    LEFT JOIN roles ON employees.role_id = roles.id
    LEFT JOIN departments ON roles.department_id = departments.id
    LEFT JOIN employees AS managers ON employees.manager_id = managers.id`, function (err, results) {
        console.table('Employees: ', results);
        init();
    });
};

//function to add a department
addDepartment = () => {
    inquirer.prompt(
        {
            type: 'input',
            name: 'name',
            message: 'What is the new department name?',
        })
        .then((response) => {
            db.query('INSERT INTO departments (name) VALUES (?)', response.name, function (err, results) {
                console.log('Department added! Here is the updated table:');
                viewDepartments();
            });
        });
};

//function to add a role
addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What is the title of the role?',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of the role?',
        },
        {
            type: 'input',
            name: 'department_id',
            message: 'What is the department id of the role? (Staff = 001, Student = 002, Ministry = 003)',
        }
    ])
        .then((response) => {
            db.query('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)', [response.title, response.salary, response.department_id], function (err, results) {
                console.table('Roles: ', results);
                console.log('Role added!');
                init();
            });
        });
};

//function to add an employee
addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'What is the first name of the employee?',
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'What is the last name of the employee?',
        },
        {
            type: 'input',
            name: 'role_id',
            message: 'What is the role id of the employee? (Headmaster = 001, Professor = 002, Student = 003, Ghost = 007, Ministry Worker = 008',
        },
        {
            type: 'input',
            name: 'manager_id',
            message: 'What is the manager id of the employee?',
        }
    ])
        .then((response) => {
            db.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [response.first_name, response.last_name, response.role_id, response.manager_id], function (err, results) {
                console.table('Employees: ', results);
                console.log('Employee added!');
                init();
            });
        });
};

//function to update an employee
updateEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'employee_id',
            message: 'What is the id of the employee you would like to update?',
        },
        {
            type: 'input',
            name: 'role_id',
            message: 'What is the new role id of the employee? (Headmaster = 001, Professor = 002, Student = 003, Ghost = 007, Ministry Worker = 008',
        }
    ])
        .then((response) => {
            db.query('UPDATE employees SET role_id = ? WHERE id = ?', [response.role_id, response.employee_id], function (err, results) {
                console.table('Employees: ', results);
                console.log('Employee updated!');
                init();
            });
        });
};


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