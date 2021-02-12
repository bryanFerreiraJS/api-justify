
const justifyController = require('../../controllers/justifyController')

module.exports = function(router) {
  router.post('/justify', justifyController.returnJustifiedText)
}
