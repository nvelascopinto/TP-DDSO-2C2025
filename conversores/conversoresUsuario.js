import { UsuarioDto } from "../models/DTO/usuarioDTO.js";

export function convertJSONtoUsuario (JSONUsuario) {
    
    console.log(JSONUsuario.nombre)
    return new UsuarioDto(
                JSONUsuario.nombre,
                JSONUsuario.email, 
                JSONUsuario.telefono ,
                JSONUsuario.tipoUsuario
                
    )
}