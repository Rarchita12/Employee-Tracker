//required packages
const inquirer = require("inquirer");
require("dotenv").config();
const mysql = require("mysql2");
//SQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_NAME,
  multipleStatements: true,
});

const PORT = process.env.PORT || 3001;

//Function to Promp the User with Menu
async function promptUser() {
  //Menu
  inquirer
    .prompt([
      {
        type: "list",
        name: "menu",
        message: "Please select and option from the menu below:",
        choices: [
          "View all Departments",
          "View all Roles",
          "View all Employees",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update an Employee Role",
          "View total utilized budget of a department",
          "Delete Employee",
          "Exit Application",
        ],
      },
    ])
    .then(function (data) {
      //call menu selection
      if (data.menu === "View all Departments") {
        //sql query to view all departments
        db.promise()
          .query("Select * from department")
          .then((data) => {
            const [rows] = data;
            console.log("\n");
            console.table(rows);
            console.log("\n");

            promptUser();
          });
      } else if (data.menu === "View all Roles") {
        //sql query to view all roles
        db.promise()
          .query(
            "SELECT role.id, role.title, role.salary, department.department_name FROM role LEFT JOIN department on role.department_id = department.id;"
          )
          .then((data) => {
            const [rows] = data;
            console.log("\n");
            console.table(rows);
            console.log("\n");

            promptUser();
          });
      } else if (data.menu === "View all Employees") {
        //sql query to view all employees
        db.promise()
          .query(
            `Select employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.department_name, 
              CONCAT(e.first_name, ' ' ,e.last_name) AS Manager from employee 
              left join role on employee.role_id = role.id 
              left join department on role.department_id = department.id 
              left join employee e on employee.manager_id = e.id;`
          )
          .then((data) => {
            const [rows] = data;
            console.log("\n");
            console.table(rows);
            console.log("\n");

            promptUser();
          });
      } else if (data.menu === "Add a Department") {
        //sql query to add a department
        inquirer
          .prompt([
            {
              type: "input",
              name: "department_name",
              message: "What is the department's name?",
              validate: function (input) {
                const namePass = input.match(/^$/);
                if (namePass) {
                  return "Please enter a department name!";
                }
                return true;
              },
            },
          ])
          .then(function (data) {
            db.promise()
              .query(
                "INSERT IGNORE INTO department (department_name) VALUES (?);",
                data.department_name
              )
              .then((data) => {
                console.log("Successfully added a Department!");
                promptUser();
              });
          });
      } else if (data.menu === "Add a Role") {
        //sql query to add a role
        inquirer
          .prompt([
            {
              type: "input",
              name: "role_name",
              message: "What is the name of this role?",
              validate: function (input) {
                const namePass = input.match(/^$/);
                if (namePass) {
                  return "Please enter a role name!";
                }
                return true;
              },
            },
            {
              type: "input",
              name: "salary",
              message: "What is the salary of this role?",
              validate: function (input) {
                const namePass = input.match(/^$/);
                if (namePass) {
                  return "Please enter a salary!";
                }
                return true;
              },
            },
            {
              type: "input",
              name: "department_name",
              message: "What is the name of the department for this role?",
              validate: function (input) {
                const namePass = input.match(/^$/);
                if (namePass) {
                  return "Please enter a department name!";
                }
                return true;
              },
            },
          ])
          .then(function (data) {
            db.promise()
              .query(
                `INSERT IGNORE INTO department (department_name) VALUES("${data.department_name}");
                  INSERT IGNORE INTO role (title, salary, department_id ) 
                  VALUES("${data.role_name}", "${data.salary}", (SELECT id FROM department WHERE department_name = "${data.department_name}"));`
              )
              .then((data) => {
                console.log("Successfully added a Role!");
                promptUser();
              });
          });
      } else if (data.menu === "Add an Employee") {
        //call employee_add to add an employee
        employee_add();
      } else if (data.menu === "Update an Employee Role") {
        //call update_employee_role to update an employee
        update_employee_role();
      } else if (data.menu === "View total utilized budget of a department") {
        //call view_budget to view total utilized budget of a department
        view_budget();
      } else if (data.menu === "Delete Employee") {
        //call delete_employee to delete an employee
        delete_employee();
      } else {
        //Exit application
        console.log("Thank you for using Employee Tracker, Bye Now!");
        process.exit(1);
      }
    });
}

/*Function to Delete Employee*/
async function delete_employee() {
  //prompt user with employee's to potentially delete
  async function chooseDeleteEmployee() {
    let employees;
    await db
      .promise()
      .query(`SELECT CONCAT(first_name, ' ' ,last_name) as name from employee;`)
      .then((data) => {
        employees = data[0].map((x) => {
          employees = x.name;

          return employees;
        });
      });

    return employees;
  }

  //delete choosen employee from database
  async function dbDeleteEmployee(listDeleteEmployees) {
    await inquirer
      .prompt([
        {
          type: "list",
          name: "deleteEmployee",
          message: "Which employee would you like to delete?",
          choices: listDeleteEmployees,
        },
      ])
      .then(function (data) {
        db.promise()
          .query(
            `DELETE FROM employee WHERE CONCAT(first_name, ' ' ,last_name) = "${data.deleteEmployee}";`
          )
          .then((data) => {
            const [rows] = data;

            console.log("Successfuly Deleted Employee!");
            promptUser();
          });
      });
  }

  var listDeleteEmployee = await chooseDeleteEmployee();

  dbDeleteEmployee(listDeleteEmployee);
}

/*View total utilized budget of a department*/
async function view_budget() {
  //prompt user with potential department to delete
  async function chooseDepartment() {
    let departments;
    await db
      .promise()
      .query(`SELECT department_name from department;`)
      .then((data) => {
        departments = data[0].map((x) => {
          departments = x.department_name;

          return departments;
        });
      });

    return departments;
  }

  //display budget
  async function dbDisplayBudget(departments) {
    await inquirer
      .prompt([
        {
          type: "list",
          name: "department",
          message:
            "Which department would you like to view the total utilized budget for?",
          choices: departments,
        },
      ])
      .then(function (data) {
        db.promise()
          .query(
            `Select department.department_name, 
             sum(role.salary) as total_utilized_budget from role
             inner join employee on employee.role_id = role.id
             inner join department on department.id = role.department_id
              where department.department_name = "${data.department}" group by department.department_name;`
          )
          .then((data) => {
            const [rows] = data;
            console.log("\n");
            console.table(rows);
            console.log("\n");

            promptUser();
          });
      });
  }

  var departments = await chooseDepartment();

  dbDisplayBudget(departments);
}

/*function to update employee role*/
async function update_employee_role() {
  //prompt user to choose an employee
  async function chooseEmployee() {
    let employees;
    await db
      .promise()
      .query(`SELECT CONCAT(first_name, ' ' ,last_name) as name from employee;`)
      .then((data) => {
        employees = data[0].map((x) => {
          employees = x.name;

          return employees;
        });
      });

    return employees;
  }

  //prompt user to choose role update
  async function chooseRole() {
    let roles;
    await db
      .promise()
      .query(`Select role.title from role;`)
      .then((data) => {
        roles = data[0].map((x) => {
          roles = x.title;

          return roles;
        });
      });

    return roles;
  }

  //update database with new role
  async function dbupdateEmployeeRole(employees, roles) {
    await inquirer
      .prompt([
        {
          type: "list",
          name: "employee_fullName",
          message: "Which employee would you like to update their role for?",
          choices: employees,
        },
        {
          type: "list",
          name: "role_update",
          message: "What would you like to update the role to?",
          choices: roles,
        },
      ])
      .then(function (data) {
        db.promise()
          .query(
            `UPDATE employee 
               SET role_id = (SELECT id FROM role WHERE title = "${data.role_update}")
               WHERE CONCAT(first_name, ' ', last_name) = "${data.employee_fullName}";`
          )
          .then((data) => {
            console.log("Successfully updated an Employee Role!");

            promptUser();
          });
      });
  }

  var employees = await chooseEmployee();

  var roles = await chooseRole();

  dbupdateEmployeeRole(employees, roles);
}

/*function to add employee to database*/
async function employee_add() {
  //choose role
  async function chooseRole() {
    let roles;
    await db
      .promise()
      .query(`Select role.title from role;`)
      .then((data) => {
        roles = data[0].map((x) => {
          roles = x.title;

          return roles;
        });
      });

    return roles;
  }
  //choose manager
  async function chooseManager() {
    let managers;
    await db
      .promise()
      .query(`SELECT CONCAT(first_name, ' ' ,last_name) from employee;`)
      .then((data) => {
        managers = data[0].map((x) => {
          managers = x.title;

          return managers;
        });
      });

    managers.push("NULL");
    return managers;
  }
  //add more employee attributes and add to database
  async function addEmployee(roles, managers) {
    await inquirer
      .prompt([
        {
          type: "input",
          name: "first_name",
          message: "What is the first name of the employee?",
          validate: function (input) {
            const namePass = input.match(/^$/);
            if (namePass) {
              return "Please enter a first name!";
            }
            return true;
          },
        },
        {
          type: "input",
          name: "last_name",
          message: "What is the last name of the employee?",
          validate: function (input) {
            const namePass = input.match(/^$/);
            if (namePass) {
              return "Please enter a last name!";
            }
            return true;
          },
        },
        {
          type: "list",
          name: "employee_role",
          message: "Please select the employee's role from the menu below:",
          choices: roles,
        },
        {
          type: "list",
          name: "employee_manager",
          message: "Please select the employee's role from the menu below:",
          choices: [
            "None",
            "Jamie Dimon",
            "Doug Dime",
            "Bill Doe",
            "Joe Ole",
            "Sam Grof",
            "Bob Smith",
          ],
        },
      ])
      .then(function (data) {
        if (data.employee_manager === "None") {
          db.promise()
            .query(
              `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES("${data.first_name}", "${data.last_name}", (SELECT id FROM role WHERE title = "${data.employee_role}"), NULL);`
            )
            .then((data) => {
              console.log("Successfully added a Employee!");

              promptUser();
            });
        } else {
          db.promise()
            .query(
              `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES("${data.first_name}", "${data.last_name}", (SELECT id FROM role WHERE title = "${data.employee_role}"), (SELECT id FROM employee as e WHERE CONCAT(e.first_name, ' ' ,e.last_name) = "${data.employee_manager}"));`
            )
            .then((data) => {
              console.log("Successfully added a Employee!");
              promptUser();
            });
        }
      });
  }
  var roles = await chooseRole();
  var managers = await chooseManager();

  addEmployee(roles, managers);
}

//start menu prompt
promptUser();
