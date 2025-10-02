export class UsuarioInexistenteError extends Error {
  constructor(usuarioID) {
    super()
    this.name = "UsuarioInexistenteError"
    this.message = "No existe el usuario con el id enviado. ID : " + usuarioID
  }
}
