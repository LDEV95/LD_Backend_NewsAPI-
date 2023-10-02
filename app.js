const express = require("express");
const app = express();
const { sendTopics } = require("./controllers/NCNEWS.controllers");
app.get("/api/topics", sendTopics);

module.exports = app;
