import { estado } from "./estadoPedido.js"
import { CambioEstadoPedido } from "./cambioEstadoPedido.js"
import YaEnEstadoError from "../../errors/yaEnEstadoError.js"
import PedidoStockInsuficienteError from "../../errors/pedidoStockInsuficienteError.js"
export class Pedido {
  constructor(comprador, vendedor, items, moneda, direccionEntrega) {
    //validate()
    this.id = null // inciialmente se pone en null hasta que es guardado en el Repo
    this.comprador = comprador // se debe chequear si es comprador ?
    this.vendedor = vendedor
    this.items = items
    this.total = this.calcularTotal()
    this.moneda = moneda
    this.direccionEntrega = direccionEntrega
    this.estado = estado.PENDIENTE
    this.fechaCreacion = new Date()
    this.historialCambioPedidos = []
  }

  calcularTotal() {
    return this.items.reduce((acum, item) => acum + item.subtotal(), 0)
  }

  actualizarEstado(nuevoEstado, quien, motivo) {
    if (this.estado === nuevoEstado) {
      throw new YaEnEstadoError(nuevoEstado)
    }
    this.estado = nuevoEstado
    const cambio = new CambioEstadoPedido(nuevoEstado, this.id, quien, motivo)
    this.historialCambioPedidos.push(cambio)
    return
  }

  validarStock() {
    if (!this.items.every((item) => item.producto.estaDisponible(item.cantidad))) {
      throw new PedidoStockInsuficienteError()
    }

    return true
  }

  mostrarItems() {
    return this.items.reduce((mensaje, item) => {
      mensaje + item.mostrarProducto + "/n"
    }, "")
  }
}
