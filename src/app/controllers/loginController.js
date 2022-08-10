const jwt = require('jsonwebtoken')
const { generateAccessToken, refreshAccessToken } = require('../app/middleware/jwtAuth')

/** Modelo de datos */
const userModel = require('../models/user')

module.exports = {

  login: (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Email and Password is required!!!' })
    }

    userModel.findOne({ email }, (err, data) => {
      if (err) {
        err.status = 500
        next(err)
      } else {
        if (data) {
          data.validatePassword(password, (err, result) => {
            if (err || !result) {
              res.header('Content-Type', 'application/problem+json')
              return res.status(401).json({ status: 'error', message: 'Invalid Email or Password !!' })
            }

            /** Creamos un token con informacion basica del usuario */
            const token = generateAccessToken({
              id: data._id,
              role: data.role,
              inactive: data.inactive
            }, req.app.get('jwt_secret'))

            const response = { user: data, token }
            res.json({ status: 'success', message: 'User logged-in success !!', data: response })
          })
        } else {
          res.status(401).json({ status: 'error', message: 'Invalid Email or Password !!' })
        }
      }
    })
  },

  refreshToken: (req, res, next) => {

  }

}
