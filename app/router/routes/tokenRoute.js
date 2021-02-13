const tokenController = require('../../controllers/tokenController')

module.exports = (router) => {
  router.post('/token', tokenController.getUserAndSetToken)
}
