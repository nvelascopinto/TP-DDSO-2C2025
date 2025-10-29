import {apiBack} from "./apiBack.js"
import { EstadoPedido } from "../../enums.js"

export async function crearPedido(user, vendedor, items, total){
    return apiBack.post('/',{
    vendedor: vendedor,
    user: user,
    body: {
        comprador: user,
        vendedor: vendedor,     items: items,
        total: total,
        moneda: "PESO_ARG",
        estadoNombre: EstadoPedido.PENDIENTE,
        direccionEntrega: "AlgunaCalle",
   },

    })
    .then((response) => {
        return response.data
    })
}


export async function cancelarPedido(id){
    return apiBack.patch('/pedidos/${id}',{
        body:{
            nuevoEstado: EstadoPedido.CANCELADO
        }
    })
    .then((response) => {
        return response.data
    })

}

export async function cambiarEstadoPedido(id, nuevoEstado) {
    return apiBack.patch('/pedidos/${id}',{
        body:{
            nuevoEstado: nuevoEstado
        }
    })
    .then((response) => {
        return response.data
    })

}