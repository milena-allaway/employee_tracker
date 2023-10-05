// require all dependencies
const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
//https://www.npmjs.com/package/console.table?activeTab=dependents
const cTable = require('console.table');

//customizable logo for app
//https://www.npmjs.com/package/asciiart-logo
const logo = require('asciiart-logo');
const longText = 'Welcome to the Hogwarts Management System!' + 
    '\n' + "This is a simple command line app that manages a company's employee database." +
    '\n' + 'Please select an option from the menu below to get started.';

console.log(
    logo({
        name: 'Hogwarts Management System',
        font: 'Standard',
        lineChars: 12,
        padding: 5,
        margin: 2,
        borderColor: 'blue',
        logoColor: 'yellow',
        textColor: 'cyan',
    })
    .emptyLine()
    .right('version 1.0.0')
    .emptyLine()
    .center(longText)
    .render()
);
// can use package.json to create logo, using default preferences instead, by using following code to replace above code:
// const logo = require('asciiart-logo');
// const config = require('./package.json');
// console.log(logo(config).render());

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
      user: 'root', //add your mysql username here
      password: 'P@ssword123', //add your mysql password here
      database: 'hogwarts_db'
    },
    console.log(`Connected to the hogwarts_db database.`)
);

// function to initialize app
init = () => {
    // prompt user for action
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
                "View utilized budget of a department",
                "Delete department, role, or employee",
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
                case "View utilized budget of a department":
                    viewBudget();
                    break;
                case "Delete department, role, or employee":
                    deletePrompt();
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
    //fetch all departments
    db.query('SELECT * FROM departments', function (err, results) {
        if (err) throw err;
        console.table('Departments: ', results);
        init();
    });
};

// function to view all roles
viewRoles = () => {
    //fetch all roles and join with departments table
    db.query(`SELECT roles.id, roles.title AS job_title, departments.name AS department_name,
     roles.salary FROM roles JOIN departments ON roles.department_id = departments.id`, function (err, results) {
        if (err) throw err;
        console.table('Roles: ', results);
        init();
    });
};

// function to view all employees
// concatinate first and last name https://stackoverflow.com/questions/3757723/how-to-combine-multiple-columns-as-one-and-format-with-custom-strings
viewEmployees = () => {
    //fetch all employees, roles, departments, and managers and join tables
    db.query(`SELECT employees.id, employees.first_name, employees.last_name, roles.title AS job_title, 
    departments.name AS department_name, roles.salary, CONCAT(managers.first_name, ' , ', managers.last_name) AS manager_name 
    FROM employees 
    LEFT JOIN roles ON employees.role_id = roles.id
    LEFT JOIN departments ON roles.department_id = departments.id
    LEFT JOIN employees AS managers ON employees.manager_id = managers.id`, function (err, results) {
        if (err) throw err;
        console.table('Employees: ', results);
        init();
    });
};

//function to add a department
// https://emojicombos.com/magic used for cute magic emoji in console logs
addDepartment = () => {
    inquirer.prompt(
        {
            type: 'input',
            name: 'name',
            message: 'What is the new department name?',
        })
        .then((response) => {
            // Insert new department into departments table
            db.query('INSERT INTO departments (name) VALUES (?)', response.name, function (err, results) {
                if (err) throw err;
                console.log('\x1b[35m%s\x1b[0m','(∩ᵔ ᵕ ᵔ)⊃━☆ﾟ.*+.'+' Department added! Here is the updated table.');
                viewDepartments();
            });
        });
};

//function to add a role
addRole = () => {
    // Fetch department names and IDs
    db.query('SELECT id, name FROM departments', function (err, departments) {
        if (err) throw err;

        // Extract department names and IDs to populate choices array
        //https://www.w3schools.com/jsref/jsref_map.asp
       //used chatGPT to help write and test departmentChoices code, used as a template for other choices
        const departmentChoices = departments.map(department => ({
            name: department.name,
            value: department.id
        }));

        inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What is the title of the role?',
                validate: (titleInput) => {
                    if (titleInput) {
                        return true;
                    } else {
                        console.log('Please enter a title for the role!');
                        return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary of the role?',
                validate: (salaryInput) => {
                    if (salaryInput) {
                        return true;
                    } else {
                        console.log('Please enter a salary for the role!');
                        return false;
                    }
                }
            },
            {
                type: 'list',
                name: 'department_id',
                message: 'Select the department for the role:',
                choices: departmentChoices,
            }
        ])
        .then((response) => {
            // Insert new role into roles table
            db.query('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)', [response.title, response.salary, response.department_id], function (err, results) {
                if (err) throw err;
                console.log('\x1b[33m%s\x1b[0m','(∩ᵔ ᵕ ᵔ)⊃━☆ﾟ.*+.'+' Role added! Here is the updated table.');
                viewRoles();
            });
        });
    });
};

//function to add an employee
addEmployee = () => {
    // Fetch role titles and IDs
    db.query('SELECT id, title FROM roles', function (err, roles) {
        if (err) throw err;
        // Extract role titles and IDs for choices array
        const roleChoices = roles.map(role => ({
            name: role.title,
            value: role.id
        }));
        // Fetch employee names and IDs, concatinate first and last name and alias as full_name
        db.query('SELECT id, CONCAT(first_name, " ", last_name) AS full_name FROM employees', function (err, employees) {
            if (err) throw err;

            // Extract employee names and IDs for choices array
            const managerChoices = employees.map(employee => ({
                name: employee.full_name,
                value: employee.id
            }));

        inquirer.prompt([
            {
                type: 'input',
                name: 'first_name',
                message: 'What is the first name of the employee?',
                validate: (firstNameInput) => {
                    if (firstNameInput) {
                        return true;
                    } else {
                        console.log('Please enter a first name for the employee!');
                        return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'What is the last name of the employee?',
                validate: (lastNameInput) => {
                    if (lastNameInput) {
                        return true;
                    } else {
                        console.log('Please enter a last name for the employee!');
                        return false;
                    }
                }
            },
            {
                type: 'list',
                name: 'role_id',
                message: 'Select the role for the employee:',
                choices: roleChoices,
            },
            {
                type: 'list',
                name: 'manager_id',
                message: 'Select the manager for the employee:',
                choices: managerChoices,
            }
        ])
        .then((response) => {
            // Insert new employee into employees table
            db.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [response.first_name, response.last_name, response.role_id, response.manager_id], function (err, results) {
                if (err) throw err;
                console.log('\x1b[32m%s\x1b[0m','(∩ᵔ ᵕ ᵔ)⊃━☆ﾟ.*+.'+' Employee added! Here is the updated table.');
                viewEmployees();
            });
        })
    });
});
};

//function to update an employee
updateEmployee = () => {
    // Fetch employee names and IDs, concatinate first and last name and alias as full_name
    db.query('SELECT id, CONCAT(first_name, " ", last_name) AS full_name FROM employees', function (err, employees) {
        if (err) throw err;

        // Extract employee names and IDs for choices array
        const employeeChoices = employees.map(employee => ({
            name: employee.full_name,
            value: employee.id
        }));

        //Fetch role titles and IDs
        db.query('SELECT id, title FROM roles', function (err, roles) {
            if (err) throw err;

        // Extract role titles and IDs for choices array
        const roleChoices = roles.map(role => ({
            name: role.title,
            value: role.id
        }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'employee_id',
                message: 'Select the employee to update:',
                choices: employeeChoices,
            },
            {
                type: 'list',
                name: 'role_id',
                message: 'Select the new role for the employee:',
                choices: roleChoices,
            }
        ])
        .then((response) => {
            // Update employee in employees table
            db.query('UPDATE employees SET role_id = ? WHERE id = ?', [response.role_id, response.employee_id], function (err, results) {
                if (err) throw err;
                console.log('\x1b[31m%s\x1b[0m','(∩ᵔ ᵕ ᵔ)⊃━☆ﾟ.*+.'+' Employee updated! Here is the updated table.');
                viewEmployees();
            });
        });
    });
});
};

//function to view budget
viewBudget = () => {
    // Fetch department names and IDs
    db.query('SELECT id, name FROM departments', function (err, departments) {
        if (err) throw err;
        // Extract department names and IDs to populate choices array
        const departmentChoices = departments.map(department => ({
            name: department.name,
            value: department.id
        }));

        inquirer.prompt(
            {
                type: 'list',
                name: 'department_id',
                message: 'Select the department to view budget:',
                choices: departmentChoices,
            })
        .then((response) => {
            // Fetch sum of salaries for selected department
            db.query('SELECT SUM(salary) AS total_salary FROM roles WHERE department_id = ?', response.department_id, function (err, results) {
                if (err) throw err;
                console.table('Budget: ', results);
                init();
            });
        });
    });
};

//function to start delete options prompt
deletePrompt = () => {
    inquirer.prompt(
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to delete?',
            choices:
                ["Delete a department",
                "Delete a role",
                "Delete an employee",
                "Exit",
                ],
        })
        .then((response) => {
            switch (response.action) {
                case "Delete a department":
                    deleteDepartment();
                    break;
                case "Delete a role":
                    deleteRole();
                    break;
                case "Delete an employee":
                    deleteEmployee();
                    break;
                case "Exit":
                    db.end();
                    (console.log("Goodbye!"));
                    process.exit();
            };
        });
};

//function to delete a department
deleteDepartment = () => {
    // Fetch department names and IDs
    db.query('SELECT id, name FROM departments', function (err, departments) {
        if (err) throw err;

        // Extract department names and IDs to populate choices array
        const departmentChoices = departments.map(department => ({
            name: department.name,
            value: department.id
        }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'id',
                message: 'Select the department to delete:',
                choices: departmentChoices,
            }
        ])
        .then((response) => {
            // Delete department from departments table
            db.query('DELETE FROM departments WHERE id = ?', response.id, function (err, results) {
                if (err) throw err;
                console.log('\x1b[34m%s\x1b[0m','(∩ᵔ ᵕ ᵔ)⊃━☆ﾟ.*+.'+' Department deleted! Here is the updated table.');
                viewDepartments();
            });
        });
    });
};

//function to delete a role
deleteRole = () => {
    // Fetch role titles and IDs
    db.query('SELECT id, title FROM roles', function (err, roles) {
        if (err) throw err;

        // Extract role titles and IDs for choices array
        const roleChoices = roles.map(role => ({
            name: role.title,
            value: role.id
        }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'id',
                message: 'Select the role to delete:',
                choices: roleChoices,
            }
        ])
        .then((response) => {
            // Delete role from roles table
            db.query('DELETE FROM roles WHERE id = ?', response.id, function (err, results) {
                if (err) throw err;
                console.log('\x1b[36m%s\x1b[0m','(∩ᵔ ᵕ ᵔ)⊃━☆ﾟ.*+.'+' Role deleted! Here is the updated table.');
                viewRoles();
            });
        });
    });
};

//function to delete an employee
deleteEmployee = () => {
    // Fetch employee names and IDs, concatinate first and last name and alias as full_name
    db.query('SELECT id, CONCAT(first_name, " ", last_name) AS full_name FROM employees', function (err, employees) {
        if (err) throw err;

        // Extract employee names and IDs for choices array
        const employeeChoices = employees.map(employee => ({
            name: employee.full_name,
            value: employee.id
        }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'id',
                message: 'Select the employee to delete:',
                choices: employeeChoices,
            }
        ])
        .then((response) => {
            // Delete employee from employees table
            db.query('DELETE FROM employees WHERE id = ?', response.id, function (err, results) {
                if (err) throw err;
                console.log('\x1b[33m%s\x1b[0m','(∩ᵔ ᵕ ᵔ)⊃━☆ﾟ.*+.'+' Employee deleted! Here is the updated table.');
                viewEmployees();
            });
        });
    });
};

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});
 
// Listener to start server after DB connection
app.listen(PORT, () => {
    console.log(`
    Server running on port ${PORT}`);
});
//start app
init();