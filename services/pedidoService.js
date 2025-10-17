import pedidoRepository from "../models/repositories/pedidoRepository.js"
import productoService from "./productoService.js"
import notificacionService from "./notificacionService.js"
import { fromPedidoDTO } from "../converters/pedidoConverter.js"
import { autorizadosAEstado, estado } from "../models/entities/estadoPedido.js"
import { PedidoInexistenteError } from "../errors/notFoundError.js"
import { validarEstado } from "../validators/estadoValidador.js"

class PedidoService {
  /************************** CREAR UN PEDIDO **************************/
  crear(pedidoDTO, comprador) {
    return Promise.resolve()
      .then(() =>
        Promise.all(pedidoDTO.itemsDTO.map((item) => productoService.obtenerProducto(item.productoID)))
      )
      .then((productos) =>
        fromPedidoDTO(pedidoDTO, comprador, productos)
      )
      .then((nuevoPedido) => {
        nuevoPedido.validarStock()
        return pedidoRepository.crear(nuevoPedido)
      })
      .then((pedidoGuardado) =>
        notificacionService.crearSegunPedido(pedidoGuardado).then(() => pedidoGuardado)
      )
  }

  /************************** CONSULTAR UN PEDIDO **************************/
  consultar(idPedido, usuario) {
    return pedidoRepository.findById(idPedido)
      .then((pedidoBuscado) => {
        if (!pedidoBuscado) throw new PedidoInexistenteError(idPedido)
        pedidoBuscado.validarUsuario(usuario)
        return pedidoBuscado
      })
  }

  /************************** CONSULTAR EL HISTORIAL DE UN USUARIO **************************/
  consultarHistorial(idUsuario, usuario) {
    return pedidoRepository.consultarHistorial(idUsuario)
      .then((historial) => {
        historial.forEach((pedido) => pedido.validarUsuario(usuario))
        return historial
      })
  }

  /************************** CAMBIAR EL ESTADO DE UN PEDIDO **************************/
  cambioEstado(cambioEstado, idPedido) {
    return Promise.resolve()
      .then(() => {
        validarEstado(cambioEstado.estado)
        cambioEstado.usuario.validarRol(autorizadosAEstado[cambioEstado.estado])
        return this.consultar(idPedido, cambioEstado.usuario)
      })
      .then((pedido) => {
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
      .then((pedidoActualizado) =>
        notificacionService.crearSegunEstadoPedido(estado[cambioEstado.estado], pedidoActualizado)
      )
      .then((notificacion) =>
        notificacion.mensaje
      )
  }
}

export default new PedidoService()
