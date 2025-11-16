import { TiendaDTO } from "../models/DTO/tiendaDTO.js"
import { Tienda } from "../models/entities/tienda.js"

export function toTiendaDTO(tiendaJSON) {
    if (!tiendaJSON) return null

    return new TiendaDTO(
        tiendaJSON.nombre,
        tiendaJSON.descripcion
    )
}

export function fromTiendaDTO(usuarioDTO) {
    if(!usuarioDTO.tienda) return null
    
    return new Tienda(
        usuarioDTO.username,
        usuarioDTO.tienda.nombre,
        usuarioDTO.tienda.descripcion
    )
}