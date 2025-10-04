import { PedidoModel } from "../schemas/pedidoSchema.js"
class PedidoRepository {
  constructor() {
    this.model = new PedidoModel
  }

  crear(pedido) {
    const nuevoPedido = new this.model(pedido)
    return nuevoPedido.save()
  }

  consultarHistorial(id) {
    const historial = this.model.find({comprador : id})
    return historial
  }

  findById(id) {
    return this.model.findById(id)
  }
}

export default new PedidoRepository()
