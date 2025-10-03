export class Usuario {
  constructor(nombre, email, telefono, tipoUsuario) {
    this.id = null
    this.nombre = nombre
    this.email = email
    this.telefono = telefono
    this.tipoUsuario = tipoUsuario
    this.fechaAlta = new Date()
  }

  agregarNotificacion(notificacion) {
    this.notificaciones.push(notificacion)
  }
}
