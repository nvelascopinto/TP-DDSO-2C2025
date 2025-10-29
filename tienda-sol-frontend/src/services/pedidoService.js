import {apiBack} from "./apiBack.js"
import { EstadoPedido } from "../../enums.js"

export async function crearPedido(user, moneda, items, direccionEntrega){
    return apiBack.post('/',{
    vendedor: vendedor,
    user: user,
    body: {
        items: items,
        moneda: "...",
        estadoNombre: EstadoPedido.PENDIENTE,
        direccionEntrega: "Mmmm",
   },
      headers: {
        'X-User': user,
      }

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