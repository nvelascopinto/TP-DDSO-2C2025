import AppError from "./appError.js"

class NotificacionInexistenteError extends AppError {
  constructor(id) {
    super("No existe una notificacion con ese ID", 404, "ProductoInexistente", {
      id
    })
  }
}

export default NotificacionInexistenteError
