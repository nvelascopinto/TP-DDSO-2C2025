import { UsuarioSinPermisoError } from "../../errors/authorizationError.js"
import { YaLeidaError } from "../../errors/conflicError.js"
export class Notificacion {
  constructor(usuarioDestino, mensaje, numeroPedido) {
    this._id = null
    this.usuarioDestino = usuarioDestino
    this.mensaje = mensaje
    this.fechaAlta = new Date()
    this.leida = false
    this.fechaLeida = null
    this.pedido = numeroPedido
  } 

  marcarComoleida(usuarioId) {
    if (usuarioId != this.usuarioDestino) {
      throw new UsuarioSinPermisoError(usuarioId)
    }
    if (this.leida) {
      throw new YaLeidaError(this._id, usuarioId)
    }
    this.leida = true
    this.fechaLeida = new Date()
  }
}
