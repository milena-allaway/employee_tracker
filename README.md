# Employee Tracker: Hogwarts Edition
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

## Description
This is a command line app that manages a company's employee database, using Node.js, Express, Inquirer, and MySQL. The user can view, add, delete, and update employees, roles, and departments. The user can also view the total utilized budget of a department, which is the combined salaries of all employees in that department. During the making of this app, I learned how to use MySQL to create a database and tables, and how to use MySQL queries to add, view, and update data in the database. I also learned how to use console.table to display the data in a table in the command line and how to generate a CLI logo using asciiart-logo. I struggled with modularizing the code, I ended up not doing that to save time but am happy that the app works as intended. For future development I would like to add more functionality to the app, such as the ability to update an employee's manager, the ability to view employees by manager or department, and add more options to exit in the command prompt lists. I would also, ideally, make the code modular to make it easier to read and maintain. I did have to troubleshoot some issues with the code not displaying the proper data, but I was able to fix those issues with the help of my instructor, ChatGPT, Google, and Stack Overflow, and used the corrected code as a template to complete the rest of the app. I also found the syntax for joining tables to be a bit confusing, but I was able to figure it out with the help of the MySQL documentation. I am happy with the final product, and I think it is a good start to a more complex app. I wanted to have a little more fun with this project so I set the database to use characters from the Wizarding World of Harry Potter, and added a wizard emoji in the console log for when tables are modified. After all, coding does sometimes feel like you're doing magic, so I thought the theme was fitting. The app can be easily modified for professional use.

## Table of Contents
- [Installation](#Installation)
- [Usage](#Usage)
- [Credits](#Credits)
- [License](#License)
- [Contributing](#Contributing)
- [Tests](#Tests)
- [Questions](#Questions)

## Installation
To install the app, clone the repo and run `npm install` to install the dependencies. Then, run `node server.js` to start the app.

## Usage
After installing the dependencies by running `npm install`, run `node server.js` to start the app. Then, select an option from the main menu using the keyboard arrows. The user can view, add, and delete employees, roles, and departments, and update employee roles. The user can also view the total utilized budget of a department, which is the combined salaries of all employees in that department.
[Watch the run-through video](https://drive.google.com...)

## Credits
- Inquirer NPM package documentation: 
  - https://www.npmjs.com/package/inquirer/v/8.2.4
- MySQL NPM package documentation:
    - https://www.npmjs.com/package/mysql
- console.table NPM package documentation:
    -https://www.npmjs.com/package/console.table?activeTab=dependents
- asciiart-logo NPM package documentation:
    - https://www.npmjs.com/package/asciiart-logo
- MySQL documentation:
    - https://dev.mysql.com/doc/refman/8.0/en/
- Stack Overflow on how to concatenate multiple columns into one:
    -https://stackoverflow.com/questions/3757723/how-to-combine-multiple-columns-as-one-and-format-with-custom-strings
- Documentation on how to JOIN tables:
    - https://www.w3schools.com/sql/sql_join.asp
    - https://www.prisma.io/dataguide/mysql/reading-and-querying-data/joining-tables
- Map function documentation:
    - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
    - https://www.w3schools.com/jsref/jsref_map.asp
- Cute magician emoji for console.log:
    - https://emojicombos.com/magic
- ChatGPT for helping me troubleshoot the code.
- My instructor, Edward Apostol, for guiding me on how to go about extracting data from the tables and using it to populate the lists in the command prompt.
- The BCS module 12 exercises were referenced for everything except the console.table and asciiart-logo NPM packages.
- GitHub copilot for helping me write the code and providing me with the correct syntax for the MySQL queries and validating the code.

## License
  This project is licensed under the [MIT License](https://opensource.org/licenses/MIT)

## Contributing
Create an issue in repo: https://github.com/milena-allaway/employee_tracker/issues

## Tests
N/A

## Questions
For any questions or feedback, please contact me via:
- GitHub: [milena-allaway](https://github.com/milena-allaway)
- Email: [milenawheatcroft@gmail.com](mailto:milenawheatcroft@gmail.com)

***

Made with ❤️ by Milena Allaway
