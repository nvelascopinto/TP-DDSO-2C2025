export class PedidoStockInsuficiente extends Error {
  constructor() {
    super()
    this.name = "PedidoStockInsuficiente"
    this.message = "Stock insuficiente para uno o mas productos del pedido "
  }
}