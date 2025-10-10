import pedidoRepository from "../models/repositories/pedidoRepository.js"
import productoService from "./productoService.js"
import notificacionService from "./notificacionService.js"
import { fromPedidoDTO } from "../converters/pedidoConverter.js"
import { autorizadosAEstado, estado } from "../models/entities/estadoPedido.js"
import { tipoUsuario } from "../models/entities/tipoUsuario.js"
import { validarExistenciaDePedido, validarExistenciaDeHistorial } from "../validators/pedidoValidator.js"
import { rolesValidator } from "../validators/usuarioValidator.js"
import { validarEstado } from "../validators/estadoValidador.js"

class PedidoService {
  /************************** CREAR UN PEDIDO **************************/
  crear(pedidoDTO, comprador) {
    const nuevoPedido = fromPedidoDTO(pedidoDTO)
    return Promise.resolve()
      .then(() => {
        rolesValidator(comprador, [tipoUsuario.COMPRADOR])
        nuevoPedido.comprador = comprador.username
        return Promise.all(pedidoDTO.itemsDTO.map((item) => productoService.obtenerProducto(item.productoID)))
      })
      .then((productos) => {
        // Le asigno a cada producto del ItemPedido su respectivo Producto, respetando el orden
        nuevoPedido.items.forEach((item, i) => {
          item.producto = productos[i]
        })
        nuevoPedido.validarItemsConVendedor() // asigno vendedor
        nuevoPedido.validarStock()
        return Promise.all(
          nuevoPedido.items.map((item) => {
            productoService.update(item.producto)
          })
        ).then(() => {
          return pedidoRepository.crear(nuevoPedido)
        })
      })
      .then((pedidoGuardado) => {
        return notificacionService.crearSegunPedido(pedidoGuardado).then(() => pedidoGuardado) // Devuelvo el pedido que me llego de la otra promise
      })
  }

  /************************** CONSULTAR UN PEDIDO **************************/
  consultar(id, usuario) {
    return pedidoRepository.findById(id).then((pedidoBuscado) => {
      validarExistenciaDePedido(pedidoBuscado, id)
      pedidoBuscado.validarUsuario(usuario)
      return pedidoBuscado
    })
  }

  /************************** CONSULTAR EL HISTORIAL DE UN USUARIO **************************/
  consultarHistorial(id, usuario) {
    return pedidoRepository.consultarHistorial(id).then((historial) => {
      validarExistenciaDeHistorial(historial, id)
      historial.forEach((pedido) => pedido.validarUsuario(usuario))
      return historial
    })
  }

  /************************** CAMBIAR EL ESTADO DE UN PEDIDO **************************/
  cambioEstado(cambioEstado, idPedido) {
    return Promise.resolve()
      .then(() => {
        //pedidoId = new mongoose.Types.ObjectId(idPedido)
        console.log("CAMBIO ESTADO JSON ================", cambioEstado)
        validarEstado(cambioEstado.estado)
        rolesValidator(cambioEstado.usuario, autorizadosAEstado[cambioEstado.estado])
        return this.consultar(idPedido, cambioEstado.usuario)
      })
      .then((pedido) => {
        console.log("ESTADO ====================", cambioEstado.estado)
        console.log("ESTADO PEDIDOOOO ===================", pedido.estado)
        pedido.actualizarEstado(estado[cambioEstado.estado], cambioEstado.usuario.username, cambioEstado.motivo)
        return pedidoRepository.actualizar(pedido)
      })
      .then((pedidoActualizado) => {
        return notificacionService.crearSegunEstadoPedido(estado[cambioEstado.estado], pedidoActualizado)
      })
      .then((notificacion) => {
        console.log("NOTIFICACION", notificacion)
        return notificacion.mensaje
      })
  }

  cantidadVentasProducto(producto) {
    return pedidoRepository.cantidadVentasProducto(producto).then((cantidad) => {
      console.log("CANTIDAD VENDIA de", producto._id)
      console.log(cantidad)
      return cantidad
    })
  }
}

export default new PedidoService()
