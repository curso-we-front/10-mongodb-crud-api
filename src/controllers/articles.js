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
async function getArticles(req, res, next) {
  try {
    const { tag, search } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const filter = { published: true };

    if (tag) filter.tags = tag;

    if (search) {
      filter.$or = [
        { title: new RegExp(search, "i") },
        { content: new RegExp(search, "i") },
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
  const id = req.params.id;

  try {
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
  const { title, content, author, published, tags, createdAt } = req.body;
  const newArticle = {
    title: title,
    content: content,
    author: author,
    published: published,
    tags: tags,
    createdAt: createdAt,
  };

  try {
    const createdArticle = await Article.create(newArticle);

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
  const id = req.params.id;

  try {
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

async function updateArticle(req, res, next) {
  const id = req.params.id;

  try {
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
  const id = req.params.id;

  try {
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
