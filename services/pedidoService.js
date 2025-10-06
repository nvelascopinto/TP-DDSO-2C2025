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
import { rolesValidator } from "../validators/usuarioValidator.js"
class PedidoService {

  /************************** CREAR UN PEDIDO **************************/
  crear(pedidoDTO, vendedor, comprador) {
    const nuevoPedido = fromPedidoDTO(pedidoDTO)
    return Promise.resolve().then(()=>{
      rolesValidator(comprador, [tipoUsuario.COMPRADOR])
      rolesValidator(vendedor,[tipoUsuario.VENDEDOR] )
      nuevoPedido.comprador = comprador._id
      nuevoPedido.vendedor = vendedor._id
          // Uso el map solo para formar un array de promises y asi poder pasar a la siguiente promise 
      return Promise.all(pedidoDTO.itemsDTO.map(item => 
            ProductoService.obtenerProducto(item.productoID)));
    }).then((productos) => {
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
    return PedidoRepository.consultarHistorial(id)
      .then((historial) => historial)
  }

  /************************** CAMBIAR EL ESTADO DE UN PEDIDO **************************/
  cambioEstado(cambioEstado, idPedido) {
    return Promise.resolve().then(()=> {
       rolesValidator(cambioEstado.usuario, autorizadosAEstado[cambioEstado.estado])
       return this.consultar(idPedido)
    }).then((pedido) => {
      pedido.actualizarEstado(
        estado[cambioEstado.estado],
        cambioEstado.usuario._id,
        cambioEstado.motivo,
      )
      return this.pedidoRepository.actualizar(pedido)
    }).then((pedidoActualizado) => {
      return NotificacionService.crearSegunEstadoPedido(estado[cambioEstado.estado], pedidoActualizado)
      .then( () => "Pedido " + pedidoActualizado._id + " cambio a estado " + pedidoActualizado.estado)
    })
  }

  cantidadVentasProducto(producto){
    this.pedidoRepository.cantidadVentasProducto(producto)
  }

}
//aplicar el authenticatr a cambio de pedido 

export default new PedidoService(
  PedidoRepository,
  UsuarioService,
  ProductoService,
  NotificacionService,
)