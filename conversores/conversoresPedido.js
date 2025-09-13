import { conversorItems } from "./conversorItems.js";
import { Pedido } from "../models/entities/pedido.js";

export function convertJSONtoPedido (nuevoPedidoJSON) {
    return new Pedido(
                nuevoPedidoJSON.comprador,
                nuevoPedidoJSON.vendedor,
                conversorItems(nuevoPedidoJSON.items),
                nuevoPedidoJSON.moneda,
                nuevoPedidoJSON.direccionEntrega
            )
}