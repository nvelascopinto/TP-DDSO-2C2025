import AppError from "./appError.js"

class DatosInvalidosError extends AppError {
  constructor(message) {
    super(message, 400, "DatosInvalidos", null)
  }
}

export default DatosInvalidosError
