import NotificacionRepository from "../models/repositories/notificacionRepository.js"
import { Notificacion } from "../models/entities/notificacion.js"
import { estado } from "../models/entities/estadoPedido.js"
import { notificacionExisteValidator } from "../validators/notificacionValidator.js"

export class NotificacionService {
  constructor(NotificacionRepository) {
    this.NotificacionRepository = NotificacionRepository
  }

  crearSegunPedido(pedido) {
    const mensaje = "ID NUEVO PEDIDO REALIZADO: " + pedido._id

    const notificacion = new Notificacion(pedido.vendedor, mensaje)
    // Solo retorno la promise porque no me interesa devolver la notificacion creada
    return this.NotificacionRepository.crear(notificacion)
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
    const notificacion = new Notificacion(
      destinatario,
      "El pedido " + idPedido + " cambio a estado " + estado,
    )
    return this.NotificacionRepository.crear(notificacion).then((notificacion) => notificacion)
  }

  getNotificacionesLeidas(idUsuario) {
    return this.NotificacionRepository.getNotificacionesLeidas(idUsuario).then(
      (notificacionesLeidas) => notificacionesLeidas,
    )
  }

  getNotificacionesNoLeidas(idUsuario) {
    return this.NotificacionRepository.getNotificacionesNoLeidas(idUsuario).then(
      (notificacionesNoLeidas) => notificacionesNoLeidas,
    )
  }

  getNotificacion(idNotificacion) {
    return this.NotificacionRepository.getById(idNotificacion).then(
      (notificacion) => notificacion,
    )
  }

  marcarComoLeida(idNotificacion, usuario) {
    return this.NotificacionRepository.getById(idNotificacion)
      .then((notificacion) => {
        notificacionExisteValidator(notificacion, idNotificacion)
        notificacion.marcarComoleida(usuario) //valia al marcar como leida
        return this.NotificacionRepository.update(notificacion)
      })
      .then((notificacionLeida) => notificacionLeida)
  }
}

export const notificationServiceInstance = new NotificacionService(NotificacionRepository)
