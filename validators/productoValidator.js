import { z } from "zod"

export const productoValidator = z.object({
  categoria: z.string(),
  titulo: z.string().min(1, "El titulo no puede estar vacio"),
  descripcion: z.string(),
  precio: z.number().nonnegative("El precio no puede ser negativo"),
  moneda: z.string(),
  stock: z.number().positive("El stock debe ser un numero mayor a 0"),
  fotos: z.array(z.string()).optional(),
  activo: z.boolean()
})

export const cambioProductoValidator = z.object({
  precio: z.number().nonnegative("El precio no puede ser negativo").optional(),
  aumentoStock: z.number().positive("Stock debe ser un numero mayor a 0").optional(),
  activo: z.boolean().optional()
})
