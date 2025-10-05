import NotificacionRepository from "../models/repositories/notificacionRepository.js"
import { Notificacion } from "../models/entities/notificacion.js"
import { estado } from "../models/entities/estadoPedido.js"

class notificacionService {

  crearSegunPedido(pedido) {
    const mensaje = "ID NUEVO PEDIDO REALIZADO: " + pedido.id

    const notificacion = new Notificacion(pedido.vendedor.id, mensaje)
    // Solo retorno la promise porque no me interesa devolver la notificacion creada
    return NotificacionRepository.crear(notificacion) 
  }

  crearSegunEstadoPedido(estadoActual, pedido) {
    let destinatario = null
    if (estadoActual == estado.CANCELADO) {
      destinatario = pedido.vendedor
    } else if (estadoActual == estado.ENVIADO) {
      destinatario = pedido.comprador
    } else {
      return destinatario
    }
    return this.notificarEstadoPedido(estadoActual, destinatario.id, pedido.id) 
  }

  notificarEstadoPedido(estado, destinatario, idPedido) {
    const notificacion = new Notificacion(destinatario, "El pedido " + idPedido + " cambio a estado " + estado,)

    return NotificacionRepository.crear(notificacion)
  }

  getNotificacionesLeidas(idUsuario) {
    return NotificacionRepository.getNotificacionesLeidas(idUsuario)
      .then((notificacionesLeidas) => notificacionesLeidas)
  }

  getNotificacionesNoLeidas(idUsuario) {
    return NotificacionRepository.getNotificacionesNoLeidas(idUsuario)
      .then((notificacionesNoLeidas) => notificacionesNoLeidas)
  }

  getNotificacion(idNotificacion) {
    return NotificacionRepository.getById(idNotificacion)
      .then((notificacion) => notificacion)
  }
}

export default new notificacionService(NotificacionRepository)
