const router = require('express').Router()
const controller = require('../app/controllers/loginController')

/** Obtener token iniciando sesion */
router.post('/signIn', controller.login)

/** Refrescar token */
router.post('/refreshToken', controller.refreshToken)

/** Eliminar token de refrescar */
router.post('/logout', controller.deleteToken)

module.exports = {
  uri: '/api/v1/auth',
  router
}
