import NotificacionRepository from "../models/repositories/notificacionRepository.js"
import { Notificacion } from "../models/entities/notificacion.js"
import { estado } from "../models/entities/estadoPedido.js"

class notificacionService {
  constructor(notificacionRepository) {
    this.notificacionRepository = notificacionRepository
  }

  crearSegunPedido(pedido) {
    const mensaje = "ID NUEVO PEDIDO REALIZADO: " + pedido.id

    const notificacion = new Notificacion(pedido.vendedor.id, mensaje)
    return this.notificacionRepository.crear(notificacion)
              . then((notifGuardada) => notifGuardada)
  }

  crearSegunEstadoPedido(estadoActual, pedido) {
    const destinatario = null
    if (estadoActual == estado.CANCELADO) {
      destinatario = pedido.vendedor
    } else if (estadoActual == estado.ENVIADO) {
      destinatario = pedido.comprador
    } else {
      return destinatario
    }
    return this.notificarEstadoPedido(estadoActual, destinatario.id, pedido.id).then((nuevaNotificacion) => nuevaNotificacion)
  }

  notificarEstadoPedido(estado, destinatario, idPedido) {
    const notificacion = new Notificacion(
      destinatario,
      "El pedido " + idPedido + " cambio a estado " + estado,
    )
    
    return this.notificacionRepository.crear(notificacion).then((nuevaNotificacion) => nuevaNotificacion)
  }

  getNotificacionesLeidas(idUsuario) {
    return this.notificacionRepository.getNotificacionesLeidas(idUsuario).then((notificacionesLeidas) => notificacionesLeidas)
  }
  

  getNotificacionesNoLeidas(idUsuario) {
    return this.notificacionRepository.getNotificacionesNoLeidas(idUsuario).then((notificacionesNoLeidas) => notificacionesLeidas)
  }


  getNotificacion(idNotificacion) {
    return this.notificacionRepository.getById(idNotificacion).then((notificacion) => notificacion)
  }
}

export default new notificacionService(NotificacionRepository)
