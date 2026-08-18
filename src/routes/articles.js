const { Router } = require("express")
const {
  getArticles,
  getArticleById,
  createArticle,
  replaceArticle,
  updateArticle,
  deleteArticle,
} = require("../controllers/articles")

const router = Router()

router.get("/", getArticles)
router.get("/:id", getArticleById)
router.post("/", createArticle)
router.put("/:id", replaceArticle)
router.patch("/:id", updateArticle)
router.delete("/:id", deleteArticle)

module.exports = router
