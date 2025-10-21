import pedidoRepository from "../models/repositories/pedidoRepository.js"
import productoService from "./productoService.js"
import notificacionService from "./notificacionService.js"
import { fromPedidoDTO } from "../converters/pedidoConverter.js"
import { PedidoInexistenteError } from "../errors/notFoundError.js"
import { estadoConverter } from "../converters/estadoConverter.js"
class PedidoService {
  /************************** CREAR UN PEDIDO **************************/
  crear(pedidoDTO, comprador) {
    return Promise.resolve()
      .then(() => {
        comprador.validarRol([tipoUsuario.COMPRADOR])
        return Promise.all(pedidoDTO.itemsDTO.map((item) => productoService.obtenerProducto(item.productoID)))
      })
      .then((productos) =>
        fromPedidoDTO(pedidoDTO, comprador, productos)
      )
      .then((nuevoPedido) => {
        nuevoPedido.actualizarStock()
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
  cambioEstado(estado, usuario, motivo, idPedido) {
    let estadoNuevo = estado
    return Promise.resolve()
      .then(() => {
        estadoNuevo = estadoConverter(estado)
      }).then(() => {
        estadoNuevo.validarUsuario(usuario)
        return this.consultar(idPedido,usuario)
      })
      .then((pedido) => {
        pedido.actualizarEstado(estadoNuevo, usuario, motivo)
        return pedidoRepository.update(pedido)
      })
      .then((pedidoActualizado) =>
        notificacionService.crearSegunEstadoPedido(estadoNuevo.nombre, pedidoActualizado)
      )
      .then(() =>
        "El pedido cambio a estado " + estadoNuevo.nombre + " correctamente."
      )
  }
}

export default new PedidoService()
