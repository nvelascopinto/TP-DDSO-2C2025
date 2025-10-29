import notificacionRepository from "../models/repositories/notificacionRepository.js"
import { Notificacion } from "../models/entities/notificacion.js"
import { NotificacionInexistenteError } from "../errors/notFoundError.js"

class NotificacionService {
  crearSegunPedido(pedido) {
    const mensaje = "ID NUEVO PEDIDO REALIZADO: " + pedido._id
    const notificacion = new Notificacion(pedido.vendedor, mensaje)
    return notificacionRepository.crear(notificacion)
  }

  crearSegunEstadoPedido(estadoActual, pedido) {
    return this.notificarEstadoPedido(estadoActual, pedido.comprador, pedido._id)
      .then(() => this.notificarEstadoPedido(estadoActual, pedido.vendedor, pedido._id))
  }

  notificarEstadoPedido(estado, destinatario, idPedido) {
    const notificacion = new Notificacion(destinatario, "El pedido " + idPedido + " cambio a estado " + estado.nombre)
    return notificacionRepository.crear(notificacion)
  }

  getNotificacionesLeidas(idUsuario) {
    return notificacionRepository.getNotificacionesLeidas(idUsuario)
  }

  getNotificacionesNoLeidas(idUsuario) {
    return notificacionRepository.getNotificacionesNoLeidas(idUsuario)
  }

  getNotificacion(idNotificacion) {
    return notificacionRepository.getById(idNotificacion).then((notificacion) => {
      if (!notificacion) throw new NotificacionInexistenteError(idNotificacion)
      return notificacion
    })
  }

  marcarComoLeida(idNotificacion, usuario) {
    return this.getNotificacion(idNotificacion)
      .then((notificacion) => {
        notificacion.marcarComoleida(usuario) //valida al marcar como leida
        return notificacionRepository.update(notificacion)
      })
  }
}

export default new NotificacionService()
