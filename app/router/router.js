const express = require('express')
const router = express.Router()

require('./routes/tokenRoute')(router)
require('../middlewares/checkToken')(router)
require('./routes/justifyRoute')(router)

module.exports = router