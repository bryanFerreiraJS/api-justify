const justifyController = require('../../controllers/justifyController')

module.exports = (router) => {
  router.post('/justify', justifyController.returnJustifiedText)
}
