import { UsuarioDTO } from "../models/DTO/usuarioDTO.js"
import { Usuario } from "../models/entities/usuario.js"
import { Vendedor } from "../models/entities/vendedor.js"
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
  return Promise.resolve().then(() => {
      tipoUserValidator(usuarioDTO.tipoUsuario)
      if (usuarioDTO.tipoUsuario === "Vendedor") {
    return new Vendedor(
      usuarioDTO.username,
      usuarioDTO.password,
      usuarioDTO.nombre,
      usuarioDTO.email,
      usuarioDTO.telefono,
      usuarioDTO.tipoUsuario,
      new Tienda(usuarioDTO.username, usuarioDTO.tienda.nombre, usuarioDTO.tienda.descripcion) // por cada vendedor al crear su usuario crea su tienda a la que se asocia el
    )
  }
    return new Usuario(usuarioDTO.username, usuarioDTO.password, usuarioDTO.nombre, usuarioDTO.email, usuarioDTO.telefono, usuarioDTO.tipoUsuario)
  })
  
}


