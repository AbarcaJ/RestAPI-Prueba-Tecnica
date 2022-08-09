/**
 * Definicion de constantes de libreries
 */
const { NODE_ENV } = require('./config/config')
const compression = require('compression')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const logger = require('morgan')
const fs = require('fs')
const path = require('path')

/** Definicion de constantes Middleware */
const dbMiddleware = require('./app/middleware/dbConnection')
const jwtAuthMiddleware = require('./app/middleware/jwtAuthCheck')

/** Definicion de ExpresssJS */
const app = express()

/**
 * Definicion de Reglas Globales para las peticiones a Express.
 */
app.use(compression()) /** Esto podria ayudar comprimiendo los cuerpos de respuesta */
app.disable('x-powered-by') /* Eliminamos la Marca de Agua de ExpressJS | Powered-by Brand. */

/* Aplicamos la CORS Policy. */
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

/* Usamos Morgan como Logger de Peticiones para Express. */
app.use(logger(NODE_ENV === 'development'
  ? 'dev'
  : 'tiny')
)

/* Usamos body-parser para obtener los datos de peticiones JSON o URLENCODED. */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

/** Definimos un Middleware que bloquea las peticiones al estar desconectada la base de datos. */
app.use(dbMiddleware)

/** Definition of file serving route. */
app.get('/public/:path', (req, res) => {
  res.sendFile(express.static(path.resolve(`storage/imgs/${req.params.path}`))) // Guardado para despues..
})

/** Definimos la ruta del Favicon */
app.get('/favicon.ico', (req, res) => res.sendStatus(204))

/** Automatizamos el Registro de rutas. */
fs.readdirSync('./src/routes')
  .filter(file => (file.indexOf('.') !== 0) && (file.slice(-3) === '.js'))
  .forEach(file => {
    const route = require(`./routes/${file}`)
    if (route.requiresAuth) {
      /* Podemos indicar que necesita autenticacion todas las rutas definidas en el archivo .js */
      app.use(route.uri, jwtAuthMiddleware, route.router)
    } else {
      /* Tambien podemos, registrar las rutas y solo indicar autenticacion a rutas en especifico
       * Desde el archivo .js
      */
      app.use(route.uri, route.router)
    }
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
 * Manejo de errores finales.
 */
app.use((err, req, res, next) => {
  const status = err.status
  res.header('Content-Type', 'application/problem+json')
  if (status === 404) {
    res.status(404).json({ status: 'error', message: 'The requested resource could not be found!' })
  } else if (status === 500) {
    console.error(err)
    res.status(status).json({ status: 'error', message: '[!] Internal server error [!]' })
  } else {
    if (NODE_ENV === 'development') {
      res.status(status).json({ status: 'error', message: 'Something looks wrong :( !!!', err: err.message })
    } else {
      console.error(err)
      res.status(status).json({ status: 'error', message: 'Something looks wrong :( !!!' })
    }
  }
})

module.exports = app
