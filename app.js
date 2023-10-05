const express = require("express");
const commentsController = require("./controllers/6getarticles-idcomments.controllers");

const { sendTopics } = require("./controllers/NCNEWS.controllers");
const endpointsData = require("./endpoints.json");
const { getArticles } = require("./controllers/ARTICLES.controllers");
const {
  getALLArticles,
} = require("./controllers/5getAPI-Articles.controllers");

const app = express();

// task 3 .json connection
app.get("/api", (req, res) => {
  res.status(200).json(endpointsData);
});

app.get("/api/topics", sendTopics);
app.get("/api/articles/:article_id", getArticles);
app.get("/api/articles", getALLArticles);
app.get("/api/articles/:article_id/comments", (req, res) =>
  commentsController.getAllByArticleId(req, res)
);

// error hadnling middlewear
app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

module.exports = app;
