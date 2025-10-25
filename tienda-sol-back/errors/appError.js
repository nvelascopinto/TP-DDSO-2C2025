export class AppError extends Error {
  constructor(message, statusCode, name, logInfo, details = null) {
    super(message)
    this.statusCode = statusCode
    this.name = name
    this.logInfo = logInfo
    this.details = details
  }
}

export class AppMultipleErrors extends AggregateError {
  constructor(message, statusCode, errors, name) {
    super(errors, message)
    this.statusCode = statusCode
    this.name = name
  }
}
