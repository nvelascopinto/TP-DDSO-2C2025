import { Pedido } from "../models/entities/pedido";

export function convertJSONtoPedido (JSONPedido) {
    return new Pedido(
                nuevoPedidoJSON.comprador,
                nuevoPedidoJSON.vendedor,
                nuevoPedidoJSON.items,
                nuevoPedidoJSON.moneda,
                nuevoPedidoJSON.direccionEntrega
            )
}