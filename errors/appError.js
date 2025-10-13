class AppError extends Error{
  constructor(message, statusCode, name, details = null) {
    super(message)
    this.statusCode = statusCode
    this.name = name
    this.details = details
  }
}

export default AppError
