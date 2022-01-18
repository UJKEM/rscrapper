const express = require("express");
const app = express();
const $ = require("cheerio");
const cors = require("cors");
const scrapper = require("./routes/api/scrapper");
const db = require("./config/db");

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cors());

db.connection.connect(function (err) {
  if (err) {
    throw err;
  } else {
    console.log("Connection successfully established");
  }
});

app.use("/", scrapper);

app.listen(4000, () => {
  console.log("Listening on port 4000");
});
