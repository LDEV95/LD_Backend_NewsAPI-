const db = require("../db/connection");
exports.postComment = (username, body, article_id) => {
  return db
    .query(
      `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING*;`,
      [username, body, article_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};
