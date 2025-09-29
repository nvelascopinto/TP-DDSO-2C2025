import { UsuarioDTO } from "../models/DTO/usuarioDTO.js";

export function convertJSONtoUsuario(JSONUsuario) {
  return new UsuarioDTO(
    JSONUsuario.nombre,
    JSONUsuario.email,
    JSONUsuario.telefono,
    JSONUsuario.tipoUsuario,
  );
}
