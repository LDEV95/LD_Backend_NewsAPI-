const db = require("../db/connection");

exports.getTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((result) => result.rows);
};
