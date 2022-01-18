const mysql = require("mysql");

const config = {
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
  port: process.env.port,
};

module.exports = {
  connection: mysql.createConnection(config),
};
