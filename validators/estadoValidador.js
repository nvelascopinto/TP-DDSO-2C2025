import { EstadoInvalidoError } from "../errors/domainValidationError.js"
import { estado } from "../models/entities/estadoPedido.js"

export function validarEstado(estadoAValidar) {
  if (!Object.prototype.hasOwnProperty.call(estado, estadoAValidar)) {
    throw new EstadoInvalidoError(estadoAValidar)
  }
}
