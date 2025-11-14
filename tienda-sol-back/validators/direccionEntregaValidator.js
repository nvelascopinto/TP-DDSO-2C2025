import { z } from "zod"

export const direccionEntregaValidator = z.object({
  calle: z.string(),
  altura: z.coerce.number(),
  piso: z.coerce.number().optional(),
  departamento: z.string().optional(),
  codigoPostal: z.coerce.number(),
  ciudad: z.string(),
  provincia: z.string(),
  pais: z.string()
})
