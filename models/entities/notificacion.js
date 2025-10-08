import UsuarioSinPermisoError from "../../errors/usuarioSinPermisoError.js"
export class Notificacion {
  constructor(usuarioDestino, mensaje) {
    //this.id = null
  
    this.usuarioDestino = usuarioDestino
    this.mensaje = mensaje
    this.fechaAlta = new Date()
    this.leida = false
    this.fechaLeida = null
  }

  marcarComoleida(usuarioId) {
    if(usuarioId != this.usuarioDestino) {
      throw new UsuarioSinPermisoError(usuarioId)
    }
    this.leida = true
    this.fechaLeida = new Date()
  }
}
