// The Promise isn't necessarily resolved when we import it, but it doesn't matter, we don't need it right away.
const mongodb = require('../modules/mongodb')

const { ErrorHandler } = require('../middlewares/error')

const jwt = require('jsonwebtoken')

const MONGODB_COLLECTION_NAME = process.env.MONGODB_COLLECTION_NAME

const SECRET_KEY_JWT = process.env.SECRET_KEY_JWT

const tokenController = {

  getUserAndSetToken: async (req, res, next) => {
    try {

      const userEmail = req.body.email

      // Now we need the database, it's the right time to wait for it if it's not yet operational.
      // After waiting for it, we call the findOne method on the collection to retrieve the user and we wait again, this time for the document.

      const user = await (await mongodb)
        .collection(MONGODB_COLLECTION_NAME)
        .findOne({email: userEmail})

      if (!user) {
        throw new ErrorHandler(404, "Response code 404 (This Email Isn't Registered In Our Database)")
      } 
      // An administrator has reinitialized the token
      else if (user.timestampOfJWT) {
        throw new ErrorHandler(403, 'Response code 403 (A Token Has Already Been Generated For This User)')
      } else {
        const payload = {
          email: user.email
        }
        const token = jwt.sign(payload, SECRET_KEY_JWT)
        const nowTimestamp = Math.floor(Date.now() / 1000)

        await (await mongodb)
          .collection(MONGODB_COLLECTION_NAME)
          .updateOne({ email: userEmail }, {
            $set: {
              'rateLimitPerDay': 80000,
              'timestampOfLastResetOfRateLimit': nowTimestamp,
              'timestampOfJWT': nowTimestamp
            }
          })
        
        res.status(200).json({
          status: 'Success',
          statusCode: 201,
          message: 'Response code 201 (Token Created)',
          token,
        })
      }
    } catch (error) {
      next(error)
    }
  }
}


module.exports = tokenController
