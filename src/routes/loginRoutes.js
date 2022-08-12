const router = require('express').Router()
const {
  loginUser,
  refreshUserToken,
  deleteUserToken
} = require('../app/controllers/loginController')

/** Obtener token iniciando sesion */
router.post('/signIn', loginUser)

/** Refrescar token */
router.post('/refreshToken', refreshUserToken)

/** Eliminar token de refrescar */
router.post('/logout', deleteUserToken)

module.exports = {
  uri: '/api/v1/auth',
  router
}
