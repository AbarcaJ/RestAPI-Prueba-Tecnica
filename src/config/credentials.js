require('dotenv').config()

const config = {

  /** TOKEN SECRETO PARA LAS FIRMAS CON JWT */
  JWT_SECRET: process.env.JWT_SECRET || 'clave-secreta'

}

module.exports = config
