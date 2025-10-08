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
    return this.modelPedido.findByIdAndUpdate(pedido._id, pedido, { new: true })
  }

  findById(id) {
    console.log(id)
    return this.modelPedido.findById(id).populate("direccionEntrega").populate("items")
  }

  cantidadVentasProducto(producto) {
    const productoId = producto._id // mongoose.Types.ObjectId(producto._id)
    return this.modelPedido
      .aggregate([
    { $unwind: "$items" },                    // cada itemId por separado
    {
      $lookup: {
        from: "items",                        // nombre de la colección ItemPedido (verificar)
        localField: "items",                  // en Pedido: array de ObjectId
        foreignField: "_id",                  // en ItemPedido: _id
        as: "itemDoc"
      }
    },
    { $unwind: "$itemDoc" },                  // ahora itemDoc es el documento real
    { $match: { "itemDoc.producto": productoId } }, // filtrar por producto
    {
      $group: {
        _id: "$itemDoc.producto",
        totalUnidadesVendidas: { $sum: "$itemDoc.cantidad" }
      }
    }
  ])
      .exec()
  .then(resultado => resultado[0]?.totalUnidadesVendidas || 0);
  } 
}

export default new PedidoRepository()
