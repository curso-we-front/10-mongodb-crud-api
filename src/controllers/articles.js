const Article = require("../models/Article")

const PAGE_DEFAULT = 1
const LIMIT_DEFAULT = 10

async function getArticles(req, res, next) {
  try {
    const { tag, search, page = PAGE_DEFAULT, limit = LIMIT_DEFAULT } = req.query
    const filters = {
      published: true,
    }
    if (tag) {
      filters.tags = tag
    }
    if (search) {
      filters.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          content: {
            $regex: search,
            $options: "i",
          },
        },
      ]
    }
    const pageNumber = Number(page)
    const limitNumber = Number(limit)
    const total = await Article.countDocuments(filters)
    const data = await Article.find(filters)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .sort({ createdAt: -1 })
    const totalPages = Math.ceil(total / limitNumber)
    res.json({ data, total, page: pageNumber, limit: limitNumber, totalPages })
    // TODO
  } catch (err) {
    next(err)
  }
}

async function getArticleById(req, res, next) {
  try {
    const { id } = req.params
    const article = await Article.findById(id)
    if (!article) {
      res.status(404).json({ error: "Artículo inexistente" })
    }
    res.json(article)
    // TODO
  } catch (err) {
    next(err)
  }
}

async function createArticle(req, res, next) {
  try {
    const { title, content, author, published, tags } = req.body
    const articleCreated = await Article.create({ title, content, author, published, tags })
    res.status(201).json(articleCreated)
    // TODO
  } catch (err) {
    next(err)
  }
}

async function replaceArticle(req, res, next) {
  try {
    const { id } = req.params
    const { title, content, author, published, tags } = req.body
    const articleUpdated = await Article.findByIdAndUpdate(
      id,
      {
        title,
        content,
        author,
        published,
        tags,
      },
      {
        new: true,
        overwrite: true,
        runValidators: true,
      },
    )
    if (!articleUpdated) {
      return res.status(404).json({ error: "Artículo inexistente" })
    }
    res.json(articleUpdated)
  } catch (err) {
    next(err)
  }
}

async function updateArticle(req, res, next) {
  try {
    const { id } = req.params
    const articlePatched = await Article.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!articlePatched) {
      return res.status(404).json({ error: "Artículo inexistente" })
    }
    res.json(articlePatched)
  } catch (err) {
    next(err)
  }
}

async function deleteArticle(req, res, next) {
  try {
    const { id } = req.params
    const articleDeleted = await Article.findByIdAndDelete(id)
    if (!articleDeleted) {
      return res.status(404).json({ error: "Artículo inexistente" })
    }
    res.status(204).send()
    // TODO
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getArticles,
  getArticleById,
  createArticle,
  replaceArticle,
  updateArticle,
  deleteArticle,
}
