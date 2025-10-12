import { ItemDTO } from "../models/DTO/itemDTO.js"
import { ItemPedido } from "../models/entities/itemPedido.js"

export function toItemsDTO(nuevoJSONItems) {
  const items = nuevoJSONItems.map((item) => new ItemDTO(item.producto, item.cantidad))
  return items
}

export function fromItemsDTO(itemsDTO) {
  const items = itemsDTO.map((item) => new ItemPedido(item.productoID, item.cantidad, null))
  return items
}
