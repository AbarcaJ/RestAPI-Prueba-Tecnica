require('dotenv').config()

const config = {

  /** CADENA DE CONEXION A MONGO */
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/admin',

  /** OPCIONES DE CONEXION A MONGO (MONGOOSE) */
  MONGO_OPTIONS: {
    autoIndex: false, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 8000,
    socketTimeoutMS: 45000 // Close sockets after 45 seconds of inactivity
  }
}

module.exports = config
