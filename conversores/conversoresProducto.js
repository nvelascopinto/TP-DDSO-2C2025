import {Producto} from "../models/entities/producto.js"

export function convertJSONtoProducto (JSONProducto) {
    return new Producto(
                JSONProducto.vendedor,
                JSONProducto.titulo, 
                JSONProducto.descripcion ,
                JSONProducto.categoria,
                JSONProducto.precio ,
                JSONProducto.moneda ,
                JSONProducto.stock ,
                JSONProducto.fotos ,
                JSONProducto.activo 
            )
}