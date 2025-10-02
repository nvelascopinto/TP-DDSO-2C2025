import AppError from "./appError.js"

class YaEnEstadoError extends AppError {
  constructor(nuevoEstado) {
    super(`El pedido ya está en ese estado`, 409, "YaEnEstadoError", { nuevoEstado })
  }
}

export default YaEnEstadoError
