const router = require('express').Router()
const controller = require('../app/controllers/userController')

router.get('/', controller.retrieveAll)

// CRUD FUNCTIONS
router.post('/', controller.create)
router.get('/:id', controller.retrieve)
router.put('/:id', controller.update)
router.delete('/:id', controller.delete)

module.exports = {
  requiresAuth: false,
  uri: '/v1/user',
  router
}
