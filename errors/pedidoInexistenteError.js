import AppError from "./appError.js"

class PedidoInexistenteError extends AppError {
  constructor(IDpedido) {
    super(`No existe un pedido con ese ID`, 404, "PedidoInexistenteError", { IDpedido })
  }
}

export default PedidoInexistenteError
