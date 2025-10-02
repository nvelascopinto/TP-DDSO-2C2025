import AppError from "./appError.js"

class CambioEstadoInvalidoError extends AppError {
  constructor(estadoActual, nuevoEstado) {
    super("El pedido no puede pasar a ese estado", 409, "CambioEstadoInvalidoError", {
      estadoActual,
      nuevoEstado,
    })
  }
}

export default CambioEstadoInvalidoError
