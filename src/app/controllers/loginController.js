const userModel = require('../models/user') /** Modelo de datos */
const jwt = require('jsonwebtoken')
const { JWT_REFRESH_SECRET } = require('../../config/credentials')

/** Funciones utiles del middleware */
const {
  generateAccessToken,
  generateRefreshToken
} = require('../middleware/jwtAuth')

const loginUser = async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ status: 'error', message: 'Email and Password is required!!!' })
  }

  try {
    const data = await userModel.findOne({ email })
    if (data) {
      data.validatePassword(password, async (err, result) => {
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

        /* Generamos los tokens de acceso y refresco */
        const token = generateAccessToken(tokenInfo)
        const refreshToken = generateRefreshToken(tokenInfo)

        /* Guardamos el refresh token en base de datos */
        data.refresh_token = refreshToken
        await data.save()

        /** Respuesta de Cookie con el refreshToken
         * Agregar secure: true Si se usa en HTTPS.
         */
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 })

        /** Respuesta final con el Access token */
        const response = { user: data, accessToken: token }
        res.json({ status: 'success', message: 'User logged-in success !!', data: response })
      })
    } else {
      res.status(401).json({ status: 'error', message: 'Invalid Email or Password !!' })
    }
  } catch (err) {
    next(err)
  }
}

const refreshUserToken = async (req, res, next) => {
  const { cookies } = req
  if (!cookies?.jwt) {
    return res.status(401).json({ status: 'error', message: 'Missing refresh token in our request !!' })
  }

  const refreshToken = cookies.jwt
  try {
    const data = await userModel.findOne({ refreshToken })
    if (!data) {
      return res.status(401).json({ status: 'error', message: 'Refresh token not found.' })
    }

    jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, result) => {
      if (err || result.id !== data._id.toString()) {
        res.header('Content-Type', 'application/problem+json')
        return res.status(403).json({ status: 'error', message: 'Invalid Refresh Token !!' })
      }

      /** Creamos un token con informacion basica del usuario desde la info de su RefreshToken */
      const tokenInfo = {
        id: result.id,
        role: result.role,
        inactive: result.inactive
      }
      const newToken = generateAccessToken(tokenInfo)
      const response = { accessToken: newToken }
      res.json({ status: 'success', message: 'Access token refreshed !!', data: response })
    })
  } catch (err) {
    next(err)
  }
}

const logoutUser = async (req, res, next) => {
  const { cookies } = req
  if (!cookies?.jwt) {
    return res.status(204).json({ status: 'error', message: 'No refresh token to revoke !!!' })
  }

  const refreshToken = cookies.jwt
  try {
    const data = await userModel.findOne({ refreshToken })
    if (!data) {
      res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 })
      return res.status(204).json({ status: 'error', message: 'Refresh token not found.' })
    }

    data.refresh_token = ''
    await data.save()

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 })
    res.status(204).json({ status: 'success', message: 'Refresh Token deleted successfully !!' })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  loginUser,
  refreshUserToken,
  logoutUser
}
