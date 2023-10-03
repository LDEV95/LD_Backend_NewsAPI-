const express = require("express");
const app = express();
const { sendTopics } = require("./controllers/NCNEWS.controllers");
app.get("/api/topics", sendTopics);
const endpointsData = require("./endpoints.json");

app.get("/api/", (req, res) => {
  res.status(200).json(endpointsData);
});

module.exports = app;
