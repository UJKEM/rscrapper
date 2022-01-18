const mysql = require("mysql");

const config = {
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
  port: 3306,
};

module.exports = {
  connection: mysql.createConnection(config),
};
