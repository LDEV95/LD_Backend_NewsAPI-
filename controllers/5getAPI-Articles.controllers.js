const { getArticlesFromDB } = require("../model/5getAPI-Articles.models");

exports.getALLArticles = (req, res) => {
  getArticlesFromDB().then((articles) => {
    const noBodyArticles = articles.map((article) => {
      const { body, ...rest } = article;
      return rest;
    });

    res.json({ articles: noBodyArticles });
  });
};
