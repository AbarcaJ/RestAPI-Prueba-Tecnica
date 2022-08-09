const { mongoose } = require('../../database/mongodb')

/** Comprueba el Estado de la conexion con MongoDB
 * Y Permite solo peticiones a /status cuando esta desconectada
 * la base de datos de mongo.
 */
const validateConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    const err = new Error('Database connection is not established')
    err.status = 500
    next(err)
  } else {
    next()
  }
}

module.exports = validateConnection
