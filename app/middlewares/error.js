class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super()
    this.statusCode = statusCode
    this.message = message
  }
}

const handleError = (error, res) => {
  const { statusCode, message } = error

  res.status(statusCode || 422).json({
    status: 'Error',
    statusCode: statusCode || 422,
    message
  })
  
}

module.exports = {
  ErrorHandler,
  handleError
}