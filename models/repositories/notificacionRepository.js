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
}

export default new notificacionRepository()
