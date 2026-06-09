const { Router } = require("express");
const {
  getArticles,
  getArticleById,
  createArticle,
  replaceArticle,
  updateArticle,
  deleteArticle,
} = require("../controllers/articles");

const router = Router();

// TODO: conectar cada ruta con su controlador
// Pista: usa router.get(), router.post(), router.put(), router.patch(), router.delete()

router.get("/", getArticles);
router.get("/:id", getArticleById);
router.post("/", createArticle);
router.put("/:id", replaceArticle);
router.patch("/:id", updateArticle);
router.delete("/:id", deleteArticle);

module.exports = router;
