import AppError from "./appError.js"

class PedidoStockInsuficienteError extends AppError {
  constructor() {
    super("Stock insuficiente para uno o más productos del pedido", 409, "PedidoStockInsuficiente", null)
  }
}

export default PedidoStockInsuficienteError
