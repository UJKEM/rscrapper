const express = require("express");
const urlencodedParser = express.urlencoded({ extended: true });
const cheerio = require("cheerio");
const router = express.Router();
const axios = require("axios");
const db = require("../../config/db");
const con = db.connection;

router.get("/home", async (req, res) => {
  con.query("SELECT * FROM jobs", (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      const jr = JSON.stringify(result);
      const fr = JSON.parse(jr);
      return res.status(200).json({ fr });
    }
    return res.status(404).json({ error: "No jobs found." });
  });
});

router.get("/recentSearch", async (req, res) => {
  con.query("SELECT * FROM jtitle;", (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      const jr = JSON.stringify(result);
      const rs = JSON.parse(jr);
      return res.status(200).json({ rs });
    }
    return res.status(404).json({ error: "No title found." });
  });
});

router.post("/search", [urlencodedParser], async (req, res) => {
  let fr = [],
    rs;
  const title = req.body.title;

  con.query(
    `SELECT * from jtitle where title like '%${title}%';`,
    (error, result) => {
      if (error) throw error;
      if (result.length > 0) {
        con.query(
          `SELECT * from jobs where title like '%${title}%'`,
          (error, result) => {
            if (error) throw error;
            if (result.length > 0) {
              const jr = JSON.stringify(result);
              fr = JSON.parse(jr);
            }
            axios.get("http://localhost:4000/recentSearch").then((response) => {
              rs = response.data;
              return res.status(200).json({ fr, rs });
            });
          }
        );
      } else {
        con.query(
          `INSERT INTO jtitle(title) VALUE ('${title}')`,
          (err, result) => {
            if (err) throw err;
            console.log("Number of rows affected " + result.affectedRows);
            axios.get(`https://indeed.com/jobs?q=${title}`).then((response) => {
              const html = response.data;

              const $ = cheerio.load(html);

              let scrapes = [];
              let post = [];

              $(
                "div.slider_container > div > div.slider_item > div > table.jobCard_mainContent"
              ).each((_idx, el) => {
                const shelf = $(el);
                const next = $(el).first();
                const nf = $(el).next();
                post.push(shelf.find("h2.jobTitle > span").text());
                post.push(next.find("pre > span").first().text());
                post.push(next.find("span.ratingNumber").text());
                post.push(shelf.find(".companyLocation").text());
                post.push(nf.find("div > ul > li").first().text());
                scrapes.push(post);
                console.log(post);
                post = [];
              });
              delete post;
              con.query(
                "INSERT INTO jobs(title, company, rating, location, requirements) VALUES ?",
                [scrapes],
                (error, result) => {
                  if (error) throw error;
                  if (result.affectedRows > 0) {
                    con.query(
                      `SELECT * from jobs where title like '%${title}%'`,
                      (error, result) => {
                        if (result.length > 0) {
                          const jr = JSON.stringify(result);
                          fr = JSON.parse(jr);
                        }
                      }
                    );
                  }
                  axios
                    .get("http://localhost:4000/recentSearch")
                    .then((response) => {
                      rs = response.data;
                      return res.status(200).json({ fr, rs });
                    });
                }
              );
            });
          }
        );
      }
    }
  );
});

router.get("/data", (req, res) => {
  return con.query("select * from jobs", (err, result) => {
    if (err) throw err;
    return res.json(JSON.stringify(result));
  });
});

module.exports = router;
