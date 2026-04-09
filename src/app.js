const express = require("express");
const app = express();
const articlesRouter = require("./routes/articles");
const mongooseErrorHandler = require("./middlewares/mongooseErrorHandler");
const errorHandler = require("./middlewares/errorHandler");

app.use(express.json());

app.use("/articles", articlesRouter);

app.use(mongooseErrorHandler);
app.use(errorHandler);

module.exports = app;
