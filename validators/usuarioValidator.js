import { z } from "zod"

export const usuarioValidator = z.object({
  nombre: z.string().min(1, "El nombre no puede estar vacío"),
  email: z.string(),
  telefono: z.string(),
  tipoUsuario: z.string(),
})
