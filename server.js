//const routes = require("./routes");
const db = require("./config/connection");
//const sequelize = require("./config/connection");
//const connection = require('./config/connection')

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
  console.log("Database connected.");

  console.log(`Server running on port ${PORT}`);
});
