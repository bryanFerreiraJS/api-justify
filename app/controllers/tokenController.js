// la Promise n'est pas forcément résolue au moment où on l'importe, mais c'est pas grave, on en a pas besoin tout de suite
const mongodb = require('../modules/mongodb')

const { ErrorHandler } = require('../middlewares/error')

const jwt = require('jsonwebtoken')

const MONGODB_COLLECTION_NAME = process.env.MONGODB_COLLECTION_NAME

const SECRET_KEY_JWT = process.env.SECRET_KEY_JWT

const tokenController = {

  getUserAndSetToken: async (req, res, next) => {
    try {

      const userEmail = req.body.email

      // Maintenant, on a besoin de la db, c'est le bon moment pour l'attendre si elle n'est pas encore opérationnelle.
      // Après l'avoir attendue, on appelle findOne sur la collection pour récupérer notre user et on attend à nouveau, le document, cette fois-ci

      const user = await (await mongodb)
        .collection(MONGODB_COLLECTION_NAME)
        .findOne({email: userEmail})

      // Si je ne trouve pas de client dans la collection, je renvoie une erreur 404
      if (!user) {
        throw new ErrorHandler(404, 'Response code 404 (User Not Found)')
      } else {
        const payload = {
          email: user.email
        }
        const token = jwt.sign(payload, SECRET_KEY_JWT, {
          expiresIn: '24h'
        })
        res.status(200).json(({
          status: 'Success',
          statusCode: 200,
          message: 'Response code 200 (Token Sended)',
          token,
        }))
      }
    } catch (error) {
      next(error)
    }
  }
}


module.exports = tokenController
