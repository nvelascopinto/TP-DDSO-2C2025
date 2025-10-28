import { AppError } from "./appError.js"

class AuthorizationError extends AppError {
  constructor(message, logInfo) {
    super(message, 403, "AuthorizationError", logInfo)
  }
}

export class UsuarioSinPermisoError extends AuthorizationError {
  constructor(idUsuario) {
    super(
      "No se tiene permiso para realizar esta acción.", 
      "Intento de acceso del USUARIO " + idUsuario + " sin permiso."
    )
  }
}

export class UsuarioWrongPassword extends AuthorizationError { 
  constructor(idUsuario) {
    super(
      "La contraseña igresada fue inforrecta", 
      "Contraseña incorrecta de USUARIO " + idUsuario + "."
    )
  }
}
