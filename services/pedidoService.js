import PedidoRepository from "../models/repositories/pedidoRepository.js"
import UsuarioService from "./usuarioService.js"
import ProductoService from "./productoService.js"
import NotificacionService from "./notificacionService.js"
import { autorizadosAEstado, estado } from "../models/entities/estadoPedido.js"
import { Pedido } from "../models/entities/pedido.js"
import { DireccionEntrega } from "../models/entities/direccionEntrega.js"
import { tipoUsuario } from "../models/entities/tipoUsuario.js"
import { ItemPedido } from "../models/entities/itemPedido.js"
import {
  validarExistenciaDePedido,
  validarExistenciaDeHistorial,
} from "../validators/pedidoValidator.js"

class PedidoService {
  constructor(pedidoRepository, usuarioService, productoService, notificacionService) {
    this.pedidoRepository = pedidoRepository
    this.usuarioService = usuarioService
    this.productoService = productoService
    this.notificacionService = notificacionService
  }

  /************************** CREAR UN PEDIDO **************************/
  crear(pedidoDTO) {
    const nuevoPedido = this.convertirAPedido(pedidoDTO)

    nuevoPedido.validarStock()

    const pedidoGuardado = this.pedidoRepository.crear(nuevoPedido)
    this.notificacionService.crearSegunPedido(pedidoGuardado)

    return pedidoGuardado
  }

  convertirAPedido(pedidoDTO) {
    const comprador = this.usuarioService.obtenerUsuario(pedidoDTO.compradorID, [
      tipoUsuario.COMPRADOR,
    ])

    const vendedor = this.usuarioService.obtenerUsuario(pedidoDTO.vendedorID, [
      tipoUsuario.VENDEDOR,
    ])

    const items = pedidoDTO.itemsDTO.map((itemDTO) => {
      const producto = this.productoService.obtenerProducto(itemDTO.productoID)
      return new ItemPedido(producto, itemDTO.cantidad, itemDTO.precioUnitario)
    })

    const direEntrega = new DireccionEntrega(
      pedidoDTO.direccionEntregaDTO.calle,
      pedidoDTO.direccionEntregaDTO.altura,
      pedidoDTO.direccionEntregaDTO.piso,
      pedidoDTO.direccionEntregaDTO.departamento,
      pedidoDTO.direccionEntregaDTO.codigoPostal,
      pedidoDTO.direccionEntregaDTO.ciudad,
      pedidoDTO.direccionEntregaDTO.provincia,
      pedidoDTO.direccionEntregaDTO.pais,
      pedidoDTO.direccionEntregaDTO.latitud,
      pedidoDTO.direccionEntregaDTO.longitud,
    )

    return new Pedido(comprador, vendedor, items, pedidoDTO.moneda, direEntrega)
  }

  /************************** CONSULTAR UN PEDIDO **************************/
  consultar(id) {
    const pedido = this.pedidoRepository.findById(id)
    validarExistenciaDePedido(pedido, id)

    return pedido
  }

  /************************** CONSULTAR EL HISTORIAL DE UN USUARIO **************************/
  consultarHistorial(id) {
   // if (this.usuarioEsValido(id)) {
      const historialPedidos = this.pedidoRepository.consultarHistorial(id)
      validarExistenciaDeHistorial(historialPedidos, id)

      return historialPedidos
    //}
  }

  usuarioEsValido(id) {
    this.usuarioService.obtenerUsuario(id, [
      tipoUsuario.COMPRADOR,
      tipoUsuario.VENDEDOR,
      tipoUsuario.ADMIN,
    ])
    return true
  }

  /************************** CAMBIAR EL ESTADO DE UN PEDIDO **************************/
  cambioEstado(cambioEstado, idPedido) {
    this.usuarioEstaAutorizado(
      cambioEstado.idUsuario,
      autorizadosAEstado[cambioEstado.estado],
    )

    const pedido = this.consultar(idPedido)

    pedido.actualizarEstado(
      estado[cambioEstado.estado],
      cambioEstado.idUsuario,
      cambioEstado.motivo,
    )

    // FALTA PERSISTIR EL CAMBIO EN LA BASE DE DATOS
    // this.pedidoRepository.actualizar()

    this.notificacionService.crearSegunEstadoPedido(estado[cambioEstado.estado], pedido)

    return pedido
  }

  usuarioEsValidoCompra(id, pedido) {
    const usuario = this.usuarioService.obtenerUsuario(id, [
      tipoUsuario.COMPRADOR,
      tipoUsuario.VENDEDOR,
      tipoUsuario.ADMIN,
    ])

    return (
      pedido.comprador.id == usuario.id ||
      pedido.vendedor.id == usuario.id ||
      usuario.tipoUsuario === "Admin"
    )
  }

  usuarioEstaAutorizado(id, roles) {
    this.usuarioService.obtenerUsuario(id, roles)
    return true
  }
}

export default new PedidoService(
  PedidoRepository,
  UsuarioService,
  ProductoService,
  NotificacionService,
)
