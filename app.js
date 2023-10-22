// LEFT TO DO ON SUNDAY / BEFORE - SET MORE TESTS UP, TIDY EVERYTHING UP, ADD EACH ENDPOINT TO THE README

const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const {
  Errors,
  PSQLErrors,
} = require("./errorHandlers/errorHandling.errors.controllers");
const { sendTopics } = require("./controllers/Topics.controllers");
const endpointsData = require("./endpoints.json");
const { sendUsers } = require("./controllers/Users.controllers");
const {
  getArticles,
  getArticlesByID,
  getArticleCommentsById,
  insertComment,
  incVotes,
} = require("./controllers/Articlescontrollers");
const { delComments } = require("./controllers/Comments.controllers");

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).json(endpointsData);
});

app.get("/api/topics", sendTopics);
app.get("/api/articles/:article_id", getArticlesByID);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getArticleCommentsById);
app.get("/api/users", sendUsers);
app.post("/api/articles/:article_id/comments", insertComment);
app.patch("/api/articles/:article_id", incVotes);
app.delete("/api/comments/:comment_id", delComments);

app.use(Errors);
app.use(PSQLErrors);

module.exports = app;
