const bcrypt = require('bcryptjs') /** Utilizamos bcryptjs para Encriptacion de contrasenas */
const mongoose = require('mongoose')

// const { appCfg } = require('/src/config')

const { isEmail } = require('validator') /** Utilizamos validator, para Validaciones. */
const SALT_WORK_FACTOR = 10

const Schema = mongoose.Schema /** Definimos la const de Schame */
const ObjectId = Schema.ObjectId /** Definimos la const del tipo de Dato ObjectID */

const UserSchema = Schema({
  username: {
    type: String,
    trim: true,
    required: true,
    createIndexes: { unique: true }
  },
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
    validate: [isEmail, 'invalid email']
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: Number,
    // type: ObjectId,
    // ref: 'Role',
    required: false
  },
  user_photo: {
    type: String,
    required: false
  },
  active: {
    type: Boolean,
    default: false
  },
  updated_by: {
    type: ObjectId,
    ref: 'users',
    required: false
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

UserSchema.methods.validatePassword = async (data) => {
  return bcrypt.compare(data, this.password)
}

/** Me parece mejor practica nombrar las colecciones en lowerCase */
module.exports = mongoose.model('users', UserSchema)
