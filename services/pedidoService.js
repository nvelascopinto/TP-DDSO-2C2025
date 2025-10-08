import PedidoRepository from "../models/repositories/pedidoRepository.js"
import productoServiceInstance from "./productoService.js"
import notificacionServiceInstance from "./notificacionService.js"
import { fromPedidoDTO } from "../converters/pedidoConverter.js"
import { autorizadosAEstado, estado } from "../models/entities/estadoPedido.js"
import { tipoUsuario } from "../models/entities/tipoUsuario.js"
import {
  validarExistenciaDePedido,
  validarExistenciaDeHistorial,
} from "../validators/pedidoValidator.js"
import { rolesValidator } from "../validators/usuarioValidator.js"
import { validarEstado } from "../validators/estadoValidador.js"
export class PedidoService {
  constructor(PedidoRepository, productoServiceInstance, notificationServiceInstance) {
    this.pedidoRepository = PedidoRepository
    this.productoService = productoServiceInstance
    this.notificacionService = notificationServiceInstance
  }
  /************************** CREAR UN PEDIDO **************************/
  crear(pedidoDTO, comprador) {
    const nuevoPedido = fromPedidoDTO(pedidoDTO)
    return Promise.resolve()
      .then(() => {
        rolesValidator(comprador, [tipoUsuario.COMPRADOR])
        nuevoPedido.comprador = comprador.username
        return Promise.all(
          pedidoDTO.itemsDTO.map((item) =>
            this.productoService.obtenerProducto(item.productoID),
          ),
        )
      })
      .then((productos) => {
        // Le asigno a cada producto del ItemPedido su respectivo Producto, respetando el orden
        nuevoPedido.items.forEach((item, i) => {
          item.producto = productos[i]
        })
        nuevoPedido.validarItemsConVendedor() // asigno vendedor
        nuevoPedido.validarStock()
        return this.pedidoRepository.crear(nuevoPedido)
      })
      .then((pedidoGuardado) => {
        return this.notificacionService
          .crearSegunPedido(pedidoGuardado)
          .then(() => pedidoGuardado) // Devuelvo el pedido que me llego de la otra promise
      })
  }

  /************************** CONSULTAR UN PEDIDO **************************/
  consultar(id, usuario) {
    return this.pedidoRepository.findById(id).then((pedidoBuscado) => {
      validarExistenciaDePedido(pedidoBuscado, id)
      pedidoBuscado.validarUsuario(usuario)
      return pedidoBuscado
    })
  }

  /************************** CONSULTAR EL HISTORIAL DE UN USUARIO **************************/
  consultarHistorial(id) {
    return this.pedidoRepository.consultarHistorial(id).then((historial) => {
      validarExistenciaDeHistorial(historial, id)
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
        pedido.actualizarEstado(
          estado[cambioEstado.estado],
          cambioEstado.usuario.username,
          cambioEstado.motivo,
        )
        return this.pedidoRepository.actualizar(pedido)
      }).then((pedidoActualizado) => {
           return this.notificacionService.crearSegunEstadoPedido(estado[cambioEstado.estado], pedidoActualizado)
      }).then((notificacion) => {
          console.log("NOTIFICACION", notificacion)
          return notificacion.mensaje})
          
  }

  cantidadVentasProducto(producto) {
    this.pedidoRepository.cantidadVentasProducto(producto)
  }
}

export const pedidoServiceInstance = new PedidoService(
  PedidoRepository,
  productoServiceInstance,
  notificacionServiceInstance,
)
