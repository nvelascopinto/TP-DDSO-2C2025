
import { estado } from "./estadoPedido.js"
import { CambioEstadoPedido } from "./cambioEstadoPedido.js"
import { YaEnEstadoError } from "../../errors/yaEnEstadoError.js"
export class Pedido {
    constructor(comprador, vendedor, items, moneda, direccionEntrega) {
        this.id = null // inciialmente se pone en null hasta que es guardado en el Repo
        this.comprador = comprador // se debe chequear si es comprador ?
        this.vendedor = vendedor
        this.items = items
        this.total = this.calcularTotal()
        this.moneda = moneda
        this.direccionEntrega = direccionEntrega
        this.estado = estado.PENDIENTE
        this.fechaCreacion = new Date()
        this.historialCambioPedidos = []
    }

    calcularTotal() {
        return this.items.reduce((acum, item) => acum + item.subtotal(), 0)
    }

    actualizarEstado(nuevoEstado, quien, motivo) {
        if (this.estado === nuevoEstado) {
            throw new YaEnEstadoError(nuevoEstado)
        }
        this.estado = nuevoEstado
        const cambio = new CambioEstadoPedido(nuevoEstado, this.id, quien, motivo)
        this.historialCambioPedidos.push(cambio)
        return
    }

    validarStock() {
        return this.items.every(item => item.producto.estaDisponible(item.cantidad))
    }

    mostrarItems() {
        return this.items.reduce((mensaje, item) => { mensaje + item.mostrarProducto + "/n" }, "")
    }

}

