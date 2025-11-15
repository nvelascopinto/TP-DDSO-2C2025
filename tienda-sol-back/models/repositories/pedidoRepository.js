import { PedidoModel } from "../schemas/pedidoSchema.js"

class PedidoRepository {
  constructor() {
    this.modelPedido = PedidoModel
  }

  crear(pedido) {
    const pedidoGuardado = new this.modelPedido(pedido)
    return pedidoGuardado.save()
  }

  async getNumeroPedido() {
    const ultimoPedido = await this.modelPedido
      .findOne()
      .sort({ numero: -1 })
      .select('numero')
      .lean();
    return ultimoPedido ? ultimoPedido.numero : 0;
}

  consultarHistorial(id) {
    const historial = this.modelPedido
      .find({
        // con el id que le llega del header busca los pedidos en caso de q sea el comprador o el vendedor
        $or: [
          { comprador: id },
          { vendedor: id }   
        ]
      })
      .populate("items.producto")
    return historial;
  }

  update(pedido) {
    return this.modelPedido.findByIdAndUpdate(pedido._id, pedido, { new: true })
  }

  findById(id) {
    return this.modelPedido.findById(id).populate("items.producto")
  }
}

export default new PedidoRepository()
