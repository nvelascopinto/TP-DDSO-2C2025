class AppError extends Error {
  constructor(message, statusCode, name, details) {
    super(message)
    this.statusCode = statusCode
    this.name = name
    this.details = details

    // Para hacer que el stack trace empiece en el lugar donde tiro el error y no en el constructor
    Error.captureStackTrace(this, this.constructor)
  }
}

export default AppError
