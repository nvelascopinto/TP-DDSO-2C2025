import PedidoRepository from "../models/repositories/pedidoRepository.js"
import UsuarioService from "./usuarioService.js"
import ProductoService from "./productoService.js"
import NotificacionService from "./notificacionService.js"
import { autorizadosAEstado, estado } from "../models/entities/estadoPedido.js"
import { ordenEstados } from "../models/entities/estadoPedido.js"
import { Pedido } from "../models/entities/pedido.js"
import { DireccionEntrega } from "../models/entities/direccionEntrega.js"
import { tipoUsuario } from "../models/entities/tipoUsuario.js"
import { ItemPedido } from "../models/entities/itemPedido.js"
import { validarMoneda } from "../validators/monedaValidator.js"
import { validarItemsConVendedor } from "../validators/itemPedidoValidator.js"
import UsuarioInexistenteError from "../errors/usuarioInexistenteError.js"
import PedidoInexistenteError from "../errors/pedidoInexistenteError.js"
import CambioEstadoInvalidoError from "../errors/cambioEstadoInvalidoError.js"
import YaEnEstadoError from "../errors/yaEnEstadoError.js"
import HistorialInexistenteError from "../errors/historialInexistenteError.js"
class PedidoService {
  constructor(pedidoRepository, usuarioService, productoService, notificacionService) {
    this.pedidoRepository = pedidoRepository
    this.usuarioService = usuarioService
    this.productoService = productoService
    this.notificacionService = notificacionService
  }

  crear(pedidoDTO) {
    const nuevoPedido = this.convertirAPedido(pedidoDTO) // Lo convierto a una entidad de mi negocio

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
      console.log("ItemDTO.productoID:", itemDTO.productoID)
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

    validarItemsConVendedor(items, vendedor.id)
    validarMoneda(pedidoDTO.moneda)

    return new Pedido(comprador, vendedor, items, pedidoDTO.moneda, direEntrega)
  }

  consultar(id) {
    const pedido = this.pedidoRepository.findById(id)
    if (pedido == null) {
      throw new PedidoInexistenteError(id)
    }

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
  usuarioEsValido(id) {
    this.usuarioService.obtenerUsuario(id, [
      tipoUsuario.COMPRADOR,
      tipoUsuario.VENDEDOR,
      tipoUsuario.ADMIN,
    ])
    return true
  }

  usuarioEstaAutorizado(id, roles) {
    const usuario = this.usuarioService.obtenerUsuario(id, roles)
    if (usuario == null) {
      throw new UsuarioInexistenteError(id)
    }
    return true
  }

  consultarHistorial(id) {
    if (this.usuarioEsValido(id)) {
      const historialPedidos = this.pedidoRepository.consultarHistorial(id)
      if (historialPedidos.length == 0) {
        throw new HistorialInexistenteError(id)
      }
      return historialPedidos
    }
  }

  esValidoCambioEstado(nuevoEstado, estadoActual) {
    const indiceEstadoActual = ordenEstados.indexOf(estadoActual)
    const indiceEstadoNuevo = ordenEstados.indexOf(nuevoEstado)

    if (indiceEstadoNuevo == indiceEstadoActual) {
      throw new YaEnEstadoError(nuevoEstado)
    }
    if (indiceEstadoNuevo < indiceEstadoActual || estadoActual == estado.CANCELADO) {
      throw new CambioEstadoInvalidoError(estadoActual, nuevoEstado)
    }
    return true
  }

  cambioEstado(cambioEstado, idPedido) {
    this.usuarioEstaAutorizado(
      cambioEstado.idUsuario,
      autorizadosAEstado[cambioEstado.estado],
    )
    const pedido = this.consultar(idPedido)
    this.esValidoCambioEstado(estado[cambioEstado.estado], pedido.estado)
    pedido.actualizarEstado(
      estado[cambioEstado.estado],
      cambioEstado.idUsuario,
      cambioEstado.motivo,
    )
    this.notificacionService.crearSegunEstadoPedido(estado[cambioEstado.estado], pedido)

    return pedido
  }
}

export default new PedidoService(
  PedidoRepository,
  UsuarioService,
  ProductoService,
  NotificacionService,
)
