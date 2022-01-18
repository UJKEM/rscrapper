const mysql = require("mysql");

const config = {
  host: "sql6.freesqldatabase.com",
  user: "sql6465208",
  password: "Xqfn4Mpdlh",
  database: "sql6465208",
  port: 3306,
};

module.exports = {
  connection: mysql.createConnection(config),
};
