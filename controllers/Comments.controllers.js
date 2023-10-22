const { delById } = require("../model/Comments.models");

exports.delComments = (req, res, next) => {
  const { comment_id } = req.params;

  delById(comment_id)
    .then((result) => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
