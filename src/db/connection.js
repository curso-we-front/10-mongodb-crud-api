const mongoose = require("mongoose")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/blog"

async function connect() {
  return await mongoose.connect(MONGODB_URI)
}

module.exports = connect
