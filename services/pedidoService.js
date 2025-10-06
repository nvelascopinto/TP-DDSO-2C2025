import PedidoRepository from "../models/repositories/pedidoRepository.js"
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
import mongoose from "mongoose"

class PedidoService {

  /************************** CREAR UN PEDIDO **************************/
  crear(pedidoDTO, comprador) {
    const nuevoPedido = fromPedidoDTO(pedidoDTO)
    return Promise.resolve().then(()=>{
      rolesValidator(comprador, [tipoUsuario.COMPRADOR])
      nuevoPedido.comprador = comprador._id
      return Promise.all(pedidoDTO.itemsDTO.map(item => 
            ProductoService.obtenerProducto(item.productoID)));
    }).then((productos) => {
        // Le asigno a cada producto del ItemPedido su respectivo Producto, respetando el orden
        nuevoPedido.items.forEach((item, i) => {item.producto = productos[i]}) 
        nuevoPedido.validarItemsConVendedor() // asigno vendedor
        nuevoPedido.validarStock()
        return PedidoRepository.crear(nuevoPedido)
      })
      .then((pedidoGuardado) => {
        return NotificacionService.crearSegunPedido(pedidoGuardado)
        .then (() => pedidoGuardado) // Devuelvo el pedido que me llego de la otra promise
      })
}

  /************************** CONSULTAR UN PEDIDO **************************/
  consultar(id, usuario) {
    return PedidoRepository.findById(id)
      .then((pedidoBuscado) => {
        validarExistenciaDePedido(pedidoBuscado, id)
        pedidoBuscado.validarUsuario(usuario)
        return pedidoBuscado
      })
   
  }

  /************************** CONSULTAR EL HISTORIAL DE UN USUARIO **************************/
  consultarHistorial(id) {
    return PedidoRepository.consultarHistorial(id)
      .then((historial) => {
        validarExistenciaDeHistorial(historial,id)
        return historial
      })
  }

  /************************** CAMBIAR EL ESTADO DE UN PEDIDO **************************/
  cambioEstado(cambioEstado, idPedido) {
    return Promise.resolve().then(()=> {
       //pedidoId = new mongoose.Types.ObjectId(idPedido)
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


export default new PedidoService(
  PedidoRepository,
  ProductoService,
  NotificacionService
)