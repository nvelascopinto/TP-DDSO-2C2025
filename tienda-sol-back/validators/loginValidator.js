import { z } from "zod"
export const loginValidator = z.object({
  username: z.string().min(1, "El username no puede estar vacio"),
  password: z.string().min(1, "La contraseña no puede estar vacio"),
})
