/**
 * API Rest Status
 */
const router = require('express').Router()
const { mongoose } = require('../db/mongodb')
const onlyMethods = require("../middleware/validateMethods").onlyMethods;

const serverStatus = async (req, res) => {
  const uptime = process.uptime()
  const date = new Date(uptime * 1000)
  const days = date.getUTCDate() - 1
  const hours = date.getUTCHours()
  const minutes = date.getUTCMinutes()
  const seconds = date.getUTCSeconds()
  res.json({
    name: 'RestAPI-Prueba-Tecnica',
    status: 'running',
    database: {
      engine: 'MongoDB',
      status: mongoose.STATES[mongoose.connection.readyState]
    },
    uptime: `${days} Day(s), ${hours} Hour(s), ${minutes} Minute(s), ${seconds} Second(s)`
  })
}

/** Definimos lo */
router.all('/', onlyMethods(["HEAD","GET"]))

router.get('/', serverStatus)

module.exports = {
  requiresAuth: false,
  /** Cuando se modifique este URI, debe modificarlo tambien en dbConnection.js en la lista de bypass */
  uri: '/status',
  router
}
