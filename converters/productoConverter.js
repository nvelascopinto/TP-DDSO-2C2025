import { ProductoDTO } from "../models/DTO/productoDTO.js"
import { Producto } from "../models/entities/producto.js"

export function toProductoDTO(JSONProducto) {
  return new ProductoDTO(
    JSONProducto.vendedor,
    JSONProducto.titulo,
    JSONProducto.descripcion,
    JSONProducto.categoria,
    JSONProducto.precio,
    JSONProducto.moneda,
    JSONProducto.stock,
    JSONProducto.fotos,
    JSONProducto.activo
  )
}

export function fromProductoDTO(productoDTO) {
  return new Producto(
    productoDTO.vendedorID,
    productoDTO.titulo,
    productoDTO.descripcion,
    productoDTO.categoria,
    productoDTO.precio,
    productoDTO.moneda,
    productoDTO.stock,
    productoDTO.fotos,
    productoDTO.activo
  )
}
