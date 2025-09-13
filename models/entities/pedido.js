
import estado from "./estadoPedido.js"
import { cambioEstadoPedido } from "./cambioEstadoPedido.js"
import { YaEnEstadoError } from "../../errors/yaEnEstadoError.js"
export class Pedido {
    constructor(comprador,vendedor, items, moneda, direccionEntrega) {
        this.id = null // inciialmente se pone en null hasta que es guardado en el Repo
        this.comprador = comprador // se debe chequear si es comprador ?
        this.vendedor = vendedor
        this.items = items
        this.total = this.calcularTotal()
        this.moneda = moneda
        this.direccionEntrega = direccionEntrega
        this.estado = estado.PENDIENTE
        this.fechaCreacion = new Date()
        this.historialPedidos = []
    }

    calcularTotal() {
       return this.items.reduce((acum, item) => acum + item.subtotal() , 0)
    }

    actualizarEstado(nuevoEstado, quien, motivo) {
        if(this.estado === nuevoEstado) {
            throw new YaEnEstadoError(nuevoEstado)
        }
        this.estado = nuevoEstadostado
        const cambio = new cambioEstadoPedido(nuevoEstado, this, quien, motivo)
        this.historialPedidos.push(cambio)
        return
    }

    validarStock() {
        return this.items.every(item => item.producto.estaDisponible(item.cantidad))
    }

}

