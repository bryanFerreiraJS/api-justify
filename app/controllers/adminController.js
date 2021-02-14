const mongodb = require('../modules/mongodb')

const { ErrorHandler } = require('../middlewares/error')

const MONGODB_COLLECTION_NAME = process.env.MONGODB_COLLECTION_NAME

const adminController = {

  getUser: async (req, res, next) => {
    try {

      const userEmail = req.body.email

      const user = await (await mongodb)
        .collection(MONGODB_COLLECTION_NAME)
        .findOne({ email: userEmail })

      if (!user) {
        throw new ErrorHandler(404, 'Response code 404 (User Not Found)')
      }

      res.status(200).json({
        status: 'Success',
        statusCode: 200,
        message: 'Response code 200 (User Found)',
        user
      })

    } catch (error) {
      next(error)
    }
  },

  createUser: async (req, res, next) => {
    try {

      const userEmail = req.body.email

      const userAlreadyExists = await (await mongodb)
        .collection(MONGODB_COLLECTION_NAME)
        .findOne({ email: userEmail })

      if (userAlreadyExists) {
        throw new ErrorHandler(403, 'Response code 403 (User Already Exist)')
      }

      await (await mongodb)
        .collection(MONGODB_COLLECTION_NAME)
        .insertOne({email: userEmail})

      res.status(200).json({
        status: 'Success',
        statusCode: 201,
        message: 'Response code 201 (User Created. He Needs His Token Before Use The Justify Route)'
      })

    } catch (error) {
      next(error)
    }
  },

  resetTokenOfUser: async (req, res, next) => {
    try {

      const userEmail = req.body.email

      const user = await (await mongodb)
        .collection(MONGODB_COLLECTION_NAME)
        .findOne({ email: userEmail })

      if (!user) {
        throw new ErrorHandler(404, 'Response code 404 (User Not Found)')
      } else if (!user.timestampOfJWT) {
        throw new ErrorHandler(403, 'Response code 403 (User Can Already Request Another Token)')
      }

      await (await mongodb)
        .collection(MONGODB_COLLECTION_NAME)
        .updateOne({ email: userEmail }, {
          $unset: {
            timestampOfJWT: '',
          }
        })

      res.status(200).json({
        status: 'Success',
        statusCode: 200,
        message: 'Response code 200 (User Can Request Another Token)'
      })

    } catch (error) {
      next(error)
    }
  },

  deleteUser: async (req, res, next) => {
    try {

      const userEmail = req.body.email

      const user = await (await mongodb)
        .collection(MONGODB_COLLECTION_NAME)
        .findOne({ email: userEmail })

      if (!user) {
        throw new ErrorHandler(404, 'Response code 404 (User Not Found)')
      }

      await (await mongodb)
        .collection(MONGODB_COLLECTION_NAME)
        .deleteOne({ email: userEmail })

      res.status(200).json({
        status: 'Success',
        statusCode: 200,
        message: 'Response code 200 (User Deleted)'
      })

    } catch (error) {
      next(error)
    }
  },
}


module.exports = adminController