const mongoose = require('mongoose');

/**
 * Tarea 2: Definir el schema de Article.
 *
 * Campos requeridos:
 * - title:     String, requerido
 * - content:   String, requerido
 * - author:    String, requerido
 * - published: Boolean, default false
 * - tags:      [String]
 * - createdAt: Date, default Date.now
 */
const articleSchema = new mongoose.Schema({
  // TODO
});

module.exports = mongoose.model('Article', articleSchema);
