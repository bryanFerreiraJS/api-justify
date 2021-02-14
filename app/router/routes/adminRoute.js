const adminController = require('../../controllers/adminController')

module.exports = (router) => {
  router.get('/admin/user', adminController.getUser)
  router.post('/admin/user', adminController.createUser)
  router.patch('/admin/user/token', adminController.resetTokenOfUser)
  router.delete('/admin/user', adminController.deleteUser)
}