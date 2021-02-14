// The Promise isn't necessarily resolved when we import it, but it doesn't matter, we don't need it right away.
const mongodb = require('../modules/mongodb')

const { ErrorHandler } = require('../middlewares/error')

const MONGODB_COLLECTION_NAME = process.env.MONGODB_COLLECTION_NAME

const checkRateLimit = async (req, res, next) => {
  try {

    const countWords = (string) => {
      // Exclude the start and end spaces of a string. The following line of regex expression will remove the start and end spaces of the given string.
      string = string.replace(/(^\s*)|(\s*$)/gi, '')
      // Reduce multiple spaces to a single space.
      string = string.replace(/[ ]{2,}/gi, ' ')
      // Exclude a new line with a start spacing.
      string = string.replace(/\n /, '\n')
      return string.split(' ').length
    }

    const nowTimestamp = Math.floor(Date.now() / 1000)
    const oneUnitOfDayTimestamp = 24 * 60 * 60
    const numberOfWordsInText = countWords(req.body)

    const user = req.user
    
    // If 24 hours or more have elapsed since the last reset, 'rateLimitPerDay' is reset and 'timestamp' is updated.
    if (nowTimestamp - user.timestampOfLastReset >= oneUnitOfDayTimestamp) {
      await (await mongodb)
        .collection(MONGODB_COLLECTION_NAME)
        .updateOne({ email: user.email }, {
          $set: {
            'rateLimitPerDay': 80000,
            'timestampOfLastResetOfRateLimit': nowTimestamp
          }
        })
      user.rateLimitPerDay = 80000
    }

    // Rate Limit Checker
    if (user.rateLimitPerDay - numberOfWordsInText < 0) {
      throw new ErrorHandler(402, 'Response code 402 (Payment Required)')
    } else {
      await (await mongodb)
        .collection(MONGODB_COLLECTION_NAME)
        .updateOne({ email: user.email }, {
          $inc: {
            'rateLimitPerDay': -numberOfWordsInText,
          }
        })
    }

    next()
    
  } catch (error) {
    next(error)
  }
}

module.exports = (router) => {
  router.use(checkRateLimit)
}
