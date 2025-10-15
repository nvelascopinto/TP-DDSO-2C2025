import { de } from "zod/locales"

class AppError extends Error{
  constructor(message, statusCode, name, details = null) {
    super(message)
    this.statusCode = statusCode
    this.name = name
    this.details = details
  }
}

class AppMultipleErrors extends AggregateError{
  constructor(message, statusCode, errors, name) {
    super(errors, message)
    this.statusCode = statusCode
    this.name = name
  }
}

export default AppError
export { AppMultipleErrors }
