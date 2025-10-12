import { z } from "zod"
import ProductoInexistenteError from "../errors/productoInexistenteError.js"
// import { Usuario } from "../models/entities/usuario.js"

export const productoValidator = z.object({
  // vendedor: z.string(),
  categoria: z.string(),
  titulo: z.string().min(1, "El titulo no puede estar vacío"),
  descripcion: z.string(),
  precio: z.number().nonnegative("Precio no puede ser negativo"),
  moneda: z.string(),
  stock: z.number().positive("Stock debe ser un numero mayor a 0"),
  fotos: z.array(z.string()).optional(),
  activo: z.boolean()
})

export const cambioProductoValidator = z.object({
  precio: z.number().nonnegative("El precio no puede ser negativo").optional(),
  aumentoStock: z.number().positive("Stock debe ser un numero mayor a 0").optional(),
  activo: z.boolean().optional()
})

export function validarExistenciaDeProducto(producto, id) {
  if (!producto) {
    throw new ProductoInexistenteError(id)
  }
}
