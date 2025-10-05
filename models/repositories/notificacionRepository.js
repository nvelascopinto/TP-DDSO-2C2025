import { NotificacionModel } from "../schemas/notificacionSchema.js"

class notificacionRepository {
  constructor() {
    this.model = NotificacionModel
  }

  crear(notificacion) {
    const nuevaNotificacion = new this.model(notificacion)
    return nuevaNotificacion.save()
  }

  getNotificacionesLeidas(idUsuario) {
    return this.model.find({ usuarioDestino: idUsuario, leida: true })
  }

  getNotificacionesNoLeidas(idUsuario) {
    return this.model.find({ usuarioDestino: idUsuario, leida: false })
  }

  getById(idNotificacion) {
    return this.model.findById(idNotificacion)
  }
}

export default new notificacionRepository()
