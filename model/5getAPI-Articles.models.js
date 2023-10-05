const db = require("../db/connection");

exports.getArticlesFromDB = () => {
  return db
    .query(
      `
          SELECT 
            articles.author,
            articles.title,
            articles.article_id,
            articles.topic,
            articles.created_at,
            articles.votes,
            articles.article_img_url,
            COUNT(comments.comment_id) AS comment_count
          FROM articles
          LEFT JOIN comments ON articles.article_id = comments.article_id
          GROUP BY articles.article_id
          ORDER BY articles.created_at DESC;
        `
    )
    .then(({ rows }) => {
      /* if (!rows) {
        return Promise.reject({ status: 404, message: "ID not found!" });
      } */ // dont need to use this as app.use handles it
      return rows;
    });
};
