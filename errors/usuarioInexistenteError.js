import AppError from "./appError.js"

class UsuarioInexistenteError extends AppError {
  constructor(usuarioID) {
    super(`No existe un usuario con el ID enviado`, 401, "UsuarioInexistenteError", {
      usuarioID,
    })
  }
}

export default UsuarioInexistenteError
