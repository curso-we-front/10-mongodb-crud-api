const Article = require("../models/Article");

/**
 * Tarea 2 & 3: Implementar los controladores del CRUD.
 * Todos los controladores deben usar try/catch y pasar errores con next(err).
 */

/**
 * GET /articles
 * Tarea 3: Devuelve artículos publicados con filtros y paginación.
 * Query params: tag, search, page (default 1), limit (default 10)
 * Respuesta: { data, total, page, limit, totalPages }
 */
const DEFAULT_PAGE = 1;
const LIMIT_PAGE = 10;

async function getArticles(req, res, next) {
  try {
    // TODO
    const { tag, search } = req.query;
    console.log(req.query);
    
    const page = (req.query.page || DEFAULT_PAGE -1) * LIMIT_PAGE

    const publishedArticles = Article.find({ published: true }).skip(page).limit(LIMIT_PAGE);
    const total = publishedArticles.countDocuments({})
    const totalPages = Math.ceil(total/LIMIT_PAGE)
    return req.status(200).json({publishedArticles, total, page, LIMIT_PAGE, totalPages})
  } catch (err) {
    next(err);
  }
}

/**
 * GET /articles/:id
 * Devuelve un artículo por su _id de MongoDB.
 * 404 si no existe.
 */
async function getArticleById(req, res, next) {
  try {
    // TODO
  } catch (err) {
    next(err);
  }
}

/**
 * POST /articles
 * Crea un artículo. Devuelve 201 con el artículo creado.
 */
async function createArticle(req, res, next) {
  try {
    // TODO
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /articles/:id
 * Reemplaza el artículo completo.
 * Pista: usa { new: true, overwrite: true, runValidators: true }
 */
async function replaceArticle(req, res, next) {
  try {
    // TODO
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /articles/:id
 * Actualización parcial. Solo actualiza los campos enviados.
 * Pista: usa { new: true, runValidators: true }
 */
async function updateArticle(req, res, next) {
  try {
    // TODO
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /articles/:id
 * Elimina el artículo. Devuelve 204 sin body.
 */
async function deleteArticle(req, res, next) {
  try {
    // TODO
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getArticles,
  getArticleById,
  createArticle,
  replaceArticle,
  updateArticle,
  deleteArticle,
};
