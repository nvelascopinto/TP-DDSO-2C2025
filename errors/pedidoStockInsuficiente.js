export class pedidoStockInsuficiente extends Error {
  constructor(IDpedido) {
    super(message)
    this.name = "PedidoStockInsuficiente"
    this.message = "Stock insuficiente para uno o mas productos del pedido: " + IDpedido
}}