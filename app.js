const express = require("express");

// 2
const { sendTopics } = require("./controllers/NCNEWS.controllers");
// 3
const endpointsData = require("./endpoints.json");
// 4
const { getArticles } = require("./controllers/ARTICLES.controllers");
// 5
const {
  getALLArticles,
} = require("./controllers/5getAPI-Articles.controllers");
// 6
const {
  getAllByArticleId,
} = require("./controllers/6getarticles-idcomments.controllers");
// 7
const { insertComment } = require("./controllers/7POSTarticles-ID.controllers");

// 10
const { sendUsers } = require("./controllers/10-get-api-users.controllers");

const app = express();

app.use(express.json());

// task 3 .json connection
app.get("/api", (req, res) => {
  res.status(200).json(endpointsData);
});

app.get("/api/topics", sendTopics);
app.get("/api/articles/:article_id", getArticles);
app.get("/api/articles", getALLArticles);
app.get("/api/articles/:article_id/comments", getAllByArticleId);
app.get("/api/users", sendUsers);

app.post("/api/articles/:article_id/comments", insertComment);

// error hadnling middlewear
app.all("/*", (req, res, next) => {
  console.log("hello");
  res.status(404).json({ error: "Not Found" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "server error" });
});

module.exports = app;
