const router = require('express').Router()

const { isAuthorized, requiresRole } = require('../app/middleware/jwtAuth')
const { onlyMethods } = require('../app/middleware/validateMethods')
const {
  retrieveAllAirplanes,
  createAirplane,
  retrieveAirplane
} = require('../app/controllers/airplaneController')

router.all('/', onlyMethods(['GET', 'HEAD', 'POST']))

/** Listado de aviones publico */
router.get('/', retrieveAllAirplanes)
router.get('/:id', retrieveAirplane)

/** Estas funciones solo son demostrativas.
 * Aqui solo puede registrar aviones el usuario con rol ADMIN
*/
router.post('/', [isAuthorized, requiresRole(['ADMIN'])], createAirplane)

module.exports = {
  uri: '/api/v1/airplanes',
  router
}
