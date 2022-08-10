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
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    validate: [isEmail, 'Invalid email!'],
    createIndexes: { unique: true }
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'USER'
  },
  inactive: {
    type: String,
    default: false
  }
}, {
  timestamps: true
})

UserSchema.pre('save', async (next) => {
  if (!this.isModified('password')) return next()
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
    this.password = bcrypt.hash(this.password, salt)
    return next()
  } catch (err) {
    return next(err)
  }
})

UserSchema.methods.validatePassword = async (password, cb) => {
  return bcrypt.compare(password, this.password, cb)
}

/** Me parece mejor practica nombrar las colecciones en lowerCase */
module.exports = mongoose.model('users', UserSchema)
