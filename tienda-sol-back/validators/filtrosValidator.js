import { z } from "zod"

export const filtrosValidator = z.object({
  minPrecio: z.string().optional()
    .transform(val => val ? parseFloat(val) : undefined),
  maxPrecio: z.string().optional()
    .transform(val => val ? parseFloat(val) : undefined),
  pagina: z.string().optional()
    .transform(val => val ? parseInt(val) : 1),
  limite: z.string().optional()
    .transform(val => val ? parseInt(val) : 5),
  titulo: z.string().optional(),
  categoria: z.string().optional(),
  descripcion: z.string().optional(),
  orden: z.string().optional(),
  active : z.string().optional()
})