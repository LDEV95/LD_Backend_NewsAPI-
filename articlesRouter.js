const {
  getArticleById,
  getArticles,
  patchArticleById,
  postArticle,
  deleteArticleById,
} = require("../controllers/articles.controllers");
const articlesRouter = require("express").Router();

articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id", getArticleById);
articlesRouter.patch("/:article_id", patchArticleById);
articlesRouter.post("/", postArticle);
articlesRouter.delete("/:article_id", deleteArticleById);

module.exports = articlesRouter;
