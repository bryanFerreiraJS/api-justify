const express = require('express')
const router = express.Router()

require('./routes/justifyRoutes')(router)

module.exports = router