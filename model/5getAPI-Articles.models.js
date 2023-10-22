const db = require("../db/connection");
/* old stuff 
exports.selectArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Resource not found" });
      }
      return result.rows[0];
    });
};

exports.fetchArticles = (topic) => {
  if (topic) {
    return db
      .query(`SELECT * FROM articles WHERE topic = $1;`, [topic])
      .then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject({ status: 404, msg: "resource not found" });
        }
        return result.rows;
      });
  } else {
    return db
      .query(
        `SELECT 
            articles.article_id,
            articles.title,
            articles.author,
            articles.created_at,
            articles.topic,
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
         if (!rows) {
        return Promise.reject({ status: 404, message: "ID not found!" });
      } // dont need to use this as app.use handles it
        return rows;
      });
  }
}; 
*/

exports.festchArticleCommentsById = (article_id) => {
  return db
    .query(
      "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;",
      [article_id]
    )
    .then((result) => {
      return result.rows;
    });
};
exports.fetchAllArticles = (topic) => {
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

/*

const queryValues = [];
let queryStr = 'SELECT * FROM articles;`;

if (topic) {
  queryValues.push(topic);
  queryStr += ` WHERE articles.topic = $1`;
}
*/
