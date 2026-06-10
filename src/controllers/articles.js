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
    const limit = parseInt(req.query.limit) || LIMIT_PAGE;
    const page = parseInt(req.query.page) || DEFAULT_PAGE;

    let filter = { published: true };
    if (tag) {
      filter.tags = tag;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const data = await Article.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);
    const total = parseInt(await Article.countDocuments({}));
    const totalPages = Math.ceil(total / LIMIT_PAGE);

    return res.status(200).json({ data, total, page, limit, totalPages });
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
    const id = req.params.id;
    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    return res.status(200).json(article);
  } catch (err) {
    return res.status(400).json({ error: "Invalid id" });
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
    if (!req.body.title || !req.body.content || !req.body.author) {
      let fields = [];
      if (!req.body.title) {
        fields.push("title");
      }
      if (!req.body.content) {
        fields.push("content");
      }
      if (!req.body.author) {
        fields.push("author");
      }
      return res
        .status(422)
        .json({ error: "Required fields are missing", fields });
    }
    const article = await Article.create(req.body);
    res.status(201).json(article);
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
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "Invalid id" });
    }
    const article = await Article.findOneAndReplace({ _id: id }, req.body, {
      new: true,
      overwrite: true,
      runValidators: true,
    });

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    return res.status(200).json(article);
  } catch (err) {
    return res.status(400).json({ error: "Invalid id" });
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
    const id = req.params.id;
    const article = await Article.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!article) {
      
    }
    return res.status(200).json(article);
  } catch (err) {
    return res.status(400).json({ error: "Invalid id" });
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
    const id = req.params.id
    const article = await Article.findByIdAndDelete({_id: id})
    if(!article){
      return res.status(404).json({ error: "Article not found" });
    }
    return res.status(204).send()
  } catch (err) {
     return res.status(400).json({ error: "Invalid id" });
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
