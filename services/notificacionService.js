import NotificacionRepository from "../models/repositories/notificacionRepository.js"
import { Notificacion } from "../models/entities/notificacion.js"
import { estado } from "../models/entities/estadoPedido.js"

class notificacionService {
  constructor(notificacionRepository) {
    this.notificacionRepository = notificacionRepository
  }

  crearSegunPedido(pedido) {
    const mensaje = "NUEVO PEDIDO REALIZADO: /n ID: " + pedido.id

    const notificacion = new Notificacion(pedido.vendedor.id, mensaje)
    this.notificacionRepository.crear(notificacion)

    return notificacion
  }

  crearSegunEstadoPedido(estadoActual, pedido) {
    if (estadoActual == estado.CANCELADO) {
      const destinatario = pedido.vendedor
      return this.notificarEstadoPedido(estadoActual, destinatario.id, pedido.id)
    } else if (estadoActual == estado.ENVIADO) {
      const destinatario = pedido.comprador
      return this.notificarEstadoPedido(estadoActual, destinatario.id, pedido.id)
    } else {
      return null
    }
  }

  notificarEstadoPedido(estado, destinatario, idPedido) {
    const notificacion = new Notificacion(
      destinatario,
      "El pedido " + idPedido + " cambio a estado " + estado,
    )
    this.notificacionRepository.crear(notificacion)
    return notificacion
  }
}

export default new notificacionService(NotificacionRepository)
