import { UsuarioSinPermisoError } from "../../errors/authorizationError.js"
import { UsuarioInvalidoError } from "../../errors/domainValidationError.js"
import { tipoUsuario } from "./tipoUsuario.js"

export class Usuario {
  constructor(username, password, nombre, email, telefono, tipoUsuario) {
    this.username = username
    this.nombre = nombre
    this.password = password
    this.email = email
    this.telefono = telefono
    this.tipoUsuario = tipoUsuario
    this.fechaAlta = new Date() // ver si debe ir con el tmespam true en la base
  }

  agregarNotificacion(notificacion) {
    this.notificaciones.push(notificacion)
  }

  validarRol(roles) {
    if (!roles.includes(this.tipoUsuario)) {
      throw new UsuarioSinPermisoError(this.username)
    }
    return true
  }

  
}
