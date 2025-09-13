import { Producto } from "../models/entities/producto.js"
import { Moneda } from "../models/entities/moneda.js"

import { tipoUsuario } from "../models/entities/tipoUsuario.js"

import {z} from "zod"

const MonedaSchema = z.enum(Object.values(Moneda), {
    errorMap: () => ({ message: "La moneda ingresada no es válida" })
  })

  
export const productoSchema = z.object({
  /*vendedor: z.object({
        tipoUsuario: z.enum(Object.values(tipoUsuario))
    }),*/
  categoria : z.string(),
  moneda: MonedaSchema,
  titulo: z.string().min(1, "El titulo no puede estar vacío"),
  descripcion: z.string(),
  precio: z.number().nonnegative("Precio no puede ser negativo"),
  stock: z
    .number()
    .int("Stock debe ser un entero")
    .nonnegative("Stock no puede ser negativo"),
  activo: z.boolean().optional().default(true),
})/*.refine(obj => obj.vendedor.tipoUsuario === tipoUsuario.VENDEDOR, {
    message: "El producto solo puede ser vendido por un VENDEDOR"
})*/