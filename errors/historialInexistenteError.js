import AppError from "./appError.js"

class HistorialInexistenteError extends AppError {
  constructor(IDUsuario) {
    super("No existe un historial de pedidos para ese usuario", 404, "HistorialInexistente", {
      IDUsuario
    })
  }
}

export default HistorialInexistenteError
