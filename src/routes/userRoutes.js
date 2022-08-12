const router = require('express').Router()
const { isAuthorized, requiresRole } = require('../app/middleware/jwtAuth')
const { onlyMethods } = require('../app/middleware/validateMethods')
const {
  retrieveAllUsers,
  createUser,
  retrieveUser,
  updateUser,
  deleteUser
} = require('../app/controllers/userController')

router.all('/', onlyMethods(['HEAD', 'GET', 'POST', 'PUT', 'DELETE']))

/** Listado de usuarios que solo puede ver el empleado o superior. */
router.get('/', [isAuthorized, requiresRole(['EMPLOYEE', 'MOD', 'ADMIN'])], retrieveAllUsers)

/** CRUD
 * Estas funciones solo son demostrativas por lo cual podrian incluirse
 *  Mas validaciones a la hora de intentar modificar un registro.
 *  Dependiendo si las peticiones se ejecutan de lado de servidor o cliente.
 */
router.post('/', createUser)
router.get('/:id', isAuthorized, retrieveUser)
router.put('/:id', isAuthorized, updateUser)
router.delete('/:id', [isAuthorized, requiresRole(['MOD', 'ADMIN'])], deleteUser)

module.exports = {
  uri: '/api/v1/users',
  router
}
