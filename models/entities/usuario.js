import { tipoUsuario } from "./tipoUsuario.js"
import DatosInvalidosError from "../../errors/datosInvalidosError.js"
import UsuarioSinPermisoError from "../../errors/usuarioSinPermisoError.js"

export class Usuario {
  constructor(nombre, email, telefono, tipoUsuario) {
    this.id = null
    this.nombre = nombre
    this.email = email
    this.telefono = telefono
    this.tipoUsuario = tipoUsuario
    this.fechaAlta = new Date() // ver si debe ir con el tmespam true en la base

    this.validarTipoUsuario()
  }

  agregarNotificacion(notificacion) {
    this.notificaciones.push(notificacion)
  }

  validarTipoUsuario() {
    if (!Object.values(tipoUsuario).includes(this.tipoUsuario)) {
      throw new DatosInvalidosError("El tipo de usuario no es válido")
    }
  }

  validarRol(roles) {
    if (!roles.includes(this.tipoUsuario)) {
      throw new UsuarioSinPermisoError(this.id)
    }
    return true
  }
}
