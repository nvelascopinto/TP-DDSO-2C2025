import AppError from "./appError.js"

class UsuarioSinPermisoError extends AppError {
  constructor(id) {
    super(`El usuario no tiene permiso`, 403, "UsuarioSinPermiso", { id })
  }
}

export default UsuarioSinPermisoError
