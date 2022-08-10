const router = require('express').Router()
const controller = require('../app/controllers/userController')
const { isAuthorized, requiresRole } = require('../app/middleware/jwtAuth')
const { onlyMethods } = require('../app/middleware/validateMethods')

router.all('/', onlyMethods(['HEAD', 'GET', 'POST', 'PUT', 'DELETE']))

/** Listado de usuarios que solo puede ver el empleado o superior. */
router.get('/', [isAuthorized, requiresRole(['EMPLOYEE', 'MOD', 'ADMIN'])], controller.retrieveAll)

/** CRUD
 * Estas funciones solo son demostrativas por lo cual podrian incluirse
 *  Mas validaciones a la hora de intentar modificar un registro.
 *  Dependiendo si las peticiones se ejecutan de lado de servidor o cliente.
 */
router.post('/', controller.create)
router.get('/:id', isAuthorized, controller.retrieve)
router.put('/:id', isAuthorized, controller.update)
router.delete('/:id', [isAuthorized, requiresRole(['MOD', 'ADMIN'])], controller.delete)

module.exports = {
  uri: '/api/v1/users',
  router
}
