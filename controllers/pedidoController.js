import PedidoService from "../services/pedidoService.js"
import { convertJSONtoPedido } from "../conversores/conversoresPedido.js"
import { validarId } from "../validadores/validadorID.js"
import { validarCambioEstado } from "../validadores/validadorCambioEstado.js"

class PedidoController {
  constructor(pedidoService) {
    this.pedidoService = pedidoService
  }

  crear(req, res) {
    const body = req.body
    const pedido = convertJSONtoPedido(body)
    const nuevoPedido = this.pedidoService.crear(pedido)

    return res.status(201).json(nuevoPedido)
  }

  cancelar(req, res) {
    const id = validarId(req.params.id)
    const cambioEstado = validarCambioEstado(req.body)
    const pedidoCancelado = this.pedidoService.cancelar(cambioEstado, id)

    res.status(200).json(pedidoCancelado)
    return
  }

  consultar(req, res) {
    const id = validarId(req.params.id)

    const pedido = this.pedidoService.consultar(id)

    res.status(200).json(pedido)
  }

  marcarEnviado(req, res) {
    const id = validarId(req.params.id)
    const idVendedor = validarId(req.body)

    const pedidoEnviado = this.pedidoService.marcarEnviado(idVendedor.data.idVendedor, id)

    res.status(200).json(pedidoEnviado)
    return
  }

  cambioEstado(req, res) {
    const id = validarId(req.params.id)
    const cambioEstado = validarCambioEstado(req.body)
    const pedidoModificado = this.pedidoService.cambioEstado(cambioEstado, id)

    res.status(200).json(pedidoModificado)
    return
  }
}

export default new PedidoController(PedidoService)
