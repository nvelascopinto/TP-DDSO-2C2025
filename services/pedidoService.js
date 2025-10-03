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
import itemPedidoValidator from "../validators/itemPedidoValidator.js"
import { monedaValidator } from "../validators/monedaValidator.js"
import direccionEntregaValidator from "../validators/direccionEntregaValidator.js"
import DatosInvalidosError from "../errors/datosInvalidosError.js"
import UsuarioInexistenteError from "../errors/usuarioInexistenteError.js"
import PedidoInexistenteError from "../errors/pedidoInexistenteError.js"
import PedidoStockInsuficienteError from "../errors/pedidoStockInsuficienteError.js"
import ProductoInexistenteError from "../errors/productoInexistenteError.js"
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
    const nuevoPedido = this.convertirAPedido(pedidoDTO)

    const stockValido = nuevoPedido.validarStock()

    if (stockValido === false) {
      throw new PedidoStockInsuficienteError()
    }

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
    const items = pedidoDTO.itemsDTO.map((item) => {
      const it = this.convertirAItem(item)
      return it
    })
    if (!items.every((item) => item.producto.vendedor.id === vendedor.id)) {
      throw new DatosInvalidosError(
        "Los productos del pedido deben ser todos del mismo vendedor",
      )
    }
    const moneda = monedaValidator(pedidoDTO.moneda)
    if (!moneda) {
      throw new DatosInvalidosError(
        "La moneda ingresada no esta dentro de las opciones ofrecidas",
      )
    }

    const direEntrega = this.convertirADireccion(pedidoDTO.direccionEntregaDTO)

    return new Pedido(comprador, vendedor, items, moneda, direEntrega)
  }

  convertirADireccion(direDTO) {
    const direRe = direccionEntregaValidator.safeParse(direDTO)

    if (!direRe.success) {
      throw new DatosInvalidosError(direRe.error.issues[0].message)
    }
    const direResult = direDTO
    return new DireccionEntrega(
      direResult.calle,
      direResult.altura,
      direResult.piso,
      direResult.departamento,
      direResult.codigoPostal,
      direResult.ciudad,
      direResult.provincia,
      direResult.pais,
      direResult.latitud,
      direResult.longitud,
    )
  }

  convertirAItem(itemDTO) {
    const itemResult = itemPedidoValidator.safeParse(itemDTO)
    if (!itemResult.success) {
      throw new DatosInvalidosError(itemResult.error.issues[0].message)
    }
    const producto = this.productoService.obtenerProducto(itemDTO.productoID)
    if (!producto) {
      throw new ProductoInexistenteError(itemDTO.productoID)
    }
    return new ItemPedido(producto, itemDTO.cantidad, itemDTO.precioUnitario)
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
