export class PedidoInexistenteError extends Error {
  constructor(IDpedido) {
    super(message);
    this.name = "PedidoInexistenteError";
    this.message = "No existe el pedido con ID : " + IDpedido;
  
}}