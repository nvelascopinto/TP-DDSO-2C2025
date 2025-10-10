import AppError from "./appError.js"

class EstadoInvalidoError extends AppError {
  constructor(estado) {
    super("El estado no es valido", 400, "EstadoInvalidoError", {
      estado
    })
  }
}

export default EstadoInvalidoError
