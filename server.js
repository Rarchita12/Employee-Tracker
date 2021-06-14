const inquirer = require("inquirer");
const { up } = require("inquirer/lib/utils/readline");
require('dotenv').config();
const mysql = require("mysql2");
var test = ["hi", "test"];
const db = mysql.createConnection({
  host: "localhost",
  // Your MySQL username,
  user: process.env.DB_USER,
  // Your MySQL password
  password: process.env.DB_PW,
  database: process.env.DB_NAME,
  multipleStatements: true,
});

const PORT = process.env.PORT || 3001;


//Function to Promp the User with Questions
async function promptUser() {
    //promt Manager questions
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
                  const [rows] = data;
                  console.log("\n");
                  console.table(rows);
                  console.log("\n");
  
                  promptUser();
                });
            });
        } else if (data.menu === "Add a Role") {
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

               
                  const [rows] = data;
                   console.log("\n");
               console.table(rows);
                console.log("\n");
  
                  promptUser();
                });
            });
        } else if (data.menu === "Add an Employee") {
            employee_add();
        } else if (data.menu === "Update an Employee Role") {
            update_employee_role();
        }
        else if (data.menu === "View total utilized budget of a department") {
            view_budget();
        } 
        else if (data.menu === "Delete Employee") {
            delete_employee();
        } 
        else {
          console.log("Thank you for using Employee Tracker, Bye Now!");
          process.exit(1);
        }
      });
  }
  


  async function delete_employee (){
    
    async function chooseDeleteEmployee() {
        let employees;
        await  db.promise()
        .query(`SELECT CONCAT(first_name, ' ' ,last_name) as name from employee;`)
        .then((data) => {
         //  roles = ['test','test']
      //    for(var i =0; i<data[0].length; i++){
      //        data[i]
      //    }
     // console.log(data);
      employees= data[0].map((x) => {
        employees = x.name;
        //  console.log("Here testRole");
        // console.log(roles);
        // console.log(roles.length);
        //console.log(employees);
             return  employees;
       });
       
     //  console.log(JSON.stringify(roles));
      // console.log("This is the roles: " +roles);
        });
        //console.log("This is the roles: " +roles);
        //managers.push('NULL');
       //console.log(employees);
        return  employees;
    }
    
    


    async function dbDeleteEmployee(listDeleteEmployees) {
       // console.log(roles);
       await inquirer
       .prompt([
         {
           type: "list",
           name: "deleteEmployee",
           message:
             "Which employee would you like to delete?",
           choices:listDeleteEmployees
         },
         
       ])
       .then(function (data) {
         db.promise()
           .query(
             `DELETE FROM employee WHERE CONCAT(first_name, ' ' ,last_name) = "${data.deleteEmployee}";`
           )
           .then((data) => {
             const [rows] = data;
             console.log("\n");
             console.table(rows);
             console.log("\n");
            console.log("Successfuly Deleted Employee!");
             promptUser();
           });
       });
    }
  
  var listDeleteEmployee = await chooseDeleteEmployee();
  //console.log(employees);
  
  //console.log(roles);
dbDeleteEmployee(listDeleteEmployee);


}










/*View total utilized budget of a department*/
  async function view_budget (){
    
    async function chooseDepartment() {
        let departments;
        await  db.promise()
        .query(`SELECT department_name from department;`)
        .then((data) => {
         //  roles = ['test','test']
      //    for(var i =0; i<data[0].length; i++){
      //        data[i]
      //    }
     // console.log(data);
     departments= data[0].map((x) => {
        departments = x.department_name;
        //  console.log("Here testRole");
        // console.log(roles);
        // console.log(roles.length);
        //console.log(employees);
             return  departments;
       });
       
     //  console.log(JSON.stringify(roles));
      // console.log("This is the roles: " +roles);
        });
        //console.log("This is the roles: " +roles);
        //managers.push('NULL');
       //console.log(employees);
        return  departments;
    }
    
    


    async function dbDisplayBudget(departments) {
       // console.log(roles);
       await inquirer
       .prompt([
         {
           type: "list",
           name: "department",
           message:
             "Which department would you like to view the total utilized budget for?",
           choices: departments
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
  //console.log(employees);
  
  //console.log(roles);
dbDisplayBudget(departments);


}












 
  
  async function update_employee_role (){
    
    async function chooseEmployee() {
        let employees;
        await  db.promise()
        .query(`SELECT CONCAT(first_name, ' ' ,last_name) as name from employee;`)
        .then((data) => {
         //  roles = ['test','test']
      //    for(var i =0; i<data[0].length; i++){
      //        data[i]
      //    }
     // console.log(data);
      employees= data[0].map((x) => {
        employees = x.name;
        //  console.log("Here testRole");
        // console.log(roles);
        // console.log(roles.length);
        //console.log(employees);
             return  employees;
       });
       
     //  console.log(JSON.stringify(roles));
      // console.log("This is the roles: " +roles);
        });
        //console.log("This is the roles: " +roles);
        //managers.push('NULL');
       //console.log(employees);
        return  employees;
    }
    
    async function chooseRole() {
        let roles;
        await  db.promise()
        .query(`Select role.title from role;`)
        .then((data) => {
         //  roles = ['test','test']
      //    for(var i =0; i<data[0].length; i++){
      //        data[i]
      //    }
          roles= data[0].map((x) => {
          roles = x.title;
        //  console.log("Here testRole");
        // console.log(roles);
        // console.log(roles.length);
             return roles;
       });
       
     //  console.log(JSON.stringify(roles));
      // console.log("This is the roles: " +roles);
        });
        //console.log("This is the roles: " +roles);
        return roles;
    }


    async function dbupdateEmployeeRole(employees, roles) {
       // console.log(roles);
       await inquirer
       .prompt([
         {
           type: "list",
           name: "employee_fullName",
           message:
             "Which employee would you like to update their role for?",
           choices: employees
         },
         {
           type: "list",
           name: "role_update",
           message: "What would you like to update the role to?",
           choices: roles
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
             const [rows] = data;
             console.log("\n");
             console.table(rows);
             console.log("\n");

             promptUser();
           });
       });
    }
  
  var employees = await chooseEmployee();
  //console.log(employees);
  var roles =  await chooseRole();
  //console.log(roles);
dbupdateEmployeeRole(employees, roles);


}






async function employee_add (){
    
    async function chooseRole() {
        let roles;
        await  db.promise()
        .query(`Select role.title from role;`)
        .then((data) => {
         //  roles = ['test','test']
      //    for(var i =0; i<data[0].length; i++){
      //        data[i]
      //    }
          roles= data[0].map((x) => {
          roles = x.title;
        //  console.log("Here testRole");
        // console.log(roles);
        // console.log(roles.length);
             return roles;
       });
       
     //  console.log(JSON.stringify(roles));
      // console.log("This is the roles: " +roles);
        });
        //console.log("This is the roles: " +roles);
        return roles;
    }


    async function chooseManager() {
        let managers;
        await  db.promise()
        .query(`SELECT CONCAT(first_name, ' ' ,last_name) from employee;`)
        .then((data) => {
         //  roles = ['test','test']
      //    for(var i =0; i<data[0].length; i++){
      //        data[i]
      //    }
          managers= data[0].map((x) => {
          managers = x.title;
        //  console.log("Here testRole");
        // console.log(roles);
        // console.log(roles.length);
             return managers;
       });
       
     //  console.log(JSON.stringify(roles));
      // console.log("This is the roles: " +roles);
        });
        //console.log("This is the roles: " +roles);
        managers.push('NULL');
        return managers;
    }
    

    async function addEmployee(roles, managers) {
       // console.log(roles);
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
            choices: roles
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
                  const [rows] = data;
                  console.log("\n");
                  console.table(rows);
                  console.log("\n");

                  promptUser();
                });
            } else {
              db.promise()
                .query(
                  `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES("${data.first_name}", "${data.last_name}", (SELECT id FROM role WHERE title = "${data.employee_role}"), (SELECT id FROM employee as e WHERE CONCAT(e.first_name, ' ' ,e.last_name) = "${data.employee_manager}"));`
                )
                .then((data) => {
                  const [rows] = data;
                  console.log("\n");
                  console.table(rows);
                  console.log("\n");

                  promptUser();
                });
            }
          });
    }
  var roles =  await chooseRole();
  var managers = await chooseManager();
  //console.log(roles);
addEmployee(roles, managers);


}

//init().child1();
// init();
//child1;
promptUser();