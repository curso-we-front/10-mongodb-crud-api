const mongoose = require("mongoose")

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  published: { type: Boolean, default: false },
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  // TODO
})

module.exports = mongoose.model("Article", articleSchema)
