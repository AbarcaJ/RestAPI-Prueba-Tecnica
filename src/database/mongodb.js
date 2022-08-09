/**
 * MongoDB Database Connection
 */
const mongoose = require('mongoose')
const { MONGO_URI, MONGO_OPTIONS } = require('../config/db')

/** Iniciamos la conexion con MongoDB */
async function connectDb (exitOnFail = false) {
  console.log('> Trying connection with MongoDB....')
  await mongoose.connect(MONGO_URI, MONGO_OPTIONS).then(() => {
    console.log('> MongoDB was connected sucessfully!')
  }).catch((err) => {
    console.error('> Error while connecting to MongoDB database. Check our Database Server or Connection URI.')
    console.error(err)
    if (exitOnFail) process.exit(0)
  })
}

mongoose.Promise = global.Promise

/** Nos Reconectaremos a MongoDB con un Delay
 * Si llegase a fallar la conexion con Mongo en algun momento.
 */
mongoose.connection.on('disconnected', () => setTimeout(connectDb, 10240))
mongoose.connection.on('error', () => {
  console.error.bind(console, '> MongoDB connection error:')
  try {
    mongoose.disconnect()
  } catch (error) {
    console.error(error)
  }
})

/** Esto ayudara a que la aplicacion no quede Activa por la conexion de MongoDB */
process.on('SIGINT', () => {
  try {
    mongoose.connection.close(() => {
      console.log('> Mongoose connection is disconnected due to app termination...')
      process.exit(0)
    })
  } catch (error) {
    console.err(error)
    process.exit(0)
  }
})

module.exports = { mongoose, connectDb }
