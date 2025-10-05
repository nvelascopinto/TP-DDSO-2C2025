import { UsuarioDTO } from "../models/DTO/usuarioDTO.js"
import { Usuario } from "../models/entities/usuario.js"

export function toUsuarioDTO(JSONUsuario) {
  return new UsuarioDTO(
    JSONUsuario.username,
    JSONUsuario.nombre,
    JSONUsuario.email,
    JSONUsuario.telefono,
    JSONUsuario.tipoUsuario,
  )
}

export function fromUsuarioDTO(usuarioDTO) {
  return new Usuario(
    usuarioDTO.username,
    usuarioDTO.nombre,
    usuarioDTO.email,
    usuarioDTO.telefono,
    usuarioDTO.tipoUsuario,
  )
}
