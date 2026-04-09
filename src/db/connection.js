const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/blog";

/**
 * Tarea 1: Conectar la app a MongoDB con Mongoose.
 * Esta función debe retornar la promesa de mongoose.connect().
 */
async function connect() {
  try {
    return await mongoose.connect(MONGODB_URI);
  } catch (error) {
    console.error(error);
    throw error; 
  }
}

module.exports = connect;
