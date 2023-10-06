const db = require("../db/connection");

exports.getAllByArticleId = (article_id) => {
  // only seems to work with regex not checking typeof (maybe because a string is returned rather than number)
  if (!article_id.match(/^\d+$/)) {
    // ^ If the ID is not a valid number
    return Promise.reject({
      status: 400,
      message: "Bad path! ID must be a number",
    });
  }
  return db
    .query(
      `
      SELECT *
      FROM comments
      WHERE article_id = $1
      ORDER BY created_at DESC
    `,
      [article_id]
    )
    .then((comments) => {
      if (comments.rows.length === 0) {
        return Promise.reject({ status: 404, message: "Not found" });
      }
      return comments.rows;
    });
};
