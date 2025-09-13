import { no } from "zod/locales";
import { Notificacion } from "./notificacion";
export class FactoryNotification {
    crearSegunEstadoPedido(estado, destinatario, id) {
        const notificacion = new Notificacion(destinatario, "El pedido "+ id + "cambio a estado " + estado)
        return notificacion
    }
    crearSegunPedido(pedido) {

        const mensaje = "NUEVO PEDIDO RELAIZADO: /n ID: " + pedido.id +
                         "/n COMPRADOR : " + pedido.comprador +
                         "/n PRODUCTOS PEDIDOS /n : " +pedido.mostrarItems() + 
                         "/n TOTAL : "+ pedido.total +
                         "/n DIRECCION DE ENTREGA: " + pedido.direccionEntrega

        const notificacion = new Notificacion(pedido.vendedor, mensaje)

        return notificacion
    }
}