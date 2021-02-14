const EmailValidator = require('email-validator')

const { ErrorHandler } = require('../middlewares/error')

const checkEmail = async (req, res, next) => {
  try {

    // Check if the string entered is indeed an email, except for the justify route

    if (!(EmailValidator.validate(req.body.email) || req.originalUrl === '/justify')) {
      throw new ErrorHandler(400, 'Response code 400 (You Need To Enter An Email Address)')
    }

    next()

  } catch (error) {
    next(error)
  }
}

module.exports = (router) => {
  router.use(checkEmail)
}