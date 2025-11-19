import notificacionRepository from "../models/repositories/notificacionRepository.js"
import { Notificacion } from "../models/entities/notificacion.js"
import { NotificacionInexistenteError } from "../errors/notFoundError.js"

class NotificacionService {
  crearSegunPedido(pedido) {
    return this.notificarCreacionPedido(pedido.vendedor, pedido)
          .then(() => this.notificarCreacionPedido(pedido.comprador, pedido))
  }
  notificarCreacionPedido(destinatario, pedido) {
    const mensaje = "Un nuevo pedido fue realizado: #" + pedido.numero
    const notificacion = new Notificacion(destinatario, mensaje, pedido.numero)
    return notificacionRepository.crear(notificacion)
  }
  crearSegunEstadoPedido(estadoActual, pedido) {
    return this.notificarEstadoPedido(estadoActual, pedido.comprador, pedido.numero)
      .then(() => this.notificarEstadoPedido(estadoActual, pedido.vendedor, pedido.numero))
  }

  notificarEstadoPedido(estado, destinatario, numero) {
    const notificacion = new Notificacion(destinatario, "El pedido # " + numero + " cambio a estado " + estado, numero)
    return notificacionRepository.crear(notificacion)
  }

  getNotificacionesLeidas(idUsuario) {
    return notificacionRepository.getNotificacionesLeidas(idUsuario)
  }

  getNotificacionesNoLeidas(idUsuario) {
    return notificacionRepository.getNotificacionesNoLeidas(idUsuario)
  }

  getNotificaciones(idUsuario) {
    return notificacionRepository.getNotificaciones(idUsuario)
  }

  getNotificacion(idNotificacion) {
    return notificacionRepository.getById(idNotificacion).then((notificacion) => {
      if (!notificacion) throw new NotificacionInexistenteError(idNotificacion)
      return notificacion
    })
  }

  marcarComoLeida(idNotificacion, idUsuario) {
    return this.getNotificacion(idNotificacion)
      .then((notificacion) => {
        notificacion.marcarComoleida(idUsuario) //valida al marcar como leida
        return notificacionRepository.update(notificacion)
      })
  }
}

export default new NotificacionService()
