import { estado } from "./estadoPedido.js"
import { CambioEstadoPedido } from "./cambioEstadoPedido.js"
import { Moneda } from "./moneda.js"
import { ordenEstados } from "./estadoPedido.js"
import YaEnEstadoError from "../../errors/yaEnEstadoError.js"
import PedidoStockInsuficienteError from "../../errors/pedidoStockInsuficienteError.js"
import DatosInvalidosError from "../../errors/datosInvalidosError.js"
import CambioEstadoInvalidoError from "../../errors/cambioEstadoInvalidoError.js"
import { tipoUsuario } from "./tipoUsuario.js"
import UsuarioSinPermisoError from "../../errors/usuarioSinPermisoError.js"
import EstadoInvalidoError from "../../errors/estadoInvalidoError.js"
export class Pedido {
  constructor(comprador, vendedor, items, moneda, direccionEntrega) {
    this._id = null // inciialmente se pone en null hasta que es guardado en el Repo
    this.comprador = comprador
    this.vendedor = vendedor
    this.items = items
    this.total = this.calcularTotal()
    this.moneda = moneda
    this.direccionEntrega = direccionEntrega
    this.estado = estado.PENDIENTE
    this.fechaCreacion = new Date()
    this.historialCambioPedidos = []
    this.validarMoneda
  }

  calcularTotal() {
    return this.items.reduce((acum, item) => acum + item.subtotal(), 0)
  }

  actualizarEstado(nuevoEstado, quien, motivo) {
    this.validarCambioEstado(nuevoEstado)
    this.estado = nuevoEstado
    const cambio = new CambioEstadoPedido(nuevoEstado, this._id, quien, motivo)
    this.historialCambioPedidos.push(cambio)
  }

  validarStock() {
    if (!this.items.every((item) => item.producto.estaDisponible(item.cantidad))) {
      throw new PedidoStockInsuficienteError()
    }
    this.items.forEach((item) => {
      item.producto.reducirStock(item.cantidad)
    })

    return true
  }

  mostrarItems() {
    return this.items.reduce((mensaje, item) => {
      mensaje + item.mostrarProducto + "/n"
    }, "")
  }

  validarItemsConVendedor() {
    const vendedorUnico = this.items[0].producto.vendedor
    if (!this.items.every((item) => item.producto.vendedor === vendedorUnico)) {
      // ver si son id o no????
      throw new DatosInvalidosError(
        "Los productos del pedido deben ser todos del mismo vendedor",
      )
    }
    this.vendedor = vendedorUnico
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
  //usuario que puede acceder a ver el pedido
  validarUsuario(usuario) {
    if (
      usuario.username != this.vendedor &&
      usuario.username != this.comprador &&
      usuario.tipoUsuario != tipoUsuario.ADMIN
    ) {
      throw new UsuarioSinPermisoError(usuario.username)
    }
  }
}
