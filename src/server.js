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

/** Enviamos un mensaje de error antes que la aplicacion muera.
 * Se puede utilizar para reportar problemas via correo con el modulo 'nodemailer'
 *
 * (Tome estas recomendaciones de strongloop.com, Primera vez que lo hago.
 *  No implementare el envio de correo, porque creo que es suficiente para la Prueba)
 *
 * fuente: https://strongloop.com/strongblog/robust-node-applications-error-handling/
 */
if (NODE_ENV === 'production') {
  process.on('uncaughtException', (er) => {
    console.log('Application was caught an Exception!')
    console.error(er.stack)
    process.exit(1)
    /**
     * Un cierra anormal en teoria causaria un reinicio de la app si esta configurada para eso
     * esto podria prevenir que la aplicacion comience a funcionar con errores tras un fallo
     * pero al mismo tiempo se vera como un cierre y apertura de la app.
    */
  })
}

initApp(EXPRESS_HOST, EXPRESS_PORT, JWT_SECRET)
