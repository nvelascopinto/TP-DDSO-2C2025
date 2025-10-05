import { PedidoModel } from "../schemas/pedidoSchema.js"

class PedidoRepository {
  constructor() {
    this.model = PedidoModel
  }

  crear(pedido) {
      const pedidoGuardado = new this.model(pedido)
      return pedidoGuardado.save()
  }

  consultarHistorial(id) {
    const historial = this.model.find({ comprador: id })
    return historial
  }

  actualizar(pedido) {
    return pedido.save()
  }

  findById(id) {
    return this.model.findById(id)
  }
}

export default new PedidoRepository()
