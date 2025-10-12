import EstadoInvalidoError from "../../errors/estadoInvalidoError.js"
import { estado } from "./estadoPedido.js"

export class CambioEstadoPedido {
  constructor(estado, pedido, usuario, motivo) {
    this.fecha = new Date() // suponemos que se crea cuando se hace cambio
    this.estado = estado
    this.pedido = pedido
    this.usuario = usuario
    this.motivo = motivo
    this.validarEstado(estado)
  }

  validarEstado(estadoAValidar) {
    if (!Object.prototype.hasOwnProperty.call(estado, estadoAValidar)) {
      throw new EstadoInvalidoError(estadoAValidar)
    }
  }
}
