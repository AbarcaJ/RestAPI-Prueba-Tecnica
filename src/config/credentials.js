require('dotenv').config()

const config = {

  /** TOKEN SECRETO PARA LAS FIRMAS CON JWT */
  JWT_SECRET: process.env.JWT_SECRET || 'clave-secreta',

  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'clave-secreta-de-refrescar'

}

module.exports = config
