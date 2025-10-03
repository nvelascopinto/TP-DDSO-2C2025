import { z } from "zod"
import ProductoInexistenteError from "../errors/productoInexistenteError.js"

export const productoValidator = z.object({
  categoria: z.string(),
  titulo: z.string().min(1, "El titulo no puede estar vacío"),
  descripcion: z.string(),
  precio: z.number().nonnegative("Precio no puede ser negativo"),
  stock: z.number().positive("Stock debe ser un numero mayor a 0"),
  activo: z.boolean(),
})

export function validarExistenciaDeProducto(producto, id) {
  if(!producto) {
      throw new ProductoInexistenteError(id)
    }
}