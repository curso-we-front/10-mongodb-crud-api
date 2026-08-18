const express = require("express")
const app = express()

app.use(express.json())

const articlesRouter = require("./routes/articles")
app.use("/articles", articlesRouter)
const mongooseErrorHandler = require("./middlewares/mongooseErrorHandler")
const errorHandler = require("./middlewares/errorHandler")

app.use(mongooseErrorHandler)
app.use(errorHandler)

module.exports = app
