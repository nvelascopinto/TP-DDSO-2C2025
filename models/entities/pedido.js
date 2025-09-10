
import estado from "./estadoPedido.js"
import { cambioEstadoPedido } from "./cambioEstadoPedido.js"
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
       return this.items.reduce((acum, item) => acum + item.subtotal() , 0)
    }
    actualizarEstado(nuevoEstado, quien, motivo) {
        if(this.estado === nuevoEstado) {
            throw new Error("El producto ya esta en estado " + nuevoEstado)
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

export  const pedidoSchema =  z.object({
        
        comprador : z.object ({
            tipoUsuario : z.enum(Object.values(tipoUsuario))
        } )
        }).refine(obj => obj.vendedor.tipoUsuario === tipoUsuario.COMPRADOR, {
            message: "El pedido solo puede ser asignado a un usuario COMPRADOR"
        })
