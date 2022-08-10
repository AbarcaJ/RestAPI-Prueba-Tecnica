const router = require('express').Router()
const controller = require('../app/controllers/userController')
const { isAuthorized, requiresRole } = require('../app/middleware/jwtAuth')

/** SOLO ADMINISTRADOR */
router.get('/adminOnly', [isAuthorized, requiresRole(['ADMIN'])], controller.retrieveAll)

/** SOLO MODERADOR Y ADMIN */
router.get('/modAndAdmin', [isAuthorized, requiresRole(['MOD', 'ADMIN'])], controller.retrieveAll)

/** RUTA SIN LOGIN REQUERIDO */
router.get('/', controller.retrieveAll)

/** CRUD BASICO
 * Aclaro que estas funciones solo son demostrativas por lo cual necesitan validaciones como:
 *  El usuario solo pueda actualizar sus propios datos o si es un administrador permitirlo.
 */
router.post('/', controller.create)
router.get('/:id', controller.retrieve)
router.put('/:id', isAuthorized, controller.update)
router.delete('/:id', isAuthorized, controller.delete)

module.exports = {
  requiresAuth: false,
  uri: '/v1/users',
  router
}
