import PedidoService from "../services/pedidoService.js"
import { convertJSONtoPedido } from "../conversores/conversoresPedido.js"
import { pedidoValidator } from "../validators/pedidoValidator.js"
import {idValidator} from "../validators/idValidator.js"
import {cambioEstadoPedidoValidator} from "../validators/cambioEstadoPedidoValidator.js"

class PedidoController {
  constructor(pedidoService) {
    this.pedidoService = pedidoService
  }

  crear(req, res) {
    const body = pedidoValidator.parse(req.body)

    const pedido = convertJSONtoPedido(body) // Convierte a DTO para pasarselo al service
    console.log("ItemsDTO convertidos:", pedido.itemsDTO)

    const nuevoPedido = this.pedidoService.crear(pedido)

    return res.status(201).json(nuevoPedido)
  }

  cancelar(req, res) {
    const id = idValidator.parse(req.params.id)
    const cambioEstado = cambioEstadoPedidoValidator.parse(req.body)

    const pedidoCancelado = this.pedidoService.cancelar(cambioEstado, id)

    return res.status(200).json(pedidoCancelado)
  }

  consultar(req, res) {
    const id = idValidator.parse(req.params.id)

    const pedido = this.pedidoService.consultar(id)

    return res.status(200).json(pedido)
  }

  marcarEnviado(req, res) {
    const id = idValidator.parse(req.params.id)
    const idVendedor = idValidator.parse(req.body)

    const pedidoEnviado = this.pedidoService.marcarEnviado(idVendedor.data.idVendedor, id)

    return res.status(200).json(pedidoEnviado)
  }

  cambioEstado(req, res) {
    const id = idValidator.parse(req.params.id)
    const cambioEstado = cambioEstadoPedidoValidator.parse(req.body)

    const pedidoModificado = this.pedidoService.cambioEstado(cambioEstado, id)

    return res.status(200).json(pedidoModificado)
  }
}

export default new PedidoController(PedidoService)
