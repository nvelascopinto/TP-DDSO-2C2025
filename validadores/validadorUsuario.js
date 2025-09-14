import {z} from "zod"


export const usuarioSchema = z.object({
  nombre : z.string().min(1, "El nombre no puede estar vacío"),
  email: z.string(),
  telefono: z.string(),
})