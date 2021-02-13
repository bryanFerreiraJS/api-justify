const dotenv = require('dotenv')
dotenv.config()

const cors = require('cors')
const bodyParser  = require('body-parser')

const express = require('express')
const { handleError } = require('./app/middlewares/error')
const router = require('./app/router/router')

const app = express()

app.use(cors('*'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(bodyParser.text())

app.use(router)

app.use((err, req, res, next) => {
  handleError(err, res)
})

app.listen(process.env.PORT || 3000, () => console.log(`Listening on ${process.env.PORT || 3000}`))