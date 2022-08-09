require('dotenv').config()

const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',

  /** DATOS PARA EL SERVIDOR DE EXPRESS */
  EXPRESS_HOST: process.env.HOST || '127.0.0.1',
  EXPRESS_PORT: process.env.PORT || 8080

}

module.exports = config
