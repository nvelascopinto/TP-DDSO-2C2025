export class pedidoStockInsuficiente extends Error {
  constructor(IDpedido) {
    super()
    this.name = "PedidoStockInsuficiente"
    this.message = "Stock insuficiente para uno o mas productos del pedido: " + IDpedido
}}