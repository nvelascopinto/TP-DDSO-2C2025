import { z } from "zod"

const direccionEntregaValidator = z.object({
  calle: z.string(),
  altura: z.number(),
  piso: z.number().nullable(),
  departamento: z.string().nullable(),
  codigoPostal: z.number(),
  ciudad: z.string(),
  provincia: z.string(),
  pais: z.string(),
  latitud: z.number(),
  longitud: z.number(),
})

export default direccionEntregaValidator
