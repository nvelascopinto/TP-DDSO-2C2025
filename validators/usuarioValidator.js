import { z } from "zod"
import UsuarioInexistenteError from "../errors/usuarioInexistenteError.js"
import UsuarioSinPermisoError from "../errors/usuarioSinPermisoError.js"
export const usuarioValidator = z.object({
  username: z.string().min(1, "El username no puede estar vacío"),
  nombre: z.string().min(1, "El nombre no puede estar vacío"),
  email: z.string(),
  telefono: z.string(),
  tipoUsuario: z.string(),
})

export function rolesValidator(user, roles) {
    if(!(roles.includes(user.tipoUsuario)) ){
      throw new UsuarioSinPermisoError(user.username)
    }
}

export function validarExistenciaDeUsuario(usuario, id) {
  if (!usuario) {
    throw new UsuarioInexistenteError(id)
  }
}