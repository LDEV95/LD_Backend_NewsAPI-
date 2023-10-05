const commentsModel = require("../model/6getarticles-idcomments.models");

exports.getAllByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  commentsModel
    .getAllByArticleId(article_id)
    .then((comments) => {
      if (comments.length === 0) {
        // Throw a specific error for non-existent IDs
        throw { status: 404, message: "Not found" };
      }
      res.status(200).json(comments);
    })
    .catch((error) => {
      if (error.status === 404) {
        res.status(404).json({ message: error.message });
      } else if (error.status === 400) {
        res.status(400).json({ message: error.message });
      }
    });
};
