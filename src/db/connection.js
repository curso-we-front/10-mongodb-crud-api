const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/blog";

/**
 * Tarea 1: Conectar la app a MongoDB con Mongoose.
 * Esta función debe retornar la promesa de mongoose.connect().
 */
async function connect() {
  // TODO: conectar a MongoDB usando mongoose.connect()
  // Pista: usa la variable MONGODB_URI definida arriba
  return await mongoose.connect(MONGODB_URI);
}

module.exports = connect;
