export class Notificacion {
  constructor(usuarioDestino, mensaje) {
    this.id = null
    this.usuarioDestino = usuarioDestino;
    this.mensaje = mensaje;
    this.fechaAlta = new Date();
    this.leida = false;
    this.fechaLeida = null;
  }

  marcarComoleida() {
    this.leida = true;
  }
}
