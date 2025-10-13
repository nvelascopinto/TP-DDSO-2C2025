import notificacionRepository from "../models/repositories/notificacionRepository.js"
import { Notificacion } from "../models/entities/notificacion.js"
import { estado } from "../models/entities/estadoPedido.js"
import { NotificacionInexistenteError } from "../errors/NotFoundError.js"

class NotificacionService {
  crearSegunPedido(pedido) {
    const mensaje = "ID NUEVO PEDIDO REALIZADO: " + pedido._id
    const notificacion = new Notificacion(pedido.vendedor, mensaje)
    return notificacionRepository.crear(notificacion).then((notiCreada) => notiCreada)
  }

  crearSegunEstadoPedido(estadoActual, pedido) {
    let destinatario = null
    if (estadoActual == estado.CONFIRMADO) {
      destinatario = pedido.comprador
    } else if (estadoActual == estado.CANCELADO) {
      destinatario = pedido.vendedor
    } else if (estadoActual == estado.ENVIADO) {
      destinatario = pedido.comprador
    } else {
      return destinatario
    }
    return this.notificarEstadoPedido(estadoActual, destinatario, pedido._id).then((creado) => creado)
  }

  notificarEstadoPedido(estado, destinatario, idPedido) {
    const notificacion = new Notificacion(destinatario, "El pedido " + idPedido + " cambio a estado " + estado)
    return notificacionRepository.crear(notificacion).then((notificacion) => notificacion)
  }

  getNotificacionesLeidas(idUsuario) {
    return notificacionRepository.getNotificacionesLeidas(idUsuario).then((notificacionesLeidas) => notificacionesLeidas)
  }

  getNotificacionesNoLeidas(idUsuario) {
    return notificacionRepository.getNotificacionesNoLeidas(idUsuario).then((notificacionesNoLeidas) => notificacionesNoLeidas)
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
      .then((notificacionLeida) => notificacionLeida)
  }
}

export default new NotificacionService()
