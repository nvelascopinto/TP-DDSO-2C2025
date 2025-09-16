export class CambioEstadoPedido {
    constructor(estado, pedido, usuario, motivo) {
        this.fecha = new Date() // suponemos que se crea cuando se hace cambio
        this.estado = estado // chequear q sea parte del enum
        this.pedido = pedido
        this.usuario = usuario
        this.motivo = motivo
    }
}