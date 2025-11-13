import { tiendaDTO } from "../models/DTO/tiendaDTO.js"
export function toTiendaDTO(tienda) {
    if (!tienda) {
        return null
    }

    return new tiendaDTO(
        tienda.nombre,
        tienda.descripcion,
    )
}
