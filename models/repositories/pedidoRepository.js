export class PedidoRepository {
  constructor() {
    this.pedidos = [];
    this.nextId = 1;
  }

  crear(pedido) {
    pedido.id = this.nextId++;
    this.pedidos.push(pedido);
    return pedido;
  }

  consultarHistorial(id) {
    const pedidosUsuario = this.pedidos.filter((p) => p.comprador.id === id);
    return pedidosUsuario;
  }

  // FUNCIONES AUXILIARES

  findById(id) {
    return this.pedidos.find((p) => p.id === id) || null;
  }
}
