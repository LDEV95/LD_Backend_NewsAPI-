const db = require("../db/connection");

exports.getAllByArticleId = (article_id) => {
  const query = `
    SELECT *
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC
  `;

  return db
    .any(query, [article_id])
    .then((comments) => comments)
    .catch((error) => {
      console.error("Error in getAllByArticleId:", error);
      throw { status: 500, message: "Internal Server Error" };
    });
};
