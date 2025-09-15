import { conversorItems } from "./conversorItems.js";
import { PedidoDTO } from "../models/DTO/pedidosDTO.js";
import { direccionEntregaDTO } from "../models/DTO/direccionEntregaDTO.js";

export function convertJSONtoPedido (nuevoPedidoJSON) {

    
    return new PedidoDTO(
                nuevoPedidoJSON.comprador,
                nuevoPedidoJSON.vendedor,
                conversorItems(nuevoPedidoJSON.items),
                nuevoPedidoJSON.moneda,
                convertJSONtoDireccionEntrega(nuevoPedidoJSON.direccionEntrega)
            )
}


export function convertJSONtoDireccionEntrega(direccionJSON) {
    return new direccionEntregaDTO(
            direccionJSON.calle,
            direccionJSON.altura,
            direccionJSON.piso, 
            direccionJSON.departamento ,
            direccionJSON.codigoPostal ,
            direccionJSON.ciudad ,
            direccionJSON.provincia ,
            direccionJSON.pais,
            direccionJSON.latitud ,
            direccionJSON.longitud
    )
}