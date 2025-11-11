import { AppError } from "./appError.js"

class NotFoundError extends AppError {
  constructor(message, logInfo) {
    super(message, 404, "NotFoundError", logInfo)
  }
}

export class PedidoInexistenteError extends NotFoundError {
  constructor(idPedido) {
    super(
      "El pedido solicitado no existe.", 
      "Intento de acceder al PEDIDO " + idPedido + " inexistente."
    )
  }
}

export class ProductoInexistenteError extends NotFoundError {
  constructor(idProducto) {
    super(
      "El producto solicitado no existe.", 
      "Intento de acceder al PRODUCTO " + idProducto + " inexistente."
    )
  }
}

export class UsuarioInexistenteError extends NotFoundError {
  constructor(idUsuario) {
    super(
      "El usuario solicitado no existe.", 
      "Intento de acceder al USUARIO " + idUsuario + " inexistente."
    )
  }
}

export class NotificacionInexistenteError extends NotFoundError {
  constructor(idNotificacion) {
    super(
      "La notificación solicitada no existe.", 
      "Intento de acceder a la NOTIFICACIÓN " + idNotificacion + " inexistente."
    )
  }
}

export class TiendaInexistenteError extends NotFoundError {
  constructor(tiendaNombre) {
    super(
      "La tienda solicitada no existe.", 
      "Intento buscar la Tienda " + tiendaNombre + " inexistente."
    )
  }
}