import AppError from "./appError.js"

class ConflictError extends AppError {
  constructor(message, details) {
    super(message, 409, "ConflictError", details)
  }
}

export class PedidoStockInsuficienteError extends ConflictError {
  constructor() {
    super("Stock insuficiente para uno o más productos del pedido")
  }
}

export class YaLeidaError extends ConflictError {
  constructor(notificacionId) {
    super("La notificacion ya fue leida", { notificacionId })
  }
}

export class YaEnEstadoError extends ConflictError {
  constructor(nuevoEstado) {
    super("El pedido ya está en ese estado", { nuevoEstado })
  }
}

export class CambioEstadoInvalidoError extends ConflictError {
  constructor(estadoActual, nuevoEstado) {
    super("El pedido no puede pasar a ese estado", { estadoActual, nuevoEstado })
  }
}

export class YaExisteUsuarioError extends ConflictError {
  constructor(username) {
    super("El username ingresado ya existe", { username })
  }
}
