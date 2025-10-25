import { ItemDTO } from "../models/DTO/itemDTO.js"
import { ItemPedido } from "../models/entities/itemPedido.js"

export function toItemsDTO(nuevoJSONItems) {
  const items = nuevoJSONItems.map((item) => new ItemDTO(item.producto, item.cantidad))
  return items
}

export function fromItemsDTO(itemsDTO, productos) {
  return itemsDTO.map((itemDTO, i) =>
    new ItemPedido(productos[i], itemDTO.cantidad)
  )
}
