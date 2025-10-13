import AppError from "./appError.js"

class NotFoundError extends AppError {
  constructor(message, details) {
    super(message, 404, "NotFoundError", details)
  }
}

export class PedidoInexistenteError extends NotFoundError {
  constructor(pedidoId) {
    super("No existe un pedido con ese ID", { pedidoId })
  }
}

export class ProductoInexistenteError extends NotFoundError {
  constructor(productoId) {
    super("No existe un producto con ese ID", { productoId })
  }
}

export class UsuarioInexistenteError extends NotFoundError {
  constructor(usuarioId) {
    super("No existe un usuario con el ID enviado", { usuarioId })
  }
}

export class NotificacionInexistenteError extends NotFoundError {
  constructor(notificacionId) {
    super("No existe una notificacion con ese ID", { notificacionId })
  }
}
