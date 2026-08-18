const mongoose = require("mongoose")

const DUPLICATE_KEY_ERROR = 11000
function mongooseErrorHandler(err, req, res, next) {
  if (err.name === "ValidationError") {
    const fields = {}
    for (let field in err.errors) {
      fields[field] = err.errors[field].message
    }
    return res.status(422).json({ error: "Error de validación", fields })
  }
  if (err.name === "CastError") {
    return res.status(400).json({ error: "ID inválido" })
  }
  if (err.name === "MongoServerError" && err.code === DUPLICATE_KEY_ERROR) {
    return res.status(409).json({ error: "Ya existe un documento con ese valor" })
  }
  next(err)
  // TODO
}

module.exports = mongooseErrorHandler
