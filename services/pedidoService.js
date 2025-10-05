import PedidoRepository from "../models/repositories/pedidoRepository.js"
import UsuarioService from "./usuarioService.js"
import ProductoService from "./productoService.js"
import NotificacionService from "./notificacionService.js"
import { fromPedidoDTO } from "../converters/pedidoConverter.js"
import { autorizadosAEstado, estado } from "../models/entities/estadoPedido.js"
import { tipoUsuario } from "../models/entities/tipoUsuario.js"
import {
  validarExistenciaDePedido,
  validarExistenciaDeHistorial,
} from "../validators/pedidoValidator.js"

class PedidoService {

  /************************** CREAR UN PEDIDO **************************/
  crear(pedidoDTO) {
    const nuevoPedido = fromPedidoDTO(pedidoDTO)
    
    return UsuarioService.obtenerUsuario(pedidoDTO.compradorID, [tipoUsuario.COMPRADOR, ])
      .then((usuarioComprador) => { // Esto es lo que devuelve la promise
        nuevoPedido.comprador = usuarioComprador
        // Asi encadeno la siguiente promise
        return UsuarioService.obtenerUsuario(pedidoDTO.vendedorID, [tipoUsuario.VENDEDOR, ])
      }) 
      .then((usuarioVendedor) => { // Eso es lo que devuelve la promise anterior
        nuevoPedido.vendedor = usuarioVendedor 
        // Uso el map solo para formar un array de promises y asi poder pasar a la siguiente promise 
        return Promise.all(pedidoDTO.itemsDTO.map(item => 
          ProductoService.obtenerProducto(item.productoID)));
      })
      .then((productos) => {
        // Le asigno a cada producto del ItemPedido su respectivo Producto, respetando el orden
        nuevoPedido.items.forEach((item, i) => {item.producto = productos[i]}) 
        nuevoPedido.validarStock()
        nuevoPedido.validarItemsConVendedor()
        return PedidoRepository.crear(nuevoPedido)
      })
      .then((pedidoGuardado) => {
        return NotificacionService.crearSegunPedido(pedidoGuardado)
        .then (() => pedidoGuardado) // Devuelvo el pedido que me llego de la otra promise
      })
}

  /************************** CONSULTAR UN PEDIDO **************************/
  consultar(id) {
    return PedidoRepository.findById(id)
      .then((pedidoBuscado) => pedidoBuscado)
    //validarExistenciaDePedido(pedido, id) ==> no tira error mongo????
  }

  /************************** CONSULTAR EL HISTORIAL DE UN USUARIO **************************/
  consultarHistorial(id) {
    // if (this.usuarioEstaAutorizado(id, [tipoUsuario.COMPRADOR,tipoUsuario.VENDEDOR,tipoUsuario.ADMIN,])) {
    return PedidoRepository.consultarHistorial(id)
      .then((historial) => historial)
    //validarExistenciaDeHistorial(historialPedidos, id) ==> no tira ya el error mongo????
    //}
  }

  /************************** CAMBIAR EL ESTADO DE UN PEDIDO **************************/
  cambioEstado(cambioEstado, idPedido) {
    return this.usuarioEstaAutorizado(
      cambioEstado.idUsuario,
      autorizadosAEstado[cambioEstado.estado],
    )
    .then(() => {
      return this.consultar(idPedido)
    })
    .then((pedido) => {
      pedido.actualizarEstado(
        estado[cambioEstado.estado],
        cambioEstado.idUsuario,
        cambioEstado.motivo,
      )

      return this.pedidoRepository.actualizar(pedido)
    })
    .then((pedidoActualizado) => {
      return NotificacionService.crearSegunEstadoPedido(estado[cambioEstado.estado], pedidoActualizado)
      .then( () => "Pedido " + pedidoActualizado.id + " cambio a estado " + pedidoActualizado.estado)
    })
  }

  usuarioEstaAutorizado(id, roles) {
    return UsuarioService.obtenerUsuario(id, roles)
    .then((usuario) => {
      if(usuario) {return true}
      else {return false}
    })
  }
}

export default new PedidoService(
  PedidoRepository,
  UsuarioService,
  ProductoService,
  NotificacionService,
)