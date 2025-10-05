import { estado } from "./estadoPedido.js"
import { CambioEstadoPedido } from "./cambioEstadoPedido.js"
import { Moneda } from "./moneda.js"
import { ordenEstados } from "./estadoPedido.js"
import YaEnEstadoError from "../../errors/yaEnEstadoError.js"
import PedidoStockInsuficienteError from "../../errors/pedidoStockInsuficienteError.js"
import DatosInvalidosError from "../../errors/datosInvalidosError.js"
import CambioEstadoInvalidoError from "../../errors/cambioEstadoInvalidoError.js"
export class Pedido {
  constructor(comprador, vendedor, items, moneda, direccionEntrega) {
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

    // this.validarItemsConVendedor
    this.validarMoneda
  }

  calcularTotal() {
    return this.items.reduce((acum, item) => acum + item.subtotal(), 0)
  }

  actualizarEstado(nuevoEstado, quien, motivo) {
    this.validarCambioEstado(nuevoEstado)
    this.estado = nuevoEstado
    const cambio = new CambioEstadoPedido(nuevoEstado, this.id, quien, motivo)
    this.historialCambioPedidos.push(cambio)
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

  validarItemsConVendedor() {
    if (!this.items.every((item) => item.producto.vendedor.id === this.vendedor.id)) {
      throw new DatosInvalidosError(
        "Los productos del pedido deben ser todos del mismo vendedor",
      )
    }
  }

  validarMoneda() {
    if (!Object.values(Moneda).includes(this.moneda)) {
      throw new DatosInvalidosError(
        "La moneda ingresada no esta dentro de las opciones ofrecidas",
      )
    }
  }

  validarCambioEstado(nuevoEstado) {
    const indiceActual = ordenEstados.indexOf(this.estado)
    const indiceNuevo = ordenEstados.indexOf(nuevoEstado)

    if (indiceNuevo === indiceActual) {
      throw new YaEnEstadoError(nuevoEstado)
    }
    if (indiceNuevo < indiceActual || this.estado === estado.CANCELADO) {
      throw new CambioEstadoInvalidoError(this.estado, nuevoEstado)
    }
  }
}
