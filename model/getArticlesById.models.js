const db = require("../db/connection");

exports.fetchArticleByID = (article_id) => {
  if (!article_id.article_id.match(/^\d+$/)) {
    // If the ID is not a valid number
    return Promise.reject({
      status: 400,
      message: "Bad path! ID must be a number",
    });
  }
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [
      article_id.article_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "ID not found!" });
      }

      return rows[0];
    });
};
