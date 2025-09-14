import { Producto } from "../models/entities/producto.js"
import { Moneda } from "../models/entities/moneda.js"

import { tipoUsuario } from "../models/entities/tipoUsuario.js"

import {z} from "zod"


export const productoSchema = z.object({
  categoria : z.string(),
  titulo: z.string().min(1, "El titulo no puede estar vacío"),
  descripcion: z.string(),
  precio: z.number().nonnegative("Precio no puede ser negativo"),
  stock: z
    .number()
    .int("Stock debe ser un entero")
    .nonnegative("Stock no puede ser negativo"),
  activo: z.boolean(),
})