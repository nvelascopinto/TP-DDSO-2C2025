import { UsuarioDto } from "../models/DTO/usuarioDTO.js"

export function convertJSONtoUsuario (JSONUsuario) {
    
   
    return new UsuarioDto(
                JSONUsuario.nombre,
                JSONUsuario.email, 
                JSONUsuario.telefono ,
                JSONUsuario.tipoUsuario
                
    )
}