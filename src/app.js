/**
 * Definicion de modulos y constantes.
 */
const { NODE_ENV } = require('./config/config')
const compression = require('compression')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const logger = require('morgan')
const fs = require('fs')

/** Definicion de constantes Middleware */
const dbMiddleware = require('./app/middleware/dbConnection')
const credentialsMiddleware = require('./app/middleware/credentials')

/** Definicion de ExpresssJS */
const app = express()
app.disable('x-powered-by') /* Eliminamos la Marca de Agua de ExpressJS | Powered-by Brand. */

/* Usamos Morgan como Logger de Peticiones para Express. */
app.use(logger(NODE_ENV === 'development'
  ? 'dev'
  : 'tiny')
)

/**
 * Definicion de Reglas Globales para las peticiones a Express.
 */
app.use(compression()) /** Esto podria ayudar comprimiendo los cuerpos de respuesta */

/**
 * Hacemos un handling de credenciales antes del CORS.
 * Luego buscamos la cookies de los credenciales requeridos.
 */
app.use(credentialsMiddleware)

/* Aplicamos la CORS Policy. */
app.use(cors(corsOptions))

/* Usamos body-parser para obtener los datos de peticiones JSON o URLENCODED. */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser()) /* Usamos cookie-parser para manejo de Cookies */

/** Definimos un Middleware que bloquea las peticiones al estar desconectada la base de datos. */
app.use(dbMiddleware)

/** Definimos la ruta del Favicon */
app.get('/favicon.ico', (req, res) => res.sendStatus(204))

/** Automatizamos el Registro de rutas. */
fs.readdirSync('./src/routes')
  .filter(file => (file.indexOf('.') !== 0) && (file.slice(-3) === '.js'))
  .forEach(file => {
    const route = require(`./routes/${file}`)
    app.use(route.uri, route.router)
  })

/**
 * Debido a que Express no hace un manejo de errores, tenemos que considerar hacerlo manualmente
 * cuando no exista una ruta. Es decir hacer un 404.
 */
app.use((req, res, next) => {
  const err = new Error('Route not found')
  err.status = 404
  next(err)
})

/**
 * Manejo de errores finales de peticion.
 */
app.use((err, req, res, next) => {
  let status = err.status
  res.header('Content-Type', 'application/problem+json')
  if (status === 404) {
    res.status(404).json({ status: 'error', message: 'The requested resource could not be found!' })
  } else if (status === 500) {
    console.error(err)
    res.status(status).json({ status: 'error', message: '[!] Internal server error [!]' })
  } else {
    if (!status) {
      status = 500
    }
    if (NODE_ENV === 'development') {
      res.status(status).json({ status: 'error', message: 'Something looks wrong :( !!!', err: err.message })
    } else {
      console.error(err)
      res.status(status).json({ status: 'error', message: 'Something looks wrong :( !!!' })
    }
  }
})

module.exports = app
