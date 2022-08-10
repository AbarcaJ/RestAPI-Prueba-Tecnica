const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_REFRESH_SECRET } = require('../../config/credentials')

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
        console.log(`> Authorization failed with Token: ${token} From: ${req.ip} Uri: ${req.path}`)
      } else {
        /** Guardamos la informacion de usuario en la Peticion de Express para usarla luego */
        req.tokenData = decoded

        /** Restrigir el usuario si fuera necesario bloquear su acceso de forma inmediata. */
        if (decoded.inactive) {
          res.status(403).json({
            status: 'error',
            message: '[!] This user is currently inactive/banned. [!]'
          })
          console.log(`> Received request from inactive/banned user from: ${req.ip} to uri: ${req.path}`)
          return
        }
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
    console.log(`> Nothing Authorization header has been sent from: ${req.ip} to uri: ${req.path}`)
  }
}

/** Sirve para verificar si el usuario posee unos de los roles
 * pasado en el parametro.
 */
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

/** generar un nuevo Access Token */
const generateAccessToken = (userData) => {
  return jwt.sign(userData, JWT_SECRET, { expiresIn: '15m' })
}

/** Generar un nuevo Access Token para Refrescar */
const refreshTokens = []
const refreshAccessToken = (userData) => {
  const refreshToken = jwt.sign(userData, JWT_REFRESH_SECRET, { expiresIn: '20m' })
  refreshTokens.push(refreshToken)
  return refreshToken
}

/** Verificar si existe el Token de Refrescar */
const existsRefreshToken = (refreshToken) => {
  return refreshTokens.includes(refreshToken)
}

/** Eliminar un Refresh Token */
const deleteRefreshToken = (refreshToken) => {
  refreshTokens.filter((t) => t !== refreshToken)
}

module.exports = {
  isAuthorized,
  requiresRole,
  generateAccessToken,
  refreshAccessToken,
  existsRefreshToken,
  deleteRefreshToken
}
