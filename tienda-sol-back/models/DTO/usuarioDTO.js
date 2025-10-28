export class UsuarioDTO {
  constructor(username, password, nombre, email, telefono, tipoUsuario, tienda) {
    this.username = username
    this.password = password
    this.nombre = nombre
    this.email = email
    this.telefono = telefono
    this.tipoUsuario = tipoUsuario
    this.tienda = tienda
  }
}
