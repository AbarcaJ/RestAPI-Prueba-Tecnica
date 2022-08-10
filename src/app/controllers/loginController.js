const jwt = require('jsonwebtoken')
const { JWT_REFRESH_SECRET } = require('../../config/credentials')

/** Funciones utiles del middleware */
const {
  generateAccessToken,
  refreshAccessToken,
  existsRefreshToken,
  deleteRefreshToken
} = require('../middleware/jwtAuth')

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
            const tokenInfo = {
              id: data._id,
              role: data.role,
              inactive: data.inactive
            }

            const token = generateAccessToken(tokenInfo)
            const refreshToken = refreshAccessToken(tokenInfo)
            const response = { user: data, accessToken: token, refreshToken }
            res.json({ status: 'success', message: 'User logged-in success !!', data: response })
          })
        } else {
          res.status(401).json({ status: 'error', message: 'Invalid Email or Password !!' })
        }
      }
    })
  },

  refreshToken: (req, res, next) => {
    const { refreshToken } = req.body
    if (!refreshToken) {
      return res.status(401).json({ status: 'error', message: 'Missing refresh token in our request !!' })
    }

    if (!existsRefreshToken(refreshToken)) {
      return res.status(403).json({ status: 'error', message: 'Invalid refresh token !!' })
    }

    deleteRefreshToken(refreshToken)
    jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, result) => {
      if (err || !result) {
        res.header('Content-Type', 'application/problem+json')
        return res.status(403).json({ status: 'error', message: 'Invalid Email or Password !!' })
      }

      /** Creamos un token con informacion basica del usuario */
      const tokenInfo = {
        id: result.id,
        role: result.role,
        inactive: result.inactive
      }

      const newToken = generateAccessToken(tokenInfo)
      const newRefreshToken = refreshAccessToken(tokenInfo)
      const response = { accessToken: newToken, refreshToken: newRefreshToken }
      res.json({ status: 'success', message: 'User tokens refreshed !!', data: response })
    })
  },

  deleteToken: (req, res, next) => {
    deleteRefreshToken(req.body.refreshToken)
    res.status(204).json({ status: 'success', message: 'User logout successfully!' })
  }

}
