//import { no } from "zod/locales";
import { Notificacion } from "./notificacion.js";
import { estado } from "./estadoPedido.js";
export class FactoryNotification {
  notificarEstadoPedido(estadoActual, pedido) {
    if (estadoActual == estado.CANCELADO) {
      const destinatario = pedido.vendedor;
      return this.crearSegunEstadoPedido(
        estadoActual,
        destinatario.id,
        pedido.id,
      );
    } else if (estadoActual == estado.ENVIADO) {
      const destinatario = pedido.comprador;
      return this.crearSegunEstadoPedido(
        estadoActual,
        destinatario.id,
        pedido.id,
      );
    } else {
      return null;
    }
  }

  crearSegunEstadoPedido(estado, destinatario, idPedido) {
    const notificacion = new Notificacion(
      destinatario,
      "El pedido " + idPedido + " cambio a estado " + estado,
    );
    return notificacion;
  }

  crearSegunPedido(pedido) {
    const mensaje =
      "NUEVO PEDIDO RELAIZADO: /n ID: " +
      pedido.id +
      "/n COMPRADOR : " +
      pedido.comprador +
      "/n PRODUCTOS PEDIDOS /n : " +
      pedido.mostrarItems() +
      "/n TOTAL : " +
      pedido.total +
      "/n DIRECCION DE ENTREGA: " +
      pedido.direccionEntrega;

    const notificacion = new Notificacion(pedido.vendedor.id, mensaje);

    return notificacion;
  }
}
