import  {estados} from "./estadosPedido.js"
import { CambioEstadoPedido } from "./cambioEstadoPedido.js"
import { Moneda } from "./moneda.js"
import { tipoUsuario } from "./tipoUsuario.js"
import { YaEnEstadoError, CambioEstadoInvalidoError } from "../../errors/conflicError.js"
import { ProductosDiferentesVendedorError } from "../../errors/domainValidationError.js"
import { UsuarioSinPermisoError } from "../../errors/authorizationError.js"

export class Pedido {
  
  constructor(comprador, vendedor, items, moneda, direccionEntrega, numero) {
    this.comprador = comprador
    this.vendedor = vendedor
    this.items = items
    this.total = this.calcularTotal()
    this.moneda = moneda
    this.direccionEntrega = direccionEntrega
    this.estado = estados["Pendiente"]
    this.estadoNombre = this.estado.nombre
    this.fechaCreacion = new Date()
    this.historialCambioPedidos = []
    this.numero = numero 
  }


  asignarComprador(comprador) {
    this.comprador = comprador
  }

  asignarProductos(productos) {
    this.items.forEach((item, i) => item.asignarProducto(productos[i]))
  }

  calcularTotal() {
    return this.items.reduce((acum, item) => acum + item.subtotal(), 0)
  }

  actualizarEstado(nuevoEstado, quien, motivo) {
    this.estado.cambiarEstadoA(nuevoEstado, quien, this)
    this.estadoNombre = nuevoEstado.nombre
    const cambio = new CambioEstadoPedido(nuevoEstado.nombre, this._id, quien.username, motivo)
    this.historialCambioPedidos.push(cambio)
  }

  validarStock() {
    this.items.forEach((item) => item.actualizarStock())
  }

  mostrarItems() {
    return this.items.reduce((mensaje, item) => {
      mensaje + item.mostrarProducto + "/n"
    }, "")
  }

  validarItemsConVendedor() {
    const vendedorUnico = this.items[0].producto.vendedor
    if (!this.items.every((item) => item.producto.vendedor === vendedorUnico)) {
      throw new ProductosDiferentesVendedorError(this.comprador)
    }
    this.vendedor = vendedorUnico
  }

  // validarMoneda() {
  //   if (!Object.values(Moneda).includes(this.moneda)) {
  //     throw new MonedaInvalidaError(this.moneda)
  //   }
  // }

  // validarCambioEstado(nuevoEstado) {
  //   const indiceActual = ordenEstados.indexOf(this.estado)
  //   const indiceNuevo = ordenEstados.indexOf(nuevoEstado)

  //   if (indiceNuevo === indiceActual) {
  //     throw new YaEnEstadoError(this._id, nuevoEstado)
  //   }
  //   if (indiceNuevo < indiceActual || this.estado === estado.CANCELADO) {
  //     throw new CambioEstadoInvalidoError(this._id, this.estado, nuevoEstado)
  //   }
  // }
  //usuario que puede acceder a ver el pedido
  validarUsuario(usuario) {
    if (usuario.username != this.vendedor && usuario.username != this.comprador && usuario.tipoUsuario != tipoUsuario.ADMIN) {
      throw new UsuarioSinPermisoError(usuario.username)
    }
  }
}
