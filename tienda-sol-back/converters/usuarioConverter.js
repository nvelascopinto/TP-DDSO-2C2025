import { UsuarioDTO } from "../models/DTO/usuarioDTO.js"
import { Usuario } from "../models/entities/usuario.js"
import { Vendedor } from "../models/entities/vendedor.js"
import { Tienda } from "../models/entities/tienda.js"
import { toTiendaDTO } from "./tiendaConverter.js"
export function toUsuarioDTO(JSONUsuario) {
  return new UsuarioDTO(
    JSONUsuario.username,
    JSONUsuario.nombre,
    JSONUsuario.email,
    JSONUsuario.telefono,
    JSONUsuario.tipoUsuario,
    toTiendaDTO(JSONUsuario.tienda)
  )
}

export function fromUsuarioDTO(usuarioDTO) {
  if (usuarioDTO.tipoUsuario === "Vendedor") {
    return new Vendedor(
      usuarioDTO.username,
      usuarioDTO.nombre,
      usuarioDTO.email,
      usuarioDTO.telefono,
      usuarioDTO.tipoUsuario,
      new Tienda(usuarioDTO.tienda.nombre, usuarioDTO.tienda.descripcion, usuarioDTO.tienda.logo) // por cada vendedor al crear su usuario crea su tienda a la que se asocia el
    )
  }
  return new Usuario(usuarioDTO.username, usuarioDTO.nombre, usuarioDTO.email, usuarioDTO.telefono, usuarioDTO.tipoUsuario)
}


