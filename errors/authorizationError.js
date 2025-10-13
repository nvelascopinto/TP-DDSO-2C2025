import AppError from "./appError.js"

class AuthorizationError extends AppError {
  constructor(message, details) {
    super(message, 403, "AuthorizationError", details)
  }
}

export class UsuarioSinPermisoError extends AuthorizationError {
  constructor(usuarioId) {
    super("El usuario no tiene permiso", { usuarioId })
  }
}
