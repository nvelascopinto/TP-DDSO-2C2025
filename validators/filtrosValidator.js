import { z } from "zod"
import { idValidator } from "./idValidator.js"

export const filtrosValidator = z.object({
  vendedor: idValidator,
  minPrecio: z.number().nonnegative().optional(),
  maxPrecio: z.number().nonnegative().optional(),
  pagina: z.number().nonnegative().optional(),
  limite: z.number().nonnegative().optional(),
  nombre: z.string().optional(),
  categoria: z.string().optional(),
  descripcion: z.string().optional(),
  ordenVentas: z.boolean().optional(),
  ordenMasVendios: z.boolean().optional(),
  ascendente: z.boolean().optional()
})
