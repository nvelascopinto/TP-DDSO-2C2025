import { toItemsDTO } from "./itemsConverter.js"
import { toDireccionDTO } from "./direccionConverter.js"
import { fromItemsDTO } from "./itemsConverter.js"
import { fromDireccionDTO } from "./direccionConverter.js"
import { PedidoDTO } from "../models/DTO/pedidosDTO.js"
import { Pedido } from "../models/entities/pedido.js"

export function toPedidoDTO(nuevoPedidoJSON) {
  return new PedidoDTO(
    nuevoPedidoJSON.comprador,
    nuevoPedidoJSON.vendedor,
    toItemsDTO(nuevoPedidoJSON.items),
    nuevoPedidoJSON.moneda,
    toDireccionDTO(nuevoPedidoJSON.direccionEntrega),
  )
}

export function fromPedidoDTO(pedidoDTO) {
  return new Pedido(
    pedidoDTO.compradorID,
    pedidoDTO.vendedorID,
    fromItemsDTO(pedidoDTO.itemsDTO),
    pedidoDTO.moneda,
    fromDireccionDTO(pedidoDTO.direccionEntregaDTO),
  )
}