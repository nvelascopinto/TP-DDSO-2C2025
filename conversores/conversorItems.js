import { itemDTO } from "../models/DTO/itemDTO.js";
export function conversorItems(nuevoJSONItems) {
    const items = nuevoJSONItems.map(item => 
        new itemDTO(
            item.producto,
            item.cantidad,
            item.precioUnitario)
    

    );
    return items
}
