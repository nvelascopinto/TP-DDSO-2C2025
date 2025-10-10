import AppError from "./appError.js"

class YaLeidaError extends AppError {
  constructor(id) {
    super("La notificacion ya fue leida", 409, "YaLeidaError", { id })
  }
}

export default YaLeidaError
