const db = require("../db/connection");

exports.GetArticlesById = (article_id) => {
  if (!article_id.match(/^\d+$/)) {
    // ^ If the ID is not a valid number
    return Promise.reject({
      status: 400,
      msg: "Bad path! ID must be a number",
    });
  }

  return db
    .query(
      "SELECT articles.*, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;",
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article doesn't exist" });
      }
      return result.rows;
    });
};
exports.GetArticleComments = (article_id) => {
  return db
    .query(
      "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;",
      [article_id]
    )
    .then((result) => {
      return result.rows;
    });
};

exports.GetAllArticles = (topic) => {
  if (topic) {
    return db.query("SELECT * FROM topics").then((result) => {
      const realTopic = result.rows.some((item) => item.slug === topic);
      if (realTopic) {
        return db
          .query("SELECT * FROM articles WHERE topic = $1;", [topic])
          .then((result) => {
            return result.rows;
          });
      }
      return Promise.reject({ status: 404, msg: "Not Found" });
    });
  }
  const getQuery = `SELECT 
  articles.article_id,
  articles.title, 
  articles.created_at, 
  articles.votes, 
  articles.article_img_url, 
  articles.topic, 
  articles.author, 
  COUNT(comments.comment_id) AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC`;

  return db.query(getQuery).then((result) => {
    return result.rows;
  });
};

exports.postComment = (username, body, article_id) => {
  return db
    .query(
      `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING*;`,
      [username, body, article_id]
    )
    .then((result) => {
      console.log(result);
      return result.rows[0];
    });
};

exports.patchComment = (voteToAdd, article_id) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
      [voteToAdd, article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return result.rows[0];
    });
};
