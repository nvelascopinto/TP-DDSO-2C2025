import { ItemDTO } from "../models/DTO/itemDTO.js"

export function convertJSONtoItems(nuevoJSONItems) {
  const items = nuevoJSONItems.map(
    (item) => new ItemDTO(item.producto, item.cantidad, item.precioUnitario),
  )
  return items
}
