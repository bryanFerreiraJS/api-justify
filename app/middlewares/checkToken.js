const mongodb = require('../modules/mongodb')

const jwt = require('jsonwebtoken')

const { ErrorHandler } = require('../middlewares/error')

const MONGODB_COLLECTION_NAME = process.env.MONGODB_COLLECTION_NAME

const SECRET_KEY_JWT = process.env.SECRET_KEY_JWT

const checkToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    const getUserByEmail = async (email) => {
      return await(await mongodb)
        .collection(MONGODB_COLLECTION_NAME)
        .findOne({ email })
    }

    if (!token) {
      throw new ErrorHandler(401, 'Response code 401 (Auth Token Is Not Supplied)')
    } else {
      jwt.verify(token, SECRET_KEY_JWT, async (error, decoded) => {
        try {
          if (error) {
            throw new ErrorHandler(403, 'Response code 403 (Invalid token)')
          }
          
          else {
            const user = await getUserByEmail(decoded.email)

            if (!user) {
              throw new ErrorHandler(403, 'Response code 403 (The Account Associated With This Token Has Been Deleted)')
            } 

            if (decoded.iat < user.timestampOfJWT) {
              throw new ErrorHandler(403, 'Response code 403 (This Token Is Outdated. Please Send The Last Generated Token)')
            } else if (!user.timestampOfJWT) {
              throw new ErrorHandler(403, 'Response code 403 (An Administrator Has Reset Your Account. Please Request A New Token)')
            }
            
            else {
              req.user = user
              next()
            }
          }
        } catch (error) {
          next(error)
        }
      })
    }
  } catch (error) {
    next(error)
  }
}

module.exports = (router) => {
  router.use(checkToken)
}
