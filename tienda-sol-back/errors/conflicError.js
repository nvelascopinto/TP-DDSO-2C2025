import { AppError } from "./appError.js"

class ConflictError extends AppError {
  constructor(message, logInfo) {
    super(message, 409, "ConflictError", logInfo)
  }
}

// export class PedidoStockInsuficienteError extends ConflictError {
//   constructor(idProducto) {
//     super(
//       "El stock es insuficiente para uno o más productos del pedido.",
//       "Intento de crear un pedido con stock insuficiente del PRODUCTO " + idProducto + "."
//     )
//   }
// }

export class ProductoInactivoError extends ConflictError {
  constructor(idProducto) {
    super(
      "El estado es inactivo para uno o más productos del pedido",
      "Intento de crear un pedido con el PRODUCTO " + idProducto + " inactivo."
    )
  }
}

export class ProductoStockInsuficienteError extends ConflictError {
  constructor(idProducto) {
    super(
      "El stock es insuficiente para uno o más productos del pedido",
      "Intento de crear un pedido con el PRODUCTO " + idProducto + " sin stock."
    )
  }
}

export class YaLeidaError extends ConflictError {
  constructor(idNotificacion, idUsuario) {
    super(
      "La notificación ya fue leída.", 
      "Intento de leer la NOTIFICACIÓN " + idNotificacion + ", que ya estaba leída, por parte del USUARIO " + idUsuario + "."
    )
  }
}

export class YaEnEstadoError extends ConflictError {
  constructor(idPedido, nuevoEstado) {
    super(
      "El pedido ya está en ese estado.", 
      "Intento de cambiar el PEDIDO " + idPedido + " al ESTADO " + nuevoEstado + ", pero ya se encuentra en ese estado."
    )
  }
}

export class CambioEstadoInvalidoError extends ConflictError {
  constructor(idPedido, estadoActual, nuevoEstado) {
    super(
      "El pedido no puede pasar a ese estado.", 
      "Intento de cambiar el PEDIDO " + idPedido + " del ESTADO " + estadoActual + " al ESTADO " + nuevoEstado + ", transición inválida."
    )
  }
}

export class YaExisteUsuarioError extends ConflictError {
  constructor(username) {
    super(
      "El username ingresado ya existe.", 
      "Intento de registrar un usuario con USERNAME " + username + ", que ya existe en la base de datos."
    )
  }
}
