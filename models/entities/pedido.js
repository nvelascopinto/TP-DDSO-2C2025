
import estado from "./estadoPedido.js"
export class Pedido {
    constructor(comprador, items, total, moneda, direccionEntrega) {
        //this.id = como se asiga
        this.comprador = comprador //chequear
        this.items = items
        this.total = this.calcularTotal()
        this.moneda = moneda
        this.direccionEntrega = direccionEntrega
        this.estado = estado.PENDIENTE
        this.fechaCreacion = new Date()
        this.historialPedidos = []

    }

    calcularTotal() {
        // hacer calcular total
        return 0
    }
    actualizarEstado(nuevoEstado, quien, motivo) {
        return
    }

    validarStock() {

        return true
    }

}
