const mongoose = require('mongoose');

/**
 * Tarea 4: Middleware que convierte errores de Mongoose a respuestas HTTP.
 *
 * Casos a manejar:
 * - ValidationError     → 422 { error: '...', fields: { campo: mensaje } }
 * - CastError           → 400 { error: 'ID inválido' }
 * - MongoServerError (code 11000) → 409 { error: 'Ya existe un documento con ese valor' }
 * - Otros               → pasa al siguiente errorHandler con next(err)
 */

const MONGO_ERROR_DOCUMENT_EXIST = 11000

function mongooseErrorHandler(err, req, res, next) {
  // TODO
  if (err instanceof mongoose.Error.ValidationError) {
    const fields = {};

    for (const field in err.errors) {
      fields[field] = err.errors[field].message;
    }

    return res.status(422).json({
      error: 'Error de validación',
      fields
    });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      error: 'ID inválido'
    });
  }

  if (err.name === 'MongoServerError' && err.code === MONGO_ERROR_DOCUMENT_EXIST) {
    return res.status(409).json({
      error: 'Ya existe un documento con ese valor'
    });
  }

  next(err);
  
}

module.exports = mongooseErrorHandler;
