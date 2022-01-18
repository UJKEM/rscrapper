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

app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Origin",
    "https://reactscrapper.herokuapp.com"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST");
  next();
});

db.connection.connect(function (err) {
  if (err) {
    throw err;
  } else {
    console.log("Connection successfully established");
  }
});

app.use("/", scrapper);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
