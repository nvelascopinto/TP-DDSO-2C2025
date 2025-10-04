import PedidoService from "../services/pedidoService.js"
import { convertJSONtoPedido } from "../conversores/conversoresPedido.js"
import { pedidoValidator } from "../validators/pedidoValidator.js"
import { idValidator } from "../validators/idValidator.js"
import { cambioEstadoPedidoValidator } from "../validators/cambioEstadoPedidoValidator.js"

class PedidoController {
  constructor(pedidoService) {
    this.pedidoService = pedidoService
  }

  crear(req, res) {
    const body = pedidoValidator.parse(req.body)
    const pedido = convertJSONtoPedido(body)
    return this.pedidoService.crear(pedido).then((nuevoPedido) => {
      res.status(201).json(nuevoPedido)
    })
  }

  // cancelar(req, res) {
  //   const id = idValidator.parse(req.params.id)
  //   const cambioEstado = cambioEstadoPedidoValidator.parse(req.body)

  //   const pedidoCancelado = this.pedidoService.cancelar(cambioEstado, id)

  //   return res.status(200).json(pedidoCancelado)
  // }

  consultar(req, res) {
    const id = idValidator.parse(req.params.id)
    return this.pedidoService.consultar(id).then((pedido) => { 
      res.status(200).json(pedido)
    })
  }

  // marcarEnviado(req, res) {
  //   const id = idValidator.parse(req.params.id)
  //   const idVendedor = idValidator.parse(req.body)

  //   const pedidoEnviado = this.pedidoService.marcarEnviado(idVendedor.data.idVendedor, id)

  //   return res.status(200).json(pedidoEnviado)
  // }

  cambioEstado(req, res) {
    const id = idValidator.parse(req.params.id)
    const cambioEstado = cambioEstadoPedidoValidator.parse(req.body)

    return this.pedidoService.cambioEstado(cambioEstado, id).then((mensaje) => res.status(200).json(mensaje) )
  }
}

export default new PedidoController(PedidoService)
