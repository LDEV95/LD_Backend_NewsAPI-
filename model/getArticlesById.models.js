const db = require("../db/connection");

exports.fetchArticleByID = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [
      article_id.article_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "id not found!" });
      }
      return rows[0];
    });
};
