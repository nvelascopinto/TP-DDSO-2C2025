import { UsuarioDTO } from "../models/DTO/usuarioDTO.js"
import { Usuario } from "../models/entities/usuario.js"

import { Tienda } from "../models/entities/tienda.js"
import { toTiendaDTO } from "./tiendaConverter.js"
import { tipoUserValidator } from "../validators/tipoUserValidator.js"
export function toUsuarioDTO(JSONUsuario) {
  return new UsuarioDTO(
    JSONUsuario.username,
    JSONUsuario.password,
    JSONUsuario.nombre,
    JSONUsuario.email,
    JSONUsuario.telefono,
    JSONUsuario.tipoUsuario,
    toTiendaDTO(JSONUsuario.tienda)
  )
}

export function fromUsuarioDTO(usuarioDTO) {
  return Promise.resolve()
    .then(() => {
      tipoUserValidator(usuarioDTO.tipoUsuario)
      return new Usuario(
        usuarioDTO.username, 
        usuarioDTO.password, 
        usuarioDTO.nombre, 
        usuarioDTO.email, 
        usuarioDTO.telefono, 
        usuarioDTO.tipoUsuario
      )
    })
}
