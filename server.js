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
          });
        console.log("\n");
        console.log("\n");
        console.log("\n");
        console.log("\n");
        promptUser();
      } else {
        console.log("Wrong choice");
        promptUser();
      }
    });
}

promptUser();
