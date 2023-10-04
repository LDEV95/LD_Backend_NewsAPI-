const express = require("express");

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

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// app.uses < error handling middlewear // need to get familiar with this

module.exports = app;
