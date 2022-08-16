const mongoose = require('mongoose')

/** Utilizamos `bcryptjs` para Encriptacion de contrasenas */
const bcrypt = require('bcryptjs')
const SALT_WORK_FACTOR = 10

/** Utilizamos validator, para Validaciones. */
const { isEmail } = require('validator')

/** Definimos la const de Schema */
const Schema = mongoose.Schema
// const ObjectId = Schema.ObjectId /** Definimos la const del tipo de Dato ObjectID */

const UserSchema = Schema({
  name: {
    type: String,
    required: [true, 'An name is required!']
  },
  lastname: {
    type: String,
    required: [true, 'An lastname is required!']
  },
  email: {
    type: String,
    required: true,
    validate: [isEmail, 'Invalid was specified email!'],
    createIndexes: { unique: true }
  },
  password: {
    type: String,
    required: [true, 'An password is required!']
  },
  /* De forma demostrativa no pondre roles por relacion con otra coleccion
  * Simplemente pondre un solo campo para el rol, que demostrativo y segun el caso
  * a veces suele ser suficiente dependiendo el sistema que se desea desarrollar.
  */
  role: {
    type: String,
    default: 'USER'
  },
  refresh_token: {
    type: String
  },
  inactive: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
    this.password = bcrypt.hashSync(this.password, salt)
    return next()
  } catch (err) {
    return next(err)
  }
})

UserSchema.methods.validatePassword = async function (password, cb) {
  return bcrypt.compare(password, this.password, cb)
}

/** Es mejor practica nombrar las colecciones en lowerCase */
module.exports = mongoose.model('users', UserSchema)
