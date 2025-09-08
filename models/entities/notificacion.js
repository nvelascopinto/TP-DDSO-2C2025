export class Notificacion {
    constructor(usuarioDestino, mensaje, fechaAlta, leida, fechaLeida) { // falta id
        this.usuarioDestino = usuarioDestino
        this.mensaje = mensaje
        this.fechaAlta = fechaAlta
        this.leida = leida
        this.fechaLeida = leida
    }

    marcarComoleida() {
        this.leida = true
    }
}