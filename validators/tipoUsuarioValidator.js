import { tipoUsuario } from "../models/entities/tipoUsuario.js"

export function tipoUsuarioValidator(tipoUser) {
  if (!Object.values(tipoUsuario).includes(tipoUser)) {
    return null
  }
  return tipoUser
}
