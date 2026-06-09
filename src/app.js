const express = require('express');
const app = express();

app.use(express.json());

// TODO: importar el router de artículos
const articlesRouter = require('./routes/articles');

// TODO: montar el router en /articles
app.use('/articles', articlesRouter);

// TODO: importar y usar mongooseErrorHandler antes de errorHandler
// const mongooseErrorHandler = require('./middlewares/mongooseErrorHandler');

// TODO: importar y usar errorHandler
// const errorHandler = require('./middlewares/errorHandler');

// app.use(mongooseErrorHandler);
// app.use(errorHandler);

module.exports = app;
