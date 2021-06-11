//const routes = require("./routes");
//const db = require("./config/connection");
const inquirer = require("inquirer");
//const sequelize = require("./config/connection");
//const connection = require('./config/connection')

const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  // Your MySQL username,
  user: "root",
  // Your MySQL password
  password: "racherla",
  database: "employee_tracker",
});

const PORT = process.env.PORT || 3001;

//app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

// turn on routes
//app.use(routes);

// turn on connection to db and server
/*
sequelize.sync({ force: false }).then(() => {
  connection.(PORT, () => console.log("Now listening"));
});
*/

// Start server after DB connection
db.connect((err) => {
  if (err) throw err;
  // console.log("Database connected.");

  // console.log(`Server running on port ${PORT}`);
});

//Function to Promp the User with Questions
function promptUser() {
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
          "Update a Employee Role",
          "Exit Application",
        ],
      },
    ])
    .then(function (data) {
      //create manager object and save manager object to userInput array

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
            "SELECT role.id, role.title, role.salary, department.name_department as department_name FROM role LEFT JOIN department on role.department_name = department.id;"
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
          .query("Select * from employee")
          .then((data) => {
            const [rows] = data;
            console.log("\n");
            console.table(rows);
            console.log("\n");

            promptUser();
          });
      } else if (data.menu === "Add a Department") {
      } else if (data.menu === "Add a Role") {
      } else if (data.menu === "Add an Employee") {
      } else if (data.menu === "Update a Employee Role") {
      } else {
        console.log("Thank you for using Employee Tracker and Bye Now!");
        process.exit(1);
      }
    });
}

promptUser();
