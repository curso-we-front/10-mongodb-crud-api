const { Router } = require('express');
const {
  getArticles,
  getArticleById,
  createArticle,
  replaceArticle,
  updateArticle,
  deleteArticle,
} = require('../controllers/articles');

const router = Router();

// TODO: conectar cada ruta con su controlador
// Pista: usa router.get(), router.post(), router.put(), router.patch(), router.delete()

module.exports = router;
