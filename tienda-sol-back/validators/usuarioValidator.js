import { z } from "zod"
import { tiendaValidator } from "./tiendaValidator.js"
export const usuarioValidator = z.object({
  username: z.string().min(1, "El username no puede estar vacio"),
  password : z.string().min(8,"La contraseña debe tener 8 digitos"),
  nombre: z.string().min(1, "El nombre no puede estar vacio"),
  email: z.email("El mail debe ser uno valido").min(1, "El mail no puede estar vacio"),
  telefono: z.string(),
  tipoUsuario: z.string(),
  tienda :  tiendaValidator.optional()
})
