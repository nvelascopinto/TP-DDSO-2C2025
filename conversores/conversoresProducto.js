import { ProductoDTO } from "../models/DTO/productoDTO.js";

export function convertJSONtoProducto(JSONProducto) {
  return new ProductoDTO(
    JSONProducto.vendedor,
    JSONProducto.titulo,
    JSONProducto.descripcion,
    JSONProducto.categoria,
    JSONProducto.precio,
    JSONProducto.moneda,
    JSONProducto.stock,
    JSONProducto.fotos,
    JSONProducto.activo,
  );
}
