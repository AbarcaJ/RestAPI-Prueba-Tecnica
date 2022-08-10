const router = require('express').Router()
const controller = require('../app/controllers/loginController')

router.post('/signIn', controller.login)

router.post('/refreshToken', controller.refreshToken)

module.exports = {
  requiresAuth: false,
  uri: '/v1/auth',
  router
}
