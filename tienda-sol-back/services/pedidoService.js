import pedidoRepository from "../models/repositories/pedidoRepository.js"
import productoService from "./productoService.js"
import notificacionService from "./notificacionService.js"
import { tipoUsuario } from "../models/entities/tipoUsuario.js"
import { fromPedidoDTO } from "../converters/pedidoConverter.js"
import { PedidoInexistenteError } from "../errors/notFoundError.js"
import { estadoConverter } from "../converters/estadoConverter.js"
import { Estado } from "../models/entities/estado.js"
class PedidoService {

constructor(){
  this.numeroPedido = this.getNumeroPed()
}

  getNumeroPed(){
    return pedidoRepository.getNumeroPedido()
      .then((pedido) => {
        if (!pedido){ 
          return 0
        }
        return pedido
      })}
  

  incrementarNumeroPedido(){
      this.numeroPedido = this.numeroPedido.then((num) => num + 1)
  }
    

  /************************** CREAR UN PEDIDO **************************/
  crear(pedidoDTO, comprador) {
    return Promise.resolve()
      .then(() => {
        comprador.validarRol([tipoUsuario.COMPRADOR])
        return Promise.all(pedidoDTO.itemsDTO.map((item) => productoService.obtenerProducto(item.productoID)))
      })
      .then((productos) => {
        this.incrementarNumeroPedido()
        return this.numeroPedido.then((numeroPedido) => {return {numeroPedido, productos}} )
      })
      .then(({productos, numeroPedido}) =>
      {
        return fromPedidoDTO(pedidoDTO, comprador, productos, numeroPedido)
      }
      )
      .then((nuevoPedido) => {
        nuevoPedido.validarStock()
        productoService.reducirStock(nuevoPedido.items)
        
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
        return this.consultar(idPedido,usuario)
      })
      .then((pedido) => {
        estadoNuevo = estadoConverter(estado)
        estadoNuevo.validarUsuario(usuario)
        pedido.actualizarEstado(estadoNuevo, usuario, motivo)
        if(estadoNuevo.nombre == "Cancelado" ) {
          productoService.aumentarStock(pedido.items)

        }
        return pedidoRepository.update(pedido)
      })
      .then((pedidoActualizado) =>
        notificacionService.crearSegunEstadoPedido(pedidoActualizado.estadoNombre, pedidoActualizado).then(() => pedidoActualizado)
      )
  }
}

export default new PedidoService()
