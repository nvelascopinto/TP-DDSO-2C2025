import { z } from "zod"
import { DatosInvalidos } from "../errors/datosInvalidos.js"

export const usuarioSchema = z.object({
  nombre: z.string().min(1, "El nombre no puede estar vacío"),
  email: z.string(),
  telefono: z.string(),
})

export function validarUsuario(body) {
  const usuarioResult = usuarioSchema.safeParse(body)

  if (!usuarioResult.success) {
    throw new DatosInvalidos(usuarioResult.error.issues.map((i) => i.message))
  }

  return body
}
