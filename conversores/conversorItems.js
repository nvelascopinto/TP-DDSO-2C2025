import {itemPedido} from "../models/entities/itemPedido.js"

export function conversorItems(nuevoJSONItems) {
    return nuevoJSONItems.forEach(item =>
        new itemPedido(
            item.producto,
            item.cantidad,
            item.precioUnitario
        )
    );
}