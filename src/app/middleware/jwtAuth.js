const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../../config/credentials')

/** Middleware que verifica y permite la peticion si tiene una autorizacion valida.
 * De lo contrario devolvera (token faltante o expirado) => `status` error y `http_code` 401
 */
const isAuthorized = (req, res, next) => {
  let token = req.headers.authorization
  if (token) {
    if (token.startsWith('Bearer')) {
      token = token.split(' ')[1]
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err || !decoded) {
        res.header('Content-Type', 'application/problem+json')
        res.header('WWW-Authenticate', 'Bearer')
        res.status(401).json({
          status: 'error',
          message: '[!] Invalid Token in our request, has expired or is not valid. [!]'
        })
        console.log(`> Authorization failed with Token: ${token} From: ${req.ip} Uri: /${req.path}`)
      } else {
        /** Guardamos la informacion de usuario en la Peticion de Express para usarla luego */
        req.tokenData = decoded
        return next()
      }
    })
  } else {
    res.header('Content-Type', 'application/problem+json')
    res.header('WWW-Authenticate', 'Bearer')
    res.status(401).json({
      status: 'error',
      message: '[!] The request does not contain an authorization header with a valid token. [!]'
    })
    console.log(`> Nothing Authorization header has been sent from: ${req.ip} to uri: /${req.path}`)
  }
}

const requiresRole = (validRoles = []) => (req, res, next) => {
  if (req.tokenData && req.tokenData.role) {
    if (validRoles.includes(req.tokenData.role)) {
      return next()
    }
  }
  res.header('Content-Type', 'application/problem+json')
  res.status(403).json({
    status: 'error',
    message: 'Insufficient role to access to this resource.'
  })
}

/** Generate new Access Token */
const generateAccessToken = (jwtSecret, userData) => {
  return jwt.sign(userData, jwtSecret, { expiresIn: '15m' })
}

/** Refresh Access Token */
const refreshTokens = []
const refreshAccessToken = (jwtSecret, userData) => {
  const refreshToken = jwt.sign(userData, jwtSecret, { expiresIn: '20m' })
  refreshTokens.push(refreshToken)
  return refreshToken
}

module.exports = { isAuthorized, requiresRole, generateAccessToken, refreshAccessToken }
