/* Obtenemos la Config General. */
const { NODE_ENV, EXPRESS_PORT, EXPRESS_HOST } = require('./config/config')

/* Obtenemos la Config de Credenciales. */
const { JWT_SECRET } = require('./config/credentials')

/* Declaramos la constante para conectar con MongoDB */
const { connectDb } = require('./database/mongodb')

/** Declaramos la aplicacion con Express */
const app = require('./app')

/** FUNCION PRINCIPAL QUE EJECUTA LA APLICACION */
async function initApp (host, port, jwtSecret) {
  try {
    await connectDb(true)
    /**
     * Definimos variables que se puedes obtener en cada peticion de express cuando sea necesario
     * `req.app.get('llave')`, Por ejemplo la clave secreta de JSONWEBTOKEN.
     */
    app.set('port', port)
    app.set('jwt_secret', jwtSecret)
    const server = app.listen(port, host, () => console.log(`> Express listening on: http://${server.address().address}:${port}`))
  } catch (e) {
    console.error(e)
    process.exit(0)
  }
}

initApp(EXPRESS_HOST, EXPRESS_PORT, JWT_SECRET)
