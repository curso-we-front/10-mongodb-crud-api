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
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;
const MAX_SEARCH_LENGTH = 50;

async function getArticles(req, res, next) {
  try {
    const { tag, search } = req.query;

    const page = Math.max(
      DEFAULT_PAGE,
      parseInt(req.query.page) || DEFAULT_PAGE,
    );
    const limit = Math.max(
      1,
      Math.min(parseInt(req.query.limit) || DEFAULT_LIMIT, MAX_LIMIT),
    );

    const filter = { published: true };

    if (tag) filter.tags = tag;

    if (search) {
      if (search.length > MAX_SEARCH_LENGTH) {
        return res.status(400).json({ error: "Search demasiado largo" });
      }

      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      filter.$or = [
        { title: { $regex: safeSearch, $options: "i" } },
        { content: { $regex: safeSearch, $options: "i" } },
      ];
    }

    const total = await Article.countDocuments(filter);

    const data = await Article.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
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
    const id = req.params.id;
    const oneArticle = await Article.findById(id);

    if (!oneArticle) {
      return res.status(404).json({ error: "No existe el articulo" });
    }

    res.json(oneArticle);
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
    const createdArticle = await Article.create(req.body);
    res.status(201).json(createdArticle);
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
    const id = req.params.id;
    const updatedArticle = await Article.findByIdAndUpdate(id, req.body, {
      new: true,
      overwrite: true,
      runValidators: true,
    });

    if (!updatedArticle) {
      return res.status(404).json({ error: "No existe el articulo" });
    }

    res.json(updatedArticle);
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
    const id = req.params.id;
    const updatedArticle = await Article.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedArticle) {
      return res.status(404).json({ error: "No existe el articulo" });
    }

    res.json(updatedArticle);
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
    const id = req.params.id;
    const deleted = await Article.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "No existe el articulo" });
    }

    res.status(204).send();
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
