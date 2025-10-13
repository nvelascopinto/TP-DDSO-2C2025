import pedidoRepository from "../models/repositories/pedidoRepository.js"
import productoService from "./productoService.js"
import notificacionService from "./notificacionService.js"
import { fromPedidoDTO } from "../converters/pedidoConverter.js"
import { autorizadosAEstado, estado } from "../models/entities/estadoPedido.js"
import { tipoUsuario } from "../models/entities/tipoUsuario.js"
import { PedidoInexistenteError } from "../errors/NotFoundError.js"
import { validarEstado } from "../validators/estadoValidador.js"

class PedidoService {
  /************************** CREAR UN PEDIDO **************************/
  crear(pedidoDTO, comprador) {
    let nuevoPedido
    return Promise.resolve()
      .then(() => {
        nuevoPedido = fromPedidoDTO(pedidoDTO)
        comprador.validarRol([tipoUsuario.COMPRADOR])
        nuevoPedido.asignarComprador(comprador.username)
        return Promise.all(pedidoDTO.itemsDTO.map((item) => productoService.obtenerProducto(item.productoID)))
      })
      .then((productos) => {
        nuevoPedido.asignarProductos(productos)
        nuevoPedido.validarItemsConVendedor() // asigno vendedor
        nuevoPedido.validarStock() // verifico que exista stock suficiente
        nuevoPedido.calcularTotal()
        return pedidoRepository.crear(nuevoPedido)
      })
      .then(
        (pedidoGuardado) => {
          return notificacionService.crearSegunPedido(pedidoGuardado).then(() => pedidoGuardado)
        } // Devuelvo el pedido que me llego de la otra promise
      )
  }

  /************************** CONSULTAR UN PEDIDO **************************/
  consultar(id, usuario) {
    return pedidoRepository.findById(id).then((pedidoBuscado) => {
      if (!pedidoBuscado) throw new PedidoInexistenteError(id)
      pedidoBuscado.validarUsuario(usuario)
      return pedidoBuscado
    })
  }

  /************************** CONSULTAR EL HISTORIAL DE UN USUARIO **************************/
  consultarHistorial(id, usuario) {
    return pedidoRepository.consultarHistorial(id).then((historial) => {
      historial.forEach((pedido) => pedido.validarUsuario(usuario))
      return historial
    })
  }

  /************************** CAMBIAR EL ESTADO DE UN PEDIDO **************************/
  cambioEstado(cambioEstado, idPedido) {
    return Promise.resolve()
      .then(() => {
        //pedidoId = new mongoose.Types.ObjectId(idPedido)
        // console.log("CAMBIO ESTADO JSON ================", cambioEstado)
        validarEstado(cambioEstado.estado)
        cambioEstado.usuario.validarRol(autorizadosAEstado[cambioEstado.estado])
        return this.consultar(idPedido, cambioEstado.usuario)
      })
      .then((pedido) => {
        // console.log("ESTADO ====================", cambioEstado.estado)
        // console.log("ESTADO PEDIDOOOO ===================", pedido.estado)
        if (estado[cambioEstado.estado] == estado.CONFIRMADO) {
          pedido.validarStock()
          return productoService.reducirStock(pedido.items).then(() => pedido) // reduce stock y aumenta cantidad vendida
        } else if (
          estado[cambioEstado.estado] == estado.CANCELADO &&
          (pedido.estado == estado.CONFIRMADO || pedido.estado == estado.EN_PREPARACION)
        ) {
          return productoService.aumentarStock(pedido.items).then(() => pedido) // aumenta stock y reduce cantidad vendidad
        }
        return pedido // para cuando sean otros estados
      })
      .then((pedido) => {
        pedido.actualizarEstado(estado[cambioEstado.estado], cambioEstado.usuario.username, cambioEstado.motivo)
        return pedidoRepository.update(pedido)
      })
      .then((pedidoActualizado) => {
        return notificacionService.crearSegunEstadoPedido(estado[cambioEstado.estado], pedidoActualizado)
      })
      .then((notificacion) => {
        // console.log("NOTIFICACION", notificacion)
        return notificacion.mensaje
      })
  }
}

export default new PedidoService()
