const mongoose = require('mongoose');

/**
 * Tarea 2: Definir el schema de Article.
 */
const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    published: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Article', articleSchema);