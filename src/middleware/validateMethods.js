/** Comprobar si esta usando un metodo HTTP Permitido para la Ruta */
const isValidMethod = (validMethods = ['GET', 'HEAD']) => (req, res, next) => {
  if (validMethods.includes(req.method)) {
    return next()
  }
  res.set('Allow', validMethods.join(', '))
  res.header('Content-Type', 'application/problem+json')
  res.status(405).json({
    status: 'error',
    message: `Method: ${req.method} is not allowed for this route.`,
  })
}

module.exports = { onlyMethods: isValidMethod }
