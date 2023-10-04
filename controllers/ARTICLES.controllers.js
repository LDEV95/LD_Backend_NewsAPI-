const { fetchArticleByID } = require("../model/getArticlesById.models");

exports.getArticles = (req, res, next) => {
  const article_id = req.params;
  fetchArticleByID(article_id)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((error) => {
      if (error.status === 404) {
        res.status(404).json({ message: error.message });
      } else if (error.status === 400) {
        res.status(400).json({ message: error.message });
      } else {
        next(error); // goes to next error handling middlewear
      }
    });
};
