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
function mongooseErrorHandler(err, req, res, next) {
  // TODO
}

module.exports = mongooseErrorHandler;
