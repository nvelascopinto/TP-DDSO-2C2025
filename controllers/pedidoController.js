import pedidoService from "../services/pedidoService.js"
import { toPedidoDTO } from "../converters/pedidoConverter.js"
import { pedidoValidator } from "../validators/pedidoValidator.js"
import { idMongoValidator } from "../validators/idValidator.js"
import { cambioEstadoPedidoValidator } from "../validators/cambioEstadoPedidoValidator.js"

class PedidoController {
  crear(req, res) {
    return Promise.resolve()
      .then(() => {
        const body = pedidoValidator.parse(req.body)
        const pedido = toPedidoDTO(body)
        const comprador = req.user
        return pedidoService.crear(pedido, comprador)
      })
      .then((nuevoPedido) => res.status(201).json(nuevoPedido))
  }

  consultar(req, res) {
    return Promise.resolve()
      .then(() => {
        const id = idMongoValidator.parse(req.params.id)
        const usuario = req.user
        return pedidoService.consultar(id, usuario)
      })
      .then((pedido) => res.status(200).json(pedido))
  }

  cambioEstado(req, res) {
    return Promise.resolve()
      .then(() => {
        const id = idMongoValidator.parse(req.params.id)
        const cambioEstado = cambioEstadoPedidoValidator.parse(req.body)
        cambioEstado.usuario = req.user
        return pedidoService.cambioEstado(cambioEstado, id)
      })
      .then((mensaje) => res.status(200).json(mensaje))
  }
}

export default new PedidoController()
