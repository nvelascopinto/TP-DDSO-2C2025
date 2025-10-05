import { z } from "zod"
import UsuarioInexistenteError from "../errors/usuarioInexistenteError.js"

export const usuarioValidator = z.object({
  username: z.string().min(1, "El username no puede estar vacío"),
  nombre: z.string().min(1, "El nombre no puede estar vacío"),
  email: z.string(),
  telefono: z.string(),
  tipoUsuario: z.string(),
})

export function validarExistenciaDeUsuario(usuario, id) {
  if (!usuario) {
    throw new UsuarioInexistenteError(id)
  }
}