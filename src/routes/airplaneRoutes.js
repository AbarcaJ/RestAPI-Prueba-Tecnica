const router = require('express').Router()
const controller = require('../app/controllers/airplaneController')
const { isAuthorized, requiresRole } = require('../app/middleware/jwtAuth')
const { onlyMethods } = require('../app/middleware/validateMethods')

router.all('/', onlyMethods(['GET', 'HEAD', 'POST']))

/** Listado de aviones publico */
router.get('/', controller.retrieveAll)
router.get('/:id', controller.retrieve)

/** Estas funciones solo son demostrativas.
 * Aqui solo puede registrar aviones el usuario con rol ADMIN
*/
router.post('/', [isAuthorized, requiresRole(['ADMIN'])], controller.create)

module.exports = {
  uri: '/api/v1/airplanes',
  router
}
