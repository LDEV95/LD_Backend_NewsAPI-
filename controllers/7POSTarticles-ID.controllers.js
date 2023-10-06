const { postComment } = require("../model/7POSTarticles-ID.models");

exports.insertComment = (req, res, next) => {
  const { username, body } = req.body;
  const article_id = req.params.article_id;
  postComment(username, body, article_id).then((result) => {
    res.status(201).json(result);
  });
};
