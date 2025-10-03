class notificacionRepository {
  constructor() {
    this.notificaciones = []
    this.nextId = 1
  }

  crear(notificacion) {
    notificacion.id = this.nextId++
    this.notificaciones.push(notificacion)
    return notificacion
  }

  getNotificacionesLeidas(idUsuario) {
    return this.notificaciones.filter(
      (notificacion) =>
        notificacion.idUsuario === parseInt(idUsuario) && notificacion.leida
    )
  }

  getNotificacionesNoLeidas(idUsuario) {
    return this.notificaciones.filter(
      (notificacion) =>
        notificacion.idUsuario === parseInt(idUsuario) && !notificacion.leida
    )
  }

  getById(idNotificacion){
    return this.notificaciones.find((notif) => notif.id === id) || null
  }
}

export default new notificacionRepository()
