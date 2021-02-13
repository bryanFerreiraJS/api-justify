const tokenController = require('../../controllers/tokenController')

module.exports = function(router) {
  router.post('/token', tokenController.getUserAndSetToken)
}
