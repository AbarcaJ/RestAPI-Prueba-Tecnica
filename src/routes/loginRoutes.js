const router = require('express').Router()
const { onlyMethods } = require('../app/middleware/validateMethods')
const {
  loginUser,
  refreshUserToken,
  logoutUser
} = require('../app/controllers/loginController')

/** METODOS PERMITIDOS */
router.all('/', onlyMethods(['HEAD', 'POST']))

/** Obtener token iniciando sesion */
router.post('/signIn', loginUser)

/** Refrescar token */
router.post('/refreshToken', refreshUserToken)

/** Eliminar token de refrescar */
router.post('/logout', logoutUser)

module.exports = {
  uri: '/api/v1/auth',
  router
}
