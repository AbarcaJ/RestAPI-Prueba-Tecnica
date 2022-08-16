const router = require('express').Router()
const { onlyMethods } = require('../app/middleware/validateMethods')

const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('../swagger.json')

router.all('/', onlyMethods(['HEAD', 'GET']))
router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

module.exports = {
  uri: '/api-docs',
  router
}
