export class cambioEstadoPedido {
    constructor(fecha, estado, pedido, usuario, motivo) {
        this.fecha = fecha
        this.estado = estado // chequear q sea parte del enum
        this.pedido = pedido
        this.usuario = usuario
        this.motivo = motivo
    }
}