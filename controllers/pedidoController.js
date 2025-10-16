import pedidoService from "../services/pedidoService.js"
import { toPedidoDTO } from "../converters/pedidoConverter.js"
import { pedidoValidator } from "../validators/pedidoValidator.js"
import { idMongoValidator } from "../validators/idValidator.js"
import { cambioEstadoPedidoValidator } from "../validators/cambioEstadoPedidoValidator.js"
import { ZodValidationError } from "../errors/validationError.js"

class PedidoController {
  crear(req, res) {
    return Promise.resolve()
      .then(() => 
        pedidoValidator.parse(req.body)
      ) 
      .catch((e) => {
        throw new ZodValidationError(e)
      })
      .then((bodyPedido) => {
        const pedido = toPedidoDTO(bodyPedido)
        const comprador = req.user
        return pedidoService.crear(pedido, comprador)
      })
      .then((nuevoPedido) => 
        res.status(201).json(nuevoPedido)
      )
  }

  consultar(req, res) {
    return Promise.resolve()
      .then(() => 
        idMongoValidator.parse(req.params.id)
      )
      .catch((e) => {
        throw new ZodValidationError(e)
      })
      .then((idPedido) => 
        pedidoService.consultar(idPedido, req.user)
      )
      .then((pedidoBuscado) => 
        res.status(200).json(pedidoBuscado)
      )
  }

  cambioEstado(req, res) {
    return Promise.resolve()
      .then(() => {
        const idPedido = idMongoValidator.parse(req.params.id)
        const cambioEstado = cambioEstadoPedidoValidator.parse(req.body)
        return { idPedido, cambioEstado }
      })
      .catch((e) => {
        throw new ZodValidationError(e)
      })
      .then(({ idPedido, cambioEstado }) => {
        cambioEstado.usuario = req.user
        return pedidoService.cambioEstado(cambioEstado, idPedido)
      })
      .then((mensaje) => res.status(200).json(mensaje))
  }
}

export default new PedidoController()
