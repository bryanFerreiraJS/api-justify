const jwt = require('jsonwebtoken')

const { ErrorHandler } = require('../middlewares/error')

const SECRET_KEY_JWT = process.env.SECRET_KEY_JWT

const checkToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      throw new ErrorHandler(401, 'Response code 401 (Auth Token Is Not Supplied)')
    } else {
      jwt.verify(token, SECRET_KEY_JWT, (error, decoded) => {
        if (error) {
          throw new ErrorHandler(403, "Response code 403 (You Don't Have The Necessary Authorization)")
        } else {
          next()
        }
      })
    }
  } catch (error) {
    next(error)
  }
}

module.exports = function(router) {
  router.use(checkToken)
}
