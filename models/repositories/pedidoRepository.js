import { PedidoModel } from "../schemas/pedidoSchema.js"
import { DireccionEntregaModel } from "../schemas/direccionEntregaSchema.js"
import { ItemPedidoModel } from "../schemas/itemPedidoSchema.js"

class PedidoRepository {
  constructor() {
    this.modelPedido = PedidoModel
    this.modelDireccion = DireccionEntregaModel
    this.modelItem = ItemPedidoModel
  }

  crear(pedido) {
    const direccionGuardada = new this.modelDireccion(pedido.direccionEntrega)
    const itemsGuardados = pedido.items.map((item) => {
      const nuevoItem = new this.modelItem(item)
      nuevoItem.save()
      return nuevoItem
    })
    direccionGuardada.save()
    const pedidoGuardado = new this.modelPedido({
      comprador: pedido.comprador,
      vendedor: pedido.vendedor,
      items: itemsGuardados.map((i) => i._id),
      total: pedido.total,
      moneda: pedido.moneda,
      estado: pedido.estado,
      direccionEntrega: direccionGuardada._id,
      historialCambioPedidos: pedido.historialCambioPedidos,
      fechaCreacion: pedido.fechaCreacion,
    })

    return pedidoGuardado.save()
  }

  consultarHistorial(id) {
    const historial = this.modelPedido
      .find({ comprador: id })
      .populate("direccionEntrega")
      .populate("items")
    return historial
  }

  actualizar(pedido) {
    return this.modelPedido.findByIdAndUpdate(pedido._id, pedido)
  }

  findById(id) {
    console.log(id)
    return this.modelPedido.findById(id).populate("direccionEntrega").populate("items")
  }

  cantidadVentasProducto(producto) {
    const productoId = producto._id // mongoose.Types.ObjectId(producto._id)
    const resultado = this.modelPedido
      .aggregate([
        { $unwind: "$items" },
        { $match: { "items.productoId": productoId } },
        {
          $group: {
            _id: "$items.productoId",
            totalUnidadesVendidas: { $sum: "$items.cantidad" },
          },
        },
      ])
      .toArray()
    // const total = data?.totalUnidadesVendidas || 0;
    const total = resultado[0]?.totalUnidadesVendidas || 0;
    return total
  }
}

export default new PedidoRepository()
