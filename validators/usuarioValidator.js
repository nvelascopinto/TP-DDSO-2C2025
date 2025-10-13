import { z } from "zod"

export const usuarioValidator = z.object({
  username: z.string().min(1, "El username no puede estar vacío"),
  nombre: z.string().min(1, "El nombre no puede estar vacío"),
  email: z.string(),
  telefono: z.string(),
  tipoUsuario: z.string()
})
