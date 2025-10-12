import { PedidoModel } from "../schemas/pedidoSchema.js"

class PedidoRepository {
  constructor() {
    this.modelPedido = PedidoModel
  }

  crear(pedido) {
    const pedidoGuardado = new this.modelPedido(pedido)
    return pedidoGuardado.save()
  }

  consultarHistorial(id) {
    const historial = this.modelPedido.find({ comprador: id }).populate("items.producto")
    return historial
  }

  actualizar(pedido) {
    return this.modelPedido.findByIdAndUpdate(pedido._id, pedido, {
      new: true
    })
  }

  findById(id) {
    console.log(id)
    return this.modelPedido.findById(id).populate("items.producto")
  }
}

export default new PedidoRepository()
