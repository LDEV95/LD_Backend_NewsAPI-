const {
  GetAllArticles,
  GetArticlesById,
  GetArticleComments,
  postComment,
  patchComment,
} = require("../model/Articles.models");

exports.getArticles = (req, res, next) => {
  const { topic } = req.query;
  GetAllArticles(topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticlesByID = (req, res, next) => {
  const { article_id } = req.params;
  GetArticlesById(article_id)
    .then((article) => {
      res.status(200).json(article);
    })
    .catch((err) => {
      next(err);
    });
};
exports.getArticleCommentsById = (req, res, next) => {
  const { article_id } = req.params;
  GetArticlesById(article_id)
    .then(() => {
      return GetArticleComments(article_id);
    })
    .then((comment) => {
      res.status(200).json(comment);
    })
    .catch((err) => {
      next(err);
    });
};
exports.insertComment = (req, res, next) => {
  const { username, body } = req.body;
  const article_id = req.params.article_id;
  postComment(username, body, article_id).then((result) => {
    res.status(201).json(result);
  });
};
exports.incVotes = (req, res, next) => {
  const article_id = req.params.article_id;

  const voteToAdd = req.body.inc_votes;

  patchComment(voteToAdd, article_id).then((result) => {
    res.status(201).json(result);
  });
};
